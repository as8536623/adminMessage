<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="exam__block">
        <div v-if="type" class="exam__tips">{{ $t('(至少有一个选项是正确答案)') }}</div>
        <div v-else class="exam__tips">{{ $t('(至少有两个选项是正确答案)') }}</div>
        <div class="exam__item">
            <exam-content :title="$t('题干内容')" :content="editQuery.ct"/>
        </div>
        <div class="exam__item">
            <exam-option :ios="editQuery.ios" :single="false"/>
        </div>
        <div class="exam__item exam__analyze">
            <exam-content :title="$t('试题解析')" :content="editQuery.ep"/>
        </div>
    </article>
</template>
<script>
    import ExamContent from './Content';
    import ExamOption from './Option';

    export default {
        name: 'Multiple',
        components: {
            ExamContent,
            ExamOption
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {};
                }
            },
            type: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                editQuery: this.content
            };
        },
        watch: {
            content: {
                handler(val) {
                    this.editQuery = val;
                },
                immediate: true
            }
        },
        methods: {}
    };
</script>
