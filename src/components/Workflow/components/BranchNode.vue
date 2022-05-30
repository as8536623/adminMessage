<style scoped lang="scss">
@import '../style.scss';
</style>

<template>
    <div class="branch__item">
        <div class="branch__item__line--center"/>
        <condition-node
            :data="data"
            :index="index"
            :parent="data"
            @add="handleNodeAdd"
            @click="handleNodeClick"
            @delete="handleCondNodeDelete"
        />
        <div v-for="(node, idx) in data.children" :key="idx">
            <apply-node
                v-if="node.type === 'apply'"
                :data="node"
                :index="idx"
                :parent="data"
                @add="handleNodeAdd"
                @click="handleNodeClick"
            />
            <audit-node
                v-if="node.type === 'audit'"
                :data="node"
                :index="idx"
                :parent="data"
                @add="handleNodeAdd"
                @click="handleNodeClick"
                @delete="handleNodeDelete"
            />
            <cc-node
                v-if="node.type === 'cc'"
                :data="node"
                :index="idx"
                :parent="data"
                @add="handleNodeAdd"
                @click="handleNodeClick"
                @delete="handleNodeDelete"
            />
            <condition-tree
                v-if="node.type === 'condition'"
                :data="node"
                :index="idx"
                :parent="data"
                @add="handleNodeAdd"
                @click="handleNodeClick"
                @add-branch="handleAddBranch"
                @delete="handleNodeDelete"
            />
        </div>
        <div v-if="index===0" class="branch__item__border--top--left"/>
        <div v-if="index===0" class="branch__item__border--bottom--left"/>
        <div v-if="index===total-1" class="branch__item__border--top--right"/>
        <div v-if="index===total-1" class="branch__item__border--bottom--right"/>
    </div>
</template>

<script>
/**
 * 分支条线
 */
    import ApplyNode from './ApplyNode';
    import AuditNode from './AuditNode';
    import CcNode from './CcNode';
    import ConditionNode from './ConditionNode';
    export default {
        name: 'BranchNode',
        components: {
            ApplyNode,
            AuditNode,
            CcNode,
            ConditionTree: () => import('./ConditionTree.vue'), // 解决循环调用 产生的报错
            ConditionNode
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        type: 'branch',
                        priority: 1,
                        children: []
                    };
                }
            },
            index: {
                type: Number,
                default: 0
            },
            parent: {
                type: Object,
                default() {
                    return [];
                }
            },
            total: {
                type: Number,
                default: 0
            }
        },
        methods: {
            handleNodeAdd(parent, index, type) {
                this.$emit('add', parent, index, type);
            },
            handleNodeClick(data) {
                this.$emit('click', data);
            },
            handleAddBranch(parent, index) {
                this.$emit('add-branch', parent, index);
            },
            handleCondNodeDelete() {
                this.$emit('cond-delete', this.parent, this.index);
            },
            handleNodeDelete(parent, index) {
                this.$emit('delete', parent, index);
            }
        }
    };
</script>
