<style lang="scss">
    @import '../courseItem/style.scss';
</style>

<template>
    <article class="course__item__block">
        <el-form
            ref="editQuery"
            :key="formKey"
            :model="editQuery"
            label-width="120px"
            :inline-message="true"
            :rules="rules"
            class="course__item__form"
            v-loading="loadingFlag"
        >
            <section class="course__item__sec top">
                <div class="course__type">
                    <el-form-item :label="$t('课程类型') + '：'" prop="standard">
                        <el-select
                            v-model="editQuery.standard"
                            placeholder="请选择"
                            disabled
                            @change="handleCheckChange"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('课程demo') + '：'">
                        <course-accessory
                            class="demo__course__accessory"
                            :course="editQuery.demo"
                            :can-modify-item="false"
                            @preview="previewFile(editQuery.demo)"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('总时长') + '：'">{{ editQuery.totalDuration }}</el-form-item>
                </div>
            </section>
            <section class="course__item__sec center">
                <div
                    v-for="(chapter, index) in editQuery.courseItemList"
                    :key="index"
                    class="course__chapter__wrapper"
                >
                    <div class="course__item__chapter">
                        <el-form-item
                            :label="$t('第'+ transferNumberToChinese((index + 1)) +'章') + '：'"
                            :prop="'courseItemList[' + index + '].name'"
                            :rules="rules.required"
                        >{{ editQuery.courseItemList[index].name }}
                        </el-form-item>
                    </div>
                    <div
                        v-for="(section, childIndex) in chapter.childCourseItemList"
                        :key="childIndex"
                        class="course__item__paragraph"
                    >
                        <section class="course__paragraph__title">
                            <el-form-item
                                :label="(index+1)+'.'+(childIndex+1)+ '：'"
                                :prop="'courseItemList[' + index + '].childCourseItemList[' + childIndex + '].name'"
                                :rules="rules.required"
                            >{{ chapter.childCourseItemList[childIndex].name }}
                            </el-form-item>
                        </section>
                        <el-form-item
                            class="upload__form__item"
                            :prop="'courseItemList[' + index + '].childCourseItemList[' + childIndex + '].srcId'"
                            :rules="[{ required: true, message: '请上传章节内容', trigger: 'blur' }]"
                        >
                            <course-accessory
                                :course="section"
                                :can-modify-item="false"
                                @preview="previewFile(section)"
                                @showQrcode="showQrcode(section)"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('讲师') + '：'" v-if="section.teacherNames">
                            <div v-html="section.teacherNames"></div>
                        </el-form-item>
                        <el-form-item :label="$t('详情描述') + '：'" v-if="section.description">
                            <div v-html="section.description"></div>
                        </el-form-item>
                    </div>
                </div>
            </section>
        </el-form>
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
                app-code="veln-stu"
                fun-code="STU_COURSE"
                :multi-select="false"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
        <el-dialog
            v-if="qrcodeDialogVisible"
            append-to-body
            :title="$t('录音二维码')"
            :visible.sync="qrcodeDialogVisible"
            width="410px"
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
        <el-dialog
            v-if="previewDialogVisible"
            append-to-body
            :title="$t('课程预览')"
            :visible.sync="previewDialogVisible"
            :width="previewType==='video' ? '640px' : '600px'"
        >
            <section class="preview__dlg__container" :data-url="previewUrl">
                <veln-video-player
                    v-if="previewType==='video'"
                    class="preview__video"
                    :list="[{src: previewUrl, definition: '超清', defCode: '720'}]"
                    :poster="previewPostre"
                    :referId="referId"
                />
                <audio
                    v-if="previewType==='audio'"
                    class="preview__audio"
                    :src="previewUrl"
                    controls
                />
