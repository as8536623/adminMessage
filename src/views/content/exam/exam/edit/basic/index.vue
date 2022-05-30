<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container exam-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('添加考试')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item :label="$t('考试名称') + '：'" prop="examName">
                        <el-input
                            v-model.trim="editQuery.examName"
                            class="input__limit"
                            type="text"
                            :placeholder="$t('长度小于50')"
                            maxlength="50"
                            show-word-limit
                        />
                    </el-form-item>
                    <el-form-item :label="$t('开始时间') + '：'" prop="startTime">
                        <veln-datetime
                            v-model="editQuery.startTime"
                            :min-datetime="minDatetime"
                            :max-datetime="maxDatetime"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('结束时间') + '：'" prop="endTime">
                        <veln-datetime
                            v-model="editQuery.endTime"
                            :min-datetime="minDatetime"
                            :max-datetime="maxDatetime"
                        />
                    </el-form-item>
                    <el-form-item
                        :label="$t('关联试卷') + '：'"
                        class="required"
                        prop="paperTemplate.paperName"
                    >
                        <el-tag
                            v-if="editQuery.paperTemplate.paperName"
                            type="success"
                        >{{ editQuery.paperTemplate.paperName }}</el-tag>
                        <el-button type="text" @click="selectPapers">{{ $t('选择试卷') }}</el-button>
                    </el-form-item>
                    <el-form-item :label="$t('考试说明') + '：'">
                        <el-input
                            v-model="editQuery.examPlain"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 6}"
                            :placeholder="$t('请输入考试说明')"
                            maxlength="500"
                        />
                    </el-form-item>
                </section>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
            </section>
        </el-form>
        <el-dialog
            v-if="paperDialogVisible"
            append-to-body
            :title="$t('选择试卷')"
            :visible.sync="paperDialogVisible"
            width="890px"
            @close="paperDialogClose"
        >
            <veln-select-papers
                :selected-list="selectedList"
                @close="close"
                @selectPaper="selectPaper"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnSteps from '@/components/VelnSteps';
    import VelnSelectPapers from '@/components/VelnSelectPapers';
    import {validateInteger} from '@/utils/validate';
    import {getCode, saveInfo, getInfo} from '@/api/exam/exam/exam';
    import moment from 'moment';
    import {getInfoTime} from '@/api/faceCourse';

    export default {
        name: 'ExamBasic',
        components: {
            VelnFormSection,
            VelnSteps,
            VelnSelectPapers
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('考试设置'),
                    status: 'wait',
                    disabled: true
                }
            ];
            const validatorStartTime = (rule, value, callback) => {
                if (
                    value &&
                    this.editQuery.endTime &&
                    value >= this.editQuery.endTime
                ) {
                    callback(new Error(this.$t('开始时间不能小于结束时间')));
                } else {
                    callback();
                }
            };
            const validatorEndTime = (rule, value, callback) => {
                if (
                    value &&
                    this.editQuery.startTime &&
                    value <= this.editQuery.startTime
                ) {
                    callback(new Error(this.$t('结束时间不能小于开始时间')));
                } else {
                    callback();
                }
            };
            return {
                validateInteger,
                editQuery: {
                    id: this.$route.query.id,
                    examCode: '',
                    examName: '',
                    examPlain: '',
                    examType: 'ONLINE',
                    startTime: '',
                    endTime: '',
                    paperTemplateId: '',
                    makeCount: '',
                    paperTemplate: {},
                    sourceId: this.$route.query.sourceId, // 面授课程--考试
                    source: this.$route.query.source // 面授课程--考试
                },
                rules: {
                    examName: [
                        {
                            required: true,
                            message: this.$t('请输入考试名称'),
                            trigger: 'blur'
                        }
                    ],
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
                    'paperTemplate.paperName': [
                        {
                            required: true,
                            message: this.$t('请选择试卷'),
                            trigger: 'change'
                        }
                    ]
                },
                active: 0,
                steps,
                paperDialogVisible: false,
                selectedList: [],
                minDatetime: this.getNow(),
                maxDatetime: null
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
                        this.editQuery.examName = result.data.name + '-考试';
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
                if (this.$route.query.id) {
                    this.getInfo(this.$route.query.id);
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                } else {
                    this.getCode();
                }
            },
            getCode() {
                getCode().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.examCode = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取编号异常'));
                    }
                });
            },
            cancel() {
                const sourceId = this.$route.query.sourceId;
                if (sourceId) {
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
                }
            },
            sure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        saveInfo(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.next(result.data.id);
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            // 编辑回显
            getInfo(id) {
                getInfo(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        this.selectedList[0] = result.data.paperTemplate
                            ? result.data.paperTemplate.id
                            : [];
                        this.editQuery.sourceId = this.$route.query.sourceId;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            stepChange(index) {
                switch (index) {
                    case 1:
                        this.next(this.editQuery.id);
                        break;
                }
            },
            next(id) {
                const sourceId = this.$route.query.sourceId;
                this.$router.push({
                    name: 'faceExamSetting',
                    query: {
                        id,
                        sourceId,
                        source: this.editQuery.source
                    }
                });
            },
            selectPapers() {
                this.paperDialogVisible = true;
            },
            paperDialogClose() {
                this.paperDialogVisible = false;
            },
            close() {
                this.paperDialogVisible = false;
            },
            // 选择试卷
            selectPaper(arr) {
                this.editQuery.paperTemplate = arr[0];
                this.editQuery.paperTemplateId = arr[0].id;
                this.selectedList[0] = arr[0].id;
                this.$refs.editQuery.validateField('paperTemplate.paperName');
            }
        }
    };
</script>
