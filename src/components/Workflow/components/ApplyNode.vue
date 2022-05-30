<style scoped lang="scss">
    @import '../style.scss';
</style>

<template>
    <section class="node__sec">
        <div class="wf__card apply" @click="handleClick">
            <div class="wf__card--header">
                <span class="wf__card__title">{{ data.name }}</span>
            </div>
            <div class="wf__card--content">
                <div
                    class="wf__card__paragraph"
                >所有人
                </div>
                <svg-icon icon-class="arrow_r" class-name="wf__card__arrow"/>
            </div>
        </div>
        <div class="wf__add__node">
            <add-button @click="handleAddClick"/>
        </div>
    </section>
</template>

<script>
    /**
     * 发起节点
     */
    import AddButton from './AddButton';

    export default {
        name: 'ApplyNode',
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
                type: [Array, Object],
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
            console.log(this.data);
        },
        methods: {
            handleClick() {
                this.$emit('click', this.data);
            },
            handleAddClick(type) {
                this.$emit('add', this.parent, this.index, type);
            }
        }
    };
</script>
