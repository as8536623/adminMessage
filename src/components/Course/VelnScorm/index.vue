<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <article class="veln__scorm">
        <veln-document-player
            v-if="data"
            :src="data.src"
            :convert-type="data.convertType"
            :total="data.total"
        />
    </article>
</template>
<script>
    import {socketEmit} from '@/utils/socket';
    import {getToken} from '@/utils/auth';
    import VelnDocumentPlayer from '@/components/VelnDocumentPlayer';

    export default {
        name: 'VelnScorm',
        components: {
            VelnDocumentPlayer
        },
        props: {
            data: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        data() {
            return {
                iframeUrl: ''
            };
        },
        mounted() {
            this.bindEvent();
        },
        destroyed() {
            this.unbindEvent();
        },
        methods: {
            bindEvent() {
                window.saveDocProcess = (curr, total) => {
                    const params = {
                        courseId: this.data.courseId,
                        itemId: this.data.id,
                        location: curr,
                        end: false
                    };
                    socketEmit('STUDY_RECORD', params);
                };
                this.viewCourse();
            },
            unbindEvent() {
                window.saveDocProcess = null;
            },
            viewCourse() {
                const url = `${this.data.src}&curr=${this.data.learned}&sp=${this.data.sp}&_token=${getToken()}`;
                this.iframeUrl = url;
            }
        }
    };
</script>
