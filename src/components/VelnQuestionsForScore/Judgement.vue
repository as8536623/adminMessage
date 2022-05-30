<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="question__score__container">
        <div class="question__label">
            <div class="question__label__item">
                {{ $t('判断题') }}
                {{ $t('（共') + content.ic + $t('小题，') + $t('总分') }}
                {{ content.tm | examScoreFilter }}
                {{ $t('分。答题规则：判断下列说法是否正确。）') }}
            </div>
        </div>
        <div v-for="(item, index) in content.ics" :id="'question' + item.no" :key="index" class="question__item">
            <el-form-item v-if="scoreOpt" :label="$t('得分') + '：'">
                <el-input-number
                    v-if="scoreOpt"
                    v-model.number="recordMap[item.id].realScore"
                    :controls="false"
                    controls-position="right"
                    :min="0"
                    :max="item.m"
                />
            </el-form-item>
            <div class="question__name">
                <div v-if="scorePre">
                    <svg-icon
                        v-if="recordMap[item.id].correct"
                        icon-class="right"
                        class-name="question__status"
                    />
                    <svg-icon v-else icon-class="wrong" class-name="question__status"/>
                </div>
                <span class="question__order">{{ item.no }}、{{ '('+ item.m+'分)' }}</span>
                <exam-ct :ct="JSON.parse(item.ct)"/>
            </div>
            <div class="question__select judgement__select">
                <el-radio-group v-model="recordMap[item.id].answer" disabled>
                    <el-radio label="1">{{ $t('正确') }}</el-radio>
                    <el-radio label="0">{{ $t('错误') }}</el-radio>
                </el-radio-group>
            </div>
            <div class="question__analysis">
                <label>{{ $t('正确答案'+'：') }}</label>
                <div>{{ item.t ? $t('正确') : $t('错误') }}</div>
            </div>
            <div class="question__analysis" :class="{'hide__analysis': !showAnalysis}">
                <label>{{ $t('解析'+'：') }}</label>
                <exam-ct v-if="item.ep" :ct="JSON.parse(item.ep)"/>
            </div>
        </div>
    </article>
</template>
<script>
    import ExamCt from '@/components/VelnFileForExam/ExamCt';
    export default {
        name: 'PaperJudgement',
        components: {
            ExamCt
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {};
                }
            },
            showAnalysis: { // 显示隐藏解析
                type: Boolean,
                default: true
            },
            scoreOpt: { // 评分input
                type: Boolean,
                default: false
            },
            scorePre: { // 评分预览
                type: Boolean,
                default: false
            },
            recordMap: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {};
        },
        created() {},
        methods: {}
    };
</script>
