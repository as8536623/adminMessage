<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <data-statistics-commonHead
            v-loading="headLoading"
            :statistics-data="statisticsData"
            :statistics-data-title="statisticsDataTitle"
            :customer-id="listQuery.customerId"
            @change="customerNameChange"
        />
        <section class="opt__line">
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
                :placeholder="$t('请输入课程名称')"
                @enter="search"
            />
        </section>
        <qgu-table
            :columns="tableColumns"
            :data="list"
            :page="listQuery"
            :total="total"
            :loading="listLoading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </article>
</template>

<script>
    import {getEnterpriseSelectList} from '@/api/common/enterpriseSelect';
    import {getCourseUsageDetialsList, getCouserUsageDetailsStatistics} from '@/api/courseUsageDetials';
    import DataStatisticsCommonHead from '@/components/dataStatisticsCommonHead';
    import checkPermission from '@/utils/permission';
    export default {
        name: 'CourseUsageDetails',
        components: {
            DataStatisticsCommonHead
        },
        data() {
            const tableColumns = [
                {
                    field: 'courseId',
                    text: this.$t('课程ID'),
                    minWidth: 80,
                    align: 'center'
                },
                {
                    field: 'courseName',
                    text: this.$t('课程名称'),
                    minWidth: 100,
                    align: 'center'
                },
                {
                    field: 'duration',
                    text: this.$t('课时'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'userNums',
                    text: this.$t('学习人数'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'sumPeroids',
                    text: this.$t('结算课时数'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'learnPeroids',
                    text: this.$t('实际学习课时'),
                    minWidth: 40,
                    align: 'center',
                    hidden: false
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 20,
                    align: 'center',
                    render: (h, param) => {
                        const optArr = [];
                        const studentListBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('详情'),
                                type: 'text',
                                icon: 'data_detials'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'courseStudent',
                                        query: {
                                            customerId: this.listQuery.customerId,
                                            customerName: this.customerName,
                                            courseName: param.row.courseName,
                                            courseId: param.row.courseId,
                                            startTime: this.listQuery.startTime,
                                            endTime: this.listQuery.endTime
                                        }
                                    });
                                }
                            }
                        });
                        if (this.checkPermission('courseStudent')) {
                            optArr.push(studentListBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                headLoading: false,
                listLoading: false,
                customerList: [], // 企业列表
                total: 0,
                list: [],
                userId: '',
                listQuery: {
                    courseId: '',
                    customerId: '',
                    keywords: '',
                    pageNum: 1,
                    pageSize: 20,
                    startTime: '',
                    endTime: ''
                },
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
                },
                statisticsData: [],
                statisticsDataTitle: ['企业名称', '授权课程数', '学习总人数', '结算总课时'],
                customerName: ''
            };
        },
        watch: {
            listQuery: {
                handler(val) {
                    const enterpriseInfo = this.customerList.filter(item => item.customerId === val.customerId);
                    this.customerName = enterpriseInfo[0] ? enterpriseInfo[0].customerName : '';
                },
                deep: true
            }
        },
        beforeMount() {
            this.getLearnPeroids();
        },
        mounted() {
            this.getCustomerData();
        },
        methods: {
            checkPermission,
            getCustomerData() {
                this.userId = this.$store.getters.userId;
                const userId = this.userId;
                getEnterpriseSelectList({userId}).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.customerList = result.data || [];
                        this.listQuery.customerId = result.data ? result.data[0].customerId : '';
                        if (result.data) {
                            this.getDefaultData();
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getList(condition) {
                this.listLoading = true;
                this.listQuery.startTime = this.searchDateTime.length !== 0 ? this.searchDateTime[0] : '';
                this.listQuery.endTime = this.searchDateTime.length !== 0 ? this.searchDateTime[1] : '';
                const data = Object.assign({}, this.listQuery, condition);
                getCourseUsageDetialsList(data).then(re => {
                    const result = re.data || [];
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = result.data.pageNum;
                        this.listQuery.pageSize = result.data.pageSize;
                        this.listLoading = false;
                        this.getCouserUsageDetailsStatisticsData();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            search() {
                if (this.listQuery.customerId) {
                    this.getList({pageNum: 1});
                }
            },
            handleSizeChange(v) {
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
            },
            dateChange() {
                if (this.listQuery.customerId) {
                    this.getList({pageNum: 1});
                }
            },
            getDefaultData() {
                const routeData = this.$route.params;
                this.searchDateTime = [];
                if (JSON.stringify(routeData) !== '{}') {
                    this.listQuery.customerId = routeData.customerId;
                    this.listQuery.startTime = routeData.startTime;
                    this.listQuery.endTime = routeData.endTime;
                    this.listQuery.courseId = routeData.courseId;
                    this.searchDateTime.push(routeData.startTime, routeData.endTime);
                } else {
                    const currentTime = this.$moment().format('YYYY-MM-DD');
                    const monthTime = this.$moment().subtract(30, 'days').calendar(null, {sameElse: 'YYYY-MM-DD'});
                    this.listQuery.startTime = monthTime;
                    this.listQuery.endTime = currentTime;
                    this.searchDateTime.push(monthTime, currentTime);
                }
                this.getList();
            },
            getCouserUsageDetailsStatisticsData() {
                this.statisticsData = [];
                this.headLoading = true;
                const data = {
                    startTime: this.searchDateTime.length !== 0 ? this.searchDateTime[0] : '',
                    endTime: this.searchDateTime.length !== 0 ? this.searchDateTime[1] : '',
                    courseId: this.listQuery.courseId ? this.listQuery.courseId : '',
                    customerId: this.listQuery.customerId ? this.listQuery.customerId : '',
                    keywords: this.listQuery.keywords
                };
                getCouserUsageDetailsStatistics(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.statisticsData.push(this.customerList, result.data.courseNum, result.data.learnUserNum, result.data.settlementLearnHour);
                        this.headLoading = false;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            customerNameChange(val) {
                this.listQuery.customerId = val;
                this.getList({pageNum: 1});
            },
            getLearnPeroids() {
                const learnPeroids = this.tableColumns.filter(item => item.field === 'learnPeroids');
                learnPeroids[0].hidden = !this.checkPermission('actualLearningTime');
            }
        }
    };
</script>
