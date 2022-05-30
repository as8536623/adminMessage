<style lang="scss" scoped>
    @import './style';
</style>

<template>
    <article class="app-container role__user">
        <div class="role__header">
            <span class="role__name">{{ roleName }}</span>
            <el-button class="role__view__auth" type="text" @click="viewRole">{{ $t('查看权限') }}</el-button>
        </div>
        <section class="opt__line veln__width">
            <el-button
                v-if="checkPermission('addRole') || checkPermission('k12-role')"
                type="primary"
                @click="addUser"
            >{{ $t('新增') }}
            </el-button>
            <el-button v-if="checkPermission('addRole') || checkPermission('k12-role')" @click="batchDelUser">
                {{ $t('删除') }}
            </el-button>
            <search-input
                v-model="listQuery.keyword"
                class="pull-right"
                :placeholder="$t('请输入工号/姓名/用户名/手机')"
                @enter="search"
            />
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
        <el-dialog
            v-if="dgpDialogVisible"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                route="userRoleRel"
                fun-code="userRoleRel"
                :fun-id="listQuery.roleIds"
                @onClose="handleUserClose"
            />
        </el-dialog>
    </article>
</template>

<script>
    import VelnDgpUser from '@/components/VelnDgpUser';
    import {delUserRoleRel, userRoleRelPage} from '@/api/userRoleRel';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'RoleUser',
        components: {
            VelnDgpUser
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    enabled: () => {
                        return this.checkPermission('addRole') || checkPermission('k12-role');
                    }
                },
                {
                    field: 'code',
                    text: this.$t('工号'),
                    minWidth: 100
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 120
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名'),
                    minWidth: 160
                },
                {
                    field: 'mobile',
                    text: this.$t('手机号码'),
                    minWidth: 120,
                    render: (h, param) => {
                        return param.row.mobile ? param.row.mobile : '--';
                    }
                },
                // {
                //     field: 'positionName',
                //     text: this.$t('岗位'),
                //     render: (h, param) => {
                //         return param.row.positionName
                //             ? param.row.positionName
                //             : '--';
                //     }
                // },
                // {
                //     field: 'orgCnt',
                //     text: this.$t('管辖的部门'),
                //     minWidth: 140,
                //     render: (h, param) => {
                //         const row = param.row;
                //         return row.orgCnt === null ? '--' : row.orgCnt;
                //     }
                // },
                {
                    field: 'opt',
                    fixed: 'right',
                    minWidth: 60,
                    text: this.$t('操作'),
                    render: (h, param) => {
                        const optArr = [];
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.deleteUser(param.row);
                                }
                            }
                        });
                        if (this.checkPermission('addRole') || this.checkPermission('k12-role')) {
                            optArr.push(deleteBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                roleName: '',
                list: [],
                multiSelection: [],
                total: 0,
                listQuery: {
                    roleIds: '',
                    keyword: '',
                    pageNum: 1,
                    pageSize: 20
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                listLoading: false,
                treeData: [
                    {
                        id: '0',
                        name: '管理员',
                        isRoot: true,
                        manage: true,
                        child: []
                    },
                    {
                        id: '1',
                        name: '学员',
                        isRoot: true,
                        manage: false,
                        child: []
                    }
                ],
                defaultExpandedKeys: ['0'],
                editType: 'ADD',
                editManage: false,
                editQuery: {
                    id: '',
                    name: '',
                    manage: true
                },
                dgpDialogVisible: false,
                currentNodeKey: '',
                activeRole: {}
            };
        },
        mounted() {
            if (this.$route.query.roleId) {
                this.listQuery.roleIds = this.$route.query.roleId;
                this.roleName = this.$route.query.roleName;
                this.getList({
                    pageNum: 1
                });
            }
        },
        methods: {
            checkPermission,
            search() {
                this.getList({pageNum: 1});
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.roleIds = params.roleIds === '0' ? null : params.roleIds;
                this.listLoading = true;
                userRoleRelPage(params).then(re => {
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
            selectionChange(v) {
                this.multiSelection = v;
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
            delUserRoleRel(userIds) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = {
                        userIds,
                        roleId: this.listQuery.roleIds
                    };
                    delUserRoleRel(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            // 删除角色关联人员
            deleteUser(user) {
                this.delUserRoleRel([user.id]);
            },
            // 批量删除角色关联人员
            batchDelUser() {
                if (!this.multiSelection.length) {
                    this.$warnMsg(this.$t('请选择待操作数据'));
                    return;
                }
                const ids = [];
                this.multiSelection.map(user => {
                    ids.push(user.id);
                });
                this.delUserRoleRel(ids);
            },
            addUser() {
                this.dgpDialogVisible = true;
            },
            handleUserClose() {
                this.getList({pageNum: 1});
                this.dgpDialogVisible = false;
            },
            viewRole() {
                this.$router.push({
                    name: 'roleDetail',
                    query: {
                        roleId: this.$route.query.roleId,
                        manage: this.$route.query.manage
                    }
                });
            }
        }
    };
</script>
