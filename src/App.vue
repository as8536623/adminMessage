<template>
    <div id="app" class="app">
        <audio id="qguAudio" class="qgu__audio" preload="auto" :src="src"/>
        <router-view/>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        name: 'App',
        data() {
            return {
                src: `${process.env.STATIC_API}/qgyun-static/audio/silence.mp3`
            };
        },
        watch: {
            $route(val) {
                // console.log('route', val);
            }
        },
        mounted() {
            // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
            // window.addEventListener(
            //     'hashchange',
            //     () => {
            //         const currentPath = window.location.hash.slice(1);
            //         if (this.$route.path !== currentPath) {
            //             this.$router.push(currentPath);
            //         }
            //     },
            //     false
            // );

            const code = Cookies.get('CORP_CODE');
            if (code === 'bgk' || code === 'bgh') {
                const link =
                    document.querySelector("link[rel*='icon']") ||
                    document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = `${process.env.STATIC_API}/qgyun-static/theme/bgk/bgk.ico`;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        }
    };
</script>
