<style lang="scss" src='./style.scss'>
</style>
<template>
    <article class="app-container survey__edit">
        <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
            <veln-form-section :title="$t('参与人员')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item :label="$t('签到范围') + '：'" prop="code">
                        <veln-organization-scope
                            :fun-code="funCode"
                            :business-id="businessId"
                            :app-code="appCode"
                            :route="route"
                        />
                    </el-form-item>
                </section>
            </veln-form-section>
            <el-form-item prop="code">
                <section class="form__page__btn">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button @click="last">{{ $t('上一步') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('完成') }}</el-button>
                </section>
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnSteps from '@/components/VelnSteps';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {save, getInfoById} from '@/api/survey/surveyInfo';

    export default {
        name: 'Participants',
        components: {
            VelnFormSection,
            VelnSteps,
            VelnOrganizationScope
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: false
                }
            ];
            return {
                steps,
                active: 1,
                editQuery: {
                    id: this.$route.query.id
                },
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
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                }
            },
            last() {
                this.$router.push({
                    name: 'surveyBaseInfo',
                    query: {id: this.$route.query.id}
                });
            },
            sure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                save(this.editQuery).then(res => {
                    this.$store.dispatch('setAjaxIng', false);
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.$router.push({name: 'surveyList'});
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
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
            },
            cancel() {
                this.$router.push({name: 'surveyBaseInfo'});
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.$router.push({
                            name: 'surveyBaseInfo',
                            query: {id: this.$route.query.id}
                        });
                        break;
                }
            }
        }
    };
</script>
