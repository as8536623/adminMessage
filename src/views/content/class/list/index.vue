<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding">
        <qgu-drag-row>
            <div slot="left" class="class-category">
                <school-select @select="handleSelSchool"/>
                <qgu-tree
                    :show-search="false"
                    :show-include-child="false"
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
                    :content="$t('类别管理')"
                    placement="top"
                    class="category__icon"
                >
                    <router-link v-if="activeSchool" :to="'/content/class/grade?schoolId='+activeSchool.id">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="opt__line">
                    <router-link
                        v-if="activeSchool && checkPermission('k12-addGroup')"
                        :to="'/content/class/edit?schoolId='+activeSchool.id"
                        class="el__button__link"
                    >
                        <el-button type="primary">{{ $t('新增') }}</el-button>
                    </router-link>
                    <el-button
                        v-if="checkPermission('k12-addGroup')"
                        @click="preBatch('ENABLE')"
                    >{{ $t('启用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('k12-addGroup')"
                        @click="preBatch('DISABLE')"
                    >{{ $t('停用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('k12-delGroup')"
                        @click="preBatch('DELETE')"
                    >{{ $t('删除') }}
                    </el-button>
                    <search-input
                        v-model="listQuery.name"
                        class="pull-right"
                        :placeholder="$t('请输入班级名称/编号')"
                        @enter="search"
                    />
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
                    @sort-change="handleSortChange"
                />
            </div>
        </qgu-drag-row>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import SchoolSelect from '@/components/School/SchoolSelect';
    import {deleteGroup, disableGroup, enabledGroup, groupPage} from '@/api/group';
    import {COMMON_STATUS_ENUM, TEACHER_JOB_TYPE_ENUM, TEACHER_TYPE_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';
    import {mapGetters} from 'vuex';
    import {getNodeTree} from '@/api/commonTree';

    export default {
        name: 'TeacherList',
        components: {
            QguTree,
            SchoolSelect
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'code',
                    minWidth: 160,
                    text: this.$t('编号')
                },
                {
                    field: 'name',
                    minWidth: 160,
                    text: this.$t('班级名称'),
                    render: (h, param) => {
                        const name = param.row.name;
                        if (!name) {
                            return '--';
                        }
                        return h('span', {
                            attrs: {
                                class: 'table__td__link'
                            },
                            on: {
                                click: () => {
                                    this.viewDetail(param.row.id);
                                }
                            }
                        }, name);
                    }
                },
                {
                    field: 'headTeacherName',
                    text: this.$t('班主任'),
                    minWidth: 100
                },
                {
                    field: 'count',
                    text: this.$t('学生人数')
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 70,
                    render: (h, param) => {
                        return COMMON_STATUS_ENUM.getName(param.row.status);
                    }
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    minWidth: 100,
                    text: this.$t('操作'),
                    render: (h, param) => {
                        const optArr = [];
                        const status = param.row.status;
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.del([param.row.id]);
                                }
                            }
                        });
                        const enableBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('启用'),
                                type: 'text',
                                icon: 'enable'
                            },
                            on: {
                                click: () => {
                                    this.enable([param.row.id]);
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
                                    this.disable([param.row.id]);
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
                                        name: 'classEdit',
                                        query: {
                                            id: param.row.id,
                                            schoolId: this.activeSchool.id
                                        }
                                    });
                                }
                            }
                        });

                        if (status === 'ENABLED') {
                            if (this.checkPermission('k12-addGroup')) {
                                optArr.push(disableBtn);
                            }
                        } else {
                            if (this.checkPermission('k12-addGroup')) {
                                optArr.push(enableBtn);
                                optArr.push(editBtn);
                            }
                            if (this.checkPermission('k12-delGroup')) {
                                optArr.push(deleteBtn);
                            }
                        }

                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                TEACHER_TYPE_ENUM,
                TEACHER_JOB_TYPE_ENUM,
                tableColumns,
                list: [],
                total: 0,
                time: [],
                listQuery: {
                    includeChild: true,
                    categoryId: null,
                    name: '',
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                dialogVisible: false,
                editType: 'ADD',
                editQuery: {
                    name: '',
                    categoryId: '',
                    id: '',
                    code: '',
                    categoryName: ''
                },
                selectedData: [],
                funCode: 'uc_group_category',
                positionCategory: null,
                activeSchool: null
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        created() {
        },
        methods: {
            checkPermission,
            viewDetail(id) {
                this.$router.push({
                    name: 'classEdit',
                    query: {
                        id,
                        readonly: true
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
            getCategory() {
                getNodeTree(this.funCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.categoryId = result.data.id;
                        this.search();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取岗位类别出错'));
                    }
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
                if (params.categoryId === '*') {
                    params.categoryId = '';
                }
                if (Array.isArray(this.time) && this.time.length) {
                    params.startTime = this.time[0];
                    params.endTime = this.time[1];
                }
                params.schoolId = this.activeSchool.id;
                this.listLoading = true;
                groupPage(params).then(re => {
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
            // 排序
            handleSortChange(column, prop, order) {
                if (this.listQuery.sort === 'desc') {
                    this.listQuery.sort = 'asc';
                } else {
                    this.listQuery.sort = 'desc';
                }
                this.getList({
                    pageNum: 1
                });
            },
            // 停用
            disable(ids) {
                this.$confirm(this.$t('确认停用该班级么?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    disableGroup(ids).then(re => {
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
            // 启用
            enable(ids) {
                enabledGroup(ids).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            del(ids) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    deleteGroup(ids).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.search();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            // 批量操作-预
            preBatch(type) {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                for (let i = 0; i < selectedData.length; i++) {
                    selectedIds.push(selectedData[i].id);
                }

                switch (type) {
                    case 'ENABLE':
                        this.enable(selectedIds);
                        break;
                    case 'DISABLE':
                        this.disable(selectedIds);
                        break;
                    case 'DELETE':
                        this.del(selectedIds);
                        break;
                }
            },
            handleSelSchool(school) {
                this.activeSchool = school;
                this.getCategory();
            }
        }
    };
</script>
