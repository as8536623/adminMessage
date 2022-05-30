<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container exam-score-container">
        <nav class="mark__nav">
            <div class="mark__nav__left">
                <div class="mark__nav__title">{{ exam.examName }}</div>
                <div v-if="js.vi" class="mark__nav__info">
                    <div class="mark__nav__item">
                        <label>{{ $t('姓名'+'：') }}</label>
                        <span class="mark__nav__desc">{{ user.name }}</span>
                    </div>
                    <div class="mark__nav__item">
                        <label>{{ $t('部门'+'：') }}</label>
                        <span class="mark__nav__desc">{{ user.orgName }}</span>
                    </div>
                </div>
            </div>
            <div class="mark__nav__right">
                <span class="nav__right__item">
                    {{ $t('已评卷'+'：') }}
                    <span class="active">{{ exam.markedPaperCount }}</span>
                </span>
                <span class="nav__right__item">
                    {{ $t('待评卷'+'：') }}
                    <span class="active">{{ exam.waitPaperCount }}</span>
                </span>
            </div>
        </nav>
        <section class="mark__question">
            <el-form ref="recordMap" :model="recordMap" :inline-message="true">
                <div v-if="paperContent">
                    <paper-fill
                        v-if="paperContent['FILL']"
                        :content="paperContent['FILL']"
                        :record-map="recordMap"
                        :opt="false"
                        :is-edit="false"
                        :show-analysis="false"
                        :score-opt="true"
                    />
                    <paper-question
                        v-if="paperContent['QUESTIONS']"
                        :content="paperContent['QUESTIONS']"
                        :record-map="recordMap"
                        :opt="false"
                        :is-edit="false"
                        :show-analysis="false"
                        :score-opt="true"
                    />
                </div>
            </el-form>
            <div v-if="!noJudge" class="mark__score__total">
                <div class="mark__score__item">
                    <span>{{ $t('系统折合成绩')+'：' }}</span>
                    <span class="score">{{ data.convertTotalMark }}</span>
                    <span>{{ $t('（满分）' + '：' + (data.totalMark || 0) ) }}</span>
                </div>
                <div class="mark__score__item">
                    <span>{{ $t('主观题得分')+'：' }}</span>
                    <span class="score">{{ subjectiveMark || 0 }}</span>
                    <span>{{ $t('，'+'客观题得分')+'：' }}</span>
                    <span class="score">{{ data.objectiveMark }}</span>
                </div>
            </div>
            <div v-if="noJudge" class="no__judge__line">-- {{ $t('暂无评卷') }} --</div>
            <div class="mark__btn">
                <el-button @click="cancel">{{ $t('关闭') }}</el-button>
                <el-button v-if="!noJudge" type="primary" @click="save">{{ $t('保存') }}</el-button>
            </div>
        </section>
    </article>
</template>
<script>
    import {getMarking} from '@/api/exam/exam/judge';
    import {submitMarkExam} from '@/api/exam/exam/examJudgeRecord';
    import PaperFill from '@/components/VelnQuestionsForScore/Fill';
    import PaperQuestion from '@/components/VelnQuestionsForScore/Questions';
    import {
        formatQuestionDom,
        removePlaying,
        unbindEvents
    } from '@/utils/formatQuestion';

    export default {
        name: 'MarkExamPaper',
        components: {
            PaperFill,
            PaperQuestion
        },
        data() {
            return {
                id: this.$route.query.id,
                paperContent: {},
                js: {}, // 判断展示个人信息
                data: {},
                user: {},
                exam: {},
                recordMap: {}, // 对应得分信息
                subjectiveMark: 0, // 主观题分数
                review: false,
                no: 0,
                noJudge: false
            };
        },
        watch: {
            recordMap: {
                handler(val) {
                    this.scoreHandle();
                },
                immediate: true,
                deep: true
            }
        },
        created() {
            this.getMarking();
        },
        beforeDestroy() {
            // 清除事件绑定
            removePlaying();
            unbindEvents();
        },
        methods: {
            // 试卷信息
            getMarking() {
                const params = {examId: this.id};
                getMarking(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data;
                        this.exam = result.data.exam || {};
                        this.user = result.data.user || {};
                        this.js = result.data.js || {};
                        this.recordMap = result.data.userExamRecordMap || {};
                        this.paperContent = result.data.paperContent || {};
                        this.noJudge = !!result.data.noJudge;
                        this.paperContentHandle();
                        if (this.noJudge) {
                            this.subjectiveMark = 0;
                            this.$set(this.data, 'convertTotalMark', 0);
                            this.$set(this.data, 'objectiveMark', 0);
                        } else {
                            this.scoreHandle();
                        }
                        this.$nextTick(() => {
                            formatQuestionDom();
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            paperContentHandle() {
                this.questionErgodic('FILL');
                this.questionErgodic('QUESTIONS');
            },
            questionErgodic(type) {
                this.paperContent[type] &&
                    this.paperContent[type].ics.map(item => {
                        item.no = this.no + 1;
                        this.no++;
                    });
            },
            // 折合分数，主观题分数计算
            scoreHandle() {
                if (this.noJudge) {
                    this.subjectiveMark = 0;
                    return;
                }
                const multiple = this.data.convertTotalMark / this.data.totalMark;
                this.data.objectiveMark = this.data.objectiveMark || 0;
                let score = 0;
                for (const value of Object.values(this.recordMap)) {
                    const s = Math.round((value.realScore ? Number(value.realScore) : 0) * multiple * 10) / 10;
                    score = score + s;
                }
                // this.subjectiveMark = (
                //     (score * this.data.convertTotalMark) /
                //     this.data.totalMark
                // ).toFixed(1);
                this.subjectiveMark = (score).toFixed(1);
            },
            save() {
                this.$refs.recordMap.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const markScoreMap = {};
                        let totalScore = 0;
                        for (const [key, value] of Object.entries(this.recordMap)) {
                            markScoreMap[key] = value.realScore;
                            totalScore += value.realScore;
                        }
                        const params = {
                            markScoreMap,
                            examId: this.id,
                            userId: this.user.userDetail.userId,
                            approvalType: 'MARK',
                            score: totalScore
                        };
                        submitMarkExam(params).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('评卷成功'));
                                this.cancel();
                            } else {
                                this.$errorMsg(this.$t(result.msg || '评卷失败'));
                            }
                        });
                    }
                });
            },
            cancel() {
                this.$router.push({name: 'examList'});
            }
        }
    };
</script>
