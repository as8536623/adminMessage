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
                :default-expand-all="defaultExpandAll"
                :current-node-key="active.id"
                :hidden="hidden"
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
    import {getCategory} from '@/api/courseCategory';

    export default {
        name: 'VelnCourseCategorySelect',
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
            defaultExpandAll: {
                type: Boolean,
                default: false
            }, hidden: {
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
            this.getCategory();
        },
        methods: {
            getCategory() {
                getCategory().then(re => {
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
                return this.active;
            }
        }
    };
</script>
