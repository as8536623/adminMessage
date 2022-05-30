<style lang="scss" src="./style.scss"></style>

<template>
    <article class="app-container group__category">

        <qgu-tree :datalist="treeData" :default-expand-all="defaultExpandAll" :show-include-child="false">
            <span slot-scope="{ node, data }" class="custom-tree-node">
                <span class="organize__tree__text">{{ data.name }}</span>
                <span class="tree__option">
                    <el-tooltip
                        v-if="checkPermission('addCourseCategory') && data.manage"
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
                        v-if="checkPermission('updCourseCategory')"
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
                        v-if="checkPermission('delCourseCategory')"
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
                        v-if="checkPermission('moveCourseCategory')"
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
                        v-if="checkPermission('moveCourseCategory')"
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
                    <el-tooltip v-if="!hasBgk" class="item add" effect="dark" :content="$t('学员-可查看设置')" placement="top">
                        <el-button
                            v-if="checkPermission('courseCategoryOpen') && data.manage"
                            type="text"
                            size="mini"
                            @click="openScope(data)"
                        >
                            <svg-icon class-name="tree__icon" icon-class="range_s"/>
                        </el-button>
                    </el-tooltip>
                    <!--<el-tooltip class="item add" effect="dark" :content="$t('管理员-可使用授权')" placement="top">
                        <el-button v-if="checkPermission('addCourseCategory') && data.manage"
                                   type="text" size="mini" @click="userScope(data)">
                            <svg-icon class-name="tree__icon" icon-class="person_s"></svg-icon>
                        </el-button>
                    </el-tooltip>-->
                    <el-tooltip class="item add" effect="dark" :content="$t('管理员-可管理授权')" placement="top">
                        <el-button
                            v-if="checkPermission('courseCategoryUse') && data.manage"
                            type="text"
                            size="mini"
                            @click="authScope(data)"
                        >
                            <svg-icon class-name="tree__icon stu__message__icon" icon-class="km_m"/>
                        </el-button>
                    </el-tooltip>
                </span>
            </span>
        </qgu-tree>
        <el-dialog
            v-if="dialogVisible"
            :title="$t(editQuery.id ? '课程类别-编辑' : '课程类别-新增')"
            :visible.sync="dialogVisible"
            append-to-body
            width="500px"
            :before-close="handleClose"
        >
            <el-dialog
                v-if="categoryDialogVisible"
                :title="$t('选择课程类别')"
                :visible.sync="categoryDialogVisible"
                width="339px"
                @close="categoryDlgClose"
                append-to-body
            >
                <section>
                    <veln-course-category-select
                        ref="category"
                        :default-expand-all="defaultExpandAll"
                    />
                    <div class="dialog__btn__line">
                        <el-button @click="categoryDialogVisible=false">取消</el-button>
                        <el-button type="primary" @click="categorySelect">确定</el-button>
                    </div>
                </section>
            </el-dialog>
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="100px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('上级类别' + '：')">
                        <el-button
                            ref="categoryInput"
                            @click="showCategorySelect"
                            v-model.trim="editQuery.pName"
                            :placeholder="$t('上级类别')"
                            :max-length="32"
                        >{{editQuery.pName}}</el-button>
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
            <veln-open-scope
                app-code="veln-stu"
                :business-id="businessId"
                fun-code="OPEN_SCOPE"
                :con="editQuery.openScope"
                :allow-upload="editQuery.allowUpload"
                :allow-download="editQuery.allowDownload"
                :allow-share="editQuery.allowShare"
                :need-approve="editQuery.needApprove"
                route="openScope"
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
                app-code="veln-stu"
                :fun-id="funId"
                route="openScope"
                rel-type="USE_SCOPE"
                fun-code="USE_SCOPE"
                @onClose="useDialogVisible=false;"
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
                app-code="veln-stu"
                :fun-id="funId"
                route="openScope"
                rel-type="MANAGE_SCOPE"
                fun-code="MANAGE_SCOPE"
                @onClose="authDialogVisible=false;"
            />
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {deleteNode, getCategory, insertNode, moveNode, updateNode, updateScope} from '@/api/courseCategory';
    import VelnOpenScope from '@/components/VelnOpenScope';
    import checkPermission from '@/utils/permission';
    import VelnCourseCategorySelect from '@/components/VelnCourseCategorySelect';
    import VelnAuthSetting from '@/components/VelnAuthSetting';

    export default {
        name: 'CourseCategory',
        components: {
            QguTree,
            VelnOpenScope,
            VelnCourseCategorySelect,
            VelnAuthSetting
        },
        data() {
            const corpCode = this.$store.getters.corpCode;
            const hasBgk = 'bgk' === corpCode || 'bgh' === corpCode;
            return {
                hasBgk, // 北国会
                funCode: 'COURSE_CATEGORY',
                funName: '课程类别',
                businessId: '',
                treeData: [],
                dialogVisible: false,
                categoryDialogVisible: false,
                defaultExpandAll: true,
                categorySelected: {
                    categoryIdSelected: '',
                    categoryNameSelected: ''
                },
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
                    useScope: 'ALL',
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
            showCategorySelect() {
                this.categoryDialogVisible = true;
            },
            categoryDlgClose() {
                this.categoryDialogVisible = false;
            },
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.editQuery.pId = result.id;
                this.editQuery.pName = result.name;
                this.categoryDialogVisible = false;
            },
            openScope(data) {
                this.editQuery = {
                    id: data.id,
                    openScope: data.con || 'ALL',
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
                this.useDialogVisible = false;
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
                            insertNode(this.editQuery).then(re => {
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

                        updateNode(this.editQuery).then(re => {
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
                        categoryId: data.id
                    };

                    deleteNode(params).then(re => {
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
                moveNode(params).then(re => {
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
