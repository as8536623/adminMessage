<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="question__detail__block">
        <div class="question__ct">
            <span class="question__type">[{{ $t('判断题') }}]</span>
            <span>（{{ editQuery.mark + $t('分') }}）</span>
            <exam-ct :ct="editQuery.content.ct"/>
        </div>
        <div class="question__a">
            <label>{{ $t('正确答案'+'：') }}</label>
            <div>{{ editQuery.content.t ? $t('正确') : $t('错误') }}</div>
        </div>
    </article>
</template>
<script>
    import ExamCt from '@/components/VelnFileForExam/ExamCt';
    export default {
        name: 'Judgement',
        components: {
            ExamCt
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
        }
    };
</script>
