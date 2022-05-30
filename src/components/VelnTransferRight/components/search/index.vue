<style lang="scss">
    @import "style";
</style>

<template>
    <div class="veln__transfer__search">
        <svg-icon
            icon-class="search"
            class-name="vts__icon"
            @click="change"
        />
        <div class="vts__npt__wrapper">
            <el-input
                v-model.trim="keyword"
                class="vts__npt"
                :placeholder="$t(placeholder)"
                @keyup.enter.native="enter"
            />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'VelnTransferSearch',
        props: {
            value: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                keyword: ''
            };
        },
        watch: {
            value(v) {
                this.keyword = v;
                this.$emit('change', this.value);
            },
            keyword() {
                this.$emit('input', this.keyword);
            }
        },
        methods: {
            enter() {
                this.$emit('enter', this.keyword);
            },
            change() {
                this.$emit('show');
            }
        }
    };
</script>
