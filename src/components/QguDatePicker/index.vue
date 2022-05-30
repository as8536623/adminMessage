<style lang="scss" scoped>
</style>

<template>
    <el-date-picker
        v-model="dateValue"
        type="date"
        :placeholder="placeholder || $t('chooseDate')"
        :disabled="disabled"
    />
</template>

<script>
    export default {
        name: 'QguDatePicker',
        props: {
            placeholder: {
                type: [String],
                default: ''
            },
            value: {
                type: [String],
                default: ''
            },
            disabled: {
                type: [Boolean],
                default: false
            }
        },
        data() {
            return {
                dateValue: this.value || ''
            };
        },
        watch: {
            dateValue() {
                this.$emit('change', this.dateValue);
            }
        }
    };
</script>

