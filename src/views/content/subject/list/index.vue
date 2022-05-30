<template>
    <div class="app-container project__padding">
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
            <el-button v-if="false" type="default" @click="handleBatchEnable">发布</el-button>
            <el-button v-if="false" type="default" @click="handleBatchDisable">取消发布</el-button>
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
        recommendSubjectBatchAdd
    } from '@/api/moudles/stu/recommend-subject';
    import {subjectSearchConfig, subjectSearchModel, subjectTableColumns} from './subjectCourseConfig.js';
    import {getFirstLevelCategory} from './operationalCommonConfig';
    import {coursesOperationBatchAdd} from '@/api/moudles/mall/coursesOperation';
    import {NEW_COURSE_ENUM} from '@/enum/common';
    import CourseSelector from '@/components/CourseSelector';
    import {deepClone} from '@/utils';

    const EXTRA_PARAM = {funCode: 'SUBJECT_COURSE', funId: 'FREE_GOOD_COURSE'};
    export default {
        name: 'OnlineSubject',
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
            handleSearch(data) {
                this.$refs.subjectListTable.load(data);
            },
            async initSearch() {
                this.categoryOptionsArray = await getFirstLevelCategory();
                this.searchConfig = subjectSearchConfig.bind(this)();
            },
            loadTable() {
                this.listRequest = subjectPage;
                this.tableColumns = subjectTableColumns.bind(this)(NEW_COURSE_ENUM);
                this.searchConfig = subjectSearchConfig.bind(this)();
                this.listQuery = deepClone(subjectSearchModel);
                this.operational = SUBJECT_LIST;
            },
            handleAdd() {
                this.$router.push({
                    name: `onlineSubjectAdd`,
                    query: {
                        type: 'COMMON'
                    }
                });
            },
            handleBatchDel() {
                const {ids} = this.$refs.subjectListTable.getSelections();
                if (Array.isArray(ids) && !ids.length) {
                    this.$message.info('请先选择专题');
                    return;
                }
                this.$confirm('你确定要删除所选专题吗？').then(() => {
                    const request = this.operational.batchDelete(ids);
                    this.operate(request, true);
                }).catch(() => {
                });
            },
            handleBatchEnable() {
                const {ids} = this.$refs.subjectListTable.getSelections();
                if (Array.isArray(ids) && !ids.length) {
                    this.$message.info('请先选择专题');
                    return;
                }
                this.$confirm('你确定要发布所选专题吗？').then(() => {
                    // const request = this.operational.batchDelete(ids);
                    // this.operate(request, true);
                }).catch(() => {
                });
            },
            handleBatchDisable() {
                const {ids} = this.$refs.subjectListTable.getSelections();
                if (Array.isArray(ids) && !ids.length) {
                    this.$message.info('请先选择数据');
                    return;
                }
                this.$confirm('你确定要取消发布所选专题吗？').then(() => {
                    // const request = this.operational.batchDelete(ids);
                    // this.operate(request, true);
                }).catch(() => {
                });
            },
            handleOpt(type, params) {
                let request = null;
                const id = params.operationId || params.id;
                switch (type) {
                    case 'view':
                        this.$router.push({name: `onlineSubjectDetail`, query: {id: params.id}});
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
                        this.$router.push({name: `onlineSubjectEdit`, query: {id: params.id, type: 'COMMON'}});
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

