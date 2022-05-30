<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="aside__padding">
        <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
            <veln-form-section :title="$t('参与人员')" :can-expand="false">
                <section class="tool-form-item">
                    <el-form-item :label="$t('指定人员') + '：'" prop="code">
                        <veln-organization-scope
                            v-if="businessId"
                            :fun-code="funCode"
                            :business-id="businessId"
                            :app-code="appCode"
                            :route="route"
                        />
                    </el-form-item>
                    <el-form-item v-if="applyList.includes('veln-enroll')" :label="$t('报名人员') + '：'">
                        <el-button
                            v-if="!enrollId"
                            size="small"
                            type="text"
                            @click="toSignUp"
                        >{{ $t('添加报名') }}
                        </el-button>
                        <section v-else class="sign__up__set">
                            {{ $t('已设置接受报名') }}
                            <el-button
                                size="small"
                                type="text"
                                class="face__btn"
                                @click="signUpView"
                            >{{ $t('去查看') }}
                            </el-button>
                            <el-button
                                v-if="enrollId"
                                type="text"
                                class="face__del__btn"
                                @click="delEnroll(enrollId)"
                            >
                                {{ $t('删除') }}
                            </el-button>
                            <div>
                                <el-checkbox v-model="approve">报名需要审核</el-checkbox>
                            </div>
                        </section>
                    </el-form-item>
                </section>
            </veln-form-section>
            <el-form-item>
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button @click="last">{{ $t('上一步') }}</el-button>
                <el-button type="primary" @click="next">{{ $t('完成') }}</el-button>
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {delEnroll, getEnroll, updateEnroll} from '@/api/course/project/project';
    import {getAppCodes} from '@/api/system/csFeign';

    export default {
        name: 'ProjectParticipate',
        components: {
            VelnFormSection,
            VelnOrganizationScope
        },
        data() {
            return {
                editQuery: {
                    id: this.$route.query.id
                },
                approve: false,
                enrollId: '',
                businessId: this.$route.query.id,
                funCode: 'MP',
                route: 'mpScope',
                appCode: 'veln-mp',
                applyList: []
            };
        },
        created() {
            this.init();
            this.getAppCodes();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.getEnroll();
                }
            },
            // 获取公司应用
            getAppCodes() {
                getAppCodes().then(res => {
                    const result = res.data;
                    if (result.length) {
                        this.applyList = result || [];
                    }
                });
            },
            last() {
                this.$router.replace({
                    name: 'projectBasic',
                    query: {id: this.editQuery.id}
                });
            },
            sure() {
                this.$router.push({name: 'projectList'});
            },
            next() {
                if (this.enrollId) {
                    this.updateEnroll();
                } else {
                    this.confirm();
                }
            },
            confirm() {
                this.$confirm(this.$t('学习项目已创建成功，你还可以进行'), {
                    confirmButtonText: this.$t('任务管理'),
                    cancelButtonText: this.$t('返回'),
                    type: 'success'
                }).then(() => {
                    this.$router.push({
                        name: 'projectTask',
                        query: {
                            id: this.editQuery.id
                        }
                    });
                }).catch(() => {
                    this.cancel();
                });
            },
            // 编辑回显获取EnrollId
            getEnroll() {
                getEnroll(this.$route.query.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.enrollId = result.data && result.data.relId || '';
                        this.approve = result.data && result.data.approve || false;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            cancel() {
                this.$router.push({name: 'projectList'});
            },
            toSignUp() {
                this.$router.push({
                    name: 'projectApply',
                    query: {sourceId: this.editQuery.id}
                });
            },
            signUpView() {
                this.$router.push({
                    name: 'projectApply',
                    query: {
                        sourceId: this.editQuery.id,
                        id: this.enrollId
                    }
                });
            },
            // 删除报名
            delEnroll() {
                const params = {proId: this.editQuery.id, relId: this.enrollId};
                delEnroll(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.getEnroll();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            },

            updateEnroll() {
                const params = {
                    proId: this.editQuery.id,
                    enrollId: this.enrollId,
                    approve: this.approve
                };
                updateEnroll(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.confirm();
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            }
        }
    };
</script>

