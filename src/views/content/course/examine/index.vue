<style lang="scss" scoped>
    @import './style';
</style>

<template>
    <article class="app-container container__padding">
        <qgu-drag-row>
            <div slot="left" class="app__row--left">
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
            </div>
            <div slot="right" class="app__row--right">
                <section class="app__row--right__search-box">
                    <section class="opt__line veln__width">
                        <el-button
                            v-if="checkPermission('approveCourse')"
                            type="primary"
                            @click="batchAdopt('ENABLED')"
                        >{{ $t('通过') }}
                        </el-button>
                        <el-button
                            v-if="checkPermission('approveCourse')"
                            type="primary"
                            @click="batchAdopt('APPROVE_FAIL')"
                        >{{ $t('拒绝') }}
                        </el-button>
                    </section>
                    <div class="search-box__left clearfix">
                        <el-select
                            v-model="listQuery.statusList"
                            size="mini"
                            class="course__type__select"
                            placeholder="请选择"
                            @change="handleCheckChange"
                        >
                            <el-option
                                v-for="item in courseApproveStatusEnum.getValues()"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                        <section class="search-box__left__input-box">
                            <img class="input-box__search-icon" src="../../../../assets/images/search_examine.png">
                            <el-input
                                v-model.trim="listQuery.nameCodeKey"
                                :placeholder="$t('搜索课程名称/编号')"
                                @keyup.enter.native="search"
                            />
                            <span v-show="listQuery.nameCodeKey" class="input-box__clear" @click="clear">
                                <svg-icon icon-class="close_o"/>
                            </span>
                        </section>
                    </div>
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
            v-if="refuseReasonDialogVisible"
            append-to-body
            title="拒绝理由"
            :visible.sync="refuseReasonDialogVisible"
            width="434px"
            @close="refuseReasonDlgClose"
        >
            <section v-if="rejectReason" class="refuse-reason-content" v-html="rejectReason"/>
            <div class="dialog__btn__line">
                <el-button type="primary" @click="refuseReasonDlgClose">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="refuseDialogVisible"
            append-to-body
            :title="$t('提示')"
            :visible.sync="refuseDialogVisible"
            width="429px"
            @close="refuseDlgClose"
        >
            <section class="refuse-content">
                <span>拒绝理由：</span>
                <el-input v-model="approveReq.approveReason" maxlength="200" placeholder="请录入拒绝理由, 详细说明~" type="textarea"/>
            </section>
            <div class="dialog__btn__line">
                <el-button @click="cancelApprove()">取消</el-button>
                <el-button type="primary" @click="refuse()">确定</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {getList, approveCourse, getRejectReason} from '@/api/course';
    import {COURSE_APPROVE_STATUS_ENUM} from '@/enum';
    import {getCategory} from '@/api/courseCategory';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'CourseExamine',
        components: {
            QguTree
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    disabled: () => {
                        return !(
                            this.checkPermission('rejectReason') ||
                            this.checkPermission('approveCourse')
                        );
                    }
                },
                {
                    field: 'code',
                    text: this.$t('编号'),
                    minWidth: 140
                },
                {
                    field: 'name',
                    text: this.$t('名称'),
                    minWidth: 180,
                    render: (h, param) => {
                        const name = param.row.name;
                        if (!name) {
                            return '--';
                        }
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.viewDetail(param.row.id);
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'teacherName',
                    text: this.$t('讲师'),
                    align: 'center',
                    minWidth: 140,
                    render: (h, param) => {
                        return param.row.teacherName ? param.row.teacherName : '--';
                    }
                },
                {
                    field: 'period',
                    align: 'center',
                    text: this.$t('课时')
                },
                {
                    field: 'userName',
                    text: this.$t('创建人'),
                    align: 'center',
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.userName;
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    align: 'center',
                    minWidth: 80,
                    render: (h, param) => {
                        const statusE = param.row.status;
                        if (statusE === 'APPROVE_FAIL') {
                            return '审核拒绝';
                        } else if (statusE === 'APPROVING') {
                            return '审核中';
                        } else if (statusE === 'ENABLED' || statusE === 'DISABLED' || statusE === 'APPROVE_SUCCESS') {
                            return '审核通过';
                        }
                        return statusE;
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 150,
                    render: (h, param) => {
                        const optArr = [];
                        const refuseReasonBtn = h('span',
                                                  {
                                                      attrs: {
                                                          class: 'table__td__operation'
                                                      },
                                                      on: {
                                                          click: () => {
                                                              this.refuseReasonDlgOpen(param.row.id);
                                                          }
                                                      }
                                                  },
                                                  '拒绝理由'
                        );
                        const refuseBtn = h('span',
                                            {
                                                attrs: {
                                                    class: 'table__td__operation'
                                                },
                                                on: {
                                                    click: () => {
                                                        this.refuseDlgOpen(param.row.id);
                                                    }
                                                }
                                            },
                                            '拒绝'
                        );
                        const adoptBtn = h('span',
                                           {
                                               attrs: {
                                                   class: 'table__td__operation'
                                               },
                                               on: {
                                                   click: () => {
                                                       this.adoptPopOpen(param.row.id);
                                                   }
                                               }
                                           },
                                           '通过'
                        );

                        if (param.row.status === 'APPROVING' && checkPermission('approveCourse')) {
                            optArr.push(refuseBtn);
                            optArr.push(adoptBtn);
                        } else if (param.row.status === 'APPROVE_FAIL' && checkPermission('rejectReason')) {
                            optArr.push(refuseReasonBtn);
                        }

                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                funId: '',
                list: [],
                total: 0,
                tag: [],
                courseApproveStatusEnum: COURSE_APPROVE_STATUS_ENUM,
                listQuery: {
                    includeChildCategory: true,
                    categoryId: '',
                    needApprove: true,
                    statusList: 'ALL',
                    nameCodeKey: '',
                    pageNum: 1,
                    pageSize: 20
                },
                approveReq: {
                    relIds: [],
                    approveReason: '',
                    status: ''
                },
                listLoading: false,
                treeData: [],
                selectedData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                refuseReasonDialogVisible: false,
                refuseDialogVisible: false,
                rejectReason: ''
            };
        },
        watch: {},
        created() {
            this.getCourseCategoryTree();
            this.getList();
        },
        methods: {
            checkPermission,
            getCourseCategoryTree() {
                getCategory().then(re => {
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
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.positionCategory = data;
                this.getList({
                    pageNum: 1
                });
            },
            // 包含子类修改
            includeChildChange(includeChildCategory) {
                this.listQuery.includeChildCategory = includeChildCategory;
                this.listQuery.pageNum = 1;
                this.getList();
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                if (params.statusList === 'ALL') {
                    params.statusList = ['APPROVING', 'APPROVE_FAIL', 'ENABLED', 'DISABLED', 'APPROVE_SUCCESS'];
                    params.statusList = params.statusList.join(',');
                } else if (params.statusList === 'APPROVE_SUCCESS') {
                    params.statusList = ['ENABLED', 'DISABLED', 'APPROVE_SUCCESS'];
                    params.statusList = params.statusList.join(',');
                }
                this.listLoading = true;
                getList(params).then(re => {
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
            batchAdopt(status) {
                // 批量通过操作
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const msg = status === 'APPROVE_FAIL' ? '是否确认勾选的数据审核驳回?' : '是否确认勾选的数据审核通过?';
                this.$confirm(this.$t(msg), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'info'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }
                    this.approveReq.relIds = selectedIds;
                    this.approveReq.status = status;
                    if (status === 'APPROVE_FAIL') {
                        this.refuseDlgOpen();
                        return;
                    }
                    approveCourse(this.approveReq).then(re => {
                        const result = re.data;
                        console.info(result);
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.getList();
                            this.clear();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            },
            refuse() {
                this.approveReq.status = 'APPROVE_FAIL';
                approveCourse(this.approveReq).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList();
                        this.clear();
                        this.refuseDialogVisible = false;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            getApproveRejectReason(courseId) {
                const params = {'courseId': courseId};
                getRejectReason(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.rejectReason = result.data.approveReason;
                        this.refuseReasonDialogVisible = true;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            }, viewDetail(id) {
                this.$router.push({
                    name: 'courseDetail',
                    query: {
                        id
                    }
                });
            },
            cancelApprove() {
                this.approveReq.approveReason = '';
                this.refuseDialogVisible = false;
            },
            clear() {
                this.listQuery.nameCodeKey = '';
                this.approveReq.relIds = [];
                this.approveReq.needApprove = true;
                this.approveReq.approveReason = '';
                this.approveReq.status = '';
                this.getList({
                    pageNum: 1
                });
            },
            refuseDlgClose() {
                this.refuseDialogVisible = false;
                this.refuseForm.reason = '';
            },
            refuseReasonDlgClose() {
                this.refuseReasonDialogVisible = false;
            },
            // 拒绝理由输入确定操作
            refuseSelect() {
                this.refuseDialogVisible = false;
            },
            refuseDlgOpen(courseId) {
                if (courseId) {
                    this.approveReq.relIds = [courseId];
                }
                this.refuseDialogVisible = true;
            },
            refuseReasonDlgOpen(id) {
                this.getApproveRejectReason(id);
            },
            adoptPopOpen(courseId) {
                this.$confirm(this.$t('是否确认该课程数据审核通过?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'info'
                }).then(() => {
                    this.approveReq.relIds = [courseId];
                    this.approveReq.status = 'ENABLED';
                    approveCourse(this.approveReq).then(re => {
                        const result = re.data;
                        console.info(result);
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.getList();
                            this.clear();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            }
        }
    };
</script>
