<style lang="scss">
    .veln__tips {
        margin-left: 6px;
    }
</style>

<template>
    <div class="container__padding">
        <section class="qg-container">
            <el-form ref="subjectForm" :model="subjectForm" class="qg-edit-form" label-width="150px">
                <el-form-item label="专题ID" prop="code" :rules="[rules.required]">
                    <el-input
                        v-model="subjectForm.code"
                        :maxlength="20"
                        clearable
                        placeholder="请输入专题ID"
                    />
                </el-form-item>
                <el-form-item label="专题名称" prop="name" :rules="[rules.required]">
                    <el-input
                        v-model="subjectForm.name"
                        :maxlength="30"
                        :show-word-limit="true"
                        clearable
                        placeholder="请输入专题名称"
                    />
                </el-form-item>
                <el-form-item label="专题类型" prop="categoryId" :rules="[rules.required]">
                    <el-select
                        v-model="subjectForm.categoryId"
                        clearable
                        placeholder="请选择专题类型"
                    >
                        <el-option
                            v-for="item in categoryOptionsArray"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="false" label="课时" prop="period" :rules="[rules.required]">
                    <el-input-number
                        v-model="subjectForm.period"
                        :maxlength="22"
                        :min="0"
                        :max="999"
                        clearable
                        controls-position="right"
                        placeholder="请输入课时"
                        @change="handleChangePeriod"
                    />
                </el-form-item>
                <el-form-item v-if="!isBgk" label="专题价格" prop="price" :rules="[rules.required]">
                    <el-input-number
                        v-model="subjectForm.price"
                        :maxlength="13"
                        :min="0"
                        :max="99999"
                        clearable
                        controls-position="right"
                        placeholder="请输入课程价格"
                        @change="handleChangePrice"
                    />
                </el-form-item>
                <el-form-item v-if="!isBgk" label="有效期（月）" prop="validity" :rules="[rules.required]">
                    <el-input-number
                        v-model="subjectForm.validity"
                        :maxlength="2"
                        :precision="0"
                        :min="0"
                        :max="99"
                        clearable
                        controls-position="right"
                        placeholder="请输入有效期"
                        @change="handleChangePeriod"
                    />
                    <span class="veln__tips">有效期自学员购买成功后开始计算</span>
                </el-form-item>
                <el-form-item v-if="!isBgk" label="批量优惠" prop="bulkSalesFlag" :rules="[rules.required]">
                    <el-switch
                        v-model="subjectForm.bulkSalesFlag"
                        active-color="#13ce66"
                    />
                </el-form-item>
                <el-form-item
                    v-if="!isBgk"
                    label="批量优惠数量"
                    prop="bulkNumberLimit"
                    :rules="subjectForm.bulkSalesFlag ? [rules.required] : null"
                >
                    <el-input-number
                        v-model="subjectForm.bulkNumberLimit"
                        :disabled="!subjectForm.bulkSalesFlag"
                        :min="0"
                        :max="999"
                        :precision="0"
                        :maxlength="3"
                        clearable
                        controls-position="right"
                        placeholder="请输入有效期"
                    />
                </el-form-item>
                <el-form-item
                    v-if="!isBgk"
                    label="批量优惠单价"
                    prop="bulkPrice"
                    :rules="subjectForm.bulkSalesFlag ? [rules.required] : null"
                >
                    <el-input-number
                        v-model="subjectForm.bulkPrice"
                        :disabled="!subjectForm.bulkSalesFlag"
                        :min="0"
                        :max="99999"
                        :maxlength="3"
                        clearable
                        controls-position="right"
                    />
                </el-form-item>
                <el-form-item v-if="!isBgk" label="内购价格" prop="internalPrice" :rules="[rules.required]">
                    <el-input-number
                        v-model="subjectForm.internalPrice"
                        :maxlength="2"
                        :min="0"
                        :max="99999"
                        clearable
                        controls-position="right"
                    />
                </el-form-item>
                <el-form-item v-if="corpCode!=='jiayi'" :label="'讲师列表' + '：'" prop="teachers" :rules="[rules.required]">
                    <div>
                        <el-tag
                            v-for="item in teacherSelect"
                            :key="item.index"
                            class="course__teacher__tag"
                            closable
                            :disable-transitions="false"
                            @close="handleCloseTeacher(item)"
                        >{{ item.name }}
                        </el-tag>
                        <el-button class="course__teacher__btn" @click="showTeacherDlg">{{ '选择' }}</el-button>
                    </div>
                </el-form-item>
                <el-form-item
                    :label="'上传封面' + '：'"
                    class="course__upload__line"
                    prop="coverId"
                    :rules="[rules.required]"
                >
                    <div class="course__upload__sec" @click="showFileSelect">
                        <img
                            v-if="subjectForm.coverUrl"
                            class="course__cover"
                            :src="subjectForm.coverUrl"
                            :alt="'封面'"
                        >
                        <svg-icon
                            v-if="!subjectForm.coverUrl"
                            icon-class="plus"
                            class-name="course__upload__plus"
                        />
                    </div>
                    <span class="course__upload__tips">{{ '图片大小不能超过5M，建议尺寸640*370px' }}</span>
                </el-form-item>
                <el-form-item label="专题描述" prop="desc" :rules="[rules.required]">
                    <el-input
                        v-model="subjectForm.desc"
                        type="textarea"
                        placeholder="请输入内容"
                        maxlength="200"
                        show-word-limit
                        :autosize="{ minRows: 4, maxRows: 8}"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave">下一步</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
            <el-dialog
                v-if="fileDialogVisible"
                :key="fileDialogKey"
                append-to-body
                :title="'选择文件'"
                :visible.sync="fileDialogVisible"
                width="890px"
                :before-close="handleFileClose"
                @close="fileDialogClose"
            >
                <veln-file-select
                    app-code="veln-stu"
                    fun-code="STU_SUBJECT_COVER"
                    :multi-select="false"
                    :type-arr="['IMAGE']"
                    @on-sure="onSure"
                    @on-cancel="onCancel"
                />
            </el-dialog>
            <el-dialog
                v-if="teacherDialogVisible"
                append-to-body
                :title="'选择讲师'"
                :visible.sync="teacherDialogVisible"
                width="700px"
                :before-close="handleTeacherClose"
            >
                <section class="dlg__content">
                    <div class="teacher__search">
                        <search-input
                            v-model="teacherQuery.name"
                            class="pull-right"
                            :placeholder="'讲师姓名'"
                            @enter="searchTeacher"
                        />
                    </div>
                    <qgu-table
                        ref="userTable"
                        :border="false"
                        :columns="tableColumns"
                        :data="teacherlist"
                        :page="teacherQuery"
                        :total="teacherTotal"
                        :loading="teacherListLoading"
                        @selection-change="teacherSelectionChange"
                        @size-change="handleTeacherSizeChange"
                        @current-change="handleTeacherCurrentChange"
                    />
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="teacherDialogVisible=false">{{ '取消' }}</el-button>
                    <el-button
                        type="primary"
                        @click="onTeacherSure"
                    >{{ '确定' }}
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog
                v-if="lectureDialogVisible"
                :key="lectureDialogKey"
                append-to-body
                :title="'选择文件'"
                :visible.sync="lectureDialogVisible"
                width="890px"
                :before-close="handleLectureClose"
                @close="lectureDialogClose"
            >
                <veln-file-select
                    app-code="veln-stu"
                    fun-code="LECTURE"
                    :multi-select="true"
                    :type-arr="['IMAGE', 'DOC']"
                    extensions="gif,jpg,jpeg,bmp,png,doc,docx,ppt,pptx,pdf"
                    mime-types="image/*,.doc,.docx,.ppt,.pptx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf"
                    @on-sure="lectureOnSure"
                    @on-cancel="lectureOnCancel"
                />
            </el-dialog>
        </section>
    </div>
