<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="veln__file__select" :class="{'outer': outer}">
        <div class="upload__progress">
            <div class="upload__progress__inner" :style="{width: progress + '%'}"/>
        </div>
        <vfs-uploader
            v-if="currentTabNodeName !== 'PUBLIC_IMAGE'"
            ref="upload"
            :type="type"
            :app-code="appCode"
            :fun-code="funCode"
            @before-upload="beforeUpload"
            @finish="finish"
            @progress="uploadProgress"
            @success="uploadSuccess"
            @error="uploadError"
        />
        <el-tabs v-model="type" @tab-click="handleTabClick">
            <el-tab-pane v-if="types.includes('VIDEO')" :label="$t('视频')" name="VIDEO">
                <vfs-video
                    ref="VIDEO"
                    :type="type"
                    :multi-select="multiSelect"
                    :category="activeCategory"
                    :app-code="appCode"
                    :fun-code="funCode"
                    @select="select"
                    @show-category="showCategory"
                    @upload-cancel="uploadCancel"
                />
            </el-tab-pane>
            <el-tab-pane v-if="types.includes('AUDIO')" :label="$t('音频')" name="AUDIO">
                <vfs-audio
                    ref="AUDIO"
                    :type="type"
                    :multi-select="multiSelect"
                    :category="activeCategory"
                    :app-code="appCode"
                    :fun-code="funCode"
                    @select="select"
                    @show-category="showCategory"
                    @upload-cancel="uploadCancel"
                />
            </el-tab-pane>
            <el-tab-pane v-if="types.includes('IMAGE')" :label="$t('图片')" name="IMAGE">
                <vfs-image
                    ref="IMAGE"
                    :type="type"
                    :multi-select="multiSelect"
                    :category="activeCategory"
                    :app-code="appCode"
                    :fun-code="funCode"
                    @select="select"
                    @show-category="showCategory"
                    @upload-cancel="uploadCancel"
                />
            </el-tab-pane>
            <el-tab-pane v-if="types.includes('PUBLIC_IMAGE')" :label="$t('通用图片')" name="PUBLIC_IMAGE">
                <vfs-image
                    ref="PUBLIC_IMAGE"
                    type="PUBLIC_IMAGE"
                    :multi-select="multiSelect"
                    :category="activeCategory"
                    :app-code="appCode"
                    :fun-code="funCode"
                    @select="select"
                    @show-category="showCategory"
                    @upload-cancel="uploadCancel"
                />
            </el-tab-pane>
            <el-tab-pane v-if="types.includes('DOC')" :label="$t('文档')" name="DOC">
                <vfs-document
                    ref="DOC"
                    :type="type"
                    :multi-select="multiSelect"
                    :category="activeCategory"
                    :app-code="appCode"
                    :fun-code="funCode"
                    @select="select"
                    @show-category="showCategory"
                    @upload-cancel="uploadCancel"
                />
            </el-tab-pane>
        </el-tabs>
        <footer class="vfs__footer">
            <el-button @click="onCancel">{{ $t('取消') }}</el-button>
            <el-button type="primary" @click="onSure">{{ $t('确定') }}</el-button>
        </footer>
        <el-dialog append-to-body :title="$t('选择文件类别')" :visible.sync="dialogVisible" width="339px">
            <section class="file__category__select">
                <qgu-tree
                    ref="tree"
                    type="dialog"
                    :show-include-child="false"
                    :datalist="treeData"
                    :default-expanded-keys="defaultExpandedKeys"
                    @node-click="nodeClick"
                />
            </section>
            <div class="dialog__btn__line">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="selectCategory">保存</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    const fileType = {
        '.mp3': 'audio',
        '.mp4': 'video',
        '.avi': 'video',
        '.ppt': 'ppt',
        '.pptx': 'ppt',
        '.doc': 'word',
        '.docx': 'word',
        '.xls': 'excel',
        '.xlsx': 'excel',
        '.pdf': 'pdf',
        '.png': 'image',
        '.jpeg': 'image',
        '.rmvb': 'video',
        '.mov': 'video',
        '.mkv': 'video',
        '.flv': 'video',
        '.wmv': 'video'
    };
    import {getFileCommonTree, fileRel} from './api/fs';

    import moment from 'moment';
    import QguTree from '@/components/QguTree';
    import VfsVideo from './components/VfsVideo';
    import VfsImage from './components/VfsImage';
    import VfsAudio from './components/VfsAudio';
    import VfsDocument from './components/VfsDocument';
    import VfsUploader from './components/VfsUploader';
    export default {
        name: 'VelnFileSelect',
        components: {
            QguTree,
            VfsVideo,
            VfsImage,
            VfsAudio,
            VfsDocument,
            VfsUploader
        },
        props: {
            typeArr: {
                type: Array,
                default: () => {
                    return ['VIDEO', 'AUDIO', 'IMAGE', 'DOC'];
                }
            },
            multiSelect: {
                type: Boolean,
                default: true
            },
            appCode: {
                type: String,
                default: ''
            },
            funCode: {
                type: String,
                default: ''
            },
            outer: {
                type: Boolean,
                default: false
            },
            extensions: {
                type: String,
                default: ''
            },
            mimeTypes: {
                type: String,
                default: ''
            }
        },
        // 父组件中返回要传给下级的数据
        provide() {
            return {
                extensions: this.extensions,
                mimeTypes: this.mimeTypes
            };
        },
        data() {
            return {
                types: this.typeArr,
                type: 'VIDEO',
                treeData: [],
                dialogVisible: false,
                defaultExpandedKeys: [],
                category: {
                    id: '',
                    name: ''
                },
                activeCategory: {
                    id: '',
                    name: ''
                },
                selectList: [],
                progress: 0,
                currentTabNodeName: ''
            };
        },
        watch: {
            typeArr: {
                handler(val) {
                    const filter = Array.isArray(val) ? val.filter(item => !!item) : [];
                    if (Array.isArray(val) && val.some(v => v === 'IMAGE')) {
                        val.push('PUBLIC_IMAGE')
                    }
                    if (filter.length) {
                        this.typeArr = val;
                        this.currentTabNodeName = val[0];
                        this.type = val[0] || 'VIDEO';
                    }
                },
                immediate: true,
                deep: true
            }
        },
        created() {
            this.getFileCommonTree();
        },
        methods: {
            getFileCommonTree() {
                getFileCommonTree().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.defaultExpandedKeys = [result.data.id];
                    }
                });
            },
            nodeClick(data) {
                this.category = {
                    id: data.id,
                    name: data.name
                };
            },
            selectCategory() {
                this.activeCategory = {
                    id: this.category.id,
                    name: this.category.name
                };
                this.dialogVisible = false;
            },
            showCategory() {
                this.dialogVisible = true;
            },
            beforeUpload(file, ret) {
                if (ret) {
                    file.src = ret;
                }
                this.$refs[this.type].fileQuened(file);
            },
            updatePage() {
                this.$refs[this.type].getList({pageNum: 1});
            },
            clearSelect() {
                this.selectList = [];
                this.$refs[this.type].active = [];
            },
            uploadSuccess(response, file) {
                const {fileId, viewUrl} = response.data;
                file.fileId = fileId;
                file.viewUrl = viewUrl;
                file.createdAt = moment().format('YYYY / MM / DD');
                this.$refs[this.type].uploadSuccess(file);
            // this.updatePage();
            },
            finish() {
                this.progress = 0;
                this.$refs[this.type].clearUploadingList();
                this.updatePage();
            },
            uploadError(response, file) {
                this.$toast(`${file.name}${this.$t('上传失败')}`);
                this.progress = 0;
            },
            handleTabClick(ev) {
                const {name} = ev;
                console.log(name);
                this.currentTabNodeName = name;
                this.activeCategory = {
                    id: '',
                    name: ''
                };
            },
            select(v) {
                this.selectList = v;
            },
            fileRel(files) {
                if (!(Array.isArray(files) && files.length)) {
                    return;
                }
                const ids = [];
                files.map(file => {
                    ids.push(file.fileId);
                });
                const data = {
                    fileIds: ids,
                    appCode: this.appCode,
                    funCode: this.funCode,
                    quotedName: localStorage.getItem('velnUserName')
                };
                fileRel(data).then(re => {
                    const result = re.data;
                    if (result.success) {
                        console.log('file rel success');
                    } else {
                        console.error('file rel error');
                    }
                });
            },
            formatFileList(list) {
                list.map(item => {
                    const fileExt = item.qgFileDetail.fileExt;
                    if (fileType.hasOwnProperty(fileExt)) {
                        item.mt = fileType[fileExt];
                    } else {
                        item.mt = 'unknown';
                    }
                });
                return list;
            },
            onCancel() {
                this.$emit('on-cancel');
            },
            onSure() {
                if (!(Array.isArray(this.selectList) && this.selectList.length)) {
                    this.$infoMsg(this.$t('请选择文件'));
                    return;
                }
                this.fileRel(this.selectList);
                this.$emit('on-sure', this.formatFileList(this.selectList));
            },
            uploadProgress(percent, file) {
                this.progress = Math.ceil(percent * 100);
                file.progress = percent;
                this.$refs[this.type].fileUploading(file);
            },
            getSelected() {
                this.fileRel(this.selectList);
                return this.formatFileList(this.selectList);
            },
            uploadCancel(file) {
                this.$refs.upload.uploadCancel(file);
            }
        }
    };
</script>
