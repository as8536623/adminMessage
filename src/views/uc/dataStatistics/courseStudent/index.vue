<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <data-statistics-commonHead
            v-loading="headLoading"
            :statistics-data="statisticsData"
            :statistics-data-title="statisticsDataTitle"
        />
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
    import {getCourseStudentList, getCouseStudentStatistics} from '@/api/courseUsageDetials';
    import DataStatisticsCommonHead from '@/components/dataStatisticsCommonHead';
    import checkPermission from '@/utils/permission';
    export default {
        name: 'CourseStudent',
        components: {
            DataStatisticsCommonHead
        },
        data() {
            const tableColumns = [
                {
                    field: 'userId',
                    text: this.$t('用户ID'),
                    minWidth: 80,
                    align: 'center'
                },
                {
                    field: 'firstTime',
                    text: this.$t('首次学习时间'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'learnTimes',
                    text: this.$t('学习次数'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'sumPeroid',
                    text: this.$t('结算课时'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'learnDuration',
                    text: this.$t('实际学习课时'),
                    minWidth: 40,
                    align: 'center',
                    hidden: false
                }
            ];
            return {
                tableColumns,
                headLoading: false,
                listLoading: false,
                total: 0,
                list: [],
                listQuery: {
                    courseId: '',
                    customerId: '',
                    keywords: '',
                    pageNum: 1,
                    pageSize: 20,
                    startTime: '',
                    endTime: ''
                },
                courseDate: [],
                statisticsData: [],
                statisticsDataTitle: ['企业名称', '课程名称', '查询时间', '学习总人数', '结算总课时'],
                customerName: '',
                courseName: ''
            };
        },
        beforeMount() {
            this.getActualLearningTime();
        },
        mounted() {
            this.getDefaultDate();
        },
        methods: {
            checkPermission,
            getList(condition) {
                this.listLoading = true;
                const data = Object.assign({}, this.listQuery, condition);
                getCourseStudentList(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = result.data.pageNum;
                        this.listQuery.pageSize = result.data.pageSize;
                        this.listLoading = false;
                        this.getCouseStudentStatisticsData();
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
                this.listQuery.customerId = routeData.customerId;
                this.listQuery.courseId = routeData.courseId;
                this.listQuery.startTime = routeData.startTime;
                this.listQuery.endTime = routeData.endTime;
                this.customerName = routeData.customerName;
                this.courseName = routeData.courseName;
                this.getList();
            },
            getCouseStudentStatisticsData() {
                this.statisticsData = [];
                this.headLoading = true;
                const data = {
                    startTime: this.listQuery.startTime,
                    endTime: this.listQuery.endTime,
                    courseId: this.listQuery.courseId,
                    customerId: this.listQuery.customerId
                };
                getCouseStudentStatistics(data).then(re => {
                    const result = re.data;
                    const qeryTime = String(this.listQuery.startTime + ' ~ ' + this.listQuery.endTime);
                    if (result && result.success) {
                        this.statisticsData.push(this.customerName, this.courseName, qeryTime, result.data.learnUserNum, result.data.settlementLearnHour);
                        this.headLoading = false;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getActualLearningTime() {
                const learnDuration = this.tableColumns.filter(item => item.field === 'learnDuration');
                learnDuration[0].hidden = !this.checkPermission('actualLearningTime');
            }
        }
    };
</script>
