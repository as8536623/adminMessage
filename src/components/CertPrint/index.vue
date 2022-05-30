<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="cert__print">
        <el-button type="primary" class="cert__print__btn" @click="print">{{ $t('打印') }}</el-button>
        <div ref="print" class="cert__print__list">
            <div v-for="(item, index) in list" :key="index" class="cert__print__item">
                <img v-if="item" width="1020" :src="item">
            </div>
        </div>
    </article>
</template>

<script>
    export default {
        name: 'CertPrint',
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {};
        },
        mounted() {},
        methods: {
            print() {
                this.$print(this.$refs.print);
            }
        }
    };
</script>
