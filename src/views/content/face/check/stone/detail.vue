<style lang="scss" src="../style.scss">
</style>
<template>
    <article class="app-container stone-detail-container">
        <el-form :model="listQuery" :inline="true" class="veln__width">
            <el-form-item :label="$t('事项') + '：'">
                <el-checkbox-group v-model="listQuery.sourceList" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in SOURCE_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >
                        {{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('类型') + '：'">
                <el-checkbox-group v-model="listQuery.typeList" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in STONE_TYPE_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >
                        {{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('方式') + '：'">
                <el-checkbox-group v-model="listQuery.wayList" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in STONE_WAY_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >
                        {{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item class="pull-right" :label="$t('变动时间') + '：'">
                <el-date-picker
                    v-model="time"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleCheckChange"
                />
            </el-form-item>
        </el-form>
        <section class="opt__line veln__width">
            <el-button @click="exportHandle">{{ $t('导出') }}</el-button>
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
            @sort-change="handleSortChange"
        />
    </article>
</template>
<script>
    import {
        SOURCE_ENUM,
        STONE_TYPE_ENUM,
        STONE_WAY_ENUM
    } from '@/enum';
    import {
        getDetailList
    } from '@/api/face/stone';
    import moment from 'moment';
    export default {
        name: 'StoneDetail',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'code',
                    text: this.$t('事项'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.source ? this.SOURCE_ENUM.getName(param.row.source) : this.STONE_WAY_ENUM.getName(param.row.way) + '：' + param.row.optType;
                    }
                },
                {
                    field: 'name',
                    text: this.$t('事项名称'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.sourceName ? param.row.sourceName : '--';
                    }
                },
                {
                    field: 'type',
                    text: this.$t('类型'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.type ? this.STONE_TYPE_ENUM.getName(param.row.type) : '--';
                    }
                },
                {
                    field: 'num',
                    text: this.$t('能量石'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.num ? param.row.num : '0';
                    }
                },
                {
                    field: 'way',
                    text: this.$t('方式'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.way ? this.STONE_WAY_ENUM.getName(param.row.way) : '--';
                    }
                },
                {
                    field: '变动时间',
                    text: this.$t('变动时间'),
                    minWidth: 160,
                    render: (h, param) => {
                        const updatedAt = param.row.updatedAt;
                        return updatedAt
                            ? moment(updatedAt).format(
                                'YYYY-MM-DD HH:mm'
                            ) : '--';
                    }
                }
            ];
            return {
                SOURCE_ENUM,
                STONE_TYPE_ENUM,
                STONE_WAY_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    relId: this.$route.query.relId,
                    userId: this.$route.query.userId,
                    startTime: '',
                    endTime: '',
                    wayList: ['AUTO', 'MANUAL'],
                    typeList: ['ADD', 'REDUCE'],
                    sourceList: ['ENROLL', 'SIGN', 'WORK'],
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                time: []
            };
        },
        created() {
            this.getList();
        },
        methods: {
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
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            // 排序
            handleSortChange(column, prop, order) {
                if (this.listQuery.sort === 'desc') {
                    this.listQuery.sort = 'asc';
                } else {
                    this.listQuery.sort = 'desc';
                }
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.startTime =
                    null !== this.time && this.time.length
                        ? moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                params.endTime =
                    null !== this.time && this.time.length
                        ? moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                this.listLoading = true;
                getDetailList(params).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            exportHandle() {

            }
        }
    };
</script>
