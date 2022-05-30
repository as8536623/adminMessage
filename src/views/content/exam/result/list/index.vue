<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="result__container">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width paper-form">
            <el-form-item :label="$t('关键字') + '：'">
                <search-input
                    v-model="listQuery.examName"
                    :placeholder="$t('考试名称/编号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('考试时间') + '：'">
                <el-date-picker
                    v-model="testTime"
                    type="daterange"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleCheckChange"
                />
            </el-form-item>
            <el-form-item :label="$t('类型') + '：'">
                <el-checkbox-group v-model="listQuery.examTypes" @change="handleCheckChange">
                    <el-checkbox
                        v-for="item in EXAM_TYPE_ENUM.arr"
                        :key="item.code"
                        :label="item.code"
                    >{{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
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
            v-if="resultDialogVisible"
            :key="key"
            append-to-body
            :title="currentExam.examName"
            :visible.sync="resultDialogVisible"
            width="1000px"
            custom-class="arrange__dialog"
            @close="handleResultClose"
        >
            <qgu-table
                :columns="resultTableColumns"
                :data="resultList"
                :simple-page="true"
                :have-pagination="false"
                :loading="loading"
            />
        </el-dialog>
    </article>
</template>
<script>
    import {getList} from '@/api/exam/exam/examResult';
    import {EXAM_TYPE_ENUM, EXAMINATION_STATUS_ENUM} from '@/enum';
    import moment from 'moment';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'ResultList',
        data() {
            const tableColumns = [
                {
                    field: 'examCode',
                    text: this.$t('考试编号'),
                    minWidth: 160
                },
                {
                    field: 'examName',
                    text: this.$t('考试名称'),
                    minWidth: 160,
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
                                            name: 'resultDetail',
                                            query: {id: param.row.id}
                                        });
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'createdAt',
                    text: this.$t('考试时间'),
                    minWidth: 260,
                    render: (h, param) => {
                        const examArranges = param.row.examArranges;
                        if (examArranges && examArranges.length > 1) {
                            return h('div', [
                                h('span',
                                  {
                                      attrs: {
                                          class: 'paper__td__total'
                                      }
                                  },
                                  `（${examArranges.length}）`),
                                h('svg-icon',
                                  {
                                      attrs: {
                                          class: 'paper__td__icon',
                                          iconClass: 'down_p'
                                      },
                                      on: {
                                          click: () => {
                                              this.showResult(param.row);
                                          }
                                      }
                                  })
                            ]);
                        } else {
                            const startTime = param.row.startTime;
                            const endTime = param.row.endTime;
                            const time = startTime
                                ? moment(startTime).format(
                                    'YYYY-MM-DD HH:mm'
                                ) : '--';
                            const time2 = endTime
                                ? moment(endTime).format(
                                    'YYYY-MM-DD HH:mm'
                                )
                                : '--';
                            return time + '~' + time2;
                        }
                    }
                },
                {
                    field: 'examType',
                    text: this.$t('类型'),
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.examType
                            ? this.EXAM_TYPE_ENUM.getName(param.row.examType)
                            : '--';
                    }
                },
                {
                    field: 'testCount',
                    text: this.$t('应考'),
                    minWidth: 80
                },
                {
                    field: 'passCount',
                    text: this.$t('通过'),
                    minWidth: 80
                },
                {
                    field: 'noPassCount',
                    text: this.$t('未通过'),
                    minWidth: 80
                },
                {
                    field: 'paperCount',
                    text: this.$t('评卷中'),
                    minWidth: 80
                },
                {
                    field: 'releaseCount',
                    text: this.$t('缺考'),
                    minWidth: 80
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 80,
                    render: (h, param) => {
                        if (param.row.status === 'CANCEL') {
                            return '已作废';
                        } else {
                            if (param.row.markingCount !== 0) {
                                return '评卷中';
                            } else {
                                return '评卷结束';
                            }
                        }
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 100,
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
                                            id: param.row.id,
                                            examName: param.row.examName,
                                            arrangeId: param.row.examArranges[0].id
                                        }
                                    });
                                }
                            }
                        });
                        const analysisBtn = h('QguButton', {
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
                        if (param.row.examArranges && param.row.examArranges.length === 1 &&
                            (param.row.passCount > 0 || param.row.noPassCount > 0) &&
                            this.checkPermission('review')) {
                            optArr.push(scoreBtn);
                        }
                        const time = new Date(param.row.endTime).getTime();
                        const nowTime = new Date().getTime();
                        if (time < nowTime && (param.row.passCount > 0 || param.row.noPassCount > 0) &&
                            this.checkPermission('resultReport')) {
                            optArr.push(analysisBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            const resultTableColumns = [
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
                            ? moment(startTime).format(
                                'YYYY-MM-DD HH:mm'
                            ) : '--';
                        const time2 = endTime
                            ? moment(endTime).format(
                                'YYYY-MM-DD HH:mm'
                            )
                            : '--';
                        return time + '~' + time2;
                    }
                },
                {
                    field: 'testCount',
                    text: this.$t('应考'),
                    minWidth: 80
                },
                {
                    field: 'passCount',
                    text: this.$t('通过'),
                    minWidth: 80
                },
                {
                    field: 'noPassCount',
                    text: this.$t('未通过'),
                    minWidth: 80
                },
                {
                    field: 'markingCount',
                    text: this.$t('评卷中'),
                    minWidth: 80
                },
                {
                    field: 'missCount',
                    text: this.$t('缺考'),
                    minWidth: 80
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
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
                                            examName: param.row.batchName,
                                            arrangeId: param.row.id
                                        }
                                    });
                                }
                            }
                        });
                        if (param.row.passCount > 0 || param.row.noPassCount > 0) {
                            optArr.push(scoreBtn);
                        }
                        return h('div', optArr, '');
                    }
                }

            ];
            return {
                EXAM_TYPE_ENUM,
                EXAMINATION_STATUS_ENUM,
                listQuery: {
                    examName: '',
                    startTime: '',
                    endTime: '',
                    examTypes: ['ONLINE', 'OFFLINE', 'COMPREHENSIVE'],
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                testTime: [],
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                dialogVisible: false,
                resultDialogVisible: false,
                resultList: [],
                resultTableColumns,
                loading: false,
                currentExam: {
                    examName: ''
                },
                key: null
            };
        },
        created() {
            this.getList();
        },
        methods: {
            checkPermission,
            handleClick(tab) {
                this.$router.push({name: tab.name});
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
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.startTime =
                    null !== this.testTime && this.testTime.length
                        ? this.testTime[0] + ':00'
                        : null;
                params.endTime =
                    null !== this.testTime && this.testTime.length
                        ? this.testTime[1] + ':00'
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
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            handleResultClose() {
                this.resultDialogVisible = false;
            },
            // 展示多个批次考试
            showResult(data) {
                this.currentExam = data;
                this.resultList = data.examArranges;
                this.key = +new Date();
                this.resultDialogVisible = true;
            }
        }
    };
</script>
