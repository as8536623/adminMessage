<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="project__apply aside__padding">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('添加报名')" :can-expand="false">
                <el-form-item
                    class="required"
                    :label="$t('报名标题') + '：'"
                    prop="name"
                >
                    <el-input
                        v-model.trim="editQuery.name"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50位')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item class="required" :label="$t('报名开始时间') + '：'" prop="startTime">
                    <el-date-picker
                        v-model="editQuery.startTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions"
                        @change="startTimeChange"
                    />
                </el-form-item>
                <el-form-item class="required" :label="$t('报名结束时间') + '：'" prop="endTime">
                    <el-date-picker
                        v-model="editQuery.endTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions"
                        @change="endTimeChange"
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
                <customer-field ref="customerField" :key="key" :form-list="editQuery.formList"/>
                <el-form-item>
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="next">{{ $t('下一步') }}</el-button>
                </el-form-item>
            </veln-form-section>
        </el-form>
    </div>
</template>

<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import CustomerField from '@/components/CustomerField';
    import {getCode, getMpEnrollInfo} from '@/api/enroll/enroll';
    import {saveMpEnroll} from '@/api/course/project/student';
    import {getEnroll, updateEnroll} from '@/api/course/project/project';
    import {OUT_USER_JOIN_ENUM} from '@/enum';
    import moment from 'moment';

    export default {
        name: 'ProjectApply',
        components: {
            VelnFormSection,
            CustomerField
        },
        data() {
            const validatorStartTime = (rule, value, callback) => {
                if (
                    value &&
                    moment(value).valueOf() <= moment().valueOf()
                ) {
                    callback(new Error(this.$t('开始时间不能早于当前时间')));
                } else if (
                    value &&
                    this.editQuery.endTime &&
                    moment(value).valueOf() >= moment(this.editQuery.endTime).valueOf()
                ) {
                    callback(new Error(this.$t('开始时间不能大于等于结束时间')));
                } else {
                    callback();
                }
            };
            const validatorEndTime = (rule, value, callback) => {
                if (
                    value &&
                    this.editQuery.startTime &&
                    moment(value).valueOf() <= moment(this.editQuery.startTime).valueOf()
                ) {
                    callback(new Error(this.$t('结束时间不能小于开始时间')));
                } else {
                    callback();
                }
            };
            return {
                OUT_USER_JOIN_ENUM,
                sourceId: this.$route.query.sourceId,
                editQuery: {
                    code: '',
                    isSave: !this.$route.query.id,
                    name: '', // 报名标题
                    startTime: '', // 开始时间
                    endTime: '', // 结束时间
                    limitNumber: '',
                    formList: [], // 自定义字段
                    projectId: this.$route.query.sourceId
                },
                rules: {
                    name: [{
                        required: true,
                        message: this.$t('请填写报名名称'),
                        trigger: 'blur'
                    }],
                    startTime: [
                        {
                            required: true,
                            message: this.$t('请选择开始时间'),
                            trigger: 'change'
                        },
                        {
                            validator: validatorStartTime,
                            trigger: 'change'
                        }
                    ],
                    endTime: [
                        {
                            required: true,
                            message: this.$t('请选择结束时间'),
                            trigger: 'change'
                        },
                        {
                            validator: validatorEndTime,
                            trigger: 'change'
                        }
                    ],
                    limitNumber: [
                        {
                            required: true,
                            message: this.$t('请输入名额限制'),
                            trigger: 'blur'
                        },
                        {type: 'number', message: this.$t('名额限制必须为数字值')}
                    ]
                },
                key: null,
                id: this.id,
                minDatetime: this.getNow(),
                maxDatetime: this.getYearLater(),
                pickerOptions: {
                    disabledDate(time) {
                        const yearLater = moment().add(1, 'year');
                        const yesterday = moment().subtract(1, 'day');
                        return moment(time).isBefore(yesterday) || moment(time).isAfter(yearLater);
                    }
                }
            };
        },
        watch: {
            id(newVal) {
                this.editQuery.isSave = !newVal;
            }
        },
        mounted() {
            if (this.$route.query.id) {
                this.getMpEnrollInfo(this.$route.query.id);
            } else {
                this.getEnrollId(this.$route.query.sourceId);
            }
        },
        methods: {
            getNow() {
                return moment().format('YYYY-MM-DD HH:mm');
            },

            getYearLater() {
                return moment().add(1, 'year').format('YYYY-MM-DD HH:mm');
            },

            cancel() {
                history.back();
            },

            next() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        this.save();
                    }
                });
            },
            startTimeChange() {
                this.$refs.editQuery.validateField('endTime');
            },
            endTimeChange() {
                this.$refs.editQuery.validateField('startTime');
            },
            getEnrollId(params) {
                getEnroll(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const id = result.data && result.data.relId || '';
                        if (id) {
                            this.id = id;
                            this.getMpEnrollInfo(this.id);
                        } else {
                            this.getCode();
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },

            getCode() {
                getCode().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.code = result.data;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },

            // 回显报名信息
            getMpEnrollInfo(id) {
                const params = id;
                getMpEnrollInfo(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        const {adminFormList} = result.data;
                        this.editQuery.formList = adminFormList || [];
                        this.editQuery.sourceId = this.$route.query.sourceId;
                        this.key = +new Date();
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },

            save() {
                const params = this.editQuery;
                params.formList = this.$refs.customerField.stuInfoList;
                params.startTime =
                    null !== this.rules.startTime && this.rules.startTime.length
                        ? moment(this.editQuery.startTime).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                params.endTime =
                    null !== this.rules.endTime && this.rules.endTime.length
                        ? moment(this.editQuery.endTime).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                saveMpEnroll(params).then(res => {
                    this.$store.dispatch('setAjaxIng', false);
                    const result = res.data;
                    if (result.success) {
                        if (!this.id) {
                            this.id = result.data;
                            this.saveId(this.id);
                        } else {
                            this.$successMsg(this.$t('保存成功'));
                            this.nextPage();
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            },

            saveId(id) {
                const params = {
                    proId: this.sourceId,
                    enrollId: id,
                    approve: false
                };
                updateEnroll(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.nextPage();
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            },

            nextPage() {
                this.$router.push({
                    name: 'applyUser',
                    query: {
                        sourceId: this.sourceId,
                        source: 'FACE_ENROLL',
                        id: this.id
                    }
                });
            }
        }
    };
</script>
