<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="question__container">
        <div class="question__label">
            <div class="question__label__item">
                {{ $t('填空题') }}
                {{ $t('（共') + content.ic + $t('小题，') + $t('总分') + content.tm + $t('分。答题规则：在横线中填写答案。）') }}
            </div>
            <el-button v-if="isEdit" type="text" @click="score">{{ $t('设置统一分值') }}</el-button>
        </div>
        <div
            v-for="(item, index) in content.ics"
            :key="index"
            class="question__item"
            :class="{'disabled__opt': !opt}"
        >
            <div class="question__name">
                <span class="question__order">{{ index+1 }}、{{ '('+ item.m+'分)' }}</span>
                <exam-ct :ct="JSON.parse(item.ct)"/>
            </div>
            <div class="question__analysis">
                <label>{{ $t('答案'+'：') }}</label>
                <span>{{ item.a ? item.a : '暂无' }}</span>
            </div>
            <div class="question__analysis" :class="{'hide__analysis': !showAnalysis}">
                <label>{{ $t('解析'+'：') }}</label>
                <exam-ct v-if="item.ep" :ct="JSON.parse(item.ep)"/>
            </div>
            <exam-operation :list="content.ics" :index="index" :is-edit="isEdit" @move="move" @del="del" @edit="edit"/>
        </div>
    </article>
</template>
<script>
    import ExamCt from '@/components/VelnFileForExam/ExamCt';
    import ExamOperation from '../VelnQuestionsTemplate/components/Operation';
    export default {
        name: 'PaperFill',
        components: {
            ExamCt,
            ExamOperation
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {};
                }
            },
            opt: { // 移动，删除操作
                type: Boolean,
                default: true
            },
            isEdit: { // 编辑,设置统一分值
                type: Boolean,
                default: false
            },
            showAnalysis: { // 显示隐藏解析
                type: Boolean,
                default: true
            }
        },
        data() {
            return {};
        },
        watch: {},
        created() {},
        methods: {
            move(id, flag) {
                this.$emit('move', id, flag);
            },
            del(id) {
                this.$emit('del', id);
            },
            edit(id) {
                this.$emit('edit', id, 'FILL');
            },
            score() {
                this.$emit('score', 'FILL');
            }
        }
    };
</script>
