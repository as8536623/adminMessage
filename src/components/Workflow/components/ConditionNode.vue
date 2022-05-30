<style scoped lang="scss">
@import '../style.scss';
</style>

<template>
    <section class="condition__sec">
        <div class="condition__card" @click="handleClick">
            <header class="condition__header">
                <span class="condition__title">条件1</span>
                <span class="condition__index">优先级1</span>
            </header>
            <div class="condition__content">{{ data.text || '请设置条件' }}</div>
            <div class="node--close__wrapper" @click.stop="deleteNode">
                <svg-icon icon-class="close" class-name="node--close"/>
            </div>
        </div>
        <div class="wf__add__node">
            <add-button @click="handleAddClick"/>
        </div>
    </section>
</template>

<script>
/**
 * 条件节点
 */
    import AddButton from './AddButton';
    export default {
        name: 'ConditionNode',
        components: {
            AddButton
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        name: '条件1',
                        priority: 1,
                        field: {}
                    };
                }
            },
            parent: {
                type: Object,
                default() {
                    return [];
                }
            },
            index: {
                type: Number,
                default: 0
            }
        },
        methods: {
            handleClick() {
                this.$emit('click', this.data);
            },
            handleAddClick(type) {
                this.$emit('add', this.parent, this.index, type);
            },
            deleteNode() {
                this.$emit('delete', this.parent, this.index);
            }
        }
    };
</script>
