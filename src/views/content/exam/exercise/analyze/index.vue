<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding">
        <section class="veln__query__line">
            <el-form :model="listQuery" :inline="true" class="demo-form-inline unrequired__form">
                <search-input
                    v-model="listQuery.keyword"
                    class="pull-right"
                    :placeholder="$t('请输入题目名称')"
                    @enter="search"
                />
                <el-form-item :label="$t('题型') + '：'">
                    <el-checkbox-group v-model="listQuery.typeList" @change="handleCheckChange">
                        <el-checkbox
                            v-for="item in TEST_QUESTION_TYPE_OBJECTIVE_ENUM.arr"
                            :key="item.code"
                            :label="item.code"
                        >{{ item.name }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
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
    import {TEST_QUESTION_TYPE_OBJECTIVE_ENUM} from '@/enum';
    import {exerciseItemAnalyze} from '@/api/exam/exam/exercise';

    export default {
        name: 'ExerciseAnalyze',
        data() {
            const tableColumns = [
                {
                    field: 'stemOutline',
                    text: this.$t('题干'),
                    minWidth: 300,
                    render: (h, param) => {
                        const stemOutline = param.row.stemOutline;
                        return h('div', [
                            h('span',
                              {
                                  attrs: {
                                      class: 'table__td__link'
                                  },
                                  on: {
                                      click: () => {
                                          this.$router.push({name: 'questionDetail', query: {id: param.row.id}});
                                      }
                                  }
                              },
                              stemOutline ? stemOutline.replace(/<\/?p[^>]*>/gi, '') : '--')
                        ]);
                    }
                },
                {
                    field: 'type',
                    text: this.$t('题型'),
                    minWidth: 120,
                    render: (h, param) => {
                        const {type} = param.row;
                        return TEST_QUESTION_TYPE_OBJECTIVE_ENUM.getName(type);
                    }
                },
                {
                    field: 'rightCount',
                    text: this.$t('答对人次'),
                    align: 'center',
                    minWidth: 120
                },
                {
                    field: 'wrongCount',
                    text: this.$t('答错人次'),
                    align: 'center',
                    minWidth: 100
                },
                {
                    field: 'accuracy',
                    text: this.$t('正确率'),
                    align: 'center',
                    minWidth: 100,
                    render: (h, param) => {
                        const {accuracy} = param.row;
                        return `${accuracy.toFixed(1)}%`;
                    }
                }
            ];
            return {
                TEST_QUESTION_TYPE_OBJECTIVE_ENUM,
                tableColumns,
                total: 0,
                list: [],
                listLoading: false,
                listQuery: {
                    keyword: '',
                    exerciseId: '',
                    typeList: [
                        'SINGLE_SELECTION',
                        'MULTI_SELECTION',
                        'INDEFINITE_SELECTION',
                        'JUDGMENT'/*,
                    'FILL',
                    'QUESTIONS'*/
                    ],
                    pageNum: 1,
                    pageSize: 20
                }
            };
        },
        mounted() {
            const id = this.$route.query.id;
            if (id) {
                this.listQuery.exerciseId = id;
                this.getList();
            }
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                exerciseItemAnalyze(params).then(re => {
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
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
            },
            handleCheckChange() {
                this.search();
            }
        }
    };
</script>
