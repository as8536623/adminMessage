<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container examination-container">
        <section class="tool-form-item">
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
        </section>
    </article>
</template>
<script>
    import {downloadPaper, searchPaperPage} from '@/api/exam/exam/exam';
    import {TEST_QUESTION_LEVEL_ENUM, TEST_QUESTION_LEVEL_VALUE_ENUM} from '@/enum';
    import {mapGetters} from 'vuex';

    export default {
        name: 'PaperSetting',
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            const tableColumns = [
                {
                    field: 'showOrder',
                    text: this.$t('试卷序号'),
                    width: 80
                },
                {
                    field: 'paperName',
                    text: this.$t('试卷名称'),
                    minWidth: 200
                },
                {
                    field: 'itemCount',
                    text: this.$t('试题总数'),
                    align: 'center',
                    width: 100
                },
                {
                    field: 'mark',
                    text: this.$t('试题分值'),
                    align: 'center',
                    width: 100
                },
                {
                    field: 'level',
                    text: this.$t('综合难度'),
                    minWidth: 160,
                    render: (h, param) => {
                        return h('ElRate', {
                            attrs: {
                                value: TEST_QUESTION_LEVEL_VALUE_ENUM.getName(param.row.level),
                                disabled: true,
                                showScore: true,
                                scoreTemplate: TEST_QUESTION_LEVEL_ENUM.getName(param.row.level)
                            }
                        });
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    width: 100,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const previewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('预览'),
                                type: 'text',
                                icon: 'view'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, false);
                                }
                            }
                        });
                        const downloadBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('下载'),
                                type: 'text',
                                icon: 'download'
                            },
                            on: {
                                click: () => {
                                    this.download(param.row);
                                }
                            }
                        });

                        if (this.$route.query.examType === 'OFFLINE') {
                            optArr.push(downloadBtn);
                        }
                        optArr.push(previewBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                TEST_QUESTION_LEVEL_VALUE_ENUM,
                TEST_QUESTION_LEVEL_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                itemType: this.$route.query.examType,
                listQuery: {
                    examId: this.id,
                    pageNum: 1,
                    pageSize: 20
                }
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
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                searchPaperPage(params).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.list = result.data.list ? result.data.list : [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            download(data) {
                const params = {
                    paperId: data.id,
                    examId: data.examId
                };
                downloadPaper(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const exportTask = result.data;
                        this.exportWord(exportTask);
                    }
                });
            },
            exportWord(data) {
                const url = `${process.env.FS_API}/file/d/${data.fileId}?_token=${this.token}`;
                // const url =
                //     `${process.env.BASE_API}/veln-pe/item/downloadExport/${this.excelInfo.id}?_token=${this.token}`;
                window.open(url);
            },
            opt(data, flag) {
                const routeData = this.$router.resolve({
                    name: 'examPaperPreview',
                    query: {id: data.id, isEdit: flag ? 'edit' : null, paper: true}
                });
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>
