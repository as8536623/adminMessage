<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding">
        <section class="veln__query__line">
            <el-form
                :model="listQuery"
                :inline="true"
                class="demo-form-inline veln__width unrequired__form"
            >
                <el-form-item :label="$t('状态') + '：'">
                    <el-checkbox-group v-model="listQuery.statusList" @change="search">
                        <el-checkbox
                            v-for="(item,index) in ACTIVITY_STATUS_ENUM.arr"
                            :key="index"
                            :label="item.code"
                        >{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('有效时间') + '：'">
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
                        :placeholder="$t('请输入项目名称/编号')"
                        @enter="search"
                    />
                </el-form-item>
            </el-form>
        </section>
        <section class="opt__line">
            <router-link to="/content/tool/survey/edit/base" class="el__button__link">
                <el-button type="primary">{{ $t('新增') }}</el-button>
            </router-link>
            <el-button @click="preBatch('DELETE')">{{ $t('删除') }}</el-button>
            <el-checkbox
                v-model="listQuery.selfCreated"
                class="pull-right"
                @change="search"
            >{{ $t('只看我创建的') }}</el-checkbox>
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
    </article>
</template>

<script>
/**
 * TODO
 * 1. 启用、停用、删除需要是批量方法
 * 2. 列表时间筛选报错
 */
    import moment from 'moment';
    import {
        surveyPage,
        surveyDisable,
        surveyEnable,
        surveyDelete
    } from '@/api/survey/surveyInfo';
    import {ACTIVITY_STATUS_ENUM} from '@/enum';

    export default {
        name: 'SurveyList',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    text: this.$t('编号'),
                    field: 'code',
                    minWidth: 140
                },
                {
                    text: this.$t('项目名称'),
                    field: 'name',
                    minWidth: 110,
                    render: (h, param) => {
                        const {id, name} = param.row;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'surveyDetail',
                                            query: {id}
                                        });
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    text: this.$t('有效时间'),
                    field: 'startAt',
                    sortable: 'custom',
                    minWidth: 260,
                    render: (h, param) => {
                        const {startAt, endAt} = param.row;
                        return `${moment(startAt).format(
                            'YYYY-MM-DD HH:mm'
                        )}~${moment(endAt).format('YYYY-MM-DD HH:mm')}`;
                    }
                },
                {
                    text: this.$t('已收集份数'),
                    field: 'submitCount',
                    minWidth: 100
                },
                {
                    text: this.$t('创建人'),
                    field: 'createdName',
                    minWidth: 100
                },
                {
                    text: this.$t('状态'),
                    field: 'status',
                    minWidth: 80,
                    render: (h, param) => {
                        const {status} = param.row;
                        return ACTIVITY_STATUS_ENUM.getName(status);
                    }
                },
                {
                    text: this.$t('操作'),
                    field: 'opt',
                    minWidth: 180,
                    render: (h, param) => {
                        const optArr = [];
                        const {id} = param.row;
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'surveyEdit',
                                        query: {id}
                                    });
                                }
                            }
                        });
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.del([id]);
                                }
                            }
                        });
                        const startBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('启用'),
                                type: 'text',
                                icon: 'enable'
                            },
                            on: {
                                click: () => {
                                    this.enable(id);
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
                                    this.disable(id);
                                }
                            }
                        });
                        const qrCodeBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('二维码'),
                                type: 'text',
                                icon: 'qrcode'
                            },
                            on: {
                                click: () => {
                                    this.qrCode(id);
                                }
                            }
                        });
                        const studentBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('学员'),
                                type: 'text',
                                icon: 'user_sign'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'surveyUser',
                                        query: {id}
                                    });
                                }
                            }
                        });
                        const staticticstBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('数据统计'),
                                type: 'text',
                                icon: 'statistics'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'surveyStatistics',
                                        query: {id}
                                    });
                                }
                            }
                        });
                        switch (param.row.status) {
                            case 'DRAFT':
                                optArr.push(editBtn);
                                optArr.push(deleteBtn);
                                optArr.push(startBtn);
                                break;
                            case 'NOT_STARTED':
                                optArr.push(qrCodeBtn);
                                optArr.push(deleteBtn);
                                optArr.push(disableBtn);
                                break;
                            case 'PROGRESSING':
                                optArr.push(qrCodeBtn);
                                optArr.push(disableBtn);
                                optArr.push(studentBtn);
                                optArr.push(staticticstBtn);
                                break;
                            case 'FINISHED':
                                optArr.push(qrCodeBtn);
                                optArr.push(studentBtn);
                                optArr.push(staticticstBtn);
                                break;
                            case 'DISABLED':
                                optArr.push(editBtn);
                                optArr.push(deleteBtn);
                                optArr.push(startBtn);
                                optArr.push(qrCodeBtn);
                                optArr.push(studentBtn);
                                optArr.push(staticticstBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                ACTIVITY_STATUS_ENUM,
                tableColumns,
                total: 0,
                list: [],
                listLoading: false,
                time: [],
                listQuery: {
                    name: '',
                    sort: 'desc',
                    statusList: [
                        'DRAFT',
                        'NOT_STARTED',
                        'PROGRESSING',
                        'FINISHED',
                        'DISABLED'
                    ],
                    startAt: '',
                    endAt: '',
                    selfCreated: false,
                    pageNum: 1,
                    pageSize: 20
                }
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                if (this.time.length) {
                    params.startAt = `${this.time[0]} 00:00:00`;
                    params.endAt = `${this.time[1]} 23:59:59`;
                }
                this.listLoading = true;
                surveyPage(params).then(re => {
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
                this.multiSelection = v;
            },
            search() {
                this.getList({pageNum: 1});
            },
            handleSizeChange(v) {
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
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
                this.$confirm(this.$t('确认停用该问卷么?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    surveyDisable(ids).then(re => {
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
                surveyEnable(ids).then(re => {
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
                    surveyDelete(ids).then(re => {
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
                const multiSelection = this.multiSelection;
                if (!multiSelection || multiSelection.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                for (let i = 0; i < multiSelection.length; i++) {
                    selectedIds.push(multiSelection[i].id);
                }

                switch (type) {
                    case 'DELETE':
                        this.del(selectedIds);
                        break;
                }
            },
            // 二维码
            qrCode(id) {}
        }
    };
</script>
