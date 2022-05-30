<style lang="scss">
@import '../../style.scss';
</style>
<template>
    <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
        <section class="tool-form-item">
            <el-form-item :label="$t('下发范围') + '：'" prop="code">
                <veln-organization-scope
                    :read-only="true"
                    :fun-code="funCode"
                    :business-id="businessId"
                    :app-code="appCode"
                    :route="route"
                />
            </el-form-item>
            <el-form-item :label="$t('外部人员') + '：'">
                {{ editQuery.outerUser? '可以参与，必须填写姓名和手机号' : '不可以参与' }}
            </el-form-item>
        </section>
    </el-form>
</template>
<script>
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {getWorkInfo, updateHomework} from '@/api/workInfo';

    export default {
        name: 'Participants',
        components: {
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
                    title: this.$t('签到设置'),
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
                active: 2,
                editQuery: {
                    id: this.$route.query.id,
                    outerUser: false
                },
                businessId: this.$route.query.id,
                funCode: 'WORK',
                route: 'workScope',
                appCode: 'veln-work'
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
                    name: 'homeworkSetting',
                    query: {id: this.$route.query.id}
                });
            },
            sure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                updateHomework(this.editQuery).then(res => {
                    this.$store.dispatch('setAjaxIng', false);
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.$router.push({name: 'homeworkList'});
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            },
            formatEditQuery() {
                // 防止后台数据为null
                this.editQuery.outerUser = this.editQuery.outerUser || false;
            },
            // 编辑回显
            getInfoById(id) {
                getWorkInfo(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        this.formatEditQuery();
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            cancel() {
                this.$router.push({name: 'homeworkList'});
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.$router.push({
                            name: 'singInBasicInfo',
                            query: {id: this.$route.query.id}
                        });
                        break;
                    case 1:
                        this.last();
                        break;
                }
            }
        }
    };
</script>
