<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="app-container survey__edit">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('问卷编辑')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <el-form-item :label="$t('编号') + '：'" prop="code" :rules="rules.required">
                    <el-input v-model.trim="editQuery.code" :placeholder="$t('编号')" :max-length="50"/>
                </el-form-item>
                <el-form-item :label="$t('项目名称') + '：'" prop="name" :rules="rules.required">
                    <el-input
                        v-model.trim="editQuery.name"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item :label="$t('项目开始时间') + '：'" prop="startAt" :rules="rules.required">
                    <veln-datetime v-model="editQuery.startAt"/>
                </el-form-item>
                <el-form-item :label="$t('项目结束时间') + '：'" prop="endAt" :rules="rules.required">
                    <veln-datetime v-model="editQuery.endAt"/>
                </el-form-item>
                <el-form-item :label="$t('关联问卷') + '：'" prop="templateId" :rules="rules.required">
                    <el-button v-show="!editQuery.templateId" @click="addQtn">{{ $t('选择问卷') }}</el-button>
                    <el-tag
                        v-show="editQuery.templateId"
                        closable
                        @close="templateClose"
                    >{{ editQuery.templateName }}</el-tag>
                </el-form-item>
                <el-form-item :label="$t('封面') + '：'" class="survey__upload__line">
                    <div class="survey__upload__sec" @click="showFileSelect">
                        <img
                            v-if="editQuery.imgUrl"
                            class="survey__cover"
                            :src="editQuery.imgUrl"
                            :alt="$t('封面')"
                        >
                        <svg-icon
                            v-if="!editQuery.imgUrl"
                            icon-class="plus"
                            class-name="survey__upload__plus"
                        />
                    </div>
                    <span class="survey__upload__tips">{{ $t('图片大小不能超过5M，建议尺寸640*370px') }}</span>
                </el-form-item>
                <el-form-item :label="$t('设置') + '：'" prop="setting">
                    <el-checkbox-group v-model="setting" class="checkbox__group__block">
                        <el-checkbox
                            v-for="(item, index) in SURVEY_SETTING_ENUM.arr"
                            :key="index"
                            :label="item.code"
                        >{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('提醒设置') + '：'" prop="remindType">
                    <el-checkbox-group v-model="editQuery.remindType">
                        <el-checkbox
                            v-for="(item, index) in REMINDER_ENUM.arr"
                            :key="index"
                            :label="item.code"
                        >{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('项目简介') + '：'" prop="description">
                    <qgu-editor v-model="editQuery.introduction" :width="editorWidth"/>
                </el-form-item>
                <el-form-item :label="$t('')" class="survey__upload__line">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure('NEXT')">{{ $t('下一步') }}</el-button>
                    <el-button type="primary" @click="sure('SAVE')">{{ $t('完成') }}</el-button>
                </el-form-item>
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
                app-code="veln-survey"
                fun-code="survey"
                :multi-select="false"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
    </article>
</template>

<script>
/**
 * TODO 关联问卷 交互
 */
    import moment from 'moment';
    import VelnFormSection from '@/components/VelnFormSection';
    import QguEditor from '@/components/QguEditor';
    import VelnSteps from '@/components/VelnSteps';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import {SURVEY_SETTING_ENUM, REMINDER_ENUM} from '@/enum';
    import {getInfoById, getCode, save} from '@/api/survey/surveyInfo';

    export default {
        name: 'TeacherEdit',
        components: {
            VelnFormSection,
            QguEditor,
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
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                SURVEY_SETTING_ENUM,
                REMINDER_ENUM,
                steps,
                active: 0,
                editQuery: {
                    id: '',
                    source: 'COMMON', // 类型 COMMON | FACE
                    code: '', // 编号
                    name: '', // 名称
                    startAt: moment().format('YYYY-MM-DD HH:mm:ss'), // 开始时间
                    endAt: moment().format('YYYY-MM-DD HH:mm:ss'), // 结束时间
                    templateId: '', // 问卷ID
                    templateName: '', // 问卷名称
                    coverId: '', // 封面ID
                    imgUrl: '', // 封面URL
                    introduction: '', // 介绍
                    anonymous: false, // 匿名
                    remindType: [], // 提醒类型
                    partakeType: [] // 参与方式
                },
                setting: [],
                editorWidth: '750px',
                uploadURL: `${process.env.FS_API}/file/upload`,
                fileDialogKey: null,
                fileDialogVisible: false,
                typeArr: ['IMAGE'],
                rules: {
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.detail(this.$route.query.id);
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
            // 编辑回显
            detail(id) {
                getInfoById(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const _data = Object.assign({}, result.data);
                        const setting = _data.partakeType.split(',');
                        _data.remindType = _data.remindType.split(',');
                        _data.partakeType = [];
                        if (_data.anonymous) {
                            setting.push('ANONYMITY');
                        }
                        this.editQuery = Object.assign({}, this.editQuery, _data);
                        this.setting = setting;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showFileSelect(type) {
                this.typeArr = ['IMAGE'];
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
                    this.editQuery.imgUrl = viewUrl;
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
            formatEditQuery(params) {
                // 是否匿名
                if (this.setting.includes('ANONYMITY')) {
                    params.anonymous = true;
                }
                // 内部参加
                if (
                    this.setting.includes('INNER') &&
                    !params.partakeType.includes('INNER')
                ) {
                    params.partakeType.push('INNER');
                }
                // 外部参加
                if (
                    this.setting.includes('OUTER') &&
                    !params.partakeType.includes('OUTER')
                ) {
                    params.partakeType.push('OUTER');
                }
                params.remindType = params.remindType.join(',');
                params.partakeType = params.partakeType.join(',');
                return params;
            },
            sure(type) {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        let params = Object.assign({}, this.editQuery);
                        params = this.formatEditQuery(params);
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        save(params).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                type === 'NEXT'
                                    ? this.next(result.data)
                                    : this.gotoList();
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                    }
                });
            },
            // 返回列表页
            gotoList() {
                this.$router.push({name: 'surveyList'});
            },
            // 下一步
            next(id) {
                const sourceId = this.$route.query.sourceId;
                let name = 'surveyParticipants';
                // 面授相关
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
            },
            cancel() {
                this.$router.push({name: 'surveyList'});
            },
            stepChange(index) {
                switch (index) {
                    case 1:
                        this.$router.push({
                            name: 'surveyParticipants',
                            query: {id: this.$route.query.id}
                        });
                        break;
                }
            },
            addQtn() {
                this.editQuery.templateId = '123';
                this.editQuery.templateName = '调查问卷123';
            },
            templateClose() {
                this.editQuery.templateId = '';
                this.editQuery.templateName = '';
            }
        }
    };
</script>
