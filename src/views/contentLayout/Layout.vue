<style lang="scss" scoped>
    @import '../../assets/styles/mixin.scss';

    .app-wrapper {
        @include clearfix;
        position: relative;
        min-height: 100%;
        width: 100%;
    }

    .drawer-bg {
        display: none;
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 999;
    }
</style>

<template>
    <div class="content-wrapper" :class="classObj">
        <sidebar class="content-sidebar-container"/>
        <div class="content-container">
            <navbar/>
            <content-main/>
        </div>
    </div>
</template>

<script>
    import {ContentMain, Navbar, Sidebar} from './components';
    import ResizeMixin from './mixin/ResizeHandler';

    export default {
        name: 'ContentLayout',
        components: {
            Navbar,
            Sidebar,
            ContentMain
        },
        mixins: [ResizeMixin],
        computed: {
            sidebar() {
                return this.$store.state.app.sidebar;
            },
            device() {
                return this.$store.state.app.device;
            },
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile'
                };
            }
        },
        methods: {
            handleClickOutside() {
                this.$store.dispatch('closeSideBar', {withoutAnimation: false});
            }
        }
    };
</script>
