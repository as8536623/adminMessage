<style lang="scss" src="./style.scss">
</style>

<template>
    <el-dialog
        append-to-body
        :title="$t('选择校长')"
        :visible.sync="dialogVisible"
        width="620px"
    >
        <div class="master-select">
            <section class="opt__line">
                <search-input
                    v-model="listQuery.name"
                    :placeholder="$t('请输入姓名/用户名/工号')"
                    @enter="search"
                />
            </section>
            <section class="vps__table__wrapper">
                <qgu-table
                    ref="table"
                    class="radio__table"
                    :simple-page="true"
                    :columns="tableColumns"
                    :data="list"
                    :page="listQuery"
                    :total="total"
                    :loading="false"
                    :highlight-current-row="true"
                    @selection-change="userSelectionChange"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </section>
            <div class="text--center master-page">
                <el-button @click="hide">取消</el-button>
                <el-button type="primary" @click="personSelect">保存</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import {userPage} from '@/api/user';

    export default {
        name: 'MasterSelect',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    render: (h, param) => {
                        return `${param.row.name}(${param.row.code})`;
                    }
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名'),
                    minWidth: 40
                },
                {
                    field: 'orgName',
                    text: this.$t('org'),
                    minWidth: 40,
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
                }
            ];
            return {
                tableColumns,
                list: [],
                listQuery: {
                    name: '',
                    orgId: this.activeId,
                    pageSize: 9,
                    pageNum: 1,
                    includeChild: true,
                    statusList: ['ENABLED']
                },
                active: null,
                total: 0,
                userMultiSelection: [],
                dialogVisible: false
            };
        },
        created() {
            this.search();
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.orgId = params.orgId === '*' ? '' : params.orgId;
                params.statusList = params.statusList.length
                    ? params.statusList.join(',')
                    : '';
                userPage(params).then(re => {
                    const result = re.data;
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
            select(item) {
                this.listQuery.orgId = item.id;
                this.active = item;
                this.$emit('select', item);
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
            // 选择 上级
            userSelectionChange(v) {
                if (v.length > 1) {
                    this.$refs.table.clearSelection();
                    this.$refs.table.toggleRowSelection(v.pop());
                } else {
                    this.userMultiSelection = v;
                    this.active = v[0];
                }
            },
            personSelect() {
                this.$emit('on-sure', this.active);
                this.hide();
            },
            show() {
                this.dialogVisible = true;
                this.search();
            },
            hide() {
                this.dialogVisible = false;
            }
        }
    };
</script>
