<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="veln__papers">
        <el-form
            ref="listQuery"
            :model="listQuery"
            :inline-message="true"
            :inline="true"
            label-width="90px"
        >
            <el-form-item :label="$t('关键字') + '：'">
                <search-input
                    v-model="listQuery.paperName"
                    :placeholder="$t('试卷名称/编号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('创建人') + '：'" class="pull-right el__form-margin">
                <search-input
                    v-model="listQuery.createdBy"
                    :placeholder="$t('用户名/姓名/手机号/工号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('试卷类型') + '：'">
                <el-checkbox-group v-model="listQuery.queryTypes" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in TEST_PAPER_TYPE_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >{{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('试卷属性') + '：'">
                <el-checkbox-group v-model="listQuery.querySecuritys" @change="handleCheckChange">
                    <el-checkbox :label="false">{{ $t('普通') }}</el-checkbox>
                    <el-checkbox :label="true">{{ $t('绝密') }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <qgu-table
            ref="paperTable"
            class="radio__table"
            :columns="tableColumns"
            :data="list"
            :page="listQuery"
            :total="total"
            :loading="listLoading"
            @selection-change="selectionChange"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
        <div class="pull-right veln__paper__btn">
            <el-button @click="cancel">{{ $t('取消') }}</el-button>
            <el-button type="primary" @click="sure">{{ $t('确定') }}</el-button>
        </div>
    </article>
</template>
<script>
    import {TEST_PAPER_TYPE_ENUM, TEST_PAPER_STATUS_ENUM} from '@/enum';
    import {search} from '@/api/exam/exam/paperTemplate';

    export default {
        name: 'VelnSelectPapers',
        props: {
            selectedList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            const selectedPaper = this.selectedList;
            const tableColumns = [
                {
                    type: 'radio'
                    // enabled: (row, index) => {
                    //     return selectedPaper.length ? !selectedPaper.includes(row.id) : true;
                    // }
                },
                {
                    field: 'paperCode',
                    text: this.$t('试卷编号'),
                    width: 130
                },
                {
                    field: 'paperName',
                    text: this.$t('试卷名称'),
                    minWidth: 160
                },
                {
                    field: 'paperType',
                    text: this.$t('试卷类型'),
                    width: 80,
                    align: 'center',
                    render: (h, param) => {
                        const paperType = param.row.paperType;
                        return paperType ? this.TEST_PAPER_TYPE_ENUM.getName(paperType) : '--';
                    }
                },
                {
                    field: 'createdBy',
                    text: this.$t('创建人'),
                    width: 120,
                    render: (h, param) => {
                        return param.row.createdBy ? param.row.createdBy : '--';
                    }
                },
                {
                    field: 'createDate',
                    text: this.$t('创建时间'),
                    width: 140,
                    render: (h, param) => {
                        return param.row.createDate ? param.row.createDate : '--';
                    }
                }
                // {
                //     field: 'paperStatus',
                //     text: this.$t('状态'),
                //     minWidth: 80,
                //     render: (h, param) => {
                //         const paperStatus = param.row.paperStatus;
                //         return paperStatus ? this.TEST_PAPER_STATUS_ENUM.getName(paperStatus) : '--';
                //     }
                // }
            ];
            return {
                TEST_PAPER_TYPE_ENUM,
                TEST_PAPER_STATUS_ENUM,
                selectedPaper,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    paperName: '',
                    createdBy: '',
                    queryTypes: ['FIXED', 'RANDOM'],
                    querySecuritys: [false, true],
                    pageNum: 1,
                    pageSize: 20
                },
                multiSelection: []
            };
        },
        created() {
            this.getList();
        },
        methods: {
            selectionChange(v) {
                if (v.length > 1) {
                    this.$refs.paperTable.clearSelection();
                    this.$refs.paperTable.toggleRowSelection(v.pop());
                } else {
                    this.multiSelection = v;
                }
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
            onlyMySelfChange() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({includeChild: true}, this.listQuery, condition);
                this.listLoading = true;
                search(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                        this.$nextTick(() => {
                            this.setActive();
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                    this.listLoading = false;
                });
            },
            sure() {
                this.$emit('selectPaper', this.multiSelection);
                this.$emit('close');
            },
            cancel() {
                this.$emit('close');
            },
            // 默认选中
            setActive() {
                this.selectedPaper = this.selectedList;
                if (this.selectedList.length) {
                    this.list.map(item => {
                        if (this.selectedList.includes(item.id)) {
                            // this.$refs.paperTable.toggleRowSelection(item);
                            this.$refs.paperTable.radioSelect(item);
                        }
                    });
                }
            }
        }
    };
</script>
