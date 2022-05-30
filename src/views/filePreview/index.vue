<style lang="scss">
    @import 'style';
</style>
<template>
    <article class="app-container form__page file__container">
        <el-form label-width="100px" :inline-message="true">
            <veln-form-section
                v-for="(item, index) in list"
                :key="index"
                :title="$t('基本信息')"
                :can-expand="false"
            >
                <!-- <el-row v-if="item.qgFileDetail">
                    <el-col :span="8">
                        <el-form-item
                            :label="$t('创建者') + '：'"
                        >{{item.qgFileDetail.createdBy ? item.qgFileDetail.createdBy : '--'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('创建时间') + '：'">{{item.qgFileDetail.createdAt}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('文件编号') + '：'">{{item.fileId}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('文件名称') + '：'">{{item.name}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="item.qgFileDetail">
                    <el-col :span="8">
                        <el-form-item
                            :label="$t('文件格式') + '：'"
                        >{{item.qgFileDetail.fileExt ? item.qgFileDetail.fileExt.substr(1) : ''}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            :label="$t('文件类型') + '：'"
                        >{{fileTypeEnum.getName(item.qgFileDetail.mediaType)}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="item.qgFileDetail">
                    <el-col :span="8">
                        <el-form-item
                            :label="$t('文件大小') + '：'"
                        >{{calFileSize(item.qgFileDetail.fileSize)}}</el-form-item>
                    </el-col>
                    <el-col
                        :span="8"
                        v-if="item.qgFileDetail.mediaType === 'video' || item.qgFileDetail.mediaType === 'audio'"
                    >
                        <el-form-item :label="$t('文件时长') + '：'">{{item.qgFileDetail.length}}</el-form-item>
                    </el-col>
                    <el-col
                        :span="8"
                        v-else-if="item.qgFileDetail.length && item.qgFileDetail.mediaType !== 'image' && item.qgFileDetail.mediaType !== 'font'"
                    >
                        <el-form-item
                            :label="$t('文件页数') + '：'"
                        >{{item.qgFileDetail.length ? item.qgFileDetail.length + $t('页') : ''}}</el-form-item>
                    </el-col>
                </el-row>-->
                <el-row v-if="item.qgFileDetail">
                    <el-col :span="16" class="file__item">
                        <el-form-item :label="$t('文件') + '：'">
                            <div v-if="item.qgFileDetail.mediaType === 'video'" class="file__video">
                                <video
                                    controls
                                    width="500"
                                    height="278"
                                    preload
                                    :src="item.viewUrl"
                                />
                                <div class="download" @click="download(item)">
                                    <svg-icon icon-class="download" class-name="search__icon"/>
                                    {{ $t('下载') }}
                                </div>
                            </div>
                            <div
                                v-if="item.qgFileDetail.mediaType === 'image'"
                                class="file__picture"
                            >
                                <img v-if="item.viewUrl" :src="item.viewUrl" class="cover__image">
                                <div class="download" @click="download(item)">
                                    <svg-icon icon-class="download" class-name="search__icon"/>
                                    {{ $t('下载') }}
                                </div>
                            </div>
                            <div v-if="item.qgFileDetail.mediaType === 'audio'" class="file__audio">
                                <div class="vfa__item pull-left">
                                    <div class="vfa__item--left">
                                        <div class="vfa__item__name" :title="item.name">
                                            <span class="vfa__item__icon"/>
                                            <span class="vfa__item__name__text">{{ item.name }}</span>
                                        </div>
                                        <div class="vfa__item__info">
                                            <span
                                                class="vfa__item__time"
                                            >{{ dateFormat(item.qgFileDetail.createdAt, 'yyyy/MM/dd') }}</span>
                                            <span
                                                class="pull-right"
                                            >{{ transformSecondToMS(item.qgFileDetail.length) }}</span>
                                        </div>
                                    </div>
                                    <div class="vfa__item--right">
                                        <div
                                            v-show="currentPlay === item.fileId"
                                            class="vfa__item__loading active"
                                            @click.stop="pause(item, item.fileId)"
                                        >
                                            <svg-icon
                                                icon-class="loading_bar"
                                                class-name="vfa__loading__icon"
                                            />
                                            <span class="vfa__playing__text">播放中</span>
                                        </div>
                                        <div
                                            v-show="currentPlay !== item.fileId"
                                            class="vfa__item__loading"
                                            @click.stop="play(item, item.fileId)"
                                        >
                                            <svg-icon
                                                icon-class="play"
                                                class-name="vfa__play__icon"
                                            />
                                            <span class="vfa__playing__text">播放</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="download" @click="download(item)">
                                    <svg-icon icon-class="download" class-name="search__icon"/>
                                    {{ $t('下载') }}
                                </div>
                                <audio ref="audio" autoplay :src="currentSrc"/>
                            </div>
                            <div class="document__view">
                                <div v-if="type!=='win' && item.viewUrl" class="document__frame__wrapper">
                                    <el-carousel
                                        height="700px"
                                        class="document__frame"
                                        indicator-position="none"
                                        :autoplay="false"
                                        :loop="false"
                                        arrow="always"
                                        @change="handleCarouselChange"
                                    >
                                        <el-carousel-item
                                            v-for="(itm, i) in item.imageList"
                                            :key="i"
                                            class="document__image__wrapper"
                                        >
                                            <veln-image class="document__image" :src="itm"/>
                                        </el-carousel-item>
                                    </el-carousel>
                                    <div
                                        class="carousel__indicator"
                                    >{{ currentIndex + 1 }}/{{ item.imageList.length }}
                                    </div>
                                </div>
                                <div v-else-if="type==='win' && item.viewUrl" class="document__frame__wrapper">
                                    <iframe class="document__frame" :src="item.viewUrl + '&corpCode=' + corpCode" frameborder="0"/>
                                </div>
                                <div v-else class="document__frame__empty">{{ $t('课程转换中，请稍等...') }}</div>
                                <div class="download" @click="download(item, item.fileId)">
                                    <svg-icon icon-class="download" class-name="search__icon"/>
                                    {{ $t('下载') }}
                                </div>
                            </div>
                            <!--<div class="score__work__item" v-if="item.qgFileDetail.mediaType === 'DOCUMENT'"></div>-->
                        </el-form-item>
                    </el-col>
                </el-row>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {mapGetters} from 'vuex';
    // import { getFileInfo } from '@/api/file/file';
    import {FILE_ALL_TYPE_ENUM} from '@/enum';
    import {calFileSize} from '@/utils/index';
    import {transformSecondToMS} from '@/utils/time';
    import {dateFormat} from '@/utils';

    export default {
        name: 'FileDetail',
        components: {
            VelnFormSection
        },
        data() {
            return {
                transformSecondToMS,
                dateFormat,
                fileId: this.$route.query.id,
                type: this.$route.query.convertType,
                fileTypeEnum: FILE_ALL_TYPE_ENUM,
                calFileSize: calFileSize,
                list: [],
                currentPlay: '',
                currentSrc: '',
                currentIndex: 0
            };
        },
        computed: {
            ...mapGetters(['token', 'corpCode'])
        },
        created() {
            this.getFileInfo();
        },
        methods: {
            formatFileImages(file) {
                const {viewUrl, qgFileDetail} = file;
                const {length} = qgFileDetail;
                const preUrlArr = viewUrl.split('.');
                preUrlArr.pop();
                const preUrl = preUrlArr.join('.');
                const imageList = [];

                for (let i = 0; i < length; i++) {
                    imageList.push(`${preUrl}/${i}.jpg`);
                }

                file.imageList = imageList;
                console.log(file);
                return [file];
            },
            getFileInfo() {
                const query = this.$route.query;
                const {length, fileId, viewUrl} = query;
                const file = {
                    fileId,
                    viewUrl,
                    qgFileDetail: {
                        length
                    }
                };
                this.list = this.formatFileImages(file);
            },
            pause() {
                this.$refs.audio[0].pause();
                this.currentPlay = '';
            },
            // 音频播放
            play(item, fileId) {
                this.currentPlay = fileId;
                this.currentSrc = item.viewUrl;
                console.log(this.currentSrc);
            },
            // 下载
            download(data) {
                let url = data.viewUrl;
                console.log(`url: ${url}`);
                if (url.endsWith('.pdf')) {
                    window.open(url);
                    return;
                }
                const arr = url.split('.');
                arr.pop();
                const routes = arr[arr.length - 1].split('/');
                const fileId = routes[routes.length - 1];
                arr[arr.length - 1] = `${arr[arr.length - 1]}/${fileId}`;
                arr.push('pdf');
                url = arr.join('.');
                console.log(`split url: ${url}`);
                window.open(url);
            },
            handleCarouselChange(index) {
                this.currentIndex = index;
            }
        }
    };
</script>
