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
                    v-show="!hasBgk"
                    v-if="checkPermission('bankCategory')"
                    :content="$t('类别管理')"
                    placement="top"
                    class="category__icon"
                >
                    <router-link :to="{name: 'itemBankCategory'}">
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
                        <el-form-item :label="$t('题库名称') + '：'">
                            <search-input
                                v-model="listQuery.bankName"
                                :placeholder="$t('题库名称')"
                                @enter="search"
                            />
                        </el-form-item>
                        <el-form-item v-if="!hasBgk" :label="$t('创建人') + '：'">
                            <search-input
                                v-model="listQuery.keywords"
                                :placeholder="$t('姓名/用户名/工号/手机号')"
                                @enter="search"
                            />
                        </el-form-item>
                        <el-form-item v-if="!hasBgk" :label="$t('试题状态') + '：'">
                            <el-checkbox-group
                                v-model="listQuery.itemStatus"
                                @change="handleCheckChange"
                            >
                                <el-checkbox
                                    v-for="item in TEST_STATUS_ENUM.arr"
                                    :key="item.code"
                                    :label="item.code"
                                >{{ item.name }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </section>
                <section v-if="!hasBgk" class="opt__line veln__width">
                    <el-button
                        v-if="checkPermission('addBank')"
                        type="primary"
                        @click="add()"
                    >{{ $t('新增') }}</el-button>
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
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="100px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('名称') + '：'" prop="bankName">
                        <el-input v-model.trim="editQuery.bankName" :placeholder="$t('请输入题库名称')"/>
                    </el-form-item>
                    <el-form-item :label="$t('题库类别') + '：'" prop="categoryId">
                        <el-input
                            ref="categoryInput"
                            v-model.trim="editQuery.categoryName"
                            :placeholder="$t('请选择题库类别')"
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
            :title="$t('选择题库分类')"
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

        <el-dialog
            v-if="authDialogVisible"
            append-to-body
            :title="$t('题库授权')"
            :visible.sync="authDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-auth-setting
                :app-code="$appCodes.pe + '/pe'"
                :fun-id="funId"
                route="itemBankAuth"
                rel-type="ROLE"
                fun-code="ITEM_BANK_AUTH"
                @onClose="authDialogVisible=false;"
            />
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import VelnAuthSetting from '@/components/VelnAuthSetting';
    import {delBank, saveBank, searchItemBank, updateBank} from '@/api/exam/item/itemBank';
    import {getNodeTree} from '@/api/exam/item/itemBankCategory';
    import VelnCommonTreeSelect from '@/components/VelnCommonTreeSelect';
    import checkPermission from '@/utils/permission';
    import {TEST_STATUS_ENUM} from '@/enum';
    import moment from 'moment';

    export default {
        name: 'ExamWarehouse',
        components: {
            QguTree,
            VelnCommonTreeSelect,
            VelnAuthSetting
        },
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            const tableColumns = [
                {
                    field: 'bankName',
                    minWidth: 120,
                    text: this.$t('题库名称')
                },
                {
                    field: 'singleNumber',
                    align: 'center',
                    minWidth: 80,
                    text: this.$t('单选')
                },
                {
                    field: 'multiNumber',
                    align: 'center',
                    minWidth: 80,
                    text: this.$t('多选')
                },
                {
                    field: 'indefiniteNumber',
                    align: 'center',
                    minWidth: 80,
                    hidden: hasBgk,
                    text: this.$t('不定项选择')
                },
                {
                    field: 'judgmentNumber',
                    align: 'center',
                    minWidth: 80,
                    text: this.$t('判断')
                },
                {
                    field: 'fillNumber',
                    align: 'center',
                    minWidth: 80,
                    hidden: hasBgk,
                    text: this.$t('填空')
                },
                {
                    field: 'questionsNumber',
                    align: 'center',
                    minWidth: 80,
                    hidden: hasBgk,
                    text: this.$t('问答')
                },
                {
                    field: 'allNumber',
                    align: 'center',
                    minWidth: 80,
                    text: this.$t('试题总数')
                },
                {
                    field: 'createdAt',
                    align: 'center',
                    minWidth: 80,
                    text: this.$t('创建时间'),
                    render: (h, param) => {
                        return moment(param.row.createAt).format('YYYY-MM-DD');
                    }
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    minWidth: 100,
                    hidden: hasBgk,
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
                        const authBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('授权'),
                                type: 'text',
                                icon: 'person_s'
                            },
                            on: {
                                click: () => {
                                    this.auth(param.row);
                                }
                            }
                        });
                        if (this.checkPermission('updBank')) {
                            optArr.push(editBtn);
                        }
                        if (this.checkPermission('authBank')) {
                            optArr.push(authBtn);
                        }
                        if (this.checkPermission('delBank')) {
                            optArr.push(deleteBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                hasBgk, // 北国会
                TEST_STATUS_ENUM,
                categoryDialogVisible: false, // 分类选择
                rules: {
                    categoryId: [
                        {
                            required: true,
                            message: this.$t('请输入选择分类'),
                            trigger: 'blur'
                        }
                    ],
                    bankName: [
                        {
                            required: true,
                            message: this.$t('请输入名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                funCode: 'ITEM_BANK',
                tableColumns,
                list: [],
                total: 0,
                listQuery: {
                    includeChild: true,
                    categoryId: null,
                    bankName: '',
                    keywords: '',
                    itemAttribute: 'ALL',
                    itemStatus: ['ENABLED', 'DRAFT'],
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
                    bankName: '',
                    categoryId: '',
                    categoryName: '',
                    itemAttribute: 'ALL'
                },
                selectedData: [],
                bankCategory: null,
                authDialogVisible: false,
                funId: ''
            };
        },
        created() {
            this.bankCategoryAll();
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
            bankCategoryAll() {
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
                params.itemStatus = params.itemStatus.join(',');
                this.listLoading = true;
                searchItemBank(params).then(re => {
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
                        if (this.editType === 'ADD') {
                            saveBank(this.editQuery).then(re => {
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

                        updateBank(this.editQuery).then(re => {
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
                    const params = {bankId: data.id};
                    delBank(params).then(re => {
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
                    bankName: '',
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
                this.dialogVisibleTitle = `${this.$t('题库新增')}`;
                this.editQuery = {
                    bankName: '',
                    categoryName:
                        null !== this.bankCategory ? this.bankCategory.name : '',
                    categoryId:
                        null !== this.bankCategory ? this.bankCategory.id : ''
                };
                this.dialogVisible = true;
            },
            edit(data) {
                this.editType = 'EDIT';
                this.dialogVisibleTitle = `${this.$t('题库编辑')}`;
                this.editQuery = {
                    id: data.id,
                    bankName: data.bankName,
                    categoryName: data.categoryName,
                    categoryId: data.categoryId
                };
                this.dialogVisible = true;
            },
            // 选择岗位类别后校验岗位类别
            categoryDlgClose() {
                this.$refs.editQuery.validateField('categoryId');
            },
            // 授权
            auth(row) {
                this.authDialogVisible = true;
                this.funId = row.id;
            },
            handleUserClose() {
                this.authDialogVisible = false;
            }
        }
    };
</script>
