<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="qgu__tree" :class="{'dialog': type==='dialog', 'form': type==='form'}">
        <div v-if="showSearch" class="organize__search">
            <el-input
                v-model.trim="filterText"
                class="organize__search__npt"
                :placeholder="$t('输入关键字进行过滤')"
                @keyup.enter.native="treeFilter"
            />
            <span class="organize__search__icon" @click="treeFilter">
                <svg-icon icon-class="search"/>
            </span>
            <span v-show="filterText" class="organize__clear" @click="clear">
                <svg-icon icon-class="close_o"/>
            </span>
        </div>
        <div class="qgu__tree__wrapper">
            <el-tooltip v-if="!hasBgk" class="item" effect="dark" :content="$t('包含子类')" placement="top">
                <i
                    v-if="showIncludeChild"
                    class="el-icon-connection include__child"
                    :class="{'active': bIncludeChild}"
                    @click="includeChildChange"
                />
            </el-tooltip>
            <el-tree
                :key="treeKey"
                ref="tree"
                node-key="id"
                :data="treeData"
                :props="defaultProps"
                :current-node-key="currNodeKey"
                :default-checked-keys="defaultCheckedKeys"
                :default-expanded-keys="expandedKeys"
                :expand-on-click-node="expandOnClickNode"
                :filter-node-method="filterNode"
                :default-expand-all="defaultExpandAll"
                :show-checkbox="showCheckbox"
                :check-strictly="checkStrictly"
                :highlight-current="true"
                @check="check"
                @node-click="nodeClick"
                @node-expand="nodeExpand"
                @node-collapse="nodeCollapse"
            >
                <span slot-scope="{ node, data }">
                    <slot v-if="slotShow" :data="data"/>
                    <span v-if="!slotShow">{{ data[defaultProps.label] }}</span>
                </span>
            </el-tree>
        </div>
    </div>
</template>

<script>
    import {getIdsByHierarchy, initTreeData} from './utils';

    export default {
        name: 'QguTree',
        props: {
            type: {
                type: String,
                default: 'form' // dialog / form
            },
            // tree data
            datalist: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            // 默认展开key
            defaultExpandedKeys: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            // 默认展开层级
            hierarchy: {
                type: [String, Number],
                default: 3
            },
            // 点击node展开树节点
            expandOnClickNode: {
                type: Boolean,
                default: false
            },
            // 当前active node
            currentNodeKey: {
                type: String,
                default: ''
            },
            // 默认选中的节点
            defaultCheckedKeys: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            // props
            defaultProps: {
                type: Object,
                default: () => {
                    return {
                        children: 'child',
                        label: 'name'
                    };
                }
            },
            // 是否默认展开所有节点
            defaultExpandAll: {
                type: Boolean,
                default: false
            },
            // 搜索框
            showSearch: {
                type: Boolean,
                default: true
            },
            // 包含子类
            showIncludeChild: {
                type: Boolean,
                default: true
            },
            // 包含子类
            includeChild: {
                type: Boolean,
                default: true
            },
            // 显示复选框
            showCheckbox: {
                type: Boolean,
                default: false
            },
            // 父子不互相关联
            checkStrictly: {
                type: Boolean,
                default: false
            },
            // 是否隐藏包含子类按钮
            hidden: {
                type: Boolean,
                default: false
            }
        },
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            return {
                hasBgk, // 北国会
                treeKey: null,
                treeData: this.datalist, // 树数据
                filterText: '', // 搜索字符
                expandedKeys: this.defaultExpandedKeys,
                bIncludeChild: false,
                currNodeKey: this.currentNodeKey
            };
        },
        computed: {
            slotShow() {
                return !!this.$scopedSlots.default;
            }
        },
        watch: {
            datalist(val) {
                this.bIncludeChild = this.includeChild;
                this.initTreeData(val);
            },
            defaultExpandedKeys(val) {
                this.expandedKeys = val;
            },
            currentNodeKey(val) {
                setTimeout(() => {
                    this.currNodeKey = val;
                    this.$refs.tree.setCurrentKey(val);
                }, 500);
            }
        },
        methods: {
            getReturnNode(node, _array, value) {
                const isPass =
                    node.data &&
                    node.data.name &&
                    node.data.name.toLowerCase().indexOf(value.toLowerCase()) !==
                    -1;
                isPass ? _array.push(isPass) : '';
                this.index++;
                if (!isPass && node.level !== 1 && node.parent) {
                    this.getReturnNode(node.parent, _array, value);
                }
            },
            filterNode(value, data, node) {
                if (!value) {
                    return true;
                }
                const _array = []; // 这里使用数组存储 只是为了存储值。
                this.getReturnNode(node, _array, value);
                let result = false;
                _array.forEach(item => {
                    result = result || item;
                });
                return result;
            },
            initTreeData(data) {
                this.treeData = initTreeData(data);
                this.$nextTick(() => {
                    if (!this.defaultExpandedKeys.length) {
                        this.expandedKeys = getIdsByHierarchy(data, this.hierarchy);
                    }
                    if (this.showCheckbox) {
                        this.setCheckedKeys();
                    }
                });
            },
            // 节点展开事件
            nodeExpand(data) {
                const idx = this.expandedKeys.indexOf(data.id);
                if (idx === -1) {
                    this.expandedKeys.push(data.id);
                }
            },
            clear() {
                this.filterText = '';
                this.treeFilter();
            },
            // 节点收起事件
            nodeCollapse(data) {
                const idx = this.expandedKeys.indexOf(data.id);
                if (idx > -1) {
                    this.expandedKeys.splice(idx, 1);
                }
            },
            filter(value) {
                this.$refs.tree.filter(value);
            },
            treeFilter() {
                this.filter(this.filterText);
            },
            nodeClick(data, node, list) {
                this.$emit('node-click', data, node, list, this.bIncludeChild);
            },
            includeChildChange() {
                this.bIncludeChild = !this.bIncludeChild;
                this.$emit('include-child-change', this.bIncludeChild);
            },
            check(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
                this.$emit(
                    'check',
                    checkedNodes,
                    checkedKeys,
                    halfCheckedNodes,
                    halfCheckedKeys
                );
            },
            setCurrentKey(key, cb) {
                setTimeout(() => {
                    this.$refs.tree.setCurrentKey(key);
                    cb();
                }, 500);
            },
            getCurrentNode() {
                return this.$refs.tree.getCurrentNode();
            },
            getCheckedNodes(key) {
                return this.$refs.tree.getCheckedNodes();
            },
            setCheckedKeys() {
                this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
            }
        }
    };
</script>
