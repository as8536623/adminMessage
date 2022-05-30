<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail tool-participants">
        <el-form label-width="140px" :inline-message="true">
            <veln-form-section :title="$t('参与人员')" :can-expand="false">
                <!--<span class="sign__edit__btn" @click="edit">{{$t('编辑')}}</span>-->
                <el-form-item :label="$t('签到范围') + '：'" class="sign__label-item">
                    <veln-organization-scope
                        :read-only="true"
                        :fun-code="funCode"
                        :business-id="businessId"
                        :app-code="appCode"
                        :route="route"
                    />
                </el-form-item>
                <el-form-item :label="$t('外部人员') + '：'">
                    {{ data.outerUser? '可以参与，必须填写姓名和手机号' : '不可以参与' }}
                </el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {OUT_USER_JOIN_ENUM} from '@/enum';

    export default {
        name: 'Participants',
        components: {
            VelnFormSection,
            VelnOrganizationScope
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                }
            },
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                OUT_USER_JOIN_ENUM,
                businessId: this.id,
                funCode: 'SIGN',
                route: 'signScope',
                appCode: 'veln-sign'
            };
        },
        methods: {
            edit() {
                this.$emit('editHandle', 'participants');
            }
        }
    };
</script>
