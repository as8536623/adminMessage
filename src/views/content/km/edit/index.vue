<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container km__edit">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <el-form-item :label="$t('编号') + '：'" prop="code">
                    <el-input v-model.trim="editQuery.code" :placeholder="$t('编号')" :max-length="50"/>
                </el-form-item>
                <el-form-item :label="$t('类别') + '：'" prop="categoryId">
                    <el-input
                        ref="categoryInput"
                        v-model.trim="editQuery.categoryName"
                        :placeholder="$t('请选择类别')"
                        :max-length="32"
                        clearable
                        @clear="clearCategory"
                        @focus="showCategorySelect"
                    />
                </el-form-item>
                <el-form-item :label="$t('资料名称') + '：'" prop="name">
                    <el-input
                        v-model.trim="editQuery.name"
                        class="input--long input__limit"
                        type="text"
                        :placeholder="$t('资料名称')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <veln-label-select
                    ref="labels"
                    label-type="KNOWLEDGE"
                    :default-labels="editQuery.tagList"
                    :validator-flag="false"
                    :label-width="140"
                    :label-name="$t('资料标签')"
                />
                <el-form-item :label="$t('作者') + '：'" prop="author">
                    <el-input
                        v-model.trim="editQuery.author"
                        type="text"
                        :placeholder="$t('作者名称')"
                        maxlength="20"
                    />
                </el-form-item>
                <el-form-item :label="$t('出版日期') + '：'" prop="publishAt">
                    <el-date-picker
                        v-model="editQuery.publishAt"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :placeholder="$t('选择出版日期')"
                    />
                </el-form-item>
                <el-form-item :label="$t('课程封面') + '：'" class="course__upload__line">
                    <div class="course__upload__sec" @click="showCoverSelect">
                        <img
                            v-if="editQuery.coverId"
                            class="course__cover"
                            :src="editQuery.coverId"
                            :alt="$t('封面')"
                        >
                        <svg-icon
                            v-if="!editQuery.coverId"
                            icon-class="plus"
                            class-name="course__upload__plus"
                        />
                    </div>
                    <span class="course__upload__tips">{{ $t('图片大小不能超过5M，建议尺寸640*370px') }}</span>
                </el-form-item>
                <el-form-item :label="$t('资料') + '：'">
                    <veln-upload-item
                        :section="selectedFile"
                        @select="showFileSelect"
                        @delete="delFile"
                    />
                    <div v-if="type === 'image' && selectedFiles.length" class="km__image__list">
                        <div v-for="(item, index) in selectedFiles" :key="index" class="km__image__item">
                            <veln-image class="km__image" :src="item.viewUrl"/>
                            <div class="km__image__shadow">
                                <svg-icon
                                    icon-class="delete"
                                    class-name="km__image__delete"
                                    @click="deleteImage(index)"
                                />
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item :label="$t('详情描述') + '：'" prop="introduction">
                    <el-input
                        v-model.trim="editQuery.introduction"
                        type="textarea"
                        :placeholder="$t('资料名称')"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        maxlength="500"
                    />
                </el-form-item>
                <el-form-item :label="$t('下载') + '：'">
                    <el-radio v-model="editQuery.allowDownload" :label="true">{{ $t('允许下载') }}</el-radio>
                    <el-radio v-model="editQuery.allowDownload" :label="false">{{ $t('不允许下载') }}</el-radio>
                </el-form-item>
                <el-form-item :label="$t('分享') + '：'">
                    <el-radio v-model="editQuery.allowShare" :label="true">{{ $t('允许分享') }}</el-radio>
                    <el-radio v-model="editQuery.allowShare" :label="false">{{ $t('不允许分享') }}</el-radio>
                </el-form-item>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button
                    v-if="(type === 'image' && selectedFiles.length) || (type !== 'image' && type !== 'video' && editQuery.viewUrl)"
                    @click="sure('RECORD')"
                >{{ $t('去录音') }}
                </el-button>
                <el-button @click="sure('')">{{ $t('保存') }}</el-button>
                <el-button type="primary" @click="sure('ENABLED')">{{ $t('发布') }}</el-button>
            </section>
        </el-form>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择资料类别')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-km-category-select ref="category" :default-expand-all="defaultExpandAll"/>
            <div class="dialog__btn__line">
                <el-button @click="categoryDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="categorySelect">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="fileDialogVisible"
            :key="fileDialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="fileDialogVisible"
            width="890px"
            :before-close="handleFileClose"
            @close="fileDialogClose"
        >
            <veln-file-select
                app-code="veln-km"
                :fun-code="funCode"
                :multi-select="multiSelect"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
        <el-dialog
            v-if="qrCodeVisible"
            append-to-body
            :title="$t('录音二维码')"
            :modal-append-to-body="false"
            :visible.sync="qrCodeVisible"
            width="410px"
            :before-close="handleQrClose"
            custom-class="qrCode__dialog"
        >
            <section class="qrcode__sec">
                <div class="tape__qrcode__wrappe">
                    <div id="tapeQrCode" class="tape__qrcode"/>
                    <div class="tape__qrcode__text">{{ $t('录音') }}</div>
                </div>
                <div class="tape__qrcode__wrappe">
                    <div id="previewQrCode" class="tape__qrcode--preview"/>
                    <div class="tape__qrcode__text">{{ $t('预览') }}</div>
                </div>
            </section>
        </el-dialog>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';
    import VelnUploadItem from '@/components/VelnUploadItem';
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnKmCategorySelect from '@/components/VelnKmCategorySelect';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import VelnLabelSelect from '@/components/VelnLabelSelect';
    import {getCode, getKnowledge, knowledgeInsert, knowledgeUpdate} from '@/api/km/knowledge';
    import checkPermission from '@/utils/permission';
    import QRCode from 'qrcodejs2';
    import moment from 'moment';
    import Clipboard from 'clipboard';
    import {getToPagePreUrl} from '@/utils/config';
    import {getPre} from '@/utils/dev';

    export default {
        name: 'CourseEdit',
        components: {
            VelnFileSelect,
            VelnFormSection,
            VelnKmCategorySelect,
            VelnLabelSelect,
            VelnUploadItem
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    text: this.$t('讲师姓名')
                },
                {
                    field: 'level',
                    minWidth: 100,
                    text: this.$t('讲师等级')
                },
                {
                    field: 'source',
                    minWidth: 100,
                    text: this.$t('讲师来源'),
                    render: (h, param) => {
                        return param.row.source === 'OUTER' ? '外部' : '内部';
                    }
                }
            ];
            return {
                tableColumns,
                editQuery: {
                    id: this.$route.query.id,
                    fromDevice: 'PC',
                    code: '', // 编号
                    name: '', // 名称
                    categoryId: '', // 类别ID
                    categoryName: '', // 类别名称
                    tagList: [], // 标签
                    author: '', // 作者
                    type: '',
                    knowledgeItemList: [],
                    srcId: '',
                    srcSize: '',
                    srcName: '',
                    srcType: '',
                    introduction: '', // 详情描述
                    publishAt: moment().format('YYYY-MM-DD'), // 出版日期
                    allowShare: false,
                    allowDownload: false,
                    viewUrl: ''
                },
                rules: {
                    code: [
                        {
                            required: true,
                            message: this.$t('请输入课程编号'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入课程名称'),
                            trigger: 'blur'
                        }
                    ],
                    categoryId: [
                        {
                            required: true,
                            message: this.$t('请选择课程类别'),
                            trigger: 'blur'
                        }
                    ]
                },
                type: '',
                categoryDialogVisible: false,
                defaultExpandAll: true,
                uploadURL: `${process.env.FS_API}/file/upload`,
                selectedFile: {
                    srcId: '',
                    pageNum: '',
                    knowledgeId: '',
                    srcType: '',
                    srcName: '',
                    srcSize: ''
                },
                selectedFiles: [],
                editorWidth: '750px',
                fileDialogVisible: false,
                fileDialogKey: null,
                teacherDialogVisible: false,
                teacherlist: [],
                teacherSelect: [],
                teacherQuery: {
                    name: '',
                    source: '',
                    pageNum: 1,
                    pageSize: 20
                },
                teacherTotal: 0,
                teacherListLoading: false,
                teacherMultiSelection: [],
                typeArr: ['VIDEO', 'IMAGE', 'DOC'],
                qrCodeVisible: false,
                qrcode: '',
                downloadQrcodeUrl: '',
                multiSelect: false,
                optType: '',
                funCode: 'KM_COVER'
            };
        },
        computed: {
            ...mapGetters(['name', 'appCode', 'corpCode', 'token'])
        },
        created() {
            if (this.editQuery.id) {
                this.getKnowledge();
            } else {
                this.getCode();
            }
        },
        methods: {
            checkPermission,
            // 新增获取code
            getCode() {
                getCode().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery.code = result.data;
                    }
                });
            },
            // 编辑资料时获取资料
            formatKnowledgeList(list) {
                this.type = list[0].srcType;
                if (list[0] && list[0].srcType !== 'image') {
                    const {
                        id,
                        srcId,
                        srcType,
                        srcName,
                        srcSize,
                        pageNum
                    } = list[0];
                    this.selectedFile = {
                        id,
                        srcId,
                        srcType,
                        srcName,
                        knowledgeId: this.editQuery.id,
                        pageNum,
                        srcSize
                    };
                } else {
                    const result = [];
                    list.map((item, index) => {
                        const {
                            id,
                            srcId,
                            srcType,
                            srcName,
                            srcSize,
                            qgFile,
                            knowledgeId
                        } = item;
                        result.push({
                            id,
                            srcId,
                            srcType,
                            pageNum: index + 1,
                            srcName,
                            srcSize,
                            knowledgeId,
                            viewUrl: qgFile.viewUrl
                        });
                    });
                    this.selectedFiles = result;
                }
            },
            // 获取资料信息
            getKnowledge() {
                getKnowledge({id: this.editQuery.id}).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const _data = result.data;
                        const {knowledgeItemList} = _data;
                        _data.tagList = _data.tagList || [];
                        this.editQuery = _data;
                        this.formatKnowledgeList(knowledgeItemList);
                    }
                });
            },
            // 选择资料类别
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                if (!result.manage) {
                    this.$warnMsg(this.$t('无权限，请联系系统管理员'));
                    return;
                }
                this.editQuery.categoryId = result.id;
                this.editQuery.categoryName = result.name;
                this.categoryDialogVisible = false;
                this.$refs.editQuery.validateField('categoryId');
            },
            // 显示选择资料类别选择框
            showCategorySelect() {
                this.categoryDialogVisible = true;
                this.$refs.categoryInput.blur();
            },
            // 上传封面成功
            uploadSuccess(response, file, fileList) {
                const result = response;
                if (result.success) {
                    this.editQuery.coverId = result.data.fileId;
                }
            },
            // 返回
            cancel() {
                history.go(-1);
            },
            // 格式化文件，方便保存时当做参数塞入
            formatFileList() {
                let list = [];
                if (this.type === 'image') {
                    list = this.selectedFiles;
                    list.map((item, index) => {
                        item.pageNum = index + 1;
                    });
                } else {
                    list = [this.selectedFile];
                }
                return list;
            },
            formatType() {
                const knowledgeItem = this.editQuery.knowledgeItemList[0];
                let type = '';
                const srcType = knowledgeItem.srcType;
                switch (srcType) {
                    case 'image':
                    case 'video':
                        type = srcType;
                        break;
                    default:
                        type = 'DOC';
                        break;
                }
                return type;
            },
            // 保存
            sure(status) {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    // 处理标签信息
                    this.editQuery.tagList = this.$refs.labels.listQuery.labels;
                    // 处理文件信息
                    this.editQuery.knowledgeItemList = this.formatFileList();
                    // 确认资料类型
                    this.editQuery.type = this.formatType();
                    // 发布情况
                    if (status === 'ENABLED') {
                        this.editQuery.status = status;
                    } else {
                        this.editQuery.status = '';
                    }
                    if (this.$store.getters.ajaxIng) {
                        return;
                    }
                    this.$store.dispatch('setAjaxIng', true);
                    if (!this.editQuery.id) {
                        knowledgeInsert(this.editQuery).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success && status === 'RECORD') {
                                this.editQuery.id = result.data;
                                this.preQrCode();
                            } else if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.$router.push({
                                    name: `kmList`
                                });
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                        return;
                    }
                    this.editQuery.admin = true;
                    knowledgeUpdate(this.editQuery).then(re => {
                        this.$store.dispatch('setAjaxIng', false);
                        const result = re.data;
                        if (result.success && status === 'RECORD') {
                            this.preQrCode();
                        } else if (result.success) {
                            this.$successMsg(this.$t('保存成功'));
                            this.$router.push({
                                name: `kmList`
                            });
                        } else {
                            this.$errorMsg(result.msg || this.$t('保存失败'));
                        }
                    });
                });
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            // 如果已有文件，只能选择某种类型的文件，如果没有选择文件，可以选择任意文件
            showFileSelect() {
                switch (this.type) {
                    case 'image':
                        this.typeArr = ['IMAGE'];
                        this.multiSelect = true;
                        break;
                    case 'video':
                        this.typeArr = ['VIDEO'];
                        this.multiSelect = false;
                        break;
                    case 'documents':
                        this.typeArr = ['DOC'];
                        this.multiSelect = false;
                        break;
                    default:
                        this.typeArr = ['VIDEO', 'IMAGE', 'DOC'];
                        this.multiSelect = false;
                        break;
                }
                this.funCode = 'KM_KNOWLEDGE';
                this.fileDialogVisible = true;
            },
            showCoverSelect() {
                this.typeArr = ['IMAGE'];
                this.multiSelect = false;
                this.optType = 'cover';
                this.fileDialogVisible = true;
                this.funCode = 'KM_COVER';
            },
            // 选择图片时，需要处理到文件列表中
            selectImages(files) {
                const list = [];
                files.map((item, index) => {
                    const {fileId, name, viewUrl, qgFileDetail} = item;
                    list.push({
                        srcId: fileId,
                        srcType: qgFileDetail.mediaType,
                        srcName: name,
                        srcSize: qgFileDetail.fileSize,
                        knowledgeId: this.editQuery.id || '',
                        viewUrl
                    });
                });
                this.selectedFiles = this.selectedFiles.concat(list);
            },
            // 选择其他文件单独处理
            selectFile(files) {
                const fileId = files[0].fileId;

                this.editQuery.srcId = fileId;
                this.editQuery.srcType = files[0].mt;
                this.type = files[0].qgFileDetail.mediaType;
                this.editQuery.srcName = files[0].name;
                this.editQuery.srcSize = files[0].qgFileDetail.length;

                this.selectedFile = {
                    srcId: fileId,
                    pageNum: 1,
                    knowledgeId: this.editQuery.id,
                    srcType: files[0].mt,
                    srcName: files[0].name,
                    srcSize: files[0].qgFileDetail.length
                };
            },
            selectCover(file) {
                this.editQuery.coverId = file.viewUrl;
                this.optType = '';
                this.fileDialogVisible = false;
            },
            onSure(files) {
                // 选择封面
                if (this.optType === 'cover') {
                    this.selectCover(files[0]);
                    return;
                }
                // 选择资料
                this.type = files[0].qgFileDetail.mediaType;
                if (
                    this.type !== 'image' &&
                    files[0].qgFileDetail.mediaType !== 'image'
                ) {
                    this.selectFile(files);
                } else {
                    this.selectImages(files);
                }
                this.fileDialogVisible = false;
            },
            // 删除文件
            delFile() {
                this.selectedFile = {
                    srcId: '',
                    srcType: '',
                    srcName: '',
                    srcSize: ''
                };
                this.editQuery.srcId = '';
                this.editQuery.srcType = this.type = '';
                this.editQuery.srcName = '';
                this.editQuery.srcSize = '';
            },
            // 删除图片
            deleteImage(index) {
                this.selectedFiles.splice(index, 1);
                if (!this.selectedFiles.length) {
                    this.type = '';
                }
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            fileDialogClose() {
                this.fileDialogKey = +new Date();
            },
            clearCategory() {
                this.editQuery.categoryId = '';
                this.$refs.editQuery.validateField('categoryId');
            },
            categoryDlgClose() {
                this.$refs.editQuery.validateField('categoryId');
            },
            preQrCode() {
                if (this.type === 'image') {
                    this.qrCode(this.editQuery.id);
                } else {
                    this.qrCode(this.selectedFile.id);
                }
            },
            qrCode(id) {
                this.qrCodeVisible = true;
                const paramsT = {
                    url: ''
                };
                const paramsP = {
                    url: ''
                };
                if (this.type === 'image') {
                    const tUrl = encodeURIComponent(
                        `#/km/make/picture?id=${id}&from=pc`
                    );
                    const pUrl = encodeURIComponent(
                        `#/km/view/picture?id=${id}&from=pc`
                    );
                    paramsT.url = `${getToPagePreUrl()}?corpCode=${this.corpCode}&businessUrl=${tUrl}`;
                    paramsP.url = `${getToPagePreUrl()}?corpCode=${this.corpCode}&businessUrl=${pUrl}`;
                } else {
                    paramsT.url = `${getPre()}/api/veln-convert/convert/record?id=${id}&_token=${this.token}`;
                    paramsP.url = `${getPre()}/api/veln-convert/convert/view?id=${id}&_token=${this.token}`;
                }
                setTimeout(() => {
                    new QRCode('tapeQrCode', {
                        text: paramsT.url || '',
                        width: 140,
                        height: 140,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    });
                    new QRCode('previewQrCode', {
                        text: paramsP.url || '',
                        width: 140,
                        height: 140,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }, 300);
            },
            handleQrClose() {
                this.qrCodeVisible = false;
            },
            copyQrCode() {
                var clipboard = new Clipboard('.copy__btn');
                clipboard.on('success', e => {
                    this.$message({
                        type: 'success',
                        message: '复制成功!'
                    });
                    // 释放内存
                    clipboard.destroy();
                });
                clipboard.on('error', e => {
                    // 不支持复制
                    console.log('该浏览器不支持自动复制');
                    // 释放内存
                    clipboard.destroy();
                });
            }
        }
    };
</script>
