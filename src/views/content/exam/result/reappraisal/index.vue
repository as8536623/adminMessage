<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container reappraisal-container">
        <div class="reappraisal__nav">
            <span class="reappraisal__type">{{ $t('成绩复评') }}</span>
            <span class="reappraisal__tip">{{ $t('绩复评可针对客观题和主观题复评，更改试题得分；客观题修改得分后，不影响答题对错。') }}</span>
            <div class="reappraisal__name">{{ examName }}</div>
        </div>
        <div class="reappraisal__content">
            <div class="reappraisal__left">
                <el-form ref="recordMap" :model="recordMap" :inline-message="true">
                    <div v-if="data">
                        <paper-single
                            v-if="data['SINGLE_SELECTION']"
                            :content="data['SINGLE_SELECTION']"
                            :opt="false"
                            :show-analysis="false"
                            :score-opt="true"
                            :record-map="recordMap"
                        />
                        <paper-multiple
                            v-if="data['MULTI_SELECTION']"
                            :content="data['MULTI_SELECTION']"
                            :opt="false"
                            :show-analysis="false"
                            :score-opt="true"
                            :record-map="recordMap"
                        />
                        <paper-multiple
                            v-if="data['INDEFINITE_SELECTION']"
                            :content="data['INDEFINITE_SELECTION']"
                            title="不定项选择"
                            :opt="false"
                            :show-analysis="false"
                            :score-opt="true"
                            :record-map="recordMap"
                        />
                        <paper-judgement
                            v-if="data['JUDGMENT']"
                            :content="data['JUDGMENT']"
                            :opt="false"
                            :show-analysis="false"
                            :score-opt="true"
                            :record-map="recordMap"
                        />
                        <paper-fill
                            v-if="data['FILL']"
                            :content="data['FILL']"
                            :opt="false"
                            :show-analysis="false"
                            :score-opt="true"
                            :record-map="recordMap"
                        />
                        <paper-question
                            v-if="data['QUESTIONS']"
                            :content="data['QUESTIONS']"
                            :opt="false"
                            :show-analysis="false"
                            :score-opt="true"
                            :record-map="recordMap"
                        />
                    </div>
                </el-form>
                <div v-if="!noJudge" class="mark__score__total">
                    <div class="mark__score__item">
                        <span>{{ $t('系统折合成绩')+'：' }}</span>
                        <span class="score">{{ convertTotalMark }}</span>
                        <span>{{ $t('（满分）' + '：' + (totalMark) ) }}</span>
                    </div>
                    <div class="mark__score__item">
                        <span>{{ $t('主观题得分')+'：' }}</span>
                        <span class="score">{{ subjectiveMark }}</span>
                        <span>{{ $t('，'+'客观题得分')+'：' }}</span>
                        <span class="score">{{ objectiveMark }}</span>
                    </div>
                </div>
                <div v-if="noJudge" class="no__judge__line">-- {{ $t('暂无评卷') }} --</div>

                <div class="mark__btn">
                    <el-button @click="cancel">{{ $t('关闭') }}</el-button>
                    <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
                </div>
            </div>
        </div>
    </article>
