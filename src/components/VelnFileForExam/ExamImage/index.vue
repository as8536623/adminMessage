<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="exam__image__block">
        <!--图片-->
        <div class="exam__image__list">
            <div v-for="(item, index) in list" :key="index" class="exam__image__item demo-image__preview">
                <el-image
                    class="exam__image"
                    :src="item.viewUrl"
                    :preview-src-list="[item.viewUrl]"
                />
            </div>
        </div>
    </article>
</template>

<script>
    export default {
        name: 'ExamImage',
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
        methods: {}
    };
</script>
