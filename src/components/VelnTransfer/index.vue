<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="veln__transfer">
        <section class="veln__transfer--left">
            <header class="veln__transfer__header">
                <div class="veln__transfer__header__wrapper">
                    <span class="transfer__title">待选（{{ leftTotal }}）</span>
                    <veln-transfer-search
                        v-model="leftName"
                        class="vts__search"
                        :placeholder="$t('搜索待选')"
                        :class="{'active': leftFocus}"
                        @show="searchChange('left')"
                        @enter="leftSearch"
                    />
                </div>
            </header>
            <div class="veln__transfer__main">
                <veln-transfer-list ref="leftList" :data="leftData" @select="leftSelect"/>
                <veln-transfer-page
                    :total="leftTotal"
                    :page-num="leftPageNum"
                    :page-size="leftPageSize"
                    @current-change="leftPageChange"
                />
            </div>
        </section>
        <section class="veln__transfer--center">
            <div>
                <el-button type="primary" class="vt__btn" @click="select">
                    {{ $t('选择') }}
                    <svg-icon class-name="vt__icon" icon-class="right_s"/>
                </el-button>
                <el-button
                    v-if="showAllSelect"
                    type="primary"
                    class="vt__btn"
                    @click="selectAll"
                >{{ $t('全部选择') }}</el-button>
                <el-button v-if="showAllRemove" class="vt__btn" @click="removeAll">{{ $t('全部移除') }}</el-button>
                <el-button class="vt__btn" @click="remove">
                    <svg-icon class-name="vt__icon" icon-class="left_s"/>
                    {{ $t('移除') }}
                </el-button>
            </div>
        </section>
        <section class="veln__transfer--right">
            <header class="veln__transfer__header">
                <div class="veln__transfer__header__wrapper">
                    <span class="transfer__title">已选（{{ rightTotal }}）</span>
                    <veln-transfer-search
                        v-if="showRightSearch"
                        v-model="rightName"
                        class="vts__search"
                        :placeholder="$t('搜索已选')"
                        :class="{'active': rightFocus}"
                        @show="searchChange('right')"
                        @enter="rightSearch"
                    />
                </div>
            </header>
            <div
                class="veln__transfer__main"
                :class="{'page--none': !showRightPage}"
            >
                <veln-transfer-list ref="rightList" :data="rightData" @select="rightSelect"/>
                <veln-transfer-page
                    v-if="showRightPage"
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
            leftData: {
                type: Array,
                default: () => {
                    return [];
                }
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
            showRightSearch: {
                type: Boolean,
                default: true
            },
            showRightPage: {
                type: Boolean,
                default: true
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
            },
            showAllSelect: {
                type: Boolean,
                default: true
            },
            showAllRemove: {
                type: Boolean,
                default: true
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
            // 左边搜索
            leftSearch() {
                this.$emit('left-search', this.leftName);
            },
            // 右边搜索
            rightSearch() {
                this.$emit('right-search', this.rightName);
            },
            // 左边分页变化
            leftPageChange(pageNum) {
                this.$emit('left-page-change', pageNum);
            },
            // 右边分页变化
            rightPageChange(pageNum) {
                this.$emit('right-page-change', pageNum);
            },
            // 左边选择人员
            leftSelect(ids) {
                this.$emit('left-select', ids);
            },
            // 左边选择人员
            rightSelect(ids) {
                this.$emit('right-select', ids);
            },
            select() {
                this.$emit('select');
            },
            selectAll() {
                this.$emit('select-all');
            },
            remove() {
                this.$emit('remove');
            },
            removeAll() {
                this.$emit('remove-all');
            },
            reset() {
                this.$refs.leftList.reset();
                this.$refs.rightList.reset();
            }
        }
    };
</script>

