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
                        v-for="item in SURVEY_USER_TYPE_ENUM.arr"
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
            <el-button type="primary" @click="batchHandle">{{ $t('提醒参加') }}</el-button>
            <el-button @click="exportHandle">{{ $t('导出') }}</el-button>
            <div
                class="sign__stu__desc pull-right"
            >{{ `${userCount.PARTICIPATE_OUTER}${$t('位外部人员')}+${userCount.APPOINT}${$t('位指定学员')}（${userCount.UN_SUBMITTED}${$t('人未提交')}，${userCount.SUBMITTED}${$t('人已提交')}）` }}</div>
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
    </article>
</template>
<script>
    import {SIGN_ORIGIN_ENUM, SURVEY_USER_TYPE_ENUM} from '@/enum';
    import {formatGetParams} from '@/utils';
    import {surveyUserPage, getUserCount} from '@/api/survey/surveyUser';
    import {mapGetters} from 'vuex';

    export default {
        name: 'SurveyUser',
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
                                        this.$router.push({
                                            name: 'userinfo',
                                            query: {
                                                id: param.row.id
                                            }
                                        });
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
                            ? this.SURVEY_USER_TYPE_ENUM.getName(param.row.status)
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 120,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const row = param.row;
                        const detailBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('查看详情'),
                                type: 'text',
                                icon: 'view'
                            },
                            on: {
                                click: () => {}
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
                                    this.remindToComplete([row.id]);
                                }
                            }
                        });
                        switch (row.status) {
                            case 'NOT_SUBMIT':
                                optArr.push(remindBtn);
                                break;
                            case 'SUBMIT':
                                optArr.push(detailBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                signOriginStatus: SIGN_ORIGIN_ENUM,
                SURVEY_USER_TYPE_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    qtnId: this.id || this.$route.query.id,
                    name: '',
                    status: '',
                    source: '',
                    pageNum: 1,
                    pageSize: 20
                },
                userCount: {
                    PARTICIPATE_OUTER: 0,
                    APPOINT: 0,
                    SUBMITTED: 0,
                    UN_SUBMITTED: 0
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
                    this.getList();
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
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                surveyUserPage(params).then(re => {
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
            // 批量操作
            batchHandle() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                for (let i = 0; i < selectedData.length; i++) {
                    selectedIds.push(selectedData[i].id);
                }
                this.remindToComplete(selectedIds);
            },
            // 导出
            exportHandle() {
                const url = `${
                    process.env.BASE_API
                }/veln-qnt/surveyUser/downloadUser${formatGetParams(
                    this.listQuery
                )}&_token=${this.token}`;
                window.open(url);
            },
            // 获取用户统计信息
            getUserCount() {
                getUserCount(this.listQuery.qtnId).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.userCount = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            // 提醒参加
            remindToComplete(ids) {
            // TODO 提醒参加接口
            // remindToComplete(ids).then(res => {
            //     const result = res.data;
            //     if (result.success) {
            //         this.$successMsg(this.$t('操作成功'));
            //         this.getList();
            //     } else {
            //         this.$errorMsg(this.$t(result.msg || '操作失败'));
            //     }
            // });
            }
        }
    };
</script>
