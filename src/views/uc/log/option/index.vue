<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <section class="opt__line">
            <el-form :model="listQuery" :inline="true" class="demo-form-inline unrequired__form">
                <el-form-item label="时间范围：" class="veln__address__province">
                    <el-select
                        v-model="listQuery.range"
                        :placeholder="$t('请选择时间范围')"
                        @change="search"
                    >
                        <el-option
                            v-for="(item, index) in DATE_RANGE_ENUM.getAllValues()"
                            :key="index"
                            :value="item.code"
                            :label="item.name"
                        />
                    </el-select>
                </el-form-item>
                <search-input
                    v-model="listQuery.keywords"
                    class="pull-right"
                    :placeholder="$t('请输入员工名称/编码')"
                    @enter="search"
                />
            </el-form>
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
    import {getLoginLog} from '@/api/log/login';
    import {DATE_RANGE_ENUM} from '@/enum';

    export default {
        name: 'OptionLog',
        data() {
            const tableColumns = [
                {
                    field: 'index',
                    text: this.$t('序号'),
                    width: 50,
                    align: 'center',
                    render: (h, param) => {
                        const {index} = param;
                        return index + 1;
                    }
                },
                {
                    field: 'code',
                    text: this.$t('编号'),
                    minWidth: 140
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 140
                },
                {
                    field: 'createdAt',
                    text: this.$t('操作时间'),
                    minWidth: 140,
                    align: 'center'
                },
                {
                    field: 'module',
                    text: this.$t('操作模块'),
                    minWidth: 80,
                    align: 'center'
                },
                {
                    field: 'type',
                    text: this.$t('操作类型'),
                    minWidth: 120,
                    align: 'center'
                },
                {
                    field: 'detail',
                    text: this.$t('操作详情'),
                    minWidth: 200
                }
            ];
            return {
                DATE_RANGE_ENUM,
                tableColumns,
                total: 0,
                list: [],
                listLoading: false,
                listQuery: {
                    keywords: '',
                    range: 'ALL',
                    pageNum: 1,
                    pageSize: 20
                }
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                getLoginLog(params).then(re => {
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
            search() {
                this.getList({pageNum: 1});
            },
            handleSizeChange(v) {
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
            }
        }
    };
</script>
