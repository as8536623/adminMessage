<style lang="scss" scoped>
@import './style';
</style>

<template>
    <article class="veln__organize__select">
        <section class="vos__tree__wrapper">
            <qgu-tree
                ref="tree"
                type="dialog"
                :datalist="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                :current-node-key="active.id"
                :show-include-child="false"
                :show-checkbox="showCheckbox"
                :default-checked-keys="defaultCheckedKeys"
                :check-on-click-node="checkOnClickNode"
                :check-strictly="checkStrictly"
                @node-click="nodeClick"
            >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span class="organize__tree__text">{{ data.name }}</span>
                </span>
            </qgu-tree>
        </section>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {getOrgTree} from '@/api/org';

    export default {
        name: 'VelnOrganizeSelect',
        components: {
            QguTree
        },
        props: {
            activeNode: {
                type: Object,
                default: () => {
                    return {
                        id: '',
                        name: ''
                    };
                }
            },
            // 显示复选框
            showCheckbox: {
                type: Boolean,
                default: false
            },
            // 是否严格的遵循父子不互相关联的做法
            checkStrictly: {
                type: Boolean,
                default: false
            },
            checkOnClickNode: {
                type: Boolean,
                default: false
            },
            defaultCheckedKeys: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            disabledKeys: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                treeData: [],
                defaultExpandedKeys: [],
                active: this.activeNode
            };
        },
        created() {
            this.getOrgTree();
        },
        methods: {
            // 已选择的节点 disabled
            formatDisabledNode(arr, node) {
                if (arr.includes(node.id)) {
                    node.disabled = true;
                }
                if (Array.isArray(node.child) && node.child.length) {
                    node.child.map(item => {
                        this.formatDisabledNode(arr, item);
                    });
                }
            },
            getOrgTree() {
                getOrgTree().then(re => {
                    const result = re.data;
                    if (result.success) {
                        const item = result.data;
                        if (
                            Array.isArray(this.disabledKeys) &&
                            this.disabledKeys.length
                        ) {
                            this.formatDisabledNode(this.disabledKeys, item);
                        }
                        this.treeData = [item];
                        this.defaultExpandedKeys = [item.id];
                    }
                });
            },
            nodeClick(data) {
                this.active = data;
            },
            getActive() {
                if (this.showCheckbox) {
                    return this.$refs.tree.getCheckedNodes();
                }
                return this.active;
            }
        }
    };
</script>
