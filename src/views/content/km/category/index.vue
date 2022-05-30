<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container group__category">
        <qgu-tree :datalist="treeData" :default-expand-all="defaultExpandAll" :show-include-child="false">
            <span slot-scope="{ node, data }" class="custom-tree-node">
                <span class="organize__tree__text">{{ data.name }}</span>
                <span class="tree__option">
                    <el-tooltip
                        v-if="checkPermission('kmAddCategory') && data.manage"
                        class="item"
                        effect="dark"
                        :content="$t('新增类别')"
                        placement="top"
                    >
                        <el-button class="add" type="text" size="mini" @click="add(data)">
                            <svg-icon class-name="tree__icon" icon-class="add_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip v-if="checkPermission('kmAddCategory')" class="item" effect="dark" :content="$t('编辑')" placement="top">
                        <el-button type="text" size="mini" @click="edit(data)">
                            <svg-icon class-name="tree__icon" icon-class="edit_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip v-if="checkPermission('kmDelCategory')" class="item" effect="dark" :content="$t('删除')" placement="top">
                        <el-button type="text" size="mini" @click="del(data)">
                            <svg-icon class-name="tree__icon" icon-class="del"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('上移')" placement="top">
                        <el-button
                            v-if="!data.first"
                            type="text"
                            size="mini"
                            @click="move(data, 'UP')"
                        >
                            <svg-icon class-name="tree__icon" icon-class="up_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('下移')" placement="top">
                        <el-button
                            v-if="!data.last"
                            type="text"
                            size="mini"
                            @click="move(data, 'DOWN')"
                        >
                            <svg-icon class-name="tree__icon" icon-class="down_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item add" effect="dark" :content="$t('学员-可查看设置')" placement="top">
                        <el-button
                            v-if="checkPermission('kmCategoryAuth') && data.manage"
                            type="text"
                            size="mini"
                            @click="openScope(data)"
                        >
                            <svg-icon class-name="tree__icon" icon-class="range_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item add" effect="dark" :content="$t('管理员-可使用授权')" placement="top">
                        <el-button
                            v-if="checkPermission('kmCategoryAuth') && data.manage"
                            type="text"
                            size="mini"
                            @click="userScope(data)"
                        >
                            <svg-icon class-name="tree__icon" icon-class="person_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item add" effect="dark" :content="$t('管理员-可管理授权')" placement="top">
                        <el-button
                            v-if="checkPermission('kmCategoryAuth') && data.manage"
                            type="text"
                            size="mini"
                            @click="authScope(data)"
                        >
                            <svg-icon class-name="tree__icon km__message__icon" icon-class="km_m"/>
                        </el-button>
                    </el-tooltip>
                </span>
            </span>
        </qgu-tree>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t(editQuery.id ? '群组类别-编辑' : '群组类别-新增')"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="100px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('上级类别' + '：')">
                        <el-input
                            ref="categoryInput"
                            v-model.trim="editQuery.pName"
                            :placeholder="$t('上级类别')"
                            :max-length="32"
                            clearable
                            disabled
                        />
                    </el-form-item>
                    <el-form-item :label="$t('名称') + '：'" prop="name">
                        <el-input v-model.trim="editQuery.name" :maxlength="20"/>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="onSure">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            v-if="openScopeDialogVisible"
            :key="openScopeDialogKey"
            append-to-body
            :title="$t('学员-可查看设置')"
            :visible.sync="openScopeDialogVisible"
            width="850px"
        >
            <veln-km-scope
                app-code="veln-km"
                :business-id="businessId"
                fun-code="OPEN_SCOPE"
                :con="editQuery.openScope"
                :allow-upload="editQuery.allowUpload"
                :allow-download="editQuery.allowDownload"
                :allow-share="editQuery.allowShare"
                :need-approve="editQuery.needApprove"
                route="knowledgeScope"
                @onSure="openScopeSure"
                @onCancel="openScopeDialogVisible=false"
            />
        </el-dialog>
        <el-dialog
            v-if="useDialogVisible"
            append-to-body
            :title="$t('管理员-可使用授权')"
            :visible.sync="useDialogVisible"
            width="939px"
        >
            <veln-auth-setting
                app-code="veln-km"
                :fun-id="funId"
                route="knowledgeScope"
                rel-type="USE_SCOPE"
                fun-code="USE_SCOPE"
                @onClose="useDialogVisible=false"
            />
        </el-dialog>
        <el-dialog
            v-if="authDialogVisible"
            append-to-body
            :title="$t('管理员-可管理授权')"
            :visible.sync="authDialogVisible"
            width="939px"
        >
            <veln-auth-setting
                app-code="veln-km"
                :fun-id="funId"
                route="knowledgeScope"
                rel-type="MANAGE_SCOPE"
                fun-code="MANAGE_SCOPE"
                @onClose="authDialogVisible=false"
            />
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {
        getCategory,
        categoryInsert,
        categoryUpdate,
        categoryDelete,
        categoryMove,
        updateScope
    } from '@/api/km/kmCategory';
    import VelnKmScope from '@/components/VelnKmScope';
    import checkPermission from '@/utils/permission';
    import VelnAuthSetting from '@/components/VelnAuthSetting';

    export default {
        name: 'KmCategory',
        components: {
            QguTree,
            VelnKmScope,
            VelnAuthSetting
        },
        data() {
            return {
                funCode: 'KNOWLEDGE_CATEGORY',
                funName: '知识分类',
                businessId: '',
                treeData: [],
                dialogVisible: false,
                defaultExpandAll: true,
                editQuery: {
                    id: '',
                    name: '',
                    code: '',
                    pId: '',
                    pName: '',
                    openScope: '',
                    funCode: this.funCode,
                    allowUpload: false,
                    allowDownload: false,
                    allowShare: false,
                    needApprove: false
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
                authDialogVisible: false,
                useDialogVisible: false,
                openScopeDialogVisible: false,
                openScopeDialogKey: null,
                useScopeDialogKey: null,
                authScopeDialogKey: null,
                categoryKey: null
            };
        },
        created() {
            this.getGroupTree();
        },
        methods: {
            checkPermission,
            getGroupTree() {
                getCategory(this.funCode).then(re => {
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
            openScope(data) {
                this.editQuery = {
                    id: data.id,
                    openScope: data.con || 'EVERY',
                    allowUpload: data.allowUpload || false,
                    allowDownload: data.allowDownload || false,
                    allowShare: data.allowShare || false,
                    needApprove: data.needApprove || false
                };
                this.businessId = data.id;
                this.openScopeDialogVisible = true;
                this.openScopeDialogKey = +new Date();
            },
            userScope(data) {
                this.funId = data.id;
                this.useDialogVisible = true;
            },
            authScope(data) {
                this.funId = data.id;
                this.authDialogVisible = true;
            },
            onSure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.editType === 'ADD') {
                            categoryInsert(this.editQuery).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('新增成功'));
                                    this.dialogVisible = false;
                                    this.getGroupTree();
                                    this.categoryKey = +new Date();
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('新增失败')
                                    );
                                }
                            });
                            return;
                        }

                        categoryUpdate(this.editQuery).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('编辑成功'));
                                this.dialogVisible = false;
                                this.getGroupTree();
                                this.categoryKey = +new Date();
                            } else {
                                this.$errorMsg(result.msg || this.$t('编辑失败'));
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

                    categoryDelete(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getGroupTree();
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
                categoryMove(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('移动成功'));
                        this.getGroupTree();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '移动失败'));
                    }
                });
            },
            onOpenScopeSure(value) {
                const params = {
                    id: this.editQuery.id,
                    property: 'openScope',
                    value: value
                };
                updateScope(params).then(re => {
                    const result = re.data;
                    if (!result.success) {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            },
            openScopeSure() {
                this.openScopeDialogVisible = false;
                this.getGroupTree();
            }
        }
    };
</script>
