<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container judge-detail-container">
        <nav class="mark__nav">
            <div class="mark__nav__left">
                <div class="mark__nav__title">{{ exam.examName }}</div>
                <div class="mark__nav__info">
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
                        :score-pre="true"
                    />
                    <paper-question
                        v-if="paperContent['QUESTIONS']"
                        :content="paperContent['QUESTIONS']"
                        :record-map="recordMap"
                        :opt="false"
                        :is-edit="false"
                        :show-analysis="false"
                        :score-pre="true"
                    />
                </div>
            </el-form>
            <div class="mark__score__total">
                <div class="mark__score__item">
                    <span>{{ $t('该考生最终成绩')+'：' }}</span>
                    <span class="score">{{ score }}</span>
                </div>
                <div class="mark__score__item">
                    <span>{{ $t('主观题得分')+'：' }}</span>
                    <span class="score">{{ (score-objectiveMark).toFixed(2) }}</span>
                    <span>{{ $t('，'+'客观题得分')+'：' }}</span>
                    <span class="score">{{ objectiveMark.toFixed(2) }}</span>
                </div>
            </div>
            <div class="mark__btn">
                <el-button @click="cancel">{{ $t('关闭') }}</el-button>
                <el-button v-if="isHasPre" type="primary" @click="last">{{ $t('上一份') }}</el-button>
                <el-button v-if="isHasNext" type="primary" @click="next">{{ $t('下一份') }}</el-button>
            </div>
        </section>
    </article>
</template>
<script>
    import {getMarkingPage} from '@/api/exam/exam/judge';
    import PaperFill from '@/components/VelnQuestionsForScore/Fill';
    import PaperQuestion from '@/components/VelnQuestionsForScore/Questions';
    import {
        formatQuestionDom,
        removePlaying,
        unbindEvents
    } from '@/utils/formatQuestion';
    export default {
        name: 'JudgeDetail',
        components: {
            PaperFill,
            PaperQuestion
        },
        data() {
            return {
                id: this.$route.query.id,
                listQuery: {
                    pageSize: 1,
                    pageNum: 1,
                    examId: this.$route.query.id
                },
                exam: {},
                user: {},
                paperContent: {},
                recordMap: {},
                score: 0, // 最终得分
                objectiveMark: 0,
                isHasNext: false,
                isHasPre: false,
                no: 0
            };
        },
        created() {
            this.getMarkingPage();
        },
        beforeDestroy() {
            // 清除事件绑定
            removePlaying();
            unbindEvents();
        },
        methods: {
            getMarkingPage(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                getMarkingPage(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.exam = result.data.exam || {};
                        this.user = result.data.user || {};
                        this.paperContent = result.data.paperContent || {};
                        this.recordMap = result.data.userExamRecordMap || {};
                        this.score = result.data.page.list[0].score;
                        this.objectiveMark = result.data.objectiveMark ? result.data.objectiveMark.toFixed(2) : 0;
                        this.isHasNext = result.data.isHasNext;
                        this.isHasPre = result.data.isHasPre;
                        this.paperContentHandle();
                        this.$nextTick(() => {
                            formatQuestionDom();
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            paperContentHandle() {
                this.questionErgodic('FILL');
                this.questionErgodic('QUESTIONS');
            },
            questionErgodic(type) {
                this.paperContent[type] && this.paperContent[type].ics.map((item) => {
                    item.no = this.no + 1;
                    this.no++;
                });
            },
            cancel() {
                this.$router.push({name: 'judgeList'});
            },
            last() {
                if (this.listQuery.pageNum === 1) {
                    return;
                }
                this.getMarkingPage({
                    pageNum: this.listQuery.pageNum - 1
                });
            },
            next() {
                this.getMarkingPage({
                    pageNum: this.listQuery.pageNum + 1
                });
            }
        }
    };
</script>
