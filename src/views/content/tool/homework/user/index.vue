<style lang="scss" scoped>
    @import '../../style.scss';

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
                <el-select v-model="listQuery.status" size="mini" @change="handleCheckChange">
                    <el-option :label="$t('全部状态')" value/>
                    <el-option
                        v-for="item in HOMEWORK_USER_TYPE_ENUM.arr"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('来源') + '：'">
                <el-select v-model="listQuery.source" size="mini" @change="handleCheckChange">
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
                    v-model="listQuery.name"
                    :placeholder="$t('请输入工号/姓名/用户名/手机')"
                    @enter="search"
                />
            </el-form-item>
        </el-form>
        <section class="opt__line veln__width">
            <el-button type="primary" @click="batchHandle('MANUAL_PASS')">{{ $t('通过') }}</el-button>
            <el-button @click="batchHandle('MANUAL_NO_PASS')">{{ $t('未通过') }}</el-button>
            <!--<el-button @click="batchHandle('score')" type="primary" v-if="!id">{{$t('评分')}}</el-button>-->
            <!--<el-button @click="batchHandle('absence')" v-if="!id">{{$t('提醒参加')}}</el-button>-->
            <el-button @click="exportHandle">{{ $t('导出') }}</el-button>
            <!--<div-->
            <!--class="sign__stu__desc pull-right"-->
            <!--&gt;-->
            <!--{{`${userCount.total}${$t('位学员')}：${userCount.notSubmit}${$t('人未提交')}，${userCount.notJudged}${$t('人未评分')}，${userCount-->
            <!--.pass}${$t('人未通过')}，${userCount.noPass}${$t('人已通过')}`}}-->
            <!--</div>-->
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
            :title="$t('评分')"
            :visible.sync="dialogVisible"
            width="420px"
            append-to-body
            @close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" label-width="80px">
                <section class="dialog__form__container">
                    <el-form-item
                        :label="$t('分数')"
                        prop="score"
                        :rules="[rules.required, rules.score]"
                    >
                        <el-input v-model="editQuery.score" maxlength="3"/>
                    </el-form-item>
                    <el-form-item
                        v-if="editQuery.type==='SINGLE'"
                        :label="$t('评语')"
                        prop="remark"
                        :rules="[rules.required]"
                    >
                        <el-input v-model="editQuery.remark" type="textarea" maxlength="200"/>
                    </el-form-item>
                    <el-form-item label prop="remark">
                        <el-button type="primary" @click="onSure">{{ $t('确定') }}</el-button>
                        <el-button @click="dialogVisible=false;">{{ $t('取消') }}</el-button>
                    </el-form-item>
                </section>
            </el-form>
        </el-dialog>
    </article>
