<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="question__container">
        <div class="question__label">
            <div class="question__label__item">
                {{ $t(title) }}
                <span v-if="title === '多选题'">
                    {{ $t('（共') + content.ic + $t('小题，') + $t('总分') + content.tm + $t('分。至少有两个选项是正确答案。）') }}
                </span>
                <span v-else>
                    {{ $t('（共') + content.ic + $t('小题，') + $t('总分') + content.tm + $t('分。至少有一个选项是正确答案。）') }}
                </span>
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
            <div class="question__select">
                <div v-for="(sItem,sIndex) in item.ios" :key="sIndex" class="flex__row">
                    <el-checkbox v-model="sItem.t" :label="sItem.t ? sItem.t : ''" disabled>
                        <span>{{ getEnglishLetter(sIndex) }}、</span>
                    </el-checkbox>
                    <exam-ct :ct="JSON.parse(sItem.ct)"/>
                </div>
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
    import {getEnglishLetter} from '@/utils';
    import ExamCt from '@/components/VelnFileForExam/ExamCt';
    import ExamOperation from '../VelnQuestionsTemplate/components/Operation';
    export default {
        name: 'PaperMultiple',
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
            title: {
                type: String,
                default: '多选题'
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
        created() {},
        methods: {
            getEnglishLetter,
            move(id, flag) {
                this.$emit('move', id, flag);
            },
            del(id) {
                this.$emit('del', id);
            },
            edit(id) {
                let type = 'INDEFINITE_SELECTION';
                if (this.title === '多选题') {
                    type = 'MULTI_SELECTION';
                }
                this.$emit('edit', id, type);
            },
            score() {
                let type = 'INDEFINITE_SELECTION';
                if (this.title === '多选题') {
                    type = 'MULTI_SELECTION';
                }
                this.$emit('score', type);
            }
        }
    };
</script>
