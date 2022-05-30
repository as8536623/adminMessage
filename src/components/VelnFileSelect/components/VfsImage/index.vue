<style lang="scss" src='./style.scss'>
</style>

<template>
    <div class="veln__file__image">
        <vfs-header v-if="type !== 'PUBLIC_IMAGE'" :type="type" :category="category" @focus="categoryFocus" @enter="search"/>
        <section v-infinite-scroll="loadNext" class="vfi__container">
            <div
                v-for="(item, index) in progressList"
                :key="'uploading' + index"
                class="vfi__item pull-left uploading"
                :class="{'active': active.includes(uploadingList[index].fileId)}"
                @click="handleSelect(uploadingList[index])"
            >
                <div class="vfi__item__main" :style="{backgroundImage: 'url('+ defaultImage +')'}">
                    <veln-image class="vfi__item__bg" :src="uploadingList[index].src"/>
                    <div v-if="uploadingList[index].fileId" class="vfi__item__info">
                        <span>{{ uploadingList[index].createdAt }}</span>
                        <span class="pull-right">{{ uploadingList[index].size }}</span>
                    </div>
                    <div v-if="!uploadingList[index].fileId" class="vfs__uploading__shadow">
                        <div class="vfs__progressing">
                            <circle-progress class="vfs__uploading__progress" :progress="item || 0"/>
                            <div
                                v-if="!uploadingList[index].fileId"
                                class="vfs__uploading__block"
                                @click="cancelUpload(uploadingList[index], item, index)"
                            />
                        </div>
                    </div>
                </div>
                <div
                    class="vfi__item__name"
                    :title="uploadingList[index].name"
                >{{ uploadingList[index].name }}</div>
            </div>
            <div
                v-for="(item, index) in list"
                :key="index"
                class="vfi__item pull-left"
                :class="{'active': active.includes(item.fileId)}"
                @click="handleSelect(item)"
            >
                <div class="vfi__item__main" :style="{backgroundImage: 'url('+ defaultImage +')'}">
                    <veln-image class="vfi__item__bg" :src="item.viewUrl"/>
                    <div v-if="type !== 'PUBLIC_IMAGE'" class="vfi__item__info">
                        <span>{{ item.createdAt }}</span>
                        <span class="pull-right">{{ item.size }}</span>
                    </div>
                </div>
                <div class="vfi__item__name" :title="item.name">{{ item.name }}</div>
            </div>
            <div v-if="!list.length && !uploadingList.length" class="vfs__empty__line">--{{ $t('暂无数据') }}--</div>
        </section>
    </div>
</template>

<script>
    import VfsHeader from '../VfsHeader';
    import CircleProgress from '@/components/CircleProgress';
    import {mapGetters} from 'vuex';
    import {getFilePage} from '../../api/fs';
    import {calFileSize} from '../../utils';
    import moment from 'moment';
    import {PublicImage} from '@/model/PublicImage'

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
                listQuery: {
                    pageNum: 1,
                    pageSize: 12,
                    categoryId: '',
                    appCode: this.appCode,
                    funCode: this.funCode,
                    mediaType: 'img',
                    name: ''
                }
            };
        },
        computed: {
            ...mapGetters(['defaultImage'])
        },
        watch: {
            type: {
                handler(val) {
                    if (val && val === 'PUBLIC_IMAGE') {
                        this.initPublicImage();
                    } else {
                        if (val === 'IMAGE') {
                            this.getList({pageNum: 1});
                        } else {
                            this.active = [];
                        }
                    }
                },
                immediate: true
            },
            category: {
                handler(val) {
                    if (this.type && this.type === 'PUBLIC_IMAGE') {
                        this.initPublicImage();
                    } else {
                        this.listQuery.categoryId = val.id;
                        this.listQuery.categoryName = val.name;
                        this.getList({pageNum: 1});
                    }
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
            initPublicImage() {
                this.list = new PublicImage().generateImageList();
            },
            formatList(arr) {
                Array.isArray(arr) &&
                    arr.map(item => {
                        if (item.qgFileDetail && item.qgFileDetail.fileSize) {
                            item.size = calFileSize(item.qgFileDetail.fileSize);
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
            search(condition) {
                this.listQuery.name = condition.keywords;
                this.getList({pageNum: 1});
            },
            categoryFocus() {
                this.$emit('show-category');
            },
            loadNext() {
                if (this.type !== 'PUBLIC_IMAGE') {
                    this.getList({
                        pageNum: this.listQuery.pageNum + 1
                    });
                }
            },
            clearUploadingList() {
                this.uploadingList = [];
                this.progressList = [];
            },
            fileQuened(file) {
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
                this.uploadingList[index].src = file.viewUrl;
                this.uploadingList[index].viewUrl = file.viewUrl;
                this.uploadingList[index].size = calFileSize(file.size);
                this.uploadingList[index].qgFileDetail = {
                    fileSize: file.size,
                    mediaType: 'image'
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
