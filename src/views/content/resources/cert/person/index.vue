<style scoped lang="scss">
</style>

<template>
    <article class="app-container cert__person">
        <qgu-drag-row>
            <div slot="left" class="app__row--left">
                <qgu-tree
                    :datalist="treeData"
                    :current-node-key="currentNodeKey"
                    :default-expanded-keys="defaultExpandedKeys"
                    @include-child-change="includeChildChange"
                    @node-click="nodeClick"
                >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span>{{ data.name }}</span>
                    </span>
                </qgu-tree>
            </div>
            <div slot="right" class="app__row--right">
                <section class="person__filter veln__width">
                    <el-form
                        :model="listQuery"
                        :inline="true"
                        class="demo-form-inline unrequired__form"
                    >
                        <el-form-item
                            :label="$t('岗位') + '：'"
                            class="small"
                            style="margin-right: 30px;"
                        >
                            <el-input
                                v-model.trim="listQuery.positionName"
                                :placeholder="$t('岗位')"
                                clearable
                                @focus="showPostSelect"
                                @change="formItemChange"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('状态') + '：'">
                            <el-checkbox-group
                                v-model="listQuery.statusList"
                                @change="formItemChange"
                            >
                                <el-checkbox label="ENABLED">{{ $t('启用') }}</el-checkbox>
                                <el-checkbox label="DISABLED">{{ $t('停用') }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <search-input
                            v-model="listQuery.name"
                            class="pull-right"
                            :placeholder="$t('请输入工号/姓名/用户名/手机')"
                            @enter="search"
                        />
                    </el-form>
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
            </div>
        </qgu-drag-row>
        <el-dialog
            append-to-body
            :title="$t('选择岗位')"
            :visible.sync="dialogVisible"
            width="339px"
            :before-close="handleClose"
        >
            <veln-position-select ref="velnPostSel" :active-id="listQuery.positionId"/>
            <div class="dialog__btn__line">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="onSure">保存</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import VelnPositionSelect from '@/components/VelnPositionSelect';
    import {getOrgTree} from '@/api/org';
    import {certSearchByUser} from '@/api/cert/certInfo';
    import {PERSON_STATUS_ENUM} from '@/enum';
    export default {
        name: 'CertPerson',
        components: {
            QguTree,
            VelnPositionSelect
        },
        data() {
            const tableColumns = [
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 100
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名'),
                    minWidth: 120
                },
                {
                    field: 'orgName',
                    text: this.$t('部门'),
                    minWidth: 150
                },
                {
                    field: 'code',
                    text: this.$t('工号'),
                    minWidth: 110
                },
                {
                    field: 'mobile',
                    text: this.$t('手机号'),
                    minWidth: 110
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位'),
                    minWidth: 100
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return PERSON_STATUS_ENUM.getName(param.row.status);
                    }
                },
                {
                    field: 'orgCnt',
                    text: this.$t('获得证书'),
                    render: (h, param) => {
                        const orgCnt = param.row.orgCnt;
                        if (!orgCnt || orgCnt === 0) {
                            return orgCnt;
                        }
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'text--blue__btn'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'certUser',
                                            query: {
                                                id: param.row.id
                                            }
                                        });
                                    }
                                }
                            },
                            orgCnt
                        );
                    }
                }
            ];
            return {
                tableColumns,
                list: [],
                total: 0,
                treeData: [],
                defaultExpandedKeys: [],
                listLoading: false,
                currentNodeKey: '',
                listQuery: {
                    orgId: '',
                    name: '',
                    statusList: ['ENABLED', 'DISABLED'],
                    positionName: '',
                    positionId: '',
                    pageNum: 1,
                    pageSize: 20
                },
                dialogVisible: false
            };
        },
        mounted() {
            this.getOrgTree();
        },
        methods: {
            // 获取部门树
            getOrgTree() {
                getOrgTree().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.defaultExpandedKeys = [result.data.id];
                        this.treeData = [result.data];
                        this.listQuery.orgId = result.data.id;
                        this.currentNodeKey = result.data.id;
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取部门数据出错'));
                    }
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.statusList = params.statusList.length
                    ? params.statusList.join(',')
                    : '';
                params.positionId =
                    params.positionId === '*' ? '' : params.positionId;
                this.listLoading = true;
                certSearchByUser(params).then(re => {
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
            showPostSelect() {
                this.dialogVisible = true;
            },
            onSure() {
                const select = this.$refs.velnPostSel.getActive();
                if (select.id) {
                    this.listQuery.positionId = select.id;
                    this.listQuery.positionName = select.name;
                    this.getList({
                        pageNum: 1
                    });
                }
                this.dialogVisible = false;
            },
            handleClose() {
                this.dialogVisible = false;
            },
            includeChildChange(includeChild) {
                this.listQuery.includeChild = includeChild;
                this.listQuery.pageNum = 1;

                this.getList();
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
            // 表单变化实时查询分页
            formItemChange() {
                if (!this.listQuery.positionName) {
                    this.listQuery.positionId = '';
                }
                this.getList({
                    pageNum: 1
                });
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            nodeClick(data) {
                this.listQuery.orgId = data.id;
                this.getList({
                    pageNum: 1
                });
            }
        }
    };
</script>
