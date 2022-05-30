<style lang="scss">
    @import './style.scss';

    .label-container {
        .el-tabs__nav-scroll {
            height: 55px;
            line-height: 55px;
        }

        .el-tab-pane {
            padding: 0 20px;
        }

        .el-tabs__header {
            margin: 0;
        }
    }
</style>
<template>
    <article class="app-container label-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('标签管理')" name="labelManage">
                <el-form
                    :model="listQuery"
                    :inline="true"
                    class="demo-form-inline veln__width label-form"
                    label-width="110px"
                >
                    <el-button v-if="checkPermission('addLabel')" type="primary" @click="add()">{{ $t('新增') }}</el-button>
                    <el-button v-if="checkPermission('delLabel')" @click="batchDel()">{{ $t('删除') }}</el-button>
                    <el-form-item>
                        <el-select
                            v-model="listQuery.categoryId"
                            class="course__type__select"
                            size="mini"
                            @change="handleCheckChange"
                        >
                            <el-option :label="$t('全部标签组')" value/>
                            <el-option
                                v-for="item in labelCategoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <search-input
                            v-model="listQuery.name"
                            :placeholder="$t('请输入标签名称')"
                            @enter="search"
                        />
                    </el-form-item>
                </el-form>
                <qgu-table
                    :columns="tableColumns"
                    :data="list"
                    :page="listQuery"
                    :total="total"
                    :loading="listLoading"
                    @selection-change="selectionChange"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    @sort-change="handleSortChange"
                />
            </el-tab-pane>
            <el-tab-pane v-if="checkPermission('tagCategory')" :label="$t('标签组管理')" name="labelGroup"/>
        </el-tabs>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t('标签-新增/编辑')"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible"
            width="520px"
            :before-close="handleClose"
            custom-class="label__dialog"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('名称') + '：'" prop="name">
                        <el-input v-model.trim="editQuery.name" :maxlength="20"/>
                    </el-form-item>
                    <el-form-item :label="$t('所属标签组') + '：'">
                        <el-select
                            v-model="editQuery.categoryIds"
                            class="course__type__select"
                            :placeholder="$t('请选择')"
                            multiple
                        >
                            <el-option
                                v-for="item in labelCategoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="dialogVisible=false">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="onSure">{{ $t('保存') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </article>
</template>
<script>
    import {deleteLabel, editLabel, getLabelDetail, getList} from '@/api/label';
    import {labelCategoryAll} from '@/api/labelCategory';
    import moment from 'moment';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'LabelManage',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    enabled: () => {
                        return (this.checkPermission('addLabel') || this.checkPermission('delLabel'));
                    }
                },
                {
                    field: 'name',
                    text: this.$t('名称'),
                    minWidth: 160
                },
                {
                    field: 'categoryNames',
                    text: this.$t('所属标签组'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.categoryNames
                            ? param.row.categoryNames.join('，')
                            : '--';
                    }
                },
                {
                    field: 'createdAt',
                    text: this.$t('创建时间'),
                    minWidth: 150,
                    sortable: 'custom',
                    render: (h, param) => {
                        const createdAt = param.row.createdAt;
                        return createdAt
                            ? moment(param.row.createdAt).format('YYYY-MM-DD HH:mm')
                            : '';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 100,
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
                        if (this.checkPermission('addLabel')) {
                            optArr.push(editBtn);
                        }
                        if (this.checkPermission('delLabel')) {
                            optArr.push(deleteBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                activeName: 'labelManage',
                listQuery: {
                    categoryId: '',
                    name: '',
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                labelCategoryList: [],
                editQuery: {
                    name: '',
                    categoryIds: []
                },
                dialogVisible: false,
                rules: {
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入标签名称'),
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        created() {
            this.getList();
            this.getLabelCategory();
        },
        methods: {
            checkPermission,
            handleClick(tab) {
                this.$router.push({name: tab.name});
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
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                getList(params).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.editQuery = {
                    name: '',
                    categoryIds: []
                };
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
                    deleteLabel(selectedIds).then(re => {
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
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    deleteLabel(params).then(re => {
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
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            // 保存
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        editLabel(this.editQuery).then(res => {
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.getList({
                                    pageNum: 1
                                });
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                            this.dialogVisible = false;
                        });
                    }
                });
            },
            handleClose() {
                this.editQuery = {
                    name: '',
                    categoryIds: []
                };
                this.dialogVisible = false;
            },
            // 获取所有标签组
            getLabelCategory() {
                labelCategoryAll().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.labelCategoryList = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            // 编辑
            edit(row) {
                this.dialogVisible = true;
                getLabelDetail({id: row.id}).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const {name, categoryIds, id} = result.data;
                        this.editQuery.name = name;
                        this.editQuery.categoryIds = categoryIds;
                        this.editQuery.id = id;
                    } else {
                        this.$errorMsg(result.msg || this.$t('获取信息失败'));
                    }
                });
            },
            // 排序
            handleSortChange(column, prop, order) {
                if (this.listQuery.sort === 'desc') {
                    this.listQuery.sort = 'asc';
                } else {
                    this.listQuery.sort = 'desc';
                }
                this.getList({
                    pageNum: 1
                });
            }
        }
    };
</script>
