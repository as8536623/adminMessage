<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="default__container">
        <div class="default__img"/>
        <div class="default__msg">{{ msg }}</div>
    </article>
</template>
<script>
    export default {
        name: 'DefaultPage',
        props: {
            msg: {
                type: String,
                default: '还没添加必考题,请点击下面按钮添加'
            }
        },
        data() {
            return {};
        }
    };
</script>
