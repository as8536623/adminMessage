<template>
    <aside class="menu__wrapper">
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="($route && ($route.meta.curNav || $route.name))"
                :collapse="isCollapse"
                :show-timeout="200"
                mode="vertical"
            >
                <sidebar-item
                    v-for="route in permission_routers"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </aside>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SidebarItem from './SidebarItem';

    export default {
        components: {SidebarItem},
        computed: {
            ...mapGetters(['permission_routers', 'sidebar']),
            isCollapse() {
                return !this.sidebar.opened;
            }
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('toggleSideBar');
            }
        }
    };
</script>
