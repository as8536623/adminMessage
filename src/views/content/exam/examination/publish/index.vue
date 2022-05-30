<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container publish-container">
        <el-form
            :model="listQuery"
            :inline="true"
            class="demo-form-inline veln__width"
        >
            <div class="publish__info">
                <div class="publish__desc">
                    <div class="publish__name">
                        <!--<span>{{paperInfo.paperType === 'ONLINE' ? this.$t('[线上]') : this.$t('[线下]')}}</span>-->
                        <span>{{ examName }}</span>
                    </div>
                    <el-button v-if="list.length" type="primary" @click="publish">{{ $t('发布成绩') }}</el-button>
                </div>
                <div v-if="list.length" class="publish__tip">
                    {{ $t('共有') }}
                    <span class="publish__active">{{ list.length }}</span>
                    {{ $t('人评卷完成，可以发布成绩') }}
                </div>
                <div v-else class="publish__tip">
                    {{ $t('没有学员成绩可以发布') }}
                </div>
            </div>
            <el-form-item>
                <el-checkbox-group v-model="listQuery.passStatus" @change="handleCheckChange">
                    <el-checkbox :label="true">{{ $t('通过') }}</el-checkbox>
                    <el-checkbox :label="false">{{ $t('未通过') }}</el-checkbox>
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
    </article>
</template>
<script>
    import {waitReleasePage, publishResult} from '@/api/exam/exam/examResult';
    import {getInfo} from '@/api/exam/exam/exam';
    import {examScoreFilter} from '@/utils/number';

    export default {
        name: 'PublishResults',
        data() {
            const tableColumns = [
                {
                    field: 'user.name',
                    text: this.$t('姓名'),
                    minWidth: 100
                },
                {
                    field: 'user.code',
                    text: this.$t('工号'),
                    minWidth: 100
                },
                {
                    field: 'user.orgName',
                    text: this.$t('部门'),
                    minWidth: 100
                },
                {
                    field: 'user.positionName',
                    text: this.$t('岗位')
                },
                {
                    field: 'pass',
                    text: this.$t('状态'),
                    render: (h, param) => {
                        return param.row.pass ? this.$t('通过') : this.$t('未通过');
                    }
                },
                {
                    field: 'score',
                    text: this.$t('成绩'),
                    render: (h, param) => {
                        return examScoreFilter(param.row.score);
                    }
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
                                            id: this.$route.query.id,
                                            userId: param.row.userId,
                                            from: 'publish'
                                        }
                                    });
                                }
                            }
                        });
                        const monitorBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('监考'),
                                type: 'text',
                                icon: 'monitor'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'monitorList', query: {
                                            arrangeId: param.row.arrangeId,
                                            examId: this.$route.query.id
                                        }
                                    });
                                }
                            }
                        });
                        optArr.push(scoreBtn);
                        optArr.push(monitorBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                examId: this.$route.query.id,
                listQuery: {
                    passStatus: [true, false],
                    examIds: [this.$route.query.id],
                    pageNum: 1,
                    pageSize: 10
                },
                examName: ''
            };
        },
        created() {
            this.getInfo();
            this.getList();
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
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                waitReleasePage(params).then(re => {
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
            getInfo() {
                getInfo(this.examId).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.examName = result.data.examName;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            // 发布成绩
            publish() {
                publishResult(this.examId).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.$successMsg(this.$t(result.msg || '发布成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
