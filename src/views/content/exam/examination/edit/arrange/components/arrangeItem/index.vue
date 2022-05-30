<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="arrange-item-content">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <el-form-item v-if="total > 1" :label="$t('批次名称') + '：'" prop="batchName">
                <el-input
                    v-model.trim="editQuery.batchName"
                    class="input__limit"
                    type="text"
                    :placeholder="$t('长度小于50')"
                    maxlength="50"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item :label="$t('考试开始时间') + '：'" prop="startTime">
                <veln-datetime v-model="editQuery.startTime" @input="timeChange"/>
            </el-form-item>
            <el-form-item :label="$t('考试结束时间') + '：'" prop="endTime">
                <veln-datetime v-model="editQuery.endTime" @input="timeChange"/>
            </el-form-item>
            <el-form-item :label="$t('考试范围') + '：'">
                <!--<span class="arrange__user">-->
                <!--{{editQuery.typeCountMap && editQuery.typeCountMap.USER ?-->
                <!--editQuery.typeCountMap.USER + $t('人') : 0 + $t('人')}} +-->
                <!--{{editQuery.typeCountMap && editQuery.typeCountMap.ORG ?-->
                <!--editQuery.typeCountMap.ORG + $t('个组织') : 0 + $t('个组织')}}-->
                <!--</span>-->
                <!--<el-button type="text" @click="selectStudent">{{$t('添加考生')}}</el-button>-->
                <!--<el-button type="text" @click="selectOrganize">{{$t('添加组织')}}</el-button>-->
                <veln-organization-scope
                    fun-code="EXAM_USER"
                    :business-id="data.id"
                    :app-code="$appCodes.pe + '/pe'"
                    route="examUser"
                />
            </el-form-item>
            <!--<el-form-item :label="$t('监考员设置') + '：'">-->
            <!--<div v-if="editQuery.monitorUsers && editQuery.monitorUsers.length" style="display: inline-block">-->
            <!--<el-tag-->
            <!--type="success"-->
            <!--v-for="(item, index) in editQuery.monitorUsers"-->
            <!--:key="index"-->
            <!--&gt;{{item.name}}-->
            <!--</el-tag>-->
            <!--</div>-->
            <!--<el-button type="text" @click="selectProctor">{{$t('添加监考员')}}</el-button>-->
            <!--</el-form-item>-->
        </el-form>
        <el-tooltip class="item arrange-del" effect="dark" :content="$t('删除')" placement="bottom">
            <el-button type="text" size="mini" @click="del()">
                <svg-icon class-name="tree__icon" icon-class="del"/>
            </el-button>
        </el-tooltip>
        <el-dialog
            v-if="dgpDialogVisible"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                ref="dgpUser"
                route="examUser"
                fun-code="EXAM_USER"
                :fun-id="data.id"
                :app-code="$appCodes.pe + '/pe'"
                @onClose="dgpClose"
            />
        </el-dialog>
        <el-dialog
            v-if="authDialogVisible"
            append-to-body
            :title="$t('选择监考员')"
            :visible.sync="authDialogVisible"
            width="939px"
            @close="handleAuthClose"
        >
            <veln-auth-setting
                ref="authSetting"
                :app-code="$appCodes.pe + '/pe'"
                :fun-id="data.id"
                route="examAuth"
                rel-type="user"
                fun-code="MONITOR_USER"
                @onClose="authClose"
            />
        </el-dialog>
        <el-dialog
            :key="orgDialogKey"
            append-to-body
            :title="$t('选择组织')"
            :visible.sync="orgDialogVisible"
            width="939px"
            @close="handleOrgClose"
        >
            <veln-dgp-org
                ref="dgpOrg"
                :app-code="$appCodes.pe + '/pe'"
                :route="route"
                :fun-code="funCode"
                :fun-id="data.id"
                :types="['ORG']"
                @onClose="orgClose"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnDgpUser from '@/components/VelnDgpUser';
    import VelnAuthSetting from '@/components/VelnAuthSetting';
    import moment from 'moment';
    import VelnDgpOrg from '@/components/VelnDgpOrg';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    export default {
        name: 'ArrangeItem',
        components: {
            VelnDgpUser,
            VelnAuthSetting,
            VelnDgpOrg,
            VelnOrganizationScope
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        batchName: '',
                        startTime: '',
                        endTime: '',
                        monitorUserIds: [],
                        id: ''
                    };
                }
            },
            index: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                default: 0
            },
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            const validatorStartTime = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('请输入开始时间')));
                } else if (moment(value).isBefore(moment())) {
                    callback(new Error(this.$t('开始时间不能早于当前时间')));
                } else if (
                    this.editQuery.endTime &&
                    value >= this.editQuery.endTime
                ) {
                    callback(new Error(this.$t('开始时间不能小于结束时间')));
                } else {
                    callback();
                }
            };
            const validatorEndTime = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('请输入结束时间')));
                } else if (moment(value).isBefore(moment())) {
                    callback(new Error(this.$t('结束时间不能早于当前时间')));
                } else if (
                    this.editQuery.startTime &&
                    value <= this.editQuery.startTime
                ) {
                    callback(new Error(this.$t('结束时间不能小于开始时间')));
                } else {
                    callback();
                }
            };
            return {
                editQuery: this.data,
                rules: {
                    batchName: [
                        {
                            required: true,
                            message: this.$t('请输入批次名称'),
                            trigger: 'blur'
                        }
                    ],
                    startTime: [
                        {
                            required: true,
                            message: this.$t('请选择开始时间'),
                            trigger: 'change'
                        },
                        {
                            validator: validatorStartTime,
                            trigger: 'change'
                        }
                    ],
                    endTime: [
                        {
                            required: true,
                            message: this.$t('请选择结束时间'),
                            trigger: 'change'
                        },
                        {
                            validator: validatorEndTime,
                            trigger: 'change'
                        }
                    ]
                },
                dgpDialogVisible: false,
                authDialogVisible: false,
                route: 'examUser',
                funCode: 'EXAM_USER',
                orgDialogVisible: false,
                orgDialogKey: null
            };
        },
        methods: {
            selectStudent() {
                this.dgpDialogVisible = true;
            },
            selectProctor() {
                this.authDialogVisible = true;
            },
            del() {
                this.$emit('del', this.index);
            },
            // 表单验证
            formValidate() {
                let result = false;
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        result = true;
                    }
                });
                return result;
            },
            handleUserClose() {
                this.dgpDialogVisible = false;
                const typeCountMap = {
                    USER: this.$refs.dgpUser.rightData ? this.$refs.dgpUser.rightData.length : 0
                }
                ;
                this.editQuery.typeCountMap = typeCountMap;
            },
            dgpClose() {
                this.dgpDialogVisible = false;
                const typeCountMap = {
                    USER: this.$refs.dgpUser.rightData ? this.$refs.dgpUser.rightData.length : 0
                }
                ;
                this.editQuery.typeCountMap = Object.assign({}, this.editQuery.typeCountMap, typeCountMap);
            },
            handleAuthClose() {
                this.authDialogVisible = false;
                this.editQuery.monitorUsers = this.$refs.authSetting.rightData ? this.$refs.authSetting.rightData : [];
            },
            authClose() {
                this.authDialogVisible = false;
                this.editQuery.monitorUsers = this.$refs.authSetting.rightData ? this.$refs.authSetting.rightData : [];
            },
            selectOrganize() {
                this.orgDialogVisible = true;
            },
            handleOrgClose() {
                this.orgDialogVisible = false;
            },
            orgClose() {
                this.orgDialogVisible = false;
                const typeCountMap = {
                    ORG: this.$refs.dgpOrg.rightData ? this.$refs.dgpOrg.rightData.length : 0
                };
                this.editQuery.typeCountMap = Object.assign({}, this.editQuery.typeCountMap, typeCountMap);
            },
            timeChange() {
                this.$refs.editQuery.validateField('startTime');
                this.$refs.editQuery.validateField('endTime');
            }
        }
    };
</script>
