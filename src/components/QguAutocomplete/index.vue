<style scoped>

</style>

<template>
    <el-autocomplete
        v-model="val"
        clearable
        autocomplete="off"
        :placeholder="placeholder"
        :trigger-on-focus="false"
        :fetch-suggestions="fetchSuggestions"
        :maxlength="maxLength"
        :hide-loading="true"
        :disabled="disabled"
        @select="((selectVal) => {select(selectVal)})"
    />
</template>

<script>
    export default {
        name: 'QguAutocomplete',
        props: {
            fetchSuggestions: {
                type: Function,
                default: null
            },
            disabled: {
                type: [Boolean],
                default: false
            },
            maxLength: {
                type: [String, Number],
                default: 20
            },
            placeholder: {
                type: [String],
                default: null
            },
            value: {
                type: [String],
                default: null
            }
        },
        data() {
            return {
                val: this.value
            };
        },
        watch: {
            value(v) {
                this.val = v;
                this.$emit('change', this.value);
            },
            val() {
                this.$emit('input', this.val);
            }
        },
        methods: {
            select(val) {
                this.$emit('input', val.value);
                this.$emit('select', val);
            }
        }
    };
</script>
