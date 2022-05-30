<style lang="scss">
    @import url("./style.scss");
</style>

<template>
    <article class="qgu__transfer">
        <el-row :gutter="20">
            <el-col :span="6">
                <div v-if="title" class="qtt__title">
                    {{ title }}
                    <el-checkbox
                        v-if="includeChildren"
                        v-model="includeChild"
                        class="pull-right"
                        @change="includeChildrenChange"
                    >{{ $t('containsASubclass') }}
                    </el-checkbox>
                </div>
                <el-input
                    v-model.trim="filterText"
                    :maxlength="20"
                    class="qtt__tree__filter"
                    :placeholder="$t('enterKeywordsToFilter')"
                />
                <el-tree
                    ref="tree"
                    class="qtt__tree"
                    :class="{'has__title': !title}"
                    :data="treeData"
                    :props="treeProps"
                    :filter-node-method="filterNode"
                    :expand-on-click-node="false"
                    accordion
                    @node-click="handleNodeClick"
                />
            </el-col>
            <el-col :span="18">
                <qgu-transfer
                    ref="transfer"
                    :param="param"
                    :left-fields="leftFields"
                    :right-fields="rightFields"
                    :get-left-data-url="getLeftDataUrl"
                    :get-right-data-url="getRightDataUrl"
                    :opt-left-url="optLeftUrl"
                    :opt-right-url="optRightUrl"
                    :has-search="hasSearch"
                    :can-del="canDel"
                    @change="transferChangeEvent"
                />
            </el-col>
        </el-row>

    </article>
</template>

<script>
    import QguTransfer from '../QguTransfer/index';

    export default {
        name: 'QguTreeTransfer',
        components: {
            QguTransfer
        },
        props: {
            treeData: {
                type: [Array],
                default: null
            },
            treeProps: {
                type: [Object],
                default: () => {
                    return {children: 'children', label: 'label'};
                }
            },
            leftFields: {
                type: [Array],
                default: null
            },
            rightFields: {
                type: [Array],
                default: null
            },
            getLeftDataUrl: {
                type: [String],
                default: null
            },
            getRightDataUrl: {
                type: [String],
                default: null
            },
            optLeftUrl: {
                type: [String],
                default: null
            },
            optRightUrl: {
                type: [String],
                default: null
            },
            param: {
                type: [Object],
                default: null
            },
            title: {
                type: [String],
                default: null
            },
            includeChildren: {
                type: [Boolean],
                default: true
            },
            hasSearch: {
                type: [Boolean],
                default: false
            },
            treeNodeId: {
                type: [String],
                default: 'id'
            },
            canDel: {
                type: [Boolean],
                default: true
            }
        },
        data() {
            return {
                filterText: '',
                includeChild: true
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.param.includeChild = true;
            this.includeChild = true;
        },
        mounted() {
        },
        methods: {
            // trasfer change
            transferChangeEvent() {
                this.$emit('transferChangeEvent', true);
            },
            // tree node click
            handleNodeClick(node) {
                const transferParams = this.$refs.transfer.param;
                transferParams[this.treeNodeId] = node.id;
                transferParams.pageNum = 1;
                this.$refs.transfer.getLeftList(transferParams);
            },
            // tree filter
            filterNode(value, data) {
                if (!value) { return true; }
                return data.name.indexOf(value) !== -1;
            },
            includeChildrenChange(v) {
                this.includeChild = v;
                const transferParams = this.$refs.transfer.param;
                transferParams.includeChild = v;
                transferParams.pageNum = 1;
                this.$refs.transfer.getLeftList(transferParams);
            },
            reset() {
                this.$refs.transfer.param[this.treeNodeId] = '';
                this.$refs.transfer.param.pageNum = 1;
                this.$refs.transfer.getLeftList();
                this.$refs.transfer.getRightList();
            }
        }
    };
</script>
