<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <article class="course__video">
        <div class="course__video--top">
            <div class="course__video__left">
                <veln-video-player
                    v-if="currentData"
                    ref="video"
                    :index="defaultViewIndex"
                    :list="currentData.videoList"
                    :poster="currentData.coverUrl"
                    @playing="playing"
                    @pause="pause"
                    @ended="ended"
                    @timeupdate="timeupdate"
                    @seeking="seeking"
                    @seeked="seeked"
                    @loadedmetadata="loadedmetadata"
                    @definition="definition"
                />
            </div>
            <div class="course__video__right">
                <course-catalog @chapterHandle="chapterBackHandle"/>
            </div>
        </div>
    </article>
</template>
<script>
    import CourseCatalog from '../CourseCatalog';
    import VelnVideoPlayer from '@/components/VelnVideoPlayer';
    import {getOpenCourseItem} from '@/api/course/course/courseItem';
    import {socketEmit} from '@/utils/socket';
    import {VIDEO_DEFINITION} from '@/enum';

    export default {
        name: 'CourseVideo',
        components: {
            CourseCatalog,
            VelnVideoPlayer
        },
        data() {
            return {
                isPlaying: false,
                cIndex: 0, // 当前章节
                bIndex: 0, // 当前章节小节
                currentData: null, // 当前小节数据
                catalogList: [], // 目录
                startPlay: true,
                lastTime: +new Date(),
                seekStart: 0,
                previousTime: 0,
                learnedTime: 0, // 当前可播放进度时间
                seekTime: 0, // 记录初始化进度
                isFirst: true, // 用于第一次不播放 切换小节、播放结束进入下一小节自动播放
                key: null,
                timeOut: null,
                checkTime: 0,
                isSkip: false,
                VIDEO_DEFINITION,
                defaultViewIndex: 0,
                isMounted: true // 记录进度
            };
        },
        mounted() {
            this.getDirectory(true);
        },
        beforeDestroy() {
            this.timeOut && clearTimeout(this.timeOut);
        },
        methods: {
            // 目录
            getDirectory(sortFlag) {
                const params = {
                    courseId: this.$parent.id,
                    sortFlag: sortFlag
                };
                getOpenCourseItem(params).then(re => {
                    const res = re.data;
                    const result = res.data;
                    if (result && res.success) {
                        this.catalogList = result.directory;
                        this.changeActiveIndex(result.lastStudyItemId);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取数据失败'));
                    }
                });
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
                console.log('cIndex | bIndex:', this.cIndex, this.bIndex);
                this.getCurrentChapter();
            },
            // 获取当前播放的章节
            getCurrentChapter(sendMsg = false) {
                const item = this.catalogList[this.cIndex];
                const videoList = this.videoHandle(item.list[this.bIndex].videoUrlMap);
                const defaultDefinition = item.list[this.bIndex].defaultDefinition;
                console.log('videoList: ', videoList);
                videoList.forEach((item, index) => {
                    if (item.defCode === defaultDefinition) {
                        this.defaultViewIndex = index;
                    }
                });
                console.info('defaultIndex:', this.defaultViewIndex);
                this.currentData = {
                    itemId: item.list[this.bIndex].id,
                    srcId: item.list[this.bIndex].srcId,
                    learned: item.list[this.bIndex].learned >= 100,
                    src: item.list[this.bIndex].srcUrl,
                    coverUrl: item.list[this.bIndex].coverUrl,
                    videoList: videoList,
                    location: item.list[this.bIndex].location || 0,
                    srcSize: item.list[this.bIndex].srcSize
                };
            },
            videoHandle(map) {
                const videoList = [];
                VIDEO_DEFINITION.arr.map((item) => {
                    if (map[item.code]) {
                        const data = {
                            src: map[item.code],
                            definition: item.name,
                            defCode: item.code
                        };
                        videoList.push(data);
                    }
                });
                return videoList;
            },
            // 获取章节
            chapterBackHandle(e) {
                // eslint-disable-next-line camelcase
                const {c_index, b_index, isPlay} = e;
                // eslint-disable-next-line camelcase
                if (this.cIndex === c_index && this.bIndex === b_index) {
                    if (isPlay) {
                        this.$refs.video.play();
                    } else {
                        this.$refs.video.pause();
                    }
                    return;
                }
                this.$refs.video.pause();
                // eslint-disable-next-line camelcase
                this.cIndex = c_index;
                // eslint-disable-next-line camelcase
                this.bIndex = b_index;
                this.isPlaying = isPlay;
                this.isFirst = false;
                this.learnedTime = 0;
                this.isMounted = true;
                this.seekTime = 0;
                this.getCurrentChapter(false);
            },
            // 播放结束进入下一个
            endedBack() {
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
            loadedmetadata() {
                this.timeOut && clearTimeout(this.timeOut);
                this.timeOut = setTimeout(() => {
                    // 首次不播放
                    if (!this.isFirst) {
                        this.$refs.video.play();
                    }
                }, 1000);
            },
            // 清晰度切换 -- 不记录进度
            definition() {
                this.isMounted = false;
            },
            playing() {
                this.checkTime = +new Date();
                this.isPlaying = true;
                if (!this.isSkip) {
                    this.$refs.video.seek(this.currentData.location);
                    this.isSkip = true;
                }
            },
            pause() {
                if (this.checkTime && (+new Date()) - this.checkTime < 300) {
                    this.$refs.video.play();
                    return;
                }
                this.checkTime = '';
                this.isPlaying = false;
            },
            ended() {
                this.endedBack();
                this.isPlaying = false;
            },
            timeupdate(time) {
                this.previousTime = this.currentTime;
                this.currentTime = time;
                this.preSocket(false, time);
                // 记录下一次可播放时间点 (是否需要？)
                if (!this.seekStart && this.learnedTime < this.currentTime) {
                    this.learnedTime = this.currentTime;
                }
            },
            seeking(time) {
            },
            seeked(time) {
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
