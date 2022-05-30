<template>
    <div class="app-container project__padding">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="'专题列表'" name="SUBJECT_LIST"/>
            <el-tab-pane :label="'推荐'" name="RECOMMEND_SUBJECT"/>
            <el-tab-pane :label="'免费好课'" name="FREE_GOOD_COURSE"/>
        </el-tabs>
        <qg-search-form
            v-if="activeName ==='SUBJECT_LIST' || activeName ==='RECOMMEND_SUBJECT'"
            :data="searchConfig"
        />
        <el-row class="opt__line">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <course-selector
                ref="resourceSelectorComponent"
                :key="resourceSelectorComponent.key"
                :url="resourceSelectorComponent.url"
                :title="resourceSelectorComponent.title"
                :table-columns="resourceSelectorComponent.tableColumns"
                :show-search="true"
                :enable-exclude-course="false"
                :extra-param="resourceSelectorComponent.extraParam"
                @select="selectTask"
            />
            <el-button type="default" @click="handleBatchDel">批量删除</el-button>
        </el-row>
        <qg-table
            :key="activeName"
            ref="subjectListTable"
            :columns="tableColumns"
            :param="listQuery"
            :request="listRequest"
        />

        <el-dialog
            v-if="dialogSwitch"
            append-to-body
            :title="'排序值'"
            :modal-append-to-body="false"
            :visible.sync="dialogSwitch"
            width="440px"
            :before-close="handleClose"
            :operation-id="operationId"
            custom-class="qrCode__dialog"
        >
            <section class="switch__content">
                <div class="switch__wrapper">
                    <el-input-number v-model="currentShowOrder" controls-position="right" :min="0"/>
                </div>
                <div class="text--center">
                    <el-button type="primary" @click="saveCurrentShowOrder">保存</el-button>
                    <el-button @click="dialogSwitch=false">取消</el-button>
                </div>
            </section>
        </el-dialog>
    </div>
</template>

