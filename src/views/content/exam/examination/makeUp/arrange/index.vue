<style lang="scss">
@import 'style.scss';
@import '../style.scss';
</style>
<template>
    <article class="app-container examination-container">
        <el-form
            ref="examArrange"
            :model="examArrange"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-steps :data="steps" :active="active" @change="stepChange"/>
            <section class="tool-form-item tool-arrange-item">
                <el-form-item :label="$t('补考对象') + '：'" prop="markUpTypes">
                    <el-checkbox-group v-model="examArrange.markUpTypes">
                        <el-checkbox key="NO_PASS" label="NO_PASS">{{ $t('未通过学生') }}</el-checkbox>
                        <el-checkbox key="MISS_EXAM" label="MISS_EXAM">{{ $t('缺考学生') }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('补考结束时间') + '：'" prop="endTime">
                    <veln-datetime v-model="examArrange.endTime"/>
                </el-form-item>
                <el-form-item :label="$t('')">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button @click="last">{{ $t('上一步') }}</el-button>
                    <el-button type="primary" @click="makeUpSure">{{ $t('保存') }}</el-button>
                </el-form-item>
            </section>
        </el-form>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import {getMarkUpArrange, saveMarkUpArrange} from '@/api/exam/exam/exam';
    import moment from 'moment';

    export default {
        name: 'MakeUpArrange',
        components: {
            VelnSteps
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('试卷设置'),
                    status: 'done',
                    disabled: true
                },
                {
                    title: this.$t('考试安排'),
                    status: 'wait',
                    disabled: true
                }
            ];
            const validatorEndTime = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('请输入结束时间')));
                } else if (moment(value).isBefore(moment())) {
                    callback(new Error(this.$t('结束时间不能早于当前时间')));
                } else {
                    callback();
                }
            };
            return {
                steps,
                active: 2,
                examArrange: {
                    examId: this.$route.query.id,
                    endTime: '',
                    markUpTypes: ['NO_PASS']
                },
                moreBatchFlag: false,
                key: null,
                index: 1,
                examType: this.$route.query.examType,
                rules: {
                    markUpTypes: [
                        {
                            required: true,
                            message: this.$t('请选择补考对象'),
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
                    ]
                }
            };
        },
        created() {
            this.init();
        },
        methods: {
            getList() {
                const params = {
                    examId: this.$route.query.id
                };
                getMarkUpArrange(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        if (result.data) {
                            this.examArrange = Object.assign(
                                {},
                                this.examArrange,
                                result.data
                            );
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            init() {
                if (this.$route.query.id) {
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                }
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.$router.push({
                            name: 'makeUpBasic',
                            query: {
                                id: this.$route.query.id,
                                examType: this.$route.query.examType
                            }
                        });
                        break;
                    case 1:
                        this.last();
                        break;
                }
            },
            cancel() {
                this.$router.push({
                    name: 'examList'
                });
            },
            last() {
                this.$router.push({
                    name: 'makeUpPaper',
                    query: {
                        id: this.$route.query.id,
                        examType: this.$route.query.examType
                    }
                });
            },
            makeUpSure() {
                this.$refs.examArrange.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        saveMarkUpArrange(this.examArrange).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result && result.success) {
                                this.cancel();
                            } else {
                                this.$errorMsg(this.$t(result.msg || '系统异常'));
                            }
                        });
                    }
                });
            }
        }
    };
</script>
