<style lang="scss" scoped>
    @import 'style.scss';
</style>
<template>
    <article class="app-container monitor-container">
        <div class="monitor__nav">
            <span class="exam__name">{{ exam.examName }}</span>
            <span class="exam__status">[{{ EXAMINATION_STATUS_ENUM.getName(exam.status) }}]</span>
        </div>
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width" label-width="80px">
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
                <el-checkbox-group v-model="listQuery.answerStatuses" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in EXAM_USER_TYPE_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <section v-if="exam.status === 'OVER'" class="opt__line veln__width">
            <el-button type="primary" :disabled="excelInfo && excelInfo.status === 'RUNNING'" @click="preExportExcel">{{ $t('导出监考数据') }}</el-button>
        </section>
        <section v-else class="opt__line veln__width">
            <el-button type="primary" @click="remind">{{ $t('提醒学员') }}</el-button>
            <el-button @click="addUser">{{ $t('添加考生') }}</el-button>
        </section>
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
        <el-dialog
            v-if="dgpDialogVisible"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                route="examUser"
                fun-code="EXAM_USER"
                :app-code="$appCodes.pe + '/pe'"
                :fun-id="listQuery.arrangeId"
                @onClose="handleUserClose"
            />
        </el-dialog>
        <el-dialog
            v-if="violationDialogVisible"
            :key="key"
            append-to-body
            :title="$t('违纪处理')"
            :visible.sync="violationDialogVisible"
            width="600px"
            custom-class="violation__dialog"
            @close="handleViolationClose"
        >
            <el-form :model="editQuery" label-width="100px">
                <el-form-item :label="$t('原因') + '：'">
                    <el-radio-group v-model="editQuery.illegalType">
                        <div>
                            <el-radio label="STATUS">{{ $t('考试状态异常') }}</el-radio>
                        </div>
                        <div>
                            <el-radio label="IDENTITY">{{ $t('考生身份异常') }}</el-radio>
                        </div>
                        <div>
                            <el-radio label="OTHER">{{ $t('其他') }}</el-radio>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('')">
                    <el-input
                        v-model="editQuery.illegalContent"
                        type="textarea"
                        :rows="3"
                        maxlength="200"
                    />
                </el-form-item>
            </el-form>
            <div class="dialog__btn__line">
                <el-button @click="violationDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="remindDialogVisible"
            :key="key"
            append-to-body
            :title="$t('提醒学员')"
            :visible.sync="remindDialogVisible"
            width="500px"
            custom-class="violation__dialog"
            @close="handleRemindClose"
        >
            <el-form :model="remindQuery" label-width="60px">
                <el-form-item :label="$t('') ">
                    <div>{{ $t('确定要发送消息提醒未作答的人参加考试么？') }}</div>
                    <el-checkbox-group v-model="remindQuery.msgInfos">
                        <el-checkbox label="EMAIL_MSG">{{ $t('电子邮件') }}</el-checkbox>
                        <el-checkbox label="INTERNAL_MSG">{{ $t('站内信') }}</el-checkbox>
                        <el-checkbox label="MESSAGE_MSG">{{ $t('手机短信') }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="dialog__btn__line">
                <el-button @click="remindDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="enableRemind">{{ $t('确认') }}</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnOrganizeSelect from '@/components/VelnOrganizeSelect';
    import VelnPositionSelect from '@/components/VelnPositionSelect';
    import VelnDgpUser from '@/components/VelnDgpUser';
    import {noticeArrangeUser, getInfo} from '@/api/exam/exam/exam';
    import {closeExport, getFinalExport} from '@/api/exam/item/exportTask';
    import {
        searchPage,
        saveIllegalRecord,
        forceSubmitExam,
        exportExamMonitor,
        deleteUserPaper
    } from '@/api/exam/exam/examMonitor';
    import {EXAM_USER_TYPE_ENUM, EXAMINATION_STATUS_ENUM} from '@/enum';
    import {mapGetters} from 'vuex';
    export default {
        name: 'MonitorList',
        components: {
            VelnOrganizeSelect,
            VelnPositionSelect,
            VelnDgpUser
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'user.loginName',
                    text: this.$t('用户名'),
                    minWidth: 120
                },
                {
                    field: 'user.name',
                    text: this.$t('姓名'),
                    minWidth: 120
                },
                {
                    field: 'examTime',
                    text: this.$t('进入时间'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.examTime ? param.row.examTime : '--';
                    }
                },
                {
                    field: 'submitTime',
                    text: this.$t('交卷时间'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.submitTime ? param.row.submitTime : '--';
                    }
                },
                {
                    field: 'dur',
                    text: this.$t('答卷时长'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.dur ? param.row.dur : '--';
                    }
                },
                {
                    field: 'exitTimes',
                    text: this.$t('退出'),
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.exitTimes ? param.row.exitTimes : 0;
                    }
                },
                {
                    field: 'cutScreenCount',
                    text: this.$t('切屏'),
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.cutScreenCount
                            ? param.row.cutScreenCount
                            : 0;
                    }
                },
                {
                    field: 'illegalCount',
                    text: this.$t('违纪'),
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.illegalCount ? param.row.illegalCount : 0;
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 120,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const vioBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('违纪处理'),
                                type: 'text',
                                icon: 'violation'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'violation');
                                }
                            }
                        });
                        const forceBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('强制交卷'),
                                type: 'text',
                                icon: 'submit'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'submit');
                                }
                            }
                        });
                        const delBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'del');
                                }
                            }
                        });
                        switch (param.row.answerStatus) {
                            case 'NO_ANSWER': // 未作答
                                break;
                            case 'ANSWERING': // 正在作答
                                optArr.push(delBtn);
                                optArr.push(forceBtn);
                                optArr.push(vioBtn);
                                break;
                            case 'SUBMIT_EXAM': // 交卷
                                optArr.push(delBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                EXAM_USER_TYPE_ENUM,
                EXAMINATION_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    id: '',
                    includeChild: true,
                    examId: this.$route.query.examId,
                    arrangeId: this.$route.query.arrangeId,
                    keywords: '',
                    answerStatuses: ['NO_ANSWER', 'ANSWERING', 'SUBMIT_EXAM'], // 状态
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
                dgpDialogVisible: false,
                violationDialogVisible: false, // 违纪处理
                editQuery: {
                    id: '',
                    illegalType: 'STATUS',
                    illegalContent: '',
                    arrangeId: this.$route.query.examId,
                    examId: this.$route.query.examId,
                    userId: '',
                    monitorId: ''
                },
                key: null,
                excelInfo: null,
                excelMsg: '',
                excelMsgType: 'info',
                excelMsgId: '',
                excelKey: null,
                remindDialogVisible: false, // 提醒学生
                remindQuery: {
                    arrangeId: this.$route.query.arrangeId,
                    userIdList: [],
                    msgInfos: ['EMAIL_MSG', 'INTERNAL_MSG', 'MESSAGE_MSG']
                },
                exam: {}
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            this.getInfo();
            this.getList();
            this.getFinalExport();
        },
        methods: {
            // 编辑回显
            getInfo() {
                getInfo(this.$route.query.examId).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.exam = result.data || {};
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
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
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                searchPage(params).then(re => {
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
                this.search();
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
                this.getList({pageNum: 1});
            },
            clear() {
                this.listQuery.positionId = '';
                this.listQuery.positionName = '';
                this.getList({pageNum: 1});
            },
            handleUserClose() {
                this.getList({pageNum: 1});
                this.dgpDialogVisible = false;
            },
            addUser() {
                this.dgpDialogVisible = true;
            },
            // 操作
            opt(row, type) {
                switch (type) {
                    case 'violation':
                        this.violation(row);
                        break;
                    case 'submit':
                        this.submit(row);
                        break;
                    case 'del':
                        this.del(row);
                        break;
                    case 'view':
                        break;
                }
            },
            // 违纪处理
            violation(data) {
                this.key = +new Date();
                this.editQuery.monitorId = data.id;
                this.violationDialogVisible = true;
                this.editQuery.userId = data.user.id;
            },
            // 违纪处理弹框关闭
            handleViolationClose() {
                this.violationDialogVisible = false;
            },
            // 违纪处理保存
            save() {
                saveIllegalRecord(this.editQuery).then(res => {
                    const result = res.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t(result.msg || '提交成功'));
                        this.search();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据提交异常'));
                    }
                    this.violationDialogVisible = false;
                });
            },
            // 强制提交
            submit(data) {
                this.$confirm(
                    this.$t(
                        '确定要强制提交选中的考生的试卷么？强制提交后，考生则不能继续答题！请谨慎操作！'
                    ),
                    {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning'
                    }
                ).then(() => {
                    const params = {
                        id: data.id,
                        userId: data.user.id
                    };
                    forceSubmitExam(params).then(res => {
                        const result = res.data;
                        if (result && result.success) {
                            this.$successMsg(this.$t(result.msg || '提交成功'));
                            this.search();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '数据提交异常'));
                        }
                        this.violationDialogVisible = false;
                    });
                });
            },
            // 删除
            del(data) {
                this.$confirm(
                    this.$t(
                        '确定要删除考生的答卷么？删除答卷后，考生可以再次进行考试！！'
                    ),
                    {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'error'
                    }
                ).then(() => {
                    const params = {
                        id: data.arrangeId,
                        userId: data.user.id
                    };
                    deleteUserPaper(params).then(res => {
                        const result = res.data;
                        if (result && result.success) {
                            this.$successMsg('删除成功');
                            this.search();
                        } else {
                            this.$errorMsg('数据删除异常');
                        }
                        this.violationDialogVisible = false;
                    });
                });
            },
            // 提醒学员
            remind(data) {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.remindQuery.userIdList = [];
                this.selectedData.map(item => {
                    this.remindQuery.userIdList.push(item.userId);
                });
                this.remindDialogVisible = true;
            },
            enableRemind() {
                noticeArrangeUser(this.remindQuery).then(res => {
                    const result = res.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t('提醒成功'));
                    } else {
                        this.$errorMsg(this.$t(result.msg || '提醒失败'));
                    }
                    this.remindDialogVisible = false;
                });
            },
            handleRemindClose() {
                this.remindDialogVisible = false;
            },
            // 校验能否下载excel
            getFinalExport() {
                const params = {
                    exportType: `MONITOR${this.listQuery.examId}`
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
                                        '监控详情excel正在生成中'
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
                this.excelMsg = this.$t('监控详情excel正在生成中');
                this.excelInfo = {
                    status: 'RUNNING'
                };
                const params = Object.assign({}, this.listQuery, {});
                exportExamMonitor(params).then(re => {
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
