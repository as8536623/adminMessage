<template>
    <aside class="menu__wrapper">
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="($route && ($route.meta.curNav || $route.name))"
                :collapse="isCollapse"
                :show-timeout="200"
                mode="vertical"
                :unique-opened="true"
            >
                <sidebar-item
                    v-for="route in routerList"
                    :key="route.path"
                    :pre-path="prePath"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
        <section class="menu--bottom" :class="{'sidebar--hide': isCollapse}" @click="toggleSideBar">
            <span class="menu--bottom__text">{{ $t('收起侧边导航') }}</span>
            <el-tooltip
                effect="dark"
                :content="$t('收起侧边导航')"
                placement="top"
                @click.stop="toggleSideBar"
            >
                <svg-icon icon-class="sidebar" class-name="menu__bottom__icon"/>
            </el-tooltip>
        </section>
    </aside>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SidebarItem from './SidebarItem';

    export default {
        components: {SidebarItem},
        data() {
            return {
                routerList: [],
                prePath: ''
            };
        },
        computed: {
            ...mapGetters(['permission_routers', 'sidebar']),
            isCollapse() {
                return !this.sidebar.opened;
            }
        },
        created() {
            this.filterRoute();
        },
        methods: {
            filterRoute() {
                let currentRoutePre = this.$route.path.split('/')[1];
                currentRoutePre = `/${currentRoutePre}`;
                this.prePath = currentRoutePre;
                let routeList = this.permission_routers.filter(item => {
                    return item.path === currentRoutePre;
                });
                routeList = routeList.length ? routeList[0].children : [];
                this.routerList = routeList;
            },
            toggleSideBar() {
                this.$store.dispatch('toggleSideBar');
            }
        }
    };
</script>
