<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="exercise__container">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width paper-form">
            <el-form-item :label="$t('关键字') + '：'">
                <search-input
                    v-model="listQuery.exerciseKey"
                    :placeholder="$t('练习名称/编号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('创建人') + '：'">
                <search-input
                    v-model="listQuery.createUser"
                    :placeholder="$t('姓名/用户名/工号/手机号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('试题状态') + '：'">
                <el-checkbox-group v-model="listQuery.exerciseStatus" @change="handleCheckChange">
                    <el-checkbox
                        v-for="item in EXERCISE_TEST_STATUS_ENUM.arr"
                        :key="item.code"
                        :label="item.code"
                    >{{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <section v-if="checkPermission('addExercise')" class="opt__line veln__width">
            <el-button type="primary" @click="add()">{{ $t('新增') }}</el-button>
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
    </article>
</template>
<script>
    import {disable, enable, getList} from '@/api/exam/exam/exercise';
    import {EXERCISE_TEST_STATUS_ENUM} from '@/enum';
    import moment from 'moment';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'Exercise',
        data() {
            const tableColumns = [
                {
                    field: 'exerciseCode',
                    text: this.$t('练习编号'),
                    minWidth: 120
                },
                {
                    field: 'exerciseName',
                    text: this.$t('练习名称'),
                    minWidth: 160,
                    render: (h, param) => {
                        const name = param.row.exerciseName;
                        if (!name) {
                            return '--';
                        }
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'exerciseBasic',
                                            query: {
                                                id: param.row.id,
                                                readonly: true
                                            }
                                        });
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'itemCount',
                    text: this.$t('题量'),
                    minWidth: 80
                },
                {
                    field: 'createUser',
                    text: this.$t('创建人'),
                    minWidth: 80
                },
                {
                    field: 'endAt',
                    text: this.$t('截止时间'),
                    minWidth: 160,
                    render: (h, param) => {
                        const endAt = param.row.endAt;
                        const time = endAt
                            ? moment(endAt).format('YYYY-MM-DD HH:mm')
                            : this.$t('无限制');

                        return time;
                    }
                },
                {
                    field: 'type',
                    text: this.$t('类型'),
                    minWidth: 80,
                    render: (h, param) => {
                        const {type} = param.row;
                        return type === 'DAILY' ? '每日一练' : '普通练习';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.status
                            ? this.EXERCISE_TEST_STATUS_ENUM.getName(
                                param.row.status
                            )
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    minWidth: 100,
                    text: this.$t('操作'),
                    render: (h, param) => {
                        const optArr = [];
                        var startBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('启用'),
                                type: 'text',
                                icon: 'enable'
                            },
                            on: {
                                click: () => {
                                    this.start(param.row);
                                }
                            }
                        });
                        var editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.edit(param.row);
                                }
                            }
                        });
                        var disableBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('停用'),
                                type: 'text',
                                icon: 'disable'
                            },
                            on: {
                                click: () => {
                                    this.disable(param.row);
                                }
                            }
                        });

                        var analysisBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('分析'),
                                type: 'text',
                                icon: 'el-icon-data-analysis'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'exerciseAnalyze',
                                        query: {
                                            id: param.row.id
                                        }
                                    });
                                }
                            }
                        });
                        if (!this.checkPermission('enableExercise') && !this.checkPermission('addExercise')) {
                            startBtn = undefined;
                        }
                        if (!this.checkPermission('enableExercise')) {
                            disableBtn = undefined;
                        }
                        if (!this.checkPermission('updExercise')) {
                            editBtn = undefined;
                        }
                        if (!this.checkPermission('analyzeExercise')) {
                            analysisBtn = undefined;
                        }
                        if (param.row.status === 'FINISHED') {
                            optArr.push(analysisBtn);
                        }
                        if (param.row.status === 'ENABLED') {
                            optArr.push(editBtn);
                            optArr.push(disableBtn);
                            optArr.push(analysisBtn);
                        }
                        if (param.row.status === 'DISABLED') {
                            optArr.push(editBtn);
                            optArr.push(startBtn);
                            optArr.push(analysisBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                EXERCISE_TEST_STATUS_ENUM,
                listQuery: {
                    exerciseKey: '',
                    createUser: '',
                    startTime: '',
                    endTime: '',
                    exerciseStatus: ['ENABLED', 'DISABLED'],
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                testTime: [],
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                dialogVisible: false
            };
        },
        created() {
            this.getList();
        },
        methods: {
            checkPermission,
            handleClick(tab) {
                this.$router.push({name: tab.name});
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
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.startTime =
                    null !== this.testTime && this.testTime.length
                        ? this.testTime[0] + ':00'
                        : null;
                params.endTime =
                    null !== this.testTime && this.testTime.length
                        ? this.testTime[1] + ':00'
                        : null;
                this.listLoading = true;
                getList(params).then(re => {
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
            start(data) {
                const params = {id: data.id};
                enable(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            disable(data) {
                const params = {id: data.id};
                disable(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('停用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '停用失败'));
                    }
                });
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            add() {
                this.$router.push({
                    name: 'exerciseBasic'
                });
            },
            edit(data) {
                this.$router.push({
                    name: 'exerciseBasic',
                    query: {
                        id: data.id
                    }
                });
            }
        }
    };
</script>
