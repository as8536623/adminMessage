<style lang="scss" scoped>
    @import 'style';
</style>
<template>
    <article class="app-container result-detail-container">
        <div class="exam__nav">
            <div class="exam__name">{{ exam.examName }}</div>
            <div class="exam__statistics">
                <span>{{ $t('应考人数'+'：') }}{{ exam.testCount }}</span>
                <span>{{ $t('通过'+'：') }}{{ exam.passCount }}</span>
                <span>{{ $t('未通过'+'：') }}{{ exam.noPassCount }}</span>
                <span v-if="exam.examType !== 'OFFLINE'">{{ $t('缺考'+'：') }}{{ exam.missCount }}</span>
                <span v-if="exam.examType !== 'OFFLINE'">{{ $t('评卷中'+'：') }}{{ exam.markingCount }}</span>
            </div>
        </div>
        <el-form
            :model="listQuery"
            :inline="true"
            class="demo-form-inline veln__width"
            label-width="80px"
        >
            <el-form-item :label="$t('关键字') + '：'">
                <search-input
                    v-model="listQuery.keywords"
                    :placeholder="$t('姓名/用户名/工号/手机号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('部门') + '：'">
                <el-input
                    ref="orgInput"
                    v-model.trim="listQuery.orgName"
                    :placeholder="$t('部门')"
                    :max-length="32"
                    clearable
                    @focus="showOrganizeSelect"
                />
            </el-form-item>
            <el-form-item :label="$t('岗位') + '：'">
                <el-input
                    ref="postInput"
                    v-model.trim="listQuery.positionName"
                    :placeholder="$t('岗位')"
                    :max-length="32"
                    clearable
                    @focus="showPostSelect"
                    @clear="clear"
                />
            </el-form-item>
            <el-form-item :label="$t('状态') + '：'">
                <el-checkbox-group v-model="listQuery.resultStatus" @change="handleCheckChange">
                    <template v-for="(item, index) in RESULT_STATUS_ENUM.arr">
                        <el-checkbox
                            v-if="(item.code !== 'MARKING' && item.code !== 'MISS_EXAM') || ((item.code === 'MARKING' || item.code === 'MISS_EXAM') && exam.examType !== 'OFFLINE')"
                            :key="index"
                            :label="item.code"
                        >{{ item.name }}
                        </el-checkbox>
                    </template>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <section class="opt__line veln__width">
            <el-button
                type="primary"
                :disabled="excelInfo && excelInfo.status === 'RUNNING'"
                @click="preExportExcel"
            >{{ $t('导出') }}
            </el-button>
            <el-button
                v-if="exam.examType === 'OFFLINE'"
                type="primary"
                :disabled="excelInfo && excelInfo.status === 'RUNNING'"
                @click="openUpload"
            >{{ $t('导入考试成绩') }}
            </el-button>
        </section>
        <veln-file-upload
            ref="velnFileUpload"
            app-code="sys"
            title="成绩导入"
            :template-url="templateUrl"
            fun-code="PE_IMPORT_RESULT"
            @onSure="uploadSuccess"
        />
        <el-dialog
            v-if="uploadErrorVisible"
            append-to-body
            :title="$t('下载错误模板')"
            :visible.sync="uploadErrorVisible"
            width="300px"
        >
            <section class="error__template__link">
                <span class="error__template__label">{{ $t('导入失败') }}，</span>
                <el-link type="primary" @click="downloadErrorExcel">{{ $t('请下载错误文档') }}</el-link>
            </section>
        </el-dialog>
        <el-alert
            v-if="excelMsg"
            ref="alert"
            :key="excelKey"
            class="item__excel__info"
            :type="excelMsgType"
            @close="excelMsgClose"
        >
            <div>
                {{ excelMsg }}
                <el-link
                    v-if="excelMsgId"
                    class="person__excel__link"
                    type="primary"
                    @click="exportExcel"
                >下载
                </el-link>
            </div>
        </el-alert>
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
        <el-dialog
            append-to-body
            :title="$t('选择部门')"
            :visible.sync="organizeDialogVisible"
            width="339px"
        >
            <veln-organize-select ref="organize"/>
            <div class="dialog__btn__line">
                <el-button @click="organizeDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="organizeSelect">{{ $t('保存') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog
            append-to-body
            :title="$t('选择岗位')"
            :visible.sync="postDialogVisible"
            width="339px"
        >
            <veln-position-select ref="position" :category="true"/>
            <div class="dialog__btn__line">
                <el-button @click="postDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="postSelect">{{ $t('保存') }}</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnOrganizeSelect from '@/components/VelnOrganizeSelect';
    import VelnPositionSelect from '@/components/VelnPositionSelect';
    import {exportResult, getExamResultDetail, importResult, searchUserDetail} from '@/api/exam/exam/examResult';
    import {closeExport, getFinalExport} from '@/api/exam/item/exportTask';
    import {PERSON_STATUS_ENUM, RESULT_STATUS_ENUM} from '@/enum';
    import VelnFileUpload from '@/components/VelnFileUpload';
    import {mapGetters} from 'vuex';
    import {examScoreFilter} from '@/utils/number';

    export default {
        name: 'ResultList',
        components: {
            VelnOrganizeSelect,
            VelnPositionSelect,
            VelnFileUpload
        },
        data() {
            const tableColumns = [
                {
                    field: 'user.name',
                    text: this.$t('姓名'),
                    minWidth: 100,
                    render: (h, param) => {
                        const name = param.row.user.name;
                        if (param.row.status === 'PASS' || param.row.status === 'NO_PASS') {
                            return h(
                                'span',
                                {
                                    attrs: {
                                        class: 'table__td__link'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: 'examDetail',
                                                query: {id: param.row.id, examId: this.$route.query.id}
                                            });
                                        }
                                    }
                                },
                                name
                            );
                        } else {
                            return name;
                        }
                    }
                },
                {
                    field: 'user.code',
                    text: this.$t('工号'),
                    minWidth: 100
                },
                {
                    field: 'user.orgName',
                    text: this.$t('部门'),
                    minWidth: 160
                },
                {
                    field: 'user.positionName',
                    text: this.$t('岗位'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.user.positionName
                            ? param.row.user.positionName
                            : '--';
                    }
                },
                {
                    field: 'user.status',
                    text: this.$t('人员状态'),
                    align: 'center',
                    width: 80,
                    render: (h, param) => {
                        return param.row.user.status
                            ? this.PERSON_STATUS_ENUM.getName(param.row.user.status)
                            : '--';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    align: 'center',
                    width: 80,
                    render: (h, param) => {
                        const status = param.row.status;
                        if (this.exam.examType === 'OFFLINE' && status === 'MISS_EXAM') {
                            return '--';
                        }
                        return param.row.status
                            ? this.RESULT_STATUS_ENUM.getName(status)
                            : '--';
                    }
                },
                {
                    field: 'score',
                    text: this.$t('成绩'),
                    align: 'center',
                    width: 60,
                    render: (h, param) => {
                        if (param.row.score === -1) {
                            return '--';
                        }
                        return examScoreFilter(param.row.score);
                    }
                },
                {
                    field: 'firstScore',
                    text: this.$t('首次成绩'),
                    align: 'center',
                    width: 80,
                    render: (h, param) => {
                        return examScoreFilter(param.row.firstScore);
                    }
                },
                {
                    field: 'examCount',
                    text: this.$t('补考次数'),
                    align: 'center',
                    width: 80,
                    render: (h, param) => {
                        return param.row.examCount ? (param.row.examCount - 1) : 0;
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    width: 60,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const scoreBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('复评'),
                                type: 'text',
                                icon: 'reappraisal'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'reappraisal',
                                        query: {
                                            id: param.row.examId,
                                            // examName: this.exam.examName,
                                            // arrangeId: param.row.arrangeId,
                                            userId: param.row.userId
                                        }
                                    });
                                }
                            }
                        });
                        if ((
                            param.row.status === 'PASS' ||
                            param.row.status === 'NO_PASS'
                        ) && this.exam.examType !== 'OFFLINE'
                        ) {
                            optArr.push(scoreBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                RESULT_STATUS_ENUM,
                PERSON_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    examId: this.$route.query.id,
                    includeChild: true,
                    keywords: '',
                    resultStatus: ['PASS', 'NO_PASS'], // 状态
                    pageNum: 1,
                    pageSize: 20,
                    orgId: '', // 部门ID
                    orgName: '', // 部门名称
                    positionId: '', // 岗位ID
                    positionName: '' // 岗位名称
                },
                organizeDialogVisible: false, // 部门选择
                postDialogVisible: false, // 岗位选择
                selectedData: [],
                exam: {},
                errorUrl: '',
                excelInfo: null,
                excelMsg: '',
                excelMsgType: 'info',
                excelMsgId: '',
                templateUrl:
                    `${process.env.BASE_API}/${this.$appCodes.pe}/pe/examResult/downloadResultTemplate?examId=` +
                    this.$route.query.id,
                uploadErrorVisible: false,
                excelKey: null
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            this.getExamResultDetail();
            this.getList();
            this.getFinalExport();
        },
        methods: {
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
            // 导入成功
            uploadSuccess(re) {
                if (re.success) {
                    this.checkAddExcel(re.data.fileId);
                } else {
                    this.$errorMsg(this.$t(re.msg || '导入失败'));
                }
            },
            checkAddExcel(fileId) {
                const params = {
                    fileId: fileId,
                    examId: this.$route.query.id
                };
                importResult(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$refs.velnFileUpload.close();
                        this.$successMsg(this.$t(result.msg || '导入成功'));
                        this.search({pageNum: 1});
                    } else if (result.data) {
                        this.errorUrl = `${process.env.FS_API}/file/d/${result.data}?_token=${this.token}`;
                        this.uploadErrorVisible = true;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '导入失败'));
                    }
                });
            },
            downloadErrorExcel() {
                window.open(this.errorUrl);
            },
            openUpload(type) {
                // this.templateUrl = '';
                this.$refs.velnFileUpload.open();
            },
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                searchUserDetail(params).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            // 考试信息
            getExamResultDetail() {
                const params = {examId: this.$route.query.id};
                getExamResultDetail(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.exam = result.data || {};
                        if (this.exam.examType === 'OFFLINE') {
                            this.tableColumns.splice(7, 2);
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            // 选择岗位回调
            organizeSelect() {
                const $organize = this.$refs.organize;
                const result = $organize.getActive();
                if (!result.manage) {
                    this.$warnMsg(this.$t('无权限，请联系系统管理员'));
                    return;
                }
                this.listQuery.orgId = result.id;
                this.listQuery.orgName = result.name;
                this.organizeDialogVisible = false;
                this.getList({
                    pageNum: 1
                });
            },
            // 选择岗位
            showOrganizeSelect() {
                this.organizeDialogVisible = true;
                this.$refs.orgInput.blur();
            },
            // 选择部门
            showPostSelect() {
                this.postDialogVisible = true;
                this.$refs.postInput.blur();
            },
            // 选择部门回调
            postSelect() {
                const $position = this.$refs.position;
                const result = $position.getActive();
                if (result.category) {
                    this.$warnMsg(this.$t('不能选择岗位类别'));
                    return;
                }
                this.listQuery.positionId = result.id;
                this.listQuery.positionName = result.name;
                this.postDialogVisible = false;
                this.getList({
                    pageNum: 1
                });
            },
            clear() {
                this.listQuery.positionId = '';
                this.listQuery.positionName = '';
                this.getList({
                    pageNum: 1
                });
            },
            // 校验能否下载excel
            getFinalExport() {
                const params = {
                    exportType: `RESULT${this.listQuery.examId}`
                };
                getFinalExport(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.excelInfo = result.data;
                        if (result.data && result.data.status === 'FINISHED') {
                            switch (result.data.status) {
                                case 'FINISHED': {
                                    this.excelMsg = this.$t(
                                        `excel 生成日期为${result.data.finishTime}`
                                    );
                                    this.excelMsgId = result.data.id;
                                    break;
                                }
                                case 'RUNNING': {
                                    this.excelMsgType = 'info';
                                    this.excelMsg = this.$t(
                                        '成绩详情excel正在生成中'
                                    );
                                    break;
                                }
                                case 'FAILED': {
                                    this.excelMsgType = 'error';
                                    this.excelMsg = this.$t(`excel 生成失败`);
                                    break;
                                }
                            }
                        }
                    }
                });
            },
            // 预加载excel
            preExportExcel() {
                if (!this.list || this.list.length === 0) {
                    this.$errorMsg('暂无数据');
                    return;
                }
                this.excelMsgType = 'info';
                this.excelMsg = this.$t('考试详情excel正在生成中');
                this.excelInfo = {
                    status: 'RUNNING'
                };
                const params = Object.assign({}, this.listQuery, {});
                exportResult(params).then(re => {
                    const result = re.data;
                    if (result.success && result.data) {
                        this.excelInfo = result.data;
                        if (result.data && result.data.status === 'FINISHED') {
                            this.excelMsgType = 'success';
                            this.excelMsg = this.$t(
                                `excel 生成日期为${result.data.finishTime}`
                            );
                            this.excelMsgId = result.data.id;
                        } else if (result.data && result.data.status === 'FAILED') {
                            this.excelMsgType = 'error';
                            this.excelMsg = this.$t(`excel 生成失败`);
                        }
                        this.excelKey = +new Date();
                    }
                });
            },
            // 导出excel
            exportExcel() {
                const url = `${process.env.FS_API}/file/d/${this.excelInfo.fileId}?_token=${this.token}`;
                window.open(url);
            },
            // 关闭下载提示信息
            excelMsgClose() {
                closeExport(this.excelMsgId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            }
        }
    };
</script>
