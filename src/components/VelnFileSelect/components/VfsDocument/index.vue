<style lang="scss" src='./style.scss'>
</style>

<template>
    <div class="veln__file__document">
        <vfs-header :type="type" :category="category" @focus="categoryFocus" @enter="search"/>
        <ul v-infinite-scroll="loadNext" class="vfd__container">
            <el-checkbox-group v-model="active" @change="handleSelect">
                <li v-for="(item, index) in progressList" :key="index" class="vfd__line uploading">
                    <div class="vfd__line__checkbox">
                        <div
                            class="vfs__file__uploading"
                            @click="cancelUpload(uploadingList[index], item, index)"
                        >
                            <circle-progress
                                color="#25B864"
                                class="vfs__file__progress"
                                :progress="item"
                            />
                            <div class="vfs__file__block"/>
                        </div>
                    </div>
                    <div class="vfd__line__name">
                        <span class="vfd__line__icon" :data-type="uploadingList[index].iconType"/>
                        <span class="vfd__name">{{ uploadingList[index].name }}</span>
                    </div>
                    <div class="vfd__line__page">--</div>
                    <div class="vfd__line__time">{{ uploadingList[index].createdAt }}</div>
                    <div class="vfd__line__size">{{ uploadingList[index].size }}</div>
                </li>
                <li v-for="(item, index) in list" :key="index" class="vfd__line">
                    <div class="vfd__line__checkbox">
                        <el-checkbox :label="item.fileId">{{ '' }}</el-checkbox>
                    </div>
                    <div class="vfd__line__name">
                        <span class="vfd__line__icon" :data-type="item.iconType"/>
                        <span class="vfd__name">{{ item.name }}</span>
                    </div>
                    <div
                        class="vfd__line__page"
                    >{{ item.pageTotal ? (item.pageTotal + $t('页')) : '--' }}
                    </div>
                    <div class="vfd__line__time">{{ item.createdAt }}</div>
                    <div class="vfd__line__size">{{ item.size }}</div>
                </li>
                <li v-if="!list.length" class="vfs__empty__line">--{{ $t('暂无数据') }}--</li>
            </el-checkbox-group>
        </ul>
    </div>
</template>

<script>
    import VfsHeader from '../VfsHeader';
    import CircleProgress from '@/components/CircleProgress';
    // import moment from 'moment';
    import {FILE_TYPE_ENUM} from './enum';
    import {getFilePage} from '../../api/fs';
    import {calFileSize} from '../../utils';
    import moment from 'moment';

    export default {
        name: 'VelnFileDocument',
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
                active: [],
                uploadingList: [],
                progressList: [],
                list: [],
                listQuery: {
                    pageNum: 1,
                    pageSize: 10,
                    appCode: this.appCode,
                    categoryId: '',
                    mediaType: 'doc',
                    name: ''
                },
                multiSelection: []
            };
        },
        watch: {
            type: {
                handler(val) {
                    if (val === 'DOC') {
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
                Array.isArray(arr) &&
                    arr.map(item => {
                        if (item.qgFileDetail && item.qgFileDetail.fileSize) {
                            item.size = calFileSize(item.qgFileDetail.fileSize);
                        }

                        if (item.qgFileDetail && item.qgFileDetail.length) {
                            item.pageTotal = item.qgFileDetail.length;
                        }

                        if (item.qgFileDetail && item.qgFileDetail.createdAt) {
                            item.createdAt = moment(
                                item.qgFileDetail.createdAt
                            ).format('YYYY / MM / DD');
                        }

                        if (item.qgFileDetail.fileExt) {
                            item.iconType =
                                FILE_TYPE_ENUM[
                                    item.qgFileDetail.fileExt.split('.')[1]
                                ];
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
                            this.$t(result.msg || '获取文档文件列表出错')
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
            handleSelect(v) {
                if (!v) {
                    return;
                }
                this.active = v;
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
                file.iconType = FILE_TYPE_ENUM[file.ext];
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
                this.uploadingList[index].iconType = FILE_TYPE_ENUM[file.ext];
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
