<style lang="scss">
    .user-container{
        padding: 10px 20px;
        .el-tag{
            margin: 0 10px 10px 0;
        }
    }
    .user-img-list{
        .user__cover{
            max-width: 300px;
            margin: 0 20px 20px 0;
            vertical-align: top;
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
            <veln-form-section :title="$t('签到信息')" :can-expand="false">
                <el-form-item :label="$t('签到时间') + '：'">
                    {{ data.signTime ? data.signTime : '--' }}
                </el-form-item>
                <el-form-item :label="$t('地点位置') + '：'">
                    {{ data.address ? data.address : '--' }}
                </el-form-item>
                <el-form-item v-if="data.imgUrls && data.imgUrls.length>0" :label="$t('拍摄照片') + '：'">
                    <div class="user-img-list">
                        <span v-for="(item, index) in data.imgUrls" :key="index">
                            <img
                                v-if="item"
                                class="user__cover"
                                :src="item"
                            >
                        </span>
                    </div>
                </el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {getSignUserDetail} from '@/api/signUser';

    export default {
        name: 'SignUserInfo',
        components: {
            VelnFormSection
        },
        data() {
            return {
                userId: this.$route.query.userId,
                signId: this.$route.query.signId,
                data: {},
                user: {}
            };
        },
        created() {
            this.getSignUserDetail();
        },
        methods: {
            getSignUserDetail() {
                const params = {userId: this.userId, signId: this.signId};
                getSignUserDetail(params).then(res => {
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
