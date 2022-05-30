<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="score__rule container__padding">
        <qgu-table
            :key="renderKey"
            class="score__rule__table"
            :loading="false"
            :columns="tableColumns"
            :data="list"
            :have-pagination="false"
            :span-method="spanMethod"
        />
    </article>
</template>

<script>
    import {editRule, getAllRule} from '@/api/score/rule';
    import {deepClone} from '@/utils';
    import {validateIntegerO} from '@/utils/validate';

    export default {
        name: 'ScoreRule',
        data() {
            const tableColumns = [
                {
                    field: 'moduleName',
                    text: this.$t('动作分类')
                },
                {
                    field: 'funName',
                    text: this.$t('动作名称')
                },
                {
                    field: 'cycle',
                    text: this.$t('周期'),
                    minWidth: 200,
                    render: (h, param) => {
                        const index = param.index;
                        const radioArr = [];
                        const once = h(
                            'ElRadio',
                            {
                                attrs: {
                                    label: 'ONCE',
                                    value: this.list[index].cycle
                                },
                                on: {
                                    change: () => {
                                        this.cycleTypeChange(index, 'ONCE');
                                    }
                                }
                            },
                            this.$t('一次性')
                        );
                        const week = h(
                            'ElRadio',
                            {
                                attrs: {
                                    label: 'D',
                                    value: this.list[index].cycle
                                },
                                on: {
                                    change: () => {
                                        this.cycleTypeChange(index, 'D');
                                    }
                                }
                            },
                            this.$t('每天')
                        );
                        const unlimit = h(
                            'ElRadio',
                            {
                                attrs: {
                                    label: 'NOT_LIMIT',
                                    value: this.list[index].cycle
                                },
                                on: {
                                    change: () => {
                                        this.cycleTypeChange(index, 'NOT_LIMIT');
                                    }
                                }
                            },
                            this.$t('没有限制')
                        );

                        radioArr.push(once);
                        radioArr.push(week);
                        radioArr.push(unlimit);
                        return h('div', radioArr, '');
                    }
                },
                {
                    field: 'limitTime',
                    text: this.$t('周期内最多奖励次数'),
                    width: 150,
                    render: (h, param) => {
                        const row = param.row;
                        const index = param.index;
                        const rowArr = [];
                        const npt = h('ElInput', {
                            attrs: {
                                disabled: row.ruleType !== 'CYCLE',
                                value: this.list[index].limitTime
                            },
                            on: {
                                input: v => {
                                    this.list[index].limitTime = Number(v);
                                },
                                change: v => {
                                    this.limitTimeChange(index, Number(v));
                                }
                            }
                        });
                        rowArr.push(npt);
                        return h('div', rowArr, '');
                    }
                },
                {
                    field: 'score',
                    text: this.$t('单次奖励分值'),
                    width: 105,
                    render: (h, param) => {
                        const index = param.index;
                        const rowArr = [];
                        const npt = h('ElInput', {
                            attrs: {
                                value: this.list[index].score
                            },
                            on: {
                                input: v => {
                                    this.list[index].score = Number(v);
                                },
                                change: v => {
                                    this.scoreChange(index, Number(v));
                                }
                            }
                        });
                        rowArr.push(npt);
                        return h('div', rowArr, '');
                    }
                },
                {
                    field: 'status',
                    text: this.$t('操作'),
                    render: (h, param) => {
                        const index = param.index;
                        const rowArr = [];
                        const npt = h('ElSwitch', {
                            attrs: {
                                activeColor: '#25B864',
                                value: this.list[index].status
                            },
                            on: {
                                input: v => {
                                    this.list[index].status = v;
                                },
                                change: v => {
                                    this.statusChange(index, v);
                                }
                            }
                        });
                        rowArr.push(npt);
                        return h('div', rowArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                list: [],
                listCopy: [],
                renderKey: null
            };
        },
        mounted() {
            this.getAllRule();
        },
        methods: {
            // 获取全部规则
            getAllRule() {
                getAllRule().then(re => {
                    const result = re.data;
                    if (result.success) {
                        const list = this.sortList(result.data || []);
                        this.formatList(list);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取积分等级失败'));
                    }
                });
            },
            sortList(list) {
                list.sort((prev, next) => {
                    return prev.moduleCode - next.moduleCode;
                });
                return list;
            },
            // 格式化数据，用于合并行
            formatList(list) {
                let idx = 0;
                let num = 0;
                let type = '';
                list.map((item, index) => {
                    if (item.ruleType === 'CYCLE') {
                        item.cycle = item.cycleType;
                    } else {
                        item.cycle = item.ruleType;
                    }
                    if (!index) {
                        idx = index;
                        num++;
                        type = item.moduleCode;
                        return;
                    }

                    if (item.moduleCode === type) {
                        num++;
                    } else {
                        list[idx].rowIndex = num;
                        idx = index;
                        num = 1;
                        type = item.moduleCode;
                    }

                    if (index === list.length - 1) {
                        list[idx].rowIndex = num;
                    }
                });
                this.list = list;
                this.cloneList();
            },
            cloneList() {
                this.listCopy = deepClone(this.list);
            },
            // 合并行
            spanMethod({row, column, rowIndex, columnIndex}) {
                if (!columnIndex) {
                    if (row.rowIndex) {
                        return {
                            rowspan: row.rowIndex,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            editRule(rule) {
                editRule(rule).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('修改成功'));
                    } else {
                        this.$errorMsg(this.$t('修改失败'));
                        this.list = deepClone(this.cloneList);
                    }
                });
            },
            // 修改某一列周期
            cycleTypeChange(index, v) {
                if (v === 'D') {
                    this.list[index].ruleType = 'CYCLE';
                    this.list[index].cycleType = 'D';
                    this.list[index].cycle = 'D';
                } else {
                    this.list[index].ruleType = v;
                    this.list[index].cycleType = '';
                    this.list[index].cycle = v;
                }
                this.editRule(this.list[index]);
            },
            // 修改某一列次数
            limitTimeChange(index, v) {
                if (!validateIntegerO(v)) {
                    this.list[index].limitTime = this.listCopy[index].limitTime;
                    return;
                }
                this.cloneList();
                this.editRule(this.list[index]);
            },
            // 修改某一列分数
            scoreChange(index, v) {
                if (!validateIntegerO(v)) {
                    this.list[index].score = this.listCopy[index].score;
                    return;
                }
                this.cloneList();
                this.editRule(this.list[index]);
            },
            // 修改某一列状态
            statusChange(index, v) {
                this.editRule(this.list[index]);
            }
        }
    };
</script>
