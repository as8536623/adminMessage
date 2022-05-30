<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container exam-detail-container">
        <div class="exam__detail__nav">
            <div class="exam__nav__left">
                <img :src="defaultUserIcon" class="exam__user__icon">
                <span>{{ data.user.name }}</span>
            </div>
            <div class="exam__nav__right">
                <div class="exam__nav__info">
                    <span class="exam__type">[{{ data.exam.examType === 'ONLINE' ? $t('线上') : $t('线下') }}]</span>
                    <span>{{ data.exam.examName }}</span>
                </div>
                <div class="exam__nav__desc">
                    <span :class="{'pass': data.pass}" class="exam__p">{{ data.pass ? $t('通过') : $t('未通过') }}</span>
                    <span>{{ $t('考试成绩'+'：') }}{{ data.score + $t('分') }}</span>
                    <span>{{ $t('满分'+'：') }}{{ data.totalScore + $t('分') }}</span>
                    <span>{{ $t('考试次数'+'：') }}{{ data.examCount }}</span>
                </div>
            </div>
        </div>
        <div class="exam__detail__content">
            <div class="exam__content__left">
                <el-form ref="recordMap" :model="recordMap" :inline-message="true">
                    <div v-if="content">
                        <paper-single
                            v-if="content['SINGLE_SELECTION']"
                            :content="content['SINGLE_SELECTION']"
                            :opt="false"
                            :show-analysis="false"
                            :record-map="recordMap"
                            :score-pre="true"
                        />
                        <paper-multiple
                            v-if="content['MULTI_SELECTION']"
                            :content="content['MULTI_SELECTION']"
                            :opt="false"
                            :show-analysis="false"
                            :record-map="recordMap"
                            :score-pre="true"
                        />
                        <paper-multiple
                            v-if="content['INDEFINITE_SELECTION']"
                            :content="content['INDEFINITE_SELECTION']"
                            title="不定项选择"
                            :opt="false"
                            :show-analysis="false"
                            :record-map="recordMap"
                            :score-pre="true"
                        />
                        <paper-judgement
                            v-if="content['JUDGMENT']"
                            :content="content['JUDGMENT']"
                            :opt="false"
                            :show-analysis="false"
                            :record-map="recordMap"
                            :score-pre="true"
                        />
                        <paper-fill
                            v-if="content['FILL']"
                            :content="content['FILL']"
                            :opt="false"
                            :show-analysis="false"
                            :record-map="recordMap"
                            :score-pre="true"
                        />
                        <paper-question
                            v-if="content['QUESTIONS']"
                            :content="content['QUESTIONS']"
                            :opt="false"
                            :show-analysis="false"
                            :record-map="recordMap"
                            :score-pre="true"
                        />
                    </div>
                </el-form>
            </div>
            <div class="exam__content__right">
                <div class="exam__right__title">{{ $t('考生答题情况') }}</div>
                <div v-if="content" class="exam__order__list">
                    <div
                        v-for="(item, index) in questionList"
                        :key="index"
                        class="exam__order__item"
                        @click="questionClick(index)"
                    >
                        <div class="exam__order">{{ index+1 }}</div>
                        <div
                            class="exam__status"
                            :class="{
                                'right': recordMap[item.id].answer,
                                'wrong': item.judge && recordMap[item.id].answer && !recordMap[item.id].correct,
                                'empty' : !recordMap[item.id].answer}"
                        >
                            <span v-if="!item.judge && recordMap[item.id].answer">{{ recordMap[item.id].score }}</span>
                            <svg-icon
                                v-if="item.judge && recordMap[item.id].answer
                                    && recordMap[item.id].correct"
                                icon-class="right"
                                class-name="exam__item__time__icon"
                            />
                            <svg-icon
                                v-if="item.judge && recordMap[item.id].answer
                                    && !recordMap[item.id].correct"
                                icon-class="wrong"
                                class-name="exam__item__time__icon"
                            />
                        </div>
                    </div>
                </div>
                <div class="exam__order__desc">
                    <div class="exam__desc__item">
                        <span class="exam__desc__border right__border">
                            <svg-icon icon-class="right" class-name="exam__judge__icon"/>
                        </span>
                        <span class="exam__desc__tip">{{ $t('正确') }}</span>
                    </div>
                    <div class="exam__desc__item">
                        <span class="exam__desc__border wrong__border">
                            <svg-icon icon-class="wrong" class-name="exam__judge__icon"/>
                        </span>
                        <span class="exam__desc__tip">{{ $t('错误') }}</span>
                    </div>
                    <div class="exam__desc__item">
                        <span class="exam__desc__border"/>
                        <span class="exam__desc__tip">{{ $t('未答') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="exam__detail__btn">
            <el-button @click="cancel">{{ $t('关闭') }}</el-button>
        </div>
    </article>
</template>
<script>
    import PaperSingle from '@/components/VelnQuestionsForScore/Single';
    import PaperMultiple from '@/components/VelnQuestionsForScore/Multiple';
    import PaperJudgement from '@/components/VelnQuestionsForScore/Judgement';
    import PaperFill from '@/components/VelnQuestionsForScore/Fill';
    import PaperQuestion from '@/components/VelnQuestionsForScore/Questions';
    import {
        getUserDetail
    } from '@/api/exam/exam/examResult';
    import {
        formatQuestionDom,
        removePlaying,
        unbindEvents
    } from '@/utils/formatQuestion';
    export default {
        name: 'ExamDetail',
        components: {
            PaperSingle,
            PaperMultiple,
            PaperJudgement,
            PaperFill,
            PaperQuestion
        },
        data() {
            return {
                list: [{a: 'right'}, {a: 'wrong'}, {a: ''}],
                data: {
                    exam: {},
                    user: {}
                },
                recordMap: {},
                content: null,
                defaultUserIcon: `${process.env.STATIC_API}/qgyun-static/images/default_user.png`,
                questionList: []
            };
        },
        created() {
            this.getUserDetail();
        },
        beforeDestroy() {
            // 清除事件绑定
            removePlaying();
            unbindEvents();
        },
        methods: {
            getUserDetail() {
                const params = {resultId: this.$route.query.id};
                getUserDetail(params).then(res => {
                    const result = res.data;
                    if (result && result.success) {
                        this.content = result.data.paper.prc.prm || null;
                        this.recordMap = result.data.examRecordMap || {};
                        this.data = result.data || {};
                        this.dataFormat();
                        this.$nextTick(() => {
                            formatQuestionDom();
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            dataFormat() {
                const typeList = ['SINGLE_SELECTION', 'MULTI_SELECTION', 'INDEFINITE_SELECTION', 'JUDGMENT', 'FILL', 'QUESTIONS'];
                typeList.map(item => {
                    this.questionErgodic(item);
                });
            },
            questionErgodic(type) {
                this.content[type] && this.content[type].ics.map((item) => {
                    if (type === 'SINGLE_SELECTION' || type === 'JUDGMENT') {
                        item.judge = true;
                    }
                    this.questionList.push(item);
                });
            },
            questionClick(index) {
                const id = `question${index + 1}`;
                document.getElementById(id).scrollIntoView({behavior: 'smooth'});
                return false;
            },
            cancel() {
                this.$router.push({name: 'resultList', query: {id: this.$route.query.examId}});
            }
        }
    };
</script>
