<style lang="scss" src='./style.scss'>
</style>

<template>
    <div class="veln__file__audio">
        <vfs-header :type="type" :category="category" @focus="categoryFocus" @enter="search"/>
        <section v-infinite-scroll="loadNext" class="vfa__container">
            <div
                v-for="(item, index) in progressList"
                :key="'uploading' + index"
                class="vfa__item pull-left uploading"
                :class="{'active': active.includes(uploadingList[index].fileId)}"
                @click="handleSelect(uploadingList[index])"
            >
                <div class="vfa__item--left">
                    <div class="vfa__item__name" :title="uploadingList[index].name">
                        <span class="vfa__item__icon"/>
                        <span class="vfa__item__name__text">{{ uploadingList[index].name }}</span>
                    </div>
                    <div class="vfa__item__info">
                        <span class="vfa__item__time">{{ uploadingList[index].createdAt }}</span>
                    </div>
                </div>
                <div class="vfa__item--right">
                    <div
                        class="vfs__audio__uploading"
                        @click="cancelUpload(uploadingList[index], item, index)"
                    >
                        <circle-progress
                            color="#25B864"
                            class="vfs__audio__progress"
                            :progress="item"
                        />
                        <div class="vfs__audio__block"/>
                    </div>
                </div>
            </div>
            <div
                v-for="(item, index) in list"
                :key="index"
                class="vfa__item pull-left"
                :class="{'active': active.includes(item.fileId)}"
                @click="handleSelect(item)"
            >
                <div class="vfa__item--left">
                    <div class="vfa__item__name" :title="item.name">
                        <span class="vfa__item__icon"/>
                        <span class="vfa__item__name__text">{{ item.name }}</span>
                    </div>
                    <div class="vfa__item__info">
                        <span class="vfa__item__time">{{ item.createdAt }}</span>
                        <span class="pull-right">{{ item.duration }}</span>
                    </div>
                </div>
                <div class="vfa__item--right">
                    <div
                        v-show="currentPlay===item.fileId"
                        class="vfa__item__loading active"
                        @click.stop="pause(item)"
                    >
                        <svg-icon icon-class="loading_bar" class-name="vfa__loading__icon"/>
                        <span class="vfa__playing__text">播放中</span>
                    </div>
                    <div
                        v-show="currentPlay!==item.fileId"
                        class="vfa__item__loading"
                        @click.stop="play(item)"
                    >
                        <svg-icon icon-class="play" class-name="vfa__play__icon"/>
                        <span class="vfa__playing__text">播放</span>
                    </div>
                </div>
            </div>
            <div v-if="!list.length && !uploadingList.length" class="vfs__empty__line">--{{ $t('暂无数据') }}--</div>
        </section>
        <audio ref="audio" autoplay :src="currentSrc"/>
    </div>
</template>

