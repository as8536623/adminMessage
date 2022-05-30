<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="juri__article">
        <section class="juri--top">
            <veln-form-section :title="$t('新增授权')" :can-expand="false">
                <div class="jury__manager">
                    <div class="juri__manager__title">{{ $t('授权管理员') }}：</div>
                    <div class="jury__manager__select">
                        <el-button
                            v-if="!selectedUser"
                            type="text"
                            @click="addAdmin"
                        >{{ $t('选择管理员') }}</el-button>
                        <el-tag
                            v-if="selectedUser"
                            size="medium"
                            :closable="!$route.query.id"
                            @close="tagClose"
                        >{{ selectedUser.name }}</el-tag>
                    </div>
                </div>
            </veln-form-section>
        </section>
        <section class="juri--bottom form__page">
            <header class="juri--bottom__title">{{ $t('已开放组织') }}</header>
            <section class="juri--bottom__filter veln__width">
                <el-button type="primary" @click="addJuri">{{ $t('新增') }}</el-button>
                <el-button @click="del">{{ $t('移除') }}</el-button>
                <el-form
                    v-model="listQuery"
                    :inline="true"
                    class="demo-form-inline pull-right jury__search__form"
                >
                    <el-form-item :label="$t('组织名称') + '：'">
                        <el-input v-model="listQuery.keywords" type="text"/>
                    </el-form-item>
                    <el-form-item :label="$t('组织类型') + '：'">
                        <el-select v-model="listQuery.relType">
                            <el-option :label="$t('全部')" value/>
                            <el-option :label="$t('部门')" value="ORG"/>
                            <el-option :label="$t('群组')" value="GROUP"/>
                            <el-option :label="$t('岗位')" value="POSITION"/>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="filter">{{ $t('筛选') }}</el-button>
                </el-form>
            </section>
            <qgu-table
                ref="table"
                :columns="tableColumns"
                :data="list"
                :page="listQuery"
                :total="total"
                :loading="listLoading"
                @selection-change="selectionChange"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </section>
        <el-dialog
            v-if="userDialogVisible"
            append-to-body
            :title="$t('授权管理员')"
            :visible.sync="userDialogVisible"
            width="858px"
            @close="userDialogClose"
        >
            <section class="juri__dlg">
                <section class="juri__dlg__query">
                    <el-select
                        v-model="editQuery.roleId"
                        class="juri__role__select"
                        multiple
                        placeholder="请选择"
                        @change="search"
                    >
                        <el-option
                            v-for="(role, index) in roles"
                            :key="index"
                            :label="role.name"
                            :value="role.id"
                        />
                    </el-select>
                    <search-input
                        v-model="editQuery.keywords"
                        class="pull-right"
                        :placeholder="$t('请输入工号/姓名/用户名/手机')"
                        @enter="search"
                    />
                </section>
                <qgu-table
                    ref="userTable"
                    class="radio__table"
                    :columns="userTableColumns"
                    :data="userlist"
                    :page="editQuery"
                    :total="userTotal"
                    :loading="userListLoading"
                    @selection-change="userSelectionChange"
                    @size-change="handleUserSizeChange"
                    @current-change="handleUserCurrentChange"
                />
                <section class="text--right juri__user__btns">
                    <el-button @click="userDialogVisible=false;">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="selectUser">{{ $t('确定') }}</el-button>
                </section>
            </section>
        </el-dialog>
        <el-dialog
            v-if="orgDialogVisible"
            append-to-body
            :title="$t('选择组织')"
            :visible.sync="orgDialogVisible"
            width="939px"
            @close="orgDialogClose"
        >
            <veln-auth-setting route="userRange" :fun-id="funId" @onClose="orgDialogVisible=false;"/>
        </el-dialog>
    </article>
</template>

