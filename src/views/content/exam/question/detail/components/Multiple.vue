<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="question__detail__block">
        <div class="question__ct">
            <span class="question__type">[{{ title }}]</span>
            <span>（{{ editQuery.mark + $t('分') }}）</span>
            <exam-ct :ct="editQuery.content.ct"/>
        </div>
        <div class="question__ios">
            <div v-for="(sItem,sIndex) in editQuery.content.ios" :key="sIndex" class="flex__row">
                <el-checkbox v-model="sItem.t" :label="sItem.t ? sItem.t : ''" disabled>
                    <span>{{ getEnglishLetter(sIndex) }}、</span>
                </el-checkbox>
                <exam-ct :ct="sItem.ct"/>
            </div>
        </div>
        <div class="question__a">
            <label>{{ $t('正确答案'+'：') }}</label>
            <div v-html="editQuery.content.a"/>
        </div>
    </article>
</template>
<script>
    import {getEnglishLetter} from '@/utils';
    import ExamCt from '@/components/VelnFileForExam/ExamCt';
    export default {
        name: 'Multiple',
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
            }
        },
        data() {
            return {
                editQuery: this.content,
                getEnglishLetter
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
