<style lang="scss">
    @import "./style.scss";

    .el-tabs__nav-wrap {
        width: 99%;
    }
</style>

<template>
    <section class="form__section form__section__block">
        <section class="form__section__content">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-if="showUser" :label="$t('已选择人员')" name="openUser">
                    <div class="app__row--right vo__scope--right">
                        <section class="opt__line veln__width">
                            <el-form :model="listQuery" :inline="true" class="demo-form-inline">
                                <section v-if="!readOnly" class="pull-left">
                                    <el-button type="primary" @click="addUser()">{{ $t('新增') }}</el-button>
                                    <el-button @click="batchDel()">{{ $t('移除') }}</el-button>
                                </section>
                                <section class="pull-right">
                                    <el-form-item>
                                        <el-input
                                            v-model.trim="listQuery.keywords"
                                            :maxlength="20"
                                            size="small"
                                            :placeholder="$t('工号/姓名/用户名')"
                                        />
                                    </el-form-item>
                                    <el-button type="primary" @click="getUserList()">{{ $t('筛选') }}</el-button>
                                </section>
                            </el-form>
                        </section>
                        <qgu-table
                            ref="table"
                            :columns="userTableColumns"
                            :data="userList"
                            :page="listQuery"
                            :total="total"
                            :loading="listLoading"
                            :highlight-current-row="true"
                            @selection-change="selectionChange"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                    </div>
                </el-tab-pane>
                <el-tab-pane v-if="showOrg" :label="$t('已选择组织')" name="openOrg">
                    <div class="app__row--right vo__scope--right">
                        <section v-if="!readOnly" class="opt__line veln__width">
                            <el-form :model="listQuery" :inline="true" class="demo-form-inline">
                                <section class="pull-left">
                                    <el-button type="primary" @click="addOrg()">{{ $t('添加') }}</el-button>
                                    <el-button @click="batchDel()">{{ $t('移除') }}</el-button>
                                </section>
                            </el-form>
                        </section>
                        <qgu-table
                            ref="table"
                            :columns="orgTableColumns"
                            :data="orgList"
                            :page="listQuery"
                            :total="total"
                            :loading="listLoading"
                            :highlight-current-row="true"
                            @selection-change="selectionChange"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </section>
        <el-dialog
            :key="userDialogKey"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                opt-type="USER"
                :fun-code="funCode"
                :route="route"
                :app-code="appCode"
                :fun-id="listQuery.funId"
                @onClose="dgpDialogVisible=false"
            />
        </el-dialog>
        <el-dialog
            :key="orgDialogKey"
            append-to-body
            :title="$t('选择组织')"
            :visible.sync="orgDialogVisible"
            width="939px"
            @close="handleOrgClose"
        >
            <veln-dgp-org
                :route="route"
                :app-code="appCode"
                :fun-code="funCode"
                :fun-id="businessId"
                @onClose="orgDialogVisible=false"
            />
        </el-dialog>
    </section>
</template>

