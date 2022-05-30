<style lang="scss" src="../style.scss">
</style>
<template>
    <article class="system-content other-content">
        <el-form
            ref="editQuery"
            :model="editQuery"
            :inline-message="true"
        >
            <div class="system__item other__item">
                <el-form-item>
                    <div class="system__title">{{ $t('外部联系人') }}</div>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="editQuery.enableExternalContact">{{ $t('开启外部联系人功能') }}</el-checkbox>
                    <span class="system__desc">{{ $t('（开启后管理员新建项目时可设置是否支持公司联系人参与）') }}</span>
                </el-form-item>
            </div>
            <div class="system__item">
                <el-form-item>
                    <div class="system__title">{{ $t('标签设置') }}</div>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="editQuery.enableCustomLabel">{{ $t('开启标签自定义功能') }}</el-checkbox>
                    <span class="system__desc">{{ $t('（开启后管理员设置标签时可自定义标签）') }}</span>
                </el-form-item>
            </div>
            <!--            <div class="system__item">-->
            <!--                <el-form-item>-->
            <!--                    <div class="system__title">{{$t('课程审核')}}</div>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item>-->
            <!--                    <el-checkbox v-model="editQuery.enableCourseApprove">{{$t('开启课程审核功能')}}</el-checkbox>-->
            <!--                    <span class="system__desc">{{$t('（开启后管理员上传课程需要审核）')}}</span>-->
            <!--                    <el-button type="primary" @click="editFlow">编辑流程</el-button>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item>-->
            <!--                    <div class="system__title">{{$t('流程名称')}}</div>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item>-->
            <!--                    {{(flow && flow.name) || '暂无'}}-->
            <!--                    <div class="workflow__preview">-->
            <!--                        <workflow-editor ref="wf" :flowData="flowData" :canEdit="false"></workflow-editor>-->
            <!--                    </div>-->
            <!--                </el-form-item>-->
            <!--            </div>-->
            <div class="system__btn">
                <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
            </div>
        </el-form>
    </article>
</template>
<script>
    import {corpConfig, editCorpConfig} from '@/api/system/corpConfig';
    import {getDeployedModelByKey} from '@/api/workflow/model';

    export default {
        name: 'OtherSetting',
        data() {
            return {
                flow: null,
                flowData: null,
                editQuery: {
                    enableExternalContact: false,
                    enableCustomLabel: false,
                    enableCourseApprove: false,
                    defKey: 'STU_COURSE_APPROVE',
                    definitionId: '',
                    editType: 'OTHER_SETTING',
                    id: ''
                }
            };
        },
        created() {
            this.corpConfig();
            // this.getDeployedModelByKey();
        },
        methods: {
            save() {
                // if (this.editQuery.enableCourseApprove && !this.flow) {
                //     this.$errorMsg(this.$t('请设置课程审核流程'));
                //     return;
                // }
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                editCorpConfig(this.editQuery).then(res => {
                    this.$store.dispatch('setAjaxIng', false);
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                    } else {
                        this.$errorMsg(this.$t(result.msg || '保存失败'));
                    }
                });
            },
            corpConfig() {
                corpConfig().then(res => {
                    const result = res.data;
                    if (result.success) {
                        const {enableExternalContact, enableCustomLabel, enableCourseApprove, definitionId, id} =
                            result.data;
                        this.editQuery.enableExternalContact = enableExternalContact;
                        this.editQuery.enableCustomLabel = enableCustomLabel;
                        this.editQuery.enableCourseApprove = enableCourseApprove;
                        this.editQuery.definitionId = definitionId;
                        this.editQuery.id = id;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            editFlow() {
                const key = 'STU_COURSE_APPROVE';
                window.open(`http://veln.qgutech.com/workflow/#/workflow/index?appCode=veln-stu&defKey=${key}`);
            },
            async getDeployedModelByKey() {
                const re = await getDeployedModelByKey(this.editQuery.defKey);
                const result = re.data;
                if (!result.success) {
                    this.$errorMsg(this.$t('获取流程信息出错'));
                    return;
                }

                this.editQuery.definitionId = result.data.definitionId;
                this.flow = result.data;
                this.flowData = JSON.parse(result.data.mateInfo);
            }
        }
    };
</script>
