<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="app-container role__list">
        <header class="role__list__header">{{ $t('角色管理') }}</header>
        <ul class="role__list__main">
            <li
                v-if="(checkPermission('addRole') || checkPermission('k12-addRole'))"
                class="role__list__add"
                @click="edit('ADD')"
            >
                <i class="el-icon-plus"/>
                <span class="role__add__text">{{ $t('添加角色') }}</span>
            </li>
            <li
                v-for="(role, index) in list"
                v-show="!hasBgk || role.manage"
                :key="index"
                class="role__item"
                :class="{'manage': role.manage}"
            >
                <svg-icon
                    v-if="role.manage"
                    icon-class="manager"
                    class-name="role__manager"
                />
                <div class="role__item__icon"/>
                <el-tooltip
                    v-if="(checkPermission('delRoles') || checkPermission('k12-delRoles'))"
                    :content="$t('删除')"
                    placement="top"
                >
                    <i
                        v-if="checkDefaultAdmin(role.code)"
                        class="el-icon-delete role__item--delete"
                        @click="deleteRole(role)"
                    />
                </el-tooltip>
                <div class="role__item__info">
                    <div class="role__name">
                        <span class="role__name__text">{{ role.name }}</span>
                        <svg-icon
                            v-if="(checkPermission('addRole') || checkPermission('k12-addRole')) && role.canEdit"
                            icon-class="edit"
                            class-name="role__name__edit"
                            @click="edit('EDIT', role)"
                        />
                    </div>
                    <div class="role__opt">
                        <span class="role__opt__user" @click="viewPerson(role)">
                            <span class="role__opt__user__text">{{ $t(((checkPermission('addRole') || checkPermission('k12-addRole')) &&
                                role.canEdit)?'人员设置':'查看人员')
                            }}</span>
                            <span
                                v-if="role.manage"
                                class="role__opt__user__num"
                            >「{{ role.userCount }}」</span>
                        </span>
                        <span class="role__opt__line" :class="{'normal': !role.manage}"/>
                        <span
                            v-if="!(role.code && role.code.includes('default_admin'))"
                            class="role__opt__auth"
                            @click="viewRole(role)"
                        >
                            {{ $t((checkPermission('addRole') &&
                                role.canEdit)?'设置权限':'查看权限')
                            }}
                        </span>
                        <span v-if="(role.code && role.code.includes('default_admin'))" class="role__opt__auth">
                            {{ $t('所有权限') }}
                        </span>
                    </div>
                </div>
            </li>
        </ul>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t(editType === 'ADD' ? '角色管理-新增' : '角色管理-编辑')"
            :visible.sync="dialogVisible"
            width="430px"
            :before-close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="97px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('角色名称') + '：'" prop="name">
                        <el-input
                            v-model="editQuery.name"
                            :maxlength="20"
                            @keyup.enter.native="onSure"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('角色类型') + '：'" prop="manage">
                        <el-radio v-model="editQuery.manage" :label="true">{{ $t('管理员') }}</el-radio>
                        <el-radio v-if="!hasBgk && false" v-model="editQuery.manage" :label="false">{{ $t('学员') }}</el-radio>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="dialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="onSure">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
    </article>
</template>

<script>
    import {roleDelete, roleListAll, roleSave, roleUpdate} from '@/api/role';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'RoleList',
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            return {
                hasBgk, // 北国会
                list: [],
                editType: 'ADD',
                dialogVisible: false,
                editQuery: {
                    manage: true,
                    name: ''
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入角色名称'),
                            trigger: 'blur'
                        }
                    ],
                    manage: [
                        {
                            required: true,
                            message: this.$t('请选择角色类型'),
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        computed: {
            checkDefaultAdmin() {
                return function (code) {
                    const DEFAULT_ADMIN_CODE = ['default_admin', 'supplier', 'default_user']
                    return !DEFAULT_ADMIN_CODE.some(v => v === code);
                }
            }
        },
        created() {
            this.roleListAll();
        },
        methods: {
            checkPermission,
            roleListAll() {
                roleListAll().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.list = this.list.concat(result.data || []);
                        this.list.sort((a, b) => b.manage - a.manage);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取角色数据出错'));
                    }
                });
            },
            // 新增、修改 角色
            edit(type, data) {
                this.editType = type;
                if (type === 'ADD') {
                    this.editQuery.name = '';
                    this.editQuery.manage = true;
                }
                if (type === 'EDIT') {
                    this.editQuery = {
                        id: data.id,
                        name: data.name,
                        manage: data.manage
                    };
                }
                this.dialogVisible = true;
            },
            handleClose() {
                this.editQuery = {
                    manage: true,
                    name: ''
                };
                this.dialogVisible = false;
            },
            onSure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.editType === 'ADD') {
                            roleSave(this.editQuery).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.dialogVisible = false;
                                    this.list = [];
                                    this.roleListAll();
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                            return;
                        }

                        roleUpdate(this.editQuery).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.dialogVisible = false;
                                this.list = [];
                                this.roleListAll();
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                    }
                });
            },
            viewRole(role) {
                this.$router.push({
                    name: 'roleDetail',
                    query: {
                        roleId: role.id,
                        manage: role.manage
                    }
                });
            },
            viewPerson(role) {
                this.$router.push({
                    name: 'roleUser',
                    query: {
                        roleId: role.id,
                        roleName: role.name,
                        manage: role.manage
                    }
                });
            },
            deleteRole(role) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const data = [role.id];
                    roleDelete(data).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.activeRole = {};
                            this.list = [];
                            this.roleListAll();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            }
        }
    };
</script>
