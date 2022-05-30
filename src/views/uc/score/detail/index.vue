<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding">
        <section class="person__filter veln__width">
            <el-form :model="listQuery" :inline="true" class="demo-form-inline unrequired__form">
                <el-form-item :label="$t('事项') + '：'">
                    <el-checkbox-group v-model="listQuery.moduleCodeList" @change="search">
                        <el-checkbox
                            v-for="(item, index) in moduleList"
                            :key="index"
                            :label="item.key"
                        >{{ $t(item.value) }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('状态') + '：'">
                    <el-checkbox-group v-model="listQuery.type" @change="search">
                        <el-checkbox
                            v-for="(item, index) in SCORE_CHANGE_TYPE_ENUM.arr"
                            :key="index"
                            :label="item.code"
                        >{{ $t(item.name) }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('变动时间') + '：'" class="pull-right">
                    <el-date-picker
                        v-model="time"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        clearable
                        :range-separator="$t('至')"
                        :start-placeholder="$t('开始日期')"
                        :end-placeholder="$t('结束日期')"
                        @change="search"
                    />
                </el-form-item>
            </el-form>
        </section>
        <section class="veln__query__line">
            <el-form :model="listQuery" :inline="true" class="demo-form-inline unrequired__form"/>
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
        />
    </article>
</template>

<script>
/**
 * TODO 筛选条件
 */
    import {getRecordList} from '@/api/score/user';
    import {getListModules} from '@/api/score/rule';
    import {SCORE_CHANGE_TYPE_ENUM} from '@/enum';
    import {mapToArray} from '@/utils';
    export default {
        name: 'ScoreDetail',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'rule.moduleName',
                    text: this.$t('事项'),
                    render: (h, param) => {
                        return param.row.rule ? param.row.rule.moduleName : '--';
                    }
                },
                {
                    field: 'rule.funName',
                    text: this.$t('事项名称'),
                    render: (h, param) => {
                        return param.row.rule ? param.row.rule.funName : '--';
                    }
                },
                {
                    field: 'type',
                    text: this.$t('积分类型'),
                    render: (h, param) => {
                        return SCORE_CHANGE_TYPE_ENUM.getName(param.row.type);
                    }
                },
                {
                    field: 'score',
                    text: this.$t('积分数量')
                },
                {
                    field: 'common',
                    text: this.$t('备注')
                },
                {
                    field: 'createdAt',
                    text: this.$t('变动时间'),
                    width: 160
                }
            ];
            return {
                SCORE_CHANGE_TYPE_ENUM,
                tableColumns,
                total: 0,
                listLoading: false,
                list: [],
                listQuery: {
                    userIds: [],
                    name: '',
                    type: ['ADD', 'MINUS'],
                    moduleCodeList: [],
                    startTime: '',
                    endTime: '',
                    pageNum: 1,
                    pageSize: 20
                },
                moduleList: [],
                time: []
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.listQuery.userIds = [this.$route.query.id];
                this.getListModules();
            }
        },
        methods: {
            getListModules() {
                getListModules().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.moduleList = mapToArray(result.data);
                        this.listQuery.moduleCodeList = Object.keys(result.data);
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取数据失败'));
                    }
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                if (!params.type.length || params.type.length === 2) {
                    params.type = '';
                } else {
                    params.type = params.type[0];
                }
                if (this.time.length) {
                    params.startTime = `${this.time[0]} 00:00:00`;
                    params.endTime = `${this.time[1]} 23:59:59`;
                }
                this.listLoading = true;
                getRecordList(params).then(re => {
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
            selectionChange(v) {
                this.multiSelection = v;
            },
            search() {
                this.getList({pageNum: 1});
            },
            handleSizeChange(v) {
                this.getList({
                    pageNum: 1,
                    pageSize: v
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
