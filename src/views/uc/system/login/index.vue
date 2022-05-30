<style lang="scss">
    @import '../style';
    @import './style';
</style>
<template>
    <article class="system-content">
        <el-form ref="editQuery" :model="editQuery" :inline-message="true" :rules="rules">
            <div class="system__item">
                <el-form-item>
                    <div class="system__title">{{ $t('登录相关设置') }}</div>
                </el-form-item>
                <el-form-item :label="$t('是否限制学员登录时间' + '：')">
                    <el-radio-group v-model="editQuery.loginLimit">
                        <el-radio
                            v-for="(item, index) in LIMIT_LOGIN_ENUM.arr"
                            :key="index"
                            :label="item.code"
                        >{{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('例外学员' + '：')">
                    <el-button type="text" @click="exceptionPerson">{{ $t('添加例外学员') }}</el-button>
                    <span class="system__desc">{{ $t('（例外学员不受以上登录时间的限制，任何时间都可登录，admin为默认例外学员之一）') }}</span>
                </el-form-item>
                <el-form-item>
                    <el-tag
                        v-for="(item, index) in editQuery.exceptUserNameList"
                        :key="index"
                        type="success"
                    >{{ item }}
                    </el-tag>
                </el-form-item>
            </div>
            <div class="system__item">
                <el-form-item>
                    <div class="system__title">{{ $t('登录相关设置') }}</div>
                </el-form-item>
                <el-form-item prop="sessionTimeOut">
                    {{ $t('用户登录平台') }}
                    <el-input-number
                        v-model="editQuery.sessionTimeOut"
                        :precision="0"
                        :step="5"
                        :min="15"
                        :max="120"
                        :placeholder="$t('分钟')"
                    />
                    {{ $t('分钟内无任何操作或者有没刷新，账号自动退出登录') }}
                    <span
                        class="system__desc"
                    >{{ $t('（可设置的时间范围为15~120分钟）') }}</span>
                </el-form-item>
            </div>
            <div class="system__btn">
                <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
            </div>
        </el-form>
        <el-dialog
            v-if="dgpDialogVisible"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                route="loginExceptScope"
                fun-code="CS_EXCEPT_USER"
                :fun-id="roleIds"
                app-code="veln-cs"
                @onClose="dgpClose"
            />
        </el-dialog>
    </article>
</template>
<script>
    import {editSetting, loginSetting} from '@/api/system/loginSetting';
    import {LIMIT_LOGIN_ENUM} from '@/enum';
    import VelnDgpUser from '@/components/VelnDgpUser';
    import {validateInteger} from '@/utils/validate';

    export default {
        name: 'LoginSetting',
        components: {
            VelnDgpUser
        },
        data() {
            return {
                LIMIT_LOGIN_ENUM,
                editQuery: {
                    loginLimit: '',
                    sessionTimeOut: '',
                    id: '',
                    editType: 'LOGIN_SETTING '
                },
                dgpDialogVisible: false,
                roleIds: '',
                rules: {
                    sessionTimeOut: [
                        {validator: validateInteger, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
            this.loginSetting();
        },
        methods: {
            // 获取登录相关信息
            loginSetting() {
                loginSetting().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        this.roleIds = result.data.corpCode;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            // 例外学员
            exceptionPerson() {
                this.dgpDialogVisible = true;
            },
            handleUserClose() {
                this.dgpDialogVisible = false;
                this.loginSetting();
            },
            dgpClose() {
                this.dgpDialogVisible = false;
                this.loginSetting();
            },
            // 保存
            save() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        editSetting(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            }
        }
    };
</script>
