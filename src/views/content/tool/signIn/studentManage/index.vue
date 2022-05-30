<style lang="scss" scoped>
    @import "../../style.scss";

    .user-img-list {
        .user__cover {
            max-width: 150px;
            margin: 0 20px 20px 0;
            vertical-align: top;
        }
    }
</style>
<template>
    <article class="app-container tool-container">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
            <el-form-item :label="$t('学员状态') + '：'">
                <el-select
                    v-model="listQuery.status"
                    size="mini"
                    @change="handleCheckChange"
                >
                    <el-option
                        :label="$t('全部状态')"
                        value=""
                    />
                    <el-option
                        v-for="item in signingIn.arr"
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
                    <el-option
                        :label="$t('全部来源')"
                        value=""
                    />
                    <el-option
                        v-for="item in signOriginStatus.arr"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="pull-right label__right">
                <search-input
                    v-model="listQuery.name"
                    :placeholder="$t('请输入工号/姓名/用户名/手机')"
                    @enter="search"
                />
            </el-form-item>
            <!--            <el-form-item :label="$t('签到时间') + '：'">-->
            <!--                <el-date-picker-->
            <!--                    v-model="signInTime"-->
            <!--                    type="datetimerange"-->
            <!--                    format="yyyy-MM-dd"-->
            <!--                    value-format="yyyy-MM-dd"-->
            <!--                    range-separator="至"-->
            <!--                    start-placeholder="开始日期"-->
            <!--                    end-placeholder="结束日期"-->
            <!--                    @change="handleCheckChange"-->
            <!--                />-->
            <!--            </el-form-item>-->
        </el-form>
        <section class="opt__line veln__width">
            <el-button type="primary" @click="batchHandle('attendance')">{{ $t('出勤') }}</el-button>
            <el-button @click="batchHandle('absence')">{{ $t('缺勤') }}</el-button>
            <!--<el-button @click="batchHandle('invalid')">{{$t('无效')}}</el-button>-->
            <el-button @click="exportHandle">{{ $t('导出') }}</el-button>
            <div class="sign__stu__desc pull-right">
                {{ userCount.TOTAL + $t('位学员') + '：'
                    + userCount.ATTENDANCE + $t('人出勤') + '；' +
                    userCount.ABSENCE + $t('人缺勤（') + userCount.LEAVE + $t('人请假）') }}
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
            v-if="dialogVisible"
            append-to-body
            :title="dialogTitle"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible"
            width="520px"
            :before-close="handleClose"
            custom-class="label__dialog"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('类型') + '：'" prop="absenceType">
                        <el-radio
                            v-for="item in absenceType.arr"
                            :key="item.code"
                            v-model="editQuery.absenceType"
                            :label="item.code"
                        >{{ item.name }}
                        </el-radio>
                    </el-form-item>
                    <el-form-item :label="$t('原因') + '：'">
                        <el-input
                            v-model.trim="editQuery.reason"
                            type="textarea"
                            :rows="5"
                        />
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="dialogVisible=false">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="onSure">{{ $t('保存') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            v-if="signDetailVisible"
            append-to-body
            :title="$t('签到详情')"
            :modal-append-to-body="false"
            :visible.sync="signDetailVisible"
            width="720px"
            :before-close="signHandleClose"
            custom-class="label__dialog"
        >
            <el-form label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('签到时间') + '：'">
                        {{ signData.signTime ? signData.signTime : '--' }}
                    </el-form-item>
                    <el-form-item :label="$t('地点位置') + '：'">
                        {{ signData.address ? signData.address : '--' }}
                    </el-form-item>
                    <el-form-item v-if="signData.imgUrls && signData.imgUrls.length>0" :label="$t('拍摄照片') + '：'">
                        <div class="user-img-list">
                            <span v-for="(item, index) in signData.imgUrls" :key="index">
                                <img
                                    v-if="item"
                                    class="user__cover"
                                    :src="item"
                                >
                            </span>
                        </div>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="signDetailVisible=false">{{ $t('取消') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </article>
</template>
<script>
    import {SIGN_ORIGIN_ENUM, SIGNING_IN_ENUM, ABSENCE_TYPE_ENUM} from '@/enum';
    import moment from 'moment';
    import {
        getList,
        attendance,
        absence,
        // invalid,
        remark,
        detail,
        getUserCount,
        getSignUserDetail
    } from '@/api/signUser';
    import {formatGetParams} from '@/utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'StudentManage',
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
                    field: 'user.code',
                    text: this.$t('工号'),
                    minWidth: 160
                },
                {
                    field: 'user.name',
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
                                        this.detailhandle(param.row);
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'user.loginName',
                    text: this.$t('用户名'),
                    minWidth: 160
                },
                {
                    field: 'user.mobile',
                    text: this.$t('手机号'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user.mobile ? param.row.user.mobile : '--';
                    }
                },
                {
                    field: 'user.orgName',
                    text: this.$t('部门'),
                    minWidth: 160
                },
                {
                    field: 'user.positionName',
                    text: this.$t('岗位'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.user.positionName ? param.row.user.positionName : '--';
                    }
                },
                {
                    field: 'source',
                    text: this.$t('来源'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.source ? this.signOriginStatus.getName(param.row.source) : '--';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.status ? this.signingIn.getName(param.row.status) : '--';
                    }
                },
                {
                    field: 'signTime',
                    text: this.$t('签到时间'),
                    minWidth: 150,
                    sortable: 'custom',
                    render: (h, param) => {
                        const signTime = param.row.signTime;
                        return signTime
                            ? moment(param.row.signTime).format(
                                'YYYY-MM-DD HH:mm'
                            )
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 200,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const detailBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('查看详情'),
                                type: 'text',
                                icon: 'view'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'signUserInfo',
                                        query: {userId: param.row.userId, signId: this.listQuery.signId}
                                    });
                                }
                            }
                        });
                        const attendanceBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('出勤'),
                                type: 'text',
                                icon: 'attendance'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'attendance');
                                }
                            }
                        });
                        const absenceBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('缺勤'),
                                type: 'text',
                                icon: 'absence'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'absence');
                                }
                            }
                        });
                        // const invalidBtn = h('QguButton', {
                        //     props: {
                        //         toolTip: this.$t('无效'),
                        //         type: 'text',
                        //         icon: 'enable'
                        //     },
                        //     on: {
                        //         click: () => {
                        //             this.opt(param.row, 'invalid');
                        //         }
                        //     }
                        // });
                        const remarkBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('备注'),
                                type: 'text',
                                icon: 'remark'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'remark');
                                }
                            }
                        });
                        optArr.push(detailBtn);
                        switch (param.row.status) {
                            case 'ATTENDANCE':
                            case 'ATTENDANCE_MANUAL':
                                optArr.push(absenceBtn);
                                // optArr.push(invalidBtn);
                                break;
                            case 'ABSENCE':
                            case 'ABSENCE_MANUAL':
                                optArr.push(attendanceBtn);
                                optArr.push(remarkBtn);
                                break;
                            case 'INVALID':
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                signOriginStatus: SIGN_ORIGIN_ENUM,
                signingIn: SIGNING_IN_ENUM,
                absenceType: ABSENCE_TYPE_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    signId: this.id || this.$route.query.id,
                    name: '',
                    status: '',
                    source: '',
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc',
                    startTime: '',
                    endTime: ''
                },
                signInTime: [],
                editQuery: {
                    absenceType: '',
                    reason: ''
                },
                dialogVisible: false,
                dialogTitle: this.$t('备注'),
                rules: {
                    absenceType: [{required: true, message: this.$t('请选择缺勤类型'), trigger: 'change'}]
                },
                userCount: {
                    TOTAL: 0,
                    ATTENDANCE: 0,
                    ABSENCE: 0,
                    LEAVE: 0
                },
                signDetailVisible: false,
                signData: {}
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        watch: {
            id(val) {
                if (val) {
                    this.listQuery.signId = val;
                    this.getList({pageNum: 1});
                    this.getUserCount();
                }
            }
        },
        created() {
            if (this.$route.query.id) {
                this.getList();
                this.getUserCount();
            }
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
                this.getUserCount();
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
            detailhandle(data) {
                this.signData = {};
                this.signDetailVisible = true;
                this.getSignUserDetail(data.userId, this.listQuery.signId);
            },
            signHandleClose() {
                this.signData = {};
                this.signDetailVisible = false;
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.startTime =
                    null !== this.signInTime && this.signInTime.length
                        ? this.signInTime[0]
                        : null;
                params.endTime =
                    null !== this.signInTime && this.signInTime.length
                        ? this.signInTime[1]
                        : null;
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
            add() {
                this.$router.push({name: 'signInEdit'});
            },
            // 按钮操作
            opt(data, type) {
                const params = [];
                if (type === 'attendance') {
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
            // 批量操作
            batchHandle(type) {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                if (type === 'attendance') {
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
                    case 'attendance':
                        attendance({ids: params}).then(re => {
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('操作成功'));
                                this.search();
                            } else {
                                this.$errorMsg(this.$t(result.msg || '操作失败'));
                            }
                        });
                        break;
                    case 'absence':
                        this.editQuery = {
                            absenceType: '',
                            reason: '',
                            ids: params
                        };
                        this.dialogTitle = this.$t('缺勤');
                        this.dialogVisible = true;
                        break;
                    // case 'invalid':
                    //     const data = {
                    //         absenceType: 'OTHER',
                    //         reason: '',
                    //         ids: params
                    //     };
                    //     invalid(data).then(re => {
                    //         const result = re.data;
                    //         if (result.success) {
                    //             this.$successMsg(this.$t('操作成功'));
                    //             this.getList();
                    //         } else {
                    //             this.$errorMsg(this.$t(result.msg || '操作失败'));
                    //         }
                    //     });
                    //     break;
                    case 'remark':
                        this.editQuery = {
                            absenceType: '',
                            reason: '',
                            ids: params,
                            type: 'remark'
                        };
                        this.dialogTitle = this.$t('备注');
                        // 备注信息回显
                        this.getDetail(params[0]);
                        this.dialogVisible = true;
                        break;
                }
            },
            handleClose() {
                this.editQuery = {
                    absenceType: '',
                    reason: '',
                    ids: []
                };
                this.$store.dispatch('setAjaxIng', false);
                this.dialogVisible = false;
            },
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        if (this.editQuery.type === 'remark') {
                            // 备注
                            remark(this.editQuery).then(res => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = res.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('操作成功'));
                                    this.getList();
                                } else {
                                    this.$errorMsg(this.$t(result.msg || '操作失败'));
                                }
                                this.dialogVisible = false;
                                this.search();
                            });
                            return;
                        }
                        // 缺勤
                        absence(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('操作成功'));
                                this.getList();
                            } else {
                                this.$errorMsg(this.$t(result.msg || '操作失败'));
                            }
                            this.dialogVisible = false;
                            this.search();
                        });
                    }
                });
            },
            getDetail(id) {
                const params = {id};
                detail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const {reason, absenceType, id} = result.data;
                        this.editQuery = {
                            reason,
                            absenceType,
                            ids: [id],
                            type: 'remark'
                        };
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            typeTips(type) {
                let typeVal = '';
                switch (type) {
                    case 'attendance':
                    case 'remark':
                        typeVal = 'info';
                        break;
                    case 'absence':
                        typeVal = 'warning';
                        break;
                    case 'invalid':
                        typeVal = 'error';
                        break;
                }
                return typeVal;
            },
            getUserCount() {
                const params = {id: this.listQuery.signId};
                getUserCount(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.userCount = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            exportHandle() {
                const url = `${process.env.BASE_API}/veln-sign/signUser/downloadUser${formatGetParams(this.listQuery)}&_token=${this.token}`;
                window.open(url);
            },
            getSignUserDetail(userId, signId) {
                const params = {userId, signId};
                getSignUserDetail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.signData = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
