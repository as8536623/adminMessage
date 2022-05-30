<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="veln__km__scope">
        <el-form
            v-show="showType==='FILTER'"
            :model="filterQuery"
            :inline="true"
            class="vks__filter"
            label-width="100px"
        >
            <div>
                <el-form-item :label="$t('开放范围') + '：'">
                    <el-radio-group v-model="filterQuery.value">
                        <el-radio label="EVERY">{{ $t('所有开放') }}</el-radio>
                        <el-radio label="ALL">{{ $t('组织内部开放') }}</el-radio>
                        <el-radio
                            :class="{'vks__part__radio': filterQuery.value==='PART'}"
                            label="PART"
                        >{{ $t('指定人员开放') }}</el-radio>
                        <el-button
                            v-show="filterQuery.value==='PART'"
                            class="vks__part__btn text--primary"
                            type="text"
                            @click="showUserSelect"
                        >{{ $t('指定人员') }}</el-button>
                        <el-radio label="NOT_OPEN">{{ $t('不对任何人员开放') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div>
                <el-form-item label=" ">
                    <el-checkbox v-model="filterQuery.allowUpload">{{ $t('允许学员上传') }}</el-checkbox>
                </el-form-item>
                <el-form-item class="vks--left">
                    <el-radio-group v-model="filterQuery.needApprove">
                        <el-radio :label="false">{{ $t('不需要审核') }}</el-radio>
                        <el-radio :label="true">{{ $t('需要审核') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div>
                <el-form-item label=" ">
                    <el-checkbox v-model="filterQuery.allowDownload">{{ $t('允许学员下载') }}</el-checkbox>
                </el-form-item>
            </div>
            <div>
                <el-form-item label=" ">
                    <el-checkbox v-model="filterQuery.allowShare">{{ $t('允许学员分享') }}</el-checkbox>
                </el-form-item>
            </div>
        </el-form>
        <section v-show="showType==='USER'" class="vks__user">
            <div class="vks__user__back" @click="showFilterSelect">
                <svg-icon icon-class="left_s" class-name="vks__back--icon"/>
                <span class="vks__back--text">{{ $t('返回') }}</span>
            </div>
            <el-tabs v-model="type" @tab-click="handleClick">
                <el-tab-pane label="已开放人员" name="USER">
                    <div class="vks__scope__user">
                        <el-form :model="listQuery" :inline="true">
                            <section class="vks__scope__user__query">
                                <el-button
                                    class="vks__scope__btn"
                                    type="primary"
                                    @click="addUser"
                                >{{ $t('添加人员') }}</el-button>
                                <el-button class="vks__scope__btn" @click="batchDel">{{ $t('移除') }}</el-button>
                                <el-button
                                    class="pull-right"
                                    type="primary"
                                    @click="search"
                                >{{ $t('筛选') }}</el-button>
                                <el-form-item :label="$t('工号/姓名/用户名') + '：'" class="pull-right">
                                    <el-input
                                        v-model="listQuery.keywords"
                                        class="vks__scope__keywords"
                                    />
                                </el-form-item>
                            </section>
                        </el-form>
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
                <el-tab-pane label="已开放组织" name="ORG">
                    <div class="vks__scope__user">
                        <section class="vks__scope__org__query">
                            <el-button
                                class="vks__scope__btn"
                                type="primary"
                                @click="addOrg"
                            >{{ $t('添加组织') }}</el-button>
                            <el-button class="vks__scope__btn" @click="batchDel">{{ $t('移除') }}</el-button>
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
        <div class="vks__btns">
            <el-button @click="onCancel">{{ $t('取消') }}</el-button>
            <el-button type="primary" @click="onSure">{{ $t('确定') }}</el-button>
        </div>
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
                :fun-code="funCode"
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
                :app-code="appCode"
                :route="route"
                :fun-code="funCode"
                :fun-id="businessId"
                @onClose="orgDialogVisible=false;"
            />
        </el-dialog>
    </article>
</template>

<script>
    import i18n from '@/lang';
    import {getUserList, removeUsers} from '@/api/userComponent';
    import {getOrgList, removeOrgs} from '@/api/orgComponent';
    import {updateScope} from '@/api/km/kmCategory';
    import VelnDgpUser from '@/components/VelnDgpUser';
    import VelnDgpOrg from '@/components/VelnDgpOrg';
    import {ORG_TYPE_ENUM} from '@/enum';
    export default {
        name: 'VelnKmScope',
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
            allowUpload: {
                type: Boolean,
                default: false
            },
            allowDownload: {
                type: Boolean,
                default: false
            },
            allowShare: {
                type: Boolean,
                default: false
            },
            needApprove: {
                type: Boolean,
                default: false
            },
            con: {
                type: String,
                default: 'EVERY'
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
            return {
                userTableColumns,
                orgTableColumns,
                filterQuery: {
                    id: this.businessId,
                    property: 'openScope',
                    value: this.con,
                    allowUpload: this.allowUpload,
                    allowDownload: this.allowDownload,
                    allowShare: this.allowShare,
                    needApprove: this.needApprove
                },
                listQuery: {
                    funId: this.businessId,
                    funCode: this.funCode,
                    relType: 'USER',
                    appCode: this.appCode,
                    route: this.route,
                    keywords: '',
                    pageSize: 10,
                    pageNum: 1
                },
                showType: 'FILTER',
                userList: [],
                orgList: [],
                selectedData: [],
                total: 0,
                listLoading: false,
                type: 'USER',
                dgpDialogVisible: false,
                userDialogKey: null,
                orgDialogKey: null,
                orgDialogVisible: false
            };
        },
        mounted() {},
        methods: {
            showUserSelect() {
                this.showType = 'USER';
                this.save();
                this.getUserList({pageNum: 1});
            },
            showFilterSelect() {
                this.showType = 'FILTER';
                this.listQuery.relType = 'USER';
                this.type = 'USER';
            },
            search() {
                if (this.listQuery.relType === 'ORG') {
                    this.getUserList({
                        pageNum: 1
                    });
                } else {
                    this.getOrgList({
                        pageNum: 1
                    });
                }
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
                if (tab.name === 'USER') {
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
                if (this.listQuery.relType === 'ORG') {
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
            save(type) {
                updateScope(this.filterQuery).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        if (type === 'save') {
                            this.$emit('onSure');
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            onCancel() {
                this.$emit('onCancel');
            },
            onSure() {
                this.save('save');
            }
        }
    };
</script>
