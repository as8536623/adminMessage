<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="project__apply aside__padding">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('人员信息')" :can-expand="false">
                <el-form-item :label="$t('报名范围') + '：'" prop="code">
                    <veln-organization-scope
                        :fun-code="funCode"
                        :business-id="businessId"
                        :app-code="appCode"
                        :route="route"
                    />
                </el-form-item>
                <el-form-item :label="$t('外部人员') + '：'">
                    <el-radio
                        v-for="(item, index) in OUT_USER_JOIN_ENUM.arr"
                        :key="index"
                        v-model="editQuery.outerUser"
                        :label="item.code"
                    >{{ item.name }}
                    </el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button @click="last">{{ $t('上一步') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('完成') }}</el-button>
                </el-form-item>
            </veln-form-section>
        </el-form>
    </div>
</template>

<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {OUT_USER_JOIN_ENUM} from '@/enum';
    import {getMpEnrollInfo} from '@/api/enroll/enroll';
    import {saveMpEnroll} from '@/api/course/project/student';

    export default {
        name: 'ProjectApply',
        components: {
            VelnFormSection,
            VelnOrganizationScope
        },
        data() {
            return {
                OUT_USER_JOIN_ENUM,
                sourceId: this.$route.query.sourceId,
                businessId: this.$route.query.id,
                editQuery: {
                    isSave: false,
                    outerUser: false,
                    formList: [], // 自定义字段
                    projectId: this.$route.query.sourceId
                },
                funCode: 'ENROLL',
                route: 'enrollScope',
                appCode: 'veln-enroll'
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.getMpEnrollInfo(this.$route.query.id);
            }
        },
        methods: {
            last() {
                history.back();
            },
            cancel() {
                this.$router.replace({
                    name: 'projectParticipate',
                    query: {
                        id: this.sourceId
                    }
                });
            },
            sure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                saveMpEnroll(this.editQuery).then(res => {
                    this.$store.dispatch('setAjaxIng', false);
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.cancel();
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            },
            getMpEnrollInfo(id) {
                const params = id;
                getMpEnrollInfo(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        this.editQuery.formList = result.data && result.data.adminFormList || [];
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
