<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container face-container">
        <el-form
            :model="listQuery"
            :inline="true"
            class="demo-form-inline veln__width"
            label-width="90px"
        >
            <el-form-item :label="$t('关键字') + '：'">
                <search-input
                    v-model="listQuery.examKey"
                    :placeholder="$t('考试名称/编号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('考试时间') + '：'">
                <el-date-picker
                    v-model="examTime"
                    type="daterange"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleCheckChange"
                />
            </el-form-item>
            <el-form-item :label="$t('创建人') + '：'">
                <search-input
                    v-model="listQuery.createUser"
                    :placeholder="$t('姓名/用户名/工号/手机号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('类型') + '：'">
                <el-checkbox-group v-model="listQuery.examTypes" @change="handleCheckChange">
                    <el-checkbox label="ONLINE">{{ $t('线上') }}</el-checkbox>
                    <el-checkbox label="OFFLINE">{{ $t('线下') }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('状态') + '：'">
                <el-checkbox-group v-model="listQuery.examStatus" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in EXAMINATION_STATUS_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >{{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <section v-if="checkPermission('addExam')" class="opt__line veln__width">
            <el-button type="primary" @click="add('ONLINE')">{{ $t('新增线上') }}</el-button>
            <el-button @click="add('OFFLINE')">{{ $t('新增线下') }}</el-button>
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
            @sort-change="handleSortChange"
        />
        <el-dialog
            v-if="copyDialogVisible"
            :key="key"
            append-to-body
            :title="$t('复制考试')"
            :visible.sync="copyDialogVisible"
            width="500px"
            custom-class="violation__dialog"
            @close="handleCopyClose"
        >
            <el-form :model="editQuery" label-width="60px">
                <el-form-item :label="$t('') ">
                    <div>{{ $t('请选择需要复制的考试信息') }}</div>
                    <el-checkbox-group v-model="editQuery.copyFields">
                        <el-checkbox label="PAPER_SETTING">{{ $t('试卷设置') }}</el-checkbox>
                        <el-checkbox label="EXAM_USER">{{ $t('考试人员') }}</el-checkbox>
                        <el-checkbox label="EXAM_SETTING">{{ $t('考试设置') }}</el-checkbox>
                        <el-checkbox label="EXAM_TIME">{{ $t('考试时间') }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="dialog__btn__line">
                <el-button @click="copyDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('确认') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="arrangeDialogVisible"
            :key="arrangeKey"
            append-to-body
            :title="currentExam.examName"
            :visible.sync="arrangeDialogVisible"
            width="1000px"
            custom-class="arrange__dialog"
            @close="handleArrangeClose"
        >
            <qgu-table
                :columns="arrangeTableColumns"
                :data="arrangeList"
                :simple-page="true"
                :have-pagination="false"
                :loading="loading"
            />
        </el-dialog>
    </article>
</template>
<script>
    import {EXAM_TYPE_ENUM, EXAMINATION_STATUS_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';
    import moment from 'moment';
    import {
        cancelExam,
        copyExam,
        deleteHandel,
        disable,
        enable,
        getList
    } from '@/api/exam/exam/exam';

    export default {
        name: 'ExamList',
        data() {
            const tableColumns = [
                // {
                //     type: 'checkbox'
                // },
                {
                    field: 'examCode',
                    text: this.$t('编号'),
                    width: 140
                },
                {
                    field: 'examName',
                    text: this.$t('考试名称'),
                    minWidth: 200,
                    render: (h, param) => {
                        const name = param.row.examName;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'examinationDetail',
                                            query: {id: param.row.id, examType: param.row.examType}
                                        });
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'examType',
                    text: this.$t('类型'),
                    width: 50,
                    render: (h, param) => {
                        return param.row.examType
                            ? this.EXAM_TYPE_ENUM.getName(param.row.examType)
                            : '--';
                    }
                },
                {
                    field: 'createdAt',
                    text: this.$t('考试时间'),
                    minWidth: 260,
                    sortable: 'custom',
                    render: (h, param) => {
                        /* const examArranges = param.row.examArranges;
                            if (examArranges && examArranges.length > 1) {
                                return h('div', [
                                    h(
                                        'span',
                                        {
                                            attrs: {
                                                class: 'paper__td__total'
                                            }
                                        },
                                        `（${examArranges.length}）`
                                    ),
                                    h('svg-icon', {
                                        attrs: {
                                            class: 'paper__td__icon',
                                            iconClass: 'down_p'
                                        },
                                        on: {
                                            click: () => {
                                                this.showArranges(param.row);
                                            }
                                        }
                                    })
                                ]);
                            } else {
                                const startTime = param.row.startTime;
                                const endTime = param.row.endTime;
                                const time = startTime
                                    ? moment(startTime).format('YYYY-MM-DD HH:mm')
                                    : '--';
                                const time2 = endTime
                                    ? moment(endTime).format('YYYY-MM-DD HH:mm')
                                    : '--';
                                return time + '~' + time2;
                            }*/
                        const startTimeStr = !param.row.startTimeStr
                            ? '-'
                            : param.row.startTimeStr;
                        const endTimeStr = !param.row.endTimeStr
                            ? '-'
                            : param.row.endTimeStr;
                        return startTimeStr + '~' + endTimeStr;
                    }
                },
                {
                    field: 'createdUser',
                    text: this.$t('创建人'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.createUser ? param.row.createUser : '--';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    width: 70,
                    render: (h, param) => {
                        return param.row.status
                            ? this.EXAMINATION_STATUS_ENUM.getName(param.row.status)
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    width: 150,
                    render: (h, param) => {
                        const optArr = [];
                        let deleteBtn = h('QguButton', {
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
                        let editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.edit(param.row);
                                }
                            }
                        });
                        let startBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('启用'),
                                type: 'text',
                                icon: 'enable'
                            },
                            on: {
                                click: () => {
                                    this.start(param.row);
                                }
                            }
                        });
                        let monitorBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('监考'),
                                type: 'text',
                                icon: 'monitor'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'monitorList',
                                        query: {
                                            examId: param.row.id,
                                            arrangeId: param.row.examArranges[0].id
                                        }
                                    });
                                }
                            }
                        });
                        let abolishBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('作废'),
                                type: 'text',
                                icon: 'cancel'
                            },
                            on: {
                                click: () => {
                                    this.abolish(param.row);
                                }
                            }
                        });
                        let publishBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('发布'),
                                type: 'text',
                                icon: 'publish'
                            },
                            on: {
                                click: () => {
                                    this.publishScore(param.row);
                                }
                            }
                        });
                        let copyBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('复制'),
                                type: 'text',
                                icon: 'copy'
                            },
                            on: {
                                click: () => {
                                    this.copy(param.row);
                                }
                            }
                        });
                        let judgeBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('评卷'),
                                type: 'text',
                                icon: 'exam_score'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'score',
                                        query: {id: param.row.id}
                                    });
                                }
                            }
                        });
                        const makeUpBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('补考'),
                                type: 'text',
                                icon: 'makeUp'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'makeUpBasic',
                                        query: {markUpId: param.row.id, examType: param.row.examType}
                                    });
                                }
                            }
                        });
                        let scoreBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('成绩'),
                                type: 'text',
                                icon: 'exam_m'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'resultList',
                                        query: {id: param.row.id}
                                    });
                                }
                            }
                        });
                        let analyzeBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('分析'),
                                type: 'text',
                                icon: 'el-icon-data-analysis'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'examAnalyze',
                                        query: {id: param.row.id}
                                    });
                                }
                            }
                        });
                        if (!this.checkPermission('addExam')) {
                            abolishBtn = scoreBtn = judgeBtn = publishBtn = undefined;
                        }
                        if (!this.checkPermission('enableExam')) {
                            startBtn = undefined;
                        }
                        if (!this.checkPermission('copyExam')) {
                            copyBtn = undefined;
                        }
                        if (!this.checkPermission('updExam')) {
                            editBtn = undefined;
                        }
                        if (!this.checkPermission('delExam')) {
                            deleteBtn = undefined;
                        }
                        if (!this.checkPermission('monitorExam')) {
                            monitorBtn = undefined;
                        }
                        if (!this.checkPermission('analyzeExam')) {
                            analyzeBtn = undefined;
                        }
                        const examArranges = param.row.examArranges;
                        const examSetting = param.row.examSetting;
                        if (examSetting && examSetting.judgeSetting.jt === 'AUTO_JUDGE') {
                            judgeBtn = undefined;
                        }
                        if (param.row.examType === 'OFFLINE') {
                            publishBtn = undefined;
                        }

                        const exam = param.row;
                        switch (param.row.status) {
                            case 'DRAFT': // 草稿
                                optArr.push(editBtn);
                                optArr.push(startBtn);
                                optArr.push(deleteBtn);
                                break;
                            case 'NO_START': // 未开始
                                optArr.push(abolishBtn);
                                break;
                            case 'PROCESS': // 进行中
                                if (examArranges && exam.examType !== 'OFFLINE') {
                                    optArr.push(monitorBtn);
                                }

                                if (
                                    examSetting &&
                                    examSetting.scoreSetting.spt === 'MANUAL' &&
                                    !exam.markUpId
                                ) {
                                    optArr.push(publishBtn);
                                }

                                if (param.row.canJudge && exam.examType !== 'OFFLINE' && examSetting &&
                                    examSetting.judgeSetting.jt === 'MANUAL_JUDGE_PAPER') {
                                    optArr.push(judgeBtn);
                                }

                                if (param.row.hasScore || exam.examType === 'OFFLINE') {
                                    optArr.push(scoreBtn);
                                }

                                break;
                            case 'OVER': // 已结束
                                if (examArranges && examArranges.length === 1 || exam.examType !== 'OFFLINE') {
                                    optArr.push(monitorBtn);
                                }

                                if (
                                    examSetting &&
                                    examSetting.scoreSetting.spt === 'MANUAL' &&
                                    !exam.markUpId
                                ) {
                                    optArr.push(publishBtn);
                                }

                                if (param.row.canJudge && exam.examType !== 'OFFLINE' && examSetting &&
                                    examSetting.judgeSetting.jt === 'MANUAL_JUDGE_PAPER') {
                                    optArr.push(judgeBtn);
                                }

                                if (param.row.hasScore || exam.examType === 'OFFLINE') {
                                    optArr.push(scoreBtn);
                                    if (param.row.markingCount === 0 && exam.examType !== 'OFFLINE' && param.row.releaseCount === 0) {
                                        optArr.push(analyzeBtn);
                                    }
                                }
                                if (param.row.needMarkUp) {
                                    optArr.push(makeUpBtn);
                                }
                                break;
                            case 'CANCEL': // 已作废
                                // optArr.push(deleteBtn);
                                break;
                        }
                        optArr.push(copyBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            const arrangeTableColumns = [
                {
                    field: 'batchName',
                    text: this.$t('名称'),
                    minWidth: 160
                },
                {
                    field: 'createdAt',
                    text: this.$t('时间'),
                    minWidth: 240,
                    render: (h, param) => {
                        const startTime = param.row.startTime;
                        const endTime = param.row.endTime;
                        const time = startTime
                            ? moment(startTime).format('YYYY-MM-DD HH:mm')
                            : '--';
                        const time2 = endTime
                            ? moment(endTime).format('YYYY-MM-DD HH:mm')
                            : '--';
                        return time + '~' + time2;
                    }
                },
                {
                    field: 'arrangeStatus',
                    text: this.$t('状态'),
                    render: (h, param) => {
                        return param.row.arrangeStatus
                            ? this.EXAMINATION_STATUS_ENUM.getName(
                                param.row.arrangeStatus
                            )
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const monitorBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('监控'),
                                type: 'text',
                                icon: 'monitor'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'monitorList',
                                        query: {
                                            arrangeId: param.row.id,
                                            examId: param.row.examId
                                        }
                                    });
                                }
                            }
                        });
                        switch (param.row.arrangeStatus) {
                            case 'DRAFT': // 草稿
                                break;
                            case 'NO_START': // 未开始
                                break;
                            case 'PROCESS': // 进行中
                                optArr.push(monitorBtn);
                                break;
                            case 'OVER': // 已结束
                                optArr.push(monitorBtn);
                                break;
                            case 'CANCEL': // 已作废
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                EXAM_TYPE_ENUM,
                EXAMINATION_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    createUser: '',
                    examKey: '', // 名称、编号
                    examStatus: ['DRAFT', 'NO_START', 'PROCESS', 'OVER'], // 状态
                    examTypes: ['ONLINE', 'OFFLINE'],
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc', // 排序
                    startTime: '', // 筛选开始时间
                    endTime: '' // 筛选结束时间
                },
                examTime: [],
                copyDialogVisible: false, // 复制考试
                editQuery: {
                    id: '',
                    copyFields: [
                        'PAPER_SETTING',
                        'EXAM_USER',
                        'EXAM_SETTING',
                        'EXAM_TIME'
                    ]
                },
                key: null,
                currentExam: {},
                arrangeDialogVisible: false,
                arrangeKey: null,
                arrangeTableColumns,
                loading: false,
                arrangeList: [] // 考试批次
            };
        },
        created() {
            this.getList();
        },
        methods: {
            checkPermission,
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
            // 排序
            handleSortChange(column, prop, order) {
                if (this.listQuery.sort === 'desc') {
                    this.listQuery.sort = 'asc';
                } else {
                    this.listQuery.sort = 'desc';
                }
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.statusList = this.listQuery.status
                    ? [this.listQuery.status]
                    : [];
                params.startTime =
                    null !== this.examTime && this.examTime.length
                        ? this.examTime[0]
                        : null;
                params.endTime =
                    null !== this.examTime && this.examTime.length
                        ? this.examTime[1]
                        : null;
                this.listLoading = true;
                getList(params).then(re => {
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
            add(examType) {
                this.$router.push({name: 'examBasic', query: {examType}});
            },
            edit(data) {
                // 补考编辑
                if (data.markUpId) {
                    this.$router.push({
                        name: 'makeUpBasic',
                        query: {id: data.id, examType: data.examType}
                    });
                    return;
                }
                this.$router.push({
                    name: 'examBasic',
                    query: {id: data.id, examType: data.examType}
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
                    this.deleteOpt(params);
                });
            },
            deleteOpt(params) {
                deleteHandel(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            },
            publishScore(data) {
                this.$router.push({
                    name: 'publishResults',
                    query: {id: data.id}
                });
            },
            disable(data) {
                this.$confirm(this.$t('确认停用该数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    disable(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('停用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '停用失败'));
                        }
                    });
                });
            },
            start(data) {
                const params = [];
                params.push(data.id);
                enable(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            // 作废
            abolish(data) {
                this.$confirm(
                    this.$t(
                        '确定作废该场考试么？作废后，考试不可以恢复，请谨慎操作！'
                    ),
                    {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'error'
                    }
                ).then(() => {
                    cancelExam(data.id).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('作废成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '作废失败'));
                        }
                    });
                });
            },
            // 复制考试
            copy(data) {
                this.copyDialogVisible = true;
                this.editQuery.id = data.id;
                this.key = +new Date();
            },
            handleCopyClose() {
                this.copyDialogVisible = false;
            },
            sure() {
                copyExam(this.editQuery).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('复制成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '复制失败'));
                    }
                });
                this.copyDialogVisible = false;
            },
            // 展示多个批次考试
            showArranges(data) {
                this.currentExam = data;
                this.arrangeList = data.examArranges;
                this.arrangeKey = +new Date();
                this.arrangeDialogVisible = true;
            },
            handleArrangeClose() {
                this.arrangeDialogVisible = false;
            }
        }
    };
</script>
