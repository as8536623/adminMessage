<style scoped lang="scss">
.veln__iframe {
    width: 100%;
    height: 100%;
}
</style>

<template>
    <iframe id="iframe" class="veln__iframe" :src="src" :height="height" frameborder="0"/>
</template>

<script>
    export default {
        name: 'Iframe',
        data() {
            return {
                src: '',
                height: ''
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.meta.linkUrl) {
                    this.src = this.$route.meta.linkUrl;
                }
            }
        }
    };
</script>
