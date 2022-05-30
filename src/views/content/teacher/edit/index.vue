<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container teacher-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
            :disabled="readOnly"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <template v-if="readOnly" slot="option">
                    <div class="teacher--edit" @click="handleEdit">编辑</div>
                </template>
                <el-form-item :label="$t('编号') + '：'" prop="code" :rules="rules.required">
                    <el-input v-model.trim="editQuery.code" :placeholder="$t('编号')" :max-length="50"/>
                </el-form-item>
                <el-form-item :label="$t('所属类别') + '：'" prop="categoryId">
                    <el-input
                        ref="categoryInput"
                        v-model.trim="editQuery.categoryName"
                        :placeholder="$t('请选择类别')"
                        :max-length="32"
                        clearable
                        @clear="clearCategory"
                        @focus="showCategorySelect"
                    />
                </el-form-item>
                <el-form-item
                    v-if="editQuery.source === 'INNER'"
                    :label="$t('姓名') + '：'"
                    prop="name"
                    :rules="rules.required"
                >
                    <el-input
                        ref="personInput"
                        v-model.trim="editQuery.name"
                        :placeholder="$t('请选择人员')"
                        :max-length="32"
                        clearable
                        :disabled="editQuery.id ? true : false"
                        @clear="clearName"
                        @focus="showPersonSelect"
                    />
                </el-form-item>
                <el-form-item v-else :label="$t('姓名') + '：'" prop="name" :rules="rules.required">
                    <el-input
                        v-model.trim="editQuery.name"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50')"
                        maxlength="50"
                        show-word-limit
                        :disabled="editQuery.id ? true : false"
                    />
                </el-form-item>
                <el-form-item :label="$t('性别') + '：'">
                    <el-select
                        v-model="editQuery.sex"
                        :placeholder="$t('请选择')"
                        :disabled="editQuery.source === 'INNER' ? true : false"
                    >
                        <el-option :label="$t('男')" value="MALE"/>
                        <el-option :label="$t('女')" value="FEMALE"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('联系电话') + '：'" prop="mobile" :rules="rules.required">
                    <el-input
                        v-model.number="editQuery.mobile"
                        type="text"
                        :disabled="editQuery.source === 'INNER' || editQuery.id ? true : false"
                    />
                </el-form-item>
                <el-form-item :label="$t('电子邮箱') + '：'">
                    <el-input
                        v-model="editQuery.email"
                        type="text"
                        :disabled="editQuery.source === 'INNER' ? true : false"
                    />
                </el-form-item>
                <el-form-item :label="$t('讲师照片') + '：'" class="course__upload__line">
                    <div class="course__upload__sec" @click="showFileSelect">
                        <img
                            v-if="editQuery.imgUrl"
                            class="course__cover"
                            :src="editQuery.imgUrl"
                            :alt="$t('封面')"
                        >
                        <svg-icon
                            v-if="!editQuery.imgUrl"
                            icon-class="plus"
                            class-name="course__upload__plus"
                        />
                    </div>
                    <span class="course__upload__tips">{{ $t('图片大小不能超过5M，建议尺寸640*370px') }}</span>
                </el-form-item>
                <el-form-item :label="$t('讲师介绍') + '：'" prop="description">
                    <qgu-editor v-if="!readOnly" v-model="editQuery.introduce" :width="editorWidth"/>
                    <div v-else v-html="editQuery.introduce"/>
                </el-form-item>
                <el-form-item v-if="readOnly" :label="$t('创建时间') + '：'">
                    <el-input
                        v-model="editQuery.createdAt"
                        type="text"
                        disabled
                    />
                </el-form-item>
                <el-form-item v-if="readOnly" :label="$t('创建人') + '：'">
                    <el-input
                        v-model="editQuery.createdBy"
                        type="text"
                        disabled
                    />
                </el-form-item>
                <el-form-item v-if="readOnly" :label="$t('更新时间') + '：'">
                    <el-input
                        v-model="editQuery.updatedAt"
                        type="text"
                        disabled
                    />
                </el-form-item>
                <el-form-item v-if="!readOnly" :label="$t('')" class="course__upload__line">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('完成') }}</el-button>
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
                app-code="veln-stu"
                fun-code="TEACHER-FACE"
                :multi-select="false"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择类别')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-teacher-category-select
                ref="category"
                :default-expand-all="defaultExpandAll"
            />
            <div class="dialog__btn__line">
                <el-button @click="categoryDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="categorySelect">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            append-to-body
            :title="$t('选择讲师')"
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
    import VelnFormSection from '@/components/VelnFormSection';
    import QguEditor from '@/components/QguEditor';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import VelnTeacherCategorySelect from '@/components/VelnTeacherCategorySelect';
    import VelnPersonSelect from '@/components/VelnPersonSelect';
    import {detail, getCode, save} from '@/api/teacher/teacher';
    import {teacherLevel} from '@/api/teacher/teacherLevel';
    import {TEACHER_JOB_TYPE_ENUM, TEACHER_TYPE_ENUM} from '@/enum';
    import {validateFormMobile} from '@/utils/validate';
    import {mapGetters} from 'vuex';

    export default {
        name: 'TeacherEdit',
        components: {
            VelnFormSection,
            QguEditor,
            VelnFileSelect,
            VelnTeacherCategorySelect,
            VelnPersonSelect
        },
        data() {
            return {
                hasBgk: false, // 北国会
                TEACHER_TYPE_ENUM,
                TEACHER_JOB_TYPE_ENUM,
                editQuery: {
                    id: this.$route.query.id,
                    code: '', // 讲师编号
                    name: '', // 讲师姓名
                    categoryId: '', // 讲师类别Id
                    categoryName: '', // 讲师类别 名称
                    sex: '', // 讲师性别
                    mobile: '', // 讲师 手机号
                    email: '', // 邮箱
                    coverId: '', // 封面Id
                    imgUrl: '', // 封面Url
                    introduce: '', // 讲师介绍
                    userId: '' // 讲师人员Id
                },
                categoryDialogVisible: false,
                defaultExpandAll: true,
                editorWidth: '750px',
                uploadURL: `${process.env.FS_API}/file/upload`,
                fileDialogKey: null,
                fileDialogVisible: false,
                typeArr: ['IMAGE'],
                levelList: [],
                funCode: 'teacher',
                personDialogVisible: false,
                mobileKey: null,
                readOnly: false,
                rules: {
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ],
                    categoryId: [
                        {
                            required: true,
                            message: this.$t('请选择类别'),
                            trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {
                            required: true,
                            message: this.$t('请输入手机'),
                            trigger: 'blur'
                        },
                        {
                            validator: validateFormMobile,
                            trigger: 'blur'
                        }
                    ]
                },
                isCourseEdit: false
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        mounted() {
            if (this.$route.query.readOnly) {
                this.readOnly = this.$route.query.readOnly;
            }
            /* 课程编辑添加新的授课教师 */
            const {query: {type = ''}} = this.$route;
            this.isCourseEdit = type === 'COURSE_EDIT';
            this.init();
            this.teacherLevel();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.detail(this.$route.query.id);
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
                const params = {id};
                detail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showFileSelect(type) {
                if (this.readOnly) {
                    return;
                }
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
            clearCategory() {
                this.editQuery.categoryId = '';
                this.$refs.editQuery.validateField('categoryId');
            },
            showCategorySelect() {
                this.categoryDialogVisible = true;
                this.$refs.categoryInput.blur();
            },
            categoryDlgClose() {
                this.categoryDialogVisible = false;
            },
            // 选择类别
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.editQuery.categoryId = result.id;
                this.editQuery.categoryName = result.name;
                this.categoryDialogVisible = false;
                this.$refs.editQuery.validateField('categoryId');
            },
            sure() {
                this.editQuery = Object.assign({}, this.editQuery);
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        const pattern = /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi;
                        if (!pattern.test(this.editQuery.name)) {
                            this.$errorMsg('讲师姓名只能有中文、数字及字母组成');
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        save(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.cancel();
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                    }
                });
            },
            cancel() {
                if (this.isCourseEdit) {
                    this.$router.go(-1);
                } else {
                    this.$router.push({name: 'teacherList'});
                }
            },
            // 等级
            teacherLevel() {
                teacherLevel(this.funCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.levelList = result.data.child || [];
                    } else {
                        this.$errorMsg(result.msg || this.$t('等级查询失败'));
                    }
                });
            },
            // 选择人员
            showPersonSelect() {
                this.personDialogVisible = true;
                this.$refs.personInput.blur();
            },
            personSelect() {
                const $person = this.$refs.person;
                const result = $person.getActive();
                const {
                    id,
                    name,
                    mobile,
                    email,
                    sex,
                    province,
                    city,
                    address
                } = result;
                const data = {
                    name,
                    mobile,
                    email,
                    sex,
                    province,
                    city,
                    address
                };
                this.editQuery.userId = id;
                this.editQuery.name = name;
                this.editQuery = Object.assign({}, this.editQuery, data);
                this.personDialogVisible = false;
                this.$refs.editQuery.validateField('name');
            },
            clearName() {
                this.editQuery.userId = '';
                this.editQuery.name = '';
                this.editQuery.mobile = '';
                this.editQuery.email = '';
                this.editQuery.sex = '';
            },
            // 切换类型
            selectSource() {
                this.clearName();
                this.mobileKey = +new Date();
            },
            handleEdit() {
                this.readOnly = false;
            }
        }
    };
</script>
