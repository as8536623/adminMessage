<style lang="scss" scoped>
@import '../style.scss';
</style>
<template>
    <article class="app-container tool-container">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
            <el-form-item :label="$t('项目状态') + '：'">
                <el-checkbox-group v-model="listQuery.statusList" @change="handleCheckChange">
                    <el-checkbox
                        v-for="(item, index) in projectStatus.arr"
                        :key="index"
                        :label="item.code"
                    >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item class="pull-right">
                <search-input
                    v-model="listQuery.keywords"
                    :placeholder="$t('项目名称/编号')"
                    @enter="search"
                />
            </el-form-item>
            <el-form-item :label="$t('报名时间') + '：'" class="pull-right">
                <el-date-picker
                    v-model="signUpTime"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleCheckChange"
                />
            </el-form-item>
        </el-form>
        <section class="opt__line">
            <el-button
                v-if="checkPermission('addEnroll')"
                type="primary"
                @click="add()"
            >{{ $t('新增') }}</el-button>
            <el-button v-if="checkPermission('delEnroll')" @click="batchDel()">{{ $t('删除') }}</el-button>
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
            v-if="qrCodeVisible"
            append-to-body
            :title="$t('二维码')"
            :modal-append-to-body="false"
            :visible.sync="qrCodeVisible"
            width="440px"
            :before-close="handleClose"
            custom-class="qrCode__dialog"
        >
            <section class="qrCode__dlg__wrapper">
                <div class="qrCode__content">
                    <div id="qrCode" class="qrCode"/>
                </div>
                <div class="address">
                    <el-input v-model="qrcode" class="input-with-select" readonly>
                        <span
                            slot="append"
                            class="copy__btn"
                            :data-clipboard-text="qrcode"
                            @click="copyQrCode"
                        >{{ $t('复制') }}</span>
                    </el-input>
                    <a :href="downloadQrcodeUrl" :download="downloadQrcodeUrl">
                        <el-button type="primary">{{ $t('下载二维码') }}</el-button>
                    </a>
                </div>
            </section>
        </el-dialog>
    </article>
