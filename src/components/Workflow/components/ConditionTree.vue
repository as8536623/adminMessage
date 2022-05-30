<style scoped lang="scss">
@import '../style.scss';
</style>

<template>
    <div>
        <section class="branch__sec">
            <button class="wf__btn branch__btn--add" @click="handleAddBranch(data, index)">添加条件</button>
            <template
                v-for="(node, idx) in data.children"
            >
                <branch-node
                    v-if="data.type === 'condition'"
                    :key="idx"
                    :data="node"
                    :index="idx"
                    :parent="data"
                    :total="data.children.length"
                    @add="handleNodeAdd"
                    @add-branch="handleAddBranch"
                    @click="handleNodeClick"
                    @delete="handleNodeDelete"
                    @cond-delete="handleCondNodeDelete"
                />
            </template>
        </section>
        <section class="node__sec">
            <div class="wf__add__node">
                <add-button @click="handleNodeAdd"/>
            </div>
        </section>
    </div>
</template>

<script>
/**
 * 分支总节点
 */
    import AddButton from './AddButton';
    export default {
        name: 'ConditionTree',
        components: {
            AddButton,
            BranchNode: () => import('./BranchNode.vue') // 解决循环调用 产生的报错
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        type: 'condition',
                        children: []
                    };
                }
            },
            parent: {
                type: [Array, Object],
                default() {
                    return {};
                }
            },
            index: {
                type: Number,
                default: 0
            }
        },
        methods: {
            handleNodeAdd(parent = this.parent, index = this.index, type) {
                // branch-node add listener
                if (typeof type !== 'undefined') {
                    this.$emit('add', parent, index, type);
                    return;
                }
                // add-button click
                this.$emit('add', this.parent, index, parent);
            },
            handleNodeClick(data) {
                this.$emit('click', data);
            },
            handleAddBranch(self = this.data, index = this.index) {
            // this.$emit('add-branch', self, index);
            },
            handleNodeDelete(parent, index) {
                this.$emit('delete', parent, index);
            },
            handleCondNodeDelete(parent, index) {
                this.$emit('cond-delete', parent, index, this.parent, this.index);
            }
        }
    };
</script>
