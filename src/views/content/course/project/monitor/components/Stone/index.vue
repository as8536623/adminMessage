<style lang="scss" scoped>
    @import "../../style.scss";
</style>

<template>
    <article class="app-container project-monitor-container">
        <section class="opt__line veln__width stone-filter">
            <el-form ref="listQuery" :inline="true" :model="listQuery">
                <el-form-item :label="$t('能量石区间') + '：'">
                    <el-input v-model.trim="listQuery.stoneMinNum" type="number" min="0" max="100"/>
                    -
                    <el-input v-model.trim="listQuery.stoneMaxNum" type="number" min="0" max="100"/>
                </el-form-item>
                <el-button @click="search">{{ $t('筛选') }}</el-button>
            </el-form>
        </section>
        <section class="opt__line veln__width">
            <el-button
                :disabled="excelInfo && excelInfo.status === 'RUNNING' && dis"
                @click="preExportExcel"
            >
                {{ $t('导出') }}
            </el-button>
            <search-input
                v-model="listQuery.keyword"
                :placeholder="$t('请输入工号/姓名/用户名/手机')"
                class="pull-right"
                @enter="search"
            />
        </section>
        <el-alert
            v-if="excelMsg"
            :type="excelMsgType"
            class="item__excel__info"
            @close="excelMsgClose"
        >
            <div>
                {{ excelMsg }}
                <el-link
                    v-if="excelMsgId"
                    class="person__excel__link"
                    type="primary"
                    @click="exportHandle"
                >下载
                </el-link>
            </div>
        </el-alert>
        <qgu-table
            :columns="tableColumns"
            :data="list"
            :loading="listLoading"
            :page="listQuery"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            @sort-change="handleSortChange"
        />
    </article>
</template>

<script>
    import {getStoneList} from '@/api/course/project/monitor';
    import {commonTableColumns} from '../../data';
    import {closeExport} from '@/api/exam/item/exportTask';
    import {mapGetters} from 'vuex';
    import {monitorStone} from '@/api/course/project/export';

    export default {
        name: 'Stone',
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            const tableColumns = [
                {
                    field: 'stoneNum',
                    text: this.$t('能量石'),
                    sortable: 'custom'
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    width: 100,
                    text: this.$t('操作'),
                    render: (h, param) => {
                        const viewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('详情'),
                                type: 'text',
                                icon: 'el-icon-view'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'stoneDetail',
                                        query: {
                                            userId: param.row.userId,
                                            proId: param.row.proId
                                        }
                                    });
                                }
                            }
                        });
                        return h('div', [viewBtn], '');
                    }
                }
            ];
            return {
                tableColumns: commonTableColumns(this).concat(tableColumns),
                list: [],
                listQuery: {
                    proId: this.id,
                    stoneMinNum: null,
                    stoneMaxNum: null,
                    stoneAsc: null,
                    keyword: '',
                    pageNum: 1,
                    pageSize: 20
                },
                dis: false,
                total: 0,
                listLoading: false,
                excelInfo: null,
                excelMsg: '',
                excelMsgType: 'info',
                excelMsgId: ''
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            if (this.id) {
                this.getList();
            }
        },
        methods: {
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                if (this.listQuery.stoneMinNum >= this.listQuery.stoneMaxNum) {
                    params.stoneMinNum = this.listQuery.stoneMaxNum;
                    params.stoneMaxNum = this.listQuery.stoneMinNum;
                }
                this.listLoading = true;
                getStoneList(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        if (this.list.length === 0) {
                            this.dis = 'disabled';
                        } else {
                            this.dis = false;
                        }
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
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
            // 排序
            handleSortChange(column, prop, order) {
                console.log(column, prop, order);
                let stoneAsc = false;
                switch (column.order) {
                    case 'ascending':
                        stoneAsc = true;
                        break;
                    case 'descending':
                        stoneAsc = false;
                        break;
                    default:
                        stoneAsc = null;
                }
                this.listQuery.stoneAsc = stoneAsc;
                this.getList({
                    pageNum: 1
                });
            },
            // 预加载excel
            preExportExcel() {
                this.excelMsgType = 'info';
                this.excelMsgId = '';
                this.excelMsg = this.$t('项目监控能量石列表excel正在生成中');
                this.excelInfo = {
                    status: 'RUNNING'
                };

                const params = Object.assign({}, this.listQuery, {pageNum: 1});
                monitorStone(params).then(re => {
                    const result = re.data;
                    if (result.success && result.data) {
                        this.excelInfo = result.data;
                        if (result.data && result.data.status === 'FINISHED') {
                            this.excelMsgType = 'success';
                            this.excelMsg = this.$t(
                                `excel 生成日期为${result.data.finishTime}`
                            );
                            this.excelMsgId = result.data.id;
                        } else if (result.data && result.data.status === 'FAILED') {
                            this.excelMsgType = 'error';
                            this.excelMsg = this.$t(`excel 生成失败`);
                        }
                    }
                });
            },
            exportHandle() {
                const url = `${
                    process.env.BASE_API
                }/veln-mp/export/downloadExport/${this.excelInfo.id}?_token=${this.token}`;
                window.open(url);
            },
            // 关闭下载提示信息
            excelMsgClose() {
                closeExport(this.excelMsgId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.excelMsg = '';
                        this.$successMsg(this.$t('删除成功'));
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            }
        }
    };
</script>
