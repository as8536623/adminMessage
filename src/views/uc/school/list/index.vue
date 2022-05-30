<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding">
        <section class="opt__line veln__width">
            <el-form :model="listQuery" :inline="true" label-width="100px" class="demo-form-inline veln__width">
                <el-form-item :label="$t('学校类型') + '：'">
                    <el-select v-model="listQuery.type" class="small" :placeholder="$t('学校类型')" @change="search">
                        <el-option label="全部" value=""/>
                        <el-option
                            v-for="item in SCHOOL_TYPE_ENUM.getAllValues()"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('截止日期') + '：'">
                    <el-date-picker
                        v-model="period"
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
                <el-form-item :label="$t('省市区') + '：'">
                    <el-cascader
                        v-model="provinceCode"
                        class="middle"
                        :options="regionData"
                        @change="search"
                    />
                </el-form-item>
                <el-form-item>
                    <search-input
                        v-model="listQuery.keyword"
                        :placeholder="$t('请输入姓名/编号')"
                        @enter="search"
                    />
                </el-form-item>
            </el-form>
        </section>
        <section class="opt__line">
            <router-link
                v-if="checkPermission('k12-addOrg')"
                to="/uc/school/edit"
                class="el__button__link"
            >
                <el-button type="primary">{{ $t('新增') }}</el-button>
            </router-link>
            <!-- <el-button-->
            <!--    @click="preBatch('ENABLED')"-->
            <!-- >{{ $t('启用') }}-->
            <!-- </el-button>-->
            <!-- <el-button-->
            <!--    @click="preBatch('DISABLED')"-->
            <!-- >{{ $t('停用') }}-->
            <!-- </el-button>-->
            <!--<el-button-->
            <!--    @click="preBatch('DELETE')"-->
            <!--    >{{ $t('删除') }}-->
            <!--</el-button>-->
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
    import moment from 'moment';
    import {KNOWLEDGE_STATUS_ENUM, SCHOOL_TYPE_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';
    import {mapGetters} from 'vuex';
    import {deleteOrg, disable, enable, search} from '@/api/school';
    import {CodeToText, regionData} from 'element-china-area-data';

    const SCHOOL_TYPE_ARR = ['佳一直营学校', '全日制学校', '佳一合作学校', '其他'];

    export default {
        name: 'SchoolList',
        data() {
            const tableColumns = [
                {
                    field: 'name',
                    minWidth: 170,
                    text: this.$t('名称'),
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
                                            name: 'SchoolEdit',
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
                    field: 'type',
                    minWidth: 160,
                    align: 'center',
                    text: this.$t('类型'),
                    render: (h, param) => {
                        return SCHOOL_TYPE_ARR[param.row.type];
                    }
                },
                {
                    field: 'province',
                    minWidth: 100,
                    align: 'center',
                    text: this.$t('所在地区'),
                    render: (h, param) => {
                        return CodeToText[param.row.province];
                    }
                },
                {
                    field: 'masterName',
                    minWidth: 100,
                    align: 'center',
                    text: this.$t('校长'),
                    render: (h, param) => {
                        const master = param.row.master;
                        return master ? master.name : '--';
                    }
                },
                {
                    field: 'mobile',
                    minWidth: 120,
                    align: 'center',
                    text: this.$t('联系方式'),
                    render: (h, param) => {
                        const master = param.row.master;
                        return master ? master.mobile || '--' : '--';
                    }
                },
                {
                    field: 'endAt',
                    minWidth: 100,
                    align: 'center',
                    text: this.$t('截止日期')
                },
                {
                    field: 'status',
                    minWidth: 50,
                    text: this.$t('状态'),
                    render: (h, param) => {
                        return KNOWLEDGE_STATUS_ENUM.getName(param.row.status);
                    }
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    minWidth: 140,
                    text: this.$t('操作'),
                    render: (h, param) => {
                        const optArr = [];
                        const status = param.row.status;
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.del([param.row.id]);
                                }
                            }
                        });
                        const enableBtn = h('QguButton', {
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
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'SchoolEdit',
                                        query: {
                                            id: param.row.id
                                        }
                                    });
                                }
                            }
                        });

                        // 启用按钮 -- 草稿、停用、审核失败
                        // 停用按钮 -- 启用时
                        // 编辑按钮 -- 草稿、停用、审核失败
                        // 删除按钮 -- 草稿、审核失败
                        if (
                            status === 'DRAFT' ||
                            status === 'APPROVE_FAIL' ||
                            status === 'DISABLED'
                        ) {
                            if (this.checkPermission('k12-addOrg')) {
                                optArr.push(enableBtn);
                            }
                            optArr.push(enableBtn);
                        }
                        if (status === 'ENABLED') {
                            if (this.checkPermission('k12-addOrg')) {
                                optArr.push(disableBtn);
                            }
                        }
                        if (status !== 'ENABLED' && status !== 'APPROVING') {
                            if (this.checkPermission('k12-addOrg')) {
                                optArr.push(editBtn);
                            }
                        }
                        if (status === 'DRAFT' || status === 'DISABLED') {
                            if (this.checkPermission('k12-delOrg')) {
                                optArr.push(deleteBtn);
                            }
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                SCHOOL_TYPE_ENUM,
                tableColumns,
                regionData,
                list: [],
                total: 0,
                time: [],
                period: [],
                provinceCode: null,
                listQuery: {
                    type: '',
                    startAt: '',
                    endAt: '',
                    myself: false,
                    keyword: '',
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        created() {
            this.search();
        },
        methods: {
            checkPermission,
            // 搜索分页
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            // 获取分页列表
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                const provinceCode = this.provinceCode;
                const period = this.period;
                if (Array.isArray(provinceCode) && provinceCode.length) {
                    params.province = provinceCode.pop();
                }
                if (Array.isArray(period) && period.length) {
                    params.startAt = moment(period[0]).format('YYYY-MM-DD');
                    params.endAt = moment(period[1]).format('YYYY-MM-DD');
                }
                this.listLoading = true;
                search(params).then(re => {
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
            // 复选
            selectionChange(v) {
                this.selectedData = v;
            },
            // 每页条数变化
            handleSizeChange(v) {
                this.getList({
                    pageSize: v,
                    pageNum: 1
                });
            },
            // 页码变化
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v
                });
            },
            // 停用
            disable(id) {
                this.$confirm(this.$t('确认停用该校区么?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    disable({id}).then(re => {
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
            enable(id) {
                // TODO 修改启用接口
                enable({id}).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            // 删除
            del(ids) {
                this.$confirm(this.$t('此操作将永久删除该校区, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    // TODO 修改删除接口
                    deleteOrg({orgId: ids[0]}).then(re => {
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
                    case 'ENABLED':
                        this.enable(selectedIds);
                        break;
                    case 'DISABLED':
                        this.disable(selectedIds);
                        break;
                    case 'DELETE':
                        this.del(selectedIds);
                        break;
                }
            }
        }
    };
</script>
