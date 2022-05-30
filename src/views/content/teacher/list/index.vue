<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container teacher__category">
        <qgu-drag-row>
            <div slot="left" class="app__row--left app__row--left--setting">
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
                    v-if="checkPermission('teacherCategory')"
                    :content="$t('类别管理')"
                    placement="top"
                    class="category__icon"
                >
                    <router-link to="/content/teacher/category">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="opt__line veln__width">
                    <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
                        <!--                        <el-form-item :label="$t('讲师性质') + '：'">-->
                        <!--                            <el-select v-model="listQuery.source" size="mini" @change="search">-->
                        <!--                                <el-option :label="$t('全部类型')" value/>-->
                        <!--                                <el-option-->
                        <!--                                    v-for="item in TEACHER_TYPE_ENUM.arr"-->
                        <!--                                    :key="item.code"-->
                        <!--                                    :label="item.name"-->
                        <!--                                    :value="item.code"-->
                        <!--                                />-->
                        <!--                            </el-select>-->
                        <!--                        </el-form-item>-->
                        <el-form-item :label="$t('入库日期') + '：'">
                            <el-date-picker
                                v-model="time"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                clearable
                                @change="search"
                            />
                        </el-form-item>
                        <el-form-item class="pull-right">
                            <search-input
                                v-model="listQuery.name"
                                :placeholder="$t('请输入姓名/编号')"
                                @enter="search"
                            />
                        </el-form-item>
                    </el-form>
                </section>
                <section class="opt__line">
                    <router-link
                        v-if="checkPermission('addTeacher')"
                        to="/content/teacher/edit"
                        class="el__button__link"
                    >
                        <el-button type="primary">{{ $t('新增') }}</el-button>
                    </router-link>
                    <el-button
                        v-if="checkPermission('enableTeacher')"
                        @click="preBatch('ENABLE')"
                    >{{ $t('启用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('disableTeacher')"
                        @click="preBatch('DISABLE')"
                    >{{ $t('停用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('delTeacher')"
                        @click="preBatch('DELETE')"
                    >{{ $t('删除') }}
                    </el-button>
                    <!--                    <el-checkbox-->
                    <!--                        v-model="listQuery.selfCreated"-->
                    <!--                        class="pull-right"-->
                    <!--                        @change="search"-->
                    <!--                    >{{ $t('只看我创建的') }}-->
                    <!--                    </el-checkbox>-->
                    <!--                    <router-link to="/content/teacher/level">-->
                    <!--                        <el-button-->
                    <!--                            type="text"-->
                    <!--                            class="pull-right text&#45;&#45;blue__btn opt__text__btn"-->
                    <!--                        >{{ $t('设置讲师等级') }}-->
                    <!--                        </el-button>-->
                    <!--                    </router-link>-->
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
    import {teacherDelete, teacherDisable, teacherEnable, teacherPage} from '@/api/teacher/teacher';
    import {teacherCategory} from '@/api/teacher/teacherCategory';
    import {COMMON_STATUS_ENUM, TEACHER_JOB_TYPE_ENUM, TEACHER_TYPE_ENUM} from '@/enum';
    import moment from 'moment';
    import checkPermission from '@/utils/permission';
    import {mapGetters} from 'vuex';

    export default {
        name: 'TeacherList',
        components: {
            QguTree
        },
        data() {
            // 北国会判断
            let tableColumns = [
                {
                    type: 'checkbox',
                    disabled: () => {
                        return (
                            this.checkPermission('addTeacher') ||
                            this.checkPermission('delTeacher')
                        );
                    }
                },
                {
                    field: 'code',
                    minWidth: 120,
                    text: this.$t('编号')
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
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
                }];
            tableColumns = tableColumns.concat([
                {
                    field: 'createdAt',
                    sortable: 'custom',
                    minWidth: 100,
                    text: this.$t('入库日期'),
                    render: (h, param) => {
                        const createdAt = param.row.createdAt;
                        return moment(createdAt).format('YYYY-MM-DD');
                    }
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
                                        name: 'teacherEdit',
                                        query: {
                                            id: param.row.id
                                        }
                                    });
                                }
                            }
                        });

                        if (this.checkPermission('updTeacher')) {
                            optArr.push(editBtn);
                        }

                        if (status === 'DISABLED') {
                            if (this.checkPermission('enableTeacher')) {
                                optArr.push(enableBtn);
                            }
                        } else {
                            if (this.checkPermission('disableTeacher')) {
                                optArr.push(disableBtn);
                            }
                        }

                        if (this.checkPermission('delTeacher')) {
                            if (status === 'DISABLED') {
                                optArr.push(deleteBtn);
                            }
                        }

                        return h('div', optArr, '');
                    }
                }]);
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
                    source: '',
                    jobTypes: ['FULL', 'PART'],
                    statusList: ['ENABLED', 'DISABLED'],
                    statTime: '',
                    endTime: '',
                    name: '',
                    selfCreated: false,
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
                positionCategory: null
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        mounted() {
            if (this.corpCode === 'jiayi') {
                this.tableColumns.splice(3, 1);
            }
            this.getCategory();
        },
        methods: {
            checkPermission,
            viewDetail(id) {
                this.$router.push({
                    name: 'teacherEdit',
                    query: {
                        id,
                        readOnly: true
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
                teacherCategory().then(re => {
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
                this.listLoading = true;
                teacherPage(params).then(re => {
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
                this.$confirm(this.$t('确认停用该讲师么?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    teacherDisable(ids).then(re => {
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
                teacherEnable(ids).then(re => {
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
                    teacherDelete(ids).then(re => {
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
            }
        }
    };
</script>
