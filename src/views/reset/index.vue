<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="app-container password-container">
        <veln-form-section :title="$t('修改密码')" :can-expand="false">
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="120px">
                <el-form-item :label="$t('原密码'+'：')" prop="oldPassword">
                    <el-input v-model.trim="editQuery.oldPassword" type="password" minlength="6"/>
                </el-form-item>
                <el-form-item :label="$t('新密码'+'：')" prop="newPassword">
                    <el-input v-model.trim="editQuery.newPassword" type="password" minlength="6"/>
                </el-form-item>
                <el-form-item :label="$t('确认新密码'+'：')" prop="againPassword">
                    <el-input v-model.trim="editQuery.againPassword" type="password" minlength="6"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('editQuery')">提交</el-button>
                </el-form-item>
            </el-form>
        </veln-form-section>
    </article>
</template>
<script>
    import {modifyPwd} from '@/api/user';
    import VelnFormSection from '@/components/VelnFormSection';
    export default {
        name: 'ResetPassword',
        components: {
            VelnFormSection
        },
        data() {
            const validateOldPass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入密码'));
                } else if (value.length < 6 || value.length > 18) {
                    callback(new Error('密码6-18个字符'));
                } else if (this.editQuery.againPassword) {
                    this.$refs.editQuery.validateField('againPassword');
                }
                callback();
            };
            const validateNewPass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入密码'));
                } else if (value.length < 6 || value.length > 18) {
                    callback(new Error('密码6-18个字符'));
                } else if (this.editQuery.againPassword) {
                    this.$refs.editQuery.validateField('againPassword');
                }
                callback();
            };
            const validateAgainPass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请再次输入密码'));
                } else if (value.length < 6 || value.length > 18) {
                    callback(new Error('密码6-18个字符'));
                } else if (value !== this.editQuery.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                editQuery: {
                    oldPassword: '',
                    newPassword: '',
                    againPassword: ''
                },
                rules: {
                    oldPassword: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        },
                        {validator: validateOldPass, trigger: 'blur'}
                    ],
                    newPassword: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        },
                        {validator: validateNewPass, trigger: 'blur'}
                    ],
                    againPassword: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        },
                        {validator: validateAgainPass, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            submitForm(editQuery) {
                this.$refs[editQuery].validate((valid) => {
                    if (valid) {
                        const params = {
                            oldPassword: btoa(this.editQuery.oldPassword),
                            newPassword: btoa(this.editQuery.newPassword),
                            againPassword: btoa(this.editQuery.againPassword)
                        };
                        modifyPwd(params).then(res => {
                            const result = res.data;
                            if (result && result.success) {
                                this.$successMsg(this.$t('修改成功，即将跳转登录页'));
                                setTimeout(() => {
                                    this.$store.dispatch('LogOut').then(() => {
                                        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
                                    });
                                }, 2000);
                            } else {
                                this.$errorMsg(this.$t(result.msg || '修改失败'));
                            }
                        });
                    }
                });
            }
        }
    };
</script>
