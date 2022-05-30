<style lang="scss" scoped>
    @import './style';
</style>
<style lang="scss">
    .xzzjsj_dialog {
        .el-dialog {
            height: 656px;
        }

        .vps__table__wrapper {
            padding: 0;
        }

        .vps__btn__line {
            position: absolute;
            bottom: 9px;
            right: 0;
            overflow: hidden;
        }
    }
</style>

<template>
    <article class="app-container form__page">
        <el-form
            ref="listQuery"
            :model="listQuery"
            label-width="120px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <el-form-item :label="$t('工号') + '：'" prop="code">
                    <el-input v-model.trim="listQuery.code" :placeholder="$t('工号')" :max-length="50"/>
                </el-form-item>
                <el-form-item :label="$t('姓名') + '：'" prop="name">
                    <el-input v-model.trim="listQuery.name" :placeholder="$t('姓名')" :max-length="50"/>
                </el-form-item>
                <el-form-item :label="$t('用户名') + '：'" prop="loginName">
                    <el-input
                        v-model.trim="listQuery.loginName"
                        :placeholder="$t('用户名')"
                        :max-length="50"
                    />
                </el-form-item>
                <el-form-item :label="$t('部门') + '：'" prop="orgId">
                    <el-input
                        ref="orgInput"
                        v-model.trim="listQuery.orgName"
                        :placeholder="$t('部门')"
                        :max-length="32"
                        clearable
                        @focus="showOrganizeSelect"
                    />
                </el-form-item>
                <el-form-item v-if="!hasBgk" :label="$t('岗位') + '：'" prop="positionId">
                    <el-input
                        ref="postInput"
                        v-model.trim="listQuery.positionName"
                        :placeholder="$t('岗位')"
                        :max-length="32"
                        clearable
                        @focus="showPostSelect"
                    />
                </el-form-item>
                <el-form-item :label="$t('手机号') + '：'" prop="mobile">
                    <el-input
                        v-model.trim="listQuery.mobile"
                        :placeholder="$t('手机号')"
                        :max-length="20"
                    />
                </el-form-item>
                <el-form-item :label="$t('直属上级') + '：'" prop="leaderId">
                    <el-input
                        ref="personInput"
                        v-model.trim="listQuery.leaderName"
                        :placeholder="$t('直属上级')"
                        :max-length="32"
                        clearable
                        @focus="showPersonSelect"
                    />
                </el-form-item>
                <div v-show="!hasBgk">
                    <veln-label-select
                        ref="labels"
                        label-type="PERSONNEL"
                        :default-labels="listQuery.labels"
                        :validator-flag="false"
                    />
                </div>
                <el-form-item v-if="!hasBgk" :label="$t('所属角色') + '：'" prop="roleIds">
                    <el-checkbox-group v-model="listQuery.roleIds">
                        <el-checkbox
                            v-for="(role, index) in roles"
                            :key="index"
                            :label="role.id"
                        >{{ role.name }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </veln-form-section>
            <veln-form-section :title="$t('其他信息')" :expand="false">
                <el-form-item :label="$t('邮箱') + '：'" prop="email">
                    <el-input
                        v-model.trim="listQuery.email"
                        :placeholder="$t('邮箱')"
                        :max-length="50"
                    />
                </el-form-item>
                <el-form-item :label="$t('身份证号') + '：'" prop="idCard">
                    <el-input
                        v-model.trim="listQuery.idCard"
                        :placeholder="$t('身份证号')"
                        :max-length="20"
                    />
                </el-form-item>
                <el-form-item :label="$t('性别') + '：'">
                    <el-select v-model="listQuery.userDetail.sex" :placeholder="$t('请选择')">
                        <el-option :label="$t('男')" value="MALE"/>
                        <el-option :label="$t('女')" value="FEMALE"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('所在地') + '：'">
                    <veln-address-picker
                        ref="address"
                        :province="listQuery.userDetail.province"
                        :city="listQuery.userDetail.city"
                        :address="listQuery.userDetail.address"
                    />
                </el-form-item>
                <el-form-item :label="$t('入职日期') + '：'" prop="entryAt">
                    <el-date-picker
                        v-model="listQuery.entryAt"
                        type="date"
                        placeholder="入职日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                    />
                </el-form-item>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('确定') }}</el-button>
            </section>
        </el-form>
        <el-dialog
            append-to-body
            :title="$t('选择部门')"
            :visible.sync="organizeDialogVisible"
            width="339px"
        >
            <veln-organize-select ref="organize"/>
            <div class="dialog__btn__line">
                <el-button @click="organizeDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="organizeSelect">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            append-to-body
            :title="$t('选择岗位')"
            :visible.sync="postDialogVisible"
            width="339px"
        >
            <veln-position-select ref="position" :category="true"/>
            <div class="dialog__btn__line">
                <el-button @click="postDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="postSelect">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            append-to-body
            :title="$t('选择直接上级')"
            :visible.sync="personDialogVisible"
            width="920px"
            class="xzzjsj_dialog"
        >
            <veln-person-select ref="person"/>
            <div>
                <div class="vps__btn__line">
                    <el-button @click="personDialogVisible=false">取消</el-button>
                    <el-button
                        v-if="checkPermission('addUser') || checkPermission('updUser')"
                        type="primary"
                        @click="personSelect"
                    >保存
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    /**
     * todo
     * 1. 编辑
     */
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnOrganizeSelect from '@/components/VelnOrganizeSelect';
    import VelnPositionSelect from '@/components/VelnPositionSelect';
    import VelnPersonSelect from '@/components/VelnPersonSelect';
    import VelnLabelSelect from '@/components/VelnLabelSelect';
    import VelnAddressPicker from '@/components/VelnAddressPicker';

    import {validateFormEmail, validateFormIdCard, validateFormMobile, validateFormPassword} from '@/utils/validate';

    import {listAllUserRole} from '@/api/role';

    import {getUserAllInfo, userSave, userUpdate} from '@/api/user';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'PersonEdit',
        components: {
            VelnFormSection,
            VelnOrganizeSelect,
            VelnPositionSelect,
            VelnPersonSelect,
            VelnLabelSelect,
            VelnAddressPicker
        },
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            return {
                hasBgk, // 北国会
                listQuery: {
                    code: '', // 工号
                    name: '', // 姓名
                    loginName: '', // 用户名
                    pwd: '', // 登录密码
                    orgId: '', // 部门ID
                    orgName: '', // 部门名称
                    positionId: '', // 岗位ID
                    positionName: '', // 岗位名称
                    leaderId: '', // 隶属上级ID
                    leaderName: '', // 隶属上级名称
                    entryAt: '', // 入职时间
                    roleIds: [],
                    email: '',
                    idCard: '',
                    labels: [],
                    userDetail: {
                        sex: '',
                        province: '',
                        city: '',
                        address: ''
                    }
                },
                defaultLabels: [],
                rules: {
                    code: [
                        {
                            required: true,
                            message: this.$t('请输入工号'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入姓名'),
                            trigger: 'blur'
                        }
                    ],
                    loginName: [
                        {
                            required: true,
                            message: this.$t('请输入用户名'),
                            trigger: 'blur'
                        }
                    ],
                    pwd: [
                        {
                            required: true,
                            message: this.$t('请输入登录密码'),
                            trigger: 'blur'
                        },
                        {validator: validateFormPassword, trigger: 'blur'}
                    ],
                    orgId: [{required: true, message: this.$t('请选择部门')}],
                    email: [{validator: validateFormEmail, trigger: 'blur'}],
                    idCard: [{validator: validateFormIdCard, trigger: 'blur'}],
                    mobile: [{
                        required: false,
                        message: this.$t('请输入手机号'),
                        trigger: 'blur'
                    }, {validator: validateFormMobile, trigger: 'blur'}]
                },
                organizeDialogVisible: false, // 部门选择
                postDialogVisible: false, // 岗位选择
                personDialogVisible: false, // 上级选择
                roles: []
            };
        },
        created() {
            this.listAllUserRole();
            if (this.$route.query.id) {
                this.getUserAllInfo(this.$route.query.id);
            }
        },
        methods: {
            checkPermission,
            getUserAllInfo(id) {
                const params = {
                    userId: id
                };
                getUserAllInfo(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        result.data.roleIds = result.data.roleIds || [];
                        this.listQuery = Object.assign(
                            {},
                            this.listQuery,
                            result.data
                        );
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取用户信息出错'));
                    }
                });
            },
            organizeSelect() {
                const $organize = this.$refs.organize;
                const result = $organize.getActive();
                if (!result.manage) {
                    this.$warnMsg(this.$t('无权限，请联系系统管理员'));
                    return;
                }
                this.listQuery.orgId = result.id;
                this.listQuery.orgName = result.name;
                this.organizeDialogVisible = false;
            },
            showOrganizeSelect() {
                this.organizeDialogVisible = true;
                this.$refs.orgInput.blur();
            },
            postSelect() {
                const $position = this.$refs.position;
                const result = $position.getActive();
                if (!result.category) {
                    this.$warnMsg(this.$t('不能选择岗位类别'));
                    return;
                }
                this.listQuery.positionId = result.id;
                this.listQuery.positionName = result.name;
                this.postDialogVisible = false;
            },
            showPostSelect() {
                this.postDialogVisible = true;
                this.$refs.postInput.blur();
            },
            personSelect() {
                const $person = this.$refs.person;
                const result = $person.getActive();
                this.listQuery.leaderId = result.id;
                this.listQuery.leaderName = result.name;
                this.personDialogVisible = false;
            },
            showPersonSelect() {
                this.personDialogVisible = true;
                this.$refs.personInput.blur();
            },
            listAllUserRole() {
                listAllUserRole().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.roles = result.data;
                    }
                });
            },
            cancel() {
                history.go(-1);
            },
            sure() {
                this.listQuery.labels = this.$refs.labels.listQuery.labels;
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                this.$refs.listQuery.validate(valid => {
                    if (valid) {
                        const params = Object.assign({}, this.listQuery);
                        if (!this.listQuery.id) {
                            userSave(params).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    history.go(-1);
                                } else {
                                    this.$errorMsg(
                                        this.$t(result.msg || '保存失败')
                                    );
                                }
                            });
                            return;
                        }
                        userUpdate(params).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                history.go(-1);
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            }
        }
    };
</script>
