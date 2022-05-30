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
    <div class="main-container">
        <header class="layout--header">
            <div class="layout__logo__wrapper" :class="{'bar--hide': !sidebar.opened}">
                <img v-show="sidebar.opened" class="layout__logo" :class="code" :src="logo" alt="logo">
                <img
                    v-show="!sidebar.opened"
                    class="layout__logo--short"
                    :src="shortLogo"
                    alt="logo"
                >
            </div>
            <ul class="layout--route">
                <template v-for="(route, index) in routes">
                    <router-link
                        v-if="!isExternal(route.path)"
                        :key="index"
                        :to="route.path"
                        :class="{'active': $route.path.startsWith(route.path)}"
                    >
                        <li class="layout__route__item">{{ route.meta.title }}</li>
                    </router-link>
                    <a
                        v-else
                        :key="index"
                        :href="route.path"
                        target="_blank"
                        :class="{'active': $route.path.startsWith(route.path)}"
                    >
                        <li class="layout__route__item">{{ route.meta.title }}</li>
                    </a>
                </template>
            </ul>
            <div class="layout--header--right">
                <div class="layout__user">
                    <div class="layout__user__info" @mouseenter="isShow = true" @mouseleave="isShow = false">
                        <el-avatar class="user__avatar" :size="28" :src="defaultUserIcon">
                            <img class="layout__user__icon" :src="defaultUserIcon" alt>
                        </el-avatar>
                        <span class="layout__user__name">{{ name }}</span>
                        <transition name="fade">
                            <div v-if="isShow" class="layout__reset" @click="resetPassword">
                                <span>{{ $t('修改密码') }}</span>
                            </div>
                        </transition>
                        <transition name="fade">
                            <div v-if="isShow" class="layout__reset">
                                <div class="layout__reset__item" @click="change">
                                    <svg-icon icon-class="handover" class-name="layout__icon"/>
                                    <span>{{ $t('学员端') }}</span>
                                </div>
                                <div class="layout__reset__item" @click="resetPassword">
                                    <svg-icon icon-class="reset_p" class-name="layout__icon"/>
                                    <span>{{ $t('修改密码') }}</span>
                                </div>
                                <div class="layout__reset__item" @click="logout">
                                    <svg-icon icon-class="exit" class-name="layout__icon"/>
                                    <span>{{ $t('退出账号') }}</span>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <!-- <div class="layout__user__opt">
                        <div class="layout__user__opt__item layout__logout" @click="logout">退出</div>
                    </div>-->
                </div>
            </div>
            <!--<el-tooltip class="item" effect="dark" :content="$t('退出')" placement="top">-->
            <!--<div class="layout__logout__wrapper" @click="logout">-->
            <!--<svg-icon icon-class="logout" class-name="layout__logout"></svg-icon>-->
            <!--</div>-->
            <!--</el-tooltip>-->
        </header>
        <app-main/>
    </div>
</template>

<script>
    // import path from 'path';
    import {AppMain} from './components';
    import ResizeMixin from './mixin/ResizeHandler';
    import {mapGetters} from 'vuex';
    import {logout} from '@/api/login';
    import {removeToken} from '@/utils/auth';
    import {isExternal} from '@/utils/validate';
    import Cookies from 'js-cookie';
    const logo = require('@/assets/images/kttx_logo.png');
    const shortLogo = require('@/assets/images/logo.png');

    export default {
        name: 'Layout',
        components: {
            AppMain
        },
        mixins: [ResizeMixin],
        data() {
            return {
                routes: [],
                defaultUserIcon: `${process.env.STATIC_API}/qgyun-static/images/default_user.png`,
                logo,
                shortLogo,
                isShow: false
            };
        },
        computed: {
            ...mapGetters(['addRouters', 'name', 'corpCode']),
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
            },
            code() {
                return Cookies.get('CORP_CODE') || this.corpCode;
            }
        },
        created() {
            this.routes = this.addRouters.filter(route => {
                return !route.hidden;
            });
        },
        methods: {
            handleClickOutside() {
                this.$store.dispatch('closeSideBar', {withoutAnimation: false});
            },
            logout() {
                // this.$store.dispatch('LogOut').then(() => {
                logout().then(response => {
                    const result = response.data;
                    if (result.success) {
                        this.$store.commit('SET_TOKEN', '');
                        this.$store.commit('SET_PERMISSIONS', []);
                        removeToken();
                        location.href = `${location.protocol}//${location.host}/admin`;
                    } else {
                        console.error('logout error!');
                    }
                });
                // });
            },
            isExternal(routePath) {
                return isExternal(routePath);
            },
            resetPassword() {
                this.$router.push({name: 'resetPassword'});
            },
            change() {
                location.href = `${location.protocol}//${location.host}/${process.env.CUSTOMER_LINK}`;
            }
        }
    };
</script>
