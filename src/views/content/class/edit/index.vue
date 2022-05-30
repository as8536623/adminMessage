<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
            :disabled="readonly"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <el-form-item :label="$t('编号') + '：'" prop="code" :rules="rules.required">
                    <el-input v-model.trim="editQuery.code" :placeholder="$t('编号')" :max-length="50"/>
                </el-form-item>
                <el-form-item
                    :label="$t('班级名称') + '：'"
                    prop="name"
                    :rules="rules.required"
                >
                    <el-input
                        ref="personInput"
                        v-model.trim="editQuery.name"
                        :placeholder="$t('请填写班级名称')"
                        :max-length="32"
                        clearable
                    />
                </el-form-item>
                <el-form-item :label="$t('班级类别') + '：'" prop="categoryId">
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
                <el-form-item :label="$t('任课老师') + '：'" prop="headTeacherId">
                    <el-input
                        ref="teacherInput"
                        v-model.trim="editQuery.headTeacherName"
                        :placeholder="$t('任课老师')"
                        :max-length="32"
                        clearable
                        @clear="clearTeacher"
                        @focus="showTeacherSelector"
                    />
                </el-form-item>
                <el-form-item :label="$t('备注') + '：'" prop="remark">
                    <el-input
                        v-model.trim="editQuery.remark"
                        type="textarea"
                        :placeholder="$t('备注')"
                        :rows="6"
                        :max-length="500"
                        clearable
                    />
                </el-form-item>
                <el-form-item v-if="!readonly" :label="$t('')" class="course__upload__line">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('完成') }}</el-button>
                </el-form-item>
            </veln-form-section>
        </el-form>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择类别')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-group-select
                ref="category"
                :default-expand-all="defaultExpandAll"
            />
            <div class="dialog__btn__line">
                <el-button @click="categoryDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="categorySelect">确定</el-button>
            </div>
        </el-dialog>
        <teacher-selector ref="teacherSelector" @sure="selectTeacher"/>
    </article>
</template>

<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnGroupSelect from '@/components/VelnGroupSelect';
    import TeacherSelector from '@/components/TeacherSelector';
    import {getGroupDetail, insertGroup, updateGroup, getCode} from '@/api/group';
    import {TEACHER_JOB_TYPE_ENUM, TEACHER_TYPE_ENUM} from '@/enum';
    import {mapGetters} from 'vuex';
    import {getNodeTree} from '@/api/commonTree';

    export default {
        name: 'TeacherEdit',
        components: {
            VelnFormSection,
            VelnGroupSelect,
            TeacherSelector
        },
        data() {
            return {
                TEACHER_TYPE_ENUM,
                TEACHER_JOB_TYPE_ENUM,
                editQuery: {
                    id: this.$route.query.id,
                    schoolId: '',
                    code: '', // 编号
                    name: '', // 班级名册
                    categoryId: '', // 班级类别ID
                    categoryName: '', // 班级名称
                    headTeacherId: '', // 讲师ID
                    headTeacherName: '', // 讲师名称
                    remark: '' // 备注
                },
                categoryDialogVisible: false,
                defaultExpandAll: true,
                levelList: [],
                funCode: 'uc_group_category',
                personDialogVisible: false,
                mobileKey: null,
                readonly: false,
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
                    headTeacherId: [
                        {
                            required: true,
                            message: this.$t('请选择讲师'),
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        mounted() {
            const {schoolId, readonly} = this.$route.query;
            if (schoolId) {
                this.editQuery.schoolId = schoolId;
            }
            if (readonly) {
                this.readonly = readonly;
            }
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
                getGroupDetail(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const data = result.data;
                        const {categoryNamePath} = data;
                        const categoryName = categoryNamePath.split('.').pop();
                        data.categoryName = categoryName;
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
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        // if (this.$store.getters.ajaxIng) {
                        //     return;
                        // }
                        // this.$store.dispatch('setAjaxIng', true);
                        if (!this.editQuery.id) {
                            insertGroup(this.editQuery).then(res => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = res.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.cancel();
                                } else {
                                    this.$errorMsg(result.msg || this.$t('保存失败'));
                                }
                            });
                            return;
                        }
                        updateGroup(this.editQuery).then(res => {
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
                this.$router.push({name: 'classList'});
            },
            // 等级
            teacherLevel() {
                getNodeTree(this.funCode).then(re => {
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
            showTeacherSelector() {
                this.$refs.teacherSelector.show();
            },
            clearTeacher() {
                this.editQuery.headTeacherId = '';
                this.editQuery.headTeacherName = '';
            },
            selectTeacher(teacherList) {
                const teacher = teacherList[0];
                const {id, name} = teacher;
                this.editQuery.headTeacherId = id;
                this.editQuery.headTeacherName = name;
                this.$refs.editQuery.validateField('headTeacherId');
            }
        }
    };
</script>
