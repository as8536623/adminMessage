<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="exam__block">
        <div class="exam__tips">{{ $t('(只有一个选项是正确答案)') }}</div>
        <div class="exam__item">
            <exam-content :title="$t('题干内容')" :content="editQuery.ct"/>
        </div>
        <div class="exam__item">
            <exam-option :ios="editQuery.ios"/>
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
        name: 'Single',
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
