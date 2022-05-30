<style lang="scss">
    @import '../style.scss';

    .group__dialog {
        .el-dialog__body {
            padding: 10px;
        }
    }
</style>
<template>
    <article class="app-container face-container">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
            <el-form-item :label="$t('申请状态') + '：'">
                <el-select
                    v-model="listQuery.statusList"
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
                    v-model="listQuery.sourceList"
                    size="mini"
                    @change="handleCheckChange"
                >
                    <el-option :label="$t('全部来源')" value/>
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
                    v-model="listQuery.keywords"
                    :placeholder="$t('请输入工号/姓名/用户名/手机号')"
                    @enter="search"
                />
            </el-form-item>
        </el-form>
        <section class="opt__line veln__width">
            <!--<el-button v-if="this.$route.query.enrollId" @click="addUser" type="primary">{{$t('新增')}}-->
            <!--</el-button>-->
            <el-button v-if="this.$route.query.enrollId" type="primary" @click="batchHandle('pass')">{{ $t('通过') }}
            </el-button>
            <el-button v-if="this.$route.query.enrollId" @click="batchHandle('refuse')">{{ $t('拒绝') }}</el-button>
            <!--<el-button v-if="this.$route.query.enrollId" @click="batchHandle('del')">{{$t('移除')}}</el-button>-->
            <!--<el-button @click="exportHandle">{{$t('导入')}}</el-button>-->
            <!--<el-button @click="exportHandle">{{$t('导出')}}</el-button>-->
            <el-button @click="groupHandle">{{ $t('组群') }}</el-button>
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
                    <el-form-item :label="$t('审核结果') + '：'" prop="enrollResult">
                        <el-radio
                            v-model="editQuery.enrollResult"
                            label="PASS"
                            :disabled="editQuery.disabled"
                        >{{ $t('通过') }}
                        </el-radio>
                        <el-radio
                            v-model="editQuery.enrollResult"
                            label="REFUSED"
                            :disabled="editQuery.disabled"
                        >{{ $t('拒绝') }}
                        </el-radio>
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
            :title="$t(userInfo.enrollResult === 'PASS' ? '通过申请' : '拒绝申请')"
            :modal-append-to-body="false"
            :visible.sync="detailVisible"
            width="520px"
            :before-close="detailHandleClose"
            custom-class="label__dialog"
        >
            <el-form label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('操作人') + '：'">{{ userInfo.updatedBy }}</el-form-item>
                    <el-form-item :label="$t('操作时间') + '：'">{{ userInfo.updatedAt }}</el-form-item>
                    <el-form-item
                        :label="$t(userInfo.enrollResult === 'PASS' ? '通过原因' : '拒绝原因') + '：'"
                    >{{ userInfo.remark ? userInfo.remark : '--' }}
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="detailVisible=false">{{ $t('取消') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            v-if="groupVisible"
            append-to-body
            :title="$t('组群')"
            :modal-append-to-body="false"
            :visible.sync="groupVisible"
            width="600px"
            :before-close="groupHandleClose"
            custom-class="group__dialog"
        >
            <el-tabs v-model="activeName">
                <el-tab-pane :label="$t('一键生成群组')" name="first">
                    <el-form
                        ref="groupQuery"
                        label-width="110px"
                        :model="groupQuery"
                        :rules="rules"
                        :inline-message="true"
                    >
                        <section class="dialog__form__container">
                            <el-form-item :label="$t('群组类别') + '：'" prop="categoryName">
                                <el-input
                                    ref="groupCategoryInput"
                                    v-model.trim="groupQuery.categoryName"
                                    :placeholder="$t('请选择群组类别')"
                                    :max-length="32"
                                    clearable
                                    @focus="showGroupSelect"
                                />
                                <el-button type="text" @click="toNewGroupCategory">新建类别</el-button>
                            </el-form-item>
                            <el-form-item :label="$t('群组名称') + '：'" prop="name">
                                <el-input
                                    v-model.trim="groupQuery.name"
                                    :placeholder="$t('群组名称')"
                                    :max-length="50"
                                />
                            </el-form-item>
                        </section>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$t('加入已有群组')" name="second">
                    <veln-group-name-select ref="groupName" :category="true"/>
                </el-tab-pane>
            </el-tabs>
            <div class="dialog__btn__line">
                <el-button @click="groupVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="groupSave">{{ $t('保存') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="groupDialogVisible"
            append-to-body
            :title="$t('选择群组分类')"
            :visible.sync="groupDialogVisible"
            width="339px"
            @close="groupDlgClose"
        >
            <veln-group-select ref="groupCategory"/>
            <div class="dialog__btn__line">
                <el-button @click="groupDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="groupSelect">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :key="userDialogKey"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                opt-type="USER"
                fun-code="FACE"
                route="faceScope"
                app-code="veln-face"
                :fun-id="listQuery.faceId"
                @onClose="dgpDialogVisible=false;"
            />
        </el-dialog>
    </article>
</template>
<script>
    import {FACE_ORIGIN_ENUM, ENROLL_APPLY_STATUS_ENUM, FACE_USER_TYPE_ENUM} from '@/enum';
    import moment from 'moment';
    import {quickAddGroup} from '@/api/group';
    import VelnGroupSelect from '@/components/VelnGroupSelect';
    import VelnGroupNameSelect from '@/components/VelnGroupNameSelect';
    import VelnDgpUser from '@/components/VelnDgpUser';
    import {
        detail,
        approve,
        remove,
        statistics,
        getEnrollList
    } from '@/api/face/user';

    export default {
        name: 'CourseUserManage',
        components: {
            VelnGroupSelect,
            VelnGroupNameSelect,
            VelnDgpUser
        },
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
                                            name: 'courseUserInfo',
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
                        const enrollTime = param.row.approveTime;
                        return enrollTime
                            ? moment(param.row.approveTime).format(
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
                    field: 'enrollResult',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.enrollResult
                            ? this.applyStatus.getName(param.row.enrollResult)
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
                        // const passBtn = h('QguButton', {
                        //     props: {
                        //         toolTip: this.$t('通过'),
                        //         type: 'text',
                        //         icon: 'pass'
                        //     },
                        //     on: {
                        //         click: () => {
                        //             this.opt(param.row, 'pass');
                        //         }
                        //     }
                        // });
                        // const refuseBtn = h('QguButton', {
                        //     props: {
                        //         toolTip: this.$t('拒绝'),
                        //         type: 'text',
                        //         icon: 'no_pass'
                        //     },
                        //     on: {
                        //         click: () => {
                        //             this.opt(param.row, 'refuse');
                        //         }
                        //     }
                        // });
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
                        switch (param.row.enrollResult) {
                            case 'PENDING':
                                optArr.push(checkBtn);
                                // optArr.push(refuseBtn);
                                // optArr.push(passBtn);
                                break;
                            case 'PASS':
                                optArr.push(detailBtn);
                                break;
                            case 'REFUSED':
                                // optArr.push(delBtn);
                                optArr.push(detailBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                signOriginStatus: FACE_ORIGIN_ENUM,
                applyStatus: ENROLL_APPLY_STATUS_ENUM,
                faceUserTypeStatus: FACE_USER_TYPE_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    faceId: this.id || this.$route.query.id,
                    keywords: '',
                    statusList: '',
                    sourceList: '',
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                editQuery: {
                    faceId: this.id || this.$route.query.id,
                    enrollResult: 'PASS',
                    remark: '',
                    idList: []
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
                groupVisible: false,
                activeName: 'first',
                groupQuery: {
                    categoryId: '',
                    categoryName: '',
                    name: '',
                    userList: []
                },
                groupDialogVisible: false, // 群组类别
                rules: {
                    categoryName: [
                        {
                            required: true,
                            message: this.$t('请选择群组'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入群组名称'),
                            trigger: 'blur'
                        }
                    ]
                },
                dgpDialogVisible: false,
                userDialogKey: null
            };
        },
        watch: {
            id(val) {
                if (val) {
                    this.listQuery.enrollId = val;
                    this.getList({pageNum: 1});
                    this.getStatistics();
                }
            }
        },
        created() {
            if (this.$route.query.id) {
                this.getList();
                this.getStatistics();
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
                params.statusList = this.listQuery.statusList ? [this.listQuery.statusList] : [];
                params.sourceList = this.listQuery.sourceList ? [this.listQuery.sourceList] : [];
                this.listLoading = true;
                getEnrollList(params).then(re => {
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
                statistics({faceId: this.listQuery.faceId}).then(res => {
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
                            enrollResult: 'PASS',
                            remark: '',
                            idList: params,
                            faceId: this.id || this.$route.query.id
                        };
                        break;
                    case 'del':
                        this.editQuery = {
                            enrollResult: 'PASS',
                            remark: '',
                            idList: params,
                            disabled: true,
                            faceId: this.id || this.$route.query.id
                        };
                        this.remove(this.editQuery);
                        break;
                    case 'pass':
                        this.checkVisible = true;
                        this.recordList = [];
                        this.editQuery = {
                            enrollResult: 'PASS',
                            remark: '',
                            idList: params,
                            disabled: true,
                            faceId: this.id || this.$route.query.id
                        };
                        break;
                    case 'refuse':
                        this.checkVisible = true;
                        this.recordList = [];
                        this.editQuery = {
                            enrollResult: 'REFUSED',
                            remark: '',
                            idList: params,
                            disabled: true,
                            faceId: this.id || this.$route.query.id
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
                    enrollResult: 'PASS',
                    remark: '',
                    idList: []
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
            exportHandle() {
            },
            // 组群
            groupHandle() {
                this.groupQuery = {
                    categoryId: '',
                    categoryName: '',
                    name: '',
                    userList: []
                };
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                for (let i = 0; i < selectedData.length; i++) {
                    selectedIds.push(selectedData[i].userId);
                }
                this.groupQuery.userList = selectedIds;
                this.groupVisible = true;
            },
            groupHandleClose() {
                this.groupQuery = {
                    categoryId: '',
                    categoryName: '',
                    name: '',
                    userList: []
                };
                this.groupVisible = false;
            },
            // 群组类别
            showGroupSelect() {
                this.groupDialogVisible = true;
                this.$refs.groupCategoryInput.blur();
            },
            toNewGroupCategory() {
                this.$router.push({name: `groupCategory`});
            },
            // 群组类别选择
            groupSelect() {
                const $groupCategory = this.$refs.groupCategory;
                const result = $groupCategory.getActive();
                this.groupQuery.categoryId = result.id;
                this.groupQuery.categoryName = result.name;
                this.groupDialogVisible = false;
                this.$refs.groupQuery.validateField('categoryName');
            },
            groupDlgClose() {
                this.$refs.groupQuery.validateField('categoryName');
            },
            //  组群保存
            groupSave() {
                if (this.activeName === 'second') {
                    const $groupName = this.$refs.groupName;
                    const result = $groupName.getActive();
                    if (result.category) {
                        this.$warnMsg(this.$t('不能选择群组类别'));
                        return;
                    }
                    this.groupQuery.categoryId = result.pid;
                    this.groupQuery.categoryName = result.parentName;
                    this.groupQuery.name = result.name;
                    this.groupQuery.id = result.id;
                }
                this.$refs.groupQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        quickAddGroup(this.groupQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('组群成功'));
                            } else {
                                this.$errorMsg(this.$t(result.msg || '组群失败'));
                            }
                            this.groupVisible = false;
                        });
                    }
                });
            },
            // 新增学员
            addUser() {
                this.dgpDialogVisible = true;
            },
            handleUserClose() {
                this.dgpDialogVisible = false;
                this.userDialogKey = +new Date();
            }
        }
    };
</script>
