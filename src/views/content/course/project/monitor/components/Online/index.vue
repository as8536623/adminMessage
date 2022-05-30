<style lang="scss" scoped>
    @import "../../style.scss";
</style>

<template>
    <article class="app-container">
        <task-stage :id="id" :task-type="taskType" @checked="switchStage"/>
        <section class="opt__line veln__width">
            <task-info
                v-if="stageData"
                :task-type="taskType"
                :stage-data="stageData"
            />
            <search-input
                v-model="listQuery.keyword"
                class="pull-right"
                :placeholder="$t('请输入工号/姓名/用户名/手机')"
                @enter="search"
            />
        </section>
        <qgu-table
            :columns="tableColumns"
            :data="list"
            :page="listQuery"
            :total="total"
            :loading="listLoading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </article>
</template>

<script>
    import TaskStage from '../TaskStage';
    import TaskInfo from '../TaskInfo';
    import {commonTableColumns} from '../../data';
    import {
        getOnlineList
    } from '@/api/course/project/monitor';

    export default {
        name: 'OnlineCourse',
        components: {
            TaskStage,
            TaskInfo
        },
        props: {
            id: {
                type: String,
                default: ''
            },
            taskType: {
                type: String,
                default: ''
            }
        },
        data() {
            const tableColumns = [
                {
                    field: 'percent',
                    text: this.$t('学习进度') + '（%）',
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.percent;
                    }
                }
            ];
            return {
                listQuery: {
                    proId: this.id,
                    stageOrder: '',
                    relId: '',
                    keyword: '',
                    pageNum: 1,
                    pageSize: 20
                },
                tableColumns: commonTableColumns(this).concat(tableColumns),
                list: [],
                total: 0,
                listLoading: false,
                stageData: null
            };
        },
        methods: {
            switchStage(data) {
                const {stageOrder, relId} = data;
                this.stageData = data || null;
                Object.assign(this.listQuery, {stageOrder, relId});
                this.search();
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                getOnlineList(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
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
            }
        }
    };
</script>
