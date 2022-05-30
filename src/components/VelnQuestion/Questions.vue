<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="exam__block">
        <div class="exam__item">
            <exam-content :title="$t('题干内容')" :content="editQuery.ct"/>
        </div>
        <div class="exam__item">
            <div class="exam__nav">
                <div class="exam__title">{{ $t('参考答案') }}</div>
            </div>
            <!--文本框-->
            <el-input v-model="editQuery.a" type="textarea" rows="6"/>
        </div>
        <div class="exam__item exam__analyze">
            <exam-content :title="$t('试题解析')" :content="editQuery.ep"/>
        </div>
    </article>
</template>
<script>
    import ExamContent from './Content';

    export default {
        name: 'Questions',
        components: {
            ExamContent
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
