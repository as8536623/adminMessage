<template>
    <article style="margin:.7em;font-size: 14px;">{{ $t('loading') }}...</article>
</template>

<script>
    /**
     * first 文件的存在是与权限功能相结合的，因为在beforeEnter事件里面无法获取到全部的路由信息，
     * 当第一次打开网站时，无法知道用户拥有哪些路由的权限，在created里面获取到所有路由，
     * 跳转到第一个路由地址
     */
    import {mapGetters} from 'vuex';

    export default {
        name: 'First',
        computed: {
            ...mapGetters(['addRouters'])
        },
        created() {
            let name = '';
            for (let i = 0; i < this.addRouters.length; i++) {
                const list = this.addRouters[i].children;
                if (Array.isArray(list) && list.length) {
                    name = list[0].name;
                    break;
                }
            }
            this.$router.replace({
                name
            });
        },
        methods: {
            getFirstRoute(arr) {
                if (Array.isArray(arr) && arr.length && arr[0].children) {
                    return this.getFirstRoute(arr[0].children);
                } else if (Array.isArray(arr) && arr.length) {
                    return arr[0].name;
                } else {
                    return arr.name;
                }
            }
        }
    };
</script>

<style scoped>
</style>
