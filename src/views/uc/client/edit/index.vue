<style lang="scss" scoped>
    @import './style';

    .dialog-footer {
        display: flex;
        justify-content: center;
    }
</style>

<template>
    <article class="app-container form__page">
        <el-form
            ref="listQuery"
            :model="listQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
            :disabled="readonly"
        >
            <el-form-item :label="$t('编号') + '：'">
                <el-input v-model.trim="listQuery.code" :placeholder="$t('编号')" :max-length="50" readonly/>
            </el-form-item>
            <el-form-item :label="$t('企业名称') + '：'" prop="name">
                <el-input v-model.trim="listQuery.name" :placeholder="$t('企业名称')" :max-length="50"/>
            </el-form-item>
            <el-form-item :label="$t('联系人') + '：'" prop="contactPerson">
                <el-input
                    v-model.trim="listQuery.contactPerson"
                    :placeholder="$t('联系人')"
                    :max-length="10"
                />
            </el-form-item>
            <el-form-item :label="$t('联系电话') + '：'" prop="contactMobile">
                <el-input
                    v-model.trim="listQuery.contactMobile"
                    :placeholder="$t('联系电话')"
                    :max-length="20"
                />
            </el-form-item>
            <el-form-item :label="$t('关联人员') + '：'" prop="userId">
                <el-tag
                    v-for="tag in listQuery.userId"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    @close="deletePersonTag(tag)"
                >
                    {{ tag.name }}
                </el-tag>
                <el-button v-if="!listQuery.userId.length" class="button-new-tag edit-tag-btn" size="small" @click="showPersonSelectDialog">选择人员</el-button>
            </el-form-item>
            <el-form-item label="所属职业：" class="veln__address__province">
                <industry-cascader
                    v-model="industry"
                    :placeholder="$t('请选择所属职业')"
                />
            </el-form-item>
            <el-form-item :label="$t('所在地') + '：'" prop="addressNum">
                <el-cascader
                    v-model="addressNum"
                    :options="regionData"
                />
            </el-form-item>
            <el-form-item :label="$t('详细地址') + '：'" prop="address">
                <el-input
                    v-model.trim="listQuery.address"
                    type="textarea"
                    :placeholder="$t('详细地址')"
                    :rows="4"
                    :max-length="200"
                    clearable
                />
            </el-form-item>
            <el-form-item :label="$t('邮政编码') + '：'" prop="postcode">
                <el-input
                    v-model.trim="listQuery.postcode"
                    :placeholder="$t('邮政编码')"
                    :max-length="10"
                />
            </el-form-item>
            <el-form-item :label="$t('邮箱') + '：'" prop="email">
                <el-input
                    v-model.trim="listQuery.email"
                    :placeholder="$t('邮箱')"
                    :max-length="50"
                />
            </el-form-item>
            <el-form-item :label="$t('备注') + '：'" prop="remarks">
                <el-input
                    v-model.trim="listQuery.remarks"
                    type="textarea"
                    :placeholder="$t('备注')"
                    :rows="6"
                    :max-length="500"
                    clearable
                />
            </el-form-item>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('确定') }}</el-button>
            </section>
        </el-form>
        <el-dialog width="70%" title="关联人员" :append-to-body="true" :visible.sync="dialogVisible">
            <veln-person-select ref="personSelect"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="personSelectDialogToggle('CANCEL')">取 消</el-button>
                <el-button type="primary" @click="personSelectDialogToggle('CONFIRM')">确 定</el-button>
            </span>
        </el-dialog>
    </article>
</template>

<script>
    /**
     * todo
     * 1. 编辑
     */
    import {validateFormEmail, validateFormMobile} from '@/utils/validate';
    import {getCode} from '@/api/teacher/teacher';
    import checkPermission from '@/utils/permission';
    import {regionData} from 'element-china-area-data';
    import {getCustomer, saveCustomer} from '@/api/customer';
    import IndustryCascader from '@/components/Common/IndustryCascader';
    import {transformCodeToTrade, transformsCodeToAddress} from '@/utils/common';
    import VelnPersonSelect from '@/components/VelnPersonSelect';

    export default {
        name: 'ClientEdit',
        components: {
            IndustryCascader,
            VelnPersonSelect
        },
        data() {
            return {
                regionData,
                industryList: null,
                readonly: false,
                industry: [], // 行业
                addressNum: [], // 省市区
                listQuery: {
                    code: '', // 编号
                    name: '', // 姓名
                    contactPerson: '', // 联系人
                    contactMobile: '', // 联系电话
                    entryAt: '', // 入职时间
                    remarks: '', // 备注
                    roleIds: [],
                    email: '',
                    address: '',
                    industry: '', // 行业
                    postcode: '', // 邮编
                    addressNum: '', // 所在地
                    userId: []
                },
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
                    contactPerson: [
                        {
                            required: true,
                            message: this.$t('请输入联系人'),
                            trigger: 'blur'
                        }
                    ],
                    appKey: [
                        {
                            required: true,
                            message: this.$t('请输入AppKey'),
                            trigger: 'blur'
                        }
                    ],
                    appSecret: [
                        {
                            required: true,
                            message: this.$t('请输入AppSecret'),
                            trigger: 'blur'
                        }
                    ],
                    email: [{validator: validateFormEmail, trigger: 'blur'}],
                    contactMobile: [{
                        required: true,
                        message: this.$t('请输入联系电话'),
                        trigger: 'blur'
                    }, {validator: validateFormMobile, trigger: 'blur'}]
                },
                dialogVisible: false
            };
        },
        async mounted() {
            const {id, readonly} = this.$route.query;
            if (id) {
                this.getUserAllInfo(id);
            } else {
                this.getCode();
            }
            this.readonly = readonly;
        },
        methods: {
            checkPermission,
            // 获取code
            getCode() {
                getCode().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.listQuery.code = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取编号异常'));
                    }
                });
            },
            getUserAllInfo(id) {
                const params = {
                    id
                };
                getCustomer(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const data = result.data;
                        if (data.industry) {
                            this.industry = transformCodeToTrade(data.industry);
                        }
                        if (data.addressNum) {
                            this.addressNum = transformsCodeToAddress(String(data.addressNum));
                        }
                        if (result.data.userId && result.data.user) {
                            result.data.userId = [result.data.user];
                        }
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
            sure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                this.$refs.listQuery.validate(valid => {
                    if (valid) {
                        const params = Object.assign({}, this.listQuery);
                        if (Array.isArray(this.industry) && this.industry.length) {
                            params.industry = this.industry.pop();
                        }
                        if (Array.isArray(this.addressNum) && this.addressNum.length) {
                            params.addressNum = this.addressNum.pop();
                        }
                        if (Array.isArray(params.userId)) {
                            params.userId = Array.from(params.userId).map(v => v.id).join('');
                        }
                        saveCustomer(params).then(re => {
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
                    }
                });
            },
            showPersonSelectDialog() {
                this.dialogVisible = true;
            },
            personSelectDialogToggle(type) {
                switch (type) {
                    case 'CONFIRM':
                        var active = this.$refs.personSelect.active;
                        if (active && active.id) {
                            this.listQuery.userId = [active];
                        }
                        this.dialogVisible = false;
                        break;
                    case 'CANCEL':
                        this.dialogVisible = false;
                        break;
                }
            },
            deletePersonTag() {
                this.listQuery.userId = [];
            }
        }
    };
</script>
