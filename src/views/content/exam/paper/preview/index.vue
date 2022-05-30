<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="paper__preview__container">
        <div v-if="!itemAttribute" class="preview__header">
            <div v-if="info.security" class="preview__label"/>
            <div class="preview__nav">
                <div class="preview__info">
                    <div class="paper__name">{{ info.paperName }}</div>
                    <div class="info__item">
                        <span>{{ $t('共') + subjectComputed + $t('小题') }}</span>
                        <span>{{ $t('满分'+'：') + scoreComputed + $t('分') }}</span>
                        <el-link :underline="false" @click="showAnalysis = !showAnalysis">
                            <svg-icon class-name="view" :icon-class="showAnalysis ? 'eye' : 'view'"/>
                            {{ showAnalysis ? $t('隐藏答案解析') : $t('显示答案解析') }}
                        </el-link>
                    </div>
                </div>
                <div class="preview__type">{{ info.paperType === 'FIXED' ? $t('固定卷') : $t('随机卷') }}</div>
            </div>
        </div>
        <div v-if="item" class="preview__header">
            <div class="preview__nav">
                <div class="preview__info">
                    <div class="paper__name">{{ item.bankName }}</div>
                    <div class="info__item">
                        <span>{{ $t('总题数'+'：') + item.allNumber }}</span>
                        <span>{{ $t('单选题'+'：') + item.singleNumber }}</span>
                        <span>{{ $t('多选题'+'：') + item.multiNumber }}</span>
                        <span>{{ $t('不定项选择题'+'：') + item.indefiniteNumber }}</span>
                        <span>{{ $t('判断题'+'：') + item.judgmentNumber }}</span>
                        <span>{{ $t('填空题'+'：') + item.fillNumber }}</span>
                        <span>{{ $t('问答题'+'：') + item.questionsNumber }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="preview__content">
            <div v-if="!data" class="preview__empty">
                <svg-icon icon-class="preview_empty" class-name="preview__empty__icon"/>
                <div class="preview__empty__text">{{ $t('该试卷下无必考题') }}</div>
            </div>
            <div v-if="data">
                <paper-single
                    v-if="data['SINGLE_SELECTION']"
                    :list="data['SINGLE_SELECTION'].items"
                    :opt="false"
                    :is-edit="false"
                    :show-analysis="showAnalysis"
                />
                <paper-multiple
                    v-if="data['MULTI_SELECTION']"
                    :list="data['MULTI_SELECTION'].items"
                    :opt="false"
                    :is-edit="false"
                    :show-analysis="showAnalysis"
                />
                <paper-multiple
                    v-if="data['INDEFINITE_SELECTION']"
                    :list="data['INDEFINITE_SELECTION'].items"
                    title="不定项选择"
                    :opt="false"
                    :is-edit="false"
                    :show-analysis="showAnalysis"
                />
                <paper-judgement
                    v-if="data['JUDGMENT']"
                    :list="data['JUDGMENT'].items"
                    :opt="false"
                    :is-edit="false"
                    :show-analysis="showAnalysis"
                />
                <paper-fill
                    v-if="data['FILL']"
                    :list="data['FILL'].items"
                    :opt="false"
                    :is-edit="false"
                    :show-analysis="showAnalysis"
                />
                <paper-question
                    v-if="data['QUESTIONS']"
                    :list="data['QUESTIONS'].items"
                    :opt="false"
                    :is-edit="false"
                    :show-analysis="showAnalysis"
                />
            </div>
            <div class="paper__bottom">
                <el-button @click="close">{{ $t('关闭') }}</el-button>
            </div>
        </div>
    </article>
</template>
<script>
    import PaperSingle from '@/components/VelnQuestionsTemplate/Single';
    import PaperMultiple from '@/components/VelnQuestionsTemplate/Multiple';
    import PaperJudgement from '@/components/VelnQuestionsTemplate/Judgement';
    import PaperFill from '@/components/VelnQuestionsTemplate/Fill';
    import PaperQuestion from '@/components/VelnQuestionsTemplate/Questions';
    import {
        getBasic,
        viewPaper,
        viewItem,
        viewBank
    } from '@/api/paper/paperTemplate';

    export default {
        name: 'PaperPreview',
        components: {
            PaperSingle,
            PaperMultiple,
            PaperJudgement,
            PaperFill,
            PaperQuestion
        },
        data() {
            return {
                id: this.$route.query.id,
                info: {}, // 试卷基本信息
                data: {}, // 题目信息
                questionDialogVisible: false,
                editQuery: {},
                showAnalysis: true,
                itemAttribute: this.$route.query.itemAttribute,
                item: null
            };
        },
        computed: {
            subjectComputed() {
                let total = 0;
                if (!this.data) {
                    return total;
                }
                for (const value of Object.values(this.data)) {
                    total += value.itemCount;
                }
                return total;
            },
            scoreComputed() {
                let score = 0;
                if (!this.data) {
                    return score;
                }
                for (const value of Object.values(this.data)) {
                    score += value.totalMark;
                }
                return score.toFixed(2);
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.itemAttribute) {
                    this.showAnalysis = false;
                    // 随机题选择试题--预览
                    this.viewBank();
                    this.viewItem();
                } else {
                    // 试卷-预览
                    this.getBasic();
                    this.viewPaper();
                }
            },
            // 试卷基本信息
            getBasic() {
                const params = {paperTemplateId: this.id};
                getBasic(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.info = result.data || null;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            viewPaper() {
                const params = {id: this.id};
                viewPaper(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data || null;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            close() {
                window.close();
            },
            viewItem() {
                const params = {
                    bankId: this.id,
                    itemAttribute: this.itemAttribute,
                    isSecurity: false
                };
                viewItem(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data || null;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            viewBank() {
                const params = {
                    itemBankId: this.id,
                    itemAttribute: this.itemAttribute
                };
                viewBank(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.item = result.data || null;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
