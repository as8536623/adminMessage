<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <section class="veln__query__line">
            <el-form :model="listQuery" :inline="true" class="demo-form-inline unrequired__form">
                <el-form-item :label="$t('创建时间') + '：'">
                    <el-date-picker
                        v-model="time"
                        type="daterange"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="search"
                    />
                </el-form-item>
                <search-input
                    v-model="listQuery.keywords"
                    class="pull-right"
                    :placeholder="$t('请输入新闻名称')"
                    @enter="search"
                />
            </el-form>
        </section>
        <section class="opt__line">
            <router-link to="/content/tool/news/edit" class="opt__link">
                <el-button type="primary">{{ $t('新增') }}</el-button>
            </router-link>
            <el-button @click="batchOpt('enable')">{{ $t('启用') }}</el-button>
            <el-button @click="batchOpt('disable')">{{ $t('停用') }}</el-button>
            <el-button @click="batchOpt('delete')">{{ $t('删除') }}</el-button>
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
    import {newsPage, enableNews, disableNews, deleteNews} from '@/api/info/info';
    import {COMMON_STATUS_ENUM} from '@/enum';
    import moment from 'moment';
    export default {
        name: 'NewsList',
        data() {
            const tableColumns = [
                {type: 'checkbox'},
                {
                    field: 'name',
                    text: this.$t('标题'),
                    minWidth: 140,
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
                                            name: 'newsDetail',
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
                    field: 'introduction',
                    text: this.$t('摘要'),
                    minWidth: 300,
                    render: (h, param) => {
                        const {introduction} = param.row;
                        return h(
                            'div',
                            {
                                attrs: {
                                    class: 'news__introduction'
                                }
                            },
                            introduction || '--'
                        );
                    }
                },
                {
                    field: 'viewCount',
                    text: this.$t('浏览量'),
                    minWidth: 80,
                    align: 'center'
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 80,
                    align: 'center',
                    render: (h, param) => {
                        const {status} = param.row;
                        return COMMON_STATUS_ENUM.getName(status);
                    }
                },
                {field: 'author', text: this.$t('创建人'), minWidth: 110},
                {
                    field: 'createdAt',
                    text: this.$t('创建时间'),
                    minWidth: 130,
                    render: (h, param) => {
                        const createdAt = param.row.createdAt;
                        return createdAt
                            ? moment(createdAt).format('YYYY-MM-DD HH:mm')
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 100,
                    render: (h, param) => {
                        const optArr = [];
                        const {id, status} = param.row;
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'newsEdit',
                                        query: {id: param.row.id}
                                    });
                                }
                            }
                        });
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'delete'
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
                        if (status === 'DRAFT' || status === 'DISABLED') {
                            optArr.push(editBtn);
                            optArr.push(startBtn);
                            optArr.push(deleteBtn);
                        }
                        if (status === 'ENABLED') {
                            optArr.push(disableBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                COMMON_STATUS_ENUM,
                tableColumns,
                total: 0,
                list: [],
                listLoading: false,
                time: [],
                listQuery: {
                    keywords: '',
                    startTime: '',
                    endTime: '',
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
                params.startTime =
                    null !== this.time && this.time.length
                        ? moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                params.endTime =
                    null !== this.time && this.time.length
                        ? moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                this.listLoading = true;
                newsPage(params).then(re => {
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
            batchOpt(type) {
                const ids = [];
                this.multiSelection.map(item => {
                    ids.push(item.id);
                });

                switch (type) {
                    case 'delete':
                        this.del(ids);
                        break;
                    case 'enable':
                        this.enable(ids);
                        break;
                    case 'disable':
                        this.disable(ids);
                        break;
                }
            },
            del(ids) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    deleteNews(ids).then(re => {
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
            enable(ids) {
                enableNews(ids).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            disable(ids) {
                this.$confirm(this.$t('确定停用这些资讯么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    disableNews(ids).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.getList({pageNum: 1});
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            }
        }
    };
</script>
