<style lang="scss">
    @import "style.scss";
    @import "../style.scss";
</style>
<template>
    <article class="app-container examination-container">
        <el-form
            ref="paper"
            :model="paper"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-steps :data="steps" :active="active" @change="stepChange"/>
            <section v-if="!currentPaperInfo.id" class="paper__setting__default" @click="selectPapers">
                <div class="paper__default__image"/>
                <div class="paper__default__desc">{{ $t('点击选择试卷') }}</div>
            </section>
            <section v-else class="tool-form-item">
                <div class="paper__setting__item veln__width">
                    <div v-if="currentPaperInfo.paperType === 'FIXED'" class="paper__setting__name">
                        <span>{{ $t('[固定卷]') }}</span>
                        <span>{{ currentPaperInfo.paperName }}</span>
                    </div>
                    <div v-else class="paper__setting__name">
                        <span>{{ $t('[随机卷]') }}</span>
                        <span>{{ currentPaperInfo.paperName }}</span>
                        <div v-if="count > 0">
                            {{ $t('你还可以生成') }}
                            {{ count }}
                            {{ $t('套试卷，继续生成') }}
                            <el-input-number
                                v-model.number="paper.makeCount"
                                :controls="false"
                                controls-position="right"
                                :min="0"
                                :max="count"
                            />
                            {{ $t('套试卷') }}
                            <el-button type="text" class="paper__button" @click="makePaper">{{ $t('立即生成') }}</el-button>
                        </div>
                    </div>
                    <el-button type="primary" @click="selectPapers">{{ $t('点击选择试卷') }}</el-button>
                </div>
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
            <div style="text-align: center">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button @click="last">{{ $t('上一步') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
            </div>
        </el-form>
        <el-dialog
            v-if="paperDialogVisible"
            append-to-body
            :title="$t('选择试卷')"
            :visible.sync="paperDialogVisible"
            width="890px"
            @close="paperDialogClose"
        >
            <veln-select-papers
                :selected-list="selectedList"
                @close="close"
                @selectPaper="selectPaper"
            />
        </el-dialog>
        <!--生成试卷过渡页-->
        <el-dialog
            v-if="paperLoadingVisible"
            append-to-body
            :title="currentPaperInfo.paperType === 'FIXED' ? $t('[固定卷]') : $t('[随机卷]') + currentPaperInfo.paperName"
            :show-close="false"
            :center="true"
            :visible.sync="paperLoadingVisible"
            width="400px"
            custom-class="loading__dialog"
        >
            <div class="loading__content">
                <div class="loading__image" :class="loading"/>
                <div class="loading__tip">{{ msg }}</div>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import VelnSelectPapers from '@/components/VelnSelectPapers';
    import {
        checkPaperTemplate,
        countPaper,
        searchPaperPage,
        makePaper,
        deletePaper,
        getInfo,
        downloadPaper
    } from '@/api/exam/exam/exam';
    import {TEST_QUESTION_LEVEL_VALUE_ENUM, TEST_QUESTION_LEVEL_ENUM} from '@/enum';
    import {mapGetters} from 'vuex';

    export default {
        name: 'PaperSetting',
        components: {
            VelnSteps,
            VelnSelectPapers
        },
        data() {
            const tableColumns = [
                {
                    field: 'showOrder',
                    text: this.$t('试卷序号'),
                    width: 160
                },
                {
                    field: 'paperName',
                    text: this.$t('试卷来源'),
                    minWidth: 200
                },
                {
                    field: 'itemCount',
                    text: this.$t('试题总数'),
                    minWidth: 80
                },
                {
                    field: 'mark',
                    text: this.$t('试题分值'),
                    minWidth: 80
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
                    width: 130,
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
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, true);
                                }
                            }
                        });
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.del(param.row);
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
                        optArr.push(downloadBtn);
                        optArr.push(previewBtn);
                        optArr.push(editBtn);
                        optArr.push(deleteBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('试卷设置'),
                    status: 'wait',
                    disabled: true
                },
                {
                    title: this.$t('考试安排'),
                    status: 'wait',
                    disabled: true
                },
                {
                    title: this.$t('考试设置'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                TEST_QUESTION_LEVEL_VALUE_ENUM,
                TEST_QUESTION_LEVEL_ENUM,
                steps,
                editQuery: {
                    id: this.$route.query.id,
                    paperTemplate: '',
                    paperTemplateId: '',
                    examId: this.$route.query.id
                },
                paper: {
                    paperTemplateId: '',
                    examId: this.$route.query.id,
                    makeCount: 2
                },
                rules: {},
                active: 1,
                paperDialogVisible: false,
                selectedList: [], // 选中的试卷
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    examId: this.$route.query.id,
                    pageNum: 1,
                    pageSize: 20
                },
                examType: this.$route.query.examType,
                currentPaperInfo: {}, // 当前选择的试卷信息
                count: 0,
                paperLoadingVisible: false,
                msg: '正在生成试卷...',
                loading: 'loading'
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            this.init();
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
                    this.paperLoadingVisible = false;
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
            init() {
                if (this.$route.query.id) {
                    this.getInfo();
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                }
            },
            countPaper() {
                const params = {examId: this.$route.query.id, templateId: this.currentPaperInfo.id};
                countPaper(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.count = result.data;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            // 编辑回显
            getInfo() {
                getInfo(this.$route.query.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.currentPaperInfo = Object.assign(
                            {},
                            this.currentPaperInfo,
                            result.data.paperTemplate
                        );
                        this.selectedList[0] = result.data.paperTemplate
                            ? result.data.paperTemplate.id
                            : [];
                        if (result.data.paperTemplate) {
                            this.countPaper();
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.last();
                        break;
                    case 2:
                        this.$router.push({
                            name: 'examArrange',
                            query: {
                                id: this.editQuery.id,
                                examType: this.$route.query.examType
                            }
                        });
                        break;
                    case 3:
                        this.$router.push({
                            name: 'examSetting',
                            query: {
                                id: this.editQuery.id,
                                examType: this.$route.query.examType
                            }
                        });
                        break;
                }
            },
            cancel() {
                this.$router.push({
                    name: 'examList'
                });
            },
            last() {
                this.$router.push({
                    name: 'examBasic',
                    query: {
                        id: this.editQuery.id,
                        examType: this.$route.query.examType
                    }
                });
            },
            sure() {
                this.$router.push({
                    name: 'examArrange',
                    query: {
                        id: this.editQuery.id,
                        examType: this.$route.query.examType
                    }
                });
            },
            selectPapers() {
                this.paperDialogVisible = true;
            },
            paperDialogClose() {
                this.paperDialogVisible = false;
            },
            close() {
                this.paperDialogVisible = false;
            },
            // 选择试卷
            selectPaper(arr) {
                this.editQuery.paperTemplate = arr[0];
                this.editQuery.paperTemplateId = arr[0].id;
                this.selectedList[0] = arr[0].id;
                this.paper.paperTemplateId = arr[0].id;
                this.currentPaperInfo = arr[0];
                this.makePaper();
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
            del(data) {
                // this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                //     confirmButtonText: this.$t('确定'),
                //     cancelButtonText: this.$t('取消'),
                //     type: 'error'
                // }).then(() => {
                //     const params = {paperId: data.id};
                //     deletePaper(params).then(re => {
                //         const result = re.data;
                //         if (result.success) {
                //             this.$successMsg(this.$t('删除成功'));
                //             this.getList();
                //         } else {
                //             this.$errorMsg(this.$t(result.msg || '删除失败'));
                //         }
                //     });
                // });
                const params = {paperId: data.id};
                deletePaper(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            },
            opt(data, flag) {
                const routeData = this.$router.resolve({
                    name: 'examPaperPreview',
                    query: {id: data.id, isEdit: flag ? 'edit' : null, paper: true}
                });
                window.open(routeData.href, '_blank');
            },
            // 立即生成试卷
            makePaper() {
                this.paperLoadingVisible = true;
                checkPaperTemplate(this.currentPaperInfo.id).then(res => {
                    const result = res.data;
                    this.paperLoadingVisible = false;
                    this.paper.paperTemplateId = this.currentPaperInfo.id;
                    if (result.success) {
                        makePaper(this.paper).then(res => {
                            this.paperLoadingVisible = true;
                            this.loading = 'finish';
                            this.msg = `${this.$t('已经为您生成')}${this.paper.makeCount}套试卷`;
                            this.countPaper();
                            this.getList();
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '异常'));
                    }
                });
            }
        }
    };
</script>
