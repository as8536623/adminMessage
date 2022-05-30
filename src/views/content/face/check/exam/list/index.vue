<style lang="scss" src="./style.scss">
</style>
<template>
    <article>
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width exam__container">
            <el-form-item :label="$t('状态') + '：'">
                <el-checkbox-group v-model="listQuery.answerStatuses" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in EXAM_USER_TYPE_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >{{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item class="pull-right">
                <search-input
                    v-model="listQuery.user.keywords"
                    :placeholder="$t('请输入工号/姓名/用户名/手机号')"
                    @enter="search"
                />
            </el-form-item>
        </el-form>
        <!--<section class="opt__line veln__width">
            <el-button @click="exportHandle" type="primary">{{$t('导出')}}</el-button>
        </section>-->
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
    import {EXAM_USER_TYPE_ENUM} from '@/enum';
    import {searchPage} from '@/api/exam/exam/examMonitor';
    import moment from 'moment';

    export default {
        name: 'ExamPersonList',
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'user.code',
                    text: this.$t('工号'),
                    minWidth: 100
                },
                {
                    field: 'user.name',
                    text: this.$t('姓名'),
                    minWidth: 100,
                    render: (h, param) => {
                        const name = param.row.user.name;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'examUserInfo',
                                            query: {id: param.row.userId}
                                        });
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'user.loginName',
                    text: this.$t('用户名'),
                    minWidth: 160
                },
                {
                    field: 'user.mobile',
                    text: this.$t('手机号码'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user.mobile ? param.row.user.mobile : '--';
                    }
                },
                {
                    field: 'user.orgName',
                    text: this.$t('部门'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user.orgName
                            ? param.row.user.orgName
                            : '--';
                    }
                },
                {
                    field: 'user.positionName',
                    text: this.$t('岗位'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user.positionName
                            ? param.row.user.positionName
                            : '--';
                    }
                },
                {
                    field: 'answerStatus',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.answerStatus
                            ? this.EXAM_USER_TYPE_ENUM.getName(param.row.answerStatus)
                            : '--';
                    }
                },
                {
                    field: 'submitTime',
                    text: this.$t('提交时间'),
                    minWidth: 150,
                    render: (h, param) => {
                        const submitTime = param.row.submitTime;
                        return submitTime
                            ? moment(param.row.submitTime).format(
                                'YYYY-MM-DD HH:mm'
                            )
                            : '--';
                    }
                },
                {
                    field: 'score',
                    text: this.$t('分数'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.score
                            ? param.row.score
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 100,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const markExamPaperBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('评卷'),
                                type: 'text',
                                icon: 'mark'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'markExamPaper',
                                        query: {
                                            examId: param.row.examId,
                                            userId: param.row.userId,
                                            relId: this.$route.query.relId
                                        }
                                    });
                                }
                            }
                        });
                        if (param.row.answerStatus === 'SUBMIT_EXAM') {
                            optArr.push(markExamPaperBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                EXAM_USER_TYPE_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    faceId: this.$route.query.relId,
                    exam: {
                        id: this.id
                    },
                    user: {
                        keywords: ''
                    },
                    answerStatuses: [
                        'NO_ANSWER',
                        'ANSWERING',
                        'SUBMIT_EXAM'
                    ],
                    pageNum: 1,
                    pageSize: 20
                }
            };
        },
        watch: {
            id(val) {
                if (val) {
                    this.listQuery.examId = val;
                    this.getList({pageNum: 1});
                }
            }
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
            exportHandle() {
            }
        }
    };
</script>
