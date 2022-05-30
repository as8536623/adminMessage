<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="veln__position__select">
        <aside class="vps--left">
            <qgu-tree
                type="dialog"
                :datalist="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                :default-expand-all="defaultExpandAll"
                @include-child-change="includeChildChange"
                @node-click="nodeClick"
            >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span class="organize__tree__text">{{ data.name }}</span>
                </span>
            </qgu-tree>
        </aside>
        <div class="vps--right">
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
        </div>
    </article>
</template>

<script>
    import {getOrgTree} from '@/api/org';
    import {userPage} from '@/api/user';
    import QguTree from '@/components/QguTree';

    export default {
        name: 'VelnPersonSelect',
        components: {
            QguTree
        },
        props: {
            activeId: {
                type: [String, Number],
                default: ''
            },
            multi: {
                type: Boolean,
                default: false
            }
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    width: 30
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
                    text: this.$t('部门'),
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
                treeData: [],
                userMultiSelection: [],
                defaultExpandedKeys: [],
                defaultExpandAll: true
            };
        },
        created() {
            this.positionCategoryAll();
        },
        methods: {
            includeChildChange(includeChild) {
                this.listQuery.includeChild = includeChild;
                this.listQuery.pageNum = 1;

                this.getList();
            },
            positionCategoryAll() {
                getOrgTree().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [{
                            id: '*',
                            name: '全部',
                            child: [result.data]
                        }];
                        this.defaultExpandedKeys = [result.data.id];
                        this.getList();
                    }
                });
            },
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
            nodeClick(data) {
                this.listQuery.orgId = data.id;
                this.getList({
                    pageNum: 1
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
            getActive() {
                return this.multi ? this.userMultiSelection : this.active;
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
                if (this.multi) {
                    this.userMultiSelection = v;
                    return;
                }
                if (v.length > 1) {
                    this.$refs.table.clearSelection();
                    this.$refs.table.toggleRowSelection(v.pop());
                } else {
                    this.userMultiSelection = v;
                    this.active = v[0];
                }
            }
        }
    };
</script>
