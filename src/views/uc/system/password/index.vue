<style lang="scss">
    @import "../style";
    @import "./style.scss";
</style>
<template>
    <article class="system-content password-content">
        <el-form
            ref="editQuery"
            :model="editQuery"
            :inline-message="true"
            :rules="rules"
        >
            <div class="system__item">
                <el-form-item>
                    <div class="system__title">{{ $t('学员修改密码规则') }}</div>
                </el-form-item>
                <el-form-item :label="$t('包含内容') + '：'" prop="pwdRule">
                    <el-checkbox-group v-model="editQuery.pwdRule">
                        <el-checkbox
                            v-for="(item, index) in PASSWORD_RULE_SET_ENUM.arr"
                            :key="index"
                            :label="item.code"
                        >
                            {{ item.name }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('密码最小长度') + '：'" prop="pwdMinLength">
                    <el-input v-model.number="editQuery.pwdMinLength" type="text"/>
                    <span class="system__desc">{{ $t('（8-20位）') }}</span>
                </el-form-item>
            </div>
            <div class="system__item">
                <el-form-item>
                    <div class="system__title">{{ $t('是否强制学员定期修改密码') }}</div>
                </el-form-item>
                <el-form-item class="el__form__checkbox" prop="pwdChangeCycle">
                    <el-checkbox v-model="editQuery.forcePwdChange">{{ $t('强制学员定期修改密码') }}</el-checkbox>
                    <span>{{ $t('密码更改周期'+'：') }}</span>
                    <el-input v-model.number="editQuery.pwdChangeCycle" type="text"/>
                    <span>{{ $t('天') }}</span>
                </el-form-item>
            </div>
            <div class="system__item">
                <el-form-item>
                    <div class="system__title">{{ $t('学员初始密码') }}</div>
                </el-form-item>
                <el-form-item class="el__form-password">
                    <el-input v-model="editQuery.defaultPwd" type="text"/>
                    <div class="system__desc">{{ desc }}</div>
                </el-form-item>
            </div>
        </el-form>
        <div class="system__btn">
            <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
        </div>
    </article>
</template>
<script>
    import {getPasswordSetting, editSetting} from '@/api/system/loginSetting';
    import {PASSWORD_RULE_SET_ENUM} from '@/enum';
    import {validateInteger} from '@/utils/validate';

    export default {
        name: 'PasswordSetting',
        data() {
            return {
                PASSWORD_RULE_SET_ENUM,
                editQuery: {
                    pwdMinLength: 8,
                    defaultPwd: '',
                    forcePwdChange: false,
                    pwdChangeCycle: '',
                    pwdRule: [],
                    id: '',
                    editType: 'PASSWORD_SETTING'
                },
                pwdRule: [],
                desc: this.$t('（管理员新增用户和重置密码时使用：若初始密码为空，当用户名包含中文字符时，密码为00000000；用户名不包含中文字符时，密码为用户名。）'),
                rules: {
                    pwdRule: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'change'
                        }
                    ],
                    pwdMinLength: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        },
                        {validator: validateInteger, trigger: 'blur'}
                    ],
                    pwdChangeCycle: [
                        {validator: validateInteger, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
            this.getPasswordSetting();
        },
        methods: {
            getPasswordSetting() {
                getPasswordSetting().then(res => {
                    const result = res.data;
                    if (result.success) {
                        const data = result.data;
                        this.editQuery = Object.assign({}, this.editQuery, data);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
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
