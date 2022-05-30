<style lang="scss" scoped>
    @import './style';
</style>

<template>
    <article class="app-container container__padding">
        <el-dialog
            v-if="showCategoryDialogVisible"
            :title="$t('选择资源类别')"
            :visible.sync="showCategoryDialogVisible"
            width="339px"
            :modal-append-to-body="false"
            @close="showCategoryDlgClose"
        >
            <section>
                <veln-resource-category-select
                    ref="category"
                    :default-expand-all="defaultExpandAll"
                />
                <div class="dialog__btn__line">
                    <el-button @click="showCategoryDialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="showSaveCategorySelect">确定</el-button>
                </div>
            </section>
        </el-dialog>
        <qgu-drag-row>
            <div slot="left" class="app__row--left">
                <qgu-tree
                    :datalist="treeData"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-expand-all="defaultExpandAll"
                    @include-child-change="includeChildChange"
                    @node-click="nodeClick"
                >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span class="organize__tree__text">{{ data.name }}</span>
                    </span>
                </qgu-tree>
            </div>
            <div slot="right" class="app__row--right">
                <section class="app__row--right__search-box">
                    <section class="opt__line veln__width">
                        <el-button
                            v-if="checkPermission('uploadResource')"
                            type="primary"
                            @click="uploadResourceOpen('')"
                        >{{ $t('上传') }}
                        </el-button>
                        <el-button
                            v-if="checkPermission('exportTopic')"
                            type="primary"
                            @click="importItem(true, 'selceted')"
                        >{{ $t('导入试题') }}
                        </el-button>
                        <el-button
                            v-if="checkPermission('deleteResource')"
                            type="primary"
                            @click="selectedDel"
                        >{{ $t('批量删除') }}
                        </el-button>
