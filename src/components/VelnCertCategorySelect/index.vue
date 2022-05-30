<style lang="scss" scoped>
@import './style';
</style>

<template>
    <article class="veln__cert__category__select">
        <section class="vos__tree__wrapper">
            <qgu-tree
                ref="tree"
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
    import {getCertCategoryTree} from '@/api/cert/certCategory';

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
            this.getCertCategoryTree();
        },
        methods: {
            getCertCategoryTree() {
                getCertCategoryTree('cert').then(re => {
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
