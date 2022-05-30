<style lang="scss">
    @import 'style.scss';
    @import "../style.scss";
</style>
<template>
    <article class="app-container examination-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-steps :data="steps" :active="active" @change="stepChange"/>
            <section class="tool-form-item">
                <el-form-item :label="$t('考试名称') + '：'" prop="examName">
                    <el-input
                        v-model.trim="editQuery.examName"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item :label="$t('考试编号') + '：'" prop="examCode">
                    <el-input
                        v-model.trim="editQuery.examCode"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item :label="$t('学分') + '：'">
                    <el-input-number
                        v-model="editQuery.score"
                        :precision="1"
                        :step="1"
                        :min="0"
                        :max="100"
                        :placeholder="$t('学分')"
                    />
                </el-form-item>
                <el-form-item :label="$t('关联证书') + '：'">
                    <el-tag v-if="editQuery.certName" type="success">{{ editQuery.certName }}</el-tag>
                    <el-button type="text" @click="selectCert">{{ $t('选择证书') }}</el-button>
                </el-form-item>
                <el-form-item :label="$t('考试说明') + '：'">
                    <el-input
                        v-model="editQuery.examPlain"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        :placeholder="$t('请输入考试说明')"
                        maxlength="500"
                    />
                </el-form-item>
                <el-form-item :label="$t('')">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
                </el-form-item>
            </section>
        </el-form>
        <el-dialog
            v-if="certDialogVisible"
            append-to-body
            :title="$t('选择证书')"
            :visible.sync="certDialogVisible"
            width="939px"
            @close="handleCertClose"
        >
            <veln-cert-select ref="cert" :active-id="editQuery.certId"/>
            <div>
                <div class="vps__btn__line">
                    <el-button @click="certDialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="certSave">保存</el-button>
                </div>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import VelnCertSelect from '@/components/VelnCertSelect';
    import {validateInteger} from '@/utils/validate';
    import {getCode, saveInfo, getInfo} from '@/api/exam/exam/exam';

    export default {
        name: 'MakeUpBasic',
        components: {
            VelnSteps,
            VelnCertSelect
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('试卷设置'),
                    status: 'wait',
                    disabled: true
                },
                {
                    title: this.$t('考试安排'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                validateInteger,
                editQuery: {
                    id: this.$route.query.id,
                    examCode: '',
                    examName: '',
                    examPlain: '',
                    examType: this.$route.query.examType,
                    certId: '',
                    enableTicket: false,
                    score: 0
                },
                rules: {
                    examName: [
                        {
                            required: true,
                            message: this.$t('请输入考试名称'),
                            trigger: 'blur'
                        }
                    ],
                    examCode: [
                        {
                            required: true,
                            message: this.$t('请输入考试编号'),
                            trigger: 'blur'
                        }
                    ]
                },
                active: 0,
                steps,
                selectedList: [],
                certDialogVisible: false
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.getInfo(this.$route.query.id);
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                } else {
                    this.getCode();
                    if (this.$route.query.markUpId) {
                        this.getInfo(this.$route.query.markUpId);
                    }
                }
            },
            getCode() {
                getCode().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.examCode = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取编号异常'));
                    }
                });
            },
            cancel() {
                this.$router.push({
                    name: 'examList'
                });
            },
            sure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        saveInfo(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.next(result.data.id);
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            // 编辑回显
            getInfo(id) {
                getInfo(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        if (this.$route.query.markUpId) {
                            result.data.examCode = this.editQuery.examCode;
                        }

                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        if (this.$route.query.markUpId) {
                            this.editQuery.examName = this.editQuery.examName + '(补考)';
                            this.editQuery.markUpId = this.$route.query.markUpId;
                            this.editQuery.status = 'DRAFT';
                            this.editQuery.endTime = null;
                            this.editQuery.paperTemplate = null;
                            this.editQuery.templateId = null;
                            this.editQuery.id = null;
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            stepChange(index) {
                switch (index) {
                    case 1:
                        this.next(this.editQuery.id);
                        break;
                    case 2:
                        this.$router.push({
                            name: 'makeUpArrange',
                            query: {
                                id: this.editQuery.id,
                                examType: this.$route.query.examType
                            }
                        });
                        break;
                }
            },
            next(id) {
                this.$router.push({
                    name: 'makeUpPaper',
                    query: {
                        id,
                        examType: this.$route.query.examType
                    }
                });
            },
            selectCert() {
                this.certDialogVisible = true;
            },
            handleCertClose() {
                this.certDialogVisible = false;
            },
            close() {
                this.certDialogVisible = false;
            },
            certSave() {
                const $cert = this.$refs.cert;
                const result = $cert.getActive();
                if (result) {
                    this.editQuery.certId = result.id;
                    this.editQuery.certName = result.name;
                } else {
                    this.editQuery.certId = '';
                    this.editQuery.certName = '';
                }
                this.certDialogVisible = false;
            }
        }
    };
</script>
