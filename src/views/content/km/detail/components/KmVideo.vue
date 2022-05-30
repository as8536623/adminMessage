<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="km__detail__video">
        <div class="km__video__wrapper">
            <veln-video-player
                v-if="!!viewUrl"
                class="preview__video"
                :list="[{src: viewUrl, definition: '超清', defCode: '720'}]"
                :poster="posterUrl"
            />
        </div>
    </article>
</template>

<script>
    import VelnVideoPlayer from '@/components/VelnVideoPlayer';

    export default {
        name: 'KmDetailVideo',
        components: {
            VelnVideoPlayer
        },
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                playerOptions: null,
                viewUrl: '',
                posterUrl: ''
            };
        },
        mounted() {
            this.formatData();
        },
        methods: {
            formatData() {
                const item = this.list[0];
                this.viewUrl = item.qgFile.m3u8Url;
                this.posterUrl = item.qgFile.coverUrl;
            }
        }
    };
</script>
