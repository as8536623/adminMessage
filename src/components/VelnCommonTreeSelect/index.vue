<style lang="scss" scoped>
@import './style';
</style>

<template>
    <article class="veln__organize__select">
        <section class="vos__tree__wrapper">
            <qgu-tree
                type="dialog"
                :datalist="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                :current-node-key="active.id"
                :default-expand-all="defaultExpandAll"
                :show-include-child="showIncludeChild"
                @node-click="nodeClick"
            >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span class="organize__tree__text" @dblclick="nodeDbClick(data)">{{ data.name }}</span>
                </span>
            </qgu-tree>
        </section>
    </article>
</template>

<script>
    import {getNodeTree} from '@/api/commonTree';
    import QguTree from '@/components/QguTree';
    import {getUcCode} from '@/utils/ajax';

    export default {
        name: 'VelnGroupCategorySelect',
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
            funCode: {
                type: String,
                default: ''
            },
            funName: {
                type: String,
                default: ''
            },
            defaultExpandAll: {
                type: Boolean,
                default: false
            },
            onSelected: {
                type: Function,
                default: null
            },
            showIncludeChild: {
                type: Boolean,
                default: true
            },
            appCode: {
                type: String,
                default: getUcCode()
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
            this.getNodeTree();
        },
        methods: {
            getNodeTree() {
                getNodeTree(this.funCode, this.appCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取岗位类别出错'));
                    }
                });
            },
            nodeClick(data) {
                this.active = data;
            },
            nodeDbClick(data) {
                this.active = data;
                this.onSelected();
            },
            getActive() {
                return this.active;
            }
        }
    };
</script>
