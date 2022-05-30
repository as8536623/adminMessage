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
                    <!-- === false 为了防止category为空的情况 -->
                    <svg-icon
                        v-if="data.category === false"
                        icon-class="question_category"
                        class-name="question__category"
                    />
                    <span class="organize__tree__text" @dblclick="selectNode(data)">{{ data.name }}</span>
                </span>
            </qgu-tree>
        </section>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {listBankTree} from '@/api/exam/item/item';

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
                listBankTree()
                    .then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.treeData = [result.data];
                            this.defaultExpandedKeys = [result.data.id];
                        } else {
                            this.$errorMsg(
                                this.$t(result.msg || '获取题库数据出错')
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
            },
            selectNode(data) {
                this.$emit('select', data);
            }
        }
    };
</script>
