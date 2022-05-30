<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container form__page">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline jurisdiction">
            <el-form-item class="pull-left jurisdiction-form-item">
                <el-input
                    ref="orgInput"
                    v-model.trim="listQuery.referName"
                    :placeholder="$t('部门')"
                    :max-length="32"
                    @focus="showOrganizeSelect"
                    @clear="orgClear"
                />
                <svg-icon class-name="jurisdiction__icon" icon-class="flow"/>
            </el-form-item>
            <search-input
                v-model.trim="listQuery.keyword"
                class="pull-left"
                :placeholder="$t('请输入姓名/用户名进行搜索')"
                @enter="search"
            />
            <el-button type="primary" class="pull-right" @click="add">{{ $t('新增授权') }}</el-button>
        </el-form>
        <qgu-table
            :columns="tableColumns"
            :data="list"
            :page="listQuery"
            :total="total"
            :loading="listLoading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
        <el-dialog
            v-if="organizeDialogVisible"
            append-to-body
            :title="$t('选择部门')"
            :visible.sync="organizeDialogVisible"
            width="339px"
        >
            <veln-organize-select ref="organize"/>
            <div class="dialog__btn__line">
                <el-button @click="organizeDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="organizeSelect">确定</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import VelnOrganizeSelect from '@/components/VelnOrganizeSelect';

    import {userRangePage, deleteByUser} from '@/api/userRange';
    import checkPermission from '@/utils/permission';
    export default {
        name: 'JurisdictionList',
        components: {
            VelnOrganizeSelect
        },
        data() {
            const tableColumns = [
                {
                    text: this.$t('姓名'),
                    field: 'user.name',
                    minWidth: 120
                },
                {
                    text: this.$t('用户名'),
                    field: 'user.loginName',
                    minWidth: 120
                },
                {
                    text: this.$t('所在部门'),
                    field: 'user.orgName',
                    minWidth: 200,
                    render: (h, param) => {
                        const row = param.row;
                        if (!row.user.orgNamePath) {
                            return row.user.orgName || '--';
                        }
                        return h(
                            'ElTooltip',
                            {
                                props: {
                                    effect: 'dark',
                                    placement: 'right',
                                    content: row.user.orgNamePath
                                }
                            },
                            [h('span', row.user.orgName || '--')]
                        );
                    }
                },
                {
                    text: this.$t('所在岗位'),
                    field: 'user.positionName',
                    render: (h, param) => {
                        return param.row.user.positionName
                            ? param.row.user.positionName
                            : '--';
                    }
                },
                {
                    text: this.$t('管辖范围'),
                    field: 'orgCnt',
                    render: (h, param) => {
                        return param.row.orgCnt ? param.row.orgCnt : '--';
                    }
                },
                {
                    text: this.$t('授权人'),
                    field: 'createdBy'
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 100,
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
                                    this.del(param.row.user.id);
                                }
                            }
                        });
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.edit(param.row);
                                }
                            }
                        });
                        optArr.push(editBtn);
                        optArr.push(deleteBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                listQuery: {
                    referId: '',
                    referName: '',
                    keyword: '',
                    pageNum: 1,
                    pageSize: 20
                },
                list: [],
                total: 0,
                listLoading: false,
                organizeDialogVisible: false
            };
        },
        created() {
            this.getList();
        },
        methods: {
            checkPermission,
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                userRangePage(params).then(re => {
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
            showOrganizeSelect() {
                this.organizeDialogVisible = true;
                this.$refs.orgInput.blur();
            },
            organizeSelect() {
                const $organize = this.$refs.organize;
                const result = $organize.getActive();
                this.listQuery.referId = result.id;
                this.listQuery.referName = result.name;
                this.getList({
                    pageNum: 1
                });
                this.organizeDialogVisible = false;
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            orgClear() {
                this.listQuery.referId = '';
                this.search();
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
            del(userId) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = {
                        userId
                    };

                    deleteByUser(params).then(re => {
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
                });
            },
            edit(user) {
                this.$router.push({
                    name: 'jurisdictionEdit',
                    query: {
                        id: user.userId
                    }
                });
            },
            add() {
                this.$router.push({
                    name: 'jurisdictionEdit'
                });
            }
        }
    };
</script>
