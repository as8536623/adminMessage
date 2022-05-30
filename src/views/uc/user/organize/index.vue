<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container organize__wrapper">
        <qgu-tree :datalist="treeData" :show-include-child="false" :default-expand-all="false">
            <span slot-scope="{ node, data }" class="custom-tree-node">
                <span class="organize__tree__text">{{ data.name }}</span>
                <span class="tree__option">
                    <el-tooltip
                        v-if="checkPermission('addOrg') && data.manage && corpCode!=='jiayi'"
                        class="item"
                        effect="dark"
                        :content="$t('新增部门')"
                        placement="top"
                    >
                        <el-button class="add" type="text" size="mini" @click="add(data)">
                            <svg-icon class-name="tree__icon" icon-class="add_s"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip
                        v-if="checkPermission('addOrg') && data.manage"
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
                        v-if="checkPermission('delOrg') && !(data.code && data.code==='outer_org' || data.code==='outer_teacher') && data.manage"
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
                        v-if="checkPermission('addOrg') && data.manage"
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
                        v-if="checkPermission('addOrg') && data.manage"
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
                    <el-tooltip
                        v-if="checkPermission('updUserRange') && data.manage"
                        class="item"
                        effect="dark"
                        :content="$t('设置授权')"
                        placement="top"
                    >
                        <el-button class="auth__icon" type="text" size="mini" @click="editAuth(data)">
                            <svg-icon class-name="tree__icon" icon-class="person_s"/>
                        </el-button>
                    </el-tooltip>
                </span>
            </span>
        </qgu-tree>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t(editQuery.id ? '部门管理-编辑' : '部门管理-新增')"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="100px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('上级部门' + '：')">
                        <el-input v-model.trim="editQuery.pName" disabled/>
                    </el-form-item>
                    <el-form-item :label="$t('名称' + '：')" prop="name">
                        <el-input v-model.trim="editQuery.name" :maxlength="20"/>
                    </el-form-item>
                    <el-form-item :label="$t('编号' + '：')">
                        <el-input
                            v-model.trim="editQuery.code"
                            :maxlength="20"
                            :disabled="editQuery.code==='outer_org'||editQuery.code==='outer_teacher'"
                        />
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="cancel">取消</el-button>
                    <el-button
                        v-if="checkPermission('updOrg') || checkPermission('addOrg')"
                        type="primary"
                        @click="onSure"
                    >保存
                    </el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            v-if="authDialogVisible"
            append-to-body
            :title="$t('设置授权')"
            :visible.sync="authDialogVisible"
            width="939px"
        >
            <veln-auth-setting
                route="userRange"
                rel-type="ORG"
                :fun-id="funId"
                @onClose="authDialogVisible=false"
            />
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import VelnAuthSetting from '@/components/VelnAuthSetting';
    import {
        getOrgTree,
        insertOrg,
        updateOrg,
        deleteOrg,
        moveOrg
    } from '@/api/org';
    import checkPermission from '@/utils/permission';
    import {mapGetters} from 'vuex';

    export default {
        name: 'Organize',
        components: {
            QguTree,
            VelnAuthSetting
        },
        data() {
            return {
                treeData: [],
                dialogVisible: false,
                editQuery: {
                    id: '',
                    name: '',
                    code: null,
                    pId: '',
                    pName: ''
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
                funId: '',
                authDialogVisible: false
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        created() {
            this.getOrgTree();
        },
        methods: {
            checkPermission,
            getOrgTree() {
                getOrgTree().then(re => {
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
                    code: null,
                    pId: '',
                    pName: '',
                    version: this.editQuery.version
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
                    code: null,
                    pId: data.id,
                    pName: data.name
                };
                this.dialogVisible = true;
            },
            edit(data) {
                this.editType = 'EDIT';
                this.editQuery = {
                    id: data.id,
                    name: data.name,
                    code: data.code,
                    pId: data.pid,
                    pName: data.parentName
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
                            insertOrg(this.editQuery).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.dialogVisible = false;
                                    this.getOrgTree();
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                            return;
                        }

                        updateOrg(this.editQuery).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.dialogVisible = false;
                                this.getOrgTree();
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
                        orgId: data.id
                    };

                    deleteOrg(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getOrgTree();
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
                moveOrg(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('移动成功'));
                        this.getOrgTree();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '移动失败'));
                    }
                });
            },
            editAuth(data) {
                this.funId = data.id;
                this.authDialogVisible = true;
            }
        }
    };
</script>
