<style lang="scss">
    @import 'style.scss';
</style>
<template>
    <article class="app-container project__basic">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <section class="tool-form-item">
                    <el-form-item :label="$t('项目编号') + '：'" prop="code" :rules="rules.required">
                        <el-input
                            v-model.trim="editQuery.code"
                            :placeholder="$t('编号')"
                            :max-length="50"
                            :readonly="editQuery.status!=='DRAFT'"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('项目名称') + '：'" prop="name" :rules="rules.required">
                        <el-input
                            v-model.trim="editQuery.name"
                            class="input__limit"
                            type="text"
                            :placeholder="$t('长度小于40')"
                            maxlength="40"
                            show-word-limit
                            :readonly="editQuery.status!=='DRAFT'"
                        />
                    </el-form-item>
                    <veln-label-select
                        ref="labels"
                        label-type="COURSE"
                        :default-labels="editQuery.labels"
                        :validator-flag="false"
                        :label-width="140"
                        label-name="项目标签"
                    />
                    <el-form-item :label="$t('封面') + '：'" class="course__upload__line">
                        <div class="course__upload__sec" @click="showFileSelect">
                            <img
                                v-if="editQuery.coverUrl"
                                class="course__cover"
                                :src="editQuery.coverUrl"
                                :alt="$t('封面')"
                            >
                            <svg-icon
                                v-if="!editQuery.coverUrl"
                                icon-class="plus"
                                class-name="course__upload__plus"
                            />
                        </div>
                        <span class="course__upload__tips">{{ $t('图片大小不能超过5M，建议尺寸640*370px') }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('详情描述') + '：'" prop="description">
                        <qgu-editor v-model="editQuery.description" :width="editorWidth"/>
                    </el-form-item>
                    <el-form-item :label="$t('关联证书') + '：'">
                        <el-tag
                            v-if="editQuery.certName"
                            :closable="editQuery.status==='DRAFT'"
                            @close="certHandleClose"
                        >{{ editQuery.certName }}
                        </el-tag>
                        <el-button
                            v-else
                            class="button-new-tag"
                            type="text"
                            size="small"
                            :disabled="editQuery.status!=='DRAFT'"
                            @click="certSelect"
                        >{{ $t('选择证书') }}
                        </el-button>
                    </el-form-item>
                    <el-form-item :label="$t('提醒方式') + '：'">
                        <el-checkbox-group v-model="remindType">
                            <el-checkbox
                                v-for="item in REMINDER_ENUM.arr"
                                :key="item.code"
                                :label="item.code"
                                :disabled="editQuery.status!=='DRAFT'"
                            >{{ $t(item.name) }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item :label="$t('')">
                        <el-button @click="cancel">{{ $t('取消') }}</el-button>
                        <el-button v-if="editQuery.status==='DRAFT'" type="primary" @click="sure(false)">{{ $t('下一步') }}
                        </el-button>
                        <el-button v-else type="primary" @click="sure(true)">{{ $t('保存') }}</el-button>
                    </el-form-item>
                </section>
            </veln-form-section>
        </el-form>
        <el-dialog
            v-if="fileDialogVisible"
            :key="fileDialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="fileDialogVisible"
            width="890px"
            :before-close="handleFileClose"
            @close="fileDialogClose"
        >
            <veln-file-select
                app-code="veln-mp"
                fun-code="MP_PROJECT"
                :multi-select="false"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
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
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import VelnLabelSelect from '@/components/VelnLabelSelect';
    import QguEditor from '@/components/QguEditor';
    import VelnCertSelect from '@/components/VelnCertSelect';
    import {REMINDER_ENUM} from '@/enum';
    import {getCode, info, saveBase} from '@/api/course/project/project';
    import {validateInteger} from '@/utils/validate';
    import moment from 'moment';

    export default {
        name: 'CourseBaseInfo',
        components: {
            VelnFormSection,
            VelnFileSelect,
            QguEditor,
            VelnLabelSelect,
            VelnCertSelect
        },
        data() {
            const validatorStartTime = (rule, value, callback) => {
                if (
                    value &&
                    this.editQuery.endTime &&
                    value >= this.editQuery.endTime
                ) {
                    callback(new Error(this.$t('开始时间不能小于结束时间')));
                } else {
                    callback();
                }
            };
            const validatorEndTime = (rule, value, callback) => {
                if (
                    value &&
                    this.editQuery.startTime &&
                    value <= this.editQuery.startTime
                ) {
                    callback(new Error(this.$t('结束时间不能小于开始时间')));
                } else {
                    callback();
                }
            };
            return {
                REMINDER_ENUM,
                validateInteger,
                editQuery: {
                    id: this.$route.query.id,
                    code: '',
                    name: '', // 项目名称
                    coverUrl: '', // 封面
                    coverId: '', // 封面ID
                    labels: [], // 标签
                    description: '', // 描述
                    remindType: '',
                    certId: '',
                    certName: '',
                    certUrl: '',
                    type: 'TIME_LIMIT', // 学习项目类型
                    status: 'DRAFT'
                },
                remindType: [],
                uploadURL: `${process.env.FS_API}/file/upload`,
                editorWidth: '750px',
                fileDialogVisible: false,
                fileDialogKey: null,
                rules: {
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ],
                    period: [
                        {
                            required: true,
                            message: this.$t('请输入学时'),
                            trigger: 'blur'
                        }
                    ],
                    score: [
                        {
                            required: true,
                            message: this.$t('请输入学分'),
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
                active: 0,
                typeArr: ['IMAGE'],
                certDialogVisible: false,
                appCode: 'veln-mp'
            };
        },
        created() {
            this.init();
        },
        methods: {
            getNow() {
                return moment().format('YYYY-MM-DD HH:mm');
            },
            init() {
                if (this.$route.query.id) {
                    this.info(this.$route.query.id);
                } else {
                    this.getCode();
                }
            },
            // 获取code
            getCode() {
                getCode().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.code = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取编号异常'));
                    }
                });
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showFileSelect(type) {
                if (type && type === 'ALL') {
                    this.typeArr = ['IMAGE', 'VIDEO', 'AUDIO', 'DOC'];
                } else {
                    this.typeArr = ['IMAGE'];
                }
                this.fileDialogVisible = true;
            },
            fileDialogClose() {
                this.fileDialogKey = +new Date();
            },
            onSure(files) {
                const fileName = files[0].name;
                const fileId = files[0].fileId;
                const viewUrl = files[0].viewUrl;
                if (this.typeArr.length === 1) {
                    this.editQuery.coverUrl = viewUrl;
                    this.editQuery.coverId = fileId;
                } else {
                    this.editQuery.linkFileName = fileName;
                    this.editQuery.linkFileId = fileId;
                    this.editQuery.linkFileUrl = viewUrl;
                }
                this.fileDialogVisible = false;
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            cancel() {
                this.$router.push({name: 'projectList'});
            },
            sure(baseOnly) {
                this.editQuery.remindType = this.remindType.join(',');
                this.editQuery.labels = this.$refs.labels.listQuery.labels;
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const params = Object.assign({}, this.editQuery);
                        saveBase(params).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.editQuery.id = result.data;
                                if (!baseOnly) {
                                    this.$router.replace({
                                        name: 'projectParticipate',
                                        query: {
                                            id: this.editQuery.id
                                        }
                                    });
                                } else {
                                    this.$router.push({name: 'projectList'});
                                }
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                    }
                });
            },
            // 编辑回显
            info(id) {
                info(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        this.remindType = result.data.remindType
                            ? result.data.remindType.split(',')
                            : [];
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            certSelect() {
                this.certDialogVisible = true;
            },
            handleCertClose() {
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
            },
            // 面授删除
            certHandleClose() {
                this.editQuery.certId = '';
                this.editQuery.certName = '';
            }
        }
    };
</script>
