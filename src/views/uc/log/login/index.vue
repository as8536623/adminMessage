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
                    :placeholder="$t('请输入员工名称/编号')"
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
        name: 'LoginLog',
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
                    field: 'userId',
                    text: this.$t('编号'),
                    minWidth: 140
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 100
                },
                {
                    field: 'createdAt',
                    text: this.$t('登录时间'),
                    minWidth: 140,
                    align: 'center'
                },
                {
                    field: 'loginIp',
                    text: this.$t('登录ip'),
                    minWidth: 140,
                    align: 'center'
                }
                // {field: 'address', text: this.$t('登录地点'), minWidth: 110, align: 'center'}
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
