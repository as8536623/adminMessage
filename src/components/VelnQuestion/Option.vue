<style lang="scss" scoped>
    @import './style';

    .upload-img {
        display: inline-block;
        vertical-align: middle;
    }
</style>
<template>
    <article class="exam__block">
        <div class="exam__option__select exam__code">
            <el-select v-model="optionType" @change="optionChange">
                <el-option
                    v-for="(item, idx) in optionTypes"
                    :key="idx"
                    :value="item.code"
                    :label="item.name"
                />
            </el-select>
        </div>
        <!--选项-->
        <div v-for="(item, idx) in ios" :key="idx" class="exam__item flex__row">
            <div>
                <div class="exam__nav">
                    <div class="exam__title">{{ $t('选项')+ getEnglishLetter(idx) }}</div>
                    <div class="pull-right exam__code exam__tooltip">
                        <el-tooltip
                            v-if="optionType === 'IMAGE'"
                            class="item"
                            effect="dark"
                            :content="$t('上传图片')"
                            placement="top"
                        >
                            <el-button
                                class="add"
                                type="text"
                                size="mini"
                                @click="upload('IMAGE', idx)"
                            >
                                <svg-icon class-name="tree__icon" icon-class="pic_e"/>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                            v-if="optionType === 'VIDEO'"
                            class="item"
                            effect="dark"
                            :content="$t('上传视频')"
                            placement="top"
                        >
                            <el-button
                                class="add"
                                type="text"
                                size="mini"
                                @click="upload('VIDEO', idx)"
                            >
                                <svg-icon class-name="tree__icon" icon-class="play_e"/>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                            v-if="optionType === 'AUDIO'"
                            class="item"
                            effect="dark"
                            :content="$t('上传音频')"
                            placement="top"
                        >
                            <el-button
                                class="add"
                                type="text"
                                size="mini"
                                @click="upload('AUDIO', idx)"
                            >
                                <svg-icon class-name="tree__icon" icon-class="voice_e"/>
                            </el-button>
                        </el-tooltip>
                    </div>
                </div>
                <!--文本框-->
                <el-input v-if="optionType==='TEXT'" v-model="item.ct.ct" type="textarea" rows="6"/>
                <div v-else class="file__list">
                    <!--图片-->
                    <div class="file__item km__image__list">
                        <div
                            v-for="(cItem, cIndex) in item.ct.imageList"
                            :key="cIndex"
                            class="km__image__item"
                        >
                            <veln-image class="km__image" :src="cItem.viewUrl"/>
                            <div class="km__image__shadow">
                                <svg-icon
                                    icon-class="delete"
                                    class-name="km__image__delete"
                                    @click="deleteImage(idx, cIndex)"
                                />
                            </div>
                        </div>
                    </div>
                    <!--视频-->
                    <div v-for="(cItem, cIndex) in item.ct.videoList" :key="cIndex">
                        <file-item
                            :section="cItem"
                            :index="cIndex"
                            :p-index="idx"
                            @delete="delFile"
                        />
                    </div>
                    <!--音频-->
                    <div v-for="(cItem, cIndex) in item.ct.audioList" :key="cIndex">
                        <file-item
                            :section="cItem"
                            :index="cIndex"
                            :p-index="idx"
                            @delete="delFile"
                        />
                    </div>
                </div>
            </div>
            <div class="exam__select">
                <el-radio
                    v-if="single"
                    v-model="item.t"
                    :label="true"
                    @change="selectHandle(idx)"
                >{{ $t('设置为正确答案') }}
                </el-radio>
                <el-checkbox v-if="!single" v-model="item.t" :label="true">{{ $t('设置为正确答案') }}</el-checkbox>
                <div>
                    <el-tooltip
                        v-if="ios.length > 1
                            && idx !== 0"
                        class="item"
                        effect="dark"
                        :content="$t('上移')"
                        placement="bottom"
                    >
                        <el-button type="text" size="mini" @click="move(idx, 'up')">
                            <svg-icon class-name="tree__icon" icon-class="up_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip
                        v-if="ios.length > 1 &&
                            idx !== ios.length - 1"
                        class="item"
                        effect="dark"
                        :content="$t('下移')"
                        placement="bottom"
                    >
                        <el-button type="text" size="mini" @click="move(idx, 'down')">
                            <svg-icon class-name="tree__icon" icon-class="down_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('删除')" placement="bottom">
                        <el-button
                            v-if="ios.length > 2"
                            type="text"
                            size="mini"
                            @click="del(idx)"
                        >
                            <svg-icon class-name="tree__icon" icon-class="del"/>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div class="exam__add__btn">
            <el-button type="primary" @click="addOption">{{ $t('添加选项') }}</el-button>
        </div>
        <el-dialog
            v-if="fileDialogVisible"
            :key="dialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="fileDialogVisible"
            width="890px"
            :before-close="handleFileClose"
        >
            <veln-file-select
                :app-code="$appCodes.pe + '/pe'"
                fun-code="ITEM"
                :multi-select="multiSelect"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnFileSelect from '@/components/VelnFileSelect';
    import {deepClone, getEnglishLetter} from '@/utils';
    import FileItem from './components/FileItem';

    export default {
        name: 'Content',
        components: {
            VelnFileSelect,
            FileItem
        },
        props: {
            ios: {
                type: Array,
                default() {
                    return [];
                }
            },
            title: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            // 判断单选题--多选题/不定项
            single: {
                type: Boolean,
                default: true
            }
        },
        data() {
            const ct = {
                ct: '',
                code: '',
                codeType: 'javascript',
                imageList: [],
                audioList: [],
                videoList: []
            };
            return {
                ct,
                fileDialogVisible: false,
                typeArr: ['IMAGE'],
                dialogKey: null,
                optionType: 'TEXT',
                optionTypes: [
                    {code: 'TEXT', name: this.$t('文本')},
                    {code: 'IMAGE', name: this.$t('图片')},
                    {code: 'VIDEO', name: this.$t('视频')},
                    {code: 'AUDIO', name: this.$t('音频')}
                ],
                fileType: '',
                index: 0,
                oldType: 'TEXT',
                multiSelect: false // 图片支持多选
            };
        },
        watch: {
            ios: {
                handler(val) {
                    if (val) {
                        this.optionType = val[0].tp;
                        this.oldType = this.optionType;
                    }
                }
            }
        },
        methods: {
            getEnglishLetter,
            // 上传
            upload(type, index) {
                // if (type === 'IMAGE') {
                //     this.multiSelect = true;
                // } else {
                //     this.multiSelect = false;
                // }
                if (type === 'IMAGE' && this.ios[index].ct.imageList.length === 1) {
                    this.$warnMsg(this.$t('最多上传1张图片!'));
                    return;
                }
                if (type === 'AUDIO' && this.ios[index].ct.audioList.length === 1) {
                    this.$warnMsg(this.$t('最多上传1段音频!'));
                    return;
                }
                if (type === 'VIDEO' && this.ios[index].ct.videoList.length === 1) {
                    this.$warnMsg(this.$t('最多上传1段视频!'));
                    return;
                }
                this.fileDialogVisible = true;
                this.typeArr[0] = type;
                this.fileType = type;
                this.index = index;
            },
            // 选择文件确认
            onSure(files) {
                // if (this.fileType === 'IMAGE') {
                //     const list = files.splice(0, 9 - this.ios[this.index].ct.imageList.length);
                //     this.fileHandle(list);
                // } else {
                //     this.fileHandle(files);
                // }
                this.fileHandle(files);
                this.fileDialogVisible = false;
            },
            fileHandle(list) {
                list.map(file => {
                    const data = {
                        name: file.name,
                        viewUrl: file.viewUrl,
                        fileId: file.fileId,
                        size: file.size,
                        type: file.mt,
                        duration: file.duration,
                        coverUrl: file.coverUrl,
                        m3u8Url: file.m3u8Url
                    };
                    switch (this.fileType) {
                        case 'IMAGE':
                            this.ios[this.index].ct.imageList.push(data);
                            break;
                        case 'VIDEO':
                            this.ios[this.index].ct.videoList.push(data);
                            break;
                        case 'AUDIO':
                            this.ios[this.index].ct.audioList.push(data);
                            break;
                    }
                });
            },
            // 切换类型清空值
            optionChange() {
                if (this.iosNotEmpty()) {
                    this.$confirm(this.$t('此操作将清空已有数据, 是否继续?'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning'
                    })
                        .then(() => {
                            this.oldType = this.optionType;
                            this.ios.map(item => {
                                const ct = {
                                    ct: '',
                                    code: '',
                                    codeType: '',
                                    imageList: [],
                                    audioList: [],
                                    videoList: []
                                };
                                item.ct = ct;
                                item.tp = this.optionType;
                            });
                        })
                        .catch(() => {
                            this.optionType = this.oldType;
                        });
                } else {
                    this.oldType = this.optionType;
                    this.ios.map(item => {
                        const ct = {
                            ct: '',
                            code: '',
                            codeType: '',
                            imageList: [],
                            audioList: [],
                            videoList: []
                        };
                        item.ct = ct;
                        item.tp = this.optionType;
                    });
                }
            },
            iosNotEmpty() {
                for (let i = 0; i < this.ios.length; i++) {
                    if (
                        this.ios[i].ct.ct ||
                        this.ios[i].ct.imageList.length > 0 ||
                        this.ios[i].ct.audioList.length > 0 ||
                        this.ios[i].ct.videoList.length > 0
                    ) {
                        return true;
                    }
                }
                return false;
            },
            // 删除图片
            deleteImage(index, cIndex) {
                this.ios[index].ct.imageList.splice(cIndex, 1);
            },
            // 删除视频,音频
            delFile(index, type, pIndex) {
                type === 'video'
                    ? this.ios[pIndex].ct.videoList.splice(index, 1)
                    : this.ios[pIndex].ct.audioList.splice(index, 1);
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            // 上移，下移
            move(index, moveType) {
                moveType === 'up'
                    ? this.swapItems(index, index - 1)
                    : this.swapItems(index, index + 1);
            },
            // 交换值
            swapItems(index, index2) {
                const arr = this.ios;
                arr[index] = arr.splice(index2, 1, arr[index])[0];
            },
            del(index) {
                this.ios.splice(index, 1);
            },
            // 设置正确答案
            selectHandle(index) {
                this.ios.map((item, zindex) => {
                    if (index !== zindex) {
                        item.t = false;
                    }
                });
                this.$forceUpdate();
            },
            // 添加选项
            addOption() {
                const data = {
                    ct: deepClone(this.ct),
                    tp: 'TEXT'
                };
                data.ct.tp = this.optionType;
                this.ios.push(data);
            }
        }
    };
</script>
