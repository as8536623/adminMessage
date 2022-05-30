<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container paper__category">
        <qgu-tree :datalist="treeData" :default-expand-all="defaultExpandAll" :show-include-child="false">
            <span slot-scope="{ node, data }" class="custom-tree-node">
                <span class="organize__tree__text">{{ data.name }}</span>
                <span class="tree__option">
                    <el-tooltip
                        v-if="checkPermission('addPaperCategory')"
                        class="item"
                        effect="dark"
                        :content="$t('新增类别')"
                        placement="top"
                    >
                        <el-button class="add" type="text" size="mini" @click="add(data)">
                            <svg-icon class-name="tree__icon" icon-class="add_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip
                        v-if="checkPermission('updPaperCategory')"
                        class="item"
                        effect="dark"
                        :content="$t('编辑')"
                        placement="top"
                    >
                        <el-button type="text" size="mini" @click="edit(data)">
                            <svg-icon class-name="tree__icon" icon-class="edit_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip
                        v-if="checkPermission('delPaperCategory')"
                        class="item"
                        effect="dark"
                        :content="$t('删除')"
                        placement="top"
                    >
                        <el-button type="text" size="mini" @click="del(data)">
                            <svg-icon class-name="tree__icon" icon-class="del"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip
                        v-if="checkPermission('movePaperCategory')"
                        class="item"
                        effect="dark"
                        :content="$t('上移')"
                        placement="top"
                    >
                        <el-button
                            v-if="!data.first"
                            type="text"
                            size="mini"
                            @click="move(data, 'UP')"
                        >
                            <svg-icon class-name="tree__icon" icon-class="up_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip
                        v-if="checkPermission('movePaperCategory')"
                        class="item"
                        effect="dark"
                        :content="$t('下移')"
                        placement="top"
                    >
                        <el-button
                            v-if="!data.last"
                            type="text"
                            size="mini"
                            @click="move(data, 'DOWN')"
                        >
                            <svg-icon class-name="tree__icon" icon-class="down_s"/>
                        </el-button>
                    </el-tooltip>
                </span>
            </span>
        </qgu-tree>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t(editQuery.id ? '试卷类别-编辑' : '试卷类别-新增')"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="100px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('上级类别') + '：'">
                        <el-input
                            ref="categoryInput"
                            v-model.trim="editQuery.pName"
                            :placeholder="$t('请选择试卷类别')"
                            :max-length="32"
                            clearable
                            @focus="showCategorySelect"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('名称') + '：'" prop="name">
                        <el-input v-model.trim="editQuery.name" :maxlength="20"/>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="onSure">{{ $t('保存') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择上级')"
            :visible.sync="categoryDialogVisible"
            width="400px"
        >
            <veln-common-tree-select
                ref="category"
                :key="categoryKey"
                :fun-code="funCode"
                :default-expand-all="defaultExpandAll"
                :fun-name="funName"
                :on-selected="categorySelect"
            />
            <div class="dialog__btn__line">
                <el-button @click="categoryDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="categorySelect">{{ $t('确定') }}</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {
        getNodeTree,
        insertNode,
        updateNode,
        deleteNode,
        moveNode
    } from '@/api/commonTree';
    import VelnCommonTreeSelect from '@/components/VelnCommonTreeSelect';
    import checkPermission from '@/utils/permission';
    export default {
        name: 'PaperCategory',
        components: {
            QguTree,
            VelnCommonTreeSelect
        },
        data() {
            return {
                funCode: 'PAPER_TEMPLATE',
                appCode: this.$appCodes.pe + '/pe',
                funName: '试卷分类',
                treeData: [],
                dialogVisible: false,
                defaultExpandAll: true,
                editQuery: {
                    id: '',
                    name: '',
                    code: '',
                    pId: '',
                    pName: '',
                    funCode: this.funCode
                },
                editType: 'ADD',
                rules: {
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                categoryDialogVisible: false,
                categoryKey: null
            };
        },
        created() {
            this.listCategoryTree();
        },
        methods: {
            checkPermission,
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.editQuery.pId = result.id;
                this.editQuery.pName = result.name;
                this.categoryDialogVisible = false;
            },
            showCategorySelect() {
                this.categoryDialogVisible = true;
                this.$refs.categoryInput.blur();
            },
            listCategoryTree() {
                getNodeTree(this.funCode, this.appCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                    }
                });
            },
            handleClose() {
                this.editQuery = {
                    id: '',
                    name: '',
                    code: '',
                    pId: '',
                    pName: '',
                    version: this.editQuery.version,
                    funCode: this.funCode
                };
                this.dialogVisible = false;
                this.$refs['editQuery'].resetFields();
            },
            cancel() {
                this.dialogVisible = false;
                this.$refs['editQuery'].resetFields();
            },
            add(data) {
                this.editType = 'ADD';
                this.editQuery = {
                    name: '',
                    code: '',
                    pId: data.id,
                    pName: data.name,
                    funCode: this.funCode
                };
                this.dialogVisible = true;
            },
            edit(data) {
                this.editType = 'EDIT';
                this.editQuery = {
                    id: data.id,
                    name: data.name,
                    code: data.code,
                    pId: data.parentId,
                    pName: data.parentName,
                    funCode: this.funCode
                };
                this.dialogVisible = true;
            },
            onSure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.editType === 'ADD') {
                            insertNode(this.editQuery, this.appCode).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.dialogVisible = false;
                                    this.listCategoryTree();
                                    this.categoryKey = +new Date();
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                            return;
                        }

                        updateNode(this.editQuery, this.appCode).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.dialogVisible = false;
                                this.listCategoryTree();
                                this.categoryKey = +new Date();
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
                    const params = {
                        nodeId: data.id
                    };

                    deleteNode(params, this.appCode).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.listCategoryTree();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            move(data, moveType) {
                const params = {
                    nodeId: data.id,
                    moveType
                };
                moveNode(params, this.appCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('移动成功'));
                        this.listCategoryTree();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '移动失败'));
                    }
                });
            }
        }
    };
</script>
