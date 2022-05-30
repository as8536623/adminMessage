<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="score__user container__padding">
        <section class="veln__query__line">
            <el-form :model="listQuery" :inline="true" class="demo-form-inline unrequired__form">
                <section class="link__form__item">
                    <span class="link__form__item__label">{{ $t('积分区间') }}：</span>
                    <el-input v-model="listQuery.minTotalScore" clearable/>
                    <span class="link__form__item__split">—</span>
                    <el-input v-model="listQuery.maxTotalScore" clearable/>
                </section>
                <el-button type="primary" @click="search">{{ $t('筛选') }}</el-button>
                <search-input
                    v-model="listQuery.name"
                    class="pull-right"
                    :placeholder="$t('请输入工号/姓名/用户名/手机')"
                    @enter="search"
                />
            </el-form>
        </section>
        <section class="opt__line">
            <el-button type="primary" @click="batchChangeScore('ADD')">{{ $t('增加积分') }}</el-button>
            <el-button @click="batchChangeScore('MINUS')">{{ $t('减少积分') }}</el-button>
            <el-button @click="batchClearScore">{{ $t('清零') }}</el-button>
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
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="editQuery.type === 'ADD' ? $t('增加积分') : $t('减少积分')"
            :visible.sync="dialogVisible"
            width="430px"
            @close="handleClose"
        >
            <el-form
                v-if="dialogVisible"
                ref="editQuery"
                :model="editQuery"
                :rules="rules"
                label-width="100px"
            >
                <section class="dialog__form__container">
                    <el-form-item
                        :label="$t('积分')"
                        prop="score"
                        :rules="[rules.required, rules.integer]"
                    >
                        <el-input
                            v-model="editQuery.score"
                            maxlength="10"
                            :placeholder="$t('等级最大积分')"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="changeScore">{{ $t('确定') }}</el-button>
                        <el-button @click="dialogVisible=false;">{{ $t('取消') }}</el-button>
                    </el-form-item>
                </section>
            </el-form>
        </el-dialog>
    </article>
</template>

<script>
    import {
        getScoreList,
        batchChangeScore,
        batchClearScore
    } from '@/api/score/admin';
    import {validateInteger} from '@/utils/validate';
    export default {
        name: 'ScoreUser',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'user.code',
                    text: this.$t('工号'),
                    width: 110
                },
                {
                    field: 'user.name',
                    text: this.$t('姓名'),
                    render: (h, param) => {
                        const name = param.row.user ? param.row.user.name : '';
                        if (!name) {
                            return '--';
                        }
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'text--blue__btn'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'userinfo',
                                            query: {
                                                id: param.row.user.id
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
                    field: 'user.loginName',
                    text: this.$t('用户名'),
                    width: 110
                },
                {
                    field: 'user.mobile',
                    text: this.$t('手机号码'),
                    width: 110
                },
                {
                    field: 'user.positionName',
                    text: this.$t('岗位')
                },
                {
                    field: 'user.orgName',
                    text: this.$t('部门'),
                    width: 110
                },
                {
                    field: 'totalScore',
                    text: this.$t('总积分')
                },
                {
                    field: 'level.name',
                    text: this.$t('等级')
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    width: 130,
                    render: (h, param) => {
                        const optArr = [];
                        const row = param.row;
                        const viewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('查看'),
                                type: 'text',
                                icon: 'el-icon-view'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'scoreDetail',
                                        query: {
                                            id: row.userId
                                        }
                                    });
                                }
                            }
                        });
                        const addBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('增加积分'),
                                type: 'text',
                                icon: 'el-icon-circle-plus-outline'
                            },
                            on: {
                                click: () => {
                                    this.editQuery.type = 'ADD';
                                    this.editQuery.userIds = [row.userId];
                                    this.dialogVisible = true;
                                }
                            }
                        });
                        const minusBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('减少积分'),
                                type: 'text',
                                icon: 'el-icon-remove-outline'
                            },
                            on: {
                                click: () => {
                                    this.editQuery.type = 'MINUS';
                                    this.editQuery.userIds = [row.userId];
                                    this.dialogVisible = true;
                                }
                            }
                        });
                        const cleanBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('清零'),
                                type: 'text',
                                icon: 'clean'
                            },
                            on: {
                                click: () => {
                                    this.editQuery.userIds = [row.userId];
                                    this.clearScore();
                                }
                            }
                        });
                        optArr.push(viewBtn);
                        optArr.push(addBtn);
                        optArr.push(minusBtn);
                        optArr.push(cleanBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                listQuery: {
                    name: '',
                    minTotalScore: '',
                    maxTotalScore: '',
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                total: 0,
                list: [],
                multiSelection: [],
                dialogVisible: false,
                editQuery: {
                    userIds: [],
                    optType: 'ADD',
                    type: '',
                    score: ''
                },
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
                        trigger: 'blur'
                    },
                    integer: {
                        validator: validateInteger,
                        trigger: 'blur'
                    }
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
                getScoreList(params).then(re => {
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
                this.getList({pageNum: 1});
            },
            handleSizeChange(v) {
                this.getList({
                    pageNum: 1,
                    pageSize: v
                });
            },
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v
                });
            },
            batchChangePre() {
                if (!this.multiSelection.length) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return false;
                }

                const userIds = [];
                this.multiSelection.map(item => {
                    userIds.push(item.userId);
                });

                this.editQuery.userIds = userIds;
                return true;
            },
            batchChangeScore(type) {
                if (!this.batchChangePre()) {
                    return;
                }
                this.editQuery.type = type;
                this.dialogVisible = true;
            },
            // 修改分数
            changeScore() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    batchChangeScore(this.editQuery).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.dialogVisible = false;
                            this.getList({pageNum: 1});
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            },
            batchClearScore() {
                if (!this.batchChangePre()) {
                    return;
                }
                this.clearScore();
            },
            clearScore() {
                this.$confirm(this.$t('确定清空积分么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    batchClearScore(this.editQuery.userIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.getList({pageNum: 1});
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            },
            handleClose() {
                this.editQuery = {
                    userIds: [],
                    optType: 'ADD',
                    type: '',
                    score: ''
                };
            }
        }
    };
</script>
