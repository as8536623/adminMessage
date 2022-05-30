/**
 * 处理试题富文本的 图片/音频/视频的展示
 * 1. 因为博易考原有逻辑是转换成小icon，这里通过操作DOM实现
 */
import i18n from '@/lang';
import {getRandomString} from '@/utils/createUniqueString';

let currentPlayingAudio = null;
let currentPlayingId = '';
let playState = 'ended';

// 重置
const removePlaying = () => {
    // const $ = window.$;
    // 重置背景 audio
    const qguAudio = document.getElementById('qguAudio');
    qguAudio.pause();
    qguAudio.currentTime = 0;

    // 重置保存信息
    currentPlayingId = '';
    currentPlayingAudio = null;

    // 重置样式
    const playingAudio = document.querySelectorAll('.audio--playing');
    const audioBottom = document.getElementsByClassName('audio__progress--bottom');
    for (let i = 0, l = audioBottom.length; i < l; i++) {
        const audioB = audioBottom[i];
        audioB.style.width = '0%';
    }
    // $('.audio__progress--bottom').css('width', '0%');
    for (let i = 0, l = playingAudio.length; i < l; i++) {
        const audio = playingAudio[i];
        audio.classList.remove('audio--playing');
    }
};

const audioClick = (Audio, $event) => {
    $event.stopPropagation();
    $event.preventDefault();
    const qguAudio = document.getElementById('qguAudio');
    const id = Audio.getAttribute('data-id');
    // 如果是当前音频，播放 OR 暂停
    if (id === currentPlayingId && playState === 'playing') {
        currentPlayingAudio.classList.remove('audio--playing');
        qguAudio.pause();
        return;
    }
    if (id === currentPlayingId && playState === 'pause') {
        currentPlayingAudio.classList.add('audio--playing');
        qguAudio.play();
        return;
    }

    // 重置所有信息，播放，保存当前播放信息
    removePlaying();
    currentPlayingId = id;
    currentPlayingAudio = Audio;
    const src = currentPlayingAudio.getAttribute('data-src');
    currentPlayingAudio.classList.add('audio--playing');
    qguAudio.src = src;
    qguAudio.play();
};

// 进度效果
const audioTimeupdate = () => {
    const $ = window.$;
    const qguAudio = document.getElementById('qguAudio');
    const current = qguAudio.currentTime;
    const total = qguAudio.duration;

    const percent = `${Math.floor((current / total) * 10000) / 100}%`;
    $(currentPlayingAudio)
        .find('.audio__progress--bottom')
        .css('width', percent);
};

const audioEnded = () => {
    removePlaying();
};

const audioPlaying = () => {
    playState = 'playing';
};

const audioPause = () => {
    playState = 'pause';
};

const bindAudioEvents = Audio => {
    const qguAudio = document.getElementById('qguAudio');
    Audio.addEventListener(
        'click',
        $event => {
            audioClick(Audio, $event);
        },
        false
    );

    qguAudio.addEventListener('timeupdate', audioTimeupdate, false);
    qguAudio.addEventListener('ended', audioEnded, false);
    qguAudio.addEventListener('playing', audioPlaying, false);
    qguAudio.addEventListener('pause', audioPause, false);
};

const unbindEvents = () => {
    const qguAudio = document.getElementById('qguAudio');
    qguAudio.addEventListener('timeupdate', audioTimeupdate, false);
    qguAudio.addEventListener('ended', audioEnded, false);
    qguAudio.addEventListener('playing', audioPlaying, false);
    qguAudio.addEventListener('pause', audioPause, false);
};

// 渲染音频
const formatAudios = () => {
    const audios = document.querySelectorAll('.image-audio');
    for (let i = 0, l = audios.length; i < l; i++) {
        const audio = audios[i];
        const src = audio.getAttribute('data-src');
        const Audio = document.createElement('div');
        Audio.classList.add('veln__question__audio');
        Audio.setAttribute('data-id', getRandomString());
        Audio.setAttribute('data-src', src);
        const innerHTML = `<span class="question__audio__icon play"></span>
        <div class="question__audio__progress">
            <div class="audio__progress--top"></div>
            <div class="audio__progress--bottom"></div>
        </div>`;
        Audio.innerHTML = innerHTML;
        audio.after(Audio);
        audio.remove();
        bindAudioEvents(Audio);
    }
};

// 处理视频
const formatVideos = () => {
    const videos = document.querySelectorAll('.image-video');
    for (let i = 0, l = videos.length; i < l; i++) {
        const video = videos[i];
        const src = video.getAttribute('data-src');
        const VideoWrapper = document.createElement('div');
        const Video = document.createElement('video');
        Video.src = src;
        Video.setAttribute('controls', true);
        Video.setAttribute('playsinline', true);
        Video.setAttribute('webkit-playsinline', true);
        Video.setAttribute('x5-playsinline', true);
        Video.setAttribute('x5-video-player-type', '');
        Video.classList.add('veln__question__image');
        VideoWrapper.appendChild(Video);
        video.after(VideoWrapper);
        video.remove();
    }
};

// 处理图片
const formatImages = () => {
    const images = document.querySelectorAll('.upload-img');
    for (let i = 0, l = images.length; i < l; i++) {
        const image = images[i];
        const src = image.getAttribute('data-src');
        const Image = document.createElement('img');
        const ImageWrapper = document.createElement('div');
        Image.src = src;
        Image.alt = i18n.t('图片');
        Image.classList.add('veln__question__image');
        ImageWrapper.appendChild(Image);
        image.after(ImageWrapper);
        image.remove();
    }
};

const formatQuestionDom = () => {
    formatImages();
    formatAudios();
    formatVideos();
};

export {formatQuestionDom, removePlaying, unbindEvents};
