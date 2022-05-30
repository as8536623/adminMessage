<style lang="scss">
@import '../../style';
</style>
<template>
    <el-form ref="editQuery" :model="editQuery" label-width="160px" :inline-message="true">
        <section class="tool-form-item">
            <el-form-item :label="$t('允许重新提交作业') + '：'">
                {{ $t(editQuery.resubmit ? '是' : '否') }}
            </el-form-item>
            <el-form-item :label="$t('作业完成条件') + '：'">
                {{ HOMEWORK_FINISH_ENUM.getName(editQuery.finishConditions) }}
            </el-form-item>
            <el-form-item :label="$t('作业满分') + '：'" prop="fullScore">{{ editQuery.fullScore }}</el-form-item>
            <el-form-item :label="$t('作业及格分') + '：'" prop="passingScore">{{ editQuery.passingScore }}</el-form-item>
            <el-form-item :label="$t('提醒方式') + '：'">
                <el-checkbox-group v-model="editQuery.remindType" disabled>
                    <el-checkbox
                        v-for="item in reminder.arr"
                        :key="item.code"
                        :label="item.code"
                    >{{ $t(item.name) }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('评阅人') + '：'" prop="reviewer">
                <el-tag v-if="editQuery.reviewerName">{{ editQuery.reviewerName }}</el-tag>
            </el-form-item>
        </section>
    </el-form>
</template>
<script>
    import {getWorkInfo, updateHomework} from '@/api/workInfo';
    import {REMINDER_ENUM, HOMEWORK_FINISH_ENUM} from '@/enum';
    import {validateInteger} from '@/utils/validate';

    export default {
        name: 'SignInSetting',
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('签到设置'),
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
                    reviewerName: null
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
                        this.$router.push({
                            name: 'homeworkParticipants',
                            query: {id: this.$route.query.id}
                        });
                        break;
                }
            },
            cancel() {
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
                    updateHomework(this.editQuery).then(res => {
                        this.$store.dispatch('setAjaxIng', false);
                        const result = res.data;
                        if (result.success) {
                            this.$successMsg(this.$t('保存成功'));
                            this.$router.push({
                                name: 'homeworkParticipants',
                                query: {id: this.$route.query.id}
                            });
                        } else {
                            this.$errorMsg(result.msg || this.$t('保存失败'));
                        }
                        this.dialogVisible = false;
                    });
                });
            },
            last() {
                this.$router.push({
                    name: 'homeworkBaseInfo',
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
