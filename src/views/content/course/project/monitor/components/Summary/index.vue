<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container">
        <section class="task-stage-container veln__width">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div
                        :class="{'active': stage === 'ALL'}"
                        class="swiper-slide task-stage-item"
                        @click="switchStage('ALL')"
                    >{{ $t('全部学员') }}（{{ totalCount }}）
                    </div>
                    <div
                        v-for="(item, index) in statisticMap"
                        :key="index"
                        :class="{'active': stage === index}"
                        class="swiper-slide task-stage-item"
                        @click="switchStage(index)"
                    >
                        {{ item.id !== 'FINISH'
                            ? '阶段' + transferNumberToChinese(item.stageOrder + 1)
                            : '完成'
                        }}（{{ item.stageUserCount }}）
                    </div>
                </div>
                <!-- 如果需要导航按钮 -->
                <div class="swiper-button-prev"/>
                <div class="swiper-button-next"/>
            </div>
        </section>
        <section class="opt__line veln__width">
            <el-button
                v-if="stage === 'ALL'"
                :disabled="excelInfo && excelInfo.status === 'RUNNING' && dis"
                @click="preExportExcel"
            >
                {{ $t('导出') }}
            </el-button>
            <el-button
                v-else-if="checkPermission('mpUserUpgradeManual')"
                :style="{ display: visibleUpgrade }"
                @click="batchUpgrade"
            >{{ $t('升级') }}
            </el-button>
            <span v-if="stageData" class="pl-5" style="margin-left: 10px">
                阶段{{ stageData.stageOrder + 1 }}：{{ stageData.name }}
                <span class="pl-5" style="margin-left: 20px">
                    {{ stageData.upgradeCondition }}
                </span>
            </span>
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
            @selection-change="selectionChange"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
    </article>
</template>

