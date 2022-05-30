<style lang="scss" scoped>
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 42px;
        height: 40px;
        overflow: hidden;
        margin-left: 16px;

        .el-breadcrumb__item:last-child {
            a {
                color: #151515;
                cursor: text;
                font-size: 14px;

                &:hover {
                    color: #151515;
                }
            }
        }

        .no-redirect {
            color: #151515;
            cursor: text;
            font-size: 14px;
            font-weight: bold;
        }
    }
</style>

<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <template v-for="(item,index) in levelList">
                <el-breadcrumb-item v-if="item.meta.title" :key="item.path">
                    <span
                        v-if="item.redirect==='noredirect'|| index===levelList.length-1"
                        class="no-redirect"
                    >{{ generateTitle(item.meta.title) }}</span>
                    <router-link v-else :to="item.redirect||item.path">{{ generateTitle(item.meta.title) }}
                    </router-link>
                </el-breadcrumb-item>
            </template>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
    import {generateTitle} from '@/utils/i18n';

    export default {
        data() {
            return {
                levelList: null
            };
        },
        watch: {
            $route() {
                this.getBreadcrumb();
            }
        },
        created() {
            this.getBreadcrumb();
        },
        methods: {
            generateTitle,
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name);
                const first = matched[0];
                if (first && first.name !== 'dashboard') {
                    matched = [{path: '/dashboard', meta: {title: '启效'}}].concat(
                        matched
                    );
                }
                this.levelList = matched;
                this.levelList.shift();
                this.levelList.shift();
            }
        }
    };
</script>

