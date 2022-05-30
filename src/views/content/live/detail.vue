<style lang="scss" src="./style.scss">
</style>

<template>
    <article/>
</template>

<script>

    import {isBgk} from '@/utils/auth';

    export default {
        name: 'LiveCourse',
        data() {
            return {};
        },
        mounted() {
            this.gotoLive();
        },
        methods: {
            async gotoLive() {
                let url = `${location.protocol}//${location.host}/admin/#/live`;
                if (!isBgk()) {
                    url = 'https://e.vhall.com';
                }
                location.href = url;
            }
        }
    };
</script>
