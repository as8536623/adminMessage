<style lang="scss" >
@import './style';
</style>

<template>
    <article class="app-container cert__block">
        <qgu-drag-row>
            <div slot="left" class="app__row--left app__row--left--setting cert__category">
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
                <el-tooltip :content="$t('类别管理')" placement="top" class="category__icon">
                    <router-link to="/content/cert/category">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="person__filter veln__width">
                    <el-form
                        :model="listQuery"
                        :inline="true"
                        class="demo-form-inline unrequired__form"
                    >
                        <el-form-item :label="$t('状态') + '：'">
                            <el-checkbox-group
                                v-model="listQuery.statusList"
                                @change="formItemChange"
                            >
                                <el-checkbox
                                    v-for="(item, index) in COMMON_STATUS_ENUM.arr"
                                    :key="index"
                                    :label="item.code"
                                >{{ $t(item.name) }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <search-input
                            v-model="listQuery.name"
                            class="pull-right"
                            :placeholder="$t('请输入证书名称')"
                            @enter="search"
                        />
                    </el-form>
                </section>
                <section class="opt__line veln__width">
                    <el-button
                        v-if="checkPermission('addCert')"
                        type="primary"
                        @click="add()"
                    >{{ $t('新增') }}</el-button>
                    <el-button
                        v-if="checkPermission('delCert')"
                        @click="batchDel()"
                    >{{ $t('删除') }}</el-button>
                    <router-link :to="{name: 'certPerson'}">
                        <div class="outer__user__wrapper pull-right">
                            <svg-icon icon-class="out_user" class-name="outer__user__add"/>
                            <span>{{ $t('按人员查看') }}</span>
                        </div>
                    </router-link>
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
    </article>
</template>

<script>
/**
 * TODO
 * 查看详情、新增、编辑
 */
    import QguTree from '@/components/QguTree';
    import {getCertCategoryTree} from '@/api/cert/certCategory';
    import {
        certPage,
        certCopy,
        certDisable,
        certEnable,
        certDelete
    } from '@/api/cert/certInfo';
    import {COMMON_STATUS_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'PositionList',
        components: {
            QguTree
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    disabled: () => {
                        return (this.checkPermission('addCert') || this.checkPermission('delCert'));
                    }
                },
                {
                    field: 'code',
                    text: this.$t('证书编号'),
                    minWidth: 130
                },
                {
                    field: 'name',
                    text: this.$t('证书名称'),
                    minWidth: 120
                },
                {
                    field: 'categoryName',
                    text: this.$t('证书类别')
                },
                {
                    field: 'duration',
                    text: this.$t('有效期')
                },
                {
                    field: 'certOrg',
                    text: this.$t('发证机构'),
                    minWidth: 120
                },
                {
                    field: 'status',
                    text: this.$t('证书状态'),
                    render: (h, param) => {
                        const row = param.row;
                        return COMMON_STATUS_ENUM.getName(row.status);
                    }
                },
                {
                    field: 'userCount',
                    text: this.$t('获得人数'),
                    render: (h, param) => {
                        const userCount = param.row.userCount;
                        if (!userCount || userCount === 0) {
                            return userCount;
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
                                            name: 'certGain',
                                            query: {
                                                id: param.row.id
                                            }
                                        });
                                    }
                                }
                            },
                            userCount
                        );
                    }
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    width: 150,
                    text: this.$t('操作'),
                    render: (h, param) => {
                        const optArr = [];
                        const row = param.row;
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
                                    this.$router.push({
                                        name: 'certEdit',
                                        query: {
                                            id: row.id
                                        }
                                    });
                                }
                            }
                        });
                        const startBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('启用'),
                                type: 'text',
                                icon: 'enable'
                            },
                            on: {
                                click: () => {
                                    this.enable(row.id);
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
                                    this.disable(row.id);
                                }
                            }
                        });
                        const copyBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('复制'),
                                type: 'text',
                                icon: 'el-icon-document-copy'
                            },
                            on: {
                                click: () => {
                                    this.copy(row.id);
                                }
                            }
                        });
                        const viewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('查看详情'),
                                type: 'text',
                                icon: 'el-icon-view'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'certDetail',
                                        query: {
                                            id: row.id
                                        }
                                    });
                                }
                            }
                        });
                        switch (row.status) {
                            case 'ENABLED':
                                if (this.checkPermission('addCert')) {
                                    optArr.push(disableBtn);
                                    optArr.push(copyBtn);
                                }
                                optArr.push(viewBtn);
                                break;
                            case 'DISABLED':
                                if (this.checkPermission('addCert')) {
                                    optArr.push(startBtn);
                                    optArr.push(copyBtn);
                                }
                                if (this.checkPermission('delCert')) {
                                    optArr.push(deleteBtn);
                                }
                                optArr.push(viewBtn);
                                break;
                            case 'DRAFT':
                                if (this.checkPermission('addCert')) {
                                    optArr.push(startBtn);
                                    optArr.push(editBtn);
                                    optArr.push(copyBtn);
                                }
                                if (this.checkPermission('delCert')) {
                                    optArr.push(deleteBtn);
                                }
                                optArr.push(viewBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                COMMON_STATUS_ENUM,
                rules: {
                    categoryId: [
                        {
                            required: true,
                            message: this.$t('请输入选择分类'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                funCode: 'cert',
                tableColumns,
                list: [],
                total: 0,
                listQuery: {
                    includeChild: true,
                    categoryId: null,
                    name: '',
                    statusList: ['ENABLED', 'DISABLED', 'DRAFT'],
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                selectedData: [],
                positionCategory: null
            };
        },
        created() {
            this.positionCategoryAll();
        },
        methods: {
            checkPermission,
            positionCategoryAll() {
                getCertCategoryTree(this.funCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.categoryId = result.data.id;
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取岗位类别出错'));
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.positionCategory = data;
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
                params.statusList = params.statusList.length
                    ? params.statusList.join(',')
                    : '';
                this.listLoading = true;
                certPage(params).then(re => {
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
            add() {
                this.$router.push({
                    name: 'certEdit'
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
                    certDelete(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getList();
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

                    certDelete(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            formItemChange() {
                this.getList({
                    pageNum: 1
                });
            },
            enable(id) {
                certEnable(id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('复制成功'));
                        this.getList({
                            pageNum: 1
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '复制失败'));
                    }
                });
            },
            disable(id) {
                this.$confirm(this.$t('确认停用该证书么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                }).then(() => {
                    certDisable(id).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('复制成功'));
                            this.getList({
                                pageNum: 1
                            });
                        } else {
                            this.$errorMsg(this.$t(result.msg || '复制失败'));
                        }
                    });
                });
            },
            copy(id) {
                this.$confirm(this.$t('确认复制该证书么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                }).then(() => {
                    certCopy(id).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('复制成功'));
                            this.getList({
                                pageNum: 1
                            });
                        } else {
                            this.$errorMsg(this.$t(result.msg || '复制失败'));
                        }
                    });
                });
            }
        }
    };
</script>
