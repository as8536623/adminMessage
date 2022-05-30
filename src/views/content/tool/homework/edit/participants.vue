<style lang="scss">
@import '../../style.scss';
</style>
<template>
    <article class="app-container tool-edit-container tool-participants">
        <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
            <veln-form-section :title="$t('新增作业')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item :label="$t('下发范围') + '：'" prop="code">
                        <veln-organization-scope
                            :fun-code="funCode"
                            :business-id="businessId"
                            :app-code="appCode"
                            :route="route"
                        />
                    </el-form-item>
                    <el-form-item v-if="editQuery.enableOuterUser" :label="$t('外部人员') + '：'">
                        <el-radio
                            v-for="(item, index) in OUT_USER_JOIN_ENUM.arr"
                            :key="index"
                            v-model="editQuery.outerUser"
                            :label="item.code"
                        >{{ item.name }}</el-radio>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="cancel">{{ $t('取消') }}</el-button>
                        <el-button @click="last">{{ $t('上一步') }}</el-button>
                        <el-button type="primary" @click="sure">{{ $t('完成') }}</el-button>
                    </el-form-item>
                </section>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnSteps from '@/components/VelnSteps';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {getWorkInfo, updateHomework} from '@/api/workInfo';
    import {OUT_USER_JOIN_ENUM} from '@/enum';

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
                    title: this.$t('作业设置'),
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
                OUT_USER_JOIN_ENUM,
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
