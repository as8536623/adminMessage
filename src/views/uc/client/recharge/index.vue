<style lang="scss" src="./style.scss" scoped>
</style>

<template>
    <article class="container__padding news__list">
        <section class="opt__line">
            <div class="customerNameOption">
                <el-form
                    :model="rechargeListQuery"
                    :inline="true"
                    label-width="90px"
                    class="demo-form-inline"
                >
                    <el-form-item :label="$t('企业名称') + '：'">
                        <el-select
                            v-model="rechargeListQuery.customerId"
                            class="course__type__select"
                            size="mini"
                            :placeholder="$t('请选择')"
                            @change="handleCheckChange"
                        >
                            <el-option
                                v-for="item in customerList"
                                :key="item.customerId"
                                :label="item.customerName"
                                :value="item.customerId"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="rechargeBox">
                <div class="totalAmount">
                    <span>充值总额：</span>
                    <span class="black">{{ totalAmount }}</span>
                </div>
                <div class="currentAmount">
                    <span>当前余额：</span>
                    <span class="red">{{ currentAmount }}</span>
                </div>
            </div>
            <el-button type="primary" class="btn" @click="rechargeAmount">{{ $t('充值') }}</el-button>
            <el-button class="btn" @click="deductionRecord">{{ $t('扣款记录') }}</el-button>
        </section>
        <qgu-table
            :columns="tableColumns"
            :data="rechargeList"
            :page="rechargeListQuery"
            :total="total"
            :loading="listLoading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
        <el-dialog
            append-to-body
            :title="$t('充值')"
            :visible.sync="rechargeDialogVisible"
            width="500px"
            @close="handleRechargeClose"
        >
            <veln-recharge-amount
                :customer-id="rechargeListQuery.customerId"
                :customer-name="customerName"
                :current="currentAmount"
                :customer-list="customerList"
                :amount="amount"
                @close="handleRechargeClose"
                @onPay="handleClickPay"
            />
        </el-dialog>
    </article>
</template>

<script>
    import {getEnterpriseSelectList} from '@/api/common/enterpriseSelect';
    import {getRechargeList, getCustomerSumAmount, getCustomerRecharge, getRechargeResult} from '@/api/recharge';
    import {COMMON_STATUS_ENUM} from '@/enum';
    import VelnRechargeAmount from '@/components/VelnRechargeAmount';
    import {deepClone} from '@/utils';
    export default {
        name: 'Recharge',
        components: {
            VelnRechargeAmount
        },
        data() {
            const tableColumns = [
                {
                    field: 'id',
                    text: this.$t('序号'),
                    minWidth: 20,
                    align: 'center'
                },
                {
                    field: 'customerName',
                    text: this.$t('企业名称'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'rechargeAmount',
                    text: this.$t('充值金额'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'createdAt',
                    text: this.$t('充值时间'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'createdBy',
                    text: this.$t('充值用户'),
                    minWidth: 90,
                    align: 'center'
                }
            ];
            return {
                COMMON_STATUS_ENUM,
                tableColumns,
                listLoading: false,
                customerList: [], // 企业列表
                totalAmount: 0, // 充值总额
                currentAmount: 0, // 当前总额
                rechargeDialogVisible: false,
                rechargeListQuery: { // 充值查询参数
                    customerId: '', // 企业ID
                    pageNumber: 1,
                    pageSize: 20
                },
                rechargeList: [], // 充值列表
                total: 0,
                userId: '',
                customerName: '',
                amount: 0 // 充值金额
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList(condition) {
                this.listLoading = true;
                this.userId = this.$store.getters.userId;
                const userId = this.userId;
                getEnterpriseSelectList({userId}).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.customerList = result.data || [];
                        this.rechargeListQuery.customerId = result.data[0].customerId;
                        this.customerName = result.data[0].customerName;
                        this.listLoading = false;
                        this.getRechargeData();
                        this.getCustomerSumAmountData();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getRechargeData(keyword) {
                const data = Object.assign({}, this.rechargeListQuery);
                getRechargeList(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.rechargeList = result.data.list || [];
                        this.rechargeListQuery.pageNumber = result.data.pageNum;
                        this.rechargeListQuery.pageSize = result.data.pageSize;
                        this.total = result.data.total;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getCustomerSumAmountData() {
                const data = {
                    customerId: this.rechargeListQuery.customerId
                };
                getCustomerSumAmount(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.totalAmount = result.data.totalAmount || 0;
                        this.currentAmount = result.data.currentAmount || 0;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            handleSizeChange(v) {
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
            },
            rechargeAmount() {
                this.amount = 0;
                this.rechargeDialogVisible = true;
            },
            deductionRecord() {
                this.$router.push({name: 'billingLog'});
            },
            handleRechargeClose() {
                this.rechargeDialogVisible = false;
            },
            handleCheckChange(value) {
                this.customerId = value;
                this.getCustomerSumAmountData();
            },
            async handleClickPay(value) {
                this.amount = value.amount;
                const data = deepClone(value);
                await getCustomerRecharge(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        const insertRechargeData = result.data;
                        this.getRechargeResult(insertRechargeData);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                    this.handleRechargeClose();
                });
            },
            async getRechargeResult(data) {
                await getRechargeResult(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.getList({pageNum: 1});
                        this.$successMsg(this.$t(result.msg || '充值成功'));
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
