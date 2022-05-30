<template>
    <section class="content-main">
        <section class="content__container">
            <keep-alive :include="cacheViews">
                <router-view/>
            </keep-alive>
        </section>
        <footer v-if="code === 'xjd'" class="app__footer">Copyright ©2020 小桔灯 All Rights Reserved 鄂ICP备18020184号</footer>
        <footer v-else-if="code === 'bgk' || code === 'bgh'" class="app__footer">北京国家会计学院 Copyright © 2019 All Rights Reserved 京公网安备11011302001299号 京ICP备05004616号-2</footer>
        <footer v-else class="app__footer">Copyright ©2020 课通天下教育平台 All Rights Reserved 皖ICP备20009376号</footer>
    </section>
</template>

<script>
    import {getCorpCode} from '@/utils/auth';
    import {mapGetters} from 'vuex';

    export default {
        name: 'ContentMain',
        computed: {
            ...mapGetters(['cacheViews']),
            key() {
                return this.$route.fullPath;
            },
            code() {
                return getCorpCode();
            }
        },
        watch: {
            cacheViews(newVal) {
                console.log(newVal);
            }
        }
    };
</script>
