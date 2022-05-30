<style scoped lang="scss">
</style>

<template>
    <el-cascader
        v-model="val"
        :class="{'multiple': multiple}"
        :show-all-levels="false"
        :props="casProps"
        :options="options"
        :placeholder="$t(placeholder)"
        clearable
        :disabled="disabled"
    />
</template>

<script>
    import {getTag} from '@/utils/common';

    export default {
        name: 'TagCascader',
        props: {
            value: {
                type: [String, Array],
                default() {
                    return [];
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请选择'
            }
        },
        data() {
            return {
                val: '',
                options: null,
                casProps: {
                    label: 'name',
                    value: 'name',
                    multiple: this.multiple
                },
                type: 'SUBJECT'
            };
        },
        watch: {
            value: {
                handler(v) {
                    this.val = v;
                },
                immediate: true
            },
            val: {
                handler(v) {
                    this.$emit('input', v);
                },
                immediate: true
            }
        },
        async mounted() {
            await this.getOptions();
        },
        methods: {
            async getOptions() {
                this.options = await getTag();
            }
        }
    };
</script>
