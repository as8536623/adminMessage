<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
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
    import {getCustomerUseList} from '@/api/customerUse';
    export default {
        name: 'CourseVideo',
        components: {},
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
                    text: this.$t('授权客户数'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'userNums',
                    text: this.$t('学员人数'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'learnUserNums',
                    text: this.$t('学习人数'),
                    minWidth: 40,
                    align: 'center'
                },
                {
                    field: 'sumLearnHour',
                    text: this.$t('结算课时数'),
                    minWidth: 40,
                    align: 'center'
                }
            ];
            return {
                tableColumns,
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
                courseDate: []
            };
        },
        mounted() {
            this.getDefaultDate();
            this.getList();
        },
        methods: {
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
                    this.searchDateTime.push(routeData.startTime, routeData.endTime);
                } else {
                    const currentTime = this.$moment().format('YYYY-MM-DD');
                    const monthTime = this.$moment().subtract(30, 'days').calendar(null, {sameElse: 'YYYY-MM-DD'});
                    this.searchDateTime.push(monthTime, currentTime);
                }
            }
        }
    };
</script>
