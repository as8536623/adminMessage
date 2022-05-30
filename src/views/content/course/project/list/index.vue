<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container project__padding">
        <section class="person__filter veln__width">
            <el-form
                :model="listQuery"
                :inline="true"
                class="demo-form-inline"
            >
                <el-form-item :label="$t('全部状态') + '：'">
                    <el-select
                        v-model="listQuery.status"
                        class="course__type__select"
                        size="mini"
                        placeholder="请选择"
                        @change="search"
                    >
                        <el-option :label="$t('全部')" value=""/>
                        <el-option
                            v-for="item in PROJECT_STATUS_ENUM.arr"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('项目时间') + '：'">
                    <el-date-picker
                        v-model="dateTime"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="search"
                    />
                </el-form-item>
                <search-input
                    v-model="listQuery.name"
                    class="pull-right"
                    :placeholder="$t('请输入项目名称/编号')"
                    @enter="search"
                />
            </el-form>
        </section>
        <section class="opt__line veln__width">
            <el-button
                v-if="checkPermission('mpAddProject')"
                type="primary"
                @click="jump(null, 'add')"
            >{{ $t('新增') }}
            </el-button>
            <el-checkbox v-model="listQuery.myself" class="pull-right" @change="search">{{ $t('只看我创建的项目') }}
            </el-checkbox>
        </section>
        <qgu-table
            :columns="tableColumns"
            :data="list"
            :page="listQuery"
            :total="total"
            :loading="listLoading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
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
    import moment from 'moment';
    import {del, disable, enable, getList} from '@/api/course/project/project';
    import {PROJECT_STATUS_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';
    import QRCode from 'qrcodejs2';
    import Clipboard from 'clipboard';
    import {getShortLink} from '@/api/short';
    import {getToPagePreUrl} from '@/utils/config';
    import {mapGetters} from 'vuex';

    export default {
        name: 'CourseList',
        data() {
            const tableColumns = [
                {
                    field: 'code',
                    text: this.$t('编号'),
                    minWidth: 140
                },
                {
                    field: 'name',
                    text: this.$t('项目名称'),
                    minWidth: 160,
                    render: (h, param) => {
                        const name = param.row.name;
                        if (!name) {
                            return '--';
                        }
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'projectDetail',
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
                    field: 'startAt',
                    text: this.$t('项目日期'),
                    width: 360,
                    render: (h, param) => {
                        const {startAt, endAt} = param.row;
                        if (!startAt || !endAt || param.row.type === 'CYCLE') {
                            return '--';
                        } else {
                            return `${moment(startAt).format('YYYY-MM-DD HH:mm')} - ${moment(endAt).format('YYYY-MM-DD HH:mm')}`;
                        }
                    }
                },
                {
                    field: 'userName',
                    text: this.$t('创建人'),
                    width: 100,
                    render: (h, param) => {
                        return param.row.userName ? param.row.userName : '--';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    width: 80,
                    render: (h, param) => {
                        return this.PROJECT_STATUS_ENUM.getName(param.row.status);
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 150,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const {status} = param.row;
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
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.jump(param.row, 'edit');
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
                                    this.del(param.row);
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
                        const manageBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('任务管理'),
                                type: 'text',
                                icon: 'interaction'
                            },
                            on: {
                                click: () => {
                                    this.jump(param.row, 'manage');
                                }
                            }
                        });
                        const codeBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('二维码'),
                                type: 'text',
                                icon: 'qrcode'
                            },
                            on: {
                                click: () => {
                                    this.qrcodeClick(param.row);
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
                                    this.jump(param.row, 'student');
                                }
                            }
                        });
                        const monitorBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('监控'),
                                type: 'text',
                                icon: 'monitor'
                            },
                            on: {
                                click: () => {
                                    this.jump(param.row, 'monitor');
                                }
                            }
                        });

                        switch (status) {
                            case 'DRAFT':
                                if (this.checkPermission('mpEditProjectStatus')) {
                                    optArr.push(startBtn);
                                }
                                if (this.checkPermission('mpEditProject')) {
                                    optArr.push(editBtn);
                                }
                                if (this.checkPermission('mpDeleteProject')) {
                                    optArr.push(deleteBtn);
                                }
                                /* if (this.checkPermission('mpTaskManage')) {
                                    optArr.push(manageBtn);
                                } */
                                if (this.checkPermission('mpAddProject') || this.checkPermission('mpEditProject')) {
                                    optArr.push(manageBtn);
                                }
                                break;
                            case 'NOT_STARTED':
                                if (this.checkPermission('mpEditProjectStatus')) {
                                    optArr.push(disableBtn);
                                }
                                if (this.checkPermission('mpEditProject')) {
                                    optArr.push(editBtn);
                                }
                                optArr.push(codeBtn);
                                // optArr.push(manageBtn);
                                if (this.checkPermission('mpProUserManage')) {
                                    optArr.push(studentBtn);
                                }
                                break;
                            case 'PROGRESSING':
                                if (this.checkPermission('mpEditProjectStatus')) {
                                    optArr.push(disableBtn);
                                }
                                if (this.checkPermission('mpEditProject')) {
                                    optArr.push(editBtn);
                                }
                                optArr.push(codeBtn);
                                if (this.checkPermission('mpProUserManage')) {
                                    optArr.push(studentBtn);
                                }
                                if (this.checkPermission('mpMonitorProject')) {
                                    optArr.push(monitorBtn);
                                }
                                break;
                            case 'FINISHED':
                                optArr.push(codeBtn);
                                if (this.checkPermission('mpProUserManage')) {
                                    optArr.push(studentBtn);
                                }
                                if (this.checkPermission('mpMonitorProject')) {
                                    optArr.push(monitorBtn);
                                }
                                break;
                            case 'DISABLED':
                                /* if (this.checkPermission('mpEditProjectStatus')) {
                                    optArr.push(startBtn);
                                } */
                                if (this.checkPermission('mpEditProject')) {
                                    optArr.push(editBtn);
                                }
                                optArr.push(codeBtn);
                                if (this.checkPermission('mpProUserManage')) {
                                    optArr.push(studentBtn);
                                }
                                if (this.checkPermission('mpMonitorProject')) {
                                    optArr.push(monitorBtn);
                                }
                                break;
                        }

                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                PROJECT_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listQuery: {
                    name: '',
                    status: '',
                    startAt: null,
                    endAt: null,
                    myself: false,
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                dateTime: [],
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
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.startAt =
                    null !== this.dateTime && this.dateTime.length
                        ? `${this.dateTime[0]} 00:00:00`
                        : null;
                params.endAt =
                    null !== this.dateTime && this.dateTime.length
                        ? `${this.dateTime[1]} 23:59:59`
                        : null;
                this.listLoading = true;
                getList(params).then(re => {
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
            start(item) {
                enable(item.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            disable(item) {
                disable(item.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('停用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '停用失败'));
                    }
                });
            },
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    del(params).then(re => {
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
            jump(item, type) {
                // todo 跳转 编辑、监控、学员、任务管理
                switch (type) {
                    case 'add':
                        this.$router.push({name: 'projectBasic'});
                        break;
                    case 'edit':
                        this.$router.push({
                            name: 'projectBasic',
                            query: {
                                id: item.id
                            }
                        });
                        break;
                    case 'manage':
                        this.$router.push({
                            name: 'projectTask',
                            query: {
                                id: item.id
                            }
                        });
                        break;
                    case 'student':
                        this.$router.push({
                            name: 'projectUserManage',
                            query: {
                                id: item.id,
                                status: item.status
                            }
                        });
                        break;
                    case 'monitor':
                        this.$router.push({
                            name: 'projectMonitor',
                            query: {
                                id: item.id
                            }
                        });
                        break;
                }
            },
            handleClose() {
                this.qrCodeVisible = false;
            },
            qrcodeClick(data) {
                let businessUrl;
                this.qrCodeVisible = true;
                businessUrl = `#/project/detail?id=${data.id}`;
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
