<style lang="scss" scoped>
</style>

<template>
    <el-tooltip :content="toolTip" :disabled="!toolTip" placement="top">
        <el-button
            :disabled="disabled"
            type="text"
            v-bind="$attrs"
            :icon="icon && icon.indexOf('el-icon')>=0?icon:null"
            @click="handleClick"
        >
            <svg-icon v-if="icon && icon.indexOf('el-icon')< 0" :icon-class="icon"/>
            <span v-if="text">{{ text }}</span>
            <slot/>
        </el-button>
    </el-tooltip>
</template>

<script>
    export default {
        name: 'QguButton',
        props: {
            disabled: {
                type: [Boolean],
                default: false
            },
            title: {
                type: [String],
                default: ''
            },
            icon: {
                type: [String],
                default: ''
            },
            toolTip: {
                type: [String],
                default: ''
            },
            text: {
                type: [String],
                default: ''
            }
        },
        data() {
            return {};
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    };
</script>

