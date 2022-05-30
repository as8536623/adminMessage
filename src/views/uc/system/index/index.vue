<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container system-container">
        <el-tabs v-model="activeName">
            <el-tab-pane v-if="checkPermission('loginSet')" :label="$t('登录相关设置')" name="login">
                <login-setting v-if="activeName === 'login'"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('个性化登录')" name="personalized">
                <personalized-setting v-if="activeName === 'personalized'"/>
            </el-tab-pane>
            <el-tab-pane v-if="checkPermission('pwdSet')" :label="$t('密码相关设置')" name="password">
                <password-setting v-if="activeName === 'password'"/>
            </el-tab-pane>
            <el-tab-pane v-if="checkPermission('preventSet')" :label="$t('预防设置')" name="prevent">
                <prevent-setting v-if="activeName === 'prevent'"/>
            </el-tab-pane>
            <el-tab-pane v-if="checkPermission('otherSet')" :label="$t('其他设置')" name="other">
                <other-setting v-if="activeName === 'other'"/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script>
    import LoginSetting from '../login';
    import OtherSetting from '../other';
    import PasswordSetting from '../password';
    import PersonalizedSetting from '../personalized';
    import PreventSetting from '../prevent';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'SystemConfig',
        components: {
            LoginSetting,
            OtherSetting,
            PasswordSetting,
            PersonalizedSetting,
            PreventSetting
        },
        data() {
            return {
                activeName: 'login'
            };
        },
        methods: {
            checkPermission
        }
    };
</script>
