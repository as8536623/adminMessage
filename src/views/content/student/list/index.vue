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
                    <router-link to="/content/class/grade">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="opt__line veln__width">
                    <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
                        <!--<el-form-item label="拥有班级：">-->
                        <!--    <el-radio-group v-model="listQuery.hasClass" @change="search">-->
                        <!--        <el-radio :label="false">全部</el-radio>-->
                        <!--        <el-radio :label="true">有</el-radio>-->
                        <!--    </el-radio-group>-->
                        <!--</el-form-item>-->
                        <el-form-item class="pull-right">
                            <search-input
                                v-model="listQuery.keywords"
                                :placeholder="$t('请输入姓名/学号')"
                                @enter="search"
                            />
                        </el-form-item>
                    </el-form>
                </section>
                <section class="opt__line">
                    <router-link
                        v-if="activeSchool && checkPermission('k12-addUser')"
                        :to="'/content/student/edit?orgId=' + activeSchool.id + '&orgName=' + activeSchool.name"
                        class="el__button__link"
                    >
                        <el-button type="primary">{{ $t('新增') }}</el-button>
                    </router-link>
                    <el-button
                        v-if="checkPermission('k12-addUser')"
                        @click="preBatch('ENABLE')"
                    >{{ $t('启用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('k12-addUser')"
                        @click="preBatch('DISABLE')"
                    >{{ $t('停用') }}
                    </el-button>
                    <!-- <el-button-->
                    <!--     @click="preBatch('ADD')"-->
                    <!-- >{{ $t('移入班级') }}-->
                    <!-- </el-button>-->
                    <!-- <el-button-->
                    <!--     @click="preBatch('REMOVE')"-->
                    <!-- >{{ $t('移出班级') }}-->
                    <!-- </el-button>-->
                    <el-button
                        v-if="checkPermission('k12-resetPwd')"
                        @click="preBatch('RESET')"
                    >{{ $t('重置密码') }}
                    </el-button>
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
        <class-select v-if="activeSchool" ref="classSelect" :org-id="activeSchool.id" @on-sure="handleAddSure"/>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import SchoolSelect from '@/components/School/SchoolSelect';
    import ClassSelect from '@/components/School/ClassSelect';
    import {COMMON_STATUS_ENUM, TEACHER_JOB_TYPE_ENUM, TEACHER_TYPE_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';
    import {mapGetters} from 'vuex';
    import {deleteMember, getClassroomTree, searchClassroomMember} from '@/api/group';
    import {batchInsert} from '@/api/groupMember';
    import {userDisabled, userEnable, userResetPwd} from '@/api/user';
    import {userDelete} from '@/api/signUpUser';

    export default {
        name: 'TeacherList',
        components: {
            QguTree,
            SchoolSelect,
            ClassSelect
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'code',
                    minWidth: 140,
                    text: this.$t('学号')
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 120,
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
                    field: 'loginName',
                    text: this.$t('用户名'),
                    minWidth: 120
                },
                {
                    field: 'mobile',
                    text: this.$t('手机'),
                    minWidth: 120
                },
                {
                    field: 'groupBase.name',
                    text: this.$t('班级'),
                    minWidth: 160
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
                    minWidth: 140,
                    text: this.$t('操作'),
                    render: (h, param) => {
                        const optArr = [];
                        const status = param.row.status;
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
                                        name: 'studentEdit',
                                        query: {
                                            id: param.row.id,
                                            orgId: this.activeSchool.id,
                                            orgName: this.activeSchool.name
                                        }
                                    });
                                }
                            }
                        });
                        const resetBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('重置密码'),
                                type: 'text',
                                icon: 'reset'
                            },
                            on: {
                                click: () => {
                                    this.reset([param.row.id]);
                                }
                            }
                        });
                        const addBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('更换班级'),
                                type: 'text',
                                icon: 'add_s'
                            },
                            on: {
                                click: () => {
                                    this.add([param.row.id], param.row.groupId);
                                }
                            }
                        });
                        const removeBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('移出班级'),
                                type: 'text',
                                icon: 'close_o'
                            },
                            on: {
                                click: () => {
                                    this.remove([param.row.id], param.row.groupId);
                                }
                            }
                        });

                        if (status === 'ENABLED') {
                            if (this.checkPermission('k12-addUser')) {
                                optArr.push(disableBtn);
                            }
                            if (this.checkPermission('k12-resetPwd')) {
                                optArr.push(resetBtn);
                            }
                        } else {
                            if (this.checkPermission('k12-addUser')) {
                                optArr.push(enableBtn);
                                optArr.push(editBtn);
                            }
                            if (this.checkPermission('k12-resetPwd')) {
                                optArr.push(resetBtn);
                            }
                        }

                        if (param.row.groupId) {
                            if (this.checkPermission('k12-addUser')) {
                                optArr.push(removeBtn);
                            }
                        }

                        if (status !== 'DISABLED') {
                            if (this.checkPermission('k12-addUser')) {
                                optArr.push(addBtn);
                            }
                        }

                        return h('div', optArr, '');
                    }
                }];
            return {
                TEACHER_TYPE_ENUM,
                TEACHER_JOB_TYPE_ENUM,
                tableColumns,
                list: [],
                total: 0,
                time: [],
                listQuery: {
                    groupId: null,
                    keywords: '',
                    hasChildren: true,
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                dialogVisible: false,
                selectedData: [],
                funCode: 'uc_group_category',
                activeSchool: null,
                activeAddParams: null
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        methods: {
            checkPermission,
            viewDetail(id) {
                this.$router.push({
                    name: 'studentEdit',
                    query: {
                        id,
                        readOnly: true
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.groupId = data.id;
                this.listQuery.hasChildren = data.category;
                this.getList({
                    pageNum: 1
                });
            },
            getCategory() {
                const params = {
                    schoolId: this.activeSchool.id
                };
                getClassroomTree(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.groupId = result.data.id;
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
                if (params.groupId === '*') {
                    params.groupId = '';
                }
                params.schoolId = this.activeSchool.id;
                this.listLoading = true;
                searchClassroomMember(params).then(re => {
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
            reset(ids) {
                this.$confirm(this.$t('确认重置该学员的密码么?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    userResetPwd(ids).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(
                                result.msg && result.data
                                    ? `${this.$t(result.msg)}，${this.$t('重置后的密码是')}：${result.data}`
                                    : this.$t('重置成功')
                            );
                            this.getList({pageNum: 1});
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            },
            // 停用
            disable(ids) {
                this.$confirm(this.$t('确认停用该学员么?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    userDisabled(ids).then(re => {
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
                userEnable(ids).then(re => {
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
                    userDelete(ids).then(re => {
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
            remove(ids, groupId) {
                this.$confirm(this.$t('确定将该学员移出班级么?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = {
                        groupId: groupId,
                        source: 'APPOINT',
                        userIds: ids
                    };
                    deleteMember(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('移出成功'));
                            this.search();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '移出失败'));
                        }
                    });
                });
            },
            add(ids) {
                const params = {
                    source: 'APPOINT',
                    userIds: ids
                };
                this.activeAddParams = params;
                this.$refs.classSelect.show();
            },
            // 批量操作-预
            preBatch(type) {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                let groupId = '';
                for (let i = 0; i < selectedData.length; i++) {
                    selectedIds.push(selectedData[i].id);
                    groupId = selectedData[i].groupId;
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
                    case 'RESET':
                        this.reset(selectedIds);
                        break;
                    case 'ADD':
                        this.add(selectedIds, groupId);
                        break;
                    case 'REMOVE':
                        this.remove(selectedIds, groupId);
                        break;
                }
            },
            handleSelSchool(school) {
                this.activeSchool = school;
                this.getCategory();
            },
            handleAddSure(group) {
                const params = this.activeAddParams;
                params.groupId = group.id;
                batchInsert(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('添加成功'));
                        this.search();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '添加失败'));
                    }
                });
            }
        }
    };
</script>
