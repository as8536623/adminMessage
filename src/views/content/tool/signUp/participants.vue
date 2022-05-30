<style lang="scss">
    @import '../style.scss';
</style>
<template>
    <article class="app-container tool-edit-container tool-participants">
        <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
            <veln-form-section :title="$t('参与人员')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item :label="$t('报名范围') + '：'" prop="code">
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
                        >{{ item.name }}
                        </el-radio>
                    </el-form-item>
                </section>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button @click="last">{{ $t('上一步') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('完成') }}</el-button>
            </section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnSteps from '@/components/VelnSteps';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {participantsInfoEdit, getInfoById} from '@/api/signUp';
    import {OUT_USER_JOIN_ENUM} from '@/enum';

    export default {
        name: 'SignUpParticipants',
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
                    title: this.$t('报名设置'),
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
                    outerUser: false,
                    sourceId: this.$route.query.sourceId, // 面授课程--活动
                    source: 'COMMON' // 面授课程--活动
                },
                businessId: this.$route.query.id,
                funCode: 'ENROLL',
                route: 'enrollScope',
                appCode: 'veln-enroll'
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.editQuery.source = this.$route.query.source;
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
                    name: 'signUpSetting',
                    query: {
                        id: this.$route.query.id,
                        sourceId: this.$route.query.sourceId,
                        source: this.$route.query.source,
                        activeName: this.$route.query.activeName
                    }
                });
            },
            sure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                participantsInfoEdit(this.editQuery).then(res => {
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
            // 编辑回显
            getInfoById(id) {
                const params = {id};
                getInfoById(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        this.editQuery.sourceId = this.$route.query.sourceId;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            cancel() {
                const sourceId = this.$route.query.sourceId;
                const source = this.$route.query.source;
                if (sourceId) {
                    if (source === 'FACE_ENROLL') {
                        // 返回面授参与人员页面
                        this.$router.push({name: 'courseParticipants', query: {id: sourceId}});
                    } else if (source === 'FACE_ENROLL_DETAIL') {
                        // 返回面授参与人员页面-详情页
                        this.$router.push({
                            name: 'faceCourseDetail',
                            query: {id: sourceId, activeName: this.$route.query.activeName}
                        });
                    }
                    return;
                }
                this.$router.push({name: 'signUp'});
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.$router.push({
                            name: 'basicInfo',
                            query: {
                                id: this.$route.query.id,
                                sourceId: this.$route.query.sourceId,
                                source: this.$route.query.source,
                                activeName: this.$route.query.activeName
                            }
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
