<style lang="scss" scoped>
@import './style';
</style>
<style>
.form__section__block .el-tabs__nav-scroll {
    padding-left: 0 !important;
}
</style>

<template>
    <section class="form__section form__section__block">
        <el-form-item v-show="!hasBgk" :label="$t('开放范围') + '：'">
            <el-row v-for="item in options" :key="item.value">
                <el-radio
                    v-model="scope"
                    :disabled="type==='detail'"
                    :label="item.value"
                    @change="sure()"
                >{{ item.label }}</el-radio>
            </el-row>
            <section class="form__section__content">
                <el-tabs v-if="dialogVisible" v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="$t('已开放人员')" name="openUser">
                        <div class="app__row--right">
                            <section v-if="type!=='detail'" class="opt__line veln__width">
                                <el-form :model="listQuery" :inline="true" class="demo-form-inline">
                                    <section class="pull-left">
                                        <el-button type="primary" @click="addUser()">{{ $t('新增') }}</el-button>
                                        <el-button @click="batchDel()">{{ $t('移除') }}</el-button>
                                    </section>
                                    <section class="pull-right">
                                        <el-form-item :label="$t('工号/姓名/用户名') + '：'">
                                            <el-input
                                                v-model="listQuery.keywords"
                                                :maxlength="20"
                                                size="small"
                                                :placeholder="$t('工号/姓名/用户名')"
                                            />
                                        </el-form-item>
                                        <el-button
                                            type="primary"
                                            @click="getUserList()"
                                        >{{ $t('筛选') }}</el-button>
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
                    <el-tab-pane :label="$t('已开放组织')" name="openOrg">
                        <div class="app__row--right">
                            <section v-if="type!=='detail'" class="opt__line veln__width">
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
        </el-form-item>
        <section v-if="type!=='detail'" class="open__scope__btn">
            <el-button type="primary" @click="complete">{{ $t('完成') }}</el-button>
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
                :route="route"
                :app-code="appCode"
                fun-code="stu-course"
                :fun-id="listQuery.funId"
                @onClose="dgpDialogVisible=false;"
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
                app-code="veln-stu"
                route="openScope"
                fun-code="stu-course"
                :fun-id="businessId"
                @onClose="orgDialogVisible=false;"
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
        name: 'VelnOpenScope',
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
            optType: {
                type: String,
                default: 'USER'
            },
            onSure: {
                type: Function,
                default() {
                    return () => {};
                }
            },
            scp: {
                type: String,
                default: i18n.t('ALL')
            },
            route: {
                type: String,
                default: ''
            },
            appCode: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
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
                    text: this.$t('部门'),
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
                    text: this.$t('岗位')
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
            const hasBgk = this.$store.getters.hasBgk;
            return {
                hasBgk, // 北国会
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
                    funCode: 'stu-course',
                    relType: 'USER',
                    appCode: this.appCode,
                    route: this.route,
                    orgId: '',
                    keywords: '',
                    pageSize: 20,
                    pageNum: 1
                },
                listLoading: false,
                activeName: 'openUser',
                options: [
                    {
                        value: 'ALL',
                        label: i18n.t('全部开放所有学员都能查看并且使用')
                    },
                    {
                        value: 'NOT_OPEN',
                        label: i18n.t('全部不开放所有学员都不能查看并且使用')
                    },
                    {
                        value: 'PART',
                        label: i18n.t('按组织开放按人员和部门选择部分开放课程')
                    }
                ],
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
            scope: {
                handler(val) {
                    if (val === 'PART') {
                        this.dialogVisible = true;
                        this.getUserList();
                    }
                },
                immediate: true
            }
        },
        mounted() {
            if (this.scope === 'PART') {
                this.dialogVisible = true;
                this.getUserList();
            } else {
                this.dialogVisible = false;
            }
        },
        methods: {
            search() {},
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
            sure() {
                if (this.scope === 'PART') {
                    this.dialogVisible = true;
                    this.getUserList();
                } else {
                    this.dialogVisible = false;
                }
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
                if (this.listQuery.relType === 'openUser') {
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
            },
            complete() {
                // this.$router.push({ name: 'courseManage' });
                this.onSure(this.scope);
            }
        }
    };
</script>
