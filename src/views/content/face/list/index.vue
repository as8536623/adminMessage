<style lang="scss">
@import '../style';
</style>
<template>
    <article class="app-container face-container">
        <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
            <el-form-item :label="$t('状态') + '：'">
                <el-select v-model="listQuery.status" size="mini" @change="handleCheckChange">
                    <el-option :label="$t('全部状态')" value/>
                    <el-option
                        v-for="(item, index) in FACE_STATUS_ENUM.getAllValues()"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                    >{{ item.name }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('项目时间') + '：'">
                <el-date-picker
                    v-model="signUpTime"
                    type="daterange"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleCheckChange"
                />
            </el-form-item>
            <el-form-item class="pull-right">
                <search-input
                    v-model="listQuery.keywords"
                    :placeholder="$t('请输入项目名称/编号')"
                    @enter="search"
                />
            </el-form-item>
        </el-form>
        <section class="opt__line veln__width">
            <el-button type="primary" @click="add()">{{ $t('新增') }}</el-button>
            <el-button @click="batchDel()">{{ $t('删除') }}</el-button>
            <el-button
                v-if="isSuperAdminFlag"
                type="text"
                class="custom__btn"
                @click="customFieldsSet"
            >
                {{ $t('去设置面授字段管理'
                    + '>') }}
            </el-button>
            <el-checkbox
                v-model="listQuery.self"
                class="pull-right only__my"
                @change="onlyMySelfChange"
            >{{ $t('只看我创建的面授项目') }}</el-checkbox>
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
    import {FACE_STATUS_ENUM} from '@/enum';
    import moment from 'moment';
    import {deleteHandel, disable, enable, getList, isSuperAdmin} from '@/api/faceCourse';
    import QRCode from 'qrcodejs2';
    import {getShortLink} from '@/api/short';
    import Clipboard from 'clipboard';
    import {mapGetters} from 'vuex';
    import {getToPagePreUrl} from '@/utils/config';

    export default {
        name: 'FaceCourseList',
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
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
                                            name: 'faceCourseDetail',
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
                    text: this.$t('项目时间'),
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
                // {
                //     field: 'assistantName',
                //     text: this.$t('助教'),
                //     minWidth: 160,
                //     render: (h, param) => {
                //         return param.row.assistantList && param.row.assistantList.length
                //             ? param.row.assistantList.join('，') : '--';
                //     }
                // },
                {
                    field: 'createdBy',
                    text: this.$t('创建人'),
                    minWidth: 160,
                    render: (h, param) => {
                        return param.row.createdBy ? param.row.createdBy : '--';
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    minWidth: 100,
                    render: (h, param) => {
                        return param.row.status
                            ? this.FACE_STATUS_ENUM.getName(param.row.status)
                            : '--';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 200,
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
                        const interactionBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('互动管理'),
                                type: 'text',
                                icon: 'interaction'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'quickInteraction',
                                        query: {id: param.row.id}
                                    });
                                }
                            }
                        });
                        // const screenBtn = h('QguButton', {
                        //     props: {
                        //         toolTip: this.$t('大屏幕'),
                        //         type: 'text',
                        //         icon: 'screen'
                        //     },
                        //     on: {
                        //         click: () => {}
                        //     }
                        // });
                        const courseBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('课程设计'),
                                type: 'text',
                                icon: 'design'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'coursePlan',
                                        query: {id: param.row.id}
                                    });
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
                                        name: 'courseUserManage',
                                        query: {
                                            id: param.row.id,
                                            enrollId: param.row.enrollId
                                        }
                                    });
                                }
                            }
                        });
                        const checkBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('考核'),
                                type: 'text',
                                icon: 'check'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'faceCourseCheck',
                                        query: {relId: param.row.id}
                                    });
                                }
                            }
                        });
                        switch (param.row.status) {
                            case 'DRAFT': // 草稿
                                optArr.push(editBtn);
                                optArr.push(startBtn);
                                optArr.push(deleteBtn);
                                optArr.push(courseBtn);
                                break;
                            case 'NOT_STARTED': // 未开始
                            case 'PROGRESSING': // 进行中
                                optArr.push(qrCodeBtn);
                                optArr.push(disableBtn);
                                optArr.push(interactionBtn);
                                optArr.push(courseBtn);
                                optArr.push(studentBtn);
                                optArr.push(checkBtn);
                                break;
                            case 'FINISHED': // 已结束
                                optArr.push(qrCodeBtn);
                                optArr.push(studentBtn);
                                // optArr.push(screenBtn);
                                optArr.push(checkBtn);
                                break;
                            case 'DISABLED': // 已停用
                                optArr.push(qrCodeBtn);
                                if (param.row.enrollId) {
                                    optArr.push(studentBtn);
                                }
                                // optArr.push(screenBtn);
                                optArr.push(checkBtn);
                                break;
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                FACE_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    self: '', // 只看我创建的作业
                    keywords: '', // 名称、编号
                    status: '', // 状态
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc', // 排序
                    startTime: '', // 筛选开始时间
                    endTime: '' // 筛选结束时间
                },
                signUpTime: [],
                qrCodeVisible: false,
                qrcode: '',
                downloadQrcodeUrl: '',
                isSuperAdminFlag: false
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        created() {
            this.getList();
            this.isSuperAdmin();
        },
        methods: {
            // 判断管理员
            isSuperAdmin() {
                isSuperAdmin().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.isSuperAdminFlag = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
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
            onlyMySelfChange() {
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
                params.statusList = this.listQuery.status
                    ? [this.listQuery.status]
                    : [];
                params.startTime =
                    null !== this.signUpTime && this.signUpTime.length
                        ? this.signUpTime[0]
                        : null;
                params.endTime =
                    null !== this.signUpTime && this.signUpTime.length
                        ? this.signUpTime[1]
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
                this.$router.push({name: 'courseBaseInfo'});
            },
            edit(data) {
                this.$router.push({name: 'faceEdit', query: {id: data.id}});
            },
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    this.deleteOpt(params);
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
                    this.deleteOpt(selectedIds);
                });
            },
            deleteOpt(params) {
                deleteHandel(params).then(re => {
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
                    disable(params).then(re => {
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
                enable(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            handleClose() {
                this.qrCodeVisible = false;
            },
            qrCode(data) {
                this.qrCodeVisible = true;
                let businessUrl = `#/face/detail?id=${data.id}`;
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
            },
            customFieldsSet() {
                this.$router.push({name: 'customFields'});
            }
        }
    };
</script>
