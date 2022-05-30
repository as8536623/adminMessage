<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container group__block">
        <qgu-drag-row>
            <div slot="left" class="app__row--left group__category">
                <qgu-tree
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
                <el-tooltip
                    v-if="checkPermission('gCategory')"
                    :content="$t('类别管理')"
                    placement="top"
                    class="category__icon"
                >
                    <router-link to="/uc/user/group/category">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="person__filter veln__width">
                    <el-form
                        :model="listQuery"
                        :inline="true"
                        class="demo-form-inline unrequired__form"
                    >
                        <el-form-item :label="$t('状态') + '：'">
                            <el-checkbox-group
                                v-model="listQuery.statusList"
                                @change="handleCheckChange"
                            >
                                <el-checkbox
                                    v-for="groupStatus in groupStatusEnum.arr"
                                    :key="groupStatus.code"
                                    :label="groupStatus.code"
                                >{{ groupStatus.name }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <search-input
                            v-model="listQuery.keywords"
                            class="pull-right"
                            :placeholder="$t('请输入群名称/创建人')"
                            @enter="search"
                        />
                    </el-form>
                </section>
                <section v-if="checkPermission('addGroup')" class="opt__line">
                    <el-button type="primary" @click="add()">{{ $t('新增') }}</el-button>
                    <el-button @click="batchEnable()">{{ $t('启用') }}</el-button>
                    <el-button @click="batchDisable()">{{ $t('停用') }}</el-button>
                    <el-button @click="batchDel()">{{ $t('删除') }}</el-button>
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
            </div>
        </qgu-drag-row>
        <el-dialog
            v-if="authDialogVisible"
            append-to-body
            :title="$t('设置授权')"
            :visible.sync="authDialogVisible"
            width="939px"
        >
            <veln-auth-setting
                app-code="veln-uc"
                :fun-id="funId"
                route="useScope"
                rel-type="GROUP"
                fun-code="GROUP"
                @onClose="authDialogVisible=false;"
            />
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import VelnAuthSetting from '@/components/VelnAuthSetting';
    import {
        deleteGroup,
        disableGroup,
        enabledGroup,
        groupPage
    } from '@/api/group';
    import {getNodeTree} from '@/api/commonTree';
    import moment from 'moment';

    import {GROUP_STATUS_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'GroupList',
        components: {
            QguTree,
            VelnAuthSetting
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    text: this.$t('群名称'),
                    minWidth: 120,
                    render: (h, param) => {
                        const name = param.row.name;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.view(param.row.id);
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'dynamic',
                    text: this.$t('动态'),
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.dynamic ? '动态' : '非动态';
                    }
                },
                {
                    field: 'userName',
                    text: this.$t('创建人'),
                    minWidth: 100
                },
                {
                    field: 'createdAt',
                    text: this.$t('创建日期'),
                    minWidth: 140,
                    render: (h, param) => {
                        return moment(param.row.createdAt).format('YYYY-MM-DD HH:mm');
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 80,
                    render: (h, param) => {
                        return this.groupStatusEnum.getName(param.row.status);
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    width: 140,
                    fixed: 'right',
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
                                    this.del(param.row);
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
                        const disableBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('停用'),
                                type: 'text',
                                icon: 'disable'
                            },
                            on: {
                                click: () => {
                                    this.disable(param.row);
                                }
                            }
                        });
                        const startBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('启用'),
                                type: 'text',
                                icon: 'enable'
                            },
                            on: {
                                click: () => {
                                    this.start(param.row);
                                }
                            }
                        });
                        const authBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('设置授权'),
                                type: 'text',
                                icon: 'person_s'
                            },
                            on: {
                                click: () => {
                                    this.authEdit(param.row);
                                }
                            }
                        });
                        if ('ENABLED' === param.row.status) {
                            if (this.checkPermission('addGroup')) {
                                optArr.push(disableBtn);
                            }
                            if (this.checkPermission('addGroup')) {
                                optArr.push(authBtn);
                            }
                        } else {
                            if (this.checkPermission('addGroup')) {
                                optArr.push(startBtn);
                            }
                            if (this.checkPermission('addGroup')) {
                                optArr.push(editBtn);
                            }
                        }
                        if (
                            this.checkPermission('delGroup') &&
                            'ENABLED' !== param.row.status
                        ) {
                            optArr.push(deleteBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                rules: {
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                funId: '',
                funCode: 'uc_group_category',
                tableColumns,
                list: [],
                total: 0,
                listQuery: {
                    includeChild: true,
                    categoryId: null,
                    keywords: '',
                    pageNum: 1,
                    statusList: ['DRAFT', 'ENABLED', 'DISABLED'],
                    dynamicList: [],
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                dialogVisible: false,
                editQuery: {
                    name: '',
                    categoryId: '',
                    id: '',
                    categoryName: ''
                },
                selectedData: [],
                positionCategory: null,
                groupStatusEnum: GROUP_STATUS_ENUM,
                authDialogVisible: false
            };
        },
        created() {
            this.groupCategoryAll();
        },
        methods: {
            checkPermission,
            groupCategoryAll() {
                getNodeTree(this.funCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.categoryId = result.data.id;
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取群组类别出错'));
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.positionCategory = data;
                this.getList({
                    pageNum: 1
                });
            },
            handleCheckChange() {
                if (!this.listQuery.positionName) {
                    this.listQuery.keywords = '';
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
            includeChildChange(includeChild) {
                this.listQuery.includeChild = includeChild;
                this.listQuery.pageNum = 1;

                this.getList();
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                groupPage(params).then(re => {
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
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    deleteGroup(params).then(re => {
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
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    deleteGroup(selectedIds).then(re => {
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
            batchEnable() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('确认启用勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'info'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    enabledGroup(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('启用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '启用失败'));
                        }
                    });
                });
            },
            batchDisable() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('确认停用勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    disableGroup(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('停用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '停用失败'));
                        }
                    });
                });
            },
            disable(data) {
                this.$confirm(this.$t('确认停用勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    disableGroup(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('停用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '停用失败'));
                        }
                    });
                });
            },
            start(data) {
                this.$confirm(this.$t('确认启用勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'info'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    enabledGroup(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('启用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '启用失败'));
                        }
                    });
                });
            },
            handleClose() {
                this.editQuery = {
                    name: '',
                    code: '',
                    categoryName: '',
                    categoryId: '',
                    id: ''
                };
                this.dialogVisible = false;
            },
            add() {
                this.$router.push({
                    name: `groupEdit`,
                    query: {
                        type: 'ADD'
                    }
                });
            },
            edit(data) {
                this.$router.push({
                    name: `groupEdit`,
                    query: {
                        id: data.id,
                        type: 'EDIT'
                    }
                });
            },
            view(id) {
                this.$router.push({
                    name: `groupEdit`,
                    query: {
                        id,
                        type: 'VIEW'
                    }
                });
            },
            authEdit(course) {
                this.funId = course.id;
                this.authDialogVisible = true;
            }
        }
    };
</script>
