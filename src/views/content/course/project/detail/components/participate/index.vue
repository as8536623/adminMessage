<style lang="scss" src="./style.scss">
</style>

<template>
    <article>
        <el-form ref="editQuery" :model="editQuery" label-width="100px" :inline-message="true">
            <section class="tool-form-item">
                <el-form-item :label="$t('指定人员') + '：'" prop="code">
                    <veln-organization-scope
                        v-if="businessId"
                        :fun-code="funCode"
                        :business-id="businessId"
                        :app-code="appCode"
                        :route="route"
                        :read-only="true"
                    />
                </el-form-item>
                <!--<el-form-item :label="$t('报名人员') + '：'" v-if="applyList.includes('veln-enroll')">
                    <span v-if="!enrollId">{{$t('未设置报名')}}</span>
                    <section class="sign__up__set" v-else>
                        {{$t('已设置接受报名')}}
                        <el-button
                            size="small"
                            type="text"
                            class="face__btn"
                            @click="signUpView"
                        >{{$t('去查看')}}
                        </el-button>
                        <div>
                            <el-checkbox v-model="approve" disabled>报名需要审核</el-checkbox>
                        </div>
                    </section>
                </el-form-item>-->
            </section>
            <section class="tool-form-item">
                <el-form-item :label="$t('接受报名')">
                    <el-checkbox v-model="hasEnroll" disabled/>
                </el-form-item>
                <section v-if="hasEnroll">
                    <el-form-item :label="$t('报名时间') + '：'" class="required">
                        {{ enrollQuery.startTime }} ~ {{ enrollQuery.endTime }}
                    </el-form-item>
                    <el-form-item :label="$t('名额限制') + '：'" class="required">
                        {{ enrollQuery.limitNumber }}人
                    </el-form-item>
                    <el-form-item :label="$t('审核设置') + '：'" class="required">
                        <el-radio-group v-model="approveLabel" disabled>
                            <el-radio label="false">{{ $t('无需审核') }}</el-radio>
                            <el-radio label="true">{{ $t('手动审核') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('报名范围') + '：'" class="sign__label-item">
                        <veln-organization-scope
                            :read-only="true"
                            :fun-code="enroll.funCode"
                            :business-id="enrollId"
                            :app-code="enroll.appCode"
                            :route="enroll.route"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('外部人员') + '：'">
                        <el-radio
                            v-for="(item, index) in OUT_USER_JOIN_ENUM.arr"
                            :key="index"
                            v-model="enrollQuery.outerUser"
                            :label="item.code"
                            disabled
                        >{{ item.name }}
                        </el-radio>
                    </el-form-item>
                </section>

            </section>
        </el-form>
    </article>
</template>
<script>
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import {getEnroll} from '@/api/course/project/project';
    import {getAppCodes} from '@/api/system/csFeign';
    import {getMpEnrollInfo} from '@/api/enroll/enroll';
    import {OUT_USER_JOIN_ENUM} from '@/enum';

    export default {
        name: 'ProjectParticipate',
        components: {
            VelnOrganizationScope
        },
        data() {
            return {
                OUT_USER_JOIN_ENUM,
                editQuery: {
                    id: this.$route.query.id
                },
                approve: false,
                approveLabel: 'false',
                enrollId: '',
                hasEnroll: false,
                businessId: this.$route.query.id,
                funCode: 'MP',
                route: 'mpScope',
                appCode: 'veln-mp',
                applyList: [],
                enroll: {
                    businessId: '',
                    funCode: 'ENROLL',
                    route: 'enrollScope',
                    appCode: 'veln-enroll'
                },
                enrollQuery: {
                    isSave: false,
                    outerUser: false,
                    startTime: null,
                    endTime: null,
                    limitNumber: 0,
                    formList: [] // 自定义字段
                }

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
            // 编辑回显获取EnrollId
            getEnroll() {
                getEnroll(this.$route.query.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.enrollId = result.data && result.data.relId || '';
                        this.hasEnroll = this.enrollId && true;
                        this.approve = result.data && result.data.approve || false;
                        this.approveLabel = this.approve + '';
                        if (this.hasEnroll) {
                            this.getMpEnrollInfo(this.enrollId);
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            getMpEnrollInfo(id) {
                getMpEnrollInfo(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.enrollQuery = Object.assign(
                            {},
                            this.enrollQuery,
                            result.data
                        );
                        this.enrollQuery.formList = result.data && result.data.adminFormList || [];
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            signUpView() {
                this.$router.push({
                    name: 'signUpDetail',
                    query: {
                        sourceId: this.editQuery.id,
                        source: 'MP',
                        id: this.enrollId
                    }
                });
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
            toSignUp() {
                this.$router.push({
                    name: 'projectApply',
                    query: {sourceId: this.editQuery.id}
                });
            }
        }
    };
</script>
