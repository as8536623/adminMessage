<style scoped lang="scss">
    @import '../style.scss';
</style>

<template>
    <section class="node__sec">
        <div class="wf__card cc" @click="handleClick">
            <div class="wf__card--header">
                <span class="wf__card__title">
                    <svg-icon icon-class="cc" class-name="wf__icon--cc"/>
                    <span>抄送人</span>
                </span>
                <button class="wf__btn--text wf__card__opt">申请人</button>
            </div>
            <div class="wf__card--content">
                <div class="wf__card__paragraph">
                    <span>余求索余求索余求索余求索余求索余求索余求索</span>
                </div>
                <svg-icon icon-class="arrow_r" class-name="wf__card__arrow"/>
            </div>
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
     * 抄送节点
     */
    import AddButton from './AddButton';

    export default {
        name: 'CcNode',
        components: {
            AddButton
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        type: 'apply',
                        name: '发起人',
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
        mounted() {
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
