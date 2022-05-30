<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <footer class="footer__container" :style="{backgroundColor: bgColor}">
        {{ text }}
    </footer>
</template>
<script>
    export default {
        name: 'QFooter',
        props: {
            bgColor: {
                type: String,
                default: 'transparent'
            },
            text: {
                type: String,
                default: 'Copyright ©2020 课通天下教育平台 All Rights Reserved 皖ICP备20009376号'
            }
        },
        data() {
            return {};
        }
    };
</script>
