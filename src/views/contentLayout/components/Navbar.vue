<style lang="scss" scoped>
    .navbar {
        height: 42px;
        line-height: 42px;
        border-radius: 0px !important;
        padding: 0;
        overflow: hidden;
        position: relative;
        width: 100%;
        top: 0;
        background-color: #eaf4f4;

        .hamburger-container {
            line-height: 46px;
            height: 40px;
            float: left;
            padding: 0 10px;
        }

        .breadcrumb-container {
            float: left;
        }

        .errLog-container {
            display: inline-block;
            vertical-align: top;
        }

        .right-menu {
            position: fixed;
            right: 10px;

            &:focus {
                outline: none;
            }

            .right-menu-item {
                display: inline-block;
                margin: 0 8px;
            }

            .screenfull {
                height: 20px;
            }

            .international {
                vertical-align: top;
            }

            .avatar-container {
                height: 40px;
                margin-right: 30px;

                .avatar-wrapper {
                    cursor: pointer;
                    position: relative;

                    .user-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                    }

                    .el-icon-caret-bottom {
                        position: absolute;
                        right: -20px;
                        top: 14px;
                        font-size: 14px;
                    }
                }
            }
        }

        .setting__icon {
            cursor: pointer;

            &:hover {
                opacity: 0.75;
            }
        }
    }
</style>

<template>
    <section>
        <el-menu class="navbar" mode="horizontal">
            <!--            <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
            <breadcrumb class="breadcrumb-container"/>
            <div class="navbar--back pull-right" @click="goBack">
                <svg-icon icon-class="left_s" class-name="navbar--back__icon"/>
                <span class="navbar--back__text">{{ $t('返回') }}</span>
            </div>
        </el-menu>
    </section>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Breadcrumb from '@/components/Breadcrumb';
    import {logout} from '@/api/login';

    export default {
        components: {
            Breadcrumb
        },
        computed: {
            ...mapGetters(['sidebar', 'name', 'avatar'])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('toggleSideBar');
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    logout().then(response => {
                        const result = response.data;
                        if (result.success) {
                            location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
                        } else {
                            console.error('logout error!');
                        }
                    });
                });
            },
            goBack() {
                history.go(-1);
            }
        }
    };
</script>

