<style lang="scss" scoped>
    @import './style';
</style>

<template>
    <article class="veln__group__select">
        <section class="vos__tree__wrapper">
            <qgu-tree
                type="dialog"
                :datalist="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                :current-node-key="active.id"
                :show-include-child="false"
                :check-strictly="checkStrictly"
                :show-checkbox="showCheckbox"
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
    import {getClassroomTree, getGroupTree} from '@/api/group';
    import {getNodeTree} from '@/api/commonTree';

    export default {
        name: 'VelnGroupSelect',
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
            type: {
                type: String,
                default: 'CATEGORY'
            },
            orgId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                treeData: [],
                defaultExpandedKeys: [],
                active: this.activeNode,
                funCode: 'uc_group_category'
            };
        },
        created() {
            this.getGroupTree();
        },
        methods: {
            getGroupTree() {
                if (this.type === 'CHILD') {
                    const params = {
                        schoolId: this.orgId
                    };
                    getClassroomTree(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.treeData = result.data.child;
                        } else {
                            this.$errorMsg(this.$t(result.msg || '获取岗位类别出错'));
                        }
                    });
                    return;
                }
                if (this.type === 'CATEGORY') {
                    getNodeTree(this.funCode).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.treeData = result.data.child;
                        } else {
                            this.$errorMsg(this.$t(result.msg || '获取岗位类别出错'));
                        }
                    });
                    return;
                }
                getGroupTree().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.defaultExpandedKeys = [result.data.id];
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
