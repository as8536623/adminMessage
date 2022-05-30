<style lang="scss">
@import '../style.scss';
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
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item v-if="!editQuery.sourceId" :label="$t('编号') + '：'" prop="code">
                        <el-input
                            v-model.trim="editQuery.code"
                            :placeholder="$t('编号')"
                            :max-length="50"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('签到标题') + '：'" prop="name">
                        <el-input
                            v-model.trim="editQuery.name"
                            class="input__limit"
                            type="text"
                            :placeholder="$t('长度小于50')"
                            maxlength="50"
                            show-word-limit
                        />
                    </el-form-item>
                    <el-form-item :label="$t('开始时间') + '：'" prop="startTime">
                        <veln-datetime
                            v-model="editQuery.startTime"
                            :min-datetime="minDatetime"
                            :max-datetime="maxDatetime"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('有效时长') + '：'" prop="duration">
                        <el-input v-model.number="editQuery.duration" type="text"/>
                        {{ $t('分钟') }}
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
                </section>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
            </section>
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
                app-code="veln-sign"
                fun-code="SIGN"
                :multi-select="false"
                :type-arr="['IMAGE']"
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
    import {baseInfoEdit, getCode, getInfoById} from '@/api/signIn';
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
                    title: this.$t('签到设置'),
                    status: 'wait',
                    disabled: true
                },
                {
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                editQuery: {
                    id: this.$route.query.id,
                    code: '',
                    name: '',
                    duration: '',
                    coverUrl: '',
                    startTime: '',
                    sourceId: this.$route.query.sourceId, // 面授课程--签到
                    source: this.$route.query.source // 面授课程--签到
                },
                uploadURL: `${process.env.FS_API}/file/upload`,
                editorWidth: '750px',
                fileDialogVisible: false,
                fileDialogKey: null,
                rules: {
                    code: [
                        {
                            required: true,
                            message: this.$t('请输入编号'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入签到标题'),
                            trigger: 'blur'
                        }
                    ],
                    startTime: [
                        {
                            required: true,
                            message: this.$t('请选择开始时间'),
                            trigger: 'change'
                        }
                    ],
                    duration: [
                        {
                            required: true,
                            message: this.$t('请输入有效时长'),
                            trigger: 'blur'
                        },
                        {type: 'number', message: this.$t('有效时长必须为数字值')}
                    ]
                },
                active: 0,
                steps,
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
                        this.editQuery.name = result.data.name + '-签到';
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
            showFileSelect() {
                this.fileDialogVisible = true;
            },
            fileDialogClose() {
                this.fileDialogKey = +new Date();
            },
            onSure(files) {
                const fileId = files[0].fileId;
                this.editQuery.coverUrl = files[0].viewUrl;
                this.editQuery.coverId = fileId;
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
                this.$router.push({name: 'signIn'});
            },
            sure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        baseInfoEdit(this.editQuery).then(res => {
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
            stepChange(index) {
                switch (index) {
                    case 1:
                        this.next(this.editQuery.id);
                        break;
                    case 2:
                        this.$router.push({
                            name: 'participants',
                            query: {id: this.$route.query.id}
                        });
                        break;
                }
            },
            next(id) {
                const sourceId = this.$route.query.sourceId;
                let name = 'signInSetting';
                if (sourceId) {
                    name = 'faceSignSetting';
                }
                this.$router.push({
                    name,
                    query: {
                        id,
                        sourceId,
                        source: this.editQuery.source
                    }
                });
            }
        }
    };
</script>
