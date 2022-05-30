<style lang="scss" src="./style.scss" scoped>
</style>

<template>
    <article v-loading="ajaxTotal" class="veln__dgp__select" :class="{'outer': outer}">
        <div class="formBox">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="企业名称：">
                    <el-select
                        v-model="newCustomerId"
                        size="mini"
                        :placeholder="$t('请选择')"
                        @change="handleCheckChange"
                    >
                        <el-option
                            v-for="item in newCustomerList"
                            :key="item.customerId"
                            :label="item.customerName"
                            :value="item.customerId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="余额：">
                    <div class="currentRecharge">
                        <span>{{ newCurrentAmount }}</span>
                    </div>
                </el-form-item>
                <el-form-item label="充值金额：">
                    <el-input-number
                        v-model="form.amount"
                        :min="0"
                        :max="999999"
                        :precision="2"
                        :step="100"
                        :controls="false"
                    />
                </el-form-item>
                <el-form-item label="支付方式：">
                    <el-radio-group v-model="form.payType">
                        <el-radio :label="1">线下支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <div class="footerBox">
                        <el-button class="btn" @click="onClose">{{ $t('取消') }}</el-button>
                        <el-button class="btn" type="primary" @click="goPay">{{ $t('去支付') }}</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </article>
</template>

<script>
/**
 * 充值组件
 */
    export default {
        name: 'VelnRechargeAmount',
        components: {},
        props: {
            outer: {
                type: Boolean,
                default: false
            },
            currentAmount: {
                type: Number,
                default: 0
            },
            customerList: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            customerName: {
                type: String,
                default: ''
            },
            customerId: {
                type: String,
                default: ''
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                ajaxTotal: 0,
                form: {
                    customerName: this.customerName,
                    customerId: this.customerId,
                    amount: 0,
                    payType: 1
                },
                newCurrentAmount: this.currentAmount,
                newCustomerId: this.customerId,
                newCustomerList: this.customerList
            };
        },
        watch: {
            ajaxTotal(val) {
                if (val < 0) {
                    this.ajaxTotal = 0;
                }
            },
            newCustomerId(val) {
                this.newCustomerList.map(item => {
                    if (item.customerId === val) {
                        this.form.customerName = item.customerName;
                    }
                });
            },
            amount: {
                immediate: true,
                handler(val) {
                    this.form.amount = val;
                }
            }
        },
        mounted() {

        },
        methods: {
            onClose() {
                this.$emit('close');
            },
            handleCheckChange(value) {
                this.form.customerId = value;
            },
            goPay() {
                if (this.form.amount > 0) {
                    this.$emit('onPay', this.form);
                } else {
                    this.$errorMsg(this.$t('请输入充值金额'));
                }
            }
        }
    };
</script>
