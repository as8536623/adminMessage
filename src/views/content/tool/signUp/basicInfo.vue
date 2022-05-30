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
                    <el-form-item v-if="!editQuery.sourceId" :label="$t('项目编号') + '：'" prop="code">
                        <el-input
                            v-model.trim="editQuery.code"
                            :placeholder="$t('项目编号')"
                            :max-length="50"
                        />
                    </el-form-item>
                    <el-form-item
                        :label="editQuery.source === 'FACE' ? $t('活动名称') : $t('项目名称') + '：'"
                        prop="name"
                    >
                        <el-input
                            v-model.trim="editQuery.name"
                            class="input__limit"
                            type="text"
                            :placeholder="$t('长度小于50位')"
                            maxlength="50"
                            show-word-limit
                        />
                    </el-form-item>
                    <veln-label-select
                        v-if="editQuery.source === 'COMMON'"
                        ref="labels"
                        label-type="SIGN_UP"
                        :default-labels="editQuery.tagList"
                        :validator-flag="false"
                        :label-width="140"
                        :label-name="'项目标签'"
                    />
                    <el-form-item
                        v-if="!editQuery.sourceId"
                        :label="$t('项目封面') + '：'"
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
                        v-if="!editQuery.sourceId"
                        :label="$t('项目简介') + '：'"
                        prop="description"
                    >
                        <qgu-editor v-model="editQuery.description" :width="editorWidth"/>
                    </el-form-item>
                    <el-form-item
                        v-if="!editQuery.source || editQuery.source === 'COMMON'"
                        :label="$t('自定义字段') + '：'"
                    >
                        <el-radio
                            v-model="editQuery.customFlag"
                            :label="false"
                            @change="customHandle"
                        >{{ $t('不添加自定义字段') }}
                        </el-radio>
                        <el-radio
                            v-model="editQuery.customFlag"
                            :label="true"
                            @change="customHandle"
                        >{{ $t('添加自定义字段') }}
                        </el-radio>
                        <template v-for="(item,index) in editQuery.formList">
                            <section
                                v-if="editQuery.customFlag"
                                :key="index"
                                class="tool-custom-list"
                            >
                                <el-form :inline="true" class="demo-form-inline">
                                    <el-form-item :label="$t('只读文本框字段名称') + '：'">
                                        <el-input v-model="item.columnName"/>
                                    </el-form-item>
                                    <el-form-item :label="$t('对应值') + '：'">
                                        <el-input v-model="item.columnValue"/>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-tooltip
                                            v-if="editQuery.formList.length > 1
                                                && index !== 0"
                                            class="item"
                                            effect="dark"
                                            :content="$t('上移')"
                                            placement="top"
                                        >
                                            <el-button
                                                type="text"
                                                size="mini"
                                                @click="move(index, 'up')"
                                            >
                                                <svg-icon class-name="tree__icon" icon-class="up_s"/>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip
                                            v-if="editQuery.formList.length > 1 &&
                                                index !== editQuery.formList.length - 1"
                                            class="item"
                                            effect="dark"
                                            :content="$t('下移')"
                                            placement="top"
                                        >
                                            <el-button
                                                type="text"
                                                size="mini"
                                                @click="move(index, 'down')"
                                            >
                                                <svg-icon class-name="tree__icon" icon-class="down_s"/>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="$t('添加')"
                                            placement="top"
                                        >
                                            <el-button type="text" size="mini" @click="add()">
                                                <svg-icon class-name="tree__icon" icon-class="add_s"/>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="$t('删除')"
                                            placement="top"
                                        >
                                            <el-button
                                                v-if="editQuery.formList.length > 1"
                                                type="text"
                                                size="mini"
                                                @click="del(index)"
                                            >
                                                <svg-icon class-name="tree__icon" icon-class="del"/>
                                            </el-button>
                                        </el-tooltip>
                                    </el-form-item>
                                </el-form>
                            </section>
                        </template>
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
                fun-code="SIGN_COVER"
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
    import VelnLabelSelect from '@/components/VelnLabelSelect';
    import QguEditor from '@/components/QguEditor';
    import VelnSteps from '@/components/VelnSteps';
    import {baseInfoEdit, getCode, getInfoById} from '@/api/signUp';
    import {getInfoTime} from '@/api/faceCourse';

    export default {
        name: 'BasicInfo',
        components: {
            VelnLabelSelect,
            QguEditor,
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
                    title: this.$t('报名设置'),
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
                    tagList: [],
                    coverUrl: '',
                    description: '',
                    customFlag: false,
                    formList: [],
                    sourceId: this.$route.query.sourceId, // 面授课程--活动
                    source: 'COMMON' // 面授课程--活动
                },
                uploadURL: `${process.env.FS_API}/file/upload`,
                editorWidth: '750px',
                fileDialogVisible: false,
                fileDialogKey: null,
                rules: {
                    code: [
                        {
                            required: true,
                            message: this.$t('请输入项目编号'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入项目名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                active: 0,
                steps
            };
        },
        created() {
            this.init();
            if (this.$route.query.sourceId) {
                const params = {id: this.$route.query.sourceId};
                getInfoTime(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.name = result.data.name + '-报名';
                    }
                });
            }
        },
        methods: {
            init() {
                this.editQuery.source = this.$route.query.source;
                if (this.editQuery.source === 'FACE') {
                    this.steps.pop();
                    this.steps[1].title = this.$t('活动设置');
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
                const source = this.$route.query.source;
                const sourceId = this.$route.query.sourceId;
                if (source === 'FACE') {
                    // 返回面授添加互动页面
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
                } else if (source === 'FACE_ENROLL') {
                    // 返回面授参与人员页面
                    this.$router.push({
                        name: 'courseParticipants',
                        query: {id: sourceId}
                    });
                    return;
                } else if (source === 'FACE_ENROLL_DETAIL') {
                    // 返回面授参与人员页面-详情页
                    this.$router.push({
                        name: 'faceCourseDetail',
                        query: {
                            id: sourceId,
                            activeName: this.$route.query.activeName
                        }
                    });
                    return;
                }
                this.$router.push({name: 'signUp'});
            },
            sure() {
                if (this.$refs.labels) {
                    this.editQuery.tagList = this.$refs.labels.listQuery.labels;
                }

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
            add() {
                const data = {
                    columnName: '',
                    columnValue: ''
                };
                this.editQuery.formList.push(data);
            },
            del(index) {
                this.editQuery.formList.splice(index, 1);
            },
            // 上移，下移
            move(index, moveType) {
                moveType === 'up'
                    ? this.swapItems(index, index - 1)
                    : this.swapItems(index, index + 1);
            },
            // 交换值
            swapItems(index, index2) {
                const arr = this.editQuery.formList;
                arr[index] = arr.splice(index2, 1, arr[index])[0];
            },
            customHandle(e) {
                if (!e) {
                    this.editQuery.formList = [];
                } else {
                    this.editQuery.formList = [
                        {
                            columnName: '',
                            columnValue: ''
                        }
                    ];
                }
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
                        if (result.data.adminFormList) {
                            this.editQuery.formList = result.data.adminFormList;
                            this.editQuery.customFlag = true;
                        } else {
                            this.editQuery.formList = [];
                            this.editQuery.customFlag = false;
                        }
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
                            name: 'signUpParticipants',
                            query: {
                                id: this.$route.query.id,
                                sourceId: this.$route.query.sourceId,
                                source: this.$route.query.source,
                                activeName: this.$route.query.activeName
                            }
                        });
                        break;
                }
            },
            next(id) {
                let name = 'signUpSetting';
                if (this.editQuery.source === 'FACE') {
                    name = 'faceSetting';
                }
                this.$router.push({
                    name,
                    query: {
                        id,
                        sourceId: this.$route.query.sourceId,
                        source: this.$route.query.source,
                        activeName: this.$route.query.activeName
                    }
                });
            }
        }
    };
</script>
