<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="question__score__container">
        <div class="question__label">
            <div class="question__label__item">
                {{ $t(title) }}
                <span
                    v-if="title === '多选题'"
                >{{ $t('（共') + content.ic + $t('小题，') + $t('总分') }}
                    {{ content.tm | examScoreFilter }}
                    {{ $t('分。至少有两个选项是正确答案。）') }}</span>
                <span
                    v-else
                >{{ $t('（共') + content.ic + $t('小题，') + $t('总分') }}{{ content.tm | examScoreFilter }}{{ $t('分。至少有一个选项是正确答案。）') }}</span>
            </div>
        </div>
        <div
            v-for="(item, index) in content.ics"
            :id="'question' + item.no"
            :key="index"
            class="question__item"
        >
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
                <!--<div v-if="scorePre">-->
                <!--<svg-icon-->
                <!--icon-class="right"-->
                <!--class-name="question__status"-->
                <!--v-if="recordMap[item.id].realScore > 0"-->
                <!--&gt;</svg-icon>-->
                <!--<svg-icon icon-class="wrong" class-name="question__status" v-else></svg-icon>-->
                <!--</div>-->
                <div v-if="scorePre" class="question__score__eq">
                    <div>{{ recordMap[item.id].score }}</div>
                    <svg-icon icon-class="score_eq" class-name="score_eq"/>
                </div>
                <span class="question__order">{{ item.no }}、{{ '('+ item.m+'分)' }}</span>
                <exam-ct :ct="JSON.parse(item.ct)"/>
            </div>
            <div class="question__select">
                <div v-for="(sItem,sIndex) in item.ios" :key="sIndex" class="flex__row">
                    <el-checkbox
                        :checked="(recordMap[item.id].answer || '').split(',').includes(sIndex.toString())"
                        :label="sIndex.toString()"
                        disabled
                    >
                        <span>{{ getEnglishLetter(sIndex) }}、</span>
                    </el-checkbox>
                    <exam-ct :ct="JSON.parse(sItem.ct)"/>
                </div>
            </div>
            <div class="question__analysis">
                <label>{{ $t('正确答案'+'：') }}</label>
                <div>{{ item.a }}</div>
            </div>
            <div class="question__analysis" :class="{'hide__analysis': !showAnalysis}">
                <label>{{ $t('解析'+'：') }}</label>
                <exam-ct v-if="item.ep" :ct="JSON.parse(item.ep)"/>
            </div>
        </div>
    </article>
</template>
<script>
    import {getEnglishLetter} from '@/utils';
    import ExamCt from '@/components/VelnFileForExam/ExamCt';

    export default {
        name: 'PaperMultiple',
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
            title: {
                type: String,
                default: '多选题'
            },
            showAnalysis: {
                // 显示隐藏解析
                type: Boolean,
                default: true
            },
            scoreOpt: {
                // 评分input
                type: Boolean,
                default: false
            },
            scorePre: {
                // 评分预览
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
        created() {
        },
        methods: {
            getEnglishLetter
        }
    };
</script>
