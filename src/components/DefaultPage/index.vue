<style scoped lang="scss">
    @import 'style';
</style>

<template>
    <div class="default__page">
        <div
            class="default__icon"
            :class="{
                'search': type === 'search',
                'comment': type === 'comment'
            }"
        />
        <span class="default__text">{{ msg }}</span>
    </div>
</template>

<script>
    export default {
        name: 'DefaultPage',
        props: {
            msg: {
                type: String,
                default: '这里什么也没有哎~'
            },
            type: {
                type: String,
                default: 'normal'
            }
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>
