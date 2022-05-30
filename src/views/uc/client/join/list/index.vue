<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <section class="opt__line">
            <el-button type="primary" @click="handleAdd">{{ $t('新增') }}</el-button>
            <!--<el-button @click="batchOpt('auth')">{{ $t('授权课程') }}</el-button>-->
            <search-input
                v-model="listQuery.keywords"
                class="pull-right"
                width="320px"
                :placeholder="$t('请输入编号/企业名称')"
                @enter="search"
            />
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
        <impower-course
            ref="selector"
            :is-sqkcsl="isSqkcsl"
            :selected-ids="courseIds"
            :auth-ids="authIds"
            :is-edit="isCourseEdit"
            :code="currentCode"
        />
    </article>
</template>

<script>
    import {disableJoinCourse, pageJoinCourse, enableJoinCourse,batchInsertRel} from '@/api/course';
    import {COMMON_STATUS_ENUM} from '@/enum';
    import ImpowerCourse from '@/components/ImpowerCourse';

    export default {
        name: 'NewsList',
        components: {
            ImpowerCourse
        },
        data() {
            const tableColumns = [
                {
                    field: 'code',
                    text: this.$t('编号'),
                    minWidth: 140
                },
                {
                    field: 'name',
                    text: this.$t('名称'),
                    minWidth: 140,
                    render: (h, param) => {
                        const {name, id} = param.row;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'joinEdit',
                                            query: {
                                                id,
                                                readonly: true
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
                    field: 'number',
                    text: this.$t('授权课程数量'),
                    minWidth: 90,
                    align: 'center',
                    render: (h, param) => {
                        const {count, id, code} = param.row;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'joinRelList',
                                            query: {
                                                id
                                            }
                                        });
                                    }
                                }
                            },
                            count || 0
                        );
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 80,
                    align: 'center',
                    render: (h, param) => {
                        const {status} = param.row;
                        const optArr = [];
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'joinEdit',
                                        query: {id: param.row.id}
                                    });
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
                                    this.enable(param.row.id);
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
                                    this.disable(param.row.id);
                                }
                            }
                        });
                        const viewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('查看秘钥'),
                                type: 'text',
                                icon: 'view'
                            },
                            on: {
                                click: () => {
                                    this.view(param.row);
                                }
                            }
                        });
                        if (status === 'DRAFT') {
                            optArr.push(editBtn);
                            optArr.push(startBtn);
                        }
                        if (status === 'ENABLED') {
                            optArr.push(disableBtn);
                            optArr.push(viewBtn);
                        }
                        if (status === 'DISABLED') {
                            optArr.push(editBtn);
                            optArr.push(startBtn);
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
                    pageNum: 1,
                    pageSize: 20
                },
                courseIds: [],
                multiSelection: [],
                authIds: [],
                isCourseEdit: true,
                currentCode: null, // 下载文档的编号
                isSqkcsl: true
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                pageJoinCourse(params).then(re => {
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

                if (!(Array.isArray(ids) && ids.length)) {
                    this.$errorMsg(this.$t('请选择需要操作的数据'));
                    return;
                }

                switch (type) {
                    case 'auth':
                        this.auth(ids);
                        break;
                }
            },
            auth(ids) {
                this.authIds = ids;
                this.isCourseEdit = true;
                this.$refs.selector.show();
            },
            enable(id) {
                // todo ajax
                enableJoinCourse(id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            disable(id) {
                this.$confirm(this.$t('确定停用这家客户么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    // todo ajax
                    disableJoinCourse(id).then(re => {
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
            handleAdd() {
                this.$router.push({
                    name: 'joinEdit'
                });
            },
            view(item) {
                const h = this.$createElement;
                this.$alert(
                    h('div', {attrs: {'class': 'app-key-content'}}, [
                        h('div', null, `appKey: ${item.appKey}`),
                        h('div', null, `appSecret: ${item.appSecret}`)
                    ]), '查看秘钥', {
                        confirmButtonText: '确定'
                    });
            }
        }
    };
</script>
