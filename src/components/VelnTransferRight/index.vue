<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="veln__transfer__right">
        <section class="veln__transfer--center">
            <div>
                <el-button type="primary" class="vt__btn" @click="select">
                    {{ $t('选择') }}
                    <i class="el-icon-arrow-right"/>
                </el-button>
                <el-button class="vt__btn" @click="remove">
                    <i class="el-icon-arrow-left"/>
                    {{ $t('移除') }}
                </el-button>
            </div>
        </section>
        <section class="veln__transfer--right">
            <header class="veln__transfer__header">
                <div class="veln__transfer__header__wrapper">
                    <span class="transfer__title">
                        已选
                        <span v-if="showPage">（{{ rightTotal }}）</span>
                    </span>
                    <veln-transfer-search
                        v-if="showSearch"
                        v-model="rightName"
                        class="vts__search"
                        :placeholder="$t('搜索已选')"
                        :class="{'active': rightFocus}"
                        @show="searchChange('right')"
                        @enter="rightSearch"
                    />
                </div>
            </header>
            <div class="veln__transfer__main" :class="{'page--none': !showPage}">
                <veln-transfer-list
                    ref="list"
                    :show-search="showSearch"
                    :node-key="nodeKey"
                    :data="rightData"
                    @select="rightSelect"
                />
                <veln-transfer-page
                    v-if="showPage"
                    :total="rightTotal"
                    :page-num="rightPageNum"
                    :page-size="rightPageSize"
                    @current-change="rightPageChange"
                />
            </div>
        </section>
    </article>
</template>

<script>
    import VelnTransferSearch from './components/search';
    import VelnTransferList from './components/list';
    import VelnTransferPage from './components/page';

    export default {
        name: 'VelnTransfer',
        components: {
            VelnTransferSearch,
            VelnTransferList,
            VelnTransferPage
        },
        props: {
            nodeKey: {
                type: String,
                default: 'id'
            },
            leftData: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            showPage: {
                type: Boolean,
                default: true
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            leftTotal: {
                type: [String, Number],
                default: 0
            },
            leftPageNum: {
                type: [String, Number],
                default: 0
            },
            leftPageSize: {
                type: [String, Number],
                default: 10
            },
            rightData: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            rightTotal: {
                type: [String, Number],
                default: 0
            },
            rightPageNum: {
                type: [String, Number],
                default: 0
            },
            rightPageSize: {
                type: [String, Number],
                default: 10
            }
        },
        data() {
            return {
                leftName: '',
                rightName: '',
                leftFocus: false,
                rightFocus: false
            };
        },
        methods: {
            searchChange(type) {
                if (type === 'left') {
                    this.leftFocus = !this.leftFocus;
                } else {
                    this.rightFocus = !this.rightFocus;
                }
            },
            // 右边搜索
            rightSearch() {
                this.$emit('right-search', this.rightName);
            },
            // 右边分页变化
            rightPageChange(pageNum) {
                this.$emit('right-page-change', pageNum);
            },
            // 左边选择人员
            rightSelect(ids) {
                this.$emit('right-select', ids);
            },
            select() {
                this.$emit('select');
            },
            remove() {
                this.$emit('remove');
            },
            reset() {
                this.$refs.list.reset();
            }
        }
    };
</script>

