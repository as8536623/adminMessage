<style lang="scss" src='./style.scss'>
</style>
<template>
    <article class="app-container survey__edit">
        <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
            <section class="tool-form-item">
                <el-form-item :label="$t('签到范围') + '：'" prop="code">
                    <veln-organization-scope
                        :read-only="true"
                        :fun-code="funCode"
                        :business-id="businessId"
                        :app-code="appCode"
                        :route="route"
                    />
                </el-form-item>
            </section>
        </el-form>
    </article>
</template>
<script>
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {getInfoById} from '@/api/survey/surveyInfo';

    export default {
        name: 'SurveyDetailParticipants',
        components: {
            VelnOrganizationScope
        },
        data() {
            return {
                editQuery: {},
                businessId: this.$route.query.id,
                funCode: 'SURVEY',
                route: 'surveyScope',
                appCode: 'veln-qtn'
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.getInfoById(this.$route.query.id);
                }
            },
            // 编辑回显
            getInfoById(id) {
                getInfoById(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
