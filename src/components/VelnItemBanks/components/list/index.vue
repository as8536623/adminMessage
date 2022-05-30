<style lang="scss" scoped>
@import './style';
</style>

<template>
    <div class="veln__item__bank__list">
        <div v-if="!data.length" class="veln__item__bank--empty">{{ $t('暂无数据') }}</div>
        <div
            v-for="(item, index) in data"
            :key="index"
            class="veln__item__bank__item"
            :class="{'active': selectedIdList.includes(item.id)}"
            @click.prevent="handleCheckedChange(item, index)"
        >
            <div class="item__info">
                <div class="item__bankName" :title="item.bankName">{{ item.bankName }}</div>
                <div class="item__desc">
                    <span class="item__total">{{ $t('题目总数'+'：') }}{{ item.allNumber }}</span>
                    <el-button type="text" @click.stop="preview(item, index)">{{ $t('预览') }}</el-button>
                </div>
            </div>
            <div class="item__option__list">
                <div class="option__item">
                    <span>{{ $t('单选题')+'：' }}{{ item.singleNumber }}</span>
                </div>
                <div class="option__item">
                    <span>{{ $t('多选题')+'：' }}{{ item.multiNumber }}</span>
                </div>
                <div class="option__item">
                    <span>{{ $t('不定项选择')+'：' }}{{ item.indefiniteNumber }}</span>
                </div>
                <div class="option__item">
                    <span>{{ $t('判断题')+'：' }}{{ item.judgmentNumber }}</span>
                </div>
                <div class="option__item">
                    <span>{{ $t('填空题')+'：' }}{{ item.fillNumber }}</span>
                </div>
                <div class="option__item">
                    <span>{{ $t('问答题')+'：' }}{{ item.questionsNumber }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {deepClone} from '@/utils';
    export default {
        name: 'VelnItemBankList',
        props: {
            data: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            active: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                selectedIdList: [],
                selectedList: deepClone(this.active || [])
            };
        },
        watch: {
            active: {
                handler(v) {
                    this.selectedList = deepClone(v || []);
                    this.formatActiveIds();
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            formatActiveIds() {
                const ids = [];
                this.selectedList.map(item => {
                    ids.push(item.id);
                });
                this.selectedIdList = ids;
            },
            handleCheckedChange(v, index) {
                if (!v) {
                    return;
                }
                if (v.allNumber === 0) {
                    this.$warnMsg(this.$t('该题库下没有题目供选择'));
                    return;
                }
                const idx = this.selectedIdList.indexOf(v.id);
                if (idx > -1) {
                    this.selectedList.splice(idx, 1);
                    this.selectedIdList.splice(idx, 1);
                } else {
                    this.selectedList.push(v);
                    this.selectedIdList.push(v.id);
                }
            },
            // 试卷预览
            preview(v) {
                if (!v) {
                    return;
                }
                if (v.allNumber === 0) {
                    this.$warnMsg(this.$t('该题库下没有题目供预览'));
                    return;
                }
                const routeData = this.$router.resolve({
                    name: 'paperPreview',
                    query: {id: v.id, itemAttribute: 'EXAM'}
                });
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>
