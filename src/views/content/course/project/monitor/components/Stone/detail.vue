<style lang="scss">
    @import "style.scss";
</style>
<template>
    <article class="app-container stone-detail-container">
        <el-form :inline="true" :model="listQuery" class="veln__width">
            <el-form-item :label="$t('事项') + '：'">
                <el-checkbox-group v-model="listQuery.taskRelTypeList" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in STONE_SOURCE_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >
                        {{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('类型') + '：'">
                <el-checkbox-group v-model="listQuery.modifyTypeList" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in STONE_MODIFY_TYPE_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >
                        {{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('变动时间') + '：'" class="pull-right">
                <el-date-picker
                    v-model="time"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    @change="handleCheckChange"
                />
            </el-form-item>
        </el-form>
        <section class="opt__line veln__width">
            <el-button
                :disabled="excelInfo && excelInfo.status === 'RUNNING' && dis"
                @click="preExportExcel"
            >
                {{ $t('导出') }}
            </el-button>
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
            @selection-change="selectionChange"
            @size-change="handleSizeChange"
            @sort-change="handleSortChange"
        />
    </article>
</template>
<script>
    import {STONE_MODIFY_TYPE_ENUM, STONE_SOURCE_ENUM, STONE_WAY_ENUM} from '@/enum';
    import {userStoneDetail} from '@/api/course/project/energyStoneLog';
    import moment from 'moment';
    import {mapGetters} from 'vuex';
    import {energyStoneInfo} from '@/api/course/project/export';
    import {closeExport} from '@/api/exam/item/exportTask';

    export default {
        name: 'StoneDetail',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'taskRelType',
                    text: this.$t('事项'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.taskRelType ? this.STONE_SOURCE_ENUM.getName(param.row.taskRelType) : '--';
                    }
                },
                {
                    field: 'taskName',
                    text: this.$t('事项名称'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.taskName ? param.row.taskName : '--';
                    }
                },
                {
                    field: 'modifyType',
                    text: this.$t('类型'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.modifyType ? this.STONE_MODIFY_TYPE_ENUM.getName(param.row.modifyType) : '--';
                    }
                },
                {
                    field: 'modifyCount',
                    text: this.$t('能量石'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.modifyCount ? param.row.modifyCount : '0';
                    }
                },
                {
                    field: 'modifyMethod',
                    text: this.$t('方式'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.modifyMethod ? this.STONE_WAY_ENUM.getName(param.row.modifyMethod) : '--';
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
                STONE_SOURCE_ENUM,
                STONE_MODIFY_TYPE_ENUM,
                STONE_WAY_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    proId: this.$route.query.proId,
                    userId: this.$route.query.userId,
                    startAt: '',
                    endAt: '',
                    modifyTypeList: [],
                    taskRelTypeList: ['ONLINE_COURSE'],
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                dis: false,
                time: [],
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
                params.taskRelTypeList = params.taskRelTypeList.length
                    ? params.taskRelTypeList.join(',')
                    : null;
                params.modifyTypeList = params.modifyTypeList.length
                    ? params.modifyTypeList.join(',')
                    : null;
                params.startAt =
                    null !== this.time && this.time.length
                        ? moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                params.endAt =
                    null !== this.time && this.time.length
                        ? moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                this.listLoading = true;
                userStoneDetail(params).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        if (this.list.length === 0) {
                            this.dis = 'disabled';
                        } else {
                            this.dis = false;
                        }
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            // 预加载excel
            preExportExcel() {
                this.excelMsgType = 'info';
                this.excelMsgId = '';
                this.excelMsg = this.$t('能量石明细详情excel正在生成中');
                this.excelInfo = {
                    status: 'RUNNING'
                };

                const params = Object.assign({}, this.listQuery, {pageNum: 1});
                params.taskRelTypeList = params.taskRelTypeList.length
                    ? params.taskRelTypeList.join(',')
                    : null;
                params.modifyTypeList = params.modifyTypeList.length
                    ? params.modifyTypeList.join(',')
                    : null;
                params.startAt =
                    null !== this.time && this.time.length
                        ? moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                params.endAt =
                    null !== this.time && this.time.length
                        ? moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                energyStoneInfo(params).then(re => {
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