<!--                <div class="copy__line">-->
<!--                    &lt;!&ndash;<el-input class="input-with-select" readonly v-model="previewUrl">&ndash;&gt;-->
<!--                    &lt;!&ndash;<span&ndash;&gt;-->
<!--                    &lt;!&ndash;slot="append"&ndash;&gt;-->
<!--                    &lt;!&ndash;class="copy__btn"&ndash;&gt;-->
<!--                    &lt;!&ndash;@click="copy"&ndash;&gt;-->
<!--                    &lt;!&ndash;:data-clipboard-text="previewUrl"&ndash;&gt;-->
<!--                    &lt;!&ndash;&gt;{{$t('复制')}}</span>&ndash;&gt;-->
<!--                    &lt;!&ndash;</el-input>&ndash;&gt;-->
<!--                    <el-button v-if="downloadUrl" class="pull-left" @click="download">{{ $t('下载') }}</el-button>-->
<!--                    <el-button-group v-if="editQuery.standard === 'VIDEO'">-->
<!--                        <el-button-->
<!--                            icon="el-icon-document-copy"-->
<!--                            class="copy__btn"-->
<!--                            type="primary"-->
<!--                            :data-clipboard-text="previewUrl"-->
<!--                            @click="copy"-->
<!--                        >复制视频地址-->
<!--                        </el-button>-->
<!--                        <el-button-->
<!--                            icon="el-icon-document-copy"-->
<!--                            class="copy__fluent__btn"-->
<!--                            type="primary"-->
<!--                            :data-clipboard-text="fluentUrl"-->
<!--                            @click="copyFluent"-->
<!--                        >复制流畅地址-->
<!--                        </el-button>-->
<!--                    </el-button-group>-->
<!--                    <el-button-group v-if="editQuery.standard === 'AUDIO'">-->
<!--                        <el-button-->
<!--                            icon="el-icon-document-copy"-->
<!--                            class="copy__btn"-->
<!--                            type="primary"-->
<!--                            :data-clipboard-text="previewUrl"-->
<!--                            @click="copy"-->
<!--                        >复制音频地址-->
<!--                        </el-button>-->
<!--                    </el-button-group>-->
<!--                </div>-->
            </section>
        </el-dialog>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import CourseAccessory from '../courseItem/components/courseAccessory';
    import VelnVideoPlayer from '@/components/VelnVideoPlayer';
    import {courseContent, getCourse} from '@/api/course';
    import {findByCourseId} from '@/api/courseItem';
    // import { getFileType } from '@/utils/file';
    import {transformSecondToMS} from '@/utils/time';
    import {transferNumberToChinese} from '@/utils/number';
    import QRCode from 'qrcodejs2';
    // import checkPermission from '@/utils/permission';
    import Clipboard from 'clipboard';

    export default {
        name: 'CourseItemList',
        components: {
            VelnFileSelect,
            CourseAccessory,
            VelnVideoPlayer
        },
        data() {
            return {
                editQuery: {
                    standard: '',
                    courseItemList: [],
                    totalDuration: '',
                    id: this.$route.query.id,
                    demo: {
                        srcId: '',
                        srcType: '',
                        srcName: '',
                        srcCreated: '',
                        srcSize: '',
                        viewUrl: ''
                    }
                },
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
                        trigger: 'blur'
                    },
                    fileRequired: {
                        required: true,
                        message: this.$t('请上传章节内容'),
                        trigger: 'blur'
                    },
                    standard: [
                        {
                            required: true,
                            message: this.$t('请选择课程类型'),
                            trigger: 'blur'
                        }
                    ]
                },
                options: [
                    {
                        value: 'VIDEO',
                        label: '视频'
                    },
                    {
                        value: 'AUDIO',
                        label: '音频'
                    },
                    {
                        value: 'DOC',
                        label: '文档'
                    }
                ],
                chapterList: [],
                uploadURL: `${process.env.FS_API}/file/upload`,
                typeArr: ['VIDEO'],
                dialogKey: null,
                fileDialogVisible: false,
                active: '',
                qrcodeDialogVisible: false,
                formKey: null,
                previewUrl: '',
                referId: '',
                previewType: '',
                previewPostre: '',
                previewDialogVisible: false,
                downloadUrl: '',
                fluentUrl: '',
                loadingFlag: false
            };
        },
        computed: {
            ...mapGetters(['name', 'appCode', 'token'])
        },
        created() {
            this.loadingFlag = true;
            this.getCourse();
            this.getCourseItem();
        },
        methods: {
            transferNumberToChinese,
            showQrcode(section) {
                this.qrcodeDialogVisible = true;
                const tUrl = `${process.env.CONVERT_API}/convert/record?id=${section.id}&_token=${this.token}`;
                const pUrl = `${process.env.CONVERT_API}/convert/view?id=${section.id}&_token=${this.token}`;
                setTimeout(() => {
                    this.renderQrcode(tUrl, pUrl);
                }, 500);
            },
            renderQrcode(tUrl, pUrl) {
                new QRCode('tapeQrCode', {
                    text: tUrl || '',
                    width: 140,
                    height: 140,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
                new QRCode('previewQrCode', {
                    text: pUrl || '',
                    width: 140,
                    height: 140,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
            },
            calTotalDuration() {
                let total = 0;
                this.editQuery.courseItemList.map(item => {
                    Array.isArray(item.childCourseItemList) &&
                        item.childCourseItemList.map(itm => {
                            total += (itm.srcSize || 0);
                        });
                });
                this.editQuery.totalDuration = this.transformSize({
                    srcType: 'video',
                    srcSize: total
                });
            },
            getCourse() {
                getCourse(this.editQuery.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery.standard = result.data.standard;
                        this.typeArr = [result.data.standard];
                        const {
                            auditionFileId,
                            srcType,
                            srcName,
                            srcUrl,
                            viewUrl,
                            createdAt,
                            id,
                            srcSize,
                            fluentUrl,
                            convertType,
                            convertStatus
                        } = result.data.courseDetail;
                        this.editQuery.demo = {
                            srcId: auditionFileId,
                            srcType: srcType,
                            srcName: srcName,
                            srcCreated: moment(createdAt).format('YYYY / MM / DD'),
                            srcSize: srcSize,
                            viewUrl: viewUrl,
                            referId: id,
                            fluentUrl: fluentUrl,
                            downloadUrl: srcUrl,
                            convertType: convertType,
                            convertStatus: convertStatus
                        };
                        this.transformSize({srcType, srcSize});
                    }
                });
            },
            getCourseItem() {
                findByCourseId({courseId: this.editQuery.id}).then(re => {
                    this.loadingFlag = false;
                    const result = re.data;
                    if (result.success) {
                        this.editQuery.courseItemList = result.data || [];
                        if (this.editQuery.courseItemList.length <= 0) {
                            const chapter = {
                                name: '',
                                childCourseItemList: [
                                    {
                                        name: ''
                                    }
                                ]
                            };
                            this.editQuery.courseItemList.push(chapter);
                            return;
                        }
                        this.calTotalDuration();
                    } else {
                        this.$errorMsg(result.msg || this.$t('查询失败'));
                    }
                });
            },
            addChapter() {
                const chapter = {
                    name: '',
                    childCourseItemList: [
                        {
                            name: ''
                        }
                    ]
                };
                this.editQuery.courseItemList.push(chapter);
            },
            addSection(chapter) {
                const section = {
                    name: ''
                };
                chapter.childCourseItemList.push(section);
            },
            removeChapter(index) {
                this.editQuery.courseItemList.splice(index, 1);
            },
            removeSection(chapter, index) {
                chapter.childCourseItemList.splice(index, 1);
            },
            cancel() {
                history.go(-1);
            },
            handleCheckChange() {
                this.typeArr = [this.editQuery.standard];
                this.dialogKey = +new Date();
            },
            handleSuccess(response, file, fileList, data) {
                const result = response;
                // data.srcId = result.id;
                if (result.success) {
                    data.srcId = result.data.fileId;
                }
            },
            sure() {
                this.$refs.editQuery.validate((valid, object) => {
                    if (valid) {
                        if (this.editQuery.id) {
                            courseContent(this.editQuery).then(re => {
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.$router.push({
                                        name: `courseOpenScope`,
                                        query: {
                                            id: this.editQuery.id
                                        }
                                    });
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                        }
                    }
                });
            },
            deleteFile(first, second) {
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcId = '';
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcName = '';
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcCreated = '';
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].fileType = '';
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcSize = '';
                this.$forceUpdate();
            },
            transformSize(section) {
                // 如果是音频/视频，length是时长，其他是页数
                if (section.srcType === 'audio' || section.srcType === 'video') {
                    return transformSecondToMS(section.srcSize);
                } else {
                    return `${section.srcSize || 0}页`;
                }
            },
            onSure(files) {
                const file = files[0];
                const list = this.active.split('.');
                const first = list[0];
                const second = list[1];
                // const fileType = getFileType(file.qgFileDetail.fileExt);
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcId = file.fileId;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcName = file.name;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcCreated = moment(file.qgFileDetail.createdAt).format(
                    'YYYY / MM / DD'
                );
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcType = file.iconType;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcSize = file.qgFileDetail.length;

                let name = file.name.split('.');
                name.pop();
                name = name.join('.');
                if (
                    !this.editQuery.courseItemList[first].childCourseItemList[
                        second
                    ].name
                ) {
                    this.editQuery.courseItemList[first].childCourseItemList[
                        second
                    ].name = name;
                }

                if (!this.editQuery.courseItemList[first].name) {
                    this.editQuery.courseItemList[first].name = name;
                }

                this.fileDialogVisible = false;
                this.formKey = +new Date();
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showFileDialog(parent, self) {
                if (isNaN(parent) || isNaN(self)) {
                    console.log('没有传入父子节点信息');
                    return;
                }
                this.active = `${parent}.${self}`;
                this.fileDialogVisible = true;
            },
            previewFile(file) {
                /* this.previewUrl = file.viewUrl || file.srcUrl;
                this.fluentUrl = file.fluentUrl;
                this.downloadUrl = file.downloadUrl || file.srcUrl;
                this.previewType = file.srcType;
                this.previewPostre = file.coverUrl;
                this.previewDialogVisible = true;*/
                const {id, srcType, viewUrl, fluentUrl, downloadUrl, srcUrl, coverUrl, fileId, srcSize, convertType} = file;
                if (srcType !== 'audio' && srcType !== 'video') {
                    const routeData = this.$router.resolve({
                        name: 'filePreview',
                        query: {fileId, viewUrl, length: srcSize, convertType}
                    });
                    window.open(routeData.href, '_blank');
                    return;
                }
                this.previewType = srcType;
                this.previewUrl = viewUrl;
                this.fluentUrl = fluentUrl;
                this.referId = id;
                this.downloadUrl = downloadUrl || srcUrl;
                this.previewPostre = coverUrl;
                this.previewDialogVisible = true;
            },
            // 复制按钮点击回调
            copy() {
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
            },
            // 复制按钮点击回调
            copyFluent() {
                var clipboard = new Clipboard('.copy__fluent__btn');
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
            },
            download() {
                window.open(this.downloadUrl);
            }
        }
    };
</script>
