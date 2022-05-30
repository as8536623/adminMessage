<style lang="scss">
    @import '../../style';
</style>
<template>
    <article class="app-container tool-edit-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="160px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('新增作业')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item :label="$t('允许重新提交作业') + '：'">
                        <el-radio-group v-model="editQuery.resubmit">
                            <el-radio :label="true">{{ $t('是') }}</el-radio>
                            <el-radio :label="false">{{ $t('否') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('作业完成条件') + '：'">
                        <el-radio-group v-model="editQuery.finishConditions">
                            <el-radio
                                v-for="(item, index) in HOMEWORK_FINISH_ENUM.arr"
                                :key="index"
                                :label="item.code"
                            >{{ $t(item.name) }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        v-if="editQuery.finishConditions === 'PASS'"
                        :label="$t('作业满分') + '：'"
                        prop="fullScore"
                        class="required"
                    >
                        <el-input
                            v-model="editQuery.fullScore"
                            :placeholder="$t('请输入作业满分')"
                            maxlength="3"
                        />
                    </el-form-item>
                    <el-form-item
                        v-if="editQuery.finishConditions === 'PASS'"
                        :label="$t('作业及格分') + '：'"
                        prop="passingScore"
                        class="required"
                    >
                        <el-input
                            v-model="editQuery.passingScore"
                            :placeholder="$t('请输入作业及格分')"
                            maxlength="3"
                        />
                    </el-form-item>
                    <el-form-item v-if="!editQuery.sourceId" :label="$t('提醒方式') + '：'">
                        <el-checkbox-group v-model="editQuery.remindType">
                            <el-checkbox
                                v-for="item in reminder.arr"
                                :key="item.code"
                                :label="item.code"
                            >{{ $t(item.name) }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div class="tool__tip">{{ $t('即将到达作业提交截止时间、作业结果发布、提醒评阅人阅卷') }}</div>
                    </el-form-item>
                    <el-form-item :label="$t('评阅人') + '：'" prop="reviewer" :rules="rules.required">
                        <el-button
                            v-if="!editQuery.reviewerName"
                            type="primary"
                            @click="showAuditDlg"
                        >{{ $t('选择评阅人') }}
                        </el-button>
                        <el-tag
                            v-if="editQuery.reviewerName"
                            closable
                            @close="auditUserRemove"
                        >{{ editQuery.reviewerName }}
                        </el-tag>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="cancel">{{ $t('取消') }}</el-button>
                        <el-button @click="last">{{ $t('上一步') }}</el-button>
                        <el-button type="primary" @click="sure">{{ editQuery.sourceId ? $t('完成') : $t('下一步') }}
                        </el-button>
                    </el-form-item>
                </section>
            </veln-form-section>
        </el-form>
        <el-dialog
            append-to-body
            :title="$t('选择直接上级')"
            :visible.sync="personDialogVisible"
            width="920px"
        >
            <veln-person-select ref="person"/>
            <div>
                <div class="vps__btn__line">
                    <el-button @click="personDialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="personSelect">保存</el-button>
                </div>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import VelnFormSection from '@/components/VelnFormSection';
    import {getWorkInfo, updateHomework} from '@/api/workInfo';
    import {REMINDER_ENUM, HOMEWORK_FINISH_ENUM} from '@/enum';
    import {validateInteger} from '@/utils/validate';
    import VelnPersonSelect from '@/components/VelnPersonSelect';

    export default {
        name: 'SignInSetting',
        components: {
            VelnSteps,
            VelnFormSection,
            VelnPersonSelect
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
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                HOMEWORK_FINISH_ENUM,
                steps,
                reminder: REMINDER_ENUM,
                active: 1,
                rules: {
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ],
                    fullScore: [{validator: validateInteger, trigger: 'blur'}],
                    passingScore: [{validator: validateInteger, trigger: 'blur'}]
                },
                editQuery: {
                    id: this.$route.query.id,
                    remindType: [],
                    resubmit: null,
                    finishConditions: null,
                    fullScore: 100,
                    passingScore: 60,
                    reviewer: null,
                    reviewerName: null,
                    finish: false,
                    sourceId: this.$route.query.sourceId, // 面授课程--作业
                    source: this.$route.query.source // 面授课程--作业
                },
                remindType: [],
                personDialogVisible: false
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.sourceId) {
                    this.steps.pop();
                    this.editQuery.finish = true;
                }
                if (this.$route.query.id) {
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                    this.getInfoById(this.$route.query.id);
                }
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.last();
                        break;
                    case 2:
                        this.next();
                        break;
                }
            },
            cancel() {
                const sourceId = this.$route.query.sourceId;
                // 返回面授添加互动页面
                if (sourceId) {
                    if (this.$route.query.quick) {
                        this.$router.push({
                            name: 'quickInteraction',
                            query: {id: sourceId}
                        });
                    } else {
                        this.$router.push({name: 'courseInteraction', query: {id: sourceId}});
                    }
                    return;
                }
                this.$router.push({name: 'homeworkList'});
            },
            sure() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    if (this.$store.getters.ajaxIng) {
                        return;
                    }
                    this.$store.dispatch('setAjaxIng', true);
                    if (this.editQuery.sourceId) {
                        this.editQuery.finish = true;
                    }
                    updateHomework(this.editQuery).then(res => {
                        this.$store.dispatch('setAjaxIng', false);
                        const result = res.data;
                        if (result.success) {
                            this.$successMsg(this.$t('保存成功'));
                            // 返回面授添加互动页面
                            if (this.$route.query.sourceId) {
                                this.cancel();
                                return;
                            }
                            this.next();
                        } else {
                            this.$errorMsg(result.msg || this.$t('保存失败'));
                        }
                        this.dialogVisible = false;
                    });
                });
            },
            last() {
                const sourceId = this.$route.query.sourceId;
                let name = 'homeworkBaseInfo';
                if (sourceId) {
                    name = 'faceHomeworkBase';
                }
                this.$router.push({
                    name,
                    query: {
                        id: this.editQuery.id,
                        sourceId,
                        source: this.editQuery.source
                    }
                });
            },
            next() {
                this.$router.push({
                    name: 'homeworkParticipants',
                    query: {id: this.$route.query.id}
                });
            },
            // 处理一些默认值
            formatEditQuery() {
                this.editQuery.remindType = this.editQuery.remindType.filter(
                    item => !!item
                );
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
                        this.editQuery.sourceId = this.$route.query.sourceId;
                        this.formatEditQuery();
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            personSelect() {
                const $person = this.$refs.person;
                const result = $person.getActive();
                this.editQuery.reviewer = result.id;
                this.editQuery.reviewerName = result.name;
                this.personDialogVisible = false;
            },
            showAuditDlg() {
                this.personDialogVisible = true;
            },
            auditUserRemove() {
                this.$confirm(this.$t('确定移除该评阅人么？'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                }).then(() => {
                    this.editQuery.reviewer = '';
                    this.editQuery.reviewerName = '';
                });
            }
        }
    };
</script>
