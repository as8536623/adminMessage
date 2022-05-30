<style lang="scss" src="./style.scss">
</style>
<style lang="scss" scoped>
.course__file__icon {
    float: left;
    width: 30px;
    height: 35px;
    margin-right: 28px;
    background-image: url('./images/icons.png');
    background-image: -webkit-image-set(url('./images/icons.png') 1x, url('./images/icons@2x.png') 2x, url('./images/icons@3x.png') 3x);
    background-size: 125px;
    background-repeat: no-repeat;
    margin-top: 7.5px;
}

</style>
<template>
    <article class="course__item__block">
        <el-form
            ref="editQuery"
            :key="formKey"
            v-loading="loadingFlag"
            :model="editQuery"
            label-width="120px"
            :inline-message="true"
            :rules="rules"
            class="course__item__form"
        >
            <!-- 课程类型模块 -->
            <section class="course__item__sec top">
                <header class="course__item__title">{{ $t('课程内容') }}</header>
                <div class="course__type">
                    <el-form-item :label="$t('课程类型') + '：'" prop="standard">
                        <el-select
                            v-model="editQuery.standard"
                            placeholder="请选择"
                            :disabled="!editQuery.canModifyItem"
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
            <section class="course__item__sec center">
                <div
                    v-for="(chapter, index) in editQuery.courseItemList"
                    :key="index"
                    class="course__chapter__wrapper"
                >
                    <div class="course__item__chapter">
                        <!-- 章设置 -->
                        <el-form-item
                            :label="$t('第'+ transferNumberToChinese((index + 1)) +'章') + '：'"
                            :prop="'courseItemList[' + index + '].name'"
                            :rules="rules.required"
                        >
                            <el-input
                                v-model.trim="editQuery.courseItemList[index].name"
                                :placeholder="$t('请输入章名称')"
                                :max-length="50"
                                :disabled="!editQuery.canModifyItem"
                            />
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="$t('新增章节')"
                                placement="top"
                            >
                                <svg-icon
                                    v-if="editQuery.canModifyItem"
                                    class="course__opt__icon"
                                    icon-class="course_add"
                                    @click="addChapter"
                                />
                            </el-tooltip>
                            <el-tooltip
                                v-if="editQuery.courseItemList.length > 1 && ((editQuery.status==='DRAFT'||editQuery.status==='DISABLED') || (editQuery.status!=='DRAFT' && !editQuery.courseItemList[index].id))"
                                class="item"
                                effect="dark"
                                :content="$t('删除章节')"
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
                                    v-if="editQuery.canModifyItem"
                                    class="course__opt__icon"
                                    icon-class="up_s"
                                    @click="move('up', editQuery.courseItemList, index)"
                                />
                            </el-tooltip>
                            <el-tooltip
                                v-if="index<(editQuery.courseItemList.length-1)"
                                class="item"
                                effect="dark"
                                :content="$t('下移')"
                                placement="top"
                            >
                                <svg-icon
                                    v-if="editQuery.canModifyItem"
                                    class="course__opt__icon"
                                    icon-class="down_s"
                                    @click="move('down', editQuery.courseItemList, index)"
                                />
                            </el-tooltip>
                        </el-form-item>
                    </div>
                    <div
                        v-for="(section, childIndex) in chapter.childCourseItemList"
                        :key="childIndex"
                        class="course__item__paragraph"
                    >
                        <section class="course__paragraph__title">
                            <!-- 小节设置 -->
                            <el-form-item
                                :label="(index+1)+'.'+(childIndex+1)+ '：'"
                                :prop="'courseItemList[' + index + '].childCourseItemList[' + childIndex + '].name'"
                                :rules="rules.required"
                            >
                                <el-input
                                    v-model.trim="chapter.childCourseItemList[childIndex].name"
                                    :placeholder="$t('请输入小节名称')"
                                    :max-length="50"
                                    :disabled="!editQuery.canModifyItem"
                                />
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="$t('新增小节')"
                                    placement="top"
                                >
                                    <svg-icon
                                        v-if="editQuery.canModifyItem"
                                        class="course__opt__icon"
                                        icon-class="course_add"
                                        @click="addSection(chapter)"
                                    />
                                </el-tooltip>
                                <el-tooltip
                                    v-if="chapter.childCourseItemList.length > 1 && ((editQuery.status==='DRAFT'||editQuery.status==='DISABLED') || (editQuery.status!=='DRAFT' && !chapter.childCourseItemList[childIndex].id))"
                                    class="item"
                                    effect="dark"
                                    :content="$t('删除小节')"
                                    placement="top"
                                >
                                    <svg-icon
                                        v-if="editQuery.canModifyItem"
                                        class="course__opt__icon"
                                        icon-class="minus"
                                        @click="removeSection(chapter, childIndex)"
                                    />
                                </el-tooltip>
                                <el-tooltip
                                    v-if="childIndex>0"
                                    class="item"
                                    effect="dark"
                                    :content="$t('上移')"
                                    placement="top"
                                >
                                    <svg-icon
                                        v-if="editQuery.canModifyItem"
                                        class="course__opt__icon"
                                        icon-class="up_s"
                                        @click="move('up', chapter.childCourseItemList, childIndex)"
                                    />
                                </el-tooltip>
                                <el-tooltip
                                    v-if="childIndex<(chapter.childCourseItemList.length-1)"
                                    class="item"
                                    effect="dark"
                                    :content="$t('下移')"
                                    placement="top"
                                >
                                    <svg-icon
                                        v-if="editQuery.canModifyItem"
                                        class="course__opt__icon"
                                        icon-class="down_s"
                                        @click="move('down', chapter.childCourseItemList, childIndex)"
                                    />
                                </el-tooltip>
                            </el-form-item>
                        </section>
                        <el-form-item
                            class="upload__form__item"
                            :prop="'courseItemList[' + index + '].childCourseItemList[' + childIndex + '].srcId'"
                            :rules="[{ required: true, message: '请选择关联资源', trigger: 'change' }]"
                        >
                            <div class="course__accessory">
                                <div
                                    v-if="!section.srcId"
                                    class="course__paragraph--empty"
                                    @click="resourceOpen(index, childIndex)"
                                >
                                    <svg-icon icon-class="fold_o" class-name="course__paragraph--empty__icon"/>
                                    <div class="course__paragraph--empty__text">{{ $t('选择关联资源') }}</div>
                                </div>
                                <div v-if="section.srcId" class="course__paragraph__file">
                                    <div class="course__file__icon" :data-type="section.srcType"/>
                                    <div class="course__file__info">
                                        <div class="course__file__name">{{ section.srcName }}</div>
                                        <div class="course__file__bottom">
                                            <span
                                                class="course__file__length"
                                                :data-size="section.srcSize"
                                            >{{ transformSize(section) }}</span>
                                            <el-button
                                                v-if="editQuery.canModifyItem"
                                                class="course__file__del pull-right"
                                                type="text"
                                                @click.stop="deleteResource(index, childIndex)"
                                            >{{ $t('删除') }}
                                            </el-button>
                                            <el-button
                                                class="course__file__preview pull-right"
                                                type="text"
                                                @click.stop="previewResource(section.resourceId)"
                                            >{{ $t('预览') }}
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                </div>
            </section>
            <section class="course__item__sec form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
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
                />
                <audio
                    v-if="previewType==='audio'"
                    class="preview__audio"
                    :src="previewUrl"
                    controls
                />
                <!--                <div class="copy__line">-->
                <!--                    <el-button v-if="downloadUrl" class="pull-left" @click="download">{{ $t('下载') }}</el-button>-->
                <!--                    <el-button-group v-if="editQuery.standard === 'VIDEO'" class="pull-right">-->
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
        <el-dialog
            v-if="resourceDialogVisible"
            append-to-body
            title="选择资源"
            :visible.sync="resourceDialogVisible"
            width="1068px"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            :close-on-press-escape="false"
            @close="resourceClose"
        >
            <section class="resource-dialog-main">
                <section class="search-box__left__input-box">
                    <img class="input-box__search-icon" src="../../../../assets/images/search_examine.png">
                    <el-input
                        v-model.trim="resourceQuery.name"
                        :placeholder="$t('搜索资源名称')"
                        @keyup.enter.native="handleCurrentChangeResource(1)"
                    />
                    <span v-show="resourceQuery.name" class="input-box__clear" @click="clear">
                        <svg-icon icon-class="close_o"/>
                    </span>
                </section>
                <section class="search-box__left__input-box">
                    <el-input
                        ref="categoryInput"
                        v-model.trim="resourceQuery.categoryName"
                        :placeholder="$t('请选择类别')"
                        :max-length="32"
                        clearable
                        @clear="clearCategory"
                        @focus="showCategorySelect"
                    />
                </section>
                <qgu-table
                    :columns="tableColumns"
                    :data="resourceList"
                    :page="resourceQuery"
                    :total="resourceTotal"
                    :loading="resourceListLoading"
                    @selection-change="selectionResourceChange"
                    @size-change="handleSizeChangeResource"
                    @current-change="handleCurrentChangeResource"
                />
            </section>
            <div class="dialog__btn__line">
                <el-button @click="resourceClose">取消</el-button>
                <el-button type="primary" @click="changeResourceSave">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择类别')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-resource-category-select
                ref="category"
                :default-expand-all="defaultExpandAll"
            />
            <div class="dialog__btn__line">
                <el-button @click="categoryDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="categorySelect">确定</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import VelnVideoPlayer from '@/components/VelnVideoPlayer';
    import CourseAccessory from '@/components/CourseAccessory';
    import {courseContent, getCourse} from '@/api/course';
    import {findByCourseId} from '@/api/courseItem';
    import {transformSecondToMS} from '@/utils/time';
    import {transferNumberToChinese} from '@/utils/number';
    import VelnResourceCategorySelect from '@/components/VelnResourceCategorySelect';
    import QRCode from 'qrcodejs2';
    import Clipboard from 'clipboard';
    import {getPre} from '@/utils/dev';
    import {getToken} from '@/utils/auth';
    import {getList, getInfo} from '@/api/courseResource';

    export default {
        name: 'CourseItem',
        components: {
            VelnFileSelect,
            VelnVideoPlayer,
            CourseAccessory,
            VelnResourceCategorySelect
        },
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            const tableColumns = [
                {
                    type: 'radio',
                    maxWidth: 30,
                    disabled: () => {
                        return !(
                            this.checkPermission('uploadResource') ||
                            this.checkPermission('resourceDetail') ||
                            this.checkPermission('deleteResource') ||
                            this.checkPermission('editResource')
                        );
                    }
                },
                {
                    field: 'name',
                    text: this.$t('名称'),
                    minWidth: 120,
                    render: (h, param) => {
                        const stemOutline = param.row.name;
                        return h('div', {
                                     attrs: {
                                         class: 'table__td__ellipsis table__td__link',
                                         title: stemOutline ? stemOutline.replace(/<\/?p[^>]*>/gi, '') : '--'
                                     },
                                     on: {
                                         click: () => {
                                             getInfo(param.row.resourceId)
                                                 .then(re => {
                                                     const result = re.data;
                                                     if (result && result.success) {
                                                         const data = result.data;
                                                         this.previewType = data.type;
                                                         this.previewUrl = data.srcUrl;
                                                         this.fluentUrl = data.fluentUrl;
                                                         this.downloadUrl = data.coverUrl || data.srcUrl;
                                                         this.previewPostre = data.coverUrl;
                                                         this.previewDialogVisible = true;
                                                     } else {
                                                         this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                                                     }
                                                 });
                                         }
                                     }
                                 },
                                 [
                                     h(
                                         'span',
                                         {},
                                         stemOutline
                                             ? stemOutline.replace(/<\/?p[^>]*>/gi, '')
                                             : '--'
                                     )
                                 ]);
                    }
                },
                {
                    field: 'teacherName',
                    text: this.$t('讲师'),
                    minWidth: 140,
                    render: (h, param) => {
                        const teacherName = param.row.teacherName;
                        return h('div', {
                                     attrs: {
                                         class: 'table__td__ellipsis',
                                         title: teacherName ? teacherName.replace(/<\/?p[^>]*>/gi, '') : '--'
                                     }
                                 },
                                 [
                                     h(
                                         'span',
                                         {},
                                         teacherName
                                             ? teacherName.replace(/<\/?p[^>]*>/gi, '')
                                             : '--'
                                     )
                                 ]);
                    }
                },
                {
                    field: 'srcSize',
                    text: this.$t('视频时长'),
                    minWidth: 80,
                    render: (h, param) => {
                        const _size = param.row.srcSize ? this.formatSeconds(param.row.srcSize) : 0;
                        return _size;
                    }
                },
                {
                    field: 'createdAt',
                    text: this.$t('创建时间'),
                    maxWidth: 120,
                    render: (h, param) => {
                        const createdAt = param.row.createdAt;
                        return createdAt
                            ? moment(param.row.createdAt).format('YYYY-MM-DD')
                            : '--';
                    }
                }
            ];
            return {
                hasBgk,
                tableColumns,
                categoryDialogVisible: false,
                defaultExpandAll: false,
                editQuery: {
                    standard: '', // 课程类型
                    status: 'DRAFT', // 课程状态
                    canModifyItem: true, // 是否可以编辑
                    courseItemList: [], // 章节列表
                    demo: {
                        srcId: '',
                        srcType: '',
                        srcName: '',
                        srcCreated: '',
                        srcSize: '',
                        viewUrl: '',
                        convertType: '',
                        convertStatus: ''
                    },
                    id: this.$route.query.id // 课程ID
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
                loadingFlag: false,
                resourceDialogVisible: false,
                resourceList: [],
                resourceQuery: {
                    includeChildCategory: true,
                    name: '',
                    categoryId: '',
                    pageNum: 1,
                    pageSize: 10
                },
                resourceTotal: 0,
                resourceListLoading: false,
                resourceSelectedData: {
                    resourceId: '',
                    srcId: '',
                    srcType: '',
                    srcName: '',
                    srcCreated: '',
                    srcSize: ''
                },
                resourceSelectedIndex: 0,
                resourceSelectedChildIndex: 0
            };
        },
        computed: {
            ...mapGetters(['name', 'appCode', 'token'])
        },
        created() {
            if (this.hasBgk) {
                this.options.pop();
            }
            this.getCourse();
            this.getCourseItem();
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
            clearCategory() {
                this.resourceQuery.categoryId = '';
                this.$refs.resourceQuery.validateField('categoryId');
            },
            // 获取课程数据
            getCourse() {
                getCourse(this.editQuery.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery.standard = result.data.standard;
                        this.editQuery.status = result.data.status;
                        this.editQuery.canModifyItem = result.data.canModifyItem;
                        this.typeArr = [result.data.standard];
                        const {
                            auditionFileId,
                            srcType,
                            srcName,
                            srcUrl,
                            viewUrl,
                            createdAt,
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
                            fluentUrl: fluentUrl,
                            downloadUrl: srcUrl,
                            convertType: convertType,
                            convertStatus: convertStatus
                        };
                        this.transformSize({srcType, srcSize});
                    }
                });
            },
            showCategorySelect() {
                this.categoryDialogVisible = true;
                this.$refs.categoryInput.blur();
            },
            categoryDlgClose() {
                this.categoryDialogVisible = false;
            },
            // 选择类别
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.resourceQuery.categoryId = result.id;
                this.resourceQuery.categoryName = result.name;
                this.categoryDialogVisible = false;
                this.getResourceList({
                    pageSize: 10,
                    pageNum: 1
                });
            },
            // 获取课程章节数据
            getCourseItem() {
                this.loadingFlag = true;
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
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('查询失败'));
                    }
                });
            },
            // 新增小节
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
            // 新增章节
            addSection(chapter) {
                const section = {
                    name: ''
                };
                chapter.childCourseItemList.push(section);
            },
            // 移除小节
            removeChapter(index) {
                this.editQuery.courseItemList.splice(index, 1);
            },
            // 移除章
            removeSection(chapter, index) {
                chapter.childCourseItemList.splice(index, 1);
            },
            cancel() {
                history.go(-1);
            },
            // 当课程类型变化时，重置课程章节
            handleCheckChange() {
                this.typeArr = [this.editQuery.standard];
                this.editQuery.courseItemList = [
                    {
                        name: '',
                        childCourseItemList: [
                            {
                                name: ''
                            }
                        ]
                    }
                ];
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
            sure() {
                this.$refs.editQuery.validate((valid, object) => {
                    if (valid) {
                        if (this.editQuery.id) {
                            const params = this.editQuery;
                            params.auditionFileId = params.demo.srcId;
                            courseContent(params).then(re => {
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
            // 删除章节附件
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
                this.formKey = +new Date();
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
            selectCourseItem(file, first, second, list) {
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
                ].srcType = file.mt;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcSize = file.qgFileDetail.length;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].viewUrl =
                    this.editQuery.standard === 'VIDEO'
                        ? file.m3u8Url.split(',')[0]
                        : file.viewUrl;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].fluentUrl =
                    this.editQuery.standard === 'VIDEO'
                        ? file.m3u8Url.split(',').length > 1
                            ? file.m3u8Url.split(',')[1]
                            : file.m3u8Url.split(',')[0]
                        : '';
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].srcUrl = file.viewUrl;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].downloadUrl = file.viewUrl;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].coverUrl = file.coverUrl;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].convertType = file.convertType;
                this.editQuery.courseItemList[first].childCourseItemList[
                    second
                ].convertStatus = file.convertStatus;

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
            },
            // 选择demo
            selectDemo(file) {
                const {fileId, qgFileDetail, name, mt, viewUrl, m3u8Url, convertType} = file;
                this.editQuery.demo = {
                    srcId: fileId,
                    srcType: mt,
                    srcName: name,
                    convertType,
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
                    srcUrl: viewUrl,
                    convertStatus: file.convertStatus
                };
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
                    convertType: '',
                    convertStatus: ''
                };
            },
            onSure(files) {
                const file = files[0];
                const list = this.active.split('.');
                const first = list[0];
                const second = list[1];
                // const fileType = getFileType(file.qgFileDetail.fileExt);

                if (this.active === 'demo') {
                    this.selectDemo(file);
                } else {
                    this.selectCourseItem(file, first, second, list);
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
            showFileDialog(parent, self) {
                if (isNaN(parent) || isNaN(self)) {
                    console.log('没有传入父子节点信息');
                    return;
                }
                this.active = `${parent}.${self}`;
                this.fileDialogVisible = true;
            },
            showDemoSelect() {
                this.active = 'demo';
                this.fileDialogVisible = true;
            },
            previewFile(file) {
                const {srcType, viewUrl, fluentUrl, downloadUrl, srcUrl, coverUrl, fileId, srcSize, convertType} = file;
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
            getResourceList(condition) {
                const params = Object.assign({}, this.resourceQuery, condition);
                this.resourceListLoading = true;
                getList(params, params.pageNum, params.pageSize).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.resourceList = result.data.list || [];
                        this.resourceTotal = result.data.total;
                        this.resourceListLoading = false;
                        this.resourceQuery.pageNum = params.pageNum;
                        this.resourceQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            handleSizeChangeResource(v) {
                this.getResourceList({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChangeResource(v) {
                this.getResourceList({
                    pageNum: v
                });
            },
            clear() {
                this.resourceQuery.name = '';
                this.handleCurrentChangeResource(1);
            },
            selectionResourceChange(v) {
                if (v.length) {
                    this.resourceSelectedData = {
                        resourceId: v[0].id,
                        srcId: v[0].srcId,
                        srcType: v[0].type,
                        srcName: v[0].name,
                        srcCreated: v[0].createdAt,
                        srcSize: v[0].srcSize
                    };
                } else {
                    this.resourceSelectedData = {
                        resourceId: '',
                        srcId: '',
                        srcType: '',
                        srcName: '',
                        srcCreated: '',
                        srcSize: ''
                    };
                }
            },
            resourceOpen(index, childIndex) {
                this.resourceSelectedIndex = index;
                this.resourceSelectedChildIndex = childIndex;
                this.resourceDialogVisible = true;
                this.getResourceList({
                    pageNum: 1
                });
            },
            resourceClose() {
                this.resourceDialogVisible = false;
                this.resourceQuery = {
                    includeChildCategory: true,
                    name: '',
                    categoryId: '',
                    pageNum: 1,
                    pageSize: 10
                };
                this.resourceSelectedData = {
                    resourceId: '',
                    srcId: '',
                    srcType: '',
                    srcName: '',
                    srcCreated: '',
                    srcSize: ''
                };
            },
            changeResourceSave() {
                if (this.resourceSelectedData.resourceId) {
                    let temp = this.editQuery.courseItemList[this.resourceSelectedIndex].childCourseItemList[this.resourceSelectedChildIndex];
                    temp = {
                        ...temp,
                        resourceId: this.resourceSelectedData.resourceId,
                        srcId: this.resourceSelectedData.srcId,
                        srcType: this.resourceSelectedData.srcType,
                        srcName: this.resourceSelectedData.srcName,
                        srcCreated: this.resourceSelectedData.srcCreated,
                        srcSize: this.resourceSelectedData.srcSize
                    };
                    this.editQuery.courseItemList[this.resourceSelectedIndex].childCourseItemList.splice(this.resourceSelectedChildIndex, 1, temp);
                    this.resourceDialogVisible = false;
                } else {
                    this.$warnMsg(this.$t('请选择关联资源'));
                }
            },
            formatSeconds(value) {
                const result = parseInt(value);
                const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
                const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
                const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

                let res = '';
                if (h !== '0') {
                    res += `${h}:`;
                }
                if (m !== '0') {
                    res += `${m}:`;
                }
                res += `${s}`;
                return res;
            },
            previewResource(id) {
                getInfo(id)
                    .then(re => {
                        const result = re.data;
                        if (result && result.success) {
                            const data = result.data;
                            this.previewType = data.type;
                            this.previewUrl = data.srcUrl;
                            this.fluentUrl = data.fluentUrl;
                            this.downloadUrl = data.coverUrl || data.srcUrl;
                            this.previewPostre = data.coverUrl;
                            this.previewDialogVisible = true;
                        } else {
                            this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                        }
                    });
            },
            deleteResource(index, childIndex) {
                let temp = this.editQuery.courseItemList[index].childCourseItemList[childIndex];
                temp = {
                    ...temp,
                    resourceId: '',
                    srcId: '',
                    srcType: '',
                    srcName: '',
                    srcCreated: '',
                    srcSize: ''
                };
                this.editQuery.courseItemList[index].childCourseItemList.splice(childIndex, 1, temp);
            }
        }
    };
</script>
