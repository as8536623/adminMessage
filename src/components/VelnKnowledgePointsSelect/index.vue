<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="veln__point__select">
        <section class="vos__tree__wrapper">
            <qgu-tree
                ref="qguTree"
                type="dialog"
                :datalist="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                :current-node-key="active.id"
                :show-include-child="false"
                :show-checkbox="showCheckbox"
                :check-strictly="checkStrictly"
                :default-checked-keys="defaultCheckedKeys"
                :expand-on-click-node="expandOnClickNode"
                @node-click="nodeClick"
            >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span class="organize__tree__text" :class="{'point__category': data.category}" @dblclick="dblclick(data)">{{ data.name }}</span>
                </span>
            </qgu-tree>
        </section>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {listKnowledgeTree} from '@/api/exam/exam/knowledge';

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
            },
            defaultCheckedKeys: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            // 双击选中
            doubleClick: {
                type: Boolean,
                default: false
            },
            expandOnClickNode: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                treeData: [],
                active: this.activeNode,
                defaultExpandedKeys: []
            };
        },
        created() {
            this.listKnowledgeTree();
        },
        methods: {
            listKnowledgeTree() {
                listKnowledgeTree()
                    .then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.treeData = [result.data];
                            // 知识点类别不能选择
                            if (this.showCheckbox) {
                                this.treeData[0].disabled = true;
                                this.dataFormat(this.treeData[0].child || []);
                            }
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
                // if (this.doubleClick) {
                //     return;
                // }
                this.active = data;
            },
            getActive() {
                return this.active;
            },
            getActives() {
                return this.$refs.qguTree.getCheckedNodes();
            },
            dataFormat(list) {
                list.length && list.map(item => {
                    item.category ? item.disabled = true : null;
                    if (item.child && item.child.length) {
                        this.dataFormat(item.child);
                    }
                });
            },
            dblclick(data) {
                if (!this.doubleClick) {
                    return;
                }
                this.active = data;
                this.$emit('dblclick');
            }
        }
    };
</script>
