<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container exam__block">
        <qgu-drag-row>
            <div slot="left" class="app__row--left category__block">
                <qgu-tree
                    :datalist="treeData"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-expand-all="defaultExpandAll"
                    @include-child-change="includeChildChange"
                    @node-click="nodeClick"
                >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span class="organize__tree__text">{{ data.name }}</span>
                    </span>
                </qgu-tree>
                <el-tooltip
                    v-if="checkPermission('paperCategory')"
                    :content="$t('类别管理')"
                    placement="top"
                    class="category__icon"
                >
                    <router-link to="/content/pe/paper/category">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="veln__width">
                    <el-form
                        :model="listQuery"
                        :inline="true"
                        class="demo-form-inline"
                        label-width="90px"
                    >
                        <el-form-item :label="$t('关键字') + '：'">
                            <search-input
                                v-model="listQuery.paperName"
                                :placeholder="$t('试卷名称/编号')"
                                @enter="search"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('创建人') + '：'">
                            <search-input
                                v-model="listQuery.createdBy"
                                :placeholder="$t('姓名/用户名/工号/手机号')"
                                @enter="search"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('创建时间') + '：'">
                            <el-date-picker
                                v-model="queryTime"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="handleCheckChange"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('状态') + '：'">
                            <el-checkbox-group
                                v-model="listQuery.queryStatus"
                                @change="handleCheckChange"
                            >
                                <el-checkbox
                                    v-for="item in TEST_STATUS_ENUM.arr"
                                    :key="item.code"
                                    :label="item.code"
                                >{{ item.name }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </section>
                <section class="opt__line veln__width">
                    <el-button
                        v-if="checkPermission('addPaper')"
                        type="primary"
                        @click="add()"
                    >{{ $t('新增') }}</el-button>
                    <el-button v-if="checkPermission('delPaper')" @click="batchDel()">{{ $t('删除') }}</el-button>
                    <el-button
                        v-if="checkPermission('enablePaper')"
                        @click="batchDisable()"
                    >{{ $t('停用') }}</el-button>
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
            </div>
        </qgu-drag-row>
        <el-dialog
            v-if="authDialogVisible"
            append-to-body
            :title="$t('设置授权')"
            :visible.sync="authDialogVisible"
            width="939px"
        >
            <veln-auth-setting
                :app-code="$appCodes.pe + '/pe'"
                :fun-id="funId"
                route="paperTemplateAuth"
                rel-type="user"
                fun-code="PAPER_TEMPLATE_AUTH"
                @onClose="authDialogVisible=false;"
            />
        </el-dialog>
    </article>
</template>
<script>
    import QguTree from '@/components/QguTree';
    import VelnAuthSetting from '@/components/VelnAuthSetting';
    import {
        deletePaper,
        disabled,
        enable,
        search
    } from '@/api/paper/paperTemplate';
    import {getNodeTree} from '@/api/commonTree';
    import checkPermission from '@/utils/permission';
    import {TEST_PAPER_TYPE_ENUM, TEST_STATUS_ENUM} from '@/enum';

    export default {
        name: 'PaperList',
        components: {
            QguTree,
            VelnAuthSetting
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'paperCode',
                    width: 140,
                    text: this.$t('试卷编号')
                },
                {
                    field: 'paperName',
                    minWidth: 160,
                    text: this.$t('试卷名称'),
                    render: (h, param) => {
                        const paperName = param.row.paperName;
                        if (param.row.security) {
                            return h('div', [
                                h('svg-icon', {
                                    attrs: {
                                        class: 'paper__td__icon',
                                        iconClass: 'dense'
                                    }
                                }),
                                h(
                                    'span',
                                    {
                                        attrs: {
                                            class: 'paper__td__type table__td__link'
                                        },
                                        on: {
                                            click: () => {
                                                this.preview(param.row);
                                            }
                                        }
                                    },
                                    paperName
                                )
                            ]);
                        } else {
                            return h('div', [
                                h(
                                    'span',
                                    {
                                        attrs: {
                                            class: 'paper__td__type table__td__link'
                                        },
                                        on: {
                                            click: () => {
                                                this.preview(param.row);
                                            }
                                        }
                                    },
                                    paperName
                                )
                            ]);
                        }
                    }
                },
                {
                    field: 'paperType',
                    align: 'center',
                    width: 80,
                    text: this.$t('试卷类型'),
                    render: (h, param) => {
                        return this.TEST_PAPER_TYPE_ENUM.getName(
                            param.row.paperType
                        );
                    }
                },
                {
                    field: 'createdBy',
                    align: 'left',
                    minWidth: 100,
                    text: this.$t('创建人')
                },
                {
                    field: 'createdAt',
                    align: 'left',
                    width: 140,
                    text: this.$t('创建时间'),
                    render: (h, param) => {
                        return param.row.createDate;
                    }
                },
                {
                    field: 'paperStatus',
                    align: 'center',
                    width: 60,
                    text: this.$t('状态'),
                    render: (h, param) => {
                        return this.TEST_STATUS_ENUM.getName(param.row.paperStatus);
                    }
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    minWidth: 100,
                    text: this.$t('操作'),
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
                        const authBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('授权'),
                                type: 'text',
                                icon: 'person_s'
                            },
                            on: {
                                click: () => {
                                    this.auth(param.row);
                                }
                            }
                        });

                        if (
                            param.row.paperStatus === 'DRAFT' ||
                            param.row.paperStatus === 'DISABLED'
                        ) {
                            if (this.checkPermission('updPaper')) {
                                optArr.push(editBtn);
                            }
                            if (this.checkPermission('enablePaper')) {
                                optArr.push(startBtn);
                            }
                            if (this.checkPermission('delPaper')) {
                                optArr.push(deleteBtn);
                            }
                        }
                        if (
                            param.row.paperStatus === 'ENABLED' &&
                            this.checkPermission('addPaper')
                        ) {
                            if (this.checkPermission('enablePaper')) {
                                optArr.push(disableBtn);
                            }
                            if (this.checkPermission('authPaper')) {
                                optArr.push(authBtn);
                            }
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                TEST_STATUS_ENUM,
                TEST_PAPER_TYPE_ENUM,
                funCode: 'PAPER_TEMPLATE',
                appCode: this.$appCodes.pe + '/pe',
                tableColumns,
                list: [],
                total: 0,
                listQuery: {
                    includeChild: true,
                    categoryId: null,
                    paperName: '',
                    categoryName: '',
                    createdBy: '',
                    queryStatus: ['ENABLED', 'DRAFT'],
                    queryStartTime: '',
                    queryEndTime: '',
                    pageNum: 1,
                    pageSize: 20
                },
                queryTime: [],
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                selectedData: [],
                bankCategory: null,
                funId: '',
                authDialogVisible: false
            };
        },
        created() {
            this.listTree();
        },
        methods: {
            checkPermission,
            listTree() {
                getNodeTree(this.funCode, this.appCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取题库类别出错'));
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.listQuery.categoryName = data.name;
                this.bankCategory = data;
                this.getList({
                    pageNum: 1
                });
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            includeChildChange(includeChild) {
                this.listQuery.includeChild = includeChild;
                this.listQuery.pageNum = 1;
                this.getList();
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.queryStatus = params.queryStatus.join(',');
                params.queryStartTime =
                    null !== this.queryTime && this.queryTime.length
                        ? this.queryTime[0]
                        : null;
                params.queryEndTime =
                    null !== this.queryTime && this.queryTime.length
                        ? this.queryTime[1]
                        : null;
                this.listLoading = true;
                search(params).then(re => {
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
                    this.delPaper(selectedIds);
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
                    this.delPaper(params);
                });
            },
            add() {
                let query = {};
                if (
                    this.listQuery.categoryId !== '' &&
                    this.listQuery.categoryId !== null
                ) {
                    query = {
                        cId: this.listQuery.categoryId,
                        cName: this.listQuery.categoryName
                    };
                }

                this.$router.push({
                    name: 'paperBasic',
                    query: query
                });
            },
            edit(data) {
                this.$router.push({name: 'paperBasic', query: {id: data.id}});
            },
            start(data) {
                const params = {templateId: data.id};
                enable(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据异常'));
                    }
                });
            },
            disable(data) {
                const ids = [data.id];
                disabled(ids).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t('停用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据异常'));
                    }
                });
            },
            batchDisable() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                for (let i = 0; i < selectedData.length; i++) {
                    selectedIds.push(selectedData[i].id);
                }
                disabled(selectedIds).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t('停用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据异常'));
                    }
                });
            },
            delPaper(params) {
                deletePaper(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据异常'));
                    }
                });
            },
            auth(data) {
                this.funId = data.id;
                this.authDialogVisible = true;
            },
            // 试卷预览
            preview(data) {
                const routeData = this.$router.resolve({
                    name: 'paperPreview',
                    query: {id: data.id}
                });
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>
