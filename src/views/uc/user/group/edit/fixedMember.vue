<style>
</style>

<template>
    <div>
        <el-form :model="listQuery" :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input
                    v-model="listQuery.keywords"
                    :placeholder="$t('工号/姓名/用户名')"
                    @keyup.enter.native="search"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">{{ $t('筛选') }}</el-button>
            </el-form-item>
        </el-form>
        <qgu-table
            :columns="tableColumns"
            :data="list"
            :page="listQuery"
            :total="total"
            :loading="listLoading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
    import {groupMemberPage} from '@/api/groupMember';
    import {PERSON_STATUS_ENUM} from '@/enum';
    export default {
        name: 'FixedMember',
        props: {
            groupId: {
                type: String,
                default: ''
            }
        },
        data() {
            const tableColumns = [
                {
                    field: 'code',
                    text: this.$t('工号'),
                    minWidth: 100
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 100
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名'),
                    minWidth: 100
                },
                {
                    field: 'mobile',
                    text: this.$t('手机号码'),
                    minWidth: 120,
                    render: (h, param) => {
                        return param.row.mobile ? param.row.mobile : '--';
                    }
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位'),
                    minWidth: 110,
                    render: (h, param) => {
                        return param.row.positionName
                            ? param.row.positionName
                            : '--';
                    }
                },
                {
                    field: 'orgName',
                    text: this.$t('部门'),
                    minWidth: 150,
                    render: (h, param) => {
                        const row = param.row;
                        if (!row.orgNamePath) {
                            return row.orgName || '--';
                        }
                        return h(
                            'ElTooltip',
                            {
                                props: {
                                    effect: 'dark',
                                    placement: 'right',
                                    content: row.orgNamePath
                                }
                            },
                            [h('span', row.orgName || '--')]
                        );
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 80,
                    render: (h, param) => {
                        const status = param.row.status;
                        return status ? PERSON_STATUS_ENUM[status].name : '--';
                    }
                }
            ];
            return {
                tableColumns,
                listQuery: {
                    keywords: '',
                    groupId: this.groupId,
                    source: 'APPOINT',
                    pageNum: 1,
                    pageSize: 20
                },
                list: [],
                total: 0,
                listLoading: false
            };
        },
        watch: {
            groupId(val) {
                this.listQuery.groupId = val;
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                groupMemberPage(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.list = result.data.list ? result.data.list : [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取动态人员出错'));
                    }
                });
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
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            }
        }
    };
</script>
