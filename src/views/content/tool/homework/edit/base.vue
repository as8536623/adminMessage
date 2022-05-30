<style lang="scss">
@import '../../style.scss';
</style>
<template>
    <article class="app-container tool-edit-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('新增作业')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item
                        v-if="!editQuery.sourceId"
                        :label="$t('编号') + '：'"
                        prop="code"
                        :rules="rules.required"
                    >
                        <el-input
                            v-model.trim="editQuery.code"
                            :placeholder="$t('编号')"
                            :max-length="50"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('标题') + '：'" prop="title" :rules="rules.required">
                        <el-input
                            v-model.trim="editQuery.title"
                            class="input__limit"
                            type="text"
                            :placeholder="$t('长度小于50')"
                            maxlength="50"
                            show-word-limit
                        />
                    </el-form-item>
                    <el-form-item :label="$t('可提交开始时间') + '：'" prop="submitSt" class="required">
                        <veln-datetime
                            v-model="editQuery.submitSt"
                            :min-datetime="minDatetime"
                            :max-datetime="maxDatetime"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('可提交结束时间') + '：'" prop="submitEt" class="required">
                        <veln-datetime
                            v-model="editQuery.submitEt"
                            :min-datetime="minDatetime"
                            :max-datetime="maxDatetime"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('作业类型') + '：'" prop="workType" :rules="rules.required">
                        <el-radio-group v-model="editQuery.workType" class="homework__radio__group">
                            <el-radio
                                v-for="(item, index) in HOMEWORK_TYPE_EDIT_ENUM.getAllValues()"
                                :key="index"
                                :label="item.code"
                            >{{ item.name }}</el-radio>
                        </el-radio-group>
                        <div class="homework__tips">{{ $t('文档支持ppt、pptx、xls、xlsx、doc、docx、pdf格式') }}</div>
                    </el-form-item>
                    <el-form-item
                        v-if="!editQuery.sourceId"
                        :label="$t('封面') + '：'"
                        class="course__upload__line"
                    >
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
                    <el-form-item
                        :label="$t('作业要求') + '：'"
                        prop="requirements"
                        :rules="rules.required"
                    >
                        <el-input
                            v-model="editQuery.requirements"
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 6}"
                            :placeholder="$t('请输入作业要求')"
                            maxlength="500"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('附件') + '：'" class="course__upload__line">
                        <el-button
                            v-if="!editQuery.attachment"
                            type="primary"
                            @click="showFileSelect('ALL')"
                        >{{ $t('选择关联文件') }}</el-button>
                        <div v-if="editQuery.attachment" class="homework__link">
                            <span class="homework__link__name">{{ editQuery.attachmentName }}</span>
                            <el-tooltip :content="$t('删除')" placement="top">
                                <i class="el-icon-delete" @click="deleteLinkFile"/>
                            </el-tooltip>
                        </div>
                        <div class="homework__tips">{{ $t('文件大小不能超过100M') }}</div>
                        <div
                            class="homework__tips"
                        >{{ $t('可上传视频MP4/WMV/FLV；文档doc/docx/ppt/pdf；音频 MP3；图片jpg/jpeg/png/bmp/gif') }}</div>
                    </el-form-item>
                    <el-form-item :label="$t('')" class="course__upload__line">
                        <el-button @click="cancel">{{ $t('取消') }}</el-button>
                        <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
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
                app-code="veln-work"
                fun-code="WORK_COVER"
                :multi-select="false"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import VelnSteps from '@/components/VelnSteps';
    import {HOMEWORK_TYPE_ENUM, HOMEWORK_TYPE_EDIT_ENUM} from '@/enum';
    import {
        addHomework,
        generateCode,
        getWorkInfo,
        updateHomework
    } from '@/api/workInfo';
    import moment from 'moment';
    import {getInfoTime} from '@/api/faceCourse';

    export default {
        name: 'SingInBasicInfo',
        components: {
            VelnFormSection,
            VelnFileSelect,
            VelnSteps
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('作业设置'),
                    status: 'wait',
                    disabled: true
                },
                {
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: true
                }
            ];
            const validateStartTime = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('请输入开始时间')));
                } else if (moment(value).isBefore(moment())) {
                    callback(new Error(this.$t('开始时间不能早于当前时间')));
                } else {
                    if (this.editQuery.submitEt !== '') {
                        this.$refs.editQuery.validateField('submitEt');
                    }
                    callback();
                }
            };
            const validateEndTime = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('请输入结束时间')));
                } else if (moment(value).isBefore(this.editQuery.submitSt)) {
                    callback(new Error(this.$t('结束时间不能早于开始时间')));
                } else {
                    callback();
                }
            };
            return {
                HOMEWORK_TYPE_ENUM,
                HOMEWORK_TYPE_EDIT_ENUM,
                editQuery: {
                    id: this.$route.query.id,
                    code: '',
                    title: '', // 作业标题
                    coverId: '',
                    coverUrl: '', // 作业封面
                    submitSt: '', // 可提交时间
                    submitEt: '',
                    workType: '', // 作业类型
                    requirements: '', // 作业要求
                    attachment: '',
                    linkFileUrl: '',
                    attachmentName: '',
                    sourceId: this.$route.query.sourceId, // 面授课程--作业
                    source: this.$route.query.source, // 面授课程--作业
                    resubmit: true,
                    finishConditions: 'SUBMIT'
                },
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
                    submitSt: [{validator: validateStartTime, trigger: 'change'}],
                    submitEt: [{validator: validateEndTime, trigger: 'change'}]
                },
                active: 0,
                steps,
                typeArr: ['IMAGE'],
                minDatetime: this.getNow(),
                maxDatetime: null
            };
        },
        created() {
            this.init();
            if (this.$route.query.sourceId) {
                const params = {id: this.$route.query.sourceId};
                getInfoTime(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.minDatetime = result.data.startTime;
                        this.maxDatetime = result.data.endTime;
                        this.editQuery.title = result.data.name + '-作业';
                    } else {
                        this.minDatetime = this.getNow();
                        this.maxDatetime = this.getNow();
                    }
                });
            }
        },
        methods: {
            getNow() {
                return moment().format('YYYY-MM-DD HH:mm');
            },
            init() {
                if (this.$route.query.sourceId) {
                    this.steps.pop();
                }
                if (this.$route.query.id) {
                    this.getInfoById(this.$route.query.id);
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                } else {
                    this.getCode();
                }
            },
            // 获取code
            getCode() {
                generateCode().then(res => {
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
                    this.editQuery.attachmentName = fileName;
                    this.editQuery.attachment = fileId;
                    this.editQuery.linkFileUrl = viewUrl;
                }
                this.fileDialogVisible = false;
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            cancel() {
                const sourceId = this.$route.query.sourceId;
                if (sourceId) {
                    if (this.$route.query.quick) {
                        this.$router.push({
                            name: 'quickInteraction',
                            query: {id: sourceId}
                        });
                    } else {
                        this.$router.push({
                            name: 'courseInteraction',
                            query: {id: sourceId}
                        });
                    }
                    return;
                }
                this.$router.push({name: 'homeworkList'});
            },
            sure() {
                this.$refs.editQuery.validate(valid => {
                    if (this.editQuery.submitSt instanceof Array) {
                        const time = this.editQuery.submitSt;
                        this.editQuery.submitSt = moment(time[0]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        );
                        this.editQuery.submitEt = moment(time[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        );
                    }
                    if (!valid) {
                        return;
                    }
                    if (this.$store.getters.ajaxIng) {
                        return;
                    }
                    this.$store.dispatch('setAjaxIng', true);
                    if (this.editQuery.id) {
                        updateHomework(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.next(result.data);
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                            this.dialogVisible = false;
                        });
                        return;
                    }
                    addHomework(this.editQuery).then(res => {
                        this.$store.dispatch('setAjaxIng', false);
                        const result = res.data;
                        if (result.success) {
                            this.$successMsg(this.$t('保存成功'));
                            this.next(result.data);
                        } else {
                            this.$errorMsg(result.msg || this.$t('保存失败'));
                        }
                        this.dialogVisible = false;
                    });
                });
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
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            stepChange(index) {
                switch (index) {
                    case 1:
                        this.next(this.$route.query.id);
                        break;
                    case 2:
                        this.$router.push({
                            name: 'homeworkParticipants',
                            query: {id: this.$route.query.id}
                        });
                        break;
                }
            },
            next(id) {
                const sourceId = this.$route.query.sourceId;
                let name = 'homeworkSetting';
                if (sourceId) {
                    name = 'faceHomeworkSetting';
                }
                this.$router.push({
                    name,
                    query: {
                        id,
                        sourceId,
                        source: this.editQuery.source
                    }
                });
            },
            deleteLinkFile() {
                this.$confirm(this.$t('确定删除该文件么？'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                }).then(() => {
                    this.editQuery.attachment = '';
                    this.editQuery.linkFileUrl = '';
                    this.editQuery.attachmentName = '';
                });
            }
        }
    };
</script>
