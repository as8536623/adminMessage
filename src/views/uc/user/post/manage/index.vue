<style lang="scss" >
@import './style';
</style>

<template>
    <article class="app-container post__block">
        <qgu-drag-row>
            <div slot="left" class="app__row--left post__category">
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
                    v-if="checkPermission('pCategory')"
                    :content="$t('类别管理')"
                    placement="top"
                    class="category__icon"
                >
                    <router-link to="/uc/user/post/category">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="opt__line veln__width">
                    <el-button
                        v-if="checkPermission('addPosition')"
                        type="primary"
                        @click="add()"
                    >{{ $t('新增') }}</el-button>
                    <el-button
                        v-if="checkPermission('delPosition')"
                        @click="batchDel()"
                    >{{ $t('删除') }}</el-button>

                    <search-input
                        v-model="listQuery.keywords"
                        class="pull-right"
                        :placeholder="$t('请输入岗位名称')"
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
            </div>
        </qgu-drag-row>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t(editType==='ADD' ? '岗位-新增' : '岗位-  编辑')"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="100px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('所属类别') + '：'" prop="categoryId">
                        <el-input
                            ref="categoryInput"
                            v-model.trim="editQuery.categoryName"
                            :placeholder="$t('请选择岗位类别')"
                            :max-length="32"
                            clearable
                            @focus="showCategorySelect"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('名称') + '：'" prop="name">
                        <el-input
                            v-if="editType === 'ADD'"
                            v-model="editQuery.name"
                            type="textarea"
                            :rows="2"
                            :placeholder="$t('多个岗位请用逗号隔开')"
                        />
                        <el-input v-else v-model.trim="editQuery.name" :placeholder="$t('请输入岗位名称')"/>
                    </el-form-item>
                    <el-form-item :label="$t('编号') + '：'">
                        <el-input
                            v-if="editType === 'ADD'"
                            v-model="editQuery.code"
                            type="textarea"
                            :rows="2"
                            :placeholder="$t('多个编号和岗位名称一一对应')"
                        />
                        <el-input v-else v-model.trim="editQuery.code"/>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="onSure">保存</el-button>
                </div>
            </el-form>
        </el-dialog>

        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择岗位分类')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-common-tree-select
                ref="category"
                :fun-code="funCode"
                :default-expand-all="defaultExpandAll"
                :show-include-child="false"
            />
            <div class="dialog__btn__line">
                <el-button @click="categoryDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="categorySelect">确定</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {
        positionPage,
        insertPosition,
        updatePosition,
        deletePosition
    } from '@/api/position';
    import {getNodeTree} from '@/api/commonTree';
    import VelnCommonTreeSelect from '@/components/VelnCommonTreeSelect';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'PositionList',
        components: {
            QguTree,
            VelnCommonTreeSelect
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    text: this.$t('岗位名称')
                },
                {
                    field: 'categoryNamePath',
                    text: this.$t('岗位类别')
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    width: 100,
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
                        if (this.checkPermission('addPosition')) {
                            optArr.push(editBtn);
                        }
                        if (this.checkPermission('delPosition')) {
                            optArr.push(deleteBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                categoryDialogVisible: false, // 分类选择
                rules: {
                    categoryId: [
                        {
                            required: true,
                            message: this.$t('请输入选择分类'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                funCode: 'uc_position_category',
                tableColumns,
                list: [],
                total: 0,
                listQuery: {
                    includeChild: true,
                    categoryId: null,
                    keywords: '',
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                dialogVisible: false,
                editType: 'ADD',
                editQuery: {
                    name: '',
                    categoryId: '',
                    id: '',
                    code: '',
                    categoryName: ''
                },
                selectedData: [],
                positionCategory: null
            };
        },
        created() {
            this.positionCategoryAll();
        },
        methods: {
            checkPermission,
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.editQuery.categoryId = result.id;
                this.editQuery.categoryName = result.name;
                this.categoryDialogVisible = false;
                this.$refs.editQuery.validateField('categoryId');
            },
            showCategorySelect() {
                this.categoryDialogVisible = true;
                this.$refs.categoryInput.blur();
            },
            positionCategoryAll() {
                getNodeTree(this.funCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.categoryId = result.data.id;
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取岗位类别出错'));
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
                positionPage(params).then(re => {
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
            onSure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.editType === 'ADD') {
                            insertPosition(this.editQuery).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.dialogVisible = false;
                                    this.getList();
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                            return;
                        }

                        updatePosition(this.editQuery).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.dialogVisible = false;
                                this.getList();
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                    }
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
                    deletePosition(params).then(re => {
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

                    deletePosition(selectedIds).then(re => {
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
            handleClose() {
                this.editQuery = {
                    name: '',
                    code: '',
                    categoryName: '',
                    categoryId: '',
                    id: ''
                };
                this.dialogVisible = false;
                this.$refs['editQuery'].resetFields();
            },
            cancel() {
                this.dialogVisible = false;
                this.$refs['editQuery'].resetFields();
            },
            add() {
                this.editType = 'ADD';
                this.editQuery = {
                    name: '',
                    code: '',
                    categoryName:
                        null !== this.positionCategory
                            ? this.positionCategory.name
                            : '',
                    categoryId:
                        null !== this.positionCategory
                            ? this.positionCategory.id
                            : ''
                };
                this.dialogVisible = true;
            },
            edit(data) {
                this.editType = 'EDIT';
                let categoryName = '';
                if (data.categoryNamePath) {
                    const categoryNamePath = data.categoryNamePath.split('.');
                    categoryName = categoryNamePath[categoryNamePath.length - 1];
                }
                this.editQuery = {
                    id: data.id,
                    name: data.name,
                    categoryName: categoryName,
                    categoryId: data.categoryId,
                    code: data.code
                };
                this.dialogVisible = true;
            },
            // 选择岗位类别后校验岗位类别
            categoryDlgClose() {
                this.$refs.editQuery.validateField('categoryId');
            }
        }
    };
</script>
