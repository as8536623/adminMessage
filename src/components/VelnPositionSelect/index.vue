<style lang="scss" scoped>
@import './style';
</style>

<template>
    <article class="veln__position__select">
        <section class="vos__tree__wrapper">
            <qgu-tree
                type="dialog"
                :datalist="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                :current-node-key="active.id"
                :show-include-child="false"
                :show-checkbox="showCheckbox"
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

    import {getPositionTree} from '@/api/position';

    export default {
        name: 'VelnPositionSelect',
        components: {
            QguTree
        },
        props: {
            category: {
                type: Boolean,
                default: false
            },
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
            getOrgTree() {
                getPositionTree()
                    .then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.treeData = [result.data];
                            this.defaultExpandedKeys = [result.data.id];
                        } else {
                            this.$errorMsg(
                                this.$t(result.msg || '获取岗位数据出错')
                            );
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            nodeClick(data) {
                this.active = data;
            },
            getActive() {
                return this.active;
            }
        }
    };
</script>
