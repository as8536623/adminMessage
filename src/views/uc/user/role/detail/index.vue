<style lang="scss" scoped>
    @import './style';
</style>

<template>
    <article class="app-container form__page">
        <section class="role__list__header">
            <span class="text-gray">{{ $t('角色权限') }}：</span>
            <el-checkbox
                v-model="checkedAll"
                :disabled="!checkPermission('addRole') && !checkPermission('k12-role')"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
            >{{ $t('全部功能') }}
            </el-checkbox>
        </section>
        <section class="role__list">
            <qgu-auth-table
                ref="table"
                :disabled="!checkPermission('addRole') && !checkPermission('k12-role')"
                :title="$t(roleTitle)"
                :icon="$route.query.manage ? 'pc' : 'mobile'"
                :data="roleList"
                :selected="roleSelected"
                @change="roleChange"
            />
        </section>
        <section class="text--center">
            <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
            <el-button @click="back">{{ $t('取消') }}</el-button>
        </section>
    </article>
</template>

<script>
    /**
     * TODO 需要根据真实数据联调
     */
    import QguAuthTable from '@/components/QguAuthTable';
    import {getCanManageAuthTree, getSelectedAuthIds} from '@/api/auth';
    import {addRoleAuthRel} from '@/api/roleAuthRel';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'RoleDetail',
        components: {
            QguAuthTable
        },
        data() {
            return {
                roleId: '',
                authId: '',
                roleName: '',
                roleTitle: '',
                roleList: [],
                roleSelected: [],
                roleSelectedAll: false,
                checkedAll: false,
                isIndeterminate: false
            };
        },
        created() {
            if (this.$route.query.roleId) {
                this.roleId = this.$route.query.roleId;
                this.roleName = this.$route.query.name;
                this.getSelectedAuthIds();
            }

            if (this.$route.query.authId) {
                this.authId = this.$route.query.authId;
            }
        },
        methods: {
            checkPermission,
            // 获取已选择权限树
            getSelectedAuthIds() {
                getSelectedAuthIds(this.roleId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.roleSelected = result.data;
                        this.getCanManageAuthTree();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取权限结构出错'));
                    }
                });
            },
            // 获取权限树
            getCanManageAuthTree() {
                getCanManageAuthTree(this.roleId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.roleTitle = result.data.child[0].name;
                        this.roleList = result.data.child[0].child || [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取权限结构出错'));
                    }
                });
            },
            roleChange(ids, checkedAll) {
                this.roleSelected = ids;
                this.roleSelectedAll = checkedAll;
                this.handleRoleChange();
            },
            handleRoleChange() {
                if (this.roleSelectedAll) {
                    this.isIndeterminate = false;
                    this.checkedAll = true;
                    return;
                }
                if (!this.roleSelected.length) {
                    this.isIndeterminate = false;
                    this.checkedAll = false;
                    return;
                }
                this.isIndeterminate = true;
                this.checkedAll = false;
            },
            handleCheckAllChange() {
                this.isIndeterminate = false;

                if (this.roleSelectedAll) {
                    this.$refs.table.empty();
                } else {
                    this.$refs.table.selecteAll();
                }
            },
            save() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                const authIds = this.roleSelected;
                const params = {
                    roleId: this.roleId,
                    authId: this.authId,
                    authIds
                };
                params.authIds = [...new Set(params.authIds)];
                addRoleAuthRel(params).then(re => {
                    this.$store.dispatch('setAjaxIng', false);
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.back();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '保存失败'));
                    }
                });
            },
            back() {
                history.go(-1);
            }
        }
    };
</script>
