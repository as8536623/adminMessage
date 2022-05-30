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
                <el-form-item :label="$t('学号') + '：'" prop="code" :rules="rules.required">
                    <el-input v-model.trim="editQuery.code" :placeholder="$t('编号')" :max-length="50"/>
                </el-form-item>
                <el-form-item :label="$t('姓名') + '：'" prop="name" :rules="rules.required">
                    <el-input
                        v-model.trim="editQuery.name"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item :label="$t('用户名') + '：'" prop="loginName" :rules="rules.required">
                    <el-input
                        v-model.trim="editQuery.loginName"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <!--<el-form-item :label="$t('登录密码') + '：'" prop="password" :rules="rules.required">-->
                <!--    <el-input-->
                <!--        v-model.trim="editQuery.password"-->
                <!--        class="input__limit"-->
                <!--        type="password"-->
                <!--        :placeholder="$t('长度小于20')"-->
                <!--        maxlength="20"-->
                <!--    />-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('校区') + '：'" prop="orgId" :rules="rules.required">
                    <el-input
                        v-model.trim="editQuery.orgName"
                        disabled
                    />
                </el-form-item>
                <el-form-item :label="$t('班级') + '：'" prop="groupId" :rules="rules.required">
                    <el-input
                        ref="categoryInput"
                        v-model.trim="editQuery.groupName"
                        :placeholder="$t('请选择班级')"
                        :max-length="32"
                        clearable
                        @clear="clearCategory"
                        @focus="showCategorySelect"
                    />
                </el-form-item>
                <el-form-item :label="$t('联系人') + '：'">
                    <el-input
                        v-model.trim="editQuery.userDetail.familyTel"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('联系人姓名')"
                        maxlength="50"
                    />
                </el-form-item>
                <el-form-item :label="$t('联系手机') + '：'" prop="mobile">
                    <el-input
                        v-model.trim="editQuery.mobile"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('联系手机')"
                        maxlength="50"
                    />
                </el-form-item>
                <el-form-item :label="$t('出生年月') + '：'" prop="birthday">
                    <el-date-picker
                        v-model="editQuery.userDetail.birthday"
                        type="date"
                        placeholder="出生年月"
                    />
                </el-form-item>
                <el-form-item :label="$t('性别') + '：'">
                    <el-select
                        v-model="editQuery.userDetail.sex"
                        :placeholder="$t('请选择')"
                    >
                        <el-option :label="$t('男')" value="MALE"/>
                        <el-option :label="$t('女')" value="FEMALE"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('备注') + '：'" prop="remark">
                    <el-input
                        v-model.trim="editQuery.userDetail.remark"
                        type="textarea"
                        :placeholder="$t('备注')"
                        :rows="6"
                        :max-length="500"
                        clearable
                    />
                </el-form-item>
                <el-form-item v-if="!readOnly" :label="$t('')" class="course__upload__line">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('完成') }}</el-button>
                </el-form-item>
            </veln-form-section>
        </el-form>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择年级')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-group-select
                ref="category"
                type="CHILD"
                :org-id="editQuery.orgId"
                :default-expand-all="defaultExpandAll"
            />
            <div class="dialog__btn__line">
                <el-button @click="categoryDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="categorySelect">确定</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import moment from 'moment';
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnGroupSelect from '@/components/VelnGroupSelect';
    import {getStudent, insertStudent, updateStudent} from '@/api/group';
    import {validateFormMobile} from '@/utils/validate';
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/utils';

    export default {
        name: 'TeacherEdit',
        components: {
            VelnFormSection,
            VelnGroupSelect
        },
        data() {
            return {
                editQuery: {
                    code: '',
                    name: '',
                    loginName: '',
                    groupId: '',
                    groupName: '',
                    userDetail: {
                        sex: '',
                        familyTel: '',
                        birthday: '', // 出生年月
                        remark: ''
                    },
                    orgId: '',
                    orgName: '',
                    // password: '', // 密码
                    contactName: '', // 联系人
                    contactPhone: '', // 联系手机
                    class: '',
                    id: this.$route.query.id
                },
                categoryDialogVisible: false,
                defaultExpandAll: true,
                funCode: 'uc_group_category',
                readOnly: false,
                rules: {
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ],
                    groupId: [
                        {
                            required: true,
                            message: this.$t('请选择类别'),
                            trigger: 'blur'
                        }
                    ],
                    contactPhone: [
                        {
                            validator: validateFormMobile,
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
            if (this.$route.query.readOnly) {
                this.readOnly = this.$route.query.readOnly;
            }
            this.init();
        },
        methods: {
            init() {
                const {orgId, orgName, id} = this.$route.query;
                if (orgId) {
                    this.editQuery.orgId = orgId;
                    this.editQuery.orgName = orgName;
                }
                if (id) {
                    this.detail(id);
                }
            },
            // 编辑回显
            detail(id) {
                const params = {id};
                getStudent(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const data = result.data;
                        const {groupBase} = data;
                        const {id, name} = groupBase;
                        data.groupId = id;
                        data.groupName = name;
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
                this.editQuery.groupId = '';
                this.$refs.editQuery.validateField('groupId');
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
                if (result.category) {
                    this.$warnMsg(this.$t('请选择具体班级'));
                    return;
                }
                this.editQuery.groupId = result.id;
                this.editQuery.groupName = result.name;
                this.categoryDialogVisible = false;
                this.$refs.editQuery.validateField('groupId');
            },
            sure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const params = deepClone(this.editQuery);
                        params.userDetail.birthday =
                            params.userDetail.birthday
                                ? moment(params.userDetail.birthday).format('YYYY-MM-DD 00:00:00')
                                : '';
                        if (!this.editQuery.id) {
                            insertStudent(params).then(res => {
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
                        updateStudent(params).then(res => {
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
                this.$router.push({name: 'studentList'});
            }
        }
    };
</script>
