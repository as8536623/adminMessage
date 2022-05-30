<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <article class="veln__audio__player">
        <div class="veln__player__wrapper">
            <div class="veln__player__opt" :class="{'active': rotating}"/>
            <div ref="film" class="veln__audio__film" :class="{'rotation': rotating}">
                <div
                    class="audio__bg"
                    :style="{
                        backgroundImage: 'url(' + imageUrl + ')',
                        width: width,
                        height: height
                    }"
                />
            </div>
        </div>
        <div class="veln__audio__controls">
            <div class="veln__audio__player__key">
                <svg-icon
                    v-if="isPlay"
                    icon-class="playing_a"
                    class-name="operation__icon"
                    @click.native="clickPause"
                />
                <svg-icon
                    v-if="!isPlay"
                    icon-class="pause_v"
                    class-name="operation__icon"
                    @click.native="clickPlay"
                />
            </div>
            <!--进度-->
            <audio-progress
                :key="key"
                :progress="progress"
                @slide="slide"
                @start="start"
            />
            <div class="qgu-audio__time">
                <span class="qgu-audio__current">{{ currentTime | videoTimeFilter }}</span>
                <span class="qgu-audio__split">/</span>
                <span class="qgu-audio__duration">{{ duration | videoTimeFilter }}</span>
            </div>
            <audio-voice :volume="volume" @setVolume="setVolume"/>
        </div>
        <audio id="courseAudio" ref="qguAudio" class="qgu__audio" preload="auto" :src="src"/>
    </article>
</template>
<script>
    import {transformSecondToMS} from '@/utils/time';
    import AudioProgress from './components/AudioProgress';
    import AudioVoice from './components/AudioVoice';

    export default {
        name: 'VelnAudioPlayer',
        components: {
            AudioProgress,
            AudioVoice
        },
        props: {
            src: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                $audio: null,
                volume: 0.5, // 音量
                duration: 0, // 总时长
                currentTime: 0, // 当前时间
                isPlay: false,
                progress: 0, // 进度
                loaded: false,
                hasCheckTime: false,
                rotating: false,
                key: null,
                isProgress: true, // 滑动开始false
                height: 0,
                width: 0,
                imageUrl: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3398317427,2017912942&fm=26&gp=0.jpg'
            };
        },
        mounted() {
            this.init();
            this.bindEvents();
        },
        beforeDestroy() {
            this.unbindEvents();
        },
        methods: {
            transformSecondToMS,
            init() {
                this.$audio = document.getElementById('courseAudio');
                this.$audio.volume = this.volume;
                this.width = this.height = this.$refs.film.clientHeight / 2.2 + 'px';
            },
            bindEvents() {
                const that = this;

                this.$audio.addEventListener('loadstart', that.loadstart, false);
                this.$audio.addEventListener(
                    'loadedmetadata',
                    that.loadedmetadata,
                    false
                );
                this.$audio.addEventListener('timeupdate', that.timeupdate, false);
                this.$audio.addEventListener('playing', that.playing, false);
                this.$audio.addEventListener('pause', that.pause, false);
                this.$audio.addEventListener('ended', that.ended, false);
                this.$audio.addEventListener('seeking', that.seeking, false);
                this.$audio.addEventListener('seeked', that.seeked, false);
            },
            unbindEvents() {
                const that = this;
                this.$audio.pause();
                this.$audio.removeEventListener('loadstart', that.loadstart, false);
                this.$audio.removeEventListener(
                    'loadedmetadata',
                    that.loadedmetadata,
                    false
                );
                this.$audio.removeEventListener(
                    'timeupdate',
                    that.timeupdate,
                    false
                );
                this.$audio.removeEventListener('playing', that.playing, false);
                this.$audio.removeEventListener('pause', that.pause, false);
                this.$audio.removeEventListener('ended', that.ended, false);
                this.$audio.removeEventListener('seeking', that.seeking, false);
                this.$audio.removeEventListener('seeked', that.seeked, false);
            },
            timeupdate() {
                this.calProgress(this.$audio.currentTime);
                this.$emit('timeupdate', this.$audio.currentTime);
            },
            playing() {
                this.rotating = true;
                setTimeout(() => {
                    this.isPlay = true;
                    this.$refs.film.style.animationPlayState = 'running';
                    this.$emit('playing');
                }, 1000);
            },
            pause() {
                this.isPlay = false;
                this.rotating = false;
                this.$refs.film.style.animationPlayState = 'paused';
                this.$emit('pause');
            },
            ended() {
                this.isPlay = false;
                this.rotating = false;
                this.$audio.currentTime = 0;
                this.$emit('ended');
            },
            seeking() {
                this.$emit('seeking');
            },
            seeked() {
                this.$emit('seeked');
            },
            calProgress(currentTime) {
                if (!this.isProgress) {
                    return;
                }
                currentTime = isNaN(currentTime) ? 0 : Number(currentTime).toFixed(0);
                const duration = isNaN(this.duration) ? 0 : Number(this.duration);

                this.currentTime = currentTime;
                this.progress = ((currentTime / duration) * 100).toFixed(4);
                this.key = +new Date();
            },
            loadedmetadata() {
                const duration = this.$audio.duration;
                this.duration = isNaN(duration) ? 0 : Number(duration).toFixed(0);
                this.$audio.currentTime = this.currentTime;
                this.loaded = true;
                this.$emit('loadedmetadata');
            },
            loadstart() {
            },
            load() {
                this.$audio.load();
            },
            seek(currentTime) {
                this.currentTime = currentTime;
                this.hasCheckTime = false;
                if (this.loaded) {
                    this.$audio.currentTime = currentTime;
                    this.calProgress(currentTime);
                }
            },
            // 自定义按钮播放
            clickPlay() {
                this.isPlay = true;
                this.$audio.play();
                this.$audio.currentTime = this.currentTime;
                this.calProgress(this.currentTime);
            },
            // 自定义按钮暂停
            clickPause() {
                this.isPlay = false;
                this.pause();
                this.$audio.pause();
            },
            // 快进结束
            slide(e) {
                const currentTime = this.duration * e / 100;
                if (this.loaded) {
                    this.$audio.currentTime = currentTime;
                }
                this.isProgress = true;
            },
            // 快进开始
            start() {
                this.isProgress = false;
            },
            // 音量
            setVolume(val) {
                this.$audio.volume = val;
            }
        }
    };
</script>
