<style lang="scss" src="./style.scss">
</style>

<template>
    <article/>
</template>

<script>
    import {gotoLive} from '@/api/live/live';

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
                const params = {
                    domainName: location.host
                };
                gotoLive(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        location.href = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取数据失败'));
                    }
                });
            }
        }
    };
</script>
