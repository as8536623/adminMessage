<style lang="scss" scoped>
</style>

<template>
    <el-radio-group v-model="selectValue" @change="change">
        <el-radio v-for="(item, index) in data" :key="index" :label="item.value">{{ item.label }}</el-radio>
    </el-radio-group>
</template>

<script>
    export default {
        name: 'QguRadioGroup',
        props: {
            value: {
                type: [String],
                default: ''
            },
            data: {
                type: [Array],
                default() {
                    return [];
                }
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

