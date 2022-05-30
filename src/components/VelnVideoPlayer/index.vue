<style lang="scss">
    @import "./style";
</style>

<template>
    <div
        ref="videoWrapper"
        class="video__player__wrapper"
        @mousemove="mousemove"
    >
        <video
            id="videoPlayer"
            class="video-js vjs-default-skin"
            :poster="poster"
            crossOrigin="anonymous"
            controls
            @click.stop="pause"
        />
        <div class="video__player__controls" :class="{'active': isControls}">
            <!--播放、暂停-->
            <div class="video__player__operation" @click.stop="operationClick">
                <svg-icon v-if="isPlaying" icon-class="playing_a" class-name="operation__icon"/>
                <svg-icon v-else icon-class="pause_v" class-name="operation__icon"/>
            </div>
            <!--进度条-->
            <video-progress :key="key" :progress="progress" @slide="slide" @start="start"/>
            <div class="video__player__right">
                <!--时间-->
                <div class="video__player__time">
                    <span class="video__player__current">{{ currentTime | videoTimeFilter }}</span>
                    <span class="video__player__split">/</span>
                    <span class="video__player__duration">{{ duration | videoTimeFilter }}</span>
                </div>
                <!--清晰度-->
                <div class="video__player__definition">
                    <span class="definition__show">{{ definition }}</span>
                    <div class="definition__list">
                        <div
                            v-for="(item, idx) in list"
                            :key="idx"
                            class="definition__item"
                            :class="{'active': idx === currentIndex}"
                            @click.stop="definitionChange(idx)"
                        >
                            {{ item.definition }}
                        </div>
                    </div>
                </div>
                <!--声音-->
                <video-voice ref="voice" :volume="volume" @setVolume="setVolume"/>
                <!--切屏-->
                <div class="video__player__screen" @click.stop="cuttingScreenClick">
                    <svg-icon v-if="!isFullScreen" icon-class="full_v" class-name="screen__icon"/>
                    <svg-icon v-else icon-class="small_v" class-name="screen__icon"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import VideoProgress from './components/VideoProgress';
    import VideoVoice from './components/VideoVoice';
    import {getToken} from '@/utils/auth';

    export default {
        name: 'VelnVideoPlayer',
        components: {
            VideoProgress,
            VideoVoice
        },
        props: {
            index: {
                type: Number,
                default: 0
            },
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            referId: {
                type: String,
                default: ''
            },
            poster: {
                type: String,
                default: ''
            },
            autoplay: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                loaded: false,
                player: null, // 播放器
                duration: 0, // 总时长
                currentTime: 0,
                volume: 0.5, // 音量
                isPlaying: false, // 播放状态
                isFullScreen: false, // 是否全屏
                isSlide: true, // 滑动开始false
                progress: 0, // 进度
                key: null,
                isControls: true, // 底部操作
                timeOut: null,
                isDefinition: false, // 切换清晰度--记录当前进度
                definition: this.list[this.index].definition, // 清晰度
                currentIndex: this.index // 当前清晰度视频下标
            };
        },
        watch: {
            list: {
                handler(val) {
                    if (Array.isArray(val)) {
                        if (this.player) {
                            this.player.src(this.list[this.index].src);
                            this.player.posterImage.setSrc(this.poster);
                            this.player.load(this.list[this.index].src);
                            this.loaded = false;
                        }
                        this.definition = this.list[this.index].definition;
                    }
                },
                immediate: true
            },
            poster(val) {
                this.poster = val;
            },
            index(val) {
                this.currentIndex = val;
            }
        },
        mounted() {
            this.formatData();
        },
        beforeDestroy() {
            this.unbindEvents();
        },
        methods: {
            unbindEvents() {
                const that = this;
                that.player.off('loadedmetadata', that.loadedmetadata);
                that.player.off('playing', that.playing);
                that.player.off('pause', that.paused);
                that.player.off('seeking', that.seeking);
                that.player.off('seeked', that.seeked);
                that.player.off('timeupdate', that.timeupdate);
                that.player.off('ended', that.ended);
                document.removeEventListener('fullscreenchange', this.fullscreenchange);
                that.timeOut && clearTimeout(that.timeOut);
                that.player && that.player.dispose();
            },
            formatData() {
                const that = this;
                that.player = window.videojs('videoPlayer', {
                    autoplay: this.autoplay, // 如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [
                        {
                            type: 'application/x-mpegURL', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
                            src: this.list[this.index].src // url地址
                        }
                    ],
                    hls: true,
                    bigPlayButton: true,
                    textTrackDisplay: false,
                    posterImage: true,
                    errorDisplay: false,
                    controlBar: true,
                    token: getToken(),
                    referId: this.referId,
                    domain: location.protocol + '//' + location.host
                }, () => {
                    that.bindEvents();
                });
            },
            bindEvents() {
                const that = this;
                that.player.on('loadedmetadata', that.loadedmetadata);
                that.player.on('playing', that.playing);
                that.player.on('pause', that.paused);
                that.player.on('seeking', that.seeking);
                that.player.on('seeked', that.seeked);
                that.player.on('timeupdate', that.timeupdate);
                that.player.on('ended', that.ended);
                document.addEventListener('fullscreenchange', this.fullscreenchange);
            },
            loadedmetadata() {
                const duration = this.player.cache_.duration;
                this.duration = isNaN(duration) ? 0 : Number(duration).toFixed(0);
                this.player.volume(this.volume);
                this.loaded = true;
                if (this.isDefinition) {
                    return;
                }
                this.$emit('loadedmetadata');
            },
            // 播放
            playing() {
                this.isPlaying = true;
                this.$emit('playing');
            },
            // 暂停
            paused() {
                this.isPlaying = false;
                this.$emit('pause');
            },
            // 结束
            ended() {
                this.$emit('ended');
            },
            // 时间更新
            timeupdate() {
                // console.log('timeupdate', this.player.cache_.currentTime);
                // 切换清晰度--记录当前进度
                if (this.isDefinition) {
                    this.isDefinition = false;
                    this.player.currentTime(this.currentTime);
                    this.player.play();
                }
                this.calProgress(this.player.cache_.currentTime);
                this.$emit('timeupdate', this.player.cache_.currentTime);
            },
            seeked() {
                this.$emit('seeked', this.player.cache_.currentTime);
            },
            seeking() {
                this.$emit('seeking', this.player.cache_.currentTime);
            },
            calProgress(currentTime) {
                if (!this.isSlide) {
                    return;
                }
                currentTime = isNaN(currentTime) ? 0 : Number(currentTime).toFixed(0);
                const duration = isNaN(this.duration) ? 0 : Number(this.duration);

                this.currentTime = currentTime;
                this.progress = ((currentTime / duration) * 100).toFixed(4);
                this.key = +new Date();
            },
            // 跳转--记录进度
            seek(currentTime) {
                const that = this;
                if (that.loaded) {
                    that.player.currentTime(currentTime);
                    that.player.play();
                }
            },
            load() {
                if (this.loaded) {
                    this.player.load();
                }
            },
            // 自定义按钮播放
            play() {
                if (this.loaded) {
                    this.player.play();
                }
            },
            // 自定义按钮暂停
            pause() {
                this.player.pause();
            },
            // 音量
            setVolume(volume) {
                this.player.volume(volume);
                this.volume = volume;
            },
            // 自定义按钮播放、暂停
            operationClick() {
                if (!this.loaded) {
                    return;
                }
                if (this.isPlaying) {
                    this.player.pause();
                } else {
                    this.player.play();
                }
                this.isPlaying = !this.isPlaying;
            },
            // 进度条快进结束
            slide(e) {
                const currentTime = this.duration * e / 100;
                if (this.loaded) {
                    this.player.currentTime(currentTime);
                }
                this.isSlide = true;
            },
            // 进度条快进开始
            start() {
                this.isSlide = false;
            },
            // 切屏
            cuttingScreenClick() {
                const video = this.$refs.videoWrapper;
                if (this.isFullScreen) {
                    // 退出全屏
                    this.exitFullscreen(video);
                } else {
                    // 进去全屏
                    this.requestFullscreen(video);
                }
                this.isFullScreen = !this.isFullScreen;
            },
            // 清晰度切换
            definitionChange(idx) {
                if (idx === this.currentIndex) {
                    return;
                }
                this.definition = this.list[idx].definition;
                this.player && this.player.src({src: this.list[idx].src});
                this.currentIndex = idx;
                this.isDefinition = true;
                this.loaded = false;
                this.$emit('definition');
            },
            // 鼠标移动
            mousemove() {
                const that = this;
                that.isControls = true;
                that.timeOut && clearTimeout(that.timeOut);
                that.timeOut = setTimeout(() => {
                    // if (that.isControls) {
                    //     that.isControls = false;
                    //     clearTimeout(that.timeOut);
                    // }
                }, 5000);
            },
            // 进入全屏
            requestFullscreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen(); // 标准
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullscreen(); // 火狐
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen(); // 谷歌
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen(); // IE
                }
            },
            // 退出全屏
            exitFullscreen() {
                // 判断各种浏览器，找到正确的方法
                const cfs = document.cancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitExitFullscreen || document.exitFullscreen;
                if (cfs) {
                    cfs.call(document);
                } else if (typeof window.ActiveXObject !== 'undefined') { // for Internet Explorer
                    const wscript = new window.ActiveXObject('WScript.Shell');
                    if (wscript !== null) {
                        wscript.SendKeys('{F11}');
                    }
                }
            },
            // 判断是否全屏模式
            fullscreenchange() {
                const isFullscreen = document.IsFullScreen || document.webkitIsFullScreen || document.msIsFullScreen || document.mozIsFullScreen;
                if (isFullscreen) {
                    this.isFullScreen = true;
                } else {
                    this.isFullScreen = false;
                }
            }
        }
    };
</script>
