<style lang="scss">
    .user-container{
        padding: 10px 20px;
        .el-tag{
            margin: 0 10px 10px 0;
        }
    }
</style>
<template>
    <article class="app-container user-container">
        <el-form
            label-width="140px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <el-form-item :label="$t('工号') + '：'" class="required">
                    {{ user.code }}
                </el-form-item>
                <el-form-item :label="$t('姓名') + '：'" class="required">
                    {{ user.name }}
                </el-form-item>
                <el-form-item :label="$t('用户名') + '：'" class="required">
                    {{ user.loginName }}
                </el-form-item>
                <el-form-item :label="$t('部门') + '：'" class="required">
                    {{ user.orgNamePath }}
                </el-form-item>
                <el-form-item :label="$t('岗位') + '：'">
                    {{ user.positionName ? user.positionName : '--' }}
                </el-form-item>
                <el-form-item :label="$t('手机') + '：'">
                    {{ user.mobile ? user.mobile : '--' }}
                </el-form-item>
                <el-form-item :label="$t('直属上级') + '：'">
                    {{ user.leaderName ? user.leaderName : '--' }}
                </el-form-item>
                <el-form-item v-if="user.roles && user.roles.length > 0" :label="$t('学员角色') + '：'">
                    <el-tag v-for="(item, index) in user.roles" :key="index" type="success">{{ item.name }}</el-tag>
                </el-form-item>
            </veln-form-section>
            <veln-form-section :title="$t('其他信息')" :can-expand="false">
                <el-form-item :label="$t('邮箱') + '：'">
                    {{ user.email ? user.email : '--' }}
                </el-form-item>
                <el-form-item :label="$t('身份证号码') + '：'">
                    {{ user.idCard ? user.idCard : '--' }}
                </el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {detail} from '@/api/face/user';
    import {SIGN_ORIGIN_ENUM} from '@/enum';

    export default {
        name: 'CheckUserDetail',
        components: {
            VelnFormSection
        },
        data() {
            return {
                id: this.$route.query.id,
                data: {},
                user: {},
                signOrigin: SIGN_ORIGIN_ENUM
            };
        },
        created() {
            this.detail();
        },
        methods: {
            detail() {
                const params = {id: this.id};
                detail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data;
                        this.user = result.data.user;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
