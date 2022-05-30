<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="app-container cert__edit">
        <aside class="cert__edit__preview__wrapper">
            <div class="cert__edit__preview first">
                <div class="cert__logo">{{ $t('模板') }}</div>
                <div class="cert__name">{{ editQuery.name }}</div>
                <div class="cert__remark">{{ editQuery.remark }}</div>
                <div class="cert__duration">{{ `${$t('有效期')}：${editQuery.duration}${$t('月')}` }}</div>
                <div class="cert__rule">{{ `${$t('序列号')}：${editQuery.ruleEn}${editQuery.ruleNum}` }}</div>
                <div class="cert__date">{{ editQuery.date }}</div>
                <div class="cert__qrcode"/>
                <div class="cert__org">{{ editQuery.certOrg }}</div>
            </div>
        </aside>
        <section class="cert__edit__form">
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="100px">
                <el-form-item :label="$t('证书编码') + '：'" prop="code" :rules="[rules.required]">
                    <el-input v-model="editQuery.code" :placeholder="$t('请输入证书编码')" disabled/>
                </el-form-item>
                <el-form-item :label="$t('证书名称') + '：'" prop="name" :rules="[rules.required]">
                    <el-input v-model="editQuery.name" :placeholder="$t('请输入证书名称')" maxlength="9"/>
                </el-form-item>
                <el-form-item
                    :label="$t('证书类别') + '：'"
                    prop="categoryName"
                    :rules="[rules.required]"
                >
                    <el-input
                        ref="category"
                        v-model="editQuery.categoryName"
                        :placeholder="$t('请选择证书类别')"
                        clearable
                        @focus="showCertCategorySelect"
                    />
                </el-form-item>
                <el-form-item :label="$t('发证机构') + '：'" prop="certOrg" :rules="[rules.required]">
                    <el-input
                        v-model="editQuery.certOrg"
                        :placeholder="$t('请输入发证机构')"
                        maxlength="6"
                    />
                </el-form-item>
                <el-form-item
                    :label="$t('有效期') + '：'"
                    prop="duration"
                    :rules="[rules.required, rules.integer]"
                >
                    <el-input
                        v-model="editQuery.duration"
                        class="cert__form__duration__input"
                        :placeholder="$t('请输入有效期')"
                        maxlength="3"
                    />
                    <span class="cert__form__duration__tag">{{ $t('月') }}</span>
                </el-form-item>
                <section class="cert__form__order">
                    <div class="cert__form__order__label">{{ $t('序列规则') }}：</div>
                    <el-form-item prop="ruleEn" :rules="[rules.english]">
                        <el-input
                            v-model="editQuery.ruleEn"
                            :placeholder="$t('英文字母')"
                            maxlength="6"
                        />
                    </el-form-item>
                    <span class="cert__form__order__link">+</span>
                    <el-form-item prop="ruleNum" :rules="[rules.integer]">
                        <el-input v-model="editQuery.ruleNum" :placeholder="$t('数字')" maxlength="6"/>
                    </el-form-item>
                    <div class="cert__form__order__tips">（如不填写，则证书上不展示）</div>
                </section>
                <el-form-item :label="$t('说明') + '：'" prop="remark">
                    <el-input
                        v-model="editQuery.remark"
                        type="textarea"
                        :placeholder="$t('请输入说明文字')"
                        maxlength="200"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSure">{{ $t('确定') }}</el-button>
                    <el-button @click="onCancel">{{ $t('取消') }}</el-button>
                </el-form-item>
            </el-form>
        </section>
        <el-dialog
            append-to-body
            :title="$t('选择部门')"
            :visible.sync="certDialogVisible"
            width="339px"
        >
            <veln-cert-category-select ref="certCategory"/>
            <div class="dialog__btn__line">
                <el-button @click="certDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="certCategorySelect">保存</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import VelnCertCategorySelect from '@/components/VelnCertCategorySelect';
    import {validateInteger, validateEnglish} from '@/utils/validate';
    import {certSave, getCertCode, getCertDetail} from '@/api/cert/certInfo';
    import moment from 'moment';
    export default {
        name: 'CertEdit',
        components: {
            VelnCertCategorySelect
        },
        data() {
            return {
                editQuery: {
                    id: '',
                    code: '', // 编号
                    date: '',
                    name: '', // 名称
                    categoryId: '', // 类别Id
                    categoryName: '', // 类别名称
                    certOrg: '', // 发证机构
                    duration: '', // 有效时长(月)
                    templateId: '', // 模板Id
                    ruleEn: '', // 序列号规则英文部分
                    ruleNum: '', // 序列号数字部分
                    remark: '' // 说明
                },
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
                        trigger: 'blur'
                    },
                    integer: {
                        validator: validateInteger,
                        trigger: 'blur'
                    },
                    english: {
                        validator: validateEnglish,
                        trigger: 'blur'
                    }
                },
                certDialogVisible: false
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.editQuery.id = this.$route.query.id;
                this.getDetail();
            } else {
                this.getCode();
            }
            this.editQuery.date = moment().format('YYYY.MM.DD');
        },
        methods: {
            getCode() {
                getCertCode().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery.code = result.data;
                    } else {
                        this.$$errorMsg(this.$t(result.msg || '获取证书编号错误'));
                    }
                });
            },
            getDetail() {
                getCertDetail(this.editQuery.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery = Object.assign(this.editQuery, result.data);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取证书数据失败'));
                    }
                });
            },
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    certSave(this.editQuery).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('保存成功'));
                            history.back();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '保存失败'));
                        }
                    });
                });
            },
            onCancel() {
                history.go(-1);
            },
            certCategorySelect() {
                const $certCategory = this.$refs.certCategory;
                const result = $certCategory.getActive();
                this.editQuery.categoryId = result.id;
                this.editQuery.categoryName = result.name;
                this.$refs.editQuery.validateField('categoryName');
                this.certDialogVisible = false;
            },
            showCertCategorySelect() {
                this.certDialogVisible = true;
                this.$refs.category.blur();
            }
        }
    };
</script>
