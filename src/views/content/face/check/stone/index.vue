<style lang="scss" src="../style.scss">
</style>
<template>
    <article>
        <el-form ref="listQuery" :model="listQuery" :inline="true" class="stone-container veln__width " :rules="rules">
            <el-form-item :label="$t('能量石区间') + '：'" class="stone-block">
                <el-form-item prop="min" class="stone-form-item">
                    <el-input v-model.number="listQuery.min"/>
                </el-form-item>
                <span style="margin-right: 10px;">—</span>
                <el-form-item prop="max" class="stone-form-item">
                    <el-input v-model.number="listQuery.max"/>
                </el-form-item>
                <el-button type="primary" @click="search">{{ $t('筛选') }}</el-button>
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
            <el-button type="primary" @click="batchHandle('ADD')">{{ $t('增加能量石') }}</el-button>
            <el-button @click="batchHandle('REDUCE')">{{ $t('减少能量石') }}</el-button>
            <!-- <el-button @click="exportHandle">{{$t('导出')}}</el-button>-->
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
            v-if="stoneVisible"
            append-to-body
            :title="$t('增加/减少')"
            :modal-append-to-body="false"
            :visible.sync="stoneVisible"
            width="620px"
            :before-close="handleClose"
            custom-class="stone__dialog"
        >
            <el-form
                ref="editQuery"
                :model="editQuery"
                label-width="100px"
                :rules="rules"
                :inline-message="true"
            >
                <section class="dialog__form__container">
                    <el-form-item :label="$t('增加/减少') + '：'" prop="num" :rules="rules.required">
                        <el-input v-model.number="editQuery.num" type="text"/>
                        {{ $t('能量石') }}
                    </el-form-item>
                    <el-form-item :label="$t('操作理由') + '：'" prop="way">
                        <el-select v-model="editQuery.way" :placeholder="$t('请选择')">
                            <el-option
                                v-for="(item, index) in optTypeList"
                                :key="index"
                                :label="item.optType"
                                :value="item.way"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="editQuery.way === 'MANUAL'" :label="$t('')">
                        <el-input v-model.trim="editQuery.remark" type="textarea" :rows="4"/>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="stoneVisible=false">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </article>
</template>
<script>
    import {
        getList,
        insert,
        listAll
    } from '@/api/face/stone';
    import {validateInteger} from '@/utils/validate';
    export default {
        name: 'Stone',
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
                                        this.$router.push({name: 'stoneUserDetail', query: {userId: param.row.userId}});
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
                        return param.row.positionName ? param.row.positionName : '--';
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
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 100,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const addBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('增加能量石'),
                                type: 'text',
                                icon: 'course_add'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'ADD');
                                }
                            }
                        });
                        const reduceBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('减少能量石'),
                                type: 'text',
                                icon: 'minus'
                            },
                            on: {
                                click: () => {
                                    this.opt(param.row, 'REDUCE');
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
                                    this.$router.push({
                                        name: 'stoneDetail', query: {
                                            userId: param.row.userId,
                                            relId: this.$route.query.relId
                                        }
                                    });
                                }
                            }
                        });
                        optArr.push(addBtn);
                        optArr.push(reduceBtn);
                        optArr.push(detailBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            const validateMin = (rule, value, callback) => {
                if (
                    value &&
                    this.listQuery.max &&
                    value >= this.listQuery.max
                ) {
                    callback(new Error(this.$t('区间范围不正确')));
                } else {
                    callback();
                }
            };
            const validateMax = (rule, value, callback) => {
                if (
                    value &&
                    this.listQuery.min &&
                    value <= this.listQuery.min
                ) {
                    callback(new Error(this.$t('区间范围不正确')));
                } else {
                    callback();
                }
            };
            return {
                validateInteger,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    relId: this.$route.query.relId,
                    keywords: '',
                    min: '',
                    max: '',
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                editQuery: {
                    relId: this.$route.query.relId,
                    way: '',
                    num: '',
                    remark: '',
                    userList: [],
                    type: 'ADD'
                },
                stoneVisible: false,
                optTypeList: [],
                rules: {
                    numberVal: [
                        {validator: validateInteger, trigger: 'blur'}
                    ],
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ],
                    num: [
                        {type: 'number', message: this.$t('必须为数字值')},
                        {validator: validateInteger, trigger: 'blur'}
                    ],
                    way: [
                        {required: true, message: this.$t('请选择操作路由'), trigger: 'change'}
                    ],
                    min: [
                        {validator: validateInteger, trigger: 'blur'},
                        {validator: validateMin, trigger: 'blur'}
                    ],
                    max: [
                        {validator: validateInteger, trigger: 'blur'},
                        {validator: validateMax, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
            this.getList();
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
                this.$refs.listQuery.validate(valid => {
                    if (valid) {
                        this.getList({
                            pageNum: 1
                        });
                    }
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
                params.push(data.userId);
                this.optHandle(params, type);
            },
            batchHandle(type) {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                for (let i = 0; i < selectedData.length; i++) {
                    selectedIds.push(selectedData[i].userId);
                }
                this.optHandle(selectedIds, type);
            },
            optHandle(params, type) {
                this.listAll();
                this.editQuery = {
                    way: '',
                    num: '',
                    remark: '',
                    userList: [],
                    type: '',
                    relId: this.$route.query.relId
                };
                this.editQuery.type = type;
                this.editQuery.userList = params;
                this.stoneVisible = true;
            },
            listAll() {
                listAll().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.optTypeList = result.data ? result.data : [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            exportHandle() {

            },
            handleClose() {
                this.editQuery = {
                    way: '',
                    num: '',
                    remark: '',
                    userList: [],
                    type: '',
                    relId: this.$route.query.relId
                };
                this.stoneVisible = false;
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
                                this.$successMsg(this.$t('操作成功'));
                                this.getList();
                                this.stoneVisible = false;
                            } else {
                                this.$errorMsg(this.$t(result.msg || '操作失败'));
                            }
                        });
                    }
                });
            }
        }
    };
</script>
