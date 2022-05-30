<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container teacher__category">
        <qgu-drag-row>
            <div slot="left" class="app__row--left app__row--left--setting">
                <qgu-tree
                    :datalist="treeData"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-expand-all="defaultExpandAll"
                    @include-child-change="includeChildChange"
                    @node-click="nodeClick"
                >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span class="organize__tree__text">{{ data.name }}</span>
                    </span>
                </qgu-tree>
                <el-tooltip
                    v-if="checkPermission('kmCategory')"
                    :content="$t('类别管理')"
                    placement="top"
                    class="category__icon"
                >
                    <router-link to="/content/km/category">
                        <svg-icon icon-class="setting" class-name="category__icon__svg"/>
                    </router-link>
                </el-tooltip>
            </div>
            <div slot="right" class="app__row--right">
                <section class="opt__line veln__width">
                    <el-form :model="listQuery" :inline="true" class="demo-form-inline veln__width">
                        <el-form-item :label="$t('属性') + '：'">
                            <el-checkbox-group v-model="listQuery.statusList" @change="search">
                                <el-checkbox
                                    v-for="(item,index) in KNOWLEDGE_STATUS_ENUM.arr"
                                    :key="index"
                                    :label="item.code"
                                >{{ item.name }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item :label="$t('入库日期') + '：'">
                            <el-date-picker
                                v-model="time"
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
                        <el-form-item class="pull-right">
                            <search-input
                                v-model="listQuery.nameCodeKey"
                                :placeholder="$t('请输入姓名/编号')"
                                @enter="search"
                            />
                        </el-form-item>
                    </el-form>
                </section>
                <section class="opt__line">
                    <router-link
                        v-if="checkPermission('addKnowledge')"
                        to="/content/km/edit"
                        class="el__button__link"
                    >
                        <el-button type="primary">{{ $t('新增') }}</el-button>
                    </router-link>
                    <el-button
                        v-if="checkPermission('addKnowledge')"
                        @click="preBatch('ENABLED')"
                    >{{ $t('启用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('addKnowledge')"
                        @click="preBatch('DISABLED')"
                    >{{ $t('停用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('delKnowledge')"
                        @click="preBatch('DELETE')"
                    >{{ $t('删除') }}
                    </el-button>
                    <el-checkbox
                        v-model="listQuery.myself"
                        class="pull-right"
                        @change="search"
                    >{{ $t('只看我创建的') }}
                    </el-checkbox>
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
            </div>
        </qgu-drag-row>
        <el-dialog
            v-if="dialogVisible"
            :title="$t('审核')"
            width="500px"
            append-to-body
            :visible.sync="dialogVisible"
            @close="dialogClose"
        >
            <el-form
                ref="editQuery"
                class="km__audit__form"
                :model="editQuery"
                :inline="true"
                label-width="100px"
                :rules="rules"
            >
                <el-form-item :label="$t('审核结果') + '：'" props="type">
                    <el-radio v-model="editQuery.type" label="ENABLED">{{ $t('通过') }}</el-radio>
                    <el-radio v-model="editQuery.type" label="APPROVE_FAIL">{{ $t('拒绝') }}</el-radio>
                </el-form-item>
                <el-form-item :label="$t('原因') + '：'" prop="reason">
                    <el-input
                        v-model="editQuery.reason"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        :placeholder="$t('请输入原因')"
                    />
                </el-form-item>
            </el-form>
            <div class="dialog__btn__line">
                <el-button @click="dialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="onSure">{{ $t('确定') }}</el-button>
            </div>
        </el-dialog>
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
    import QguTree from '@/components/QguTree';
    import {auditKnowledge, disableByIdList, enableByIdList, knowledgeDelete, pageKnowledge} from '@/api/km/knowledge';
    import {getCategory} from '@/api/km/kmCategory';
    import {KNOWLEDGE_STATUS_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';
    import QRCode from 'qrcodejs2';
    import Clipboard from 'clipboard';
    import {getShortLink} from '@/api/short';
    import {getToPagePreUrl} from '@/utils/config';
    import {mapGetters} from 'vuex';

    export default {
        name: 'TeacherList',
        components: {
            QguTree
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    disabled: () => {
                        return (
                            this.checkPermission('addKnowledge') ||
                            this.checkPermission('delKnowledge')
                        );
                    }
                },
                {
                    field: 'code',
                    minWidth: 140,
                    text: this.$t('编号')
                },
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
                                            name: 'kmDetail',
                                            query: {
                                                id
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
                    field: 'downloadCount',
                    minWidth: 65,
                    align: 'center',
                    text: this.$t('下载量')
                },
                {
                    field: 'collectCount',
                    minWidth: 65,
                    align: 'center',
                    text: this.$t('收藏量')
                },
                {
                    field: 'agreeCount',
                    minWidth: 65,
                    align: 'center',
                    text: this.$t('点赞量')
                },
                {
                    field: 'viewCount',
                    minWidth: 65,
                    align: 'center',
                    text: this.$t('浏览量')
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
                    field: 'userName',
                    minWidth: 100,
                    text: this.$t('创建者')
                },
                {
                    field: 'createdAt',
                    minWidth: 100,
                    text: this.$t('发布时间'),
                    render: (h, param) => {
                        const {publishAt} = param.row;
                        return publishAt
                            ? moment(publishAt).format('YYYY-MM-DD')
                            : '--';
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
                                    this.enable([param.row.id], 'ENABLED');
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
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({
                                        name: 'kmEdit',
                                        query: {
                                            id: param.row.id
                                        }
                                    });
                                }
                            }
                        });
                        const auditBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('审核'),
                                type: 'text',
                                icon: 'check'
                            },
                            on: {
                                click: () => {
                                    this.editQuery.ids = [param.row.id];
                                    this.dialogVisible = true;
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
                        // 审核按钮 -- 审核中
                        // 启用按钮 -- 草稿、停用、审核失败
                        // 停用按钮 -- 启用时
                        // 编辑按钮 -- 草稿、停用、审核失败
                        // 删除按钮 -- 草稿、审核失败
                        if (status === 'APPROVING') {
                            optArr.push(auditBtn);
                            // optArr.push(qrCodeBtn);}
                        }
                        if (
                            status === 'DRAFT' ||
                            status === 'APPROVE_FAIL' ||
                            status === 'DISABLED'
                        ) {
                            optArr.push(enableBtn);
                        }
                        if (status === 'ENABLED') {
                            optArr.push(disableBtn);
                            optArr.push(qrCodeBtn);
                        }
                        if (status !== 'ENABLED' && status !== 'APPROVING') {
                            optArr.push(editBtn);// optArr.push(qrCodeBtn);
                        }
                        if (status === 'DRAFT' || status === 'APPROVE_FAIL') {
                            optArr.push(deleteBtn);
                        }
                        return h('div', optArr, '');
                    }
                }
            ];

            const validateReason = (rule, value, callback) => {
                const {type, reason} = this.editQuery;
                if (type === 'ENABLED') {
                    callback();
                    return;
                }
                if (type === 'APPROVE_FAIL' && reason === '') {
                    callback(new Error(this.$t('请输入拒绝理由')));
                    return;
                }
                callback();
            };
            return {
                KNOWLEDGE_STATUS_ENUM,
                tableColumns,
                list: [],
                total: 0,
                time: [],
                listQuery: {
                    includeChild: true,
                    categoryId: null,
                    source: '',
                    statusList: [
                        'DRAFT',
                        'ENABLED',
                        'DISABLED',
                        'APPROVING',
                        'APPROVE_FAIL'
                    ],
                    publishDateLeft: '',
                    publishDateRight: '',
                    nameCodeKey: '',
                    myself: false,
                    pageNum: 1,
                    pageSize: 20
                },
                listLoading: false,
                treeData: [],
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                dialogVisible: false,
                editType: 'ADD',
                editQuery: {
                    ids: [],
                    type: 'ENABLED',
                    reason: ''
                },
                selectedData: [],
                positionCategory: null,
                rules: {
                    reason: [{validator: validateReason, trigger: 'blur'}]
                },
                qrCodeVisible: false,
                qrcode: '',
                downloadQrcodeUrl: ''
            };
        },
        computed: {
            ...mapGetters(['corpCode'])
        },
        created() {
            this.getCategory();
        },
        methods: {
            checkPermission,
            // 树节点点击事件
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.positionCategory = data;
                this.getList({
                    pageNum: 1
                });
            },
            // 获取只是类别树
            getCategory() {
                getCategory({authCode: 'KM_MANAGE_SCOPE'}).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.categoryId = result.data.id;
                        this.search();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取岗位类别出错'));
                    }
                });
            },
            // 搜索分页
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            // 包含子类修改
            includeChildChange(includeChild) {
                this.listQuery.includeChild = includeChild;
                this.listQuery.pageNum = 1;

                this.getList();
            },
            // 获取分页列表
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                if (params.categoryId === '*') {
                    params.categoryId = '';
                }
                if (Array.isArray(this.time) && this.time.length) {
                    params.publishDateLeft = this.time[0];
                    params.publishDateRight = this.time[1];
                }
                this.listLoading = true;
                pageKnowledge(params).then(re => {
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
            // 停用
            disable(ids) {
                this.$confirm(this.$t('确认停用该课程么?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    disableByIdList(ids).then(re => {
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
            enable(ids) {
                enableByIdList(ids).then(re => {
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
                this.$confirm(this.$t('此操作将永久删除该课程, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    knowledgeDelete(ids).then(re => {
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
            },
            // 审核回调
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }

                    auditKnowledge(this.editQuery).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.dialogVisible = false;
                            this.getList({pageNum: 1});
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            },
            // 审核 弹框 关闭
            dialogClose() {
                this.editQuery = {
                    ids: [],
                    type: 'ENABLED',
                    reason: ''
                };
                this.dialogVisible = false;
            },
            handleClose() {
                this.qrCodeVisible = false;
            },
            renderQrCode(data) {
                const {type, id} = data;
                let businessUrl = '';
                switch (type) {
                    case 'PIC':
                    case 'image':
                    case 'img':
                        businessUrl = `#/km/view/picture?id=${id}&corpCode=${this.corpCode}`;
                        break;
                    case 'video':
                        businessUrl = `#/km/view/video?id=${id}&corpCode=${this.corpCode}`;
                        break;
                    case 'DOC':
                        businessUrl = `#/km/view/doc?id=${id}&corpCode=${this.corpCode}`;
                        break;
                }
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
            qrCode(data) {
                this.qrCodeVisible = true;

                setTimeout(() => {
                    this.renderQrCode(data);
                }, 500);
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
