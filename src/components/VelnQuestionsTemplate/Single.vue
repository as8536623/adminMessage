<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="question__template__container">
        <div class="question__label">
            {{ $t('单选题') }}
            {{ $t('（共') + list.length + $t('小题，') + $t('总分') + scoreComputed + $t('分）') }}
        </div>
        <div
            v-for="(item, index) in list"
            :key="index"
            class="question__item"
            :class="{'disabled__opt': !opt}"
        >
            <div class="question__name">
                <span class="question__order">{{ index+1 }}、{{ '('+ item.mark+'分)' }}</span>
                <exam-ct :ct="JSON.parse(item.itemDetail.ics.ct)"/>
            </div>
            <div class="question__select">
                <div v-for="(sItem,sIndex) in item.itemDetail.ics.ios" :key="sIndex" class="flex__row">
                    <el-radio v-model="sItem.t" :label="sItem.t ? sItem.t : ''" disabled>
                        <span>{{ sItem.so }}、</span>
                    </el-radio>
                    <exam-ct :ct="JSON.parse(sItem.ct)"/>
                </div>
            </div>
            <div class="question__analysis" :class="{'hide__analysis': !showAnalysis}">
                <label>{{ $t('解析'+'：') }}</label>
                <exam-ct v-if="item.itemDetail.ics.ep" :ct="JSON.parse(item.itemDetail.ics.ep)"/>
            </div>
            <div class="question__rate">
                <label>{{ $t('难度'+'：') }}</label>
                <el-rate
                    v-model="item.level"
                    disabled
                    show-score
                    text-color="#FFD600;"
                    disabled-void-color="#ECECEC"
                    score-template=""
                />
            </div>
            <exam-operation :list="list" :index="index" @move="move" @del="del" @edit="edit"/>
        </div>
    </article>
</template>
<script>
    import {TEST_QUESTION_LEVEL_ENUM} from '@/enum';
    import ExamCt from '@/components/VelnFileForExam/ExamCt';
    import ExamOperation from './components/Operation';

    export default {
        name: 'PaperSingle',
        components: {
            ExamCt,
            ExamOperation
        },
        props: {
            list: {
                type: Array,
                default() {
                    return [];
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
            return {
                TEST_QUESTION_LEVEL_ENUM,
                texts: ['简单', '较简单', '中等', '较难', '困难']
            };
        },
        computed: {
            scoreComputed() {
                let score = 0;
                this.list.map(item => {
                    score += item.mark;
                });
                return score.toFixed(2);
            }
        },
        created() {
            this.list.map(item => {
                const level = this.TEST_QUESTION_LEVEL_ENUM.getName(item.level);
                item.level = this.texts.indexOf(level) + 1;
            });
        },
        methods: {
            move(id, flag) {
                this.$emit('move', id, flag);
            },
            del(id) {
                this.$emit('del', id);
            },
            edit(id) {
                this.$emit('edit', id);
            }
        }
    };
</script>
