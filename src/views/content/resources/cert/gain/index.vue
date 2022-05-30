<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container container__padding cert__gain">
        <section class="cert__gain__header">
            <el-form :model="listQuery" :inline="true" class="demo-form-inline unrequired__form">
                <el-form-item :label="$t('证书序列号')">
                    <el-input v-model="listQuery.serialNum" :placeholder="$t('证书序列号')"/>
                </el-form-item>
                <el-form-item :label="$t('状态') + '：'">
                    <el-checkbox-group v-model="listQuery.statusList">
                        <el-checkbox
                            v-for="(item, index) in CERT_STATUS_ENUM.arr"
                            :key="index"
                            :label="item.code"
                        >{{ $t(item.name) }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-button type="primary" @click="formItemChange">{{ $t('筛选') }}</el-button>
                <search-input
                    v-model="listQuery.keyword"
                    class="pull-right"
                    :placeholder="$t('请输入工号/姓名/用户名/手机')"
                    @enter="formItemChange"
                />
            </el-form>
            <section class="opt__line veln__width">
                <el-button type="primary" @click="batchRenewal">{{ $t('续期') }}</el-button>
                <el-button @click="batchDel">{{ $t('作废') }}</el-button>
                <el-button @click="downloadAll">{{ $t('导出全部') }}</el-button>
                <el-button @click="downloadSelect">{{ $t('导出选中') }}</el-button>
                <el-button @click="downloadPdf">{{ $t('下载证书') }}</el-button>
                <el-button @click="preview">{{ $t('打印证书') }}</el-button>
                <el-button @click="refresh">{{ $t('重新生成证书') }}</el-button>
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
        </section>
        <el-dialog
            :title="$t('评分')"
            :visible.sync="dialogVisible"
            width="412px"
            append-to-body
            @close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" label-width="80px">
                <section class="dialog__form__container">
                    <el-form-item
                        class="cert__duration__edit"
                        :label="$t('续期时间')"
                        prop="duration"
                        :rules="[rules.required, rules.upNumber]"
                    >
                        <el-input v-model="editQuery.duration" maxlength="3"/>
                        <span class="cert__append">{{ $t('月') }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('续期原因')" prop="reason" :rules="[rules.required]">
                        <el-input v-model="editQuery.reason" type="textarea" maxlength="200"/>
                    </el-form-item>
                    <el-form-item label>
                        <el-button type="primary" @click="onSure">{{ $t('确定') }}</el-button>
                        <el-button @click="dialogVisible=false;">{{ $t('取消') }}</el-button>
                    </el-form-item>
                </section>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('预览')" :visible.sync="previewDlgVisible" width="776px" append-to-body>
            <img :src="previewUrl" width="776" height="550" alt="preview">
        </el-dialog>
        <el-dialog :title="$t('打印')" :visible.sync="printDlgVisible" width="1020px" append-to-body>
            <cert-print :list="printList"/>
        </el-dialog>
        <el-dialog :title="$t('证书操作记录')" :visible.sync="logDlgVisible" width="600px" append-to-body>
            <section class="log__wrapper">
                <qgu-table
                    :loading="false"
                    :columns="logColumns"
                    :data="logList"
                    :have-pagination="false"
                />
                <div class="text--center btn__line">
                    <el-button type="primary" @click="logDlgVisible=false;">{{ $t('关闭') }}</el-button>
                </div>
            </section>
        </el-dialog>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {
        CERT_STATUS_ENUM,
        CERT_ORIGIN_ENUM,
        CERT_LOG_TYPE_ENUM
    } from '@/enum';
    import {
        certUserRelPage,
        certUserRelDelete,
        certUserRelRenewal,
        certUserRelRefresh,
        certUserRelGetImg
    } from '@/api/cert/certUserRel';
    import {certLogAll} from '@/api/cert/certLog';
    import {validateUpNumber} from '@/utils/validate';
    import {formatGetParams} from '@/utils';
    import moment from 'moment';
    import CertPrint from '@/components/CertPrint';
    export default {
        name: 'CertGain',
        components: {
            CertPrint
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'user.name',
                    text: this.$t('姓名'),
                    minWidth: 120
                },
                {
                    field: 'user.loginName',
                    text: this.$t('用户名'),
                    minWidth: 120
                },
                {
                    field: 'user.code',
                    text: this.$t('工号'),
                    minWidth: 120
                },
                {
                    field: 'user.mobile',
                    text: this.$t('手机号'),
                    minWidth: 110
                },
                {
                    field: 'user.orgName',
                    text: this.$t('部门'),
                    minWidth: 140
                },
                {
                    field: 'user.positionName',
                    text: this.$t('岗位'),
                    minWidth: 100
                },
                {
                    field: 'serialNum',
                    text: this.$t('证书序列号'),
                    minWidth: 150
                },
                {
                    field: 'sourceType',
                    text: this.$t('证书来源'),
                    minWidth: 80,
                    render: (h, param) => {
                        return CERT_ORIGIN_ENUM.getName(param.row.sourceType);
                    }
                },
                {
                    field: 'issueTime',
                    text: this.$t('发证时间'),
                    minWidth: 140,
                    render: (h, param) => {
                        const issueTime = param.row.issueTime;
                        return issueTime
                            ? moment(issueTime).format('YYYY-MM-DD HH:mm')
                            : '--';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('当前状态'),
                    minWidth: 80,
                    render: (h, param) => {
                        return CERT_STATUS_ENUM.getName(param.row.status);
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 170,
                    render: (h, param) => {
                        const optArr = [];
                        const row = param.row;
                        const previewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('预览'),
                                type: 'text',
                                icon: 'el-icon-view'
                            },
                            on: {
                                click: () => {
                                    this.preview([row.id]);
                                }
                            }
                        });
                        const downloadBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('下载'),
                                type: 'text',
                                icon: 'el-icon-download'
                            },
                            on: {
                                click: () => {
                                    this.downloadPdf([row.id]);
                                }
                            }
                        });
                        const renewalBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('续期'),
                                type: 'text',
                                icon: 'el-icon-date'
                            },
                            on: {
                                click: () => {
                                    this.showEdit(row.id);
                                }
                            }
                        });
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('作废'),
                                type: 'text',
                                icon: 'el-icon-delete'
                            },
                            on: {
                                click: () => {
                                    this.del([row.id]);
                                }
                            }
                        });
                        const recordBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('证书记录'),
                                type: 'text',
                                icon: 'el-icon-tickets'
                            },
                            on: {
                                click: () => {
                                    this.log(row.id);
                                }
                            }
                        });

                        optArr.push(previewBtn);
                        optArr.push(downloadBtn);
                        optArr.push(renewalBtn);
                        optArr.push(deleteBtn);
                        optArr.push(recordBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            const logColumns = [
                {
                    field: 'logType',
                    text: this.$t('操作'),
                    width: 80,
                    render: (h, param) => {
                        return CERT_LOG_TYPE_ENUM.getName(param.row.logType);
                    }
                },
                {
                    field: 'createdAt',
                    text: this.$t('操作时间'),
                    width: 160
                },
                {
                    field: 'reason',
                    text: this.$t('备注')
                }
            ];
            return {
                tableColumns,
                logColumns,
                CERT_STATUS_ENUM,
                list: [],
                total: 0,
                listLoading: false,
                multiSelection: [],
                listQuery: {
                    certId: '',
                    keyword: '',
                    serialNum: '', // 证书序列号
                    statusList: ['VALID', 'CANCEL', 'EXPIRE'],
                    pageNum: 1,
                    pageSize: 20
                },
                dialogVisible: false,
                editQuery: {
                    ids: [],
                    duration: '',
                    reason: ''
                },
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
                        trigger: 'blur'
                    },
                    upNumber: {validator: validateUpNumber, trigger: ['blur']}
                },
                previewUrl: '',
                previewDlgVisible: false,
                printDlgVisible: false,
                printList: [],
                logDlgVisible: false,
                logList: []
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        mounted() {
            if (this.$route.query.id) {
                this.listQuery.certId = this.$route.query.id;
                this.getList();
            }
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.statusList = params.statusList.length
                    ? params.statusList.join(',')
                    : '';
                this.listLoading = true;
                certUserRelPage(params).then(re => {
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
            formItemChange() {
                this.getList({
                    pageNum: 1
                });
            },
            selectionChange(v) {
                this.multiSelection = v;
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
            del(ids) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    certUserRelDelete(ids).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            batchDel() {
                const multiSelection = this.multiSelection;
                if (!multiSelection || multiSelection.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const selectedIds = [];
                for (let i = 0; i < multiSelection.length; i++) {
                    selectedIds.push(multiSelection[i].id);
                }
                this.del(selectedIds);
            },
            handleClose() {
                this.editQuery = {
                    ids: [],
                    type: '',
                    duration: '',
                    reason: ''
                };
            },
            // 批量评分
            batchRenewal() {
                const multiSelection = this.multiSelection;
                if (!multiSelection || multiSelection.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const ids = [];
                for (let i = 0; i < multiSelection.length; i++) {
                    ids.push(multiSelection[i].id);
                }
                this.editQuery = {
                    ids,
                    duration: '',
                    reason: ''
                };
                this.dialogVisible = true;
            },
            showEdit(id) {
                this.editQuery = {
                    ids: [id],
                    duration: '',
                    reason: ''
                };
                this.dialogVisible = true;
            },
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    const params = Object.assign({}, this.editQuery);
                    certUserRelRenewal(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('续期成功'));
                            this.getList({pageNum: 1});
                            this.dialogVisible = false;
                        } else {
                            this.$errorMsg(this.$t(result.msg || '保存失败'));
                        }
                    });
                });
            },
            // 导出全部
            downloadAll() {
                const url = `${
                    process.env.CERT_API
                }/certUserRel/downloadCertUser${formatGetParams(
                    this.listQuery
                )}&_token=${this.token}`;
                window.open(url);
            },
            getMultiIds() {
                const multiSelection = this.multiSelection;
                if (!multiSelection || multiSelection.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const ids = [];
                for (let i = 0; i < multiSelection.length; i++) {
                    ids.push(multiSelection[i].id);
                }
                return ids;
            },
            // 导出选中
            downloadSelect() {
                const ids = this.getMultiIds();
                if (!ids.length) {
                    return;
                }
                const params = {ids};
                const url = `${
                    process.env.CERT_API
                }/certUserRel/downloadCertUser${formatGetParams(params)}&certId=${
                    this.listQuery.certId
                }&_token=${this.token}`;
                window.open(url);
            },
            // 下载pdf
            downloadPdf(idList) {
                const ids = Array.isArray(idList) ? idList : this.getMultiIds();
                if (!ids.length) {
                    return;
                }
                const params = {ids};
                const url = `${
                    process.env.CERT_API
                }/certUserRel/downloadPdf${formatGetParams(params)}&certId=${
                    this.listQuery.certId
                }&_token=${this.token}`;
                window.open(url);
            },
            preview(idList) {
                const ids = Array.isArray(idList) ? idList : this.getMultiIds();
                if (!ids.length) {
                    return;
                }
                certUserRelGetImg(ids).then(re => {
                    const result = re.data;
                    if (result.success) {
                        if (Array.isArray(idList)) {
                            this.previewUrl = result.data[0];
                            this.previewDlgVisible = true;
                        } else {
                            this.printList = result.data;
                            this.printDlgVisible = true;
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '生成图片失败'));
                    }
                });
            },
            refresh() {
                const ids = this.getMultiIds();
                if (!ids.length) {
                    return;
                }
                certUserRelRefresh(ids).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('刷新成功'));
                    } else {
                        this.$errorMsg(this.$t(result.msg || '刷新失败'));
                    }
                });
            },
            log(id) {
                certLogAll(id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.logList = result.data;
                        this.logDlgVisible = true;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取日志失败'));
                    }
                });
            }
        }
    };
</script>
