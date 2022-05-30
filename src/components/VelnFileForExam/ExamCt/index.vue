<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="exam__content__block">
        <div v-if="ct.ct" class="exam__ct" v-html="ct.ct"/>
        <div class="exam__file__list">
            <div v-if="ct.code" class="exam__file__item code">
                <vue-codemirror :key="key" v-model="ct.code" :options="options"/>
            </div>
            <div v-if="ct.imageList && Array.isArray(ct.imageList) && ct.imageList.length" class="exam__file__item image">
                <!--图片-->
                <exam-image :list="ct.imageList"/>
            </div>
            <div v-if="ct.videoList && Array.isArray(ct.videoList) && ct.videoList.length" class="exam__file__item video">
                <!--视频-->
                <exam-video :list="ct.videoList"/>
            </div>
            <div v-if="ct.audioList && Array.isArray(ct.audioList) && ct.audioList.length" class="exam__file__item audio">
                <!--音频-->
                <exam-audio :list="ct.audioList"/>
            </div>
        </div>
    </article>
</template>
<script>
    import ExamImage from '@/components/VelnFileForExam/ExamImage';
    import ExamVideo from '@/components/VelnFileForExam/ExamVideo';
    import ExamAudio from '@/components/VelnFileForExam/ExamAudio';
    import VueCodemirror from '@/components/VueCodemirror';

    require('codemirror/mode/javascript/javascript');
    require('codemirror/mode/css/css');
    require('codemirror/mode/xml/xml');
    require('codemirror/mode/vue/vue');
    require('codemirror/mode/sql/sql');
    require('codemirror/mode/htmlmixed/htmlmixed');
    require('codemirror/mode/clike/clike');

    require('codemirror/addon/hint/show-hint.js');
    require('codemirror/addon/hint/show-hint.css');
    require('codemirror/addon/hint/html-hint.js');
    require('codemirror/addon/hint/xml-hint.js');
    require('codemirror/addon/hint/css-hint.js');
    require('codemirror/addon/hint/javascript-hint.js');
    export default {
        name: 'ExamCt',
        components: {
            ExamImage,
            ExamVideo,
            VueCodemirror,
            ExamAudio
        },
        props: {
            ct: {
                type: Object,
                default() {
                    return {
                        ct: '',
                        code: '',
                        codeType: '',
                        imageList: [],
                        videoList: [],
                        audioList: []
                    };
                }
            },
            order: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                options: {
                    mode: 'javascript',
                    tabSize: 2,
                    lineNumbers: true,
                    lineWrapping: true,
                    extraKeys: {'Ctrl-Space': 'autocomplete'},
                    readOnly: true
                },
                key: null
            };
        },
        watch: {
            'ct.codeType': {
                handler(val) {
                    this.mode = val;
                    this.key = +new Date();
                },
                immediate: true
            }
        }
    };
</script>