</template>
<script>
    /**
     * TODO
     * 1. 提醒参加/批量提醒参加
     * 2. 导出
     * 3. 查看作业详情
     * 4. 带时间筛选
     */
    import {SIGN_ORIGIN_ENUM, HOMEWORK_USER_TYPE_ENUM} from '@/enum';
    import {statistics} from '@/api/workInfoUser';
    import {validateUpNumber} from '@/utils/validate';
    import {formatGetParams} from '@/utils';
    import {getWorkUserPage, gradeAndRemark, toGrade, toJudge, remindToComplete} from '@/api/workInfoUser';
    import {mapGetters} from 'vuex';

    export default {
        name: 'StudentManage',
        props: {
            id: {
                type: String,
                default: ''
            },
            relId: {
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
                                        this.$router.push({name: 'homeworkUserInfo', query: {userId: param.row.id}});
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
                        return param.row.user.positionName
                            ? param.row.user.positionName
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
                    field: 'status',
                    text: this.$t('作业状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.status
                            ? this.HOMEWORK_USER_TYPE_ENUM.getName(param.row.status)
                            : '--';
                    }
                },
                {
                    field: 'score',
                    text: this.$t('得分'),
                    minWidth: 100,
                    sortable: 'custom'
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 120,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const row = param.row;
                        const passBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('通过'),
                                type: 'text',
                                icon: 'pass'
                            },
                            on: {
                                click: () => {
                                    this.opt(row, 'pass');
                                }
                            }
                        });
                        const refusedBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('未通过'),
                                type: 'text',
                                icon: 'no_pass'
                            },
                            on: {
                                click: () => {
                                    this.opt(row, 'refuse');
                                }
                            }
                        });
                        // const viewBtn = h('QguButton', {
                        //     props: {
                        //         toolTip: this.$t('查看'),
                        //         type: 'text',
                        //         icon: 'el-icon-view'
                        //     },
                        //     on: {
                        //         click: () => {
                        //         }
                        //     }
                        // });
                        const scoreBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('评分'),
                                type: 'text',
                                icon: 'score'
                            },
                            on: {
                                click: () => {
                                    this.score(param.row);
                                }
                            }
                        });
                        const modifyBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('改分'),
                                type: 'text',
                                icon: 'score_e'
                            },
                            on: {
                                click: () => {
                                    this.score(param.row);
                                }
                            }
                        });
                        const remindBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('提醒参加'),
                                type: 'text',
                                icon: 'el-icon-bell'
                            },
                            on: {
                                click: () => {
                                    this.opt(row, 'remind');
                                }
                            }
                        });
                        switch (row.status) {
                            case 'NOT_SUBMIT':
                                optArr.push(remindBtn);
                                break;
                            case 'NOT_JUDGED':
                                // optArr.push(viewBtn);
                                optArr.push(scoreBtn);
                                break;
                            case 'JUDGED':
                                optArr.push(modifyBtn);
                                break;
                            case 'NO_PASS':
                            case 'MANUAL_REFUSED':
                                optArr.push(passBtn);
                                optArr.push(modifyBtn);
                                // optArr.push(viewBtn);
                                break;
                            case 'PASS':
                            case 'MANUAL_PASS':
                                optArr.push(refusedBtn);
                                optArr.push(modifyBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                signOriginStatus: SIGN_ORIGIN_ENUM,
                HOMEWORK_USER_TYPE_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    workId: this.id || this.$route.query.id,
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
                userCount: {
                    total: 0,
                    notSubmit: 0,
                    notJudged: 0,
                    pass: 0,
                    noPass: 0
                },
                dialogVisible: false,
                editQuery: {
                    id: '',
                    type: 'SINGLE',
                    score: '',
                    remark: ''
                },
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
                        trigger: 'blur'
                    },
                    score: {validator: validateUpNumber, trigger: ['blur']}
                }
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        watch: {
            id(val) {
                if (val) {
                    this.listQuery.workId = val;
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
            init() {
                this.getList();
                this.getUserCount();
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
                params.startTime =
                    null !== this.signInTime && this.signInTime.length
                        ? this.signInTime[0]
                        : null;
                params.endTime =
                    null !== this.signInTime && this.signInTime.length
                        ? this.signInTime[1]
                        : null;
                this.listLoading = true;
                getWorkUserPage(params).then(re => {
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
                for (let i = 0; i < selectedData.length; i++) {
                    selectedIds.push(selectedData[i].id);
                }
                switch (type) {
                    case 'score':
                        this.batchScore(selectedIds);
                        break;
                    case 'MANUAL_PASS':
                        this.toJudge(selectedIds, 'PASS');
                        break;
                    case 'MANUAL_NO_PASS':
                        this.toJudge(selectedIds, 'NO_PASS');
                        break;
                }
            },
            exportHandle() {
                const url = `${process.env.BASE_API}/veln-work/user/exportSelect${formatGetParams(this.listQuery)}&_token=${this.token}`;
                window.open(url);
            },
            optHandle(params, type) {
                switch (type) {
                    case 'score':
                        this.batchScore(params);
                        break;
                    case 'pass':
                        this.toJudge(params, 'MANUAL_PASS');
                        break;
                    case 'refuse':
                        this.toJudge(params, 'MANUAL_NO_PASS');
                        break;
                    case 'remind':
                        this.remindToComplete(params);
                        break;
                }
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
                const params = {id: this.listQuery.workId};
                statistics(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.userCount = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            handleClose() {
                this.editQuery = {
                    id: '',
                    type: '',
                    score: '',
                    remark: ''
                };
            },
            // 批量评分
            batchScore(ids) {
                if (!ids.length) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.editQuery = {
                    id: ids,
                    type: 'MULTI',
                    score: '',
                    remark: ''
                };
                this.dialogVisible = true;
            },
            showEdit(item) {
                this.editQuery = {
                    id: item.id,
                    type: 'SINGLE',
                    score: item.score || '',
                    remark: item.remark || ''
                };
                this.dialogVisible = true;
            },
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    const params = Object.assign({}, this.editQuery);
                    params.score = Number(params.score);
                    if (params.type === 'SINGLE') {
                        gradeAndRemark(params).then(re => {
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.init();
                                this.dialogVisible = false;
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                        return;
                    }
                    params.idList = params.id;
                    toGrade(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('保存成功'));
                            this.init();
                            this.dialogVisible = false;
                        } else {
                            this.$errorMsg(this.$t(result.msg || '保存失败'));
                        }
                    });
                });
            },
            // 通过--未通过
            toJudge(ids, type) {
                toJudge(ids, type).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            // 提醒参加
            remindToComplete(ids) {
                remindToComplete(ids).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            // 评分、改分
            score(row) {
                let from = '';
                if (this.id) {
                    from = 'face';
                }
                this.$router.push({name: 'homeworkScore', query: {id: row.id, workId: this.listQuery.workId, from,
                                                                  relId: this.relId}});
            }
        }
    };
</script>
