<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <article class="course__video">
        <div class="course__video--top">
            <div class="course__video__left">
                <veln-audio-player
                    v-if="currentData"
                    ref="audio"
                    :key="key"
                    :src="currentData.src"
                    :c-index="cIndex"
                    :b-index="bIndex"
                    @prev="prev"
                    @next="next"
                    @playing="playing"
                    @pause="pause"
                    @ended="ended"
                    @timeupdate="timeupdate"
                    @seeking="seeking"
                    @seeked="seeked"
                    @loadedmetadata="loadedmetadata"
                />
            </div>
            <div class="course__video__right">
                <course-catalog @chapterHandle="chapterBackHandle"/>
            </div>
        </div>
    </article>
</template>
<script>
    import VelnAudioPlayer from '../VelnAudioPlayer';
    import CourseCatalog from '../CourseCatalog';
    import {getCourseItem} from '@/api/course/course/courseItem';
    import {socketEmit} from '@/utils/socket';

    export default {
        name: 'CourseAudio',
        components: {
            VelnAudioPlayer,
            CourseCatalog
        },
        data() {
            return {
                isPlaying: false,
                cIndex: 0, // 当前章节
                bIndex: 0, // 当前章节小节
                currentData: null,
                catalogList: [], // 目录
                key: null,
                isFirst: true, // 用于第一次不播放 切换小节、播放结束进入下一小节自动播放
                isMounted: false,
                lastTime: +new Date(),
                currentTime: null,
                isSkip: false
            };
        },
        mounted() {
            this.getDirectory(true);
        },
        methods: {
            // 目录
            getDirectory(sortFlag) {
                const params = {
                    courseId: this.$parent.id,
                    sortFlag: sortFlag
                };
                getCourseItem(params).then(re => {
                    const res = re.data;
                    const result = res.data;
                    if (res && res.success) {
                        this.catalogList = result.directory;
                        if (Array.isArray(this.catalogList)) {
                            this.maxCIndex = this.catalogList.length - 1;
                            if (this.catalogList[this.maxCIndex].list) {
                                this.maxBIndex = this.catalogList[this.maxCIndex].list.length - 1;
                            }
                        }
                        this.changeActiveIndex(result.lastStudyItemId);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取数据失败'));
                    }
                });
            },
            // 目录切换
            chapterBackHandle(e) {
                if (this.cIndex === e.c_index && this.bIndex === e.b_index) {
                    if (e.isPlay) {
                        this.$refs.audio.clickPlay();
                    } else {
                        this.$refs.audio.clickPause();
                    }
                    return;
                }
                this.cIndex = e.c_index;
                this.bIndex = e.b_index;
                this.isFirst = false;
                this.getCurrentChapter(false);
            },
            loadedmetadata() {
                this.isMounted = true;
            },
            // 播放
            playing() {
                this.checkTime = +new Date();
                this.isPlaying = true;
                if (!this.isSkip) {
                    this.$refs.audio.seek(this.currentData.location);
                    this.isSkip = true;
                }
            },
            // 暂停
            pause() {
                this.isPlaying = false;
                this.checkTime = '';
            },
            pauseMedia(re) {
                this.$refs.audio.clickPause();
            },
            timeupdate(time) {
                // this.previousTime = this.currentTime;
                this.currentTime = time;
                this.preSocket(false, time);
            },
            seeking() {
            },
            seeked() {
            },
            // 播放结束进入下一个
            ended() {
                let isEnd = false;
                const item = this.catalogList[this.cIndex];
                if (this.catalogList.length - 1 > this.cIndex) {
                    if (item.list && item.list.length - 1 === this.bIndex) {
                        this.cIndex++;
                        this.bIndex = 0;
                    } else {
                        this.bIndex++;
                    }
                } else if (item.list && item.list.length - 1 > this.bIndex) {
                    this.bIndex++;
                } else {
                    isEnd = true;
                }
                this.isFirst = false;
                !isEnd && this.getCurrentChapter();
            },
            // 上一小节
            prev() {
                const item = this.catalogList[this.cIndex];
                if (this.cIndex === 0) {
                    if (item.list && this.bIndex > 0) {
                        this.bIndex--;
                    }
                } else {
                    if (item.list && this.bIndex === 0) {
                        this.cIndex--;
                        this.bIndex = this.catalogList[this.cIndex].list.length - 1;
                    } else {
                        this.bIndex--;
                    }
                }
                this.isFirst = false;
                this.getCurrentChapter();
            },
            // 下一小节
            next() {
                const item = this.catalogList[this.cIndex];
                if (this.catalogList.length - 1 === this.cIndex) {
                    this.bIndex++;
                } else {
                    if (item.list && item.list.length - 1 === this.bIndex) {
                        this.cIndex++;
                        this.bIndex = 0;
                    } else {
                        this.bIndex++;
                    }
                }
                this.isFirst = false;
                this.getCurrentChapter();
            },
            // 定位到当前课程
            changeActiveIndex(second) {
                let index = 0;
                let idx = 0;
                const catalogList = this.catalogList;
                for (let i = 0; i < catalogList.length; i++) {
                    const list = catalogList[i].list || [];
                    for (let j = 0; j < list.length; j++) {
                        if (list[j].id === second) {
                            index = i;
                            idx = j;
                        }
                    }
                }
                this.cIndex = index;
                this.bIndex = idx;
                this.getCurrentChapter();
            },
            // 获取当前播放的章节
            getCurrentChapter(sendMsg = false) {
                const item = this.catalogList[this.cIndex];
                this.currentData = {
                    itemId: item.list[this.bIndex].id,
                    learned: item.list[this.bIndex].learned >= 100,
                    src: item.list[this.bIndex].srcUrl,
                    location: item.list[this.bIndex].location || 0,
                    srcSize: item.list[this.bIndex].srcSize
                };
                this.key = +new Date();
            },
            preSocket(end, currentTime) {
                if (!end) {
                    const now = +new Date();
                    if (now - this.lastTime <= 3000 || currentTime < 3) {
                        return;
                    }
                    this.lastTime = now;
                }
                const params = {
                    courseId: this.$parent.id,
                    itemId: this.currentData.itemId,
                    location: parseInt(currentTime) || 0,
                    end
                };
                socketEmit('STUDY_RECORD', params);
                this.currentData.location = params.location;
                if (this.currentData.location >= this.currentData.srcSize) {
                    this.currentData.location = this.currentData.srcSize;
                }
            }
        }
    };
</script>
