<style lang="scss" scoped>
</style>

<template>
    <el-select
        :key="renderKey"
        v-model="selectValue"
        :placeholder="placeholder || $t('select')"
        :disabled="disabled"
        @change="change"
    >
        <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.label"
            :value="item.value"
        />
    </el-select>
</template>

<script>
    export default {
        name: 'QguSelect',
        props: {
            placeholder: {
                type: [String],
                default: ''
            },
            value: {
                type: [String],
                default: ''
            },
            options: {
                type: [Array],
                default: () => []
            },
            disabled: {
                type: [Boolean],
                default: false
            },
            renderKey: {
                type: [String],
                default: ''
            }
        },
        data() {
            return {
                selectValue: this.value || ''
            };
        },
        methods: {
            change(v) {
                this.$emit('change', v);
            }
        }
    };
</script>

