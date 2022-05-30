<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="exam__block">
        <div class="exam__item">
            <exam-content :title="$t('题干内容')" :content="editQuery.ct"/>
        </div>
        <div class="exam__item exam__text__block">
            <div class="exam__nav">
                <div class="exam__text__title">{{ $t('正确答案') }}</div>
            </div>
            <div class="exam__text">
                <el-radio-group v-model="editQuery.t">
                    <el-radio :label="true">{{ $t('正确') }}</el-radio>
                    <el-radio :label="false">{{ $t('错误') }}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="exam__item exam__analyze">
            <exam-content :title="$t('试题解析')" :content="editQuery.ep"/>
        </div>
    </article>
</template>
<script>
    import ExamContent from './Content';

    export default {
        name: 'Judgment',
        components: {
            ExamContent
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        ct: '',
                        t: true
                    };
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
