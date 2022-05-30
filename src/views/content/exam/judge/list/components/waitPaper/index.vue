<style lang="scss">
    @import "style";
</style>
<template>
    <article class="wait__paper__container">
        <el-form
            :model="listQuery"
            :inline="true"
            class="demo-form-inline veln__width paper-form"
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
    </article>
</template>
<script>
    import {getWait} from '@/api/exam/exam/judge';
    import moment from 'moment';

    export default {
        name: 'WaitPaper',
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
                    minWidth: 160
                },
                {
                    field: 'createUser',
                    text: this.$t('创建人'),
                    minWidth: 160
                },
                {
                    field: 'createdAt',
                    text: this.$t('考试时间'),
                    minWidth: 260,
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
                    field: 'waitPaperCount',
                    text: this.$t('待评卷数'),
                    minWidth: 80
                },
                {
                    field: 'markedPaperCount',
                    text: this.$t('已评卷数'),
                    minWidth: 80
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
                                toolTip: this.$t('评卷'),
                                type: 'text',
                                icon: 'exam_score'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({name: 'score', query: {id: param.row.id}});
                                }
                            }
                        });
                        optArr.push(scoreBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                listQuery: {
                    examKey: '',
                    startTime: '',
                    endTime: '',
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                testTime: [],
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                dialogVisible: false
            };
        },
        created() {
            this.getList();
        },
        methods: {
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
                getWait(params).then(re => {
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
            }
        }
    };
</script>