<script>
    import {roleListAll} from '@/api/role';
    import {searchAllAdmin, getUserAllInfo} from '@/api/user';
    import {searchSelectedOrg, deleteUserRangeById} from '@/api/userRange';
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnAuthSetting from '@/components/VelnAuthSetting';
    import {ORG_TYPE_ENUM} from '@/enum';
    export default {
        name: 'JurisdictionEdit',
        components: {
            VelnFormSection,
            VelnAuthSetting
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'type',
                    text: this.$t('组织类型'),
                    width: 381,
                    render: (h, param) => {
                        const type = param.row.type;
                        return ORG_TYPE_ENUM[type].name;
                    }
                },
                {
                    field: 'name',
                    text: this.$t('组织名称'),
                    render: (h, param) => {
                        const name = param.row.name;
                        const nameFilter = name.split(']');
                        return nameFilter[nameFilter.length - 1];
                    }
                },
                {
                    field: 'includeChild',
                    text: this.$t('是否包含子类'),
                    width: 200,
                    render: (h, param) => {
                        return this.$t('是');
                    }
                }
            ];
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
                    field: 'mobile',
                    text: this.$t('手机')
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位')
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
                }
            ];
            return {
                tableColumns, // 部门字段列
                userTableColumns, // 管理员table列
                roles: [], // 角色列表
                listQuery: {
                    funId: '',
                    keywords: '', // 组织名称
                    relType: '', // 组织类型
                    pageNum: 1,
                    pageSize: 20
                },
                selectedUser: null, // 已选择管理员
                list: [],
                total: 0,
                multiSelection: [],
                listLoading: false,
                userDialogVisible: false,
                editQuery: {
                    keywords: '',
                    roleIds: [],
                    pageNum: 1,
                    pageSize: 20
                },
                userlist: [],
                userTotal: 0,
                userMultiSelection: [],
                userListLoading: false,
                orgDialogVisible: false, // 选择岗位弹框是否显示
                funId: '' // 供后台缓存用(id)
            };
        },
        created() {
            this.roleListAll();
            if (this.$route.query.id) {
                this.funId = this.$route.query.id;
                this.listQuery.funId = this.$route.query.id;
                this.getUserAllInfo(this.listQuery.funId);
                this.getList();
            }
        },
        methods: {
            getList(condition) {
                const data = Object.assign({}, this.listQuery, condition);
                searchSelectedOrg(data).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                    }
                });
            },
            filter() {
                this.getList({
                    pageNum: 1
                });
            },
            getUserAllInfo(userId) {
                const params = {
                    userId
                };
                getUserAllInfo(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.selectedUser = result.data;
                    }
                });
            },
            // 获取所有管理员角色
            roleListAll() {
                const params = {
                    manage: true
                };
                roleListAll(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.roles = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取角色信息出错'));
                    }
                });
            },
            // 选择管理员弹框显示
            addAdmin() {
                this.userDialogVisible = true;
                this.getUserList();
            },
            // 获取管理员列表
            getUserList(condition) {
                const params = Object.assign({}, this.editQuery, condition);
                this.userListLoading = true;
                searchAllAdmin(params).then(re => {
                    this.userListLoading = false;
                    const result = re.data;
                    if (result.success) {
                        this.userlist = result.data.list || [];
                        this.userTotal = result.data.total;
                        this.editQuery.pageNum = params.pageNum;
                        this.editQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取管理员信息出错'));
                    }
                });
            },
            // 搜索
            search() {
                this.getUserList({pageNum: 1});
            },
            orgDialogClose() {
                this.getList({pageNum: 1});
            },
            selectionChange(v) {
                this.multiSelection = v;
            },
            del() {
                if (!this.multiSelection.length) {
                    this.$warnMsg(this.$t('请选择待操作数据！'));
                    return;
                }
                this.$confirm(this.$t('确定删除该数据么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                })
                    .then(() => {
                        const ids = [];
                        this.multiSelection.map(item => {
                            ids.push(item.relId);
                        });

                        const params = {
                            funId: this.listQuery.funId,
                            relIds: ids
                        };
                        deleteUserRangeById(params).then(re => {
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('删除成功'));
                                this.getList({
                                    pageNum: 1
                                });
                            } else {
                                this.$errorMsg(this.$t(result.msg || '删除失败'));
                            }
                        });
                    })
                    .catch(() => {
                        this.$errorMsg(this.$t('取消删除'));
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
            // 批量选择管理员选择
            userSelectionChange(v) {
                if (v.length > 1) {
                    this.$refs.userTable.clearSelection();
                    this.$refs.userTable.toggleRowSelection(v.pop());
                } else {
                    this.userMultiSelection = v;
                }
            // this.userMultiSelection = v;
            },
            // 批量选择管理员 pageSize 变化
            handleUserSizeChange(v) {
                this.getUserList({
                    pageNum: 1,
                    pageSize: v
                });
            },
            // 批量选择管理员 pageNum 变化
            handleUserCurrentChange(v) {
                this.getUserList({
                    pageNum: v
                });
            },
            // 选择管理员
            selectUser() {
                this.selectedUser = this.userMultiSelection[0];
                this.listQuery.funId = this.funId = this.selectedUser.id;
                this.userDialogVisible = false;
                this.getList({
                    pageNum: 1
                });
            },
            // 批量选择管理员 弹框 关闭
            userDialogClose() {
                this.editQuery = {
                    keywords: '',
                    roleIds: [],
                    pageNum: 1,
                    pageSize: 20
                };
                this.userlist = [];
            },
            // 管理员 删除
            tagClose(tag) {
                this.selectedUser = null;
                this.list = [];
            },
            addJuri() {
                if (!this.selectedUser) {
                    this.$warnMsg(this.$t('请选择管理员'));
                    return;
                }
                this.orgDialogVisible = true;
            }
        }
    };
</script>
