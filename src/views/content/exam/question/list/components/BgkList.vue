<style lang="scss" src="../style.scss">
</style>

<template>
    <article class="app-container question__block">
        <qgu-drag-row>
            <div slot="left" class="app__row--left">
                <qgu-tree
                    :datalist="treeData"
                    :default-expand-all="defaultExpandAll"
                    :default-expanded-keys="defaultExpandedKeys"
                    class="question__tree"
                    @include-child-change="includeChildChange"
                    @node-click="nodeClick"
                >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <!-- === false 为了防止category为空的情况 -->
                        <svg-icon
                            v-if="data.category === false"
                            class-name="question__category"
                            icon-class="question_category"
                        />
                        <span class="organize__tree__text">{{ data.name }}</span>
                    </span>
                </qgu-tree>
                <el-tooltip
                    v-if="checkPermission('bankCategory') || checkPermission('itemBank')"
                    :content="$t('题库管理')"
                    class="question__category__icon"
                    placement="top"
                >
                    <router-link :to="{name: 'itemBankIndex'}">
                        <svg-icon class-name="category__icon__svg" icon-class="question_category"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="veln__width">
                    <el-form
                        :inline="true"
                        :model="listQuery"
                        class="demo-form-inline question-filter"
                        label-width="90px"
                    >
                        <el-form-item :label="$t('试题内容') + '：'">
                            <el-input
                                v-model="listQuery.stemOutline"
                                placeholder="请输入试题内容"
                                maxlength="50"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('题型') + '：'">
                            <el-select
                                v-model="listQuery.type"
                                class="course__type__select"
                                placeholder="请选择"
                                size="mini"
                            >
                                <el-option label="全部" value/>
                                <el-option
                                    v-for="item in TEST_QUESTION_TYPE_ENUM.getValues()"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('创建时间') + '：'">
                            <el-date-picker
                                v-model="datetime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('状态') + '：'">
                            <el-checkbox-group
                                v-model="listQuery.queryStatus"
                            >
                                <el-checkbox
                                    v-for="item in TEST_STATUS_ENUM.arr"
                                    :key="item.code"
                                    :label="item.code"
                                >{{ item.name }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item :label="$t('试题类型') + '：'">
                            <el-radio-group v-model="listQuery.attribute" @change="handleCheckChange">
                                <el-radio label="EXERCISE">{{ $t('练习') }}</el-radio>
                                <el-radio label="EXAMEXERCISE">{{ $t('考试') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-button type="primary" @click="handleCheckChange">{{ $t('查询') }}</el-button>
                        <el-button
                            v-if="checkPermission('importItem')"
                            :disabled="excelInfo && excelInfo.status === 'RUNNING'"
                            @click="preExportExcel"
                        >{{ $t('导出') }}
                        </el-button>
                    </el-form>
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
                            @click="exportExcel"
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
                />
            </div>
        </qgu-drag-row>
        <veln-file-upload
            ref="velnFileUpload"
            :template-url="templateUrl"
            app-code="sys"
            fun-code="PE_IMPORT_ITEM"
            title="试题导入"
            @onSure="uploadSuccess"
        />
        <el-dialog
            v-if="uploadErrorVisible"
            :title="$t('下载错误模板')"
            :visible.sync="uploadErrorVisible"
            append-to-body
            width="300px"
        >
            <section class="error__template__link">
                <span class="error__template__label">{{ $t('导入失败') }}，</span>
                <el-link type="primary" @click="downloadErrorExcel">{{ $t('请下载错误文档') }}</el-link>
            </section>
        </el-dialog>
        <el-dialog :title="$t('选择知识点')" :visible.sync="pointsVisible" append-to-body width="339px">
            <veln-knowledge-points-select
                ref="points"
                :category="true"
                :double-click="true"
                @dblclick="pointsSelect"
            />
            <div class="dialog__btn__line">
                <el-button @click="pointsVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="pointsSelect">{{ $t('确定') }}</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import VelnFileUpload from '@/components/VelnFileUpload';
    import VelnKnowledgePointsSelect from '@/components/VelnKnowledgePointsSelect';
    import {delItem, disable, enable, exportItem, importItem, listBankTree, searchItem} from '@/api/exam/item/item';
    import {closeExport, getFinalExport} from '@/api/exam/item/exportTask';
    import {TEST_ATTRIBUTE_ENUM, TEST_QUESTION_LEVEL_ENUM, TEST_QUESTION_TYPE_ENUM, TEST_STATUS_ENUM} from '@/enum';
    import {mapGetters} from 'vuex';
    import checkPermission from '@/utils/permission';
    import {deepClone} from '@/utils';
    import moment from 'moment';

    export default {
        name: 'ExamQuestionBgk',
        components: {
            QguTree,
            VelnFileUpload,
            VelnKnowledgePointsSelect
        },
        data() {
            const hasBgk = this.$store.getters.hasBgk;
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'type',
                    text: this.$t('题型'),
                    width: 80,
                    render: (h, param) => {
                        const type = param.row.type;
                        return type
                            ? this.TEST_QUESTION_TYPE_ENUM.getName(type)
                            : '--';
                    }
                },
                {
                    field: 'stemOutline',
                    text: this.$t('试题内容'),
                    minWidth: 260,
                    render: (h, param) => {
                        const stemOutline = param.row.stemOutline;
                        return h('div', [
                            h(
                                'span',
                                {
                                    attrs: {
                                        class: 'table__td__link'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: 'questionDetail',
                                                query: {id: param.row.id}
                                            });
                                        }
                                    }
                                },
                                stemOutline
                                    ? stemOutline.replace(/<\/?p[^>]*>/gi, '')
                                    : '--'
                            )
                        ]);
                    }
                },
                {
                    field: 'bankName',
                    text: this.$t('课程名称')
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    width: 60,
                    align: 'center',
                    render: (h, param) => {
                        return this.TEST_STATUS_ENUM.getName(param.row.status);
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    width: 100,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const startBtn = h('QguButton', {
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
                        const editBtn = h('QguButton', {
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
                        const disableBtn = h('QguButton', {
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
                        if (
                            'ENABLED' === param.row.status &&
                            this.checkPermission('enableItem')
                        ) {
                            optArr.push(disableBtn);
                        }
                        if (
                            'DRAFT' === param.row.status ||
                            'DISABLED' === param.row.status
                        ) {
                            if (this.checkPermission('enableItem')) {
                                optArr.push(startBtn);
                            }
                            if (this.checkPermission('updItem')) {
                                optArr.push(editBtn);
                            }
                        }
                        if (!hasBgk && this.checkPermission('delItem')) {
                            optArr.push(deleteBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                hasBgk, // 北国会
                TEST_STATUS_ENUM,
                TEST_QUESTION_TYPE_ENUM,
                TEST_QUESTION_LEVEL_ENUM,
                TEST_ATTRIBUTE_ENUM,
                tableColumns,
                funId: '',
                list: [],
                total: 0,
                datetime: [],
                listQuery: {
                    keyword: '',
                    type: '', // 题型
                    queryStatus: ['ENABLED', 'DRAFT', 'DISABLED'],
                    level: '', // 难度
                    attribute: 'EXAMEXERCISE', // 试题属性
                    stemOutline: '', // 试题内容
                    queryStartTime: '',
                    queryEndTime: '',
                    itemBank: {
                        categoryId: '*',
                        id: '',
                        name: '',
                        includeChild: true
                    },
                    knowledge: {
                        categoryId: '',
                        id: '',
                        knowledgeName: '',
                        includeChild: true
                    },
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                selectedData: [],
                options: [
                    {
                        value: 'VIDEO',
                        label: '视频'
                    },
                    {
                        value: 'AUDIO',
                        label: '音频'
                    },
                    {
                        value: 'WORD',
                        label: '文档'
                    }
                ],
                templateUrl: `${process.env.BASE_API}/${this.$appCodes.pe}/pe/item/downloadItemTemplate`,
                errorUrl: '',
                excelInfo: null,
                excelMsg: '',
                excelMsgType: 'info',
                excelMsgId: '',
                uploadErrorVisible: false,
                pointsVisible: false
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            if (this.hasBgk) {
                this.TEST_QUESTION_TYPE_ENUM.changeStatus([
                    {code: 'INDEFINITE_SELECTION', isShow: false},
                    {code: 'FILL', isShow: false},
                    {code: 'QUESTIONS', isShow: false}
                ]);
            }
            this.listBankTree();
            this.searchItem();
            this.getFinalExport();
        },
        methods: {
            checkPermission,
            listBankTree() {
                listBankTree().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [
                            {
                                id: '',
                                name: '全部',
                                isRoot: true,
                                child: result.data.child
                            }
                        ];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取课程类别出错'));
                    }
                });
            },
            // 校验能否下载excel
            getFinalExport() {
                const params = {
                    exportType: 'ITEM'
                };
                getFinalExport(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.excelInfo = result.data;
                        if (result.data && result.data.status === 'FINISHED') {
                            switch (result.data.status) {
                                case 'FINISHED': {
                                    this.excelMsg = this.$t(
                                        `excel 生成日期为${result.data.finishTime}`
                                    );
                                    this.excelMsgId = result.data.id;
                                    break;
                                }
                                case 'RUNNING': {
                                    this.excelMsgType = 'info';
                                    this.excelMsg = this.$t(
                                        '试题详情excel正在生成中'
                                    );
                                    break;
                                }
                                case 'FAILED': {
                                    this.excelMsgType = 'error';
                                    this.excelMsg = this.$t(`excel 生成失败`);
                                    break;
                                }
                            }
                        }
                    }
                });
            },
            nodeClick(data) {
                const includeChild = this.listQuery.itemBank.includeChild;
                this.listQuery.itemBank = {includeChild: includeChild};
                if (data.category) {
                    this.listQuery.itemBank.categoryId = data.id;
                } else {
                    this.listQuery.itemBank.id = data.id;
                    this.listQuery.itemBank.name = data.name;
                }
                this.positionCategory = data;
                this.searchItem({
                    pageNum: 1
                });
            },
            includeChildChange(includeChild) {
                this.listQuery.itemBank.includeChild = includeChild;
                this.searchItem({
                    pageNum: 1
                });
            },
            search() {
                this.searchItem({
                    pageNum: 1
                });
            },
            formatParams(params) {
                const p = deepClone(params);
                if (!p.knowledge.categoryId && !p.knowledge.id) {
                    delete p.knowledge;
                }
                return p;
            },
            searchItem(condition) {
                let params = Object.assign({}, this.listQuery, condition);
                if (Array.isArray(this.datetime) && this.datetime.length) {
                    params.queryStartTime = moment(this.datetime[0]).format('YYYY-MM-DD');
                    params.queryEndTime = moment(this.datetime[1]).format('YYYY-MM-DD');
                }
                console.log(params);
                params = this.formatParams(params);
                this.listLoading = true;
                searchItem(params).then(re => {
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
                this.selectedData = v;
            },
            handleSizeChange(v) {
                this.searchItem({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChange(v) {
                this.searchItem({
                    pageNum: v
                });
            },
            handleCheckChange() {
                this.searchItem({
                    pageNum: 1
                });
            },
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    delItem(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.searchItem();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            batchDel() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    delItem(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.searchItem();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            start(data) {
                const params = [];
                params.push(data.id);
                enable(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.searchItem();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            disable(data) {
                this.$confirm(this.$t('确认停用勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    disable(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('停用成功'));
                            this.searchItem();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '停用失败'));
                        }
                    });
                });
            },
            add() {
                let query = {};
                if (
                    this.listQuery.itemBank.id !== '' &&
                    this.listQuery.itemBank.id !== null
                ) {
                    query = {
                        bankId: this.listQuery.itemBank.id,
                        bankName: this.listQuery.itemBank.name
                    };
                }

                this.$router.push({
                    name: `editExamQuestion`,
                    query: query
                });
            },
            openUpload(type) {
                // this.templateUrl = '';
                this.$refs.velnFileUpload.open();
            },
            // 导入成功
            uploadSuccess(re) {
                if (re.success) {
                    this.checkAddExcel(re.data.fileId);
                } else {
                    this.$errorMsg(this.$t(re.msg || '导入失败'));
                }
            },
            checkAddExcel(fileId) {
                importItem(fileId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$refs.velnFileUpload.close();
                        this.$successMsg(this.$t(result.msg || '导入成功'));
                        this.search({pageNum: 1});
                    } else if (result.data) {
                        this.errorUrl = `${process.env.FS_API}/file/d/${result.data}?_token=${this.token}`;
                        this.uploadErrorVisible = true;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '导入失败'));
                    }
                });
            },
            downloadErrorExcel() {
                window.open(this.errorUrl);
            },
            // 预加载excel
            preExportExcel() {
                this.excelMsgType = 'info';
                this.excelMsgId = '';
                this.excelMsg = this.$t('试题详情excel正在生成中');
                this.excelInfo = {
                    status: 'RUNNING'
                };

                const params = Object.assign({}, this.listQuery, {pageNum: 1});
                exportItem(params).then(re => {
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
            // 导出excel
            exportExcel() {
                const url = `${process.env.FS_API}/file/d/${this.excelInfo.fileId}?_token=${this.token}`;
                // const url =
                //     `${process.env.BASE_API}/veln-pe/item/downloadExport/${this.excelInfo.id}?_token=${this.token}`;
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
            },
            edit(data) {
                this.$router.push({
                    name: `editExamQuestion`,
                    query: {
                        id: data.id
                    }
                });
            },
            // 知识点
            showKnowledgeSelect() {
                this.pointsVisible = true;
                this.$refs.knowledgeInput.blur();
            },
            pointsSelect() {
                const $points = this.$refs.points;
                const result = $points.getActive();
                this.listQuery.knowledge.id = '';
                this.listQuery.knowledge.categoryId = '';
                if (result.category) {
                    this.listQuery.knowledge.categoryId = result.id;
                } else {
                    this.listQuery.knowledge.id = result.id;
                }
                this.listQuery.knowledge.knowledgeName = result.name;
                this.listQuery.knowledge.includeChild = result.category;
                this.pointsVisible = false;
                this.searchItem({
                    pageNum: 1
                });
            },
            knowledgeClear() {
                this.listQuery.knowledge.id = '';
                this.listQuery.knowledge.categoryId = '';
                this.searchItem({
                    pageNum: 1
                });
            }
        }
    };
</script>
