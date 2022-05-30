<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
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
    </article>
</template>

<script>
    import { pageJoinCourseRel} from '@/api/course';
    import {COMMON_STATUS_ENUM} from '@/enum';

    export default {
        name: 'NewsList',
        components: {
        },
        data() {
            const tableColumns = [
                {
                    field: 'course.code',
                    text: this.$t('编号'),
                    minWidth: 140,
                    render: (h, param) => {
                        const code = param.row.course.code;
                        return code || '--';
                    }
                },
                {
                    field: 'course.name',
                    text: this.$t('名称'),
                    minWidth: 140,
                    render: (h, param) => {
                        const name = param.row.course.name;
                        return name || '--';
                    }
                },
                {
                    field: 'course.teacherName',
                    text: this.$t('讲师'),
                    width: 130,
                    render: (h, param) => {
                        const teacherName = param.row.course.teacherName;
                        return teacherName || '--';
                    }
                },
                {
                    field: 'course.createName',
                    text: this.$t('创建人'),
                    width: 130,
                    render: (h, param) => {
                        const createName = param.row.course.createName;
                        return createName || '--';
                    }
                },
                {
                    field: 'course.period',
                    text: this.$t('课时'),
                    width: 60,
                    align: 'center',
                    render: (h, param) => {
                        const period = param.row.course.period;
                        return period || '--';
                    }
                }
            ];
            return {
                COMMON_STATUS_ENUM,
                tableColumns,
                total: 0,
                list: [],
                listLoading: false,
                time: [],
                listQuery: {
                    joinId: this.$route.query.id,
                    keywords: '',
                    pageNum: 1,
                    pageSize: 20
                },
                courseIds: [],
                multiSelection: [],
                authIds: [],
                isCourseEdit: true,
                currentCode: null, // 下载文档的编号
                isSqkcsl: true
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                pageJoinCourseRel(params).then(re => {
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
                this.multiSelection = v;
            },
            search() {
                this.getList({joinId: this.$route.query.id,pageNum: 1});
            },
            handleSizeChange(v) {
                this.getList({joinId: this.$route.query.id,pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({joinId: this.$route.query.id,pageNum: v});
            }
        }
    };
</script>
