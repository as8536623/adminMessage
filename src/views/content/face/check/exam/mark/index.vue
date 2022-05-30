<style lang="scss">
    @import "style";
</style>
<template>
    <article class="mark__container">
        <nav class="mark__nav">
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
        </nav>
        <section class="mark__question">
            <el-form ref="userExamRecordMap" :model="userExamRecordMap" :inline-message="true">
                <div v-if="paperContent.QUESTIONS">
                    <div class="mark__question__type">
                        {{ $t('问答题') }}{{ $t('（' +'共') + paperContent.QUESTIONS.ic
                            + $t('小题，总分') + paperContent.QUESTIONS.tm + $t('分。答题规则：在输入框中填写答案。）') }}
                    </div>
                    <ul class="question__list">
                        <li v-for="(item, index) in paperContent.QUESTIONS.ics" :key="index" class="question__item">
                            <el-form-item
                                :label="$t('得分') + '：'"
                                :prop="'' + item.id + '.realScore'"
                                :data-prop="'' + item.id + '.realScore'"
                                :rules="[{
                                    type: 'number', message: $t('必须为数字值')
                                }, {
                                    validator: validateInteger, trigger: 'blur'}]"
                            >
                                <el-input
                                    v-model.number="userExamRecordMap[item.id].realScore"
                                    type="text"
                                    @blur="markScore(item.id, item.m)"
                                />
                            </el-form-item>
                            <div class="qustion__info">
                                <div>{{ $t('(' + item.m + '分' + ')') }}</div>
                                <div class="question__desc" v-html="item.ct"/>
                            </div>
                            <el-form-item :label="$t('考生答案') + '：'" class="user__answer">
                                <el-input
                                    v-model="userExamRecordMap[item.id].answer"
                                    type="textarea"
                                    :rows="4"
                                    readonly
                                />
                            </el-form-item>
                            <div class="right__answer">
                                <div>{{ $t('正确答案') + '：' }}</div>
                                <div class="answer__desc" v-html="item.a"/>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="paperContent.FILL">
                    <div class="mark__question__type">
                        {{ $t('填空题') }}{{ $t('（' +'共') + paperContent.QUESTIONS.ic
                            + $t('小题，总分') + paperContent.QUESTIONS.tm + $t('分。答题规则：在对应的空格中填写答案。）') }}
                    </div>
                    <ul class="question__list">
                        <li v-for="(item, index) in paperContent.QUESTIONS.ics" :key="index" class="question__item">
                            <el-form-item :label="$t('得分') + '：'">
                                <el-input
                                    v-model="userExamRecordMap[item.id].realScore"
                                    type="text"
                                    @blur="markScore"
                                />
                            </el-form-item>
                            <div class="qustion__info">
                                <div>{{ $t('(' + item.m + '分' + ')') }}</div>
                                <div class="question__desc" v-html="item.ct"/>
                            </div>
                            <div class="right__answer">
                                <div>{{ $t('正确答案') + '：' }}</div>
                                <div class="answer__desc" v-html="item.a"/>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="mark__score__total">
                    <div class="mark__score__item">
                        <span>{{ $t('系统折合成绩')+'：' }}</span>
                        <span class="score">{{ conversionMark.toFixed(2) }}</span>
                        <span>{{ $t('（满分）' + '：' + data.convertTotalMark ) }}</span>
                    </div>
                    <div class="mark__score__item">
                        <span>{{ $t('主观题得分')+'：' }}</span>
                        <span class="score">{{ subjectiveMark.toFixed(2) }}</span>
                        <span>{{ $t('，'+'客观题得分')+'：' }}</span>
                        <span class="score">{{ Number(data.objectiveMark).toFixed(2) }}</span>
                    </div>
                </div>
            </el-form>
            <div class="mark__btn">
                <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
                <el-button @click="cancel">{{ $t('关闭') }}</el-button>
            </div>
        </section>
    </article>
</template>
<script>
    import {getMarkingInfo} from '@/api/exam/exam/judge';
    import {validateInteger} from '@/utils/validate';
    import {submitMarkExam, submitReviewMarkExam} from '@/api/exam/exam/examJudgeRecord';

    export default {
        name: 'MarkExamPaper',
        data() {
            return {
                validateInteger,
                examId: this.$route.query.examId,
                userId: this.$route.query.userId,
                relId: this.$route.query.relId,
                paperContent: {},
                data: {},
                user: {},
                exam: {},
                userExamRecordMap: {},
                subjectiveMark: 0, // 主观题分数
                conversionMark: 0, // 折合分数
                review: false
            };
        },
        created() {
            this.getMarkingInfo();
        },
        methods: {
            getMarkingInfo() {
                const params = {examId: this.examId, userId: this.userId};
                getMarkingInfo(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data;
                        this.exam = result.data.exam || {};
                        this.user = result.data.user || {};
                        this.userExamRecordMap = result.data.userExamRecordMap || {};
                        this.paperContent = result.data.paperContent || {};
                        this.review = result.data.userExamRecordMap && true;
                        this.scoreHandle();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            scoreHandle() {
                for (const value of Object.values(this.userExamRecordMap)) {
                    this.subjectiveMark += value.realScore ? Number(value.realScore) : 0;
                }
                this.conversionMark = Number(this.subjectiveMark) + Number(this.data.objectiveMark);
            },
            // 评分
            markScore(key, maxScore) {
                if (this.userExamRecordMap[key].realScore > maxScore) {
                    this.userExamRecordMap[key].realScore = maxScore;
                }
                this.subjectiveMark = 0;
                this.conversionMark = 0;
                this.scoreHandle();
            },
            cancel() {
                this.$router.push({name: 'faceCourseCheck', query: {type: 'PE', relId: this.relId}});
            },
            save() {
                this.$refs.userExamRecordMap.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const markScoreMap = {};
                        for (const [key, value] of Object.entries(this.userExamRecordMap)) {
                            markScoreMap[key] = value.realScore;
                        }
                        const params = {markScoreMap, examId: this.examId, userId: this.userId};
                        if (this.review) {
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
                        } else {
                            submitMarkExam(params).then(res => {
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
                    }
                });
            }
        }
    };
</script>
