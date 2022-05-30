<style lang="scss" scoped>
@import './style';
</style>

<template>
    <article class="veln__organize__select">
        <section class="person__filter">
            <el-form :model="listQuery" :inline="true" class="demo-form-inline user__scope__form">
                <!-- <el-checkbox-group
                    class="pull-left"
                    v-model="listQuery.roleList"
                    @change="handleCheckChange"
                >
                    <el-checkbox
                        v-for="role in roleList"
                        :label="role.id"
                        :key="role.id"
                    >{{role.name}}</el-checkbox>
                </el-checkbox-group>-->
                <el-button type="primary" @click="userSelectHandle">{{ $t('新增') }}</el-button>
                <el-button @click="userDelHandle">{{ $t('删除') }}</el-button>
                <search-input
                    v-model="listQuery.keywords"
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
            @selection-change="selectionChange"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
        <!--<section class="btn__line&#45;&#45;bottom">-->
        <!--<el-button type="primary" @click="save()">{{$t('保存')}}</el-button>-->
        <!--<el-button @click="cancel()">{{$t('取消')}}</el-button>-->
        <!--</section>-->
        <el-dialog
            v-if="userDialogVisible"
            append-to-body
            :title="$t('授权管理员')"
            :visible.sync="userDialogVisible"
            width="858px"
            @close="userDialogClose"
        >
            <section class="juri__dlg">
                <section class="juri__dlg__query veln__width">
                    <el-select
                        v-model="editQuery.roleId"
                        class="juri__role__select"
                        multiple
                        placeholder="请选择"
                        @change="userSearch"
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
                        @enter="userSearch"
                    />
                </section>
                <qgu-table
                    :columns="userTableColumns"
                    :data="userList"
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
    </article>
</template>

<script>
    import {
        addUsers,
        selectedUser,
        selectedUserAdmin,
        removeUsers
    } from '@/api/userScope';
    import {roleListAll} from '@/api/role';
    export default {
        name: 'VelnUserScope',
        components: {},
        props: {
            funId: {
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
                    text: this.$t('工号')
                },
                {
                    field: 'name',
                    text: this.$t('姓名')
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名'),
                    render: (h, param) => {
                        return param.row.loginName ? param.row.loginName : '--';
                    }
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
                    text: this.$t('岗位'),
                    render: (h, param) => {
                        return param.row.positionName
                            ? param.row.positionName
                            : '--';
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
                    text: this.$t('手机'),
                    render: (h, param) => {
                        return param.row.mobile ? param.row.mobile : '--';
                    }
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位'),
                    render: (h, param) => {
                        return param.row.positionName
                            ? param.row.positionName
                            : '--';
                    }
                },
                {
                    field: 'orgName',
                    text: this.$t('org'),
                    minWidth: 120,
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
                userTableColumns,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    keywords: '',
                    categoryId: '',
                    roleList: [],
                    pageNum: 1,
                    pageSize: 10,
                    funCode: 'COURSE_CATEGORY',
                    funId: this.funId,
                    relType: 'USER'
                },
                roleList: [
                    {
                        id: '1',
                        name: '培训管理员'
                    },
                    {
                        id: '2',
                        name: '课程管理员'
                    },
                    {
                        id: '3',
                        name: '内训管理员'
                    },
                    {
                        id: '4',
                        name: '面授管理员'
                    }
                ],
                userDialogVisible: false,
                userList: [],
                userTotal: 0,
                userListLoading: false,
                editQuery: {
                    keywords: '',
                    roleIds: [],
                    pageNum: 1,
                    pageSize: 10,
                    funCode: 'COURSE_CATEGORY',
                    funId: this.funId,
                    relType: 'user'
                },
                userMultiSelection: [],
                roles: [] // 角色列表
            };
        },
        created() {
            this.getList();
        },
        methods: {
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.roleList = params.roleList.length
                    ? params.roleList.join(',')
                    : null;
                this.listLoading = true;
                selectedUser(params).then(re => {
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
            cancel() {
                this.$emit('onClose');
            },
            selectionChange(v) {
                this.selectedData = v;
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
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            },
            userDialogClose() {},
            // 新增
            userSelectHandle() {
                this.userDialogVisible = true;
                this.getUserList();
                this.roleListAll();
            },
            // 获取管理员列表
            getUserList(condition) {
                const params = Object.assign({}, this.editQuery, condition);
                this.userListLoading = true;
                selectedUserAdmin(params).then(re => {
                    this.userListLoading = false;
                    const result = re.data;
                    if (result.success) {
                        this.userList = result.data.list || [];
                        this.userTotal = result.data.total;
                        this.editQuery.pageNum = params.pageNum;
                        this.editQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取管理员信息出错'));
                    }
                });
            },
            userSearch() {
                this.getUserList({pageNum: 1});
            },
            // 批量选择管理员选择
            userSelectionChange(v) {
                this.userMultiSelection = v;
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
            selectUser() {
                const list = [];
                this.userMultiSelection.map(item => {
                    list.push(item.id);
                });
                const param = {
                    funCode: 'COURSE_CATEGORY',
                    funId: this.funId,
                    relType: 'USER',
                    relIds: list
                };
                addUsers(param).then(res => {
                    const result = res.data;
                    if (!result.success) {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    } else {
                        this.getList({
                            pageNum: 1
                        });
                    }
                });
                this.userDialogVisible = false;
            },
            // 删除
            userDelHandle() {
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
                    const list = [];
                    this.selectedData.map(item => {
                        list.push(item.relId);
                    });
                    const param = {
                        funCode: 'COURSE_CATEGORY',
                        funId: this.funId,
                        relType: 'USER',
                        relIds: list
                    };
                    removeUsers(param).then(res => {
                        const result = res.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getList({
                                pageNum: 1
                            });
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            }
        }
    };
</script>