<script>
    import VfsHeader from '../VfsHeader';
    import CircleProgress from '@/components/CircleProgress';
    import {getFilePage} from '../../api/fs';
    import {calFileDuration, calFileSize} from '../../utils';
    import moment from 'moment';

    export default {
        name: 'VelnFileVideo',
        components: {
            VfsHeader,
            CircleProgress
        },
        props: {
            category: {
                type: Object,
                default: () => {
                    return {
                        id: '',
                        name: ''
                    };
                }
            },
            type: {
                type: String,
                default: ''
            },
            appCode: {
                type: String,
                default: ''
            },
            funCode: {
                type: String,
                default: ''
            },
            multiSelect: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                list: [],
                uploadingList: [],
                progressList: [],
                active: [],
                currentPlay: '',
                currentSrc: '',
                listQuery: {
                    pageNum: 1,
                    pageSize: 10,
                    categoryId: '',
                    appCode: this.appCode,
                    mediaType: 'audio',
                    name: ''
                }
            };
        },
        watch: {
            type: {
                handler(val) {
                    if (val === 'AUDIO') {
                        this.getList({pageNum: 1});
                    } else {
                        this.active = [];
                    }
                },
                immediate: true
            },
            category: {
                handler(val) {
                    this.listQuery.categoryId = val.id;
                    this.listQuery.categoryName = val.name;
                    this.getList({pageNum: 1});
                },
                immediate: true,
                deep: true
            },
            multiSelect: {
                handler(val) {
                    this.active = [];
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            formatList(arr) {
                Array.isArray(arr) && arr.map(item => {
                    if (item.qgFileDetail && item.qgFileDetail.fileSize) {
                        item.size = calFileSize(item.qgFileDetail.fileSize);
                    }

                    if (item.qgFileDetail && item.qgFileDetail.length) {
                        item.duration = calFileDuration(
                            item.qgFileDetail.length
                        );
                    }

                    if (item.qgFileDetail && item.qgFileDetail.createdAt) {
                        item.createdAt = moment(
                            item.qgFileDetail.createdAt
                        ).format('YYYY / MM / DD');
                    }
                });
                return arr;
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                getFilePage(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        let list = this.list;
                        result.data.list = this.formatList(result.data.list);
                        if (params.pageNum === 1) {
                            list = result.data.list || [];
                        } else {
                            list = list.concat(result.data.list || []);
                        }
                        this.list = list;
                        this.listQuery.pageNum = params.pageNum;
                    } else {
                        this.$errorMsg(
                            this.$t(result.msg || '获取音频文件列表出错')
                        );
                    }
                });
            },
            notice() {
                const result = [];
                this.list.map(item => {
                    if (this.active.includes(item.fileId)) {
                        result.push(item);
                    }
                });

                this.$emit('select', result);
            },
            handleSelect(item) {
                if (!item.fileId) {
                    return;
                }
                const fileId = item.fileId;
                const index = this.active.indexOf(fileId);
                if (index > -1) {
                    this.active.splice(index, 1);
                } else {
                    this.active.push(fileId);
                }
                if (!this.multiSelect && this.active.length) {
                    this.active = [this.active.pop()];
                }
                this.notice();
            },
            play(item) {
                this.currentPlay = item.fileId;
                this.currentSrc = item.viewUrl;
                // this.$refs.audio.play();
            },
            pause(item) {
                this.$refs.audio.pause();
                this.currentPlay = '';
            },
            search(condition) {
                this.listQuery.name = condition.keywords;
                this.getList({pageNum: 1});
            },
            categoryFocus() {
                this.$emit('show-category');
            },
            loadNext() {
                this.getList({
                    pageNum: this.listQuery.pageNum + 1
                });
            },
            clearUploadingList() {
                this.uploadingList = [];
                this.progressList = [];
            },
            fileQuened(file) {
                file.size = calFileSize(file.size);
                file.createdAt = moment().format('YYYY / MM / DD');
                this.uploadingList.unshift(file);
                this.progressList.unshift(0);
            },
            getFileById(id) {
                const length = this.uploadingList.length;
                let index = -1;
                for (let i = 0; i < length; i++) {
                    const item = this.uploadingList[i];
                    if (item.id === id) {
                        index = i;
                        break;
                    }
                }
                return index;
            },
            fileUploading(file) {
                const index = this.getFileById(file.id);
                if (index === -1 || this.progressList[index] === -1) {
                    return;
                }
                this.uploadingList[index].progress = file.progress;
                console.log(file.progress);
                this.$set(this.progressList, index, file.progress);
            },
            uploadSuccess(file) {
                const index = this.getFileById(file.id);
                if (index === -1 || this.progressList[index] === -1) {
                    return;
                }
                this.uploadingList[index].fileId = file.fileId;
                this.uploadingList[index].viewUrl = file.viewUrl;
                this.uploadingList[index].size = calFileSize(file.size);
                this.uploadingList[index].qgFileDetail = {
                    fileSize: file.size,
                    mediaType: 'audio'
                };
                this.$set(this.progressList, index, 2);
            },
            cancelUpload(file, progress, index) {
                if (progress >= 1) {
                    return;
                }
                this.$set(this.progressList, index, -1);
                this.$emit('upload-cancel', file);
            }
        }
    };
</script>
