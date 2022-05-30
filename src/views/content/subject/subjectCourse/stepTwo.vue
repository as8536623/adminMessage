<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="course__item__block container__padding">
        <el-form
            ref="editQuery"
            :key="formKey"
            :model="editQuery"
            label-width="120px"
            :inline-message="true"
            :rules="rules"
            class="course__item__form"
        >
            <!-- 课程类型模块 -->
            <section class="course__item__sec top">
                <div class="course__type">
                    <el-form-item :label="$t('专题demo') + '：'">
                        <course-accessory
                            class="demo__course__accessory"
                            :course="editQuery.demo"
                            :can-modify-item="editQuery.canModifyItem"
                            @upload="showDemoSelect"
                            @delete="deleteDemo"
                            @preview="previewFile(editQuery.demo)"
                            @showQrcode="showQrcode(editQuery.demo)"
                        />
                    </el-form-item>
                </div>
            </section>
            <!-- 课程章节模块 -->
            <el-row class="opt__line">
                <el-button type="primary" @click="showFileDialog()">{{ $t('选择课程') }}</el-button>
            </el-row>

            <section v-if="editQuery.courseList.length" class="course__item__sec center">
                <div
                    v-for="(chapter, index) in editQuery.courseList"
                    :key="index"
                    class="course__chapter__wrapper"
                >
                    <section class="course__paragraph__title">
                        <!-- 小节设置 -->
                        <el-form-item :label="(index+1)+'：'">
                            <el-input
                                v-model.trim="chapter.courseName"
                                :placeholder="$t('请输入小节名称')"
                                :max-length="50"
                                disabled
                            />
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="'删除小节'"
                                placement="top"
                            >
                                <svg-icon
                                    v-if="editQuery.canModifyItem"
                                    class="course__opt__icon"
                                    icon-class="minus"
                                    @click="removeChapter(index)"
                                />
                            </el-tooltip>
                            <el-tooltip
                                v-if="index>0"
                                class="item"
                                effect="dark"
                                :content="$t('上移')"
                                placement="top"
                            >
                                <svg-icon
                                    class="course__opt__icon"
                                    icon-class="up_s"
                                    @click="move('up', editQuery.courseList, index)"
                                />
                            </el-tooltip>
                            <el-tooltip
                                v-if="index<(editQuery.courseList.length-1)"
                                class="item"
                                effect="dark"
                                :content="$t('下移')"
                                placement="top"
                            >
                                <svg-icon
                                    class="course__opt__icon"
                                    icon-class="down_s"
                                    @click="move('down', editQuery.courseList, index)"
                                />
                            </el-tooltip>
                        </el-form-item>
                    </section>
                </div>
            </section>
            <div v-if="!editQuery.courseList.length" class="default-page">{{ $t('暂无数据') }}</div>
            <el-form-item v-show="false" label="课时" prop="period" :rules="[rules.required]">
                <el-input-number
                    v-model="editQuery.period"
                    :maxlength="22"
                    :min="0"
                    :max="999"
                    clearable
                    controls-position="right"
                />
            </el-form-item>
            <el-form-item label="专题价格" prop="price" :rules="[rules.required]">
                <el-input-number
                    v-model="editQuery.price"
                    :maxlength="13"
                    :min="0"
                    :max="99999"
                    clearable
                    controls-position="right"
                />
            </el-form-item>
            <el-form-item v-if="!hasBgk" :label="$t('适用范围') + '：'" prop="useScope">
                <veln-organization-scope
                    :fun-code="scopeQuery.funCode"
                    :business-id="scopeQuery.funId"
                    :app-code="scopeQuery.appCode"
                    :route="scopeQuery.route"
                    :show-user="false"
                    init-active-tab="openOrg"
                />
            </el-form-item>
            <section class="course__item__sec form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('保存并返回') }}</el-button>
            </section>
        </el-form>
        <el-dialog
            v-if="fileDialogVisible"
            :key="dialogKey"
            append-to-body
            :title="'选择文件'"
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
        <course-selector
            ref="subjectCourseSelectorComponent"
            :key="EXTRA_PARAM.funCode + EXTRA_PARAM.funId"
            :url="url"
            :title="$t('选择课程')"
            :table-columns="courseSelectorTableColumns"
            :show-search="true"
            :extra-param="EXTRA_PARAM"
            @select="onSure"
        />
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
                />
                <audio
                    v-if="previewType==='audio'"
                    class="preview__audio"
                    :src="previewUrl"
                    controls
                />
            </section>
        </el-dialog>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import CourseAccessory from '@/components/CourseAccessory';
    import {transformSecondToMS} from '@/utils/time';
    import {transferNumberToChinese} from '@/utils/number';
    import QRCode from 'qrcodejs2';
    import Clipboard from 'clipboard';
    import {getPre} from '@/utils/dev';
    import {getToken, isBgk} from '@/utils/auth';
    import {courseSelectorTableColumns} from './coursesOperationConfig';
    import CourseSelector from '@/components/CourseSelector';
    import VelnVideoPlayer from '@/components/VelnVideoPlayer';
    import {listRefer, stepTwoSave} from '@/api/moudles/stu/subject';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';

    export default {
        name: 'CourseItem',
        components: {
            VelnFileSelect,
            CourseAccessory,
            CourseSelector,
            VelnOrganizationScope,
            VelnVideoPlayer
        },
        data() {
            const hasBgk = isBgk();
            return {
                editQuery: {
                    standard: '', // 课程类型
                    status: 'DRAFT', // 课程状态
                    canModifyItem: true, // 是否可以编辑
                    courseList: [], // 章节列表
                    demo: {
                        srcId: '',
                        srcType: '',
                        srcName: '',
                        srcCreated: '',
                        srcSize: '',
                        viewUrl: '',
                        convertType: ''
                    },
                    id: this.$route.query.id // 课程ID
                },
                courseSelectorTableColumns: courseSelectorTableColumns,
                EXTRA_PARAM: {
                    funCode: 'SUBJECT_COURSE',
                    funId: 'SUBJECT_CHILD_COURSE',
                    subjectId: this.$route.query.id
                },
                url: `${process.env.STU_API}/subject/listWaitCourse`,
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
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
                chapterList: [], // 章节list
                uploadURL: `${process.env.FS_API}/file/upload`, // 上传地址
                typeArr: ['VIDEO'],
                dialogKey: null,
                fileDialogVisible: false,
                active: '', // 当前上传的附件 标记
                qrcodeDialogVisible: false,
                formKey: null,
                previewDialogVisible: false, // 预览弹框
                previewUrl: '',
                downloadUrl: '',
                fluentUrl: '',
                previewType: '',
                previewPostre: '',
                scopeQuery: {
                    funCode: 'SUBJECT',
                    funId: this.$route.query.id,
                    appCode: 'veln-stu',
                    route: 'openScope'
                },
                hasBgk,
                totalPrice: 0,
                totalPeriod: 0
            };
        },
        computed: {
            ...mapGetters(['name', 'appCode', 'token'])
        },
        created() {
            listRefer(this.$route.query.id).then(reObj => {
                const re = reObj.data;
                if (re.success && re.success === true && re.data) {
                    const courseReferList = re.data.courseReferList;
                    if (courseReferList) {
                        const courseList = [];
                        courseReferList.forEach(item => {
                            courseList.push({relId: item.courseId, courseName: item.courseName});
                        });
                        this.editQuery.courseList = courseList;
                    }

                    const qgutechFile = re.data.previewFile;
                    if (qgutechFile) {
                        this.selectDemo(qgutechFile);
                    }

                    this.editQuery.price = re.data.price;
                    this.editQuery.period = re.data.period;
                }
            });
        },
        methods: {
            transferNumberToChinese,
            // 显示录音二维码
            showQrcode(section) {
                this.qrcodeDialogVisible = true;
                const tUrl = `${getPre()}/api/veln-convert/convert/record?id=${section.id}&_token=${getToken()}`;
                const pUrl = `${getPre()}/api/veln-convert/convert/view?id=${section.id}&_token=${getToken()}`;
                setTimeout(() => {
                    this.renderQrcode(tUrl, pUrl);
                }, 500);
            },
            // 渲染录音二维码
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
            // 移除小节
            removeChapter(index) {
                this.editQuery.courseList.splice(index, 1);
            },
            cancel() {
                // this.$router.push({
                //     name: `subjectCourseIndex`
                // });
                history.go(-2);
            },
            // 当课程类型变化时，重置课程章节
            handleCheckChange() {
                this.typeArr = [this.editQuery.standard];
                this.editQuery.courseList = [{
                    id: '',
                    name: ''
                }];
                this.editQuery.demo = {
                    srcId: '',
                    srcType: '',
                    srcName: '',
                    srcCreated: '',
                    srcSize: '',
                    viewUrl: '',
                    convertType: ''
                };
                this.dialogKey = +new Date();
            },
            handleSuccess(response, file, fileList, data) {
                const result = response;
                // data.srcId = result.id;
                if (result.success) {
                    data.srcId = result.data.fileId;
                }
            },
            // 新增小节
            addChapter() {
                const chapter = {
                    id: '',
                    name: ''
                };
                this.editQuery.courseItemList.push(chapter);
            },
            // 删除章节附件
            deleteFile(first, second) {
                this.editQuery.courseItemList[first].srcId = '';
                this.editQuery.courseItemList[first].srcName = '';
                this.editQuery.courseItemList[first].srcCreated = '';
                this.editQuery.courseItemList[first].fileType = '';
                this.editQuery.courseItemList[first].srcSize = '';
                this.formKey = +new Date();
            },
            showFileDialog() {
                console.info('this.editQuery.courseList: ', this.editQuery.courseList);
                const selectedCozIds = [];
                this.editQuery.courseList.forEach(item => {
                    selectedCozIds.push(item.relId);
                });
                this.$store.commit('SET_SELECTED_IDS', selectedCozIds);
                this.active = 'courseSelector';
                this.$refs.subjectCourseSelectorComponent.show();
            },
            sure() {
                const that = this;
                this.$refs.editQuery.validate((valid, object) => {
                    if (valid) {
                        const id = that.editQuery.id;
                        if (id) {
                            const params = that.editQuery;
                            const courseIdList = [];
                            params.courseList.forEach(item => {
                                courseIdList.push(item.relId);
                            });
                            const requestObj = {
                                previewFileId: params.demo.srcId,
                                courseIdList: courseIdList,
                                price: params.price,
                                period: params.period
                            };
                            stepTwoSave(id, requestObj).then(re => {
                                const result = re.data;
                                if (result.success) {
                                    that.$successMsg('保存成功');
                                    history.go(-2);
                                } else {
                                    that.$errorMsg(
                                        result.msg || '保存失败'
                                    );
                                }
                            });
                        }
                    }
                });
            },
            // 更改课程大小显示
            transformSize(section) {
                // 如果是音频/视频，length是时长，其他是页数
                if (section.srcType === 'audio' || section.srcType === 'video') {
                    return transformSecondToMS(section.srcSize);
                } else {
                    return `${section.srcSize || 0}页`;
                }
            },
            // 选择课程文件
            selectCourseItem(file) {
                this.editQuery.courseList.push(file);
            },
            // 选择demo
            selectDemo(file) {
                console.log('selectDemo', file);
                const {fileId, qgFileDetail, name, mt, viewUrl, m3u8Url, convertType, convertStatus} = file;
                const {mediaType} = qgFileDetail;
                this.editQuery.demo = {
                    srcId: fileId,
                    srcType: mt || mediaType,
                    srcName: name,
                    convertType,
                    convertStatus,
                    srcCreated: moment(qgFileDetail.createdAt).format(
                        'YYYY / MM / DD'
                    ),
                    srcSize: qgFileDetail.length,
                    viewUrl:
                        this.editQuery.standard === 'VIDEO'
                            ? m3u8Url.split(',')[0]
                            : viewUrl,
                    downloadUrl: viewUrl,
                    fluentUrl:
                        this.editQuery.standard === 'VIDEO'
                            ? m3u8Url.split(',').length > 1
                                ? m3u8Url.split(',')[1]
                                : m3u8Url.split(',')[0]
                            : '',
                    srcUrl: viewUrl
                };

                console.log('demo', this.editQuery.demo);
            },
            // 删除demo
            deleteDemo() {
                this.editQuery.demo = {
                    srcId: '',
                    srcType: '',
                    srcName: '',
                    srcCreated: '',
                    srcSize: '',
                    viewUrl: '',
                    convertType: ''
                };
            },
            onSure(files) {
                if (this.active === 'demo') {
                    this.selectDemo(files[0]);
                } else {
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        this.selectCourseItem(file);
                        console.info('File:', file);
                    }
                    this.totalPeriod = 0;
                    this.totalPrice = 0;
                    this.editQuery.courseList.forEach(item => {
                        this.totalPeriod = this.totalPeriod + item.coursePeriod;
                        this.totalPrice = this.totalPrice + item.price;
                    });
                    this.editQuery.period = this.totalPeriod;
                    this.editQuery.price = this.totalPrice;
                }

                this.fileDialogVisible = false;
                this.formKey = +new Date();
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            // 选择弹框关闭
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showDemoSelect() {
                this.active = 'demo';
                this.fileDialogVisible = true;
            },
            previewFile(file) {
                const {srcType, viewUrl, m3u8Url, fluentUrl, downloadUrl, srcUrl, coverUrl, fileId, srcSize, convertType} = file;
                if (srcType !== 'audio' && srcType !== 'video') {
                    const routeData = this.$router.resolve({
                        name: 'filePreview',
                        query: {fileId, viewUrl, length: srcSize, convertType}
                    });
                    window.open(routeData.href, '_blank');
                    return;
                }
                this.previewType = srcType;
                this.previewUrl = m3u8Url;
                this.fluentUrl = fluentUrl;
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
            },
            move(type, list, index) {
                let temp = null;
                if (type === 'up') {
                    temp = list[index - 1];
                    list[index - 1] = list[index];
                    list[index] = temp;
                    this.formKey = +new Date();
                    return;
                }

                temp = list[index + 1];
                list[index + 1] = list[index];
                list[index] = temp;
                this.formKey = +new Date();
            },
            selectTask(selectedCourseObj) {
                this.editQuery.courseList.push(selectedCourseObj);
            }
        }
    };
</script>
