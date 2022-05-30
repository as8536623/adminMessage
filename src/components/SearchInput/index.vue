<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="search__input__wrapper" :style="width ? {'width': width} : null">
        <el-input
            v-model.trim="val"
            class="search__input"
            :placeholder="placeholder"
            :max-length="maxLength"
            @keyup.enter.native="enter"
        />
        <span class="search__icon" @click="enter">
            <svg-icon icon-class="search"/>
        </span>
        <span v-show="val" class="search__clear" @click="clear">
            <svg-icon icon-class="close_o"/>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'SearchInput',
        props: {
            placeholder: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '240px'
            },
            value: {
                type: String,
                default: ''
            },
            maxLength: {
                type: [Number, String],
                default: 50
            }
        },
        data() {
            return {
                val: this.value
            };
        },
        watch: {
            val(v) {
                this.$emit('input', v);
            },
            value(v) {
                this.val = v;
            }
        },
        methods: {
            enter() {
                this.$emit('enter');
            },
            clear() {
                this.$emit('input', '');
                this.$emit('enter');
            }
        }
    };
</script>
