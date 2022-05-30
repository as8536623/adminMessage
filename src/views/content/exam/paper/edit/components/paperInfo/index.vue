<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="paper__container">
        <div class="paper__time">
            <div v-if="editQuery.security" class="label__icon"/>
            <div class="paper__name" :title="editQuery.paperName">{{ editQuery.paperName }}</div>
        </div>
        <div class="paper__info">
            <div class="paper__desc">
                <div class="paper__item">
                    <label class="paper__label">{{ $t('试卷类型'+'：') }}</label>
                    {{ editQuery.paperType === 'FIXED' ? $t('固定卷') : $t('随机卷') }}
                </div>
                <div class="paper__item">
                    <label class="paper__label">{{ $t('总题数'+'：') }}</label>
                    {{ fixedComputed + randomComputed }}
                </div>
            </div>
            <div>
                <el-button type="primary" @click="previewPaper">{{ $t('预览试卷') }}</el-button>
            </div>
        </div>
        <div class="question__list">
            <div class="paper__question__item">
                <div class="question__title">{{ $t('必考题') }}{{ $t('（共') + fixedComputed + $t('道）') }}，
                    {{ $t('总分') + scoreComputed + $t('分）') }}
                </div>
                <div v-for="(item, key) in info" :key="key" class="question__type">
                    {{ QUESTION_TYPE_ENUM[key] + '：' }}{{ item.length }}
                </div>
            </div>
            <div v-if="editQuery.paperType !== 'FIXED' && step === 2" class="paper__question__item">
                <div class="question__title">{{ $t('随机题') }}{{ $t('（共') + randomComputed + $t('道）') }}
                </div>
                <template v-for="(item, key) in summary">
                    <div v-if="item > 0" :key="key" class="question__type">
                        {{ QUESTION_ORDER_ENUM[key] + '：' }}{{ item }}
                    </div>
                </template>
            </div>
        </div>
    </article>
</template>
<script>
    export default {
        name: 'PaperInfo',
        props: {
            info: {
                type: Object,
                default() {
                    return {};
                }
            },
            editQuery: {
                type: Object,
                default() {
                    return {};
                }
            },
            summary: {
                type: Object,
                default() {
                    return {};
                }
            },
            step: {
                type: Number,
                default: 1
            }
        },
        data() {
            const QUESTION_TYPE_ENUM = Object.freeze({
                FILL: this.$t('填空题'),
                INDEFINITE_SELECTION: this.$t('不定项选择题'),
                JUDGMENT: this.$t('判断题'),
                MULTI_SELECTION: this.$t('多选题'),
                QUESTIONS: this.$t('问答题'),
                SINGLE_SELECTION: this.$t('单选题')
            });
            const QUESTION_ORDER_ENUM = Object.freeze({
                1: this.$t('单选题'),
                2: this.$t('多选题'),
                3: this.$t('不定项选择题'),
                4: this.$t('判断题'),
                5: this.$t('填空题'),
                6: this.$t('问答题')
            });
            return {
                QUESTION_TYPE_ENUM,
                QUESTION_ORDER_ENUM
            };
        },
        computed: {
            randomComputed() {
                let total = 0;
                for (const value of Object.values(this.summary)) {
                    total += value;
                }
                return total;
            },
            fixedComputed() {
                let total = 0;
                if (!this.info) {
                    return total;
                }
                for (const value of Object.values(this.info)) {
                    total += value.length;
                }
                return total;
            },
            scoreComputed() {
                let score = 0;
                if (!this.info) {
                    return score;
                }
                for (const value of Object.values(this.info)) {
                    value.map(item => {
                        score += item.mark;
                    });
                }
                return score;
            }
        },
        methods: {
            previewPaper() {
                this.$emit('preview');
            }
        }
    };
</script>
