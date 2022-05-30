<style lang="scss" src="../style.scss">
</style>
<template>
    <article>
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width face-container">
            <el-form-item :label="$t('申请状态') + '：'">
                <el-checkbox-group v-model="listQuery.statusList" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in CHECK_RESULT_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >{{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
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
            <el-button @click="batchHandle('refused')">{{ $t('未通过') }}</el-button>
            <el-button @click="batchHandle('excellent')">{{ $t('设为优秀学员') }}</el-button>
            <!--<el-button @click="exportHandle">{{$t('导出')}}</el-button>-->
            <div class="sign__stu__desc pull-right">
                {{ $t('当前考核通过条件') + '：' }}
                <template v-for="(item,index) in editQuery.assessConditionList">
                    <span
                        v-if="item.enable"
                        :key="index"
                    >
                        {{ SET_CHECK_CONDITION.getName(item.type) }}{{ item.passNum }}{{ $t('次') }}{{ $t('（共') }}
                        {{ $t(item.totalNum) }}{{ $t('次）；') }}
                    </span>
                </template>
                <el-button type="text" @click="setPassCondition">{{ $t('设置考核通过条件') }}</el-button>
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
            :title="$t('设置')"
            :modal-append-to-body="false"
            :visible.sync="checkVisible"
            width="520px"
            :before-close="handleClose"
            custom-class="set__dialog"
        >
            <el-form ref="editQuery" :model="editQuery" :inline="true" class="demo-form-inline">
                <section class="dialog__form__container">
                    <el-form-item
                        v-for="(item,index) in editQuery.assessConditionList"
                        :key="index"
                        :prop="'assessConditionList.' + index + '.passNum'"
                        :rules="[{
                            required: true, message: '不能为空', trigger: 'blur'
                        },{
                            type: 'number', message: $t('必须为数字值')
                        }]"
                    >
                        <el-checkbox
                            v-model="item.enable"
                        >{{ SET_CHECK_CONDITION.getName(item.type) }}
                        </el-checkbox>
                        <div class="face__set">
                            <el-input v-model.number="item.passNum" type="text"/>
                            <span>/{{ item.totalNum ? item.totalNum : 0 }}</span>
                        </div>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="checkVisible=false">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            v-if="reviewVisible"
            append-to-body
            :title="$t('历史回顾')"
            :modal-append-to-body="false"
            :visible.sync="reviewVisible"
            width="650px"
            :before-close="reviewClose"
            custom-class="review__dialog"
        >
            <historical-review v-if="reviewVisible" :list="reviewList"/>
        </el-dialog>
    </article>
</template>
<script>
    import {CHECK_RESULT_ENUM, SET_CHECK_CONDITION} from '@/enum';
    import {excellent, getList, pass, refused} from '@/api/face/user';
    import {getAssessCondition, insert} from '@/api/face/assess';
    import {retrospect} from '@/api/activity';
    import HistoricalReview from './components/HistoricalReview';

    export default {
        name: 'Summary',
        components: {
            HistoricalReview
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
                                            name: 'checkUserDetail',
                                            query: {id: param.row.id}
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
                    text: this.$t('手机号码'),
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
                    field: 'num',
                    text: this.$t('总能量石'),
                    sortable: 'custom',
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.num ? param.row.num : '0';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.status
                            ? this.CHECK_RESULT_ENUM.getName(param.row.status)
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
                        const passBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('通过'),
                                type: 'text',
                                icon: 'pass'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'pass');
                                }
                            }
                        });
                        const noPassBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('未通过'),
                                type: 'text',
                                icon: 'no_pass'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'refused');
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
                        switch (param.row.status) {
                            case 'PASS':
                            case 'MANUAL_PASS':
                                optArr.push(noPassBtn);
                                break;
                            case 'REFUSED':
                            case 'MANUAL_REFUSED':
                                optArr.push(passBtn);
                                break;
                        }
                        optArr.push(detailBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                CHECK_RESULT_ENUM,
                SET_CHECK_CONDITION,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    faceId: this.$route.query.relId,
                    keywords: '',
                    statusList: [
                        'PASS',
                        'MANUAL_PASS',
                        'REFUSED',
                        'MANUAL_REFUSED'
                    ],
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                checkVisible: false,
                editQuery: {
                    relId: this.$route.query.relId,
                    assessConditionList: []
                },
                reviewVisible: false,
                reviewList: []
            };
        },
        created() {
            this.getList();
            this.getAssessCondition();
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
            opt(data, type) {
                const params = [];
                this.$confirm(this.$t('确认操作该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: this.typeTips(type)
                }).then(() => {
                    params.push(data.id);
                    this.optHandle(params, type);
                });
            },
            batchHandle(type) {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
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
            },
            optHandle(params, type) {
                switch (type) {
                    case 'pass':
                        this.pass(params);
                        break;
                    case 'excellent':
                        this.excellent(params);
                        break;
                    case 'refused':
                        this.refused(params);
                        break;
                }
            },
            pass(params) {
                pass(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('通过成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '通过失败'));
                    }
                });
            },
            excellent(params) {
                excellent(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('设置优秀学员成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(
                            this.$t(result.msg || '设置优秀学员通过失败')
                        );
                    }
                });
            },
            refused(params) {
                refused(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('未通过成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '未通过失败'));
                    }
                });
            },
            typeTips(type) {
                let typeVal = '';
                switch (type) {
                    case 'pass':
                    case 'excellent':
                        typeVal = 'info';
                        break;
                    case 'refused':
                        typeVal = 'warning';
                        break;
                }
                return typeVal;
            },
            exportHandle() {
            },
            // 设置考核条件
            setPassCondition() {
                this.editQuery.assessConditionList = [];
                this.getAssessCondition();
                this.checkVisible = true;
            },
            getAssessCondition() {
                const params = {relId: this.$route.query.relId};
                getAssessCondition(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.assessConditionList = result.data
                            ? result.data
                            : [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            handleClose() {
                this.checkVisible = false;
            },
            save() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        insert(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                            this.checkVisible = false;
                        });
                    }
                });
            },
            // 详情--历史回顾
            detailOpt(row) {
                this.retrospect(row);
            },
            retrospect(row) {
                const params = {
                    faceCourseId: this.$route.query.relId,
                    userId: row.userId
                };
                retrospect(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.reviewList = result.data ? result.data : [];
                        if (this.reviewList.length) {
                            this.reviewVisible = true;
                        } else {
                            this.$warnMsg(this.$t('暂无历史回顾信息'));
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            reviewClose() {
                this.reviewVisible = false;
            }
        }
    };
</script>
