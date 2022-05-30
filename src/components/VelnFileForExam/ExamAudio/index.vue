<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="exam__audio__block">
        <div v-for="(item, index) in list" :key="index" class="exam__audio__item" @click="audioClick(item)">
            <!--<div class="veln__question__audio" :class="{'audio&#45;&#45;playing': playState=== 'playing'}">-->
            <!--<span class="question__audio__icon play"></span>-->
            <!--<div class="question__audio__progress">-->
            <!--<div class="audio__progress&#45;&#45;top"></div>-->
            <!--<div class="audio__progress&#45;&#45;bottom" :style="{width: percent}"></div>-->
            <!--</div>-->
            <!--</div>-->
            <veln-voice-icon :key="index + 'voice'" :color="color" :is-playing="isPlaying" width="15px"/>
            <div class="player__duration">{{ isNaN(item.duration) ? item.duration : transformSecondToMS(item.duration) }}</div>
        </div>
        <audio ref="qguAudio" class="qgu__audio" preload="auto" :src="src"/>
    </article>
</template>
<script>
    import {transformSecondToMS} from '@/utils/time';
    import VelnVoiceIcon from '../../../components/VelnVoiceIcon';
    export default {
        name: 'ExamAudio',
        components: {
            VelnVoiceIcon
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
                currentPlayingAudio: '',
                currentPlayingId: '',
                src: '',
                percent: 0,
                playState: 'ended',
                isPlaying: false,
                color: '#C2C2C2'
            };
        },
        mounted() {
            this.bindAudioEvents();
        },
        methods: {
            transformSecondToMS,
            audioClick(item) {
                // 视频和音频不能同时播放处理
                const $audio = document.getElementsByTagName('audio');
                for (let i = 0; i < $audio.length; i++) {
                    $audio[i].pause();
                }

                // 视频和音频不能同时播放处理
                const $video = document.getElementsByTagName('video');
                if ($video && $video.length) {
                    for (let i = 0; i < $video.length; i++) {
                        $video[i].pause();
                    }
                }

                const qguAudio = this.$refs.qguAudio;
                // 如果是当前音频，播放 OR 暂停
                if (item.fileId === this.currentPlayingId && this.playState === 'playing') {
                    qguAudio.pause();
                    return;
                }
                if (item.fileId === this.currentPlayingId && this.playState === 'pause') {
                    qguAudio.play();
                    return;
                }
                this.currentPlayingId = item.fileId;
                this.src = item.viewUrl;
                this.$nextTick(() => {
                    qguAudio.play();
                });
            },
            bindAudioEvents() {
                const qguAudio = this.$refs.qguAudio;
                qguAudio.addEventListener('timeupdate', this.audioTimeupdate, false);
                qguAudio.addEventListener('ended', this.audioEnded, false);
                qguAudio.addEventListener('playing', this.audioPlaying, false);
                qguAudio.addEventListener('pause', this.audioPause, false);
            },
            audioTimeupdate() {
                const qguAudio = this.$refs.qguAudio;
                const current = qguAudio.currentTime;
                const total = qguAudio.duration;
                this.percent = `${Math.floor((current / total) * 10000) / 100}%`;
            },
            audioEnded() {
                this.removePlaying();
            },
            audioPlaying() {
                this.playState = 'playing';
                this.isPlaying = true;
                this.color = '#25B864';
            },
            audioPause() {
                this.playState = 'pause';
                this.isPlaying = false;
                this.color = '#C2C2C2';
            }
        }
    };
</script>
