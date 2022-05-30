<style lang="scss">
@import '../style';
</style>
<template>
    <article class="app-container tool-edit-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="editQuery.source === 'FACE' ? $t('活动设置') : $t('报名设置')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item
                        :label="editQuery.source === 'FACE' ? $t('活动开始时间') :$t('报名开始时间') + '：'"
                        class="required"
                        prop="startTime"
                    >
                        <veln-datetime
                            v-model="editQuery.startTime"
                            :min-datetime="minDatetime"
                            :max-datetime="maxDatetime"
                        />
                    </el-form-item>
                    <el-form-item
                        :label="editQuery.source === 'FACE' ? $t('活动结束时间') :$t('报名结束时间') + '：'"
                        class="required"
                        prop="endTime"
                    >
                        <veln-datetime
                            v-model="editQuery.endTime"
                            :min-datetime="minDatetime"
                            :max-datetime="maxDatetime"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('名额限制') + '：'" prop="limitNumber">
                        <el-input-number
                            v-model="editQuery.limitNumber"
                            :precision="0"
                            :step="10"
                            :min="1"
                            :max="10000"
                            :placeholder="$t('名额限制')"
                        />
                        {{ $t('人') }}
                    </el-form-item>
                    <el-form-item :label="$t('审核设置') + '：'" prop="approveType">
                        <el-radio v-model="editQuery.approveType" label="NO_NEED">{{ $t('无需审核') }}</el-radio>
                        <el-radio v-model="editQuery.approveType" label="MANUALLY">{{ $t('手动审核') }}</el-radio>
                    </el-form-item>
                    <el-form-item v-if="!editQuery.sourceId" :label="$t('提醒方式') + '：'">
                        <el-checkbox-group v-model="remindType">
                            <el-checkbox
                                v-for="item in reminder.arr"
                                :key="item.code"
                                :label="item.code"
                            >{{ $t(item.name) }}</el-checkbox>
                        </el-checkbox-group>
                        <div class="tool__tip">{{ $t('即将到达报名截止时间、报名审核结果发布') }}</div>
                    </el-form-item>
                    <stu-info-setting ref="stuInfo" :key="key" :form-list="editQuery.formList"/>
                </section>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button @click="last">{{ $t('上一步') }}</el-button>
                <el-button
                    type="primary"
                    @click="sure"
                >{{ editQuery.source === 'FACE' ? $t('完成') : $t('下一步') }}</el-button>
            </section>
        </el-form>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import VelnFormSection from '@/components/VelnFormSection';
    import StuInfoSetting from './components/StuInfoSetting';
    import {settingInfoEdit, getInfoById} from '@/api/signUp';
    import {REMINDER_ENUM} from '@/enum';
    import moment from 'moment';
    import {getInfoTime} from '@/api/faceCourse';

    export default {
        name: 'SignUpSetting',
        components: {
            VelnSteps,
            VelnFormSection,
            StuInfoSetting
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('报名设置'),
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: true
                }
            ];
            const validateStartTime = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('请输入开始时间')));
                } else if (moment(value).isBefore(moment())) {
                    callback(new Error(this.$t('开始时间不能早于当前时间')));
                } else {
                    if (this.editQuery.endTime !== '') {
                        this.$refs.editQuery.validateField('endTime');
                    }
                    callback();
                }
            };
            const validateEndTime = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('请输入结束时间')));
                } else if (moment(value).isBefore(this.editQuery.startTime)) {
                    callback(new Error(this.$t('结束时间不能早于开始时间')));
                } else {
                    callback();
                }
            };
            return {
                reminder: REMINDER_ENUM,
                steps,
                active: 1,
                defaultTime: [],
                editQuery: {
                    id: this.$route.query.id,
                    startTime: '',
                    endTime: '',
                    approveType: 'NO_NEED',
                    limitNumber: '',
                    remindType: '',
                    formList: [],
                    sourceId: this.$route.query.sourceId, // 面授课程--活动
                    source: 'COMMON', // 面授课程--活动
                    finish: false
                },
                remindType: [],
                rules: {
                    startTime: [
                        {validator: validateStartTime, trigger: 'change'}
                    ],
                    endTime: [{validator: validateEndTime, trigger: 'change'}],
                    limitNumber: [
                        {
                            required: true,
                            message: this.$t('请输入名额限制'),
                            trigger: 'blur'
                        },
                        {type: 'number', message: this.$t('名额限制必须为数字值')}
                    ],
                    check: [
                        {
                            required: true,
                            message: this.$t('请选择审核设置'),
                            trigger: 'change'
                        }
                    ]
                },
                minDatetime: this.getNow(),
                maxDatetime: null,
                key: null
            };
        },
        created() {
            this.init();
            if (this.$route.query.sourceId) {
                const params = {id: this.$route.query.sourceId};
                getInfoTime(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.minDatetime = result.data.startTime;
                        this.maxDatetime = result.data.endTime;
                    } else {
                        this.minDatetime = this.getNow();
                        this.maxDatetime = this.getNow();
                    }
                });
            }
        },
        methods: {
            getNow() {
                return moment().format('YYYY-MM-DD HH:mm');
            },
            init() {
                this.editQuery.source = this.$route.query.source;
                if (this.editQuery.source === 'FACE') {
                    this.steps.pop();
                    this.editQuery.finish = true;
                    this.steps[1].title = this.$t('活动设置');
                }
                if (this.$route.query.id) {
                    this.getInfoById(this.$route.query.id);
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                }
                this.defaultTime = [
                    moment().format('HH:mm:ss'),
                    moment().format('HH:mm:ss')
                ];
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.last();
                        break;
                    case 2:
                        this.next();
                        break;
                }
            },
            cancel() {
                const source = this.$route.query.source;
                const sourceId = this.$route.query.sourceId;
                if (source === 'FACE') {
                    // 返回面授添加互动页面
                    if (this.$route.query.quick) {
                        this.$router.push({
                            name: 'quickInteraction',
                            query: {id: sourceId}
                        });
                    } else {
                        this.$router.push({
                            name: 'courseInteraction',
                            query: {id: sourceId}
                        });
                    }
                    return;
                } else if (source === 'FACE_ENROLL') {
                    // 返回面授参与人员页面
                    this.$router.push({
                        name: 'courseParticipants',
                        query: {id: this.$route.query.sourceId}
                    });
                    return;
                } else if (source === 'FACE_ENROLL_DETAIL') {
                    // 返回面授参与人员页面-详情页
                    this.$router.push({
                        name: 'faceCourseDetail',
                        query: {
                            id: sourceId,
                            activeName: this.$route.query.activeName
                        }
                    });
                    return;
                }
                this.$router.push({name: 'signUp'});
            },
            last() {
                let name = 'basicInfo';
                if (this.editQuery.source === 'FACE') {
                    name = 'faceBasicInfo';
                }
                this.$router.push({
                    name,
                    query: {
                        id: this.editQuery.id,
                        sourceId: this.$route.query.sourceId,
                        source: this.$route.query.source,
                        activeName: this.$route.query.activeName
                    }
                });
            },
            next() {
                this.$router.push({
                    name: 'signUpParticipants',
                    query: {
                        id: this.$route.query.id,
                        sourceId: this.$route.query.sourceId,
                        source: this.$route.query.source,
                        activeName: this.$route.query.activeName
                    }
                });
            },
            sure() {
                this.editQuery.remindType = this.remindType.join(',');
                this.editQuery.formList = this.$refs.stuInfo.stuInfoList;
                if (this.editQuery.source === 'FACE') {
                    this.editQuery.finish = true;
                }
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        settingInfoEdit(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                // 返回面授添加互动页面
                                if (this.editQuery.source === 'FACE') {
                                    this.cancel();
                                    return;
                                }
                                this.next();
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                            this.dialogVisible = false;
                        });
                    }
                });
            },
            // 编辑回显
            getInfoById(id) {
                const params = {id};
                getInfoById(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        const {userFormList, remindType} = result.data;
                        this.remindType = remindType ? remindType.split(',') : [];
                        this.editQuery.formList = userFormList || [];
                        this.editQuery.sourceId = this.$route.query.sourceId;
                        this.key = +new Date();
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
