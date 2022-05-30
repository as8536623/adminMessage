<style lang="scss" scoped>
@import './style';
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
                <el-form-item :label="$t('姓名') + '：'" prop="name" :rules="rules.required">
                    <el-input v-model.trim="listQuery.name" :placeholder="$t('姓名')" :max-length="50"/>
                </el-form-item>
                <el-form-item :label="$t('手机') + '：'" prop="mobile">
                    <el-input
                        v-model.trim="listQuery.mobile"
                        :placeholder="$t('手机')"
                        :max-length="20"
                    />
                </el-form-item>
                <el-form-item v-if="!hasBgk" :label="$t('公司') + '：'" prop="company">
                    <el-input
                        v-model.trim="listQuery.userDetail.company"
                        :placeholder="$t('公司')"
                        :max-length="50"
                    />
                </el-form-item>
                <el-form-item v-if="!hasBgk" :label="$t('岗位') + '：'" prop="post">
                    <el-input
                        v-model.trim="listQuery.userDetail.profession"
                        :placeholder="$t('岗位')"
                        :max-length="50"
                    />
                </el-form-item>
                <el-form-item :label="$t('邮箱') + '：'" prop="email">
                    <el-input
                        v-model.trim="listQuery.email"
                        :placeholder="$t('邮箱')"
                        :max-length="50"
                    />
                </el-form-item>
                <el-form-item :label="$t('性别') + '：'">
                    <el-select v-model="listQuery.userDetail.sex" :placeholder="$t('请选择')">
                        <el-option :label="$t('男')" value="MALE"/>
                        <el-option :label="$t('女')" value="FEMALE"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('地址') + '：'" prop="address">
                    <!--<el-input-->
                    <!--v-model.trim="listQuery.userDetail.companyAddress"-->
                    <!--:placeholder="$t('地址')"-->
                    <!--:maxLength="50"-->
                    <!--&gt;</el-input>-->
                    <veln-address-picker
                        ref="address"
                        :province="listQuery.userDetail.province"
                        :city="listQuery.userDetail.city"
                        :address="listQuery.userDetail.address"
                    />
                </el-form-item>
                <el-form-item :label="$t('备注') + '：'" prop="remark">
                    <el-input
                        v-model.trim="listQuery.userDetail.remark"
                        :placeholder="$t('备注')"
                        :max-length="50"
                    />
                </el-form-item>
                <veln-label-select ref="labels" label-type="PERSONNEL" :default-labels="listQuery.labels"/>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('确定') }}</el-button>
            </section>
        </el-form>
    </article>
</template>

<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnLabelSelect from '@/components/VelnLabelSelect';
    import VelnAddressPicker from '@/components/VelnAddressPicker';
    import {validateFormEmail, validateFormMobile} from '@/utils/validate';

    import {getUserAllInfo, saveOuterUser, updateOuterUser} from '@/api/user';

    export default {
        name: 'PersonOut',
        components: {
            VelnFormSection,
            VelnLabelSelect,
            VelnAddressPicker
        },
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            return {
                hasBgk, // 北国会
                listQuery: {
                    name: '', // 姓名
                    mobile: '', // 电话
                    userDetail: {
                        company: '', // 公司
                        profession: '', // 职位
                        companyAddress: '', // 地址
                        remark: '', // 备注
                        province: '',
                        city: '',
                        address: ''
                    },
                    email: null, // 邮箱
                    labels: [] // 标签
                },
                defaultLabels: [],
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请输入必填项'),
                        trigger: 'blur'
                    },
                    email: [{validator: validateFormEmail, trigger: 'blur'}],
                    mobile: [
                        {
                            required: true,
                            message: this.$t('请输入必填项'),
                            trigger: 'blur'
                        },
                        {validator: validateFormMobile, trigger: 'blur'}
                    ]
                },
                inputVisible: false,
                inputValue: ''
            };
        },
        created() {
            if (this.$route.query.id) {
                this.getUserAllInfo(this.$route.query.id);
            }
        },
        methods: {
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
            cancel() {
                history.go(-1);
            },
            handleClose(tag) {
                this.listQuery.labels.splice(this.listQuery.labels.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                const inputValue = this.inputValue;
                if (inputValue) {
                    this.listQuery.labels.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
                this.$refs.listQuery.validateField('tag');
            },
            sure() {
                const flag = this.$refs.labels.validateHandle();
                this.listQuery.labels = this.$refs.labels.listQuery.labels;
                const data = this.$refs.address.editQuery;
                this.listQuery.userDetail = Object.assign({}, this.listQuery.userDetail, data);
                this.$refs.listQuery.validate(valid => {
                    if (valid && flag) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const params = Object.assign({}, this.listQuery);
                        if (!this.listQuery.id) {
                            saveOuterUser(params).then(re => {
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
                        updateOuterUser(params).then(re => {
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
