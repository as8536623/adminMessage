<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <section class="opt__line">
            <div class="enterpriseNameOption">
                <el-form
                    :model="listQuery"
                    :inline="true"
                    label-width="90px"
                    class="demo-form-inline"
                >
                    <el-form-item :label="$t('企业名称') + '：'">
                        <el-select
                            v-model="listQuery.customerId"
                            class="course__type__select"
                            size="mini"
                            placeholder="请选择"
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
            <div class="timeBox">
                <span>时间范围：</span>
                <el-date-picker
                    v-model="searchDateTime"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="dateChange"
                />
            </div>
            <search-input
                v-model="listQuery.keywords"
                class="pull-right"
                width="320px"
                :placeholder="$t('请输入编号/企业名称')"
                @enter="search"
            />
        </section>
        <qgu-table
            :columns="tableColumns"
            :data="billingLogList"
            :page="listQuery"
            :total="billingLogTotal"
            :loading="listLoading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </article>
</template>

<script>
    import {getEnterpriseSelectList} from '@/api/common/enterpriseSelect';
    import {getBillingLogList} from '@/api/billing';
    import {deepClone} from '@/utils';
    export default {
        name: 'BillingLog',
        components: {},
        data() {
            const tableColumns = [
                {
                    field: 'customerName',
                    text: this.$t('企业名称'),
                    minWidth: 60,
                    align: 'center'
                },
                {
                    field: 'userName',
                    text: this.$t('用户'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'courseName',
                    text: this.$t('课程名称'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'itemName',
                    text: this.$t('章/节'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'srcSize',
                    text: this.$t('课时'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'chargePrice',
                    text: this.$t('扣费金额'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'createdAt',
                    text: this.$t('扣费时间'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'status',
                    text: this.$t('用户状态'),
                    minWidth: 90,
                    align: 'center'
                }
            ];
            return {
                tableColumns,
                listLoading: false,
                customerList: [], // 企业列表
                billingLogTotal: 0,
                billingLogList: [],
                listQuery: {
                    keywords: '',
                    pageNumber: 1,
                    pageSize: 20,
                    startDate: '',
                    endDate: '',
                    customerId: ''
                },
                userId: '',
                searchDateTime: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
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
                        this.listQuery.customerId = result.data[0].customerId;
                        this.listLoading = false;
                        this.getBillingLogListData();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            search() {
                this.getList({pageNumber: 1});
            },
            handleSizeChange(v) {
                this.getList({pageNumber: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNumber: v});
            },
            handleCheckChange(value) {
                this.customerId = value;
            },
            getBillingLogListData() {
                this.listLoading = true;
                this.listQuery.startDate = this.searchDateTime && this.searchDateTime.length !== 0 ? this.searchDateTime[0] : '';
                this.listQuery.endDate = this.searchDateTime && this.searchDateTime.length !== 0 ? this.searchDateTime[1] : '';
                const data = deepClone(this.listQuery);
                getBillingLogList(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.billingLogList = result.data.list || [];
                        this.billingLogTotal = result.data.total;
                        this.listQuery.pageNumber = result.data.pageNum;
                        this.listQuery.pageSize = result.data.pageSize;
                        this.listLoading = false;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            dateChange() {
                this.getBillingLogListData();
            }
        }
    };
</script>
