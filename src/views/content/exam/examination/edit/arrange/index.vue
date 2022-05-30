<style lang="scss">
    @import "style.scss";
    @import "../style.scss";
</style>
<template>
    <article class="app-container examination-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-steps :data="steps" :active="active" @change="stepChange"/>
            <section class="tool-form-item tool-arrange-item">
                <div class="more__batch__btn">
                    <el-button v-if="!moreBatchFlag" type="primary" @click="moreBatch">{{ $t('安排多批次考试') }}</el-button>
                </div>
                <div
                    v-for="(item, idx) in editQuery.examArranges"
                    :key="idx"
                >
                    <arrange-item
                        :id="editQuery.id"
                        :key="key"
                        ref="arrange"
                        :data="item"
                        :index="idx"
                        :total="editQuery.examArranges.length"
                        @del="del"
                    />
                </div>
                <el-button v-if="moreBatchFlag" class="add__batch__btn" @click="addBatch">{{ $t('+添加批次') }}</el-button>
                <el-form-item :label="$t('')">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button @click="last">{{ $t('上一步') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
                </el-form-item>
            </section>
        </el-form>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import ArrangeItem from './components/arrangeItem';
    import {listExamArrange, addArrange, deleteArrange, updateArrange} from '@/api/exam/exam/exam';

    export default {
        name: 'ExamArrange',
        components: {
            VelnSteps,
            ArrangeItem
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
                },
                {
                    title: this.$t('考试设置'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                steps,
                editQuery: {
                    id: this.$route.query.id,
                    examArranges: []
                },
                rules: {},
                active: 2,
                moreBatchFlag: false,
                key: null,
                index: 1,
                examType: this.$route.query.examType
            };
        },
        created() {
            this.init();
            this.getList();
        },
        methods: {
            getList() {
                listExamArrange(this.$route.query.id).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.editQuery.examArranges = result.data;
                        if (this.editQuery.examArranges) {
                            if (this.editQuery.examArranges.length === 1) {
                                this.editQuery.examArranges[0].batchName = '批次1';
                            } else if (this.editQuery.examArranges.length > 1) {
                                this.editQuery.examArranges[0].batchName ? this.editQuery.examArranges[0].batchName : '批次1';
                                this.moreBatchFlag = true;
                                this.index = this.editQuery.examArranges.length;
                            }
                        }
                        this.key = +new Date();
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
                            name: 'examBasic',
                            query: {
                                id: this.$route.query.id,
                                examType: this.$route.query.examType
                            }
                        });
                        break;
                    case 1:
                        this.last();
                        break;
                    case 3:
                        this.$router.push({
                            name: 'examSetting',
                            query: {
                                id: this.$route.query.id,
                                examType: this.$route.query.examType
                            }
                        });
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
                    name: 'paperSetting',
                    query: {
                        id: this.$route.query.id,
                        examType: this.$route.query.examType
                    }
                });
            },
            sure() {
                if (!this.$refs.arrange) {
                    return false;
                }
                for (let i = 0; i < this.$refs.arrange.length; i++) {
                    if (!this.$refs.arrange[i].formValidate()) {
                        this.$warnMsg(this.$t('请完善信息'));
                        return false;
                    }
                }
                updateArrange(this.editQuery).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.$router.push({
                            name: 'examSetting',
                            query: {
                                id: this.editQuery.id,
                                examType: this.$route.query.examType
                            }
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '系统异常'));
                    }
                });
            },
            addBatch() {
                this.index++;
                const data = {
                    batchName: '批次' + this.index,
                    startTime: '',
                    endTime: '',
                    monitorUserIds: [],
                    id: ''
                };
                addArrange(this.editQuery.id).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        data.id = result.data.id;
                        this.editQuery.examArranges.push(data);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            // 安排考试多批次
            moreBatch() {
                this.editQuery.examArranges[0].batchName = '批次1';
                this.addBatch();
                this.moreBatchFlag = true;
            },
            del(index) {
                if (this.editQuery.examArranges.length === 1) {
                    this.$warnMsg(this.$t('至少保留一个批次'));
                    return;
                }
                this.$confirm(this.$t('确定删除该批次么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    deleteArrange(this.editQuery.examArranges[index].id).then(re => {
                        const result = re.data;
                        if (result && result.success) {
                            this.editQuery.examArranges.splice(index, 1);
                            this.key = +new Date();
                            this.$forceUpdate();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '数据删除失败'));
                        }
                    });
                });
            }
        }
    };
</script>
