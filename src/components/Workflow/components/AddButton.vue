<style scoped lang="scss">
@import '../style.scss';
</style>

<template>
    <el-popover placement="right" width="300" trigger="click">
        <div class="wf__add__btn">
            <div class="wf__add__btn__item" @click="handleClick('audit')">
                <div class="wf__add__item__wrapper">
                    <svg-icon icon-class="audit" class-name="wf__node__add__icon audit"/>
                </div>
                <div class="wf__add__btn__text">审批人</div>
            </div>
            <div class="wf__add__btn__item" @click="handleClick('cc')">
                <div class="wf__add__item__wrapper">
                    <svg-icon icon-class="cc" class-name="wf__node__add__icon cc"/>
                </div>
                <div class="wf__add__btn__text"> 抄送人</div>
            </div>
            <div class="wf__add__btn__item" @click="handleClick('condition')">
                <div class="wf__add__item__wrapper">
                    <svg-icon icon-class="branch" class-name="wf__node__add__icon branch"/>
                </div>
                <div class="wf__add__btn__text">条件分支</div>
            </div>
        </div>
        <svg-icon slot="reference" icon-class="add" class="wf__add__icon"/>
    </el-popover>
</template>

<script>
    export default {
        name: 'AddButton',
        data() {
            return {};
        },
        mounted() {},
        methods: {
            handleClick(type) {
                this.$emit('click', type);
            }
        }
    };
</script>
