<style lang="scss">
    @import 'style.scss';

    .group__dialog {
        .el-dialog__body {
            padding: 10px;
        }
    }
</style>
<template>
    <article class="app-container student-container">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
            <el-form-item :label="$t('申请状态') + '：'">
                <el-select
                    v-model="listQuery.status"
                    size="mini"
                    @change="handleCheckChange"
                >
                    <el-option :label="$t('全部状态')" value/>
                    <el-option
                        v-for="item in applyStatus.arr"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('来源') + '：'">
                <el-select
                    v-model="listQuery.source"
                    size="mini"
                    @change="handleCheckChange"
                >
                    <el-option :label="$t('全部来源')" value/>
                    <el-option
                        v-for="item in origin.arr"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="pull-right label__right">
                <search-input
                    v-model="listQuery.keyword"
                    :placeholder="$t('请输入工号/姓名/用户名/手机号')"
                    @enter="search"
                />
            </el-form-item>
        </el-form>
        <section class="opt__line veln__width">
            <el-button v-if="checkPermission('mpProUserApprove')" type="primary" @click="batchHandle('pass')">
                {{ $t('通过') }}
            </el-button>
            <el-button v-if="checkPermission('mpProUserApprove')" @click="batchHandle('refuse')">{{ $t('拒绝') }}
            </el-button>
            <el-button
                :disabled="excelInfo && excelInfo.status === 'RUNNING'"
                @click="preExportExcel"
            >{{ $t('导出') }}
            </el-button>
            <!--<el-button @click="batchHandle('del')">{{$t('移除')}}</el-button>-->
            <!--<el-button @click="exportHandle">{{$t('导入')}}</el-button>-->
            <!--<el-button @click="exportHandle">{{$t('导出')}}</el-button>-->
            <!--<div class="sign__stu__desc pull-right">-->
            <!--{{statistics.totalCount + $t('位学员') + '：'-->
            <!--+ statistics.importCount + $t('人导入') + '；' +-->
            <!--(statistics.pendingCount+statistics.passCount+statistics.refusedCount)-->
            <!--+ $t('人报名（') + statistics.pendingCount + $t('人待审核') + '+'-->
            <!--+ statistics.passCount + $t('人通过') + '+' + statistics.refusedCount + $t('人已拒绝）')}}-->
            <!--</div>-->
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
                    @click="exportHandle"
                >下载
                </el-link>
            </div>
        </el-alert>
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
        <el-dialog
            v-if="checkVisible"
            append-to-body
            :title="$t('审核申请')"
            :modal-append-to-body="false"
            :visible.sync="checkVisible"
            width="520px"
            :before-close="handleClose"
            custom-class="label__dialog"
        >
            <el-form ref="editQuery" :model="editQuery" label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item v-if="recordList.length > 0" :label="$t('报名信息') + '：'">
                        <el-form>
                            <el-form-item
                                v-for="(item, index) in recordList"
                                :key="index"
                                :label="$t(item.fieldName) + '：'"
                            >{{ item.fieldValue }}
                            </el-form-item>
                        </el-form>
                    </el-form-item>
                    <el-form-item :label="$t('审核结果') + '：'" prop="status">
                        <el-radio
                            v-model="editQuery.status"
                            label="ENABLED"
                            :disabled="editQuery.disabled"
                        >{{ $t('通过') }}
                        </el-radio>
                        <el-radio
                            v-model="editQuery.status"
                            label="DISABLED"
                            :disabled="editQuery.disabled"
                        >{{ $t('拒绝') }}
                        </el-radio>
                    </el-form-item>
                    <el-form-item :label="$t('原因') + '：'">
                        <el-input
                            v-model.trim="editQuery.approveComment"
                            type="textarea"
                            :placeholder="$t('请输入理由，少于100个字')"
                            :max-length="100"
                            :rows="5"
                        />
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="checkVisible=false">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="onSure">{{ $t('保存') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            v-if="detailVisible"
            append-to-body
            :title="$t(userInfo.status === 'ENABLED' ? '通过申请' : '拒绝申请')"
            :modal-append-to-body="false"
            :visible.sync="detailVisible"
            width="520px"
            :before-close="detailHandleClose"
            custom-class="label__dialog"
        >
            <el-form label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item v-if="recordList.length > 0" :label="$t('报名信息') + '：'">
                        <el-form>
                            <el-form-item
                                v-for="(item, index) in recordList"
                                :key="index"
                                :label="$t(item.fieldName) + '：'"
                            >{{ item.fieldValue }}
                            </el-form-item>
                        </el-form>
                    </el-form-item>
                    <el-form-item :label="$t('操作人') + '：'">{{ userInfo.approveName }}</el-form-item>
                    <el-form-item :label="$t('操作时间') + '：'">{{ userInfo.updatedAt }}</el-form-item>
                    <el-form-item
                        :label="$t(userInfo.status === 'ENABLED' ? '通过原因' : '拒绝原因') + '：'"
                    >{{ userInfo.approveComment ? userInfo.approveComment : '--' }}
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="detailVisible=false">{{ $t('取消') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </article>
</template>
<script>
    import {PROJECT_APPLY_STATUS_ENUM, PROJECT_SOURCE_ENUM} from '@/enum';
    import moment from 'moment';
    import {approve, detail, getList, remove} from '@/api/course/project/student';
    import checkPermission from '@/utils/permission';
    import {proUser} from '@/api/course/project/export';
    import {closeExport} from '@/api/exam/item/exportTask';
    import {mapGetters} from 'vuex';

    export default {
        name: 'ProjectUserManage',
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'code',
                    text: this.$t('工号'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user && param.row.user.code ? param.row.user.code : '--';
                    }
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 160,
                    render: (h, param) => {
                        const name = param.row.user.name;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'projectUserInfo',
                                            query: {userId: param.row.id}
                                        });
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user && param.row.user.loginName ? param.row.user.loginName : '--';
                    }
                },
                {
                    field: 'mobile',
                    text: this.$t('手机号'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user && param.row.user.mobile ? param.row.user.mobile : '--';
                    }
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user && param.row.user.positionName
                            ? param.row.user.positionName
                            : '--';
                    }
                },
                {
                    field: 'orgName',
                    text: this.$t('org'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user && param.row.user.orgName
                            ? param.row.user.orgName
                            : '--';
                    }
                },
                {
                    field: 'approveTime',
                    text: this.$t('申请时间'),
                    minWidth: 150,
                    sortable: 'custom',
                    render: (h, param) => {
                        const approveTime = param.row.approveAt;
                        return approveTime
                            ? moment(param.row.approveAt).format(
                                'YYYY-MM-DD HH:mm'
                            )
                            : '--';
                    }
                },
                {
                    field: 'source',
                    text: this.$t('来源'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.source
                            ? this.origin.getName(param.row.source)
                            : '--';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.status
                            ? this.applyStatus.getName(param.row.status)
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 100,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const checkBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('审核'),
                                type: 'text',
                                icon: 'check'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'check');
                                }
                            }
                        });
                        // const delBtn = h('QguButton', {
                        //     props: {
                        //         toolTip: this.$t('移除'),
                        //         type: 'text',
                        //         icon: 'del'
                        //     },
                        //     on: {
                        //         click: () => {
                        //             this.opt(param.row, 'del');
                        //         }
                        //     }
                        // });
                        const detailBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('查看详情'),
                                type: 'text',
                                icon: 'view'
                            },
                            on: {
                                click: () => {
                                    this.detailOpt(param.row);
                                }
                            }
                        });
                        const proStatus = this.$route.query.status;
                        switch (param.row.status) {
                            case 'APPROVING':
                                if (proStatus !== 'FINISHED' && this.checkPermission('mpProUserApprove')) {
                                    optArr.push(checkBtn);
                                }
                                break;
                            case 'ENABLED':
                                /* if (proStatus !== 'FINISHED' && this.checkPermission('mpProUserApprove')) {
                                    optArr.push(checkBtn);
                                } */
                                /* if (proStatus !== 'FINISHED' && this.checkPermission('mpProUserDelete')) {
                                    optArr.push(delBtn);
                                } */
                                if (param.row.source !== 'INNER_ASSIGN' && param.row.source !== 'OUTER_ASSIGN') {
                                    optArr.push(detailBtn);
                                }
                                break;
                            case 'DISABLED':
                                /* if (proStatus !== 'FINISHED' && this.checkPermission('mpProUserApprove')) {
                                    optArr.push(checkBtn);
                                } */
                                /* if (proStatus !== 'FINISHED' && this.checkPermission('mpProUserDelete')) {
                                    optArr.push(delBtn);
                                } */
                                if (param.row.source !== 'INNER_ASSIGN' && param.row.source !== 'OUTER_ASSIGN') {
                                    optArr.push(detailBtn);
                                }
                                break;
                        }
                        return h('div', optArr.length > 0 ? optArr : '--', '');
                    }
                }
            ];
            return {
                origin: PROJECT_SOURCE_ENUM,
                applyStatus: PROJECT_APPLY_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    proId: this.id || this.$route.query.id,
                    keyword: '',
                    status: '',
                    source: '',
                    pageNum: 1,
                    pageSize: 20
                },
                editQuery: {
                    proId: this.id || this.$route.query.id,
                    status: 'ENABLED',
                    approveComment: '',
                    ids: []
                },
                recordList: [], // 报名信息
                userInfo: {}, // 详情信息
                checkVisible: false,
                detailVisible: false,
                statistics: {
                    importCount: 0,
                    passCount: 0,
                    pendingCount: 0,
                    refusedCount: 0,
                    totalCount: 0
                },
                excelInfo: null,
                excelMsg: '',
                excelMsgType: 'info',
                excelMsgId: ''
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        watch: {
            id(val) {
                if (val) {
                    this.listQuery.enrollId = val;
                    this.getList({pageNum: 1});
                    // this.getStatistics();
                }
            }
        },
        created() {
            if (this.$route.query.id) {
                this.getList();
                // this.getStatistics();
            }
        },
        methods: {
            checkPermission,
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
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                getList(params).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            // getStatistics() {
            //     statistics({proId: this.listQuery.proId}).then(res => {
            //         const result = res.data;
            //         if (result && result.success) {
            //             this.statistics = result.data;
            //         } else {
            //             this.$errorMsg(this.$t(result.msg || '数据查询异常'));
            //         }
            //     });
            // },
            opt(data, type) {
                const params = [];
                if (type === 'del') {
                    this.$confirm(this.$t('确认操作该数据, 是否继续?'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: this.typeTips(type)
                    }).then(() => {
                        params.push(data.id);
                        this.optHandle(params, type);
                    });
                } else {
                    params.push(data.id);
                    this.optHandle(params, type);
                }
            },
            batchHandle(type) {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                if (type === 'del') {
                    this.$confirm(this.$t('确认操作勾选的数据吗, 是否继续?'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: this.typeTips(type)
                    }).then(() => {
                        for (let i = 0; i < selectedData.length; i++) {
                            selectedIds.push(selectedData[i].id);
                        }
                        this.optHandle(selectedIds, type);
                    });
                } else {
                    for (let i = 0; i < selectedData.length; i++) {
                        if ((type === 'pass' || type === 'refuse') &&
                            (selectedData[i].source === 'INNER_ENROLL' || selectedData[i].source === 'OUTER_ENROLL')) {
                            selectedIds.push(selectedData[i].id);
                        } else if (type !== 'pass' && type !== 'refuse') {
                            selectedIds.push(selectedData[i].id);
                        }
                    }
                    if (!selectedIds || selectedIds.length === 0) {
                        this.$warnMsg(this.$t('没有可以审核的人员数据'));
                        return;
                    }
                    this.optHandle(selectedIds, type);
                }
            },
            optHandle(params, type) {
                switch (type) {
                    case 'check':
                        this.detail(params[0]);
                        this.checkVisible = true;
                        this.editQuery = {
                            status: 'ENABLED',
                            approveComment: '',
                            ids: params,
                            proId: this.id || this.$route.query.id
                        };
                        break;
                    case 'del':
                        // this.remove(params);
                        break;
                    case 'pass':
                        this.checkVisible = true;
                        this.recordList = [];
                        this.editQuery = {
                            status: 'ENABLED',
                            approveComment: '',
                            ids: params,
                            disabled: true,
                            proId: this.id || this.$route.query.id
                        };
                        break;
                    case 'refuse':
                        this.checkVisible = true;
                        this.recordList = [];
                        this.editQuery = {
                            status: 'DISABLED',
                            approveComment: '',
                            ids: params,
                            disabled: true,
                            proId: this.id || this.$route.query.id
                        };
                        break;
                }
            },
            detail(id) {
                detail(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.userInfo = result.data;
                        this.recordList = result.data.recordList
                            ? result.data.recordList
                            : [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            detailOpt(data) {
                this.userInfo = {};
                this.detail(data.id);
                this.detailVisible = true;
            },
            detailHandleClose() {
                this.userInfo = {};
                this.detailVisible = false;
            },
            onSure() {
                approve(this.editQuery).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('审核成功'));
                        this.getList();
                        this.checkVisible = false;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '审核失败'));
                        this.checkVisible = false;
                    }
                });
            },
            handleClose() {
                this.checkVisible = false;
                this.recordList = [];
                this.editQuery = {
                    status: 'ENABLED',
                    approveComment: '',
                    ids: []
                };
            },
            typeTips(type) {
                let typeVal = '';
                switch (type) {
                    case 'check':
                    case 'pass':
                        typeVal = 'info';
                        break;
                    case 'refuse':
                        typeVal = 'warning';
                        break;
                    case 'del':
                        typeVal = 'error';
                        break;
                }
                return typeVal;
            },
            remove(params) {
                remove(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('移除成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '移除失败'));
                    }
                });
            },
            // 预加载excel
            preExportExcel() {
                if (!this.list || this.list.length === 0) {
                    this.$warnMsg(this.$t('没有数据可以导出'));
                    return;
                }

                this.excelMsgType = 'info';
                this.excelMsgId = '';
                this.excelMsg = this.$t('学员列表excel正在生成中');
                this.excelInfo = {
                    status: 'RUNNING'
                };

                const params = Object.assign({}, this.listQuery, {pageNum: 1});
                proUser(params).then(re => {
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
            exportHandle() {
                const url = `${
                    process.env.BASE_API
                }/veln-mp/export/downloadExport/${this.excelInfo.id}?_token=${this.token}`;
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
            }
        }
    };
</script>
