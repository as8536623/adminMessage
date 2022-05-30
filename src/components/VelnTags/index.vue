<style lang="scss" src='./style.scss'>
</style>

<template>
    <section class="veln__tags">
        <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
        >{{ tag }}</el-tag>
        <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model.trim="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">{{ $t('新增') }}</el-button>
    </section>
</template>

<script>
    export default {
        name: 'VelnTags',
        props: {
            value: {
                type: Array,
                default: () => {
                    return [];
                },
                validator: t => {
                    return Array.isArray(t);
                },
                required: true
            }
        },
        data() {
            return {
                dynamicTags: this.value,
                inputVisible: false,
                inputValue: ''
            };
        },
        watch: {
            value: {
                handler(v) {
                    this.dynamicTags = v;
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                this.$emit('input', this.dynamicTags);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                const inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
                this.$emit('input', this.dynamicTags);
            }
        }
    };
</script>
