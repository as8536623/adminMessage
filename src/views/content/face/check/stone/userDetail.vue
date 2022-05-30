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
                    {{ data.code }}
                </el-form-item>
                <el-form-item :label="$t('姓名') + '：'" class="required">
                    {{ data.name }}
                </el-form-item>
                <el-form-item :label="$t('用户名') + '：'" class="required">
                    {{ data.loginName }}
                </el-form-item>
                <el-form-item :label="$t('部门') + '：'" class="required">
                    {{ data.orgNamePath }}
                </el-form-item>
                <el-form-item :label="$t('岗位') + '：'">
                    {{ data.positionName ? data.positionName : '--' }}
                </el-form-item>
                <el-form-item :label="$t('手机') + '：'">
                    {{ data.mobile ? data.mobile : '--' }}
                </el-form-item>
                <el-form-item :label="$t('直属上级') + '：'">
                    {{ data.leaderName ? data.leaderName : '--' }}
                </el-form-item>
                <el-form-item v-if="data.roles && data.roles.length > 0" :label="$t('学员角色') + '：'">
                    <el-tag v-for="(item, index) in data.roles" :key="index" type="success">{{ item.name }}</el-tag>
                </el-form-item>
            </veln-form-section>
            <veln-form-section :title="$t('其他信息')" :can-expand="false">
                <el-form-item :label="$t('邮箱') + '：'">
                    {{ userDetail.email ? userDetail.email : '--' }}
                </el-form-item>
                <el-form-item :label="$t('身份证号码') + '：'">
                    {{ userDetail.idCard ? userDetail.idCard : '--' }}
                </el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {detail} from '@/api/face/stone';

    export default {
        name: 'StoneUserDetail',
        components: {
            VelnFormSection
        },
        data() {
            return {
                userId: this.$route.query.userId,
                data: {},
                userDetail: {}
            };
        },
        created() {
            this.detail();
        },
        methods: {
            detail() {
                const params = {userId: this.userId};
                detail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data;
                        this.userDetail = result.data.userDetail ? result.data.userDetail : {};
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
