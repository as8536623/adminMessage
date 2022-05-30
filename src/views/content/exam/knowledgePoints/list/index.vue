<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container exam__block">
        <qgu-drag-row>
            <div slot="left" class="app__row--left category__block">
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
                    v-if="checkPermission('addPointCategory') || checkPermission('updPointCategory')
                        || checkPermission('delPointCategory') || checkPermission('movePointCategory')"
                    :content="$t('类别管理')"
                    placement="top"
                    class="category__icon"
                >
                    <router-link :to="{name: 'knowledgePointsCategory'}">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="opt__block veln__width">
                    <el-form
                        :model="listQuery"
                        :inline="true"
                        class="demo-form-inline unrequired__form"
                    >
                        <el-form-item :label="$t('知识点名称') + '：'">
                            <search-input
                                v-model="listQuery.knowledgeName"
                                :placeholder="$t('知识点名称')"
                                @enter="search"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('创建人') + '：'">
                            <search-input
                                v-model="listQuery.createUser"
                                :placeholder="$t('姓名/用户名/工号/手机号')"
                                @enter="search"
                            />
                        </el-form-item>
                    </el-form>
                </section>
                <section class="opt__line veln__width">
                    <el-button
                        v-if="checkPermission('addPoint')"
                        type="primary"
                        @click="add()"
                    >{{ $t('新增知识点') }}
                    </el-button>
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
            :title="dialogVisibleTitle"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="140px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('知识点名称') + '：'" prop="knowledgeName">
                        <el-input
                            v-model.trim="editQuery.knowledgeName"
                            :placeholder="$t('请输入知识点名称')"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('知识点类别') + '：'" prop="categoryId">
                        <el-input
                            ref="categoryInput"
                            v-model.trim="editQuery.categoryName"
                            :placeholder="$t('请选择知识点类别')"
                            :max-length="32"
                            clearable
                            @focus="showCategorySelect"
                        />
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
            :title="$t('选择知识点分类')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-common-tree-select
                ref="category"
                :fun-code="funCode"
                :app-code="$appCodes.pe + '/pe'"
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
    import {getList, save, del, get} from '@/api/exam/exam/knowledge';
    import {getNodeTree} from '@/api/exam/item/itemBankCategory';
    import VelnCommonTreeSelect from '@/components/VelnCommonTreeSelect';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'KnowledgePointsList',
        components: {
            QguTree,
            VelnCommonTreeSelect
        },
        data() {
            const tableColumns = [
                {
                    field: 'knowledgeName',
                    text: this.$t('知识点名称')
                },
                {
                    field: 'opt',
                    fixed: 'right',
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
                        if (this.checkPermission('updPoint')) {
                            optArr.push(editBtn);
                        }

                        if (this.checkPermission('delPoint')) {
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
                    knowledgeName: [
                        {
                            required: true,
                            message: this.$t('请输入名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                funCode: 'KNOWLEDGE',
                tableColumns,
                list: [],
                total: 0,
                listQuery: {
                    includeChild: true,
                    categoryId: null,
                    knowledgeName: '',
                    createUser: '',
                    itemAttribute: 'ALL',
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                dialogVisible: false,
                dialogVisibleTitle: '',
                editType: 'ADD',
                editQuery: {
                    id: '',
                    knowledgeName: '',
                    categoryId: '*',
                    categoryName: '全部',
                    itemAttribute: 'ALL'
                },
                selectedData: [],
                bankCategory: null,
                funId: ''
            };
        },
        created() {
            this.categoryAll();
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
            categoryAll() {
                getNodeTree(this.funCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.categoryId = result.data.id;
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取题库类别出错'));
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.bankCategory = data;
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
                getList(params).then(re => {
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
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            },
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        save(this.editQuery).then(re => {
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
                    const params = data.id;
                    del(params).then(re => {
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
                    knowledgeName: '',
                    categoryId: '',
                    categoryName: '',
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
                this.dialogVisibleTitle = `${this.$t('知识点新增')}`;
                this.editQuery = {
                    id: '',
                    knowledgeName: '',
                    categoryId: this.bankCategory ? this.bankCategory.id : '*',
                    categoryName: this.bankCategory ? this.bankCategory.name : '全部'
                };
                this.dialogVisible = true;
            },
            edit(data) {
                this.editType = 'EDIT';
                this.dialogVisibleTitle = `${this.$t('知识点编辑')}`;
                get(data.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                    } else {
                        this.$errorMsg(this.$t(result.msg || '查询数据失败'));
                    }
                });
                this.dialogVisible = true;
            },
            // 选择岗位类别后校验岗位类别
            categoryDlgClose() {
                this.$refs.editQuery.validateField('categoryId');
            }
        }
    };
</script>
