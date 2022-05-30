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
            @on-sure="handlerAuthSure"
        />

        <el-dialog
            v-if="dgpDialogVisible"
            append-to-body
            :title="$t('关联用户')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-customer-user
                route="clientListRel"
                fun-code="clientListRel"
                :customer-id="customerId"
                :fun-id="listQuery.roleIds"
                @onClose="handleUserClose"
            />
        </el-dialog>
    </article>
</template>

<script>
    import {disable, enable, getCustomerPage, startCharging, chargingStandard} from '@/api/customer';
    import {COMMON_STATUS_ENUM} from '@/enum';
    import ImpowerCourse from '@/components/ImpowerCourse';
    import VelnCustomerUser from '@/components/VelnCustomerUser';
    import {batchInsert} from '@/api/customer/course';

    export default {
        name: 'ClientList',
        components: {
            ImpowerCourse,
            VelnCustomerUser
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
                    minWidth: 60
                },
                {
                    field: 'contactMobile',
                    text: this.$t('联系电话'),
                    minWidth: 90,
                    align: 'center'
                },
                /* {
                    field: 'chargeType',
                    text: this.$t('计费状态'),
                    minWidth: 90,
                    align: 'center',
                    hasFilter: true,
                    hidden: true,
                    filter: [
                        {
                            text: '已开启', value: 1
                        },
                        {
                            text: '未开启', value: 0
                        }
                    ],
                    filterMultiple: false
                },*/
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
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 80,
                    align: 'center',
                    render: (h, param) => {
                        const {status} = param.row;
                        const userCode = this.$store.getters.userCode;
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
                                        name: 'clientEdit',
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
                        const authBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('授权课程'),
                                type: 'text',
                                icon: 'course'
                            },
                            on: {
                                click: () => {
                                    this.auth([param.row.id]);
                                    this.isSqkcsl = true;
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
                        /* const startChargingBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('启用收费'),
                                type: 'text',
                                icon: 'startCharging'
                            },
                            on: {
                                click: () => {
                                    this.startCharging(param.row.id, 1);
                                }
                            }
                        });
                        const closeChargingBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('关闭收费'),
                                type: 'text',
                                icon: 'stopCharging'
                            },
                            on: {
                                click: () => {
                                    this.startCharging(param.row.id, 0);
                                }
                            }
                        });
                        const setChargingBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('收费标准'),
                                type: 'text',
                                icon: 'chargingStandard'
                            },
                            on: {
                                click: () => {
                                    this.chargingStandard(param.row.id);
                                }
                            }
                        });*/
                        const userAssociation = h('QguButton', {
                            props: {
                                toolTip: this.$t('关联用户'),
                                type: 'text',
                                icon: 'userAssociation'
                            },
                            on: {
                                click: () => {
                                    this.userAssociation(param.row.id);
                                }
                            }
                        });
                        if (status === 'DRAFT') {
                            optArr.push(editBtn);
                            optArr.push(startBtn);
                        }
                        if (status === 'ENABLED') {
                            optArr.push(authBtn);
                            optArr.push(disableBtn);
                            optArr.push(viewBtn);
                        }
                        if (status === 'DISABLED') {
                            optArr.push(editBtn);
                            optArr.push(startBtn);
                        }
                        if (userCode === 'admin') {
                            /* if (param.row.chargeType === 0 || param.row.chargeType === undefined) {
                                optArr.push(startChargingBtn);
                            } else if (param.row.chargeType === 1) {
                                optArr.push(closeChargingBtn);
                            }
                            optArr.push(setChargingBtn);*/
                            optArr.push(userAssociation);
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
                isSqkcsl: true,
                dgpDialogVisible: false,
                customerId: ''
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
            disable(id) {
                this.$confirm(this.$t('确定停用这家客户么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    // todo ajax
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
            startCharging(customerId, chargeType) {
                const charteConetnt = chargeType === 1 ? '启用收费后，若客户账户余额不足，无法正常观看视频，且启用看课锁定功能，确定操作吗？' : '关闭收费后，账户余额不再扣除，使用记录扣除皆为0元，确定操作吗？';
                const chargeTitle = chargeType === 1 ? '启用收费' : '关闭收费';
                this.$confirm(this.$t(charteConetnt), chargeTitle, {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消')
                }).then(() => {
                    // startCharging ajax
                    startCharging({customerId, chargeType}).then(res => {
                        const result = res.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.getList({pageNum: 1});
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: `已取消${chargeTitle}`
                    });
                });
            },
            chargingStandard(customerId) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '修改基础收费标准',
                    message: h('p', null, [
                        h('span', null, '基础收费标准:'),
                        h('input', {
                            class: 'standardInput',
                            style: 'display: inline-block'
                        }),
                        h('span', null, '元/课时')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(action => {
                    const oldChargeLevel = document.getElementsByClassName('standardInput')[0].value;
                    const regex = /^[+-]?((\d*(\.\d{1,})$)|(\d{1,4}$))/;
                    const chargeLevel = oldChargeLevel.match(regex)[0];
                    if (chargeLevel) {
                        chargingStandard({customerId, chargeLevel}).then(res => {
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('操作成功'));
                                this.getList({pageNum: 1});
                            } else {
                                this.$errorMsg(this.$t(result.msg || '操作失败'));
                            }
                            document.getElementsByClassName('standardInput')[0].value = '';
                        });
                    }
                });
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
            userAssociation(customerId) {
                this.customerId = customerId;
                this.dgpDialogVisible = true;
            },
            handleUserClose() {
                this.getList({pageNum: 1});
                this.dgpDialogVisible = false;
            }
        }
    };
</script>
