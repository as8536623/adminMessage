<style lang="scss" scoped>
    @import './style';
</style>

<template>
    <article class="app-container container__padding">
        <div>
            <section class="person__filter veln__width">
                <el-form
                    :model="listQuery"
                    :inline="true"
                    label-width="120px"
                    class="demo-form-inline"
                >
                    <el-form-item :label="$t('客户名称') + '：'">
                        <el-input
                            v-model="listQuery.customerName"
                            :placeholder="$t('客户名称')"
                            maxlength="20"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item :label="$t('')">
                        <el-button type="primary" @click="search">{{ $t('查询') }}</el-button>
                    </el-form-item>
                </el-form>
            </section>
            <qgu-table
                :columns="tableColumns"
                :data="list"
                :page="listQuery"
                :total="total"
                :loading="listLoading"
                @selection-change="selectionChange"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </article>
</template>

<script>
    import moment from 'moment';
    import {getCourseStatistics} from '@/api/customer/course';
    import {mapActions} from 'vuex';

    export default {
        name: 'CourseStatistics',
        components: {
        },
        data() {
            const tableColumns = [
                {
                    field: 'courseId',
                    text: this.$t('课程ID'),
                    minWidth: 140
                },
                {
                    field: 'courseCode',
                    text: this.$t('课程编号'),
                    minWidth: 140
                },
                {
                    field: 'courseName',
                    text: this.$t('课程名称'),
                    minWidth: 140
                },
                {
                    field: 'customerName',
                    text: this.$t('客户名称'),
                    minWidth: 140
                },
                {
                    field: 'courseCount',
                    text: this.$t('授权账号数'),
                    minWidth: 140
                },
                {
                    field: 'endAt',
                    text: this.$t('授权结束时间'),
                    align: 'center',
                    minWidth: 120,
                    render: (h, param) => {
                        const endAt = param.row.endAt;
                        return endAt
                            ? moment(param.row.endAt).format('YYYY-MM-DD HH:mm:ss')
                            : '--';
                    }
                }
            ];
            return {
                tableColumns,
                funId: '',
                list: [],
                total: 0,
                listQuery: {
                    courseId: '',
                    customerName: '',
                    pageNum: 1,
                    pageSize: 10
                },
                listLoading: false
            };
        },
        created() {
            this.init();
            this.getList();
        },
        methods: {
            ...mapActions(['setCacheView', 'clearCacheView']),
            init() {
                this.listQuery.courseId = this.$route.query.id;
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                getCourseStatistics(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            selectionChange(v) {
                this.selectedData = v;
            },
            handleSizeChange(v) {
                this.getList({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v
                });
            },
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            }

        }
    };
</script>
