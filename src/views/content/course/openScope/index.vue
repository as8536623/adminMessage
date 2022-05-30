<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="course__edit app-container-block">
        <el-form
            ref="editQuery"
            class="course__setting__form"
            :model="editQuery"
            label-width="120px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('其他设置')" :can-expand="false">
                <el-form-item class="course__exam__item" :label="$t('课后练习') + '：   '">
                    <div class="course__exam__btns">
                        <!-- <el-button type="primary" @click="showExamSelect">{{$t('选择试题')}}</el-button> -->
                        <el-button type="primary" @click="showExerciseImport">{{ $t('新增题目') }}</el-button>
                    </div>
                    <qgu-table
                        :columns="tableColumns"
                        :data="exerciseList"
                        :page="exerciseQuery"
                        :total="exerciseTotal"
                        :loading="listExerciseLoading"
                        @size-change="handleExerciseSizeChange"
                        @current-change="handleExerciseCurrentChange"
                    />
                </el-form-item>
                <el-form-item class="course__exam__item" :label="$t('考试试题') + '：   '">
                    <div class="course__exam__btns">
                        <!-- <el-button type="primary" @click="showExamSelect">{{$t('选择试题')}}</el-button> -->
                        <el-button type="primary" @click="showExamImport">{{ $t('新增题目') }}</el-button>
                    </div>
                    <qgu-table
                        :columns="tableColumns"
                        :data="examList"
                        :page="examQuery"
                        :total="examTotal"
                        :loading="listLoading"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </el-form-item>
                <!--                <div>-->
                <!--                    <veln-course-open-scope-->
                <!--                        :business-id="businessId"-->
                <!--                        :fun-code="editQuery.funCode"-->
                <!--                        :scp="editQuery.openScope"-->
                <!--                        :app-code="editQuery.appCode"-->
                <!--                        :route="editQuery.route"-->
                <!--                        :on-sure="onSure"-->
                <!--                    />-->
                <!--                </div>-->
            </veln-form-section>
        </el-form>
        <!-- 选择题库弹框 -->
        <el-dialog
            v-if="examSelectVisible"
            append-to-body
            :title="$t('选择试题')"
            :visible.sync="examSelectVisible"
            width="939px"
            @close="handleExamDlgClose"
        >
            <veln-fixed-question
                :fun-code="examFunCode"
                :app-code="examAppCode"
                route="courseQuestionRel"
                :fun-id="businessId"
                @onClose="handleExamDlgClose"
            />
        </el-dialog>
        <veln-file-upload
            ref="velnFileUpload"
            :app-code="examAppCode"
            :title="uploadTitle"
            :template-url="templateUrl"
            :fun-code="examFunCode"
            @onSure="uploadExamSuccess"
        />
        <!--<el-dialog
            v-if="uploadErrorVisible"
            append-to-body
            :title="$t('下载错误模板')"
            :visible.sync="uploadErrorVisible"
            width="300px"
        >
            <veln-upload-error :url="errorUrl" @continue="continueImport"/>
        </el-dialog>-->

        <el-dialog
            v-if="examExerciseSelectVisible"
            append-to-body
            :title="$t('选择试题')"
            :visible.sync="examExerciseSelectVisible"
            width="939px"
            @close="handleExerciseDlgClose"
        >
            <veln-fixed-question
                :fun-code="examFunCode"
                :app-code="examAppCode"
                route="courseQuestionRel"
                :fun-id="businessId"
                @onClose="handleExerciseDlgClose"
            />
        </el-dialog>
        <veln-file-upload
            ref="velnExerciseFileUpload"
            :app-code="examAppCode"
            :title="uploadTitle"
            :template-url="templateUrl"
            :fun-code="examFunCode"
            @onSure="uploadExerciseSuccess"
        />
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
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnFixedQuestion from '@/components/VelnFixedQuestion';
    import VelnFileUpload from '@/components/VelnFileUpload';
    import VelnUploadError from '@/components/VelnUploadError';

    import {getCourse, openScope} from '@/api/course';
    import {importBankItem, searchCourseItem} from '@/api/exam/item/item';
    import {removeItems, removeItemsForBgk} from '@/api/exam/exam/selectItem';

    import {TEST_ATTRIBUTE_ENUM, TEST_QUESTION_LEVEL_ENUM, TEST_QUESTION_TYPE_ENUM, TEST_STATUS_ENUM} from '@/enum';
    import {mapGetters} from 'vuex';

    export default {
        name: 'CourseItem',
        components: {
            VelnFormSection,
            VelnFixedQuestion,
            VelnFileUpload,
            VelnUploadError
        },
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            const tableColumns = [
                {
                    field: 'type',
                    text: this.$t('题型'),
                    minWidth: 90,
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
                        return h('div', [
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
                    minWidth: 60,
                    fixed: 'right',
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
                                    this.del(param.row);
                                }
                            }
                        });

                        if (!this.needApprove) {
                            optArr.push(deleteBtn);
                        }

                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                hasBgk,
                TEST_STATUS_ENUM,
                TEST_QUESTION_TYPE_ENUM,
                TEST_QUESTION_LEVEL_ENUM,
                TEST_ATTRIBUTE_ENUM,
                tableColumns,
                businessId: this.$route.query.id,
                courseName: '',
                examFunCode: 'COURSE_QUESTION',
                exerciseFunCode: 'COURSE_EXERCISE',
                examAppCode: 'veln-stu',
                needApprove: false,
                editQuery: {
                    roleIds: '',
                    id: this.$route.query.id,
                    openScope: '',
                    appCode: 'veln-stu',
                    route: 'openScope'
                },
                examQuery: {
                    courseId: this.$route.query.id,
                    pageNum: 1,
                    pageSize: 10,
                    attribute: 'EXAMEXERCISE'
                },
                exerciseQuery: {
                    courseId: this.$route.query.id,
                    pageNum: 1,
                    pageSize: 10,
                    attribute: 'EXERCISE'
                },
                deleteQuery: {
                    appCode: 'veln-stu',
                    funCode: 'COURSE_QUESTION',
                    funId: this.$route.query.id,
                    relId: '*',
                    relIds: [],
                    route: 'courseQuestionRel'
                },
                examList: [],
                exerciseList: [],
                examTotal: 0,
                exerciseTotal: 0,
                listLoading: false,
                listExerciseLoading: false,
                examSelectVisible: false,
                examExerciseSelectVisible: false,
                uploadTitle: this.$t('导入试题'),
                templateUrl: hasBgk ? `${process.env.BASE_API}/veln-pe/pe/item/downloadItemTemplateXlsxForBgk`
                    : `${process.env.BASE_API}/veln-pe/pe/item/downloadItemTemplateXlsx`,
                uploadErrorVisible: false,
                errorUrl: '',
                errorExerciseUrl: ''
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            this.getCourse();
            this.getExamPage();
            this.getExercisePage();
        },
        methods: {
            getCourse() {
                getCourse(this.editQuery.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const {openScope, name, needApprove} = result.data;
                        this.editQuery.openScope = openScope;
                        this.courseName = name;
                        this.needApprove = needApprove;
                    }
                });
            },
            cancel() {
                history.go(-1);
            },
            // 完成操作
            onSure(value) {
                if (this.editQuery.id) {
                    this.editQuery.openScope = value;
                    openScope(this.editQuery).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$router.push({name: 'courseManage'});
                            // this.$successMsg(this.$t('保存成功'));
                        } else {
                            this.$errorMsg(result.msg || this.$t('保存失败'));
                        }
                    });
                }
            },
            // 弹框关闭重新获取试题
            handleExamDlgClose() {
                this.examSelectVisible = false;
                this.getExamPage({pageNum: 1});
            },
            // 显示试题选择弹框
            showExamSelect() {
                this.examSelectVisible = true;
            },
            // 弹框关闭重新获取试题
            handleExerciseDlgClose() {
                this.examExerciseSelectVisible = false;
                this.getExercisePage({pageNum: 1});
            },
            // 显示试题选择弹框
            showExerciseSelect() {
                this.examExerciseSelectVisible = true;
            },
            showExamImport() {
                this.$refs.velnFileUpload.open();
            },
            showExerciseImport() {
                this.$refs.velnExerciseFileUpload.open();
            },
            importBankItem(fileId, type) {
                const params = {
                    fileId: fileId,
                    courseId: this.editQuery.id,
                    bankName: this.courseName,
                    attributeType: type
                };
                importBankItem(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('导入成功'));
                        if (type === 'EXERCISE') {
                            this.getExercisePage({pageNum: 1});
                        } else {
                            this.getExamPage({pageNum: 1});
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
            // 导入成功后将fileId传递给后台
            uploadExerciseSuccess(re) {
                if (re.success) {
                    // re.data.fileId
                    this.importBankItem(re.data.fileId, 'EXERCISE');
                } else {
                    this.$errorMsg(this.$t(re.msg || '导入失败'));
                }
            },
            getExamPage(condition) {
                const params = Object.assign({}, this.examQuery, condition);
                this.listLoading = true;
                searchCourseItem(params).then(re => {
                    const result = re.data;
                    if (!result.success) {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    } else if (
                        result.data &&
                        Array.isArray(result.data.list) &&
                        result.data.list.length
                    ) {
                        const {list, total} = result.data;
                        this.examList = list || [];
                        this.examTotal = total;
                        this.listLoading = false;
                        this.examQuery.pageNum = params.pageNum;
                        this.examQuery.pageSize = params.pageSize;
                    } else {
                        this.examList = [];
                        this.examTotal = 0;
                        this.listLoading = false;
                        this.examQuery.pageNum = params.pageNum;
                        this.examQuery.pageSize = params.pageSize;
                    }
                });
            },
            getExercisePage(condition) {
                const params = Object.assign({}, this.exerciseQuery, condition);
                this.listExerciseLoading = true;
                searchCourseItem(params).then(re => {
                    const result = re.data;
                    if (!result.success) {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    } else if (
                        result.data &&
                        Array.isArray(result.data.list) &&
                        result.data.list.length
                    ) {
                        const {list, total} = result.data;
                        this.exerciseList = list || [];
                        this.exerciseTotal = total;
                        this.listExerciseLoading = false;
                        this.exerciseQuery.pageNum = params.pageNum;
                        this.exerciseQuery.pageSize = params.pageSize;
                    } else {
                        this.exerciseList = [];
                        this.exerciseTotal = 0;
                        this.listExerciseLoading = false;
                        this.exerciseQuery.pageNum = params.pageNum;
                        this.exerciseQuery.pageSize = params.pageSize;
                    }
                });
            },
            handleSizeChange(v) {
                this.getExamPage({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleExerciseSizeChange(v) {
                this.getExercisePage({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChange(v) {
                this.getExamPage({
                    pageNum: v
                });
            },
            handleExerciseCurrentChange(v) {
                this.getExercisePage({
                    pageNum: v
                });
            },
            del(item) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(async() => {
                    this.deleteQuery.relIds = [item.id];
                    const method = this.hasBgk ? removeItemsForBgk : removeItems;
                    const re = await method(this.deleteQuery);
                    const {success, msg} = re.data;
                    if (success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.getExamPage({pageNum: 1});
                        this.getExercisePage({
                            pageNum: 1
                        });
                        return;
                    }
                    this.$errorMsg(this.$t(msg || '删除失败'));
                });
            },
            downloadErrorExcel() {
                window.open(this.errorUrl);
            }
        }
    };
</script>