<!--                        <el-button-->
<!--                            v-if="checkPermission('editResource')"-->
<!--                            type="primary"-->
<!--                            @click="selectedSync"-->
<!--                        >{{ $t('批量同步') }}-->
<!--                        </el-button>-->
                        <el-button
                            v-if="checkPermission('editResource')"
                            type="primary"
                            @click="saveCategorySelect()"
                        >{{ $t('修改类别') }}
                        </el-button>
                    </section>
                    <div class="search-box__left clearfix">
                        <section class="search-box__left__input-box">
                            <img class="input-box__search-icon" src="../../../../assets/images/search_examine.png">
                            <el-input
                                v-model.trim="listQuery.name"
                                :placeholder="$t('搜索资源名称')"
                                @keyup.enter.native="handleCheckChange"
                            />
                            <span v-show="listQuery.name" class="input-box__clear" @click="clear">
                                <svg-icon icon-class="close_o"/>
                            </span>
                        </section>
                    </div>
                </section>
                <qgu-table
                    :columns="tableColumns"
                    :data="list"
                    :page="listQuery"
                    :total="total"
                    :loading="listLoading"
                    @selection-change="selectionChange"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </qgu-drag-row>
        <el-dialog
            v-if="authDialogVisible"
            ref="uploadQuery"
            append-to-body
            :title="uploadTitle"
            :visible.sync="authDialogVisible"
            width="614px"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            :close-on-press-escape="false"
            @close="uploadResourceClose"
        >
            <section class="upload-main">
                <div class="upload-main__tilte-tab">
                    <el-tabs v-model="uoloadTabActiveName" :before-leave="beforeLeave" @tab-click="handleClick">
                        <el-tab-pane label="基本信息" name="information">
                            <div class="upload-main__content">
                                <el-form
                                    ref="uploadSaveData"
                                    :model="uploadSaveData"
                                    label-width="104px"
                                    :rules="rules"
                                    :inline-message="true"
                                >
                                    <el-form-item
                                        v-if="isSuperAdminFlag"
                                        :label="$t('资源名称') + '：'"
                                        prop="name"
                                    >
                                        <el-input v-model="uploadSaveData.name" type="text"/>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('授课讲师') + '：'"
                                        prop="teacherIdList"
                                    >
                                        <el-tag
                                            v-for="(tag, index) in teacherSelect"
                                            :key="index"
                                            class="course__teacher__tag"
                                            closable
                                            :disable-transitions="false"
                                            @close="handleCloseTeacher(tag)"
                                        >{{ tag.name || tag }}
                                        </el-tag>
                                        <el-button class="course__teacher__btn" @click="showTeacherDlg">{{ $t('选择') }}
                                        </el-button>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('版权证明') + '：'"
                                        prop="copyrightId"
                                    >
                                        <el-tag
                                            v-if="uploadSaveData.copyrightId"
                                            class="course__teacher__tag"
                                            closable
                                            :disable-transitions="false"
                                            @close="handleCloseCopyright(tag)"
                                        >{{ uploadSaveData.copyrightName }}
                                        </el-tag>
                                        <el-button class="course__teacher__btn" @click="showCopyrightDlg">{{ $t('选择') }}
                                        </el-button>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('资源类别') + '：'"
                                        prop="categoryName"
                                    >
                                        <el-input
                                            ref="categoryInput"
                                            v-model.trim="uploadSaveData.categoryName"
                                            :placeholder="$t('请选择资源类别')"
                                            :max-length="32"
                                            clearable
                                            @clear="clearCategory"
                                            @focus="showCategorySelect"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('关联视频') + '：'"
                                        prop="demo"
                                    >
                                        <course-accessory
                                            class="demo__course__accessory"
                                            :course="uploadSaveData.demo"
                                            :can-modify-item="uploadSaveData.canModifyItem"
                                            @upload="showDemoSelect"
                                            @delete="deleteDemo"
                                            @preview="previewFile(uploadSaveData.demo)"
                                            @showQrcode="showQrcode(uploadSaveData.demo)"
                                        />
                                        <span style="color: red">tip: 视频时长需要大于1分钟</span>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('资源封面') + '：'"
                                        class="course__upload__line"
                                        prop="coverUrl"
                                    >
                                        <div class="course__upload__sec" @click="coverUrlShowFileSelect">
                                            <img
                                                v-if="uploadSaveData.coverUrl"
                                                class="course__cover"
                                                :src="uploadSaveData.coverUrl"
                                                :alt="$t('封面')"
                                            >
                                            <svg-icon
                                                v-if="!uploadSaveData.coverUrl"
                                                icon-class="plus"
                                                class-name="course__upload__plus"
                                            />
                                        </div>
                                        <span class="course__upload__tips">{{ $t('图片大小不能超过5M，建议尺寸640*370px') }}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('详情描述') + '：'">
                                        <el-input v-model="uploadSaveData.description" type="textarea"/>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="考试试题" name="questions">
                            <div class="upload-main__content upload-main__content-questions">
                                <section>
                                    <el-button
                                        type="primary"
                                        @click="importItem(false, 'singled')"
                                    >{{ $t('导入试题') }}
                                    </el-button>
                                </section>
                                <section class="course__exam__item">
                                    <qgu-table
                                        :columns="simpleTableColumnsDel"
                                        :data="examList"
                                        :page="examQuery"
                                        :total="examTotal"
                                        :loading="examListLoading"
                                        @size-change="handleSizeChangeExam"
                                        @current-change="handleCurrentChangeExam"
                                    />
                                </section>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </section>
            <div v-if="uoloadTabActiveName!=='questions'" class="dialog__btn__line">
                <el-button @click="uploadResourceClose">取消</el-button>
                <el-button type="primary" @click="uploadSaveHandel">下一步</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择资源类别')"
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
        <el-dialog
            v-if="teacherDialogVisible"
            append-to-body
            :title="$t('选择讲师')"
            :visible.sync="teacherDialogVisible"
            width="700px"
            :before-close="handleTeacherClose"
        >
            <section class="dlg__content">
                <div class="teacher__search">
                    <el-button type="primary" class="pull-left" @click="navTeacherEdit">{{ $t('新增') }}</el-button>
                    <search-input
                        v-model="teacherQuery.name"
                        class="pull-right"
                        :placeholder="$t('讲师姓名/编号')"
                        @enter="searchTeacher"
                    />
                </div>
                <qgu-table
                    ref="userTable"
                    :border="false"
                    :columns="teacherTableColumns"
                    :data="teacherList"
                    :page="teacherQuery"
                    :total="teacherTotal"
                    :loading="teacherListLoading"
                    @selection-change="teacherSelectionChange"
                    @size-change="handleTeacherSizeChange"
                    @current-change="handleTeacherCurrentChange"
                />
            </section>
            <div class="dialog__btn__line">
                <el-button @click="handleTeacherClose">{{ $t('取消') }}</el-button>
                <el-button
                    v-if="checkPermission('addCourse') || checkPermission('updCourse')"
                    type="primary"
                    @click="onTeacherSure"
                >{{ $t('确定') }}
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="copyrightDialogVisible"
            append-to-body
            :title="$t('选择版权')"
            :visible.sync="copyrightDialogVisible"
            width="700px"
            :before-close="handleCopyrightClose"
        >
            <section class="dlg__content">
                <div class="teacher__search">
                    <search-input
                        v-model="copyrightQuery.name"
                        class="pull-right"
                        :placeholder="$t('讲师姓名/编号')"
                        @enter="searchCopyright"
                    />
                </div>
                <qgu-table
                    ref="userTable"
                    :border="false"
                    :columns="copyrightTableColumns"
                    :data="copyrightList"
                    :page="copyrightQuery"
                    :total="copyrightTotal"
                    :loading="copyrightListLoading"
                    @selection-change="copyrightSelectionChange"
                    @size-change="handleCopyrightSizeChange"
                    @current-change="handleCopyrightCurrentChange"
                />
            </section>
            <div class="dialog__btn__line">
                <el-button @click="handleCopyrightClose">{{ $t('取消') }}</el-button>
                <el-button
                    v-if="checkPermission('addCourse') || checkPermission('updCourse')"
                    type="primary"
                    @click="onCopyrightSure"
                >{{ $t('确定') }}
                </el-button>
            </div>
        </el-dialog>
        <veln-file-upload
            ref="velnFileUpload"
            :app-code="examAppCode"
            :title="uploadFileTitle"
            :template-url="templateFileUrl"
            :fun-code="examFunCode"
            @onSure="uploadExamSuccess"
        />
        <el-dialog
            v-if="previewDialogVisible"
            append-to-body
            :title="$t('预览视频')"
            :visible.sync="previewDialogVisible"
            :width="previewType==='video' ? '640px' : '600px'"
        >
            <section class="preview__dlg__container" :data-url="previewUrl">
                <veln-video-player
                    v-if="previewType==='video'"
                    class="preview__video"
                    :list="[{src: previewUrl, definition: '超清', defCode: '720'}]"
                    :poster="previewPostre"
                    :refer-id="referId"
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
                <!--                    <el-button-group v-if="uploadSaveData.standard === 'VIDEO'">-->
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
                <!--                    <el-button-group v-if="uploadSaveData.standard === 'AUDIO'">-->
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
            v-if="coverUrlFileDialogVisible"
            :key="coverUrlFileDialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="coverUrlFileDialogVisible"
            width="890px"
            :before-close="coverUrlHandleFileClose"
            @close="coverUrlFileDialogClose"
        >
            <veln-file-select
                app-code="veln-stu"
                fun-code="STU_COVER"
                :multi-select="false"
                :type-arr="['IMAGE']"
                @on-sure="coverUrlOnSure"
                @on-cancel="coverUrlOnCancel"
            />
        </el-dialog>
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
                @on-sure="onVideoSure"
                @on-cancel="onVideoCancel"
            />
        </el-dialog>

        <el-dialog
            v-if="itemDetailsDialogVisible"
            ref="uploadQuery"
            append-to-body
            title="查看"
            :visible.sync="itemDetailsDialogVisible"
            width="614px"
            @close="itemDetailsClose"
        >
            <section class="upload-main">
                <div class="upload-main__tilte-tab">
                    <el-tabs v-model="itemDetailsTabActiveName">
                        <el-tab-pane label="基本信息" name="information">
                            <div class="upload-main__content upload-main__content-item-details">
                                <el-form
                                    ref="uploadSaveData"
                                    :model="itemDetails"
                                    label-width="104px"
                                    :inline-message="true"
                                >
                                    <el-form-item
                                        :label="$t('资源名称') + '：'"
                                    >
                                        <span>{{ itemDetails.name }}</span>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('讲师') + '：'"
                                    >
                                        <span>{{ itemDetails.teacherName }}</span>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('版权') + '：'"
                                    >
                                        <span>{{ itemDetails.copyrightName }}</span>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('资源类别') + '：'"
                                    >
                                        <span>{{ itemDetails.categoryName }}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('资源封面') + '：'" class="course__upload__line">
                                        <div class="course__upload__sec">
                                            <img
                                                v-if="itemDetails.coverUrl"
                                                class="course__cover"
                                                :src="itemDetails.coverUrl"
                                                :alt="$t('封面')"
                                            >
                                            <svg-icon
                                                v-if="!itemDetails.coverUrl"
                                                icon-class="plus"
                                                class-name="course__upload__plus"
                                            />
                                        </div>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('文件名') + '：'"
                                    >
                                        <span>{{ itemDetails.fileName }}</span>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('视频时长') + '：'"
                                    >
                                        <span>{{ itemDetails.srcSize ? formatSeconds(itemDetails.srcSize) : 0 }}</span>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('创建人') + '：'"
                                    >
                                        <span>{{ itemDetails.createdUserName }}</span>
                                    </el-form-item>
                                    <el-form-item
                                        :label="$t('创建时间') + '：'"
                                    >
                                        <span>{{ itemDetails.createdAt }}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('详情描述') + '：'">
                                        <section v-html="itemDetails.description"/>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="考试试题" name="questions">
                            <div class="upload-main__content">
                                <section class="course__exam__item">
                                    <qgu-table
                                        :columns="simpleTableColumns"
                                        :data="examList"
                                        :page="examQuery"
                                        :total="examTotal"
                                        :loading="examListLoading"
                                        @size-change="handleSizeChangeExam"
                                        @current-change="handleCurrentChangeExam"
                                    />
                                </section>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </section>
            <div class="dialog__btn__line">
                <el-button type="primary" @click="itemDetailsClose">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="uploadErrorVisible"
            append-to-body
            :title="$t('下载错误模板')"
            :visible.sync="uploadErrorVisible"
            width="300px"
        >
            <!--<veln-upload-error :url="errorExerciseUrl" @continue="continueImport"/>-->
            <section class="error__template__link">
                <span class="error__template__label">{{ $t('导入失败') }}，</span>
                <el-link type="primary" @click="downloadErrorExcel">{{ $t('请下载错误文档') }}</el-link>
            </section>
        </el-dialog>
        <el-dialog
            v-if="courseCategoryDialogVisible"
            append-to-body
            :title="$t('选择课程类别')"
            :visible.sync="courseCategoryDialogVisible"
            width="339px"
            @close="courseCategoryDlgClose"
        >
            <veln-course-category-select
                ref="courseCategory"
                :default-expand-all="defaultExpandAll"
            />
            <div class="dialog__btn__line">
                <el-button @click="courseCategoryDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="courseCategorySelect">确定</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import moment from 'moment';
    import {
        getList,
        getInfo,
        add,
        edit,
        batchDelete,
        courseQuestionRel,
        syncToCourse,
        batchSyncToCourse,
        batchChangeCategory
    } from '@/api/courseResource';
    import {getCategory} from '@/api/resourceCategory';
    import VelnResourceCategorySelect from '@/components/VelnResourceCategorySelect';
    import VelnCourseCategorySelect from '@/components/VelnCourseCategorySelect';
    import commonData from '@/mixins/commonData';
    import {getTeacherPage} from '@/api/teacher';
    import checkPermission from '@/utils/permission';
    import {search} from '@/api/teacherCopyright';
    import {TEST_ATTRIBUTE_ENUM, TEST_QUESTION_LEVEL_ENUM, TEST_QUESTION_TYPE_ENUM, TEST_STATUS_ENUM} from '@/enum';
    import VelnFileUpload from '@/components/VelnFileUpload';
    import CourseAccessory from '../courseItem/components/courseAccessory';
    import VelnVideoPlayer from '@/components/VelnVideoPlayer';
    import {getPre} from '@/utils/dev';
    import {getToken} from '@/utils/auth';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import QRCode from 'qrcodejs2';
    import Clipboard from 'clipboard';
    import {importBankItem, searchCourseItem} from '@/api/exam/item/item';
    import {mapGetters} from 'vuex';
    import {isSuperAdmin} from '../../../../api/auth';

    export default {
        name: 'ResourceList',
        components: {
            QguTree,
            VelnResourceCategorySelect,
            VelnFileUpload,
            CourseAccessory,
            VelnVideoPlayer,
            VelnCourseCategorySelect,
            VelnFileSelect
        },
        mixins: [commonData],
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            const tableColumns = [
                {
                    type: 'checkbox',
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
                    minWidth: 200,
                    render: (h, param) => {
                        const name = param.row.name;
                        if (!name) {
                            return '--';
                        }
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        getInfo(param.row.id)
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
                            name
                        );
                    }
                },
                {
                    field: 'categoryName',
                    text: this.$t('资源类别'),
                    width: 110,
                    align: 'center'
                },
                {
                    field: 'teacherName',
                    text: this.$t('讲师'),
                    align: 'center',
                    minWidth: 140,
                    render: (h, param) => {
                        return param.row.teacherName ? param.row.teacherName : '--';
                    }
                },
                {
                    field: 'createdUserName',
                    text: this.$t('创建人'),
                    align: 'center',
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.createdUserName;
                    }
                },
                {
                    field: 'srcSize',
                    text: this.$t('视频时长'),
                    align: 'center',
                    minWidth: 80,
                    render: (h, param) => {
                        const _size = param.row.srcSize ? this.formatSeconds(param.row.srcSize) : 0;
                        return _size;
                    }
                },
                {
                    field: 'createdAt',
                    text: this.$t('创建时间'),
                    align: 'center',
                    minWidth: 120,
                    render: (h, param) => {
                        const createdAt = param.row.createdAt;
                        return createdAt
                            ? moment(param.row.createdAt).format('YYYY-MM-DD')
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 150,
                    render: (h, param) => {
                        const optArr = [];
                        const previewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('查看'),
                                type: 'text',
                                icon: 'view'
                            },
                            on: {
                                click: () => {
                                    if (param.row.id) {
                                        this.examQuery.courseId = param.row.id;
                                        this.getExamPage({pageNum: 1});
                                        getInfo(param.row.id).then(re => {
                                            const result = re.data;
                                            if (result && result.success) {
                                                this.itemDetailsOpen(result.data);
                                            } else {
                                                this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.del(param.row);
                                }
                            }
                        });
                        const syncBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('同步至课程'),
                                type: 'text',
                                icon: 'publish'
                            },
                            on: {
                                click: () => {
                                    this.courseSync(param.row);
                                }
                            }
                        });
                        const reSyncBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('重新同步至课程'),
                                type: 'text',
                                icon: 'sync'
                            },
                            on: {
                                click: () => {
                                    this.courseSync(param.row);
                                }
                            }
                        });
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    if (this.clickFlag) {
                                        this.$warnMsg(this.$t('请勿多次操作！'));
                                        return;
                                    }
                                    this.clickFlag = true;
                                    getInfo(param.row.id).then(re => {
                                        const result = re.data;
                                        this.clickFlag = false;
                                        if (result && result.success) {
                                            const data = result.data;
                                            this.uploadResourceOpen(data);
                                        } else {
                                            this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                                        }
                                    });
                                }
                            }
                        });

                        if (checkPermission('resourceDetail')) {
                            optArr.push(previewBtn);
                        }
                        if (checkPermission('editResource')) {
                            optArr.push(editBtn);
                            if (!param.row.courseId) {
                                optArr.push(syncBtn);
                            } else {
                                optArr.push(reSyncBtn);
                            }
                        }

                        if (checkPermission('deleteResource')) {
                            optArr.push(deleteBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            const simpleTableColumns = [
                {
                    field: 'type',
                    text: this.$t('题型'),
                    minWidth: 120,
                    render: (h, param) => {
                        const type = param.row.type;
                        return type
                            ? this.TEST_QUESTION_TYPE_ENUM.getName(type)
                            : '--';
                    }
                },
                {
                    field: 'level',
                    text: this.$t('难度'),
                    minWidth: 80,
                    render: (h, param) => {
                        const level = param.row.level;
                        return level
                            ? this.TEST_QUESTION_LEVEL_ENUM.getName(level)
                            : '--';
                    }
                },
                {
                    field: 'stemOutline',
                    text: this.$t('试题内容'),
                    minWidth: 260,
                    maxWidth: 360,
                    render: (h, param) => {
                        const stemOutline = param.row.stemOutline;
                        return h('div', {
                                attrs: {
                                    class: 'table__td__ellipsis',
                                    title: stemOutline ? stemOutline.replace(/<\/?p[^>]*>/gi, '') : '--'
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
                }
            ];
            const simpleTableColumnsDel = [
                {
                    field: 'type',
                    text: this.$t('题型'),
                    minWidth: 120,
                    render: (h, param) => {
                        const type = param.row.type;
                        return type
                            ? this.TEST_QUESTION_TYPE_ENUM.getName(type)
                            : '--';
                    }
                },
                {
                    field: 'level',
                    text: this.$t('难度'),
                    minWidth: 80,
                    render: (h, param) => {
                        const level = param.row.level;
                        return level
                            ? this.TEST_QUESTION_LEVEL_ENUM.getName(level)
                            : '--';
                    }
                },
                {
                    field: 'stemOutline',
                    text: this.$t('试题内容'),
                    minWidth: 260,
                    render: (h, param) => {
                        const stemOutline = param.row.stemOutline;
                        return h('div', {
                                attrs: {
                                    class: 'table__td__ellipsis',
                                    title: stemOutline ? stemOutline.replace(/<\/?p[^>]*>/gi, '') : '--'
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
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 80,
                    render: (h, param) => {
                        const optArr = [];
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.delQuestion(param.row);
                                }
                            }
                        });
                        optArr.push(deleteBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            const teacherTableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    text: this.$t('讲师姓名')
                },
                {
                    field: 'code',
                    minWidth: 100,
                    text: this.$t('讲师编号')
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
            const copyrightTableColumns = [
                {
                    type: 'radio'
                },
                {
                    field: 'name',
                    text: this.$t('版权名称')
                },
                {
                    field: 'teacherName',
                    minWidth: 100,
                    text: this.$t('讲师名称')
                },
                {
                    field: 'srcUrl',
                    minWidth: 100,
                    text: this.$t('版权图片'),
                    render: (h, param) => {
                        const {srcUrl} = param.row;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        window.open(srcUrl);
                                    }
                                }
                            },
                            '点击查看'
                        );
                    }
                }
            ];
            return {
                TEST_STATUS_ENUM,
                TEST_QUESTION_TYPE_ENUM,
                TEST_QUESTION_LEVEL_ENUM,
                TEST_ATTRIBUTE_ENUM,
                hasBgk,
                tableColumns,
                simpleTableColumns,
                teacherTableColumns,
                copyrightTableColumns,
                simpleTableColumnsDel,
                funId: '',
                list: [],
                total: 0,
                listQuery: {
                    includeChildCategory: true,
                    name: '',
                    categoryId: '',
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                selectedData: [],
                authDialogVisible: false,
                categoryDialogVisible: false,
                showCategoryDialogVisible: false,
                courseCategoryDialogVisible: false,
                showCourseCategoryDialogVisible: false,
                syncDialogVisible: false,
                syncDialogTitle: '',
                syncDialogCourseId: '',
                uploadTitle: '',
                uoloadTabActiveName: 'information',
                uploadSaveData: {
                    standard: 'VIDEO',
                    id: '',
                    name: '',
                    description: '',
                    categoryId: '',
                    copyrightId: '',
                    copyrightName: '',
                    teacherIdList: [],
                    categoryName: '',
                    coverId: '',
                    coverUrl: '',
                    canModifyItem: true, // 是否可以编辑
                    demo: {
                        srcId: '',
                        srcType: '',
                        srcName: '',
                        srcCreated: '',
                        srcSize: '',
                        viewUrl: ''
                    }
                },
                teacherDialogVisible: false,
                teacherList: [],
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
                copyrightDialogVisible: false,
                copyrightList: [],
                copyrightSelect: [],
                copyrightQuery: {
                    name: '',
                    teacherIdList: [],
                    pageNum: 1,
                    pageSize: 20
                },
                copyrightTotal: 0,
                copyrightListLoading: false,
                copyrightMultiSelection: [],
                examList: [],
                examQuery: {
                    courseId: '',
                    pageNum: 1,
                    pageSize: 5,
                    attribute: 'EXAMEXERCISE'
                },
                categoryIdSelected: '',
                categoryNameSelected: '',
                examTotal: 0,
                examListLoading: false,
                examAppCode: 'veln-stu',
                uploadFileTitle: this.$t('导入试题'),
                templateFileUrl: hasBgk ? `${process.env.BASE_API}/veln-pe/pe/item/downloadItemTemplateXlsxForBgk`
                    : `${process.env.BASE_API}/veln-pe/pe/item/downloadItemTemplateXlsx`,
                errorUrl: '',
                batchImport: false,
                examFunCode: 'COURSE_QUESTION',
                updateUoloadFlag: false,
                rules: {
                    teacherIdList: [
                        {
                            required: true,
                            message: this.$t('请选择授课讲师'),
                            trigger: 'change'
                        }
                    ],
                    categoryName: [
                        {
                            required: true,
                            message: this.$t('请选择资源类别'),
                            trigger: 'change'
                        }
                    ],
                    demo: [
                        {
                            required: true,
                            message: this.$t('请上传关联视频'),
                            trigger: 'change'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入资源名称'),
                            trigger: 'change'
                        }
                    ]
                },
                previewUrl: '',
                referId: '',
                previewType: 'video',
                previewPostre: '',
                courseCategoryId: '',
                resourceId: '',
                previewDialogVisible: false,
                downloadUrl: '',
                fluentUrl: '',
                courseCondition: {
                    courseIds: [],
                    categoryId: ''
                },
                active: '', // 当前上传的附件 标记
                fileDialogVisible: false,
                coverUrlFileDialogVisible: false,
                coverUrlFileDialogKey: null,
                uploadURL: `${process.env.FS_API}/file/upload`, // 上传地址
                typeArr: ['VIDEO'],
                dialogKey: null,
                itemDetails: null, // 查看详情参数
                itemDetailsDialogVisible: false,
                itemDetailsTabActiveName: 'information',
                clickFlag: false,
                uploadErrorVisible: false,
                errorExerciseUrl: '',
                examPageRefresh: false,
                isSuperAdminFlag: false
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            this.getCourseCategoryTree();
            this.getList();
            this.isSuperAdmin();
        },
        methods: {
            checkPermission,
            // 判断管理员
            isSuperAdmin() {
                isSuperAdmin().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.isSuperAdminFlag = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            importBankItem(fileId, type) {
                const params = {
                    fileId: fileId,
                    courseId: this.uploadSaveData.id,
                    bankName: this.batchImport ? '' : this.uploadSaveData.demo.srcName,
                    attributeType: type
                };
                importBankItem(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('导入成功'));
                        if (this.examPageRefresh) {
                            this.getExamPage({pageNum: 1});
                        } else {
                            this.search();
                        }
                    } else if (result.data) {
                        this.errorUrl = `${process.env.FS_API}/file/d/${result.data}?_token=${this.token}`;
                        this.uploadErrorVisible = true;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '导入失败'));
                    }
                });
            },
            // 导入成功后将fileId传递给后台
            uploadExamSuccess(re) {
                if (re.success) {
                    // re.data.fileId
                    this.importBankItem(re.data.fileId, 'EXAMEXERCISE');
                } else {
                    this.$errorMsg(this.$t(re.msg || '导入失败'));
                }
            },
            getCourseCategoryTree() {
                getCategory().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [
                            {
                                id: '',
                                name: '全部',
                                isRoot: true,
                                child: result.data.child
                            }
                        ];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取课程类别出错'));
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.positionCategory = data;
                this.categoryIdSelected = data.id;
                this.categoryNameSelected = data.name;
                this.getList({
                    pageNum: 1
                });
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            // 包含子类修改
            includeChildChange(includeChildCategory) {
                this.listQuery.includeChildCategory = includeChildCategory;
                this.listQuery.pageNum = 1;
                this.getList();
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                getList(params, params.pageNum, params.pageSize).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            refreshImportTitle() {
                const hasBgk = this.$store.getters.hasBgk;
                this.uploadFileTitle = this.batchImport ? this.$t('批量导入试题') : this.$t('导入试题');
                this.templateFileUrl = this.batchImport ? `${process.env.BASE_API}/veln-pe/pe/item/downloadItemTemplateXlsxBatch`
                    : (hasBgk ? `${process.env.BASE_API}/veln-pe/pe/item/downloadItemTemplateXlsxForBgk`
                        : `${process.env.BASE_API}/veln-pe/pe/item/downloadItemTemplateXlsx`);
            },
            selectionChange(v) {
                this.selectedData = v;
            },
            handleSizeChange(v) {
                this.getList({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v
                });
            },
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            },
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    batchDelete(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t(result.msg || '删除成功'));
                            this.handleCheckChange();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            selectedDel() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('此操作将永久删除勾选数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    batchDelete(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t(result.msg || '删除成功'));
                            this.handleCheckChange();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            selectedSync() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('此操作将同步勾选数据至课程,已同步的将覆盖, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }
                    batchSyncToCourse(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('同步成功' + (result.data ? ',课程名称：' + result.data : '')));
                            this.handleCheckChange();
                        } else {
                            this.$errorMsg(this.$t('同步失败!' + result.msg ? result.msg : ''));
                            this.handleCheckChange();
                        }
                    });
                });
            },
            showCategorySelect() {
                this.categoryDialogVisible = true;
                this.$refs.categoryInput.blur();
            },
            saveCategorySelect() {
                this.showCategoryDialogVisible = true;
            },
            clearCategory() {
                this.uploadSaveData.categoryId = '';
            },
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.uploadSaveData.categoryId = result.id;
                this.uploadSaveData.categoryName = result.name;
                this.categoryDialogVisible = false;
            },
            showCategoryDlgClose() {
                this.showCategoryDialogVisible = false;
            },
            showSaveCategorySelect() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.courseCondition.categoryId = result.id;
                this.showCategoryDialogVisible = false;
                this.$confirm(this.$t('确认修改类别吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }
                    this.courseCondition.courseIds = selectedIds;
                    batchChangeCategory(this.courseCondition).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('修改成功成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '隐藏失败'));
                        }
                    });
                });
            },
            courseCategoryDlgClose() {
                this.categoryDialogVisible = false;
            },
            showCourseCategorySelect() {
                this.courseCategoryDialogVisible = true;
            },
            courseCategorySelect() {
                const $category = this.$refs.courseCategory;
                const result = $category.getActive();
                this.courseCategoryDialogVisible = false;
                syncToCourse(this.resourceId,result.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('同步成功,课程名称：' + result.data));
                        this.handleCheckChange();
                    } else {
                        this.$errorMsg(this.$t('同步失败'));
                    }
                });
            },
            showCourseCategoryDlgClose() {
                this.showCategoryDialogVisible = false;
            },
            categoryDlgClose() {
                this.categoryDialogVisible = false;
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
            importItem(batch, type) {
                this.examPageRefresh = type !== 'selceted';
                if (batch) {
                    this.batchImport = !!batch;
                    this.refreshImportTitle();
                }
                this.$refs.velnFileUpload.open();
            },
            uploadResourceOpen(data) {
                this.uploadTitle = '上传资源';
                if (data) {
                    this.examQuery.courseId = data.id;
                    this.uploadSaveData = {
                        standard: 'VIDEO',
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        categoryId: data.categoryId,
                        categoryName: data.categoryName,
                        coverId: data.coverId,
                        coverUrl: data.coverUrl,
                        copyrightId: data.copyrightId,
                        copyrightName: data.copyrightName,
                        teacherIdList: [],
                        demo: {
                            srcId: data.srcId,
                            srcType: data.type,
                            srcName: data.fileName,
                            srcCreated: moment(data.createdAt).format(
                                'YYYY / MM / DD'
                            ),
                            srcSize: data.srcSize,
                            viewUrl: data.srcUrl,
                            convertStatus: data.convertStatus
                        }
                    };
                    this.teacherSelect = [];
                    for (const key in data.teacherNameMap) {
                        this.uploadSaveData.teacherIdList.push(key);
                        this.teacherSelect.push({
                            id: key,
                            name: data.teacherNameMap[key]
                        });
                    }
                    this.previewType = data.type;
                    this.previewUrl = data.srcUrl;
                    this.fluentUrl = data.fluentUrl;
                    this.downloadUrl = data.coverUrl || data.srcUrl;
                    this.previewPostre = data.coverUrl;
                    this.uploadTitle = '编辑';
                } else {
                    this.uploadSaveData = {
                        categoryId: this.categoryIdSelected,
                        categoryName: this.categoryNameSelected,
                        teacherIdList: []
                    };
                }
                this.uoloadTabActiveName = 'information';
                this.authDialogVisible = true;
                this.updateUoloadFlag = true;
            },
            uploadResourceClose() {
                if (this.uploadSaveData.id) {
                    this.handleCheckChange();
                }
                this.clickFlag = false;
                this.uoloadTabActiveName = 'information';
                this.authDialogVisible = false;
                this.updateUoloadFlag = false;
                this.teacherSelect = [];
                this.uploadSaveData = {
                    standard: 'VIDEO',
                    id: '',
                    description: '',
                    categoryId: '',
                    copyrightId: '',
                    copyrightName: '',
                    teacherIdList: [],
                    categoryName: ''
                };
                this.examQuery = {
                    courseId: '',
                    pageNum: 1,
                    pageSize: 5,
                    attribute: 'EXAMEXERCISE'
                };
                this.deleteDemo();
                this.dialogKey = +new Date();
            },
            uploadSaveHandel() {
                this.$refs.uploadSaveData.validate(valid => {
                    if (valid) {
                        if (this.clickFlag) {
                            this.$warnMsg(this.$t('请勿多次操作！'));
                            return;
                        }
                        this.clickFlag = true;
                        const params = {
                            name: this.uploadSaveData.name,
                            description: this.uploadSaveData.description,
                            categoryId: this.uploadSaveData.categoryId,
                            teacherIdList: this.uploadSaveData.teacherIdList,
                            coverId: this.uploadSaveData.coverId,
                            copyrightId: this.uploadSaveData.copyrightId,
                            type: 'video'
                        };
                        params.srcId = this.uploadSaveData.demo.srcId;
                        this.$store.dispatch('setAjaxIng', true);
                        if (!this.uploadSaveData.id) {
                            add(params).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                this.clickFlag = false;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    if (this.uoloadTabActiveName === 'information') {
                                        this.uploadSaveData.id = result.data;
                                        this.examQuery.courseId = result.data;
                                        this.uoloadTabActiveName = 'questions';
                                        this.updateUoloadFlag = false;
                                        this.$nextTick(() => {
                                            this.getExamPage({pageNum: 1});
                                        });
                                    }
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                            return;
                        } else {
                            params.id = this.uploadSaveData.id;
                            edit(params).then(re => {
                                this.clickFlag = false;
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('编辑成功'));
                                    if (this.uoloadTabActiveName === 'information') {
                                        this.updateUoloadFlag = false;
                                        this.uoloadTabActiveName = 'questions';
                                        this.$nextTick(() => {
                                            this.getExamPage({pageNum: 1});
                                        });
                                    }
                                } else {
                                    this.$errorMsg(result.msg || this.$t('编辑失败'));
                                }
                            });
                        }
                    }
                });
            },
            getTeacherList(condition) {
                const params = Object.assign(
                    {'status': 'ENABLED'}, this.teacherQuery, condition);
                this.teacherListLoading = true;
                getTeacherPage(params).then(re => {
                    this.teacherListLoading = false;
                    const result = re.data;
                    if (result.success) {
                        this.teacherList = result.data.list || [];
                        this.teacherTotal = result.data.total;
                        this.teacherQuery.pageNum = params.pageNum;
                        this.teacherQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取讲师数据出错'));
                    }
                });
            },
            teacherSelectionChange(selection) {
                this.teacherMultiSelection = selection;
            },
            handleTeacherSizeChange(v) {
                this.getTeacherList({
                    pageNum: 1,
                    pageSize: v
                });
            },
            handleTeacherCurrentChange(v) {
                this.getTeacherList({
                    pageNum: v
                });
            },
            handleTeacherClose() {
                this.teacherDialogVisible = false;
            },
            handleCopyrightClose() {
                this.copyrightDialogVisible = false;
            },
            getCopyrightList(condition) {
                this.copyrightQuery.teacherIdList = this.uploadSaveData.teacherIdList;
                const params = Object.assign(
                    {'status': 'ENABLED'}, this.copyrightQuery, condition);
                this.copyrightListLoading = true;
                search(params).then(re => {
                    this.copyrightListLoading = false;
                    const result = re.data;
                    if (result.success) {
                        this.copyrightList = result.data.list || [];
                        this.copyrightTotal = result.data.total;
                        this.copyrightQuery.pageNum = params.pageNum;
                        this.copyrightQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取讲师数据出错'));
                    }
                });
            },
            copyrightSelectionChange(selection) {
                this.copyrightMultiSelection = selection;
            },
            handleCopyrightSizeChange(v) {
                this.getCopyrightList({
                    pageNum: 1,
                    pageSize: v
                });
            },
            handleCopyrightCurrentChange(v) {
                this.getCopyrightList({
                    pageNum: v
                });
            },
            onCopyrightSure() {
                this.copyrightMultiSelection.map(copyright => {
                    this.uploadSaveData.copyrightId = copyright.id;
                    this.uploadSaveData.copyrightName = copyright.name;
                });
                this.copyrightDialogVisible = false;
                this.$refs.uploadSaveData.validateField('copyrightIdList');
            },
            onTeacherSure() {
                this.teacherMultiSelection.map(teacher => {
                    if (!this.uploadSaveData.teacherIdList.includes(teacher.id)) {
                        this.uploadSaveData.teacherIdList.push(teacher.id);
                        this.teacherSelect.push(teacher);
                    }
                });
                this.teacherDialogVisible = false;
                this.$refs.uploadSaveData.validateField('teacherIdList');
            },
            handleCloseTeacher(teacher) {
                const index = this.uploadSaveData.teacherIdList.indexOf(teacher.id);
                this.uploadSaveData.teacherIdList.splice(index, 1);

                let idx = -1;
                const list = this.teacherSelect;
                list.map((t, i) => {
                    if (t.id === teacher.id) {
                        idx = i;
                    }
                });

                if (idx > -1) {
                    list.splice(idx, 1);
                    this.teacherSelect = list;
                }
                this.$refs.uploadSaveData.validateField('teacherIdList');
            },

            handleCloseCopyright(copyright) {
                const index = this.uploadSaveData.copyrightIdList.indexOf(copyright.id);
                this.uploadSaveData.copyrightIdList.splice(index, 1);

                let idx = -1;
                const list = this.copyrightSelect;
                list.map((t, i) => {
                    if (t.id === copyright.id) {
                        idx = i;
                    }
                });

                if (idx > -1) {
                    list.splice(idx, 1);
                    this.copyrightSelect = list;
                }
                this.$refs.uploadSaveData.validateField('copyrightIdList');
            },
            // 搜索老师列表
            searchTeacher() {
                this.getTeacherList({pageNum: 1});
            },
            showTeacherDlg() {
                this.teacherDialogVisible = true;
                this.searchTeacher();
            },
            searchCopyright() {
                this.getCopyrightList({pageNum: 1});
            },
            showCopyrightDlg() {
                this.copyrightDialogVisible = true;
                this.searchCopyright();
            },
            getExamPage(condition) {
                const params = Object.assign({}, this.examQuery, condition);
                this.examListLoading = true;
                searchCourseItem(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        if (result.data) {
                            const {list, total} = result.data;
                            this.examList = list || [];
                            this.examTotal = total;
                        } else {
                            this.examList = [];
                            this.examTotal = 0;
                        }
                        this.examListLoading = false;
                        this.examQuery.pageNum = params.pageNum;
                        this.examQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            handleSizeChangeExam(v) {
                this.getExamPage({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChangeExam(v) {
                this.getExamPage({
                    pageNum: v
                });
            },
            handleClick(tab, event) {
                if (this.uoloadTabActiveName === 'questions') {
                    this.updateUoloadFlag = true;
                }
            },
            beforeLeave() {
                const flag = new Promise((resolve, reject) => {
                    if (this.updateUoloadFlag) {
                        this.$errorMsg('请先保存基本信息！');
                    }
                    this.updateUoloadFlag ? reject() : resolve();
                });
                return flag;
            },
            navTeacherEdit() {
                this.teacherDialogVisible = false;
                this.$router.push({name: 'teacherEdit', query: {type: 'COURSE_EDIT'}});
            },
            previewFile(file) {
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
            showDemoSelect() {
                this.active = 'demo';
                this.fileDialogVisible = true;
            },
            // 删除demo
            deleteDemo() {
                this.uploadSaveData.demo = {
                    srcId: '',
                    srcType: '',
                    srcName: '',
                    srcCreated: '',
                    srcSize: '',
                    viewUrl: ''
                };
            },
            onVideoSure(files) {
                const file = files[0];
                // const fileType = getFileType(file.qgFileDetail.fileExt);

                if (this.active === 'demo') {
                    this.selectDemo(file);
                }
                this.fileDialogVisible = false;
                this.formKey = +new Date();
            },
            onVideoCancel() {
                this.fileDialogVisible = false;
            },
            // 选择弹框关闭
            handleFileClose() {
                this.fileDialogVisible = false;
            },
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
            selectDemo(file) {
                // 选择demo
                const {fileId, qgFileDetail, name, mt, viewUrl, m3u8Url, convertType} = file;
                this.uploadSaveData.demo = {
                    srcId: fileId,
                    srcType: mt,
                    srcName: name,
                    convertType,
                    srcCreated: moment(qgFileDetail.createdAt).format(
                        'YYYY / MM / DD'
                    ),
                    srcSize: qgFileDetail.length,
                    viewUrl:
                        this.uploadSaveData.standard === 'VIDEO'
                            ? m3u8Url.split(',')[0]
                            : viewUrl,
                    downloadUrl: viewUrl,
                    fluentUrl:
                        this.uploadSaveData.standard === 'VIDEO'
                            ? m3u8Url.split(',').length > 1
                                ? m3u8Url.split(',')[1]
                                : m3u8Url.split(',')[0]
                            : '',
                    srcUrl: viewUrl,
                    convertStatus: file.convertStatus
                };
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
                    // 释放内存
                    clipboard.destroy();
                });
            },
            download() {
                window.open(this.downloadUrl);
            },
            itemDetailsClose() {
                this.itemDetailsTabActiveName = 'information';
                this.itemDetailsDialogVisible = false;
                this.itemDetails = null;
            },
            itemDetailsOpen(data) {
                this.itemDetailsDialogVisible = true;
                this.itemDetails = data;
            },
            clear() {
                this.listQuery.name = '';
                this.handleCheckChange();
            },
            delQuestion(data) {
                this.$confirm(this.$t('此操作将删除该试题, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = {
                        funId: this.uploadSaveData.id,
                        relIds: []
                    };
                    params.relIds.push(data.id);
                    // 删除试题
                    courseQuestionRel(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t(result.msg || '删除成功'));
                            this.handleCurrentChangeExam(1);
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            courseSync(row) {
                const {id = '', name = '', courseId = ''} = row;
                this.$confirm(this.$t(courseId) ? `"${name}"资源已同步至课程，是否覆盖？`
                    : '确定将该资源同步至课程?', {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'success'
                }).then(() => {
                    this.resourceId = id;
                    this.showCourseCategorySelect();
                });
            },
            coverUrlShowFileSelect() {
                this.coverUrlFileDialogVisible = true;
            },
            coverUrlFileDialogClose() {
                this.coverUrlFileDialogKey = +new Date();
            },
            coverUrlHandleFileClose() {
                this.coverUrlFileDialogVisible = false;
            },
            coverUrlOnSure(files) {
                const fileId = files[0].fileId;
                this.uploadSaveData.coverUrl = files[0].viewUrl;
                this.uploadSaveData.coverId = fileId;
                this.coverUrlFileDialogVisible = false;
            },
            coverUrlOnCancel() {
                this.coverUrlFileDialogVisible = false;
            },
            downloadErrorExcel() {
                window.open(this.errorUrl);
            }
        }
    };
</script>
