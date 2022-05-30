<style lang="scss" scoped>
@import '../../style.scss';
</style>
<template>
    <article class="app-container tool-container">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
            <el-form-item :label="$t('申请状态') + '：'">
                <el-select v-model="listQuery.statusList" size="mini" @change="search">
                    <el-option :label="$t('全部状态')" value/>
                    <el-option
                        v-for="item in applyStatus.getAllValues()"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('来源') + '：'">
                <el-select v-model="listQuery.sourceList" size="mini" @change="search">
                    <el-option :label="$t('全部来源')" value/>
                    <el-option
                        v-for="item in signOriginStatus.getAllValues()"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="pull-right">
                <search-input
                    v-model="listQuery.keywords"
                    :placeholder="$t('请输入工号/姓名/用户名/手机号')"
                    @enter="search"
                />
            </el-form-item>
        </el-form>
        <section class="opt__line veln__width">
            <el-button type="primary" @click="batchHandle('pass')">{{ $t('通过') }}</el-button>
            <el-button @click="batchHandle('refuse')">{{ $t('拒绝') }}</el-button>
            <el-button @click="batchHandle('del')">{{ $t('移除') }}</el-button>
            <!--<el-button @click="exportHandle">{{$t('导入')}}</el-button>-->
            <!--<el-button @click="exportHandle">{{$t('导出')}}</el-button>-->
            <div class="sign__stu__desc pull-right">
                {{ statistics.totalCount + $t('位学员') + '：'
                    + statistics.importCount + $t('人导入') + '；' +
                    (statistics.pendingCount+statistics.passCount+statistics.refusedCount)
                    + $t('人报名（') + statistics.pendingCount + $t('人待审核') + '+'
                    + statistics.passCount + $t('人通过') + '+' + statistics.refusedCount + $t('人已拒绝）') }}
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
            @sort-change="handleSortChange"
        />
        <el-dialog
            v-if="checkVisible"
            append-to-body
            :title="$t('审核申请')"
            :modal-append-to-body="false"
            :visible.sync="checkVisible"
            width="620px"
            :before-close="handleClose"
            custom-class="label__dialog"
        >
            <el-form ref="editQuery" :model="editQuery" label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item v-if="recordList.length > 0" :label="$t('报名信息') + '：'">
                        <el-form label-width="140px">
                            <el-form-item
                                v-for="(item, index) in recordList"
                                :key="index"
                                :label="$t(item.fieldName) + '：'"
                            >{{ item.fieldValue }}</el-form-item>
                        </el-form>
                    </el-form-item>
                    <el-form-item :label="$t('审核结果') + '：'" prop="approveResult">
                        <el-radio
                            v-model="editQuery.approveResult"
                            label="PASS"
                            :disabled="editQuery.disabled"
                        >{{ $t('通过') }}</el-radio>
                        <el-radio
                            v-model="editQuery.approveResult"
                            label="REFUSED"
                            :disabled="editQuery.disabled"
                        >{{ $t('拒绝') }}</el-radio>
                    </el-form-item>
                    <el-form-item :label="$t('原因') + '：'">
                        <el-input
                            v-model.trim="editQuery.remark"
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
            :title="$t(userInfo.approveResult === 'PASS' ? '通过申请' : '拒绝申请')"
            :modal-append-to-body="false"
            :visible.sync="detailVisible"
            width="520px"
            :before-close="detailHandleClose"
            custom-class="label__dialog"
        >
            <el-form label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('操作人') + '：'">{{ userInfo.name }}</el-form-item>
                    <el-form-item :label="$t('操作时间') + '：'">{{ userInfo.updatedAt }}</el-form-item>
                    <el-form-item
                        :label="$t(userInfo.approveResult === 'PASS' ? '通过原因' : '拒绝原因') + '：'"
                    >{{ userInfo.remark ? userInfo.remark : '--' }}</el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="detailVisible=false">{{ $t('取消') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </article>
</template>
<script>
    import {SIGN_ORIGIN_ENUM, ENROLL_APPLY_STATUS_ENUM} from '@/enum';
    import moment from 'moment';
    import {
        getList,
        userDelete,
        statistics,
        approve,
        detail
    } from '@/api/signUpUser';
    import {formatGetParams} from '@/utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'SignUpList',
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
                    minWidth: 160
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 160,
                    render: (h, param) => {
                        const name = param.row.name;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'signUpUserInfo',
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
                    minWidth: 160
                },
                {
                    field: 'mobile',
                    text: this.$t('手机号'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.mobile ? param.row.mobile : '--';
                    }
                },
                {
                    field: 'orgName',
                    text: this.$t('部门'),
                    minWidth: 160
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.positionName
                            ? param.row.positionName
                            : '--';
                    }
                },
                {
                    field: 'enrollTime',
                    text: this.$t('申请时间'),
                    minWidth: 150,
                    sortable: 'custom',
                    render: (h, param) => {
                        const enrollTime = param.row.enrollTime;
                        return enrollTime
                            ? moment(param.row.enrollTime).format(
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
                            ? this.signOriginStatus.getName(param.row.source)
                            : '--';
                    }
                },
                {
                    field: 'approveResult',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.approveResult
                            ? this.applyStatus.getName(param.row.approveResult)
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
                        const delBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('移除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'del');
                                }
                            }
                        });
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
                        switch (param.row.approveResult) {
                            case 'PENDING':
                                optArr.push(checkBtn);
                                break;
                            case 'PASS':
                                optArr.push(detailBtn);
                                break;
                            case 'REFUSED':
                                optArr.push(delBtn);
                                optArr.push(detailBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                signOriginStatus: SIGN_ORIGIN_ENUM,
                applyStatus: ENROLL_APPLY_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    enrollId: this.id || this.$route.query.id,
                    keywords: '',
                    statusList: '',
                    sourceList: '',
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                editQuery: {
                    approveResult: 'PASS',
                    remark: '',
                    idList: [],
                    enrollId: this.id || this.$route.query.id
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
                }
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        watch: {
            id(val) {
                if (val) {
                    this.listQuery.enrollId = val;
                    this.editQuery.enrollId = val;
                    this.getList({pageNum: 1});
                    this.getStatistics();
                }
            }
        },
        created() {
            this.getList();
            this.getStatistics();
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
            getStatistics() {
                statistics({enrollId: this.listQuery.enrollId}).then(res => {
                    const result = res.data;
                    if (result && result.success) {
                        this.statistics = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            add() {
                this.$router.push({name: 'signInEdit'});
            },
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
                        selectedIds.push(selectedData[i].id);
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
                            approveResult: 'PASS',
                            remark: '',
                            idList: params,
                            enrollId: this.id || this.$route.query.id
                        };
                        break;
                    case 'del':
                        this.userDelete(params);
                        break;
                    case 'pass':
                        this.checkVisible = true;
                        this.recordList = [];
                        this.editQuery = {
                            approveResult: 'PASS',
                            remark: '',
                            idList: params,
                            disabled: true,
                            enrollId: this.id || this.$route.query.id
                        };
                        break;
                    case 'refuse':
                        this.checkVisible = true;
                        this.recordList = [];
                        this.editQuery = {
                            approveResult: 'REFUSED',
                            remark: '',
                            idList: params,
                            disabled: true,
                            enrollId: this.id || this.$route.query.id
                        };
                        break;
                }
            },
            detail(id) {
                detail({id}).then(res => {
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
            onSure() {
                approve(this.editQuery).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('审核成功'));
                        this.checkVisible = false;
                        this.getList();
                        this.getStatistics();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '审核失败'));
                    }
                });
            },
            handleClose() {
                this.checkVisible = false;
                this.recordList = [];
                this.editQuery = {
                    approveResult: 'PASS',
                    remark: '',
                    idList: []
                };
            },
            detailHandleClose() {
                this.detailVisible = false;
                this.userInfo = {};
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
            userDelete(params) {
                userDelete(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('移除成功'));
                        this.getList();
                        this.getStatistics();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '移除失败'));
                    }
                });
            },
            exportHandle() {
                const url = `${process.env.BASE_API}/veln-enroll/enrollUser/downloadUser${formatGetParams(this.listQuery)}&_token=${this.token}`;
                window.open(url);
            }
        }
    };
</script>
