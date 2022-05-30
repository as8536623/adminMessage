<style lang="scss" scoped>
</style>

<template>
    <el-input
        :placeholder="placeholder"
        :value="value"
        :maxlength="length||20"
        :size="size"
        :disabled="disabled"
        :readonly="readonly"
        :type="type"
        @change="change"
    />
</template>

<script>
    export default {
        name: 'QguInput',
        props: {
            placeholder: {
                type: [String],
                default: ''
            },
            value: {
                type: [String, Number],
                default: ''
            },
            size: {
                type: [String],
                default: 'small'
            },
            disabled: {
                type: [Boolean],
                default: false
            },
            readonly: {
                type: [Boolean],
                default: false
            },
            length: {
                type: [String, Number],
                default: 20
            },
            type: {
                required: false,
                type: [String],
                default: ''
            }
        },
        data() {
            return {};
        },
        methods: {
            change(v) {
                this.$emit('change', v);
            }
        }
    };
</script>