<script>
    import i18n from '@/lang';
    import VelnDgpUser from '@/components/VelnDgpUser';
    import VelnDgpOrg from '@/components/VelnDgpOrg';
    import {getUserList, removeUsers} from '@/api/userComponent';
    import {getOrgList, removeOrgs} from '@/api/orgComponent';
    import {ORG_TYPE_ENUM} from '@/enum';

    export default {
        name: 'VelnOrganizationScope',
        components: {
            VelnDgpUser,
            VelnDgpOrg
        },
        props: {
            // 业务id
            businessId: {
                type: String,
                default: ''
            },
            // 业务类型
            funCode: {
                type: String,
                default: ''
            },
            scp: {
                type: String,
                default: i18n.t('PART')
            },
            route: {
                type: String,
                default: ''
            },
            appCode: {
                type: String,
                default: ''
            },
            readOnly: {
                type: Boolean,
                default: false
            },
            showOrg: {
                type: Boolean,
                default: true
            },
            showUser: {
                type: Boolean,
                default: true
            },
            initActiveTab: {
                type: String,
                default: 'openUser'
            }
        },
        data() {
            const userTableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'code',
                    text: this.$t('工号')
                },
                {
                    field: 'name',
                    text: this.$t('姓名')
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名')
                },
                {
                    field: 'orgName',
                    text: this.$t('org'),
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
                    field: 'positionName',
                    text: this.$t('position'),
                    render: (h, param) => {
                        return param.row.positionName ? param.row.positionName : '--';
                    }
                }
            ];
            const orgTableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'relType',
                    text: this.$t('类型'),
                    width: 100,
                    render: (h, param) => {
                        const relType = param.row.relType;
                        return ORG_TYPE_ENUM[relType].name;
                    }
                },
                {
                    field: 'orgName',
                    text: this.$t('名称'),
                    render: (h, param) => {
                        const row = param.row;
                        if (row.orgRelName) {
                            return row.orgRelName;
                        }
                        return row.name;
                    }
                }
            ];
            return {
                userTableColumns,
                orgTableColumns,
                scope: this.scp,
                dialogVisible: false,
                total: 0,
                userList: [],
                orgList: [],
                selectedData: [],
                listQuery: {
                    funId: this.businessId,
                    funCode: this.funCode,
                    relType: 'USER',
                    keywords: '',
                    pageSize: 20,
                    pageNum: 1,
                    appCode: this.appCode,
                    route: this.route
                },
                listLoading: false,
                activeName: this.initActiveTab,
                dgpDialogVisible: false,
                userDialogKey: null,
                orgDialogKey: null,
                orgDialogVisible: false
            };
        },
        watch: {
            scp: {
                handler(val) {
                    this.scope = val;
                },
                immediate: true
            },
            readOnly: {
                handler(val) {
                    if (val) {
                        this.userTableColumns.shift();
                        this.orgTableColumns.shift();
                    }
                },
                immediate: true
            }
        },
        created() {
            if (this.scope === 'PART') {
                this.dialogVisible = true;
                if (this.activeName === 'openUser') {
                    this.getUserList();
                } else {
                    this.listQuery.relType = 'ORG';
                    this.getOrgList();
                }
            } else {
                this.dialogVisible = false;
            }
        },
        methods: {
            search() {
            },
            getUserList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                getUserList(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.userList = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getOrgList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                getOrgList(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.orgList = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            handleClick(tab, event) {
                this.selectedData = [];
                if (tab.name === 'openUser') {
                    this.listQuery.relType = 'USER';
                    this.getUserList({
                        pageNum: 1
                    });
                } else {
                    this.listQuery.relType = 'ORG';
                    this.getOrgList({
                        pageNum: 1
                    });
                }
            },
            selectionChange(v) {
                if (this.listQuery.relType === 'USER') {
                    this.selectedData = v;
                } else {
                    this.selectedData = v;
                }
            },
            handleSizeChange(v) {
                if (this.listQuery.relType === 'USER') {
                    this.getUserList({
                        pageSize: v,
                        pageNum: 1
                    });
                } else {
                    this.getOrgList({
                        pageSize: v,
                        pageNum: 1
                    });
                }
            },
            handleCurrentChange(v) {
                if (this.listQuery.relType === 'USER') {
                    this.getUserList({
                        pageNum: v
                    });
                } else {
                    this.getOrgList({
                        pageNum: v
                    });
                }
            },
            batchDel() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < this.selectedData.length; i++) {
                        if (this.listQuery.relType === 'USER') {
                            selectedIds.push(this.selectedData[i].relId);
                        } else {
                            selectedIds.push(this.selectedData[i].id);
                        }
                    }
                    const params = {
                        appCode: this.appCode,
                        funCode: this.listQuery.funCode,
                        funId: this.listQuery.funId,
                        relType: this.listQuery.relType,
                        relIds: selectedIds,
                        includeChild: true,
                        route: this.route
                    };
                    if (this.listQuery.relType === 'USER') {
                        removeUsers(params).then(re => {
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('删除成功'));
                                this.getUserList({
                                    pageNum: 1
                                });
                            } else {
                                this.$errorMsg(this.$t(result.msg || '删除失败'));
                            }
                        });
                    } else {
                        removeOrgs(params).then(re => {
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('删除成功'));
                                this.getOrgList({
                                    pageNum: 1
                                });
                            } else {
                                this.$errorMsg(this.$t(result.msg || '删除失败'));
                            }
                        });
                    }
                });
            },
            handleUserClose() {
                this.userDialogKey = +new Date();
                this.getUserList({pageNum: 1});
            },
            addUser() {
                this.dgpDialogVisible = true;
            },
            handleOrgClose() {
                this.orgDialogKey = +new Date();
                this.getOrgList({pageNum: 1});
            },
            addOrg() {
                this.orgDialogVisible = true;
            }
        }
    };
</script>
