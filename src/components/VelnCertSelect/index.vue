<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="veln__position__select">
        <aside class="vps--left">
            <qgu-tree
                type="dialog"
                :datalist="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                @node-click="nodeClick"
            >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span class="organize__tree__text">{{ data.name }}</span>
                </span>
            </qgu-tree>
        </aside>
        <div class="vps--right">
            <section class="opt__line opt__tips">
                <span>{{ $t('没有我想要的证书') }}</span>
                <el-button type="text" class="opt__btn" @click="add">{{ $t('去新建') }}</el-button>
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
                    @selection-change="selectionChange"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </section>
        </div>
    </article>
</template>
<script>
    import QguTree from '@/components/QguTree';
    import {getCertCategoryTree} from '@/api/cert/certCategory';
    import {certPage} from '@/api/cert/certInfo';

    export default {
        name: 'VelnCertSelect',
        components: {
            QguTree
        },
        props: {
            activeId: {
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
                    field: 'code',
                    text: this.$t('证书编号'),
                    minWidth: 120
                },
                {
                    field: 'name',
                    text: this.$t('证书名称'),
                    minWidth: 120
                },
                {
                    field: 'duration',
                    text: this.$t('有效期')
                },
                {
                    field: 'certOrg',
                    text: this.$t('发证机构'),
                    minWidth: 120
                },
                {
                    field: 'userCount',
                    text: this.$t('获得人数')
                }
            ];
            return {
                tableColumns,
                treeData: [],
                funCode: 'cert',
                defaultExpandedKeys: [],
                listQuery: {
                    statusList: ['ENABLED'],
                    includeChild: true,
                    categoryId: null,
                    pageNum: 1,
                    pageSize: 9
                },
                loading: false,
                list: [],
                total: 0,
                selectedData: [],
                active: null
            };
        },
        created() {
            this.getCertCategoryTree();
        },
        methods: {
            getCertCategoryTree() {
                getCertCategoryTree(this.funCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.categoryId = result.data.id;
                        this.defaultExpandedKeys = [result.data.id];
                        this.getList();
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.statusList = params.statusList.length
                    ? params.statusList.join(',')
                    : '';
                this.loading = true;
                certPage(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.loading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                        this.$nextTick(() => {
                            this.setActive();
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            selectionChange(v) {
                if (v.length > 1) {
                    this.$refs.table.clearSelection();
                    this.$refs.table.toggleRowSelection(v.pop());
                } else {
                    this.selectedData = v;
                    this.active = v[0];
                }
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
            getActive() {
                return this.active;
            },
            // 默认选中
            setActive() {
                if (this.activeId) {
                    this.list.map(item => {
                        if (item.id === this.activeId) {
                            this.$refs.table.toggleRowSelection(item);
                        }
                    });
                }
            },
            add() {
                this.$router.push({
                    name: 'certEdit'
                });
            }
        }
    };
</script>
