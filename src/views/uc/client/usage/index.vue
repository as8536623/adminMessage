<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <section class="opt__line">
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
            @on-sure="handlerAuthSure"
        />
    </article>
</template>

<script>
    import {getCustomerPage} from '@/api/customer';
    import {COMMON_STATUS_ENUM} from '@/enum';
    import {batchInsert} from '@/api/customer/course';
    import ImpowerCourse from '@/components/ImpowerCourse';

    export default {
        name: 'ClientUsage',
        components: {
            ImpowerCourse
        },
        data() {
            const tableColumns = [
                {
                    field: 'code',
                    text: this.$t('编号'),
                    minWidth: 70
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
                                            name: 'clientEdit',
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
                    field: 'contactPerson',
                    text: this.$t('联系人'),
                    minWidth: 70
                },
                {
                    field: 'number',
                    text: this.$t('授权课程数量'),
                    minWidth: 60,
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
                                        this.currentCode = code;
                                        this.isCourseEdit = false;
                                        this.authIds = [id];
                                        this.$refs.selector.show();
                                        this.tableColumns.forEach(item => {
                                            if (item.text === '授权课程数量') {
                                                this.isSqkcsl = false;
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
                    field: 'domain',
                    text: this.$t('cdn域名'),
                    minWidth: 80,
                    align: 'center'
                },
                {
                    field: 'usageDataCount',
                    text: this.$t('已使用流量(截止昨天)'),
                    minWidth: 120,
                    align: 'center',
                    render: (h, param) => {
                        return this.bytesToSize(param.row.usageDataCount);
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
                        const viewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('查看详情'),
                                type: 'text',
                                icon: 'view'
                            },
                            on: {
                                click: () => {
                                    this.viewDetail(param.row);
                                }
                            }
                        });
                        if (status !== 'DRAFT') {
                            optArr.push(viewBtn);
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
                    needDetail: true,
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
                getCustomerPage(params).then(re => {
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
            handlerAuthSure(result) {
                batchInsert(result).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            handleAdd() {
                this.$router.push({
                    name: 'clientEdit'
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
            },
            viewDetail(row) {
                this.$router.push({
                    name: 'usageDetail',
                    query: {
                        id: row.id
                    }
                });
            },
            bytesToSize(bytes) {
                if (bytes === 0) {
                    return '0 B';
                }
                const k = 1024;
                const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
            }
        }
    };
</script>
