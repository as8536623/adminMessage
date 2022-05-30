<style scoped lang="scss">
@import './style.scss';
</style>

<template>
    <el-cascader
        v-model="val"
        :class="{'multiple': multiple}"
        :show-all-levels="false"
        :props="casProps"
        :options="options"
        :placeholder="$t('请选择')"
        clearable
        :disabled="disabled"
    />
</template>

<script>
    import {getSubject} from '@/utils/common';

    export default {
        name: 'SubjectCascader',
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
                this.options = await getSubject();
            }
        }
    };
</script>