<script>
    import {getList, getStage, getStageList, getStatisticMap} from '@/api/course/project/monitor';
    import {transferNumberToChinese} from '@/utils/number';
    import {closeExport} from '@/api/exam/item/exportTask';
    import {mapGetters} from 'vuex';
    import {monitorSummary} from '@/api/course/project/export';
    import {upgradeManualBatch} from '@/api/course/project/stageUserRel';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'Summary',
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            const checkboxColumn = {
                type: 'checkbox',
                disabled: () => {
                    return !(
                        this.stage === 'ALL'
                    );
                }
            };
            const tableColumns = [
                {
                    field: 'code',
                    text: this.$t('工号'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.user.code;
                    }
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 100,
                    render: (h, param) => {
                        const name = param.row.user.name;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'projectUserInfo',
                                            query: {userId: param.row.id}
                                        });
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位'),
                    render: (h, param) => {
                        return param.row.user.positionName
                            ? param.row.user.positionName
                            : '--';
                    }
                },
                {
                    field: 'orgName',
                    text: this.$t('部门'),
                    minWidth: 140,
                    render: (h, param) => {
                        const row = param.row.user;
                        if (!row.orgNamePath) {
                            return row.orgName || '--';
                        }
                        return h(
                            'ElTooltip',
                            {
                                props: {
                                    effect: 'dark',
                                    placement: 'right',
                                    content: row.orgNamePath
                                }
                            },
                            [h('span', row.orgName || '--')]
                        );
                    }
                },
                {
                    field: 'stageName',
                    text: this.$t('学习阶段'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.stageName && param.row.stageOrder >= 0
                            ? `${param.row.stageOrder + 1}：${param.row.stageName}`
                            : '--';
                    }
                },
                /* {
                    field: 'signCnt',
                    text: this.$t('签到')
                },
                {
                    field: 'workCnt',
                    text: this.$t('作业')
                },
                {
                    field: 'activityCnt',
                    text: this.$t('活动')
                },
                {
                    field: 'examCnt',
                    text: this.$t('考试')
                }, */
                {
                    field: 'requireCourseScore',
                    minWidth: 120,
                    text: this.$t('必修课（学分）')
                },
                {
                    field: 'optionalCourseScore',
                    minWidth: 120,
                    text: this.$t('选修课（学分）')
                },
                {
                    field: 'stoneCnt',
                    text: this.$t('能量石')
                },
                {
                    field: 'percent',
                    minWidth: 120,
                    text: this.$t('项目进度') + '(%)',
                    render: (h, param) => {
                        return (param.row.percent
                            ? (param.row.percent * 100).toFixed(2)
                            : '0') + '%';
                    }
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    minWidth: 60,
                    text: this.$t('操作'),
                    render: (h, param) => {
                        // const optArr = [];
                        const viewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('详情'),
                                type: 'text',
                                icon: 'el-icon-view'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'stageDetail',
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
            const stageNameColumn = {
                field: 'stageName',
                text: this.$t('学习阶段'),
                minWidth: 160,
                render: (h, param) => {
                    return param.row.stageName && param.row.stageOrder >= 0
                        ? `${param.row.stageOrder + 1}：${param.row.stageName}`
                        : '--';
                }
            };
            return {
                stage: 'ALL',
                stageData: '',
                totalCount: 0,
                statisticMap: [],
                tableColumns,
                stageNameColumn,
                list: [],
                listQuery: {
                    proId: this.id,
                    keyword: '',
                    pageNum: 1,
                    pageSize: 20,
                    curStageId: ''
                },
                dis: false,
                total: 0,
                listLoading: false,
                excelInfo: null,
                excelMsg: '',
                excelMsgType: 'info',
                excelMsgId: '',
                selectedData: [],
                checkboxColumn,
                visibleUpgrade: ''
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            if (this.id) {
                this.getList();
                this.getStatisticMap();
            }
        },
        methods: {
            checkPermission,
            transferNumberToChinese,
            getStatisticMap() {
                getStatisticMap(this.id).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.totalCount = result.data.totalCount;
                        this.statisticMap = result.data && result.data.stage || [];
                        this.init();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            switchStage(item) {
                this.stage = item;
                if (item !== 'ALL') {
                    this.curStageId = this.statisticMap[item].id;
                } else {
                    this.curStageId = '';
                }
                if (this.curStageId === 'FINISH') {
                    this.visibleUpgrade = 'none';
                } else {
                    this.visibleUpgrade = '';
                }
                this.getStage(this.curStageId);
                this.getList({
                    pageNum: 1,
                    curStageId: this.curStageId
                });
            },
            getStage(params) {
                if (this.stage === 'ALL' || this.statisticMap[this.stage].id === 'FINISH') {
                    this.stageData = null;
                    return;
                }
                getStage(params).then(re => {
                    console.log(re);
                    const result = re.data;
                    if (result && result.success) {
                        const data = result.data;
                        this.stageData = data;
                        this.stageData.upgradeCondition = '';
                        const condition = {
                            upActivity: '活动',
                            upExam: '考试',
                            upOptionalCourse: '选修课学分',
                            upRequireCourse: '必修课学分',
                            upSign: '签到',
                            upStone: '能量石',
                            upWork: '作业'
                        };
                        const upgradeCondition = [];
                        Object.keys(condition).map(item => {
                            const score = data[item];
                            if (score) {
                                upgradeCondition.push(`${condition[item]} ≥ ${score}`);
                            }
                        });
                        if (upgradeCondition.length > 0) {
                            this.stageData.upgradeCondition = `升级条件：${upgradeCondition.join('，')}`;
                        }
                    }
                });
            },
            search() {
                this.getList({
                    pageNum: 1,
                    curStageId: this.curStageId
                });
            },
            async getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                let re;
                const stageNameIndex = this.tableColumns.findIndex(item => item.field === 'stageName');
                const percentColumn = this.tableColumns.find(item => item.field === 'percent');
                if (this.stage === 'ALL') {
                    if (stageNameIndex === -1) {
                        this.tableColumns.splice(4, 0, this.stageNameColumn);
                    }
                    const checkboxIndex = this.tableColumns.findIndex(item => item.type === 'checkbox');
                    if (checkboxIndex === 0) {
                        this.tableColumns.shift();
                    }
                    percentColumn.text = this.$t('项目进度') + '(%)';
                    re = await getList(params);
                } else {
                    if (stageNameIndex !== -1) {
                        this.tableColumns.splice(stageNameIndex, 1);
                    }
                    const checkboxIndex = this.tableColumns.findIndex(item => item.type === 'checkbox');
                    if (checkboxIndex < 0) {
                        this.tableColumns.unshift(this.checkboxColumn);
                    }
                    percentColumn.text = this.$t('阶段进度') + '(%)';
                    re = await getStageList(params);
                }
                const result = re.data;
                if (result && result.success) {
                    this.list = result.data.list || [];
                    if (this.list.length === 0) {
                        this.dis = 'disabled';
                    } else {
                        this.dis = false;
                    }
                    this.handleData(this.list);
                    this.total = result.data.total;
                    this.listLoading = false;
                    this.listQuery.pageNum = params.pageNum;
                    this.listQuery.pageSize = params.pageSize;
                } else {
                    this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                }
            },
            handleSizeChange(v) {
                this.getList({
                    pageSize: v,
                    pageNum: 1,
                    curStageId: this.curStageId
                });
            },
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v,
                    curStageId: this.curStageId
                });
            },
            handleData() {
                this.list = this.list.map(item => {
                    const userTaskStatistic = item.userTaskStatistic;
                    const maxTaskStatistic = item.maxTaskStatistic;
                    const task = {
                        signCnt: '--',
                        workCnt: '--',
                        activityCnt: '--',
                        examCnt: '--',
                        requireCourseScore: '--',
                        optionalCourseScore: '--',
                        stoneCnt: '--'
                    };
                    if (userTaskStatistic && maxTaskStatistic) {
                        Object.keys(task).map(item => {
                            const userTask = userTaskStatistic[item];
                            const maxTask = maxTaskStatistic[item];
                            if (maxTask === 0) {
                                task[item] = '--';
                            } else {
                                task[item] = `${userTask}/${maxTask}`;
                            }
                        });
                    }
                    item = Object.assign(item, task);
                    return item;
                });
            },
            init() {
                new window.Swiper('.swiper-container', {
                    // 轮播图的方向，也可以是vertical方向
                    direction: 'horizontal',
                    // 播放速度
                    loop: false,
                    // 自动播放时间
                    autoplay: 1000,
                    width: '188',
                    // 播放的速度
                    speed: 2000,
                    // 如果需要前进后退按钮
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    },
                    // 这样，即使我们滑动之后， 定时器也不会被清除
                    autoplayDisableOnInteraction: false,
                    // 如果需要滚动条
                    scrollbar: '.swiper-scrollbar',
                    observer: true, // 修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true // 修改swiper的父元素时，自动初始化swiper
                });
            },
            // 预加载excel
            preExportExcel() {
                this.excelMsgType = 'info';
                this.excelMsgId = '';
                this.excelMsg = this.$t('项目汇总列表excel正在生成中');
                this.excelInfo = {
                    status: 'RUNNING'
                };

                const params = Object.assign({}, this.listQuery, {pageNum: 1});
                monitorSummary(params).then(re => {
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
            }, selectionChange(v) {
                this.selectedData = v;
            }, batchUpgrade() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }

                this.$confirm(this.$t('确定批量升级?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].userId);
                    }
                    const param = {proId: this.id, userIds: selectedIds};
                    upgradeManualBatch(param).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('升级成功'));
                            this.refreshAllList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '升级失败'));
                        }
                    });
                });
            }, refreshAllList() {
                this.getStatisticMap();
                this.switchStage(this.stage);
            }
        }
    };
</script>