</template>

<script>
    import {generateCode, subject, subjectAdd, subjectEdit} from '@/api/moudles/stu/subject';
    import {subjectAddModel, subjectEditModel} from './subjectCourseConfig.js';
    import {rules} from '@/utils/validator.js';
    import {getToken, isBgk} from '@/utils/auth';
    import {getTeacherPage} from '@/api/teacher';
    import checkPermission from '@/utils/permission';
    import VelnFileSelect from '@/components/VelnFileSelect/index';
    import {getFirstLevelCategory} from './operationalCommonConfig';
    import {deepClone} from '@/utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'SubjectEdit',
        components: {
            VelnFileSelect
        },
        data() {
            const id = this.$route.query.id;
            const hasBgk = isBgk();
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    text: this.$t('讲师姓名')
                },
                {
                    hidden: hasBgk,
                    field: 'levelName',
                    minWidth: 100,
                    text: this.$t('讲师等级')
                },
                {
                    field: 'source',
                    minWidth: 100,
                    text: this.$t('讲师来源'),
                    render: (h, param) => {
                        return param.row.source === 'OUTER' ? '外部' : '内部';
                    }
                }
            ];

            return {
                tableColumns,
                id,
                fsConfig: {
                    baseApi: process.env.VUE_APP_BASE_API,
                    headers: {Authorization: getToken()},
                    formData: {
                        appCode: 'stu',
                        funCode: 'subj_desc'
                    }
                },
                subjectForm: id ? deepClone(subjectEditModel) : deepClone(subjectAddModel),
                rules,
                teacherlist: [],
                teacherTotal: 0,
                teacherSelect: [],
                teacherListLoading: false,
                teacherDialogVisible: false,
                teacherQuery: {
                    name: '',
                    source: '',
                    pageNum: 1,
                    pageSize: 20
                },
                fileDialogVisible: false,
                fileDialogKey: null,
                lectureDialogVisible: false,
                lectureDialogKey: null,
                categoryOptionsArray: [],
                isBgk: isBgk(),
                type: ''
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        async created() {
            this.categoryOptionsArray = await getFirstLevelCategory();
            const {type} = this.$route.query;
            if (type) {
                this.type = type;
            }
            if (this.id) {
                this.subjectForm.id = this.id;
                this.subject(this.id);
            } else {
                generateCode().then(re => {
                    this.subjectForm.code = re.data.data;
                });
            }
        },
        methods: {
            checkPermission,
            subject(id) {
                subject(id).then(response => {
                    if (response.data) {
                        const subjectInfo = response.data.data;
                        for (const key in this.subjectForm) {
                            if (this.subjectForm.hasOwnProperty(key)) {
                                this.subjectForm[key] = subjectInfo[key];
                            }
                        }

                        this.teacherSelect = subjectInfo.teacherList;
                    }
                });
            },
            handleSave() {
                this.$refs.subjectForm.validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    let request = null;
                    let id = this.subjectForm.id;
                    if (this.isBgk) {
                        this.subjectForm.validity = 3;
                    }
                    if (!this.subjectForm.price) {
                        this.subjectForm.price = 0;
                    }
                    if (!this.subjectForm.period) {
                        this.subjectForm.period = 0;
                    }

                    if (typeof id === 'undefined') {
                        request = subjectAdd(this.subjectForm);
                    } else {
                        request = subjectEdit(this.subjectForm);
                    }
                    request.then(result => {
                        const response = result.data;
                        if (response.success) {
                            if (!id) {
                                id = response.data;
                            }
                            this.$message.success(response.msg || '保存成功');
                            if (this.type === 'COMMON') {
                                this.$router.push({
                                    name: 'onlineSubjectStepTwo',
                                    query: {
                                        id
                                    }
                                });
                                return;
                            }
                            this.$router.push({
                                name: 'subjectAddTwoStep',
                                query: {
                                    id
                                }
                            });
                        } else {
                            this.$message.error(response.msg || '保存失败');
                        }
                    });
                });
            },
            goBack() {
                this.$router.back();
            },
            showTeacherDlg() {
                this.teacherDialogVisible = true;
                this.searchTeacher();
            },
            searchTeacher() {
                this.getTeacherList({pageNum: 1});
            },
            getTeacherList(condition) {
                const params = Object.assign(
                    {'status': 'ENABLED'}, this.teacherQuery, condition);
                this.teacherListLoading = true;
                getTeacherPage(params).then(re => {
                    this.teacherListLoading = false;
                    const result = re.data;
                    if (result.success) {
                        this.teacherlist = result.data.list || [];
                        this.teacherTotal = result.data.total;
                        this.teacherQuery.pageNum = params.pageNum;
                        this.teacherQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取讲师数据出错'));
                    }
                });
            },
            teacherSelectionChange(selection) {
                this.teacherMultiSelection = selection;
            },
            handleTeacherSizeChange(v) {
                this.getTeacherList({
                    pageNum: 1,
                    pageSize: v
                });
            },
            handleTeacherCurrentChange(v) {
                this.getTeacherList({
                    pageNum: v
                });
            },
            onTeacherSure() {
                this.teacherMultiSelection.map(teacher => {
                    const teachers = this.subjectForm.teachers;
                    if (!teachers) {
                        this.subjectForm.teachers = [];
                    }
                    if (!teachers || (teachers && !teachers.includes(teacher.id))) {
                        this.subjectForm.teachers.push(teacher.id);
                        this.teacherSelect.push(teacher);
                    }
                });
                this.teacherDialogVisible = false;
                this.$refs.subjectForm.validateField('teachers');
            },
            handleCloseTeacher(teacher) {
                const index = this.subjectForm.teachers.indexOf(teacher.id);
                this.subjectForm.teachers.splice(index, 1);
                let idx = -1;
                const list = this.teacherSelect;
                list.map((t, i) => {
                    if (t.id === teacher.id) {
                        idx = i;
                    }
                });

                if (idx > -1) {
                    list.splice(idx, 1);
                    this.teacherSelect = list;
                }
                this.$refs.subjectForm.validateField('teachers');
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showFileSelect() {
                this.fileDialogVisible = true;
            },
            onSure(files) {
                const fileId = files[0].fileId;
                this.subjectForm.coverUrl = files[0].viewUrl;
                this.subjectForm.coverId = fileId;
                this.fileDialogVisible = false;
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            handleChangePeriod() {
                console.info('');
            },
            handleChangePrice() {
                console.info('');
            },
            fileDialogClose() {
                this.fileDialogKey = +new Date();
            },
            handleTeacherClose() {
                this.teacherDialogVisible = false;
            },
            showLectureSelect() {
                this.lectureDialogVisible = true;
            },
            handleLectureClose() {
                this.lectureDialogVisible = false;
            },
            lectureDialogClose() {
                this.lectureDialogKey = +new Date();
            },
            lectureOnSure(files) {
                const result = [];
                Array.isArray(files) && files.map(item => {
                    const {
                        fileId,
                        name,
                        viewUrl,
                        qgFileDetail,
                        convertStatus,
                        convertType
                    } = item;
                    const {length, mediaType, fileExt} = qgFileDetail;

                    const filter = this.subjectForm.lectureList.filter(itm => {
                        return itm.fileId === fileId;
                    });

                    if (filter && filter.length) {
                        return;
                    }

                    item.srcType =
                        mediaType === 'image'
                            ? mediaType
                            : fileExt.split('.')[1];
                    if (item.srcType.toLowerCase() === 'png' || item.srcType.toLowerCase() === 'jpg' || item.srcType.toLowerCase() === 'jpeg' || item.srcType.toLowerCase() === 'gif') {
                        item.srcType = 'image';
                    }
                    const file = {
                        fileId,
                        srcName: name,
                        srcType: item.srcType,
                        length: length,
                        viewUrl: viewUrl,
                        convertStatus,
                        convertType
                    };

                    result.push(file);
                });
                this.subjectForm.lectureList = this.subjectForm.lectureList.concat(
                    result
                );
                this.lectureDialogVisible = false;
            },
            lectureOnCancel() {
                this.lectureDialogVisible = false;
            }
        }
    };
</script>
