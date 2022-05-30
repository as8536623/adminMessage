<template>
    <section class="app-main" style="height: 100%">
        <section class="app__container">
            <!--            <transition name="fade-transform" mode="out-in">-->
            <keep-alive :include="cachedViews">
                <router-view :key="key"/>
            </keep-alive>
            <!--            </transition>-->
        </section>
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
        computed: {
            cachedViews() {
                return [];
            },
            key() {
                const pathList = this.$route.fullPath.split('/');
                return pathList[1];
            }
        }
    };
</script>
