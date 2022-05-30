<style scoped lang="scss">
@import './style.scss';
</style>

<template>
    <el-cascader
        v-model="val"
        :class="{'multiple': multiple}"
        :show-all-levels="false"
        :options="options"
        :props="casProps"
        :placeholder="$t('请选择')"
        clearable
        :disabled="disabled"
    />
</template>

<script>
    import {getIndustry} from '@/utils/common';

    export default {
        name: 'IndustryCascader',
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
            }
        },
        data() {
            return {
                val: '',
                options: null,
                casProps: {
                    label: 'name',
                    value: 'code',
                    multiple: this.multiple
                },
                type: 'TRADE'
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
                this.options = await getIndustry();
            }
        }
    };
</script>