<script>
    import {SUBJECT_LIST, subjectPage} from '@/api/moudles/stu/subject';
    import {
        RECOMMEND_SUBJECT,
        recommendSubjectBatchAdd,
        recommendSubjectPage
    } from '@/api/moudles/stu/recommend-subject';
    import {subjectSearchConfig, subjectSearchModel, subjectTableColumns} from './subjectCourseConfig.js';
    import {
        recommendSubjectSearchConfig,
        recommendSubjectSearchModel,
        recommendTableColumns,
        subjectSelectorComponentTableColumns
    } from './recommendSubjectConfig.js';
    // import {listFirstLevelCategory} from '@/api/courseCategory';
    import {getFirstLevelCategory} from './operationalCommonConfig';
    import {coursesNewPage, coursesOperationBatchAdd, FREE_GOOD_COURSE} from '@/api/moudles/mall/coursesOperation';
    import {
        courseSelectorTableColumns,
        freeGoodCourseTableColumns,
        ResourceSelectorComponent
    } from './coursesOperationConfig';
    import {NEW_COURSE_ENUM} from '@/enum/common';
    import CourseSelector from '@/components/CourseSelector';
    import {deepClone} from '@/utils';

    const EXTRA_PARAM = {funCode: 'SUBJECT_COURSE', funId: 'FREE_GOOD_COURSE'};
    const freeGoodCoursePageFun = () => coursesNewPage(EXTRA_PARAM);

    /**
     * 专题择组件
     * @type {ResourceSelectorComponent}
     */
    const SubjectSelectorComponent = new ResourceSelectorComponent(subjectSelectorComponentTableColumns, null, `${process.env.STU_API}/recommendSubject/listWaitSelectSubjectList`, '选择专题', 'SubjectSelectorComponent');
    /**
     * 课程选择组件
     * @type {ResourceSelectorComponent}
     */
    const CourseSelectorComponent = new ResourceSelectorComponent(courseSelectorTableColumns, EXTRA_PARAM, `${process.env.STU_API}/stuFeign/listWaitSelectCourses`, '选择课程', EXTRA_PARAM.funCode + EXTRA_PARAM.funId);
    export default {
        name: 'SubjectTable',
        components: {CourseSelector},
        data() {
            return {
                activeName: 'SUBJECT_LIST',
                tableColumns: subjectTableColumns.bind(this)(NEW_COURSE_ENUM),
                listRequest: subjectPage,
                listQuery: deepClone(subjectSearchModel),
                categoryOptionsArray: [],
                searchConfig: {},
                dialogSwitch: false,
                operational: SUBJECT_LIST,
                operationId: '',
                currentShowOrder: 0,
                resourceSelectorComponent: {}
            };
        },
        created() {
            this.searchConfig = subjectSearchConfig.bind(this)();
            this.initSearch();
        },
        methods: {
            handleClick(tab, event) {
                this.loadTable();
                this.handleSearch();
            },
            handleSearch(data) {
                this.$refs.subjectListTable.load(data);
            },
            async initSearch() {
                this.categoryOptionsArray = await getFirstLevelCategory();
                this.searchConfig = subjectSearchConfig.bind(this)();
            },
            loadTable() {
                switch (this.activeName) {
                    case 'SUBJECT_LIST':
                        this.listRequest = subjectPage;
                        this.tableColumns = subjectTableColumns.bind(this)(NEW_COURSE_ENUM);
                        this.searchConfig = subjectSearchConfig.bind(this)();
                        this.listQuery = deepClone(subjectSearchModel);
                        this.operational = SUBJECT_LIST;
                        break;
                    case 'RECOMMEND_SUBJECT':
                        this.listRequest = recommendSubjectPage;
                        this.tableColumns = recommendTableColumns.bind(this)(NEW_COURSE_ENUM);
                        this.searchConfig = recommendSubjectSearchConfig.bind(this)();
                        this.listQuery = deepClone(recommendSubjectSearchModel);
                        this.operational = RECOMMEND_SUBJECT;
                        this.resourceSelectorComponent = SubjectSelectorComponent;
                        break;
                    case 'FREE_GOOD_COURSE':
                        this.listRequest = freeGoodCoursePageFun;
                        this.tableColumns = freeGoodCourseTableColumns.bind(this)(NEW_COURSE_ENUM);
                        // this.searchConfig = subjectSearchConfig.bind(this)();
                        this.operational = FREE_GOOD_COURSE;
                        this.resourceSelectorComponent = CourseSelectorComponent;
                        break;
                    default:
                }
            },
            handleAdd() {
                if (this.activeName === 'RECOMMEND_SUBJECT' || this.activeName === 'FREE_GOOD_COURSE') {
                    this.$refs.resourceSelectorComponent.show();
                } else {
                    this.$router.push({name: `subjectCourseAdd`});
                }
            },
            handleBatchDel() {
                const {ids} = this.$refs.subjectListTable.getSelections();
                if (!ids && ids.length === 0) {
                    this.$message.info('请先选择数据');
                    return;
                }
                this.$confirm('你确定要删除所选数据吗？').then(() => {
                    const request = this.operational.batchDelete(ids);
                    this.operate(request, true);
                }).catch(() => {
                });
            },
            handleOpt(type, params) {
                let request = null;
                const id = params.operationId || params.id;
                switch (type) {
                    case 'view':
                        this.$router.push({name: `subjectDetail`, query: {id: params.id}});
                        return;
                    case 'switchTop':
                        request = this.operational.switchTop(id);
                        this.operate(request, true);
                        return;
                    case 'delete':
                        this.$confirm('你确定要删除该数据吗？').then(() => {
                            request = this.operational.batchDelete([params.id]);
                            this.operate(request, true);
                        }).catch(() => {
                        });
                        return;
                    case 'edit':
                        this.$router.push({path: `subjectEdit`, query: {id: params.id}});
                        return;
                    case 'modifyShowOrder':
                        this.dialogSwitch = true;
                        this.currentShowOrder = params.showOrder;
                        this.operationId = id;
                        return;
                    case 'enable':
                        this.$confirm('你确定要启用该数据吗？').then(() => {
                            request = this.operational.enable(id);
                            this.operate(request, true);
                        }).catch(() => {
                        });
                        return;
                    case 'disable':
                        this.$confirm('你确定要禁用该数据吗？').then(() => {
                            request = this.operational.disable(id);
                            this.operate(request, true);
                        }).catch(() => {
                        });
                        return;
                }
            },
            operate(request, isReloadList) {
                if (!request) {
                    return;
                }
                request.then(res => {
                    this.$message.success('操作成功');
                    if (isReloadList) {
                        this.$refs.subjectListTable.load(this.listQuery);
                    }
                });
            },
            handleClose() {
                this.dialogSwitch = false;
            },
            saveCurrentShowOrder(param) {
                const request = this.operational.modifyShowOrder(this.operationId, this.currentShowOrder);
                this.dialogSwitch = false;
                this.operate(request, true);
            },
            selectTask(selectedCourseObj) {
                const resourceIdList = [];
                selectedCourseObj.forEach(item => {
                    resourceIdList.push(item.relId);
                });
                let request;
                if (this.activeName === 'RECOMMEND_SUBJECT') {
                    request = recommendSubjectBatchAdd(resourceIdList);
                } else if (this.activeName === 'FREE_GOOD_COURSE') {
                    request = coursesOperationBatchAdd(EXTRA_PARAM.funCode, EXTRA_PARAM.funId, resourceIdList);
                }

                this.operate(request, true);
            }
        }
    };
</script>