</template>
<script>
    import {PROJECT_STATUS_ENUM} from '@/enum';
    import QRCode from 'qrcodejs2';
    import moment from 'moment';
    import Clipboard from 'clipboard';
    import {mapGetters} from 'vuex';
    import {getShortLink} from '@/api/short';
    import {
        deleteSignUp,
        disableSignUp,
        enableSignUp,
        getList
    } from '@/api/signUp';
    import checkPermission from '@/utils/permission';
    import {getToPagePreUrl} from '@/utils/config';

    export default {
        name: 'SignUp',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    enabled: () => {
                        return (
                            this.checkPermission('addEnroll') ||
                            this.checkPermission('delEnroll')
                        );
                    }
                },
                {
                    field: 'code',
                    text: this.$t('编号'),
                    minWidth: 160
                },
                {
                    field: 'name',
                    text: this.$t('项目名称'),
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
                                            name: 'signUpDetail',
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
                    field: 'createdAt',
                    text: this.$t('报名时间'),
                    minWidth: 260,
                    sortable: 'custom',
                    render: (h, param) => {
                        const startTime = param.row.startTime;
                        const endTime = param.row.endTime;
                        const time = startTime
                            ? moment(startTime).format('YYYY-MM-DD HH:mm')
                            : '--';
                        const time2 = endTime
                            ? moment(endTime).format('YYYY-MM-DD HH:mm')
                            : '--';
                        return time + '~' + time2;
                    }
                },
                {
                    field: 'totalCount',
                    text: this.$t('总人数'),
                    minWidth: 80,
                    align: 'center',
                    render: (h, param) => {
                        return param.row.totalCount ? param.row.totalCount : '0';
                    }
                },
                {
                    field: 'limitNumber',
                    text: this.$t('名额限制'),
                    minWidth: 100,
                    align: 'center',
                    render: (h, param) => {
                        return param.row.limitNumber ? param.row.limitNumber : '0';
                    }
                },
                {
                    field: 'userName',
                    text: this.$t('创建人'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.userName ? param.row.userName : '--';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.status
                            ? this.projectStatus.getName(param.row.status)
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 130,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.del(param.row);
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
                                    this.edit(param.row);
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
                                    this.start(param.row);
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
                                    this.disable(param.row);
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
                                    this.qrCode(param.row);
                                }
                            }
                        });
                        const nameListBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('名单'),
                                type: 'text',
                                icon: 'roster'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'signUpList',
                                        query: {id: param.row.id}
                                    });
                                }
                            }
                        });
                        switch (param.row.status) {
                            case 'DRAFT':
                                if (this.checkPermission('addEnroll')) {
                                    optArr.push(editBtn);
                                    optArr.push(startBtn);
                                }
                                if (this.checkPermission('delEnroll')) {
                                    optArr.push(deleteBtn);
                                }
                                break;
                            case 'NOT_STARTED':
                                optArr.push(qrCodeBtn);
                                // if (this.checkPermission('addEnroll')) {
                                //     optArr.push(editBtn);
                                // }
                                if (this.checkPermission('delEnroll')) {
                                    optArr.push(disableBtn);
                                }
                                break;
                            case 'PROGRESSING':
                                optArr.push(qrCodeBtn);
                                if (this.checkPermission('delEnroll')) {
                                    optArr.push(disableBtn);
                                }
                                optArr.push(nameListBtn);
                                break;
                            case 'FINISHED':
                                optArr.push(qrCodeBtn);
                                optArr.push(nameListBtn);
                                break;
                            case 'DISABLED':
                                if (this.checkPermission('addEnroll')) {
                                    optArr.push(editBtn);
                                    optArr.push(startBtn);
                                }
                                optArr.push(qrCodeBtn);
                                optArr.push(nameListBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                projectStatus: PROJECT_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    nameCodeKey: '',
                    statusList: [
                        'DRAFT',
                        'NOT_STARTED',
                        'PROGRESSING',
                        'FINISHED',
                        'DISABLED'
                    ],
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'asc',
                    startTime: '',
                    endTime: ''
                },
                signUpTime: [],
                qrCodeVisible: false,
                qrcode: '',
                downloadQrcodeUrl: ''
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        created() {
            this.getList();
        },
        methods: {
            checkPermission,
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
                params.startTime =
                    null !== this.signUpTime && this.signUpTime.length
                        ? moment(this.signUpTime[0]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                params.endTime =
                    null !== this.signUpTime && this.signUpTime.length
                        ? moment(this.signUpTime[1]).format('YYYY-MM-DD HH:mm:ss')
                        : null;
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
            add() {
                this.$router.push({name: 'signUpEdit'});
            },
            edit(data) {
                this.$router.push({name: 'signUpEdit', query: {id: data.id}});
            },
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    this.deleteSignIns(params);
                });
            },
            batchDel() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }
                    this.deleteSignIns(selectedIds);
                });
            },
            deleteSignIns(params) {
                deleteSignUp(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            },
            disable(data) {
                this.$confirm(this.$t('确认停用该数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    disableSignUp(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('停用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '停用失败'));
                        }
                    });
                });
            },
            start(data) {
                const params = [];
                params.push(data.id);
                enableSignUp(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            qrCode(data) {
                this.qrCodeVisible = true;
                let businessUrl = `#/apply/detail?id=${data.id}`;
                businessUrl = encodeURIComponent(businessUrl);
                const params = {
                    realUrl: `${getToPagePreUrl()}?corpCode=${
                        this.corpCode
                    }&businessUrl=${businessUrl}`
                };
                getShortLink(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.qrcode = result.data.tinyUrl;
                        const $el = document.getElementById('qrCode');
                        const width = $el.clientWidth;
                        const height = $el.clientHeight;
                        new QRCode('qrCode', {
                            text: this.qrcode,
                            width: width,
                            height: height,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.M
                        });
                        setTimeout(() => {
                            const $img = document.querySelector('#qrCode img');
                            const url = $img.getAttribute('src');
                            this.downloadQrcodeUrl = url;
                        }, 500);
                    } else {
                        this.$errorMsg(this.$t('生成URL出错'));
                    }
                });
            },
            handleClose() {
                this.qrCodeVisible = false;
            },
            copyQrCode() {
                var clipboard = new Clipboard('.copy__btn');
                clipboard.on('success', e => {
                    this.$message({
                        type: 'success',
                        message: '复制成功!'
                    });
                    // 释放内存
                    clipboard.destroy();
                });
                clipboard.on('error', e => {
                    // 不支持复制
                    console.log('该浏览器不支持自动复制');
                    // 释放内存
                    clipboard.destroy();
                });
            }
        }
    };
</script>
