<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="qnt__required qnt__setting">
        <span class="qnt__setting__label">{{ $t('此题必答') }}</span>
        <el-switch
            v-model="val"
            class="qnt__setting__item"
            active-color="#87D068"
            inactive-color="#999999"
        />
    </div>
</template>

<script>
    export default {
        name: 'QntRequired',
        props: {
            value: {
                type: Boolean,
                default: false
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
            },
            val(v) {
                this.$emit('input', v);
                this.$emit('change', v);
            }
        }
    };
</script>