</template>
<script>
    import PaperSingle from '@/components/VelnQuestionsForScore/Single';
    import PaperMultiple from '@/components/VelnQuestionsForScore/Multiple';
    import PaperJudgement from '@/components/VelnQuestionsForScore/Judgement';
    import PaperFill from '@/components/VelnQuestionsForScore/Fill';
    import PaperQuestion from '@/components/VelnQuestionsForScore/Questions';
    import {getInfo} from '@/api/exam/exam/exam';
    import {reviewExamPage, reviewUserResult} from '@/api/exam/exam/examResult';
    import {submitReviewMarkExam} from '@/api/exam/exam/examJudgeRecord';
    import {
        formatQuestionDom,
        removePlaying,
        unbindEvents
    } from '@/utils/formatQuestion';

    export default {
        name: 'Reappraisal',
        components: {
            PaperSingle,
            PaperMultiple,
            PaperJudgement,
            PaperFill,
            PaperQuestion
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'userName',
                    text: this.$t('姓名')
                },
                {
                    field: 'pass',
                    text: this.$t('结果'),
                    render: (h, param) => {
                        return param.row.pass ? this.$t('通过') : this.$t('未通过');
                    }
                },
                {
                    field: 'score',
                    text: this.$t('成绩/满分'),
                    render: (h, param) => {
                        return param.row.score + '/' + param.row.totalScore;
                    }
                },
                {
                    field: 'review',
                    text: this.$t('是否已复评'),
                    render: (h, param) => {
                        return param.row.review ? this.$t('是') : this.$t('否');
                    }
                }
            ];
            return {
                id: this.$route.query.id,
                examName: '',
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    arrangeIds: [this.$route.query.arrangeId],
                    examIds: [this.$route.query.id],
                    passStatus: [true, false],
                    pageNum: 1,
                    pageSize: 20
                },
                data: null,
                multiSelection: [],
                userId: this.$route.query.userId, // 当前评卷的学员id
                recordMap: {},
                totalMark: 0, // 真实试卷分数
                convertTotalMark: 0 // 折合后分数
            };
        },
        computed: {
            subjectiveMark() {
                if (!this.data) {
                    return 0;
                }
                // const multiple = this.convertTotalMark / this.totalMark;
                let result = 0;
                ['FILL', 'QUESTIONS'].map(type => {
                    const typeObj = this.data[type];
                    if (!typeObj) {
                        return;
                    }
                    const list = typeObj.ics;
                    list.map(item => {
                        const id = item.id;
                        const question = this.recordMap[id];
                        const score = Math.round(question.realScore * question.totalScore / item.m * 10) / 10;
                        result += score;
                    });
                });

                return (result).toFixed(1);
            },
            objectiveMark() {
                if (!this.data) {
                    return 0;
                }
                // const multiple = this.convertTotalMark / this.totalMark;
                let result = 0;
                ['SINGLE_SELECTION', 'MULTI_SELECTION', 'INDEFINITE_SELECTION', 'JUDGMENT'].map(type => {
                    const typeObj = this.data[type];
                    if (!typeObj) {
                        return;
                    }
                    const list = typeObj.ics;
                    list.map(item => {
                        // 每题折合分 = 输入的分数 / 试题原分数 * totalScore
                        const id = item.id;
                        const question = this.recordMap[id];
                        const score = Math.round(question.realScore * question.totalScore / item.m * 10) / 10;
                        result += score;
                    });
                });

                return (result).toFixed(1);
            }
        },
        created() {
            // this.getList();
            this.getInfo();
            this.reviewUserResult();
        },
        beforeDestroy() {
            // 清除事件绑定
            removePlaying();
            unbindEvents();
        },
        methods: {
            selectionChange(v) {
                if (v.length > 1) {
                    this.$refs.userTable.clearSelection();
                    this.$refs.userTable.toggleRowSelection(v.pop());
                } else if (v.length) {
                    this.multiSelection = v;
                    this.userId = this.multiSelection[0].userId;
                    this.reviewUserResult();
                }
            },
            handleSizeChange(v) {
                this.getList({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v
                });
            },
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                reviewExamPage(params).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result) {
                        this.list = result.list || [];
                        this.total = result.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                        this.$nextTick(() => {
                            if (this.list.length > 0) {
                                this.userId = this.list[0].userId;
                                this.setActive(this.list[0]);
                            }
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getInfo() {
                getInfo(this.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.examName = result.data.examName;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            // 默认选中
            setActive(item) {
                // this.$refs.userTable.toggleRowSelection(item);
                this.reviewUserResult();
            },
            reviewUserResult() {
                const params = {examId: this.id, userId: this.userId};
                reviewUserResult(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const {prm, recordMap, totalMark, convertTotalMark} = result.data;
                        this.data = prm || null;

                        this.recordMap = recordMap || {};
                        this.totalMark = totalMark;
                        this.convertTotalMark = convertTotalMark;

                        this.$nextTick(() => {
                            formatQuestionDom();
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            save() {
                this.$refs.recordMap.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const markScoreMap = {};
                        for (const [key, value] of Object.entries(this.recordMap)) {
                            markScoreMap[key] = value.realScore;
                        }
                        const params = {
                            markScoreMap,
                            examId: this.id,
                            userId: this.userId
                        };
                        submitReviewMarkExam(params).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.cancel();
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            cancel() {
                // 成绩--复评入口
                // if (this.$route.query.examId) {
                //     this.$router.push({name: 'resultDetail', query: {id: this.$route.query.examId}});
                //     return;
                // }
                // 考试列表--复评入口
                // this.$router.push({name: 'examList'});
                if (this.$route.query.from) {
                    this.$router.push({
                        name: 'publishResults',
                        query: {id: this.$route.query.id}
                    });
                    return;
                }
                this.$router.push({
                    name: 'resultList',
                    query: {id: this.$route.query.id}
                });
            }
        }
    };
</script>
