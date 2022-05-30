<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <data-statistics-commonHead
            v-loading="headLoading"
            :statistics-data="statisticsData"
            :statistics-data-title="statisticsDataTitle"
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
            <div class="courseSelect">
                <span>课程名称：</span>
                <el-select
                    v-model="courseName"
                    filterable
                    remote
                    clearable
                    placeholder="请输入课程名称"
                    :remote-method="remoteMethod"
                    :loading="courseLoading"
                    @change="courseChange"
                >
                    <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.name"
                        :value="course.id"
                    />
                </el-select>
            </div>
            <search-input
                v-model="listQuery.keywords"
                class="pull-right"
                width="320px"
                :placeholder="$t('请输入客户名称')"
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
    import {getCustomerUseList, getCustomerUseStatistics, getCourseList} from '@/api/customerUse';
    import DataStatisticsCommonHead from '@/components/dataStatisticsCommonHead';
    import checkPermission from '@/utils/permission';
    export default {
        name: 'CourseUse',
        components: {
            DataStatisticsCommonHead
        },
        data() {
            const tableColumns = [
                {
                    field: 'customerName',
                    text: this.$t('客户名称'),
                    minWidth: 100,
                    align: 'center'
                },
                {
                    field: 'courseNums',
                    text: this.$t('授权课程数'),
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
                    field: 'sumLearnHour',
                    text: this.$t('结算课时数'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'learnHour',
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
                        const courseDetialBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('详情'),
                                type: 'text',
                                icon: 'data_detials'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'courseUsageList',
                                        params: {
                                            courseId: this.listQuery.courseId,
                                            customerId: param.row.customerId,
                                            startTime: this.listQuery.startTime,
                                            endTime: this.listQuery.endTime
                                        }
                                    });
                                }
                            }
                        });
                        if (this.checkPermission('courseUsageDetails')) {
                            optArr.push(courseDetialBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                courseLoading: false,
                headLoading: false,
                listLoading: false,
                total: 0,
                list: [],
                listQuery: {
                    courseId: '',
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
                courseDate: [],
                statisticsData: [],
                statisticsDataTitle: ['总客户数', '实际学习总人数', '实际学习总课时', '结算总课时'],
                courseOptions: [],
                courseList: [],
                courseName: ''
            };
        },
        beforeMount() {
            this.getActualLearningTime();
        },
        mounted() {
            this.getDefaultDate();
            this.getList();
            this.getCourseListData();
        },
        methods: {
            checkPermission,
            getList(condition) {
                this.listLoading = true;
                this.listQuery.startTime = this.searchDateTime.length !== 0 ? this.searchDateTime[0] : '';
                this.listQuery.endTime = this.searchDateTime.length !== 0 ? this.searchDateTime[1] : '';
                const data = Object.assign({}, this.listQuery, condition);
                getCustomerUseList(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = result.data.pageNum;
                        this.listQuery.pageSize = result.data.pageSize;
                        this.listLoading = false;
                        this.getCustomerUseStatisticsData();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            search() {
                this.getList({pageNum: 1});
            },
            handleSizeChange(v) {
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
            },
            handleCheckChange(value) {
                this.customerId = value;
            },
            dateChange() {
                this.getList();
            },
            getDefaultDate() {
                const routeData = this.$route.query;
                if (JSON.stringify(routeData) !== '{}') {
                    this.listQuery.courseId = routeData.courseId;
                    this.listQuery.startTime = routeData.startTime;
                    this.listQuery.endTime = routeData.endTime;
                    this.courseName = routeData.courseName;
                    this.searchDateTime.push(routeData.startTime, routeData.endTime);
                } else {
                    const currentTime = this.$moment().format('YYYY-MM-DD');
                    const monthTime = this.$moment().subtract(30, 'days').calendar(null, {sameElse: 'YYYY-MM-DD'});
                    this.searchDateTime.push(monthTime, currentTime);
                }
            },
            getCustomerUseStatisticsData() {
                this.statisticsData = [];
                this.headLoading = true;
                const data = {
                    startTime: this.searchDateTime.length !== 0 ? this.searchDateTime[0] : '',
                    endTime: this.searchDateTime.length !== 0 ? this.searchDateTime[1] : '',
                    courseId: this.listQuery.courseId ? this.listQuery.courseId : '',
                    keywords: this.listQuery.keywords
                };
                getCustomerUseStatistics(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.statisticsData.push(result.data.customerNum, result.data.learnUserNum, result.data.realLearnHour, result.data.settlementLearnHour);
                        if (!this.checkPermission('actualLearningTime')) {
                            this.statisticsDataTitle.splice(2, 1);
                            this.statisticsData.splice(2, 1);
                        }
                        this.headLoading = false;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getActualLearningTime() {
                const learnDuration = this.tableColumns.filter(item => item.field === 'learnHour');
                learnDuration[0].hidden = !this.checkPermission('actualLearningTime');
            },
            getCourseListData() {
                getCourseList().then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.courseList = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            courseChange() {
                this.listQuery.courseId = this.courseName;
                this.getList({pageNum: 1});
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.courseLoading = true;
                    setTimeout(() => {
                        this.courseLoading = false;
                        this.courseOptions = this.courseList.filter(item => {
                            return item.name.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.options = [];
                }
            }
        }
    };
</script>
