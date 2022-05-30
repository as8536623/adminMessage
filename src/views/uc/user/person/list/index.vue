<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="app-container">
        <qgu-drag-row>
            <div slot="left" class="app__row--left">
                <qgu-tree
                    :datalist="treeData"
                    :current-node-key="currentNodeKey"
                    :default-expanded-keys="defaultExpandedKeys"
                    @include-child-change="includeChildChange"
                    @node-click="nodeClick"
                >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span>{{ data.name }}</span>
                    </span>
                </qgu-tree>
            </div>
            <div slot="right" class="app__row--right">
                <section class="person__filter veln__width">
                    <el-form
                        :model="listQuery"
                        :inline="true"
                        class="demo-form-inline unrequired__form"
                    >
                        <!--                        <el-form-item-->
                        <!--                            :label="$t('岗位') + '：'"-->
                        <!--                            class="small"-->
                        <!--                            style="margin-right: 30px;"-->
                        <!--                        >-->
                        <!--                            <el-input-->
                        <!--                                v-model.trim="listQuery.positionName"-->
                        <!--                                :placeholder="$t('岗位')"-->
                        <!--                                clearable-->
                        <!--                                @focus="showPostSelect"-->
                        <!--                                @change="formItemChange"-->
                        <!--                            />-->
                        <!--                        </el-form-item>-->
                        <el-form-item :label="$t('状态') + '：'">
                            <el-checkbox-group
                                v-model="listQuery.statusList"
                                @change="formItemChange"
                            >
                                <el-checkbox label="ENABLED">{{ $t('启用') }}</el-checkbox>
                                <el-checkbox label="DISABLED">{{ $t('停用') }}</el-checkbox>
                                <!--<el-checkbox label="LEAVE">{{ $t('离职') }}</el-checkbox>-->
                            </el-checkbox-group>
                        </el-form-item>
                        <search-input
                            v-model="listQuery.name"
                            class="pull-right"
                            :placeholder="$t('请输入工号/姓名/用户名/手机')"
                            @enter="search"
                        />
                    </el-form>
                </section>
                <section class="opt__line veln__width">
                    <el-button
                        v-if="checkPermission('addUser')"
                        type="primary"
                        @click="addUser"
                    >{{ $t('新增') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('addUser')"
                        @click="batchOption('start')"
                    >{{ $t('启用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('addUser')"
                        @click="batchOption('stop')"
                    >{{ $t('停用') }}
                    </el-button>
                    <!--                    <el-button-->
                    <!--                        v-if="checkPermission('importUser')"-->
                    <!--                        @click="openUpload('ADD')"-->
                    <!--                    >{{ $t('导入') }}-->
                    <!--                    </el-button>-->
                    <!--                    <el-button-->
                    <!--                        v-if="checkPermission('importUser')"-->
                    <!--                        @click="openUpload('UPDATE')"-->
                    <!--                    >{{ $t('修改导入') }}-->
                    <!--                    </el-button>-->
                    <!--                    <el-button-->
                    <!--                        v-if="checkPermission('exportUser')"-->
                    <!--                        :disabled="excelInfo && excelInfo.status === 'RUNNING'"-->
                    <!--                        @click="preExportExcel"-->
                    <!--                    >{{ $t('导出') }}-->
                    <!--                    </el-button>-->
                    <!--                    <router-link v-if="checkPermission('addUser')" to="/uc/user/person/out">-->
                    <!--                        <div class="outer__user__wrapper pull-right">-->
                    <!--                            <svg-icon icon-class="out_user" class-name="outer__user__add"/>-->
                    <!--                            <span>{{ $t('新增外部联系人') }}</span>-->
                    <!--                        </div>-->
                    <!--                    </router-link>-->
                    <!--                    <el-button-->
                    <!--                        v-if="false"-->
                    <!--                        @click="batchOption('changeInnerType')"-->
                    <!--                    >{{ $t('变更为内部学员') }}-->
                    <!--                    </el-button>-->
                </section>
                <el-alert
                    v-if="excelMsg"
                    class="person__excel__info"
                    :type="excelMsgType"
                    @close="excelMsgClose"
                >
                    <div>
                        {{ excelMsg }}
                        <el-link
                            v-if="excelMsgId"
                            class="person__excel__link"
                            type="primary"
                            @click="exportExcel"
                        >下载
                        </el-link>
                    </div>
                </el-alert>
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
            </div>
        </qgu-drag-row>
        <el-dialog
            append-to-body
            :title="$t('选择岗位')"
            :visible.sync="dialogVisible"
            width="339px"
            :before-close="handleClose"
        >
            <veln-position-select ref="velnPostSel" :active-id="listQuery.positionId"/>
            <div class="dialog__btn__line">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="onSure">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="fileDialogVisible"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="fileDialogVisible"
            width="890px"
        >
            <veln-file-select/>
        </el-dialog>
        <veln-file-upload
            ref="velnFileUpload"
            app-code="sys"
            :title="title"
            :template-url="templateUrl"
            :fun-code="funCode"
            @onSure="uploadSuccess"
        />
        <el-dialog
            v-if="uploadErrorVisible"
            append-to-body
            :title="$t('下载错误模板')"
            :visible.sync="uploadErrorVisible"
            width="300px"
        >
            <veln-upload-error :url="errorUrl" @continue="continueImport"/>
        </el-dialog>
    </article>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import VelnPositionSelect from '@/components/VelnPositionSelect';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import VelnFileUpload from '@/components/VelnFileUpload';
    import VelnUploadError from '@/components/VelnUploadError';
    import {getOrgTree} from '@/api/org';
    // import { formatObjToString } from '@/utils/index';
    import {
        importUpdateUser,
        importUser,
        saveImport,
        updateImport,
        userDisabled,
        userEnable,
        userExport,
        userPage,
        userResetPwd
    } from '@/api/user';
    import {getUcPrefix} from '@/utils/ajax';
    import {closeExport, getFinalExport} from '@/api/exportTask';
    import {PERSON_STATUS_ENUM} from '@/enum';
    import {mapGetters} from 'vuex';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'PersonList',
        components: {
            QguTree,
            VelnPositionSelect,
            VelnFileSelect,
            VelnFileUpload,
            VelnUploadError
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'code',
                    text: this.$t('工号'),
                    width: 120
                },
                {
                    field: 'name',
                    text: this.$t('姓名'),
                    minWidth: 100
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名'),
                    minWidth: 120
                },
                {
                    field: 'mobile',
                    text: this.$t('手机号码'),
                    minWidth: 120,
                    render: (h, param) => {
                        return param.row.mobile ? param.row.mobile : '--';
                    }
                },
                // {
                //     field: 'positionName',
                //     text: this.$t('岗位'),
                //     minWidth: 120,
                //     hidden: hasBgk,
                //     render: (h, param) => {
                //         return param.row.positionName
                //             ? param.row.positionName
                //             : '--';
                //     }
                // },
                // {
                //     field: 'orgName',
                //     text: this.$t('部门'),
                //     minWidth: 160,
                //     render: (h, param) => {
                //         const row = param.row;
                //         if (!row.orgNamePath) {
                //             return row.orgName || '--';
                //         }
                //         return h(
                //             'ElTooltip',
                //             {
                //                 props: {
                //                     effect: 'dark',
                //                     placement: 'right',
                //                     content: row.orgNamePath
                //                 }
                //             },
                //             [h('span', row.orgName || '--')]
                //         );
                //     }
                // },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    render: (h, param) => {
                        const status = param.row.status;
                        return PERSON_STATUS_ENUM[status].name;
                    }
                },
                {
                    field: 'opt',
                    fixed: 'right',
                    text: this.$t('操作'),
                    width: 110,
                    render: (h, param) => {
                        const optArr = [];
                        const row = param.row;
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    if (row.type === 'OUTER') {
                                        this.$router.push({
                                            name: 'personOut',
                                            query: {
                                                id: param.row.id,
                                                name: param.row.name
                                            }
                                        });
                                        return;
                                    }
                                    this.$router.push({
                                        name: 'personEdit',
                                        query: {
                                            id: param.row.id,
                                            name: param.row.name
                                        }
                                    });
                                }
                            }
                        });
                        const stopBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('停用'),
                                type: 'text',
                                icon: 'disable'
                            },
                            on: {
                                click: () => {
                                    this.option(param.row.id, 'stop');
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
                                    this.option(param.row.id, 'start');
                                }
                            }
                        });
                        const resetBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('重置密码'),
                                type: 'text',
                                icon: 'reset'
                            },
                            on: {
                                click: () => {
                                    this.option(param.row.id, 'reset');
                                }
                            }
                        });
                        if (param.row.loginName !== 'admin') {
                            if (this.checkPermission('addUser')) {
                                optArr.push(editBtn);
                            }
                            if (this.checkPermission('resetPwd')) {
                                optArr.push(resetBtn);
                            }
                        }
                        if (
                            param.row.loginName !== 'admin' &&
                            param.row.status === 'ENABLED'
                        ) {
                            if (this.checkPermission('addUser')) {
                                optArr.push(stopBtn);
                            }
                        }
                        if (
                            param.row.loginName !== 'admin' &&
                            param.row.status === 'DISABLED'
                        ) {
                            if (this.checkPermission('addUser')) {
                                optArr.push(startBtn);
                            }
                        }
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                tableColumns,
                list: [],
                total: 0,
                treeData: [],
                defaultExpandedKeys: [],
                listLoading: false,
                listQuery: {
                    includeChild: true,
                    orgId: '',
                    positionName: '',
                    positionId: '',
                    name: '',
                    statusList: ['ENABLED'],
                    pageNum: 1,
                    pageSize: 20
                },
                multiSelection: [],
                dialogVisible: false,
                fileDialogVisible: false,
                currentNodeKey: '',
                importType: 'ADD',
                templateUrl: '',
                title: '人员导入',
                funCode: 'UC_IMPORT_USER',
                addUserTemplateUrl: `${getUcPrefix()}/user/downloadImportTemplate`,
                updateUserTemplateUrl: `${getUcPrefix()}/user/downloadUpdateTemplate`,
                excelInfo: null,
                excelMsg: '',
                excelMsgType: 'info',
                excelMsgId: '',
                errorUrl: '',
                uploadErrorVisible: false
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            this.getOrgTree();
            this.getFinalExport();
        },
        methods: {
            checkPermission,
            // 校验能否下载excel
            getFinalExport() {
                const params = {
                    exportType: 'EXPORT_UC_USER'
                };
                getFinalExport(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.excelInfo = result.data;
                        if (result.data && result.data.status === 'FINISHED') {
                            switch (result.data.status) {
                                case 'FINISHED': {
                                    this.excelMsg = this.$t(
                                        `excel 生成日期为${result.data.finishTime}`
                                    );
                                    this.excelMsgId = result.data.id;
                                    break;
                                }
                                case 'RUNNING': {
                                    this.excelMsgType = 'info';
                                    this.excelMsg = this.$t(
                                        '人员详情excel正在生成中'
                                    );
                                    break;
                                }
                                case 'FAILED': {
                                    this.excelMsgType = 'error';
                                    this.excelMsg = this.$t(`excel 生成失败`);
                                    break;
                                }
                            }
                        }
                    }
                });
            },
            // 关闭下载提示信息
            excelMsgClose() {
                closeExport(this.excelMsgId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            },
            // 获取部门树
            getOrgTree() {
                getOrgTree().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.defaultExpandedKeys = [result.data.id];
                        this.treeData = [result.data];
                        this.listQuery.orgId = result.data.id;
                        this.currentNodeKey = result.data.id;
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取角色数据出错'));
                    }
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.statusList = params.statusList.length
                    ? params.statusList.join(',')
                    : '';
                params.positionId =
                    params.positionId === '*' ? '' : params.positionId;
                this.listLoading = true;
                userPage(params).then(re => {
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
            nodeClick(data) {
                this.listQuery.orgId = data.id;
                this.getList({
                    pageNum: 1
                });
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            showPostSelect() {
                this.dialogVisible = true;
            },
            onSure() {
                const select = this.$refs.velnPostSel.getActive();
                if (select.id) {
                    this.listQuery.positionId = select.id;
                    this.listQuery.positionName = select.name;
                    this.getList({
                        pageNum: 1
                    });
                }
                this.dialogVisible = false;
            },
            handleClose() {
                this.dialogVisible = false;
            },
            selectionChange(v) {
                this.multiSelection = v;
            },
            handleSizeChange(v) {
                this.getList({
                    pageNum: 1,
                    pageSize: v
                });
            },
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v
                });
            },
            // 表单变化实时查询分页
            formItemChange() {
                if (!this.listQuery.positionName) {
                    this.listQuery.positionId = '';
                }
                this.getList({
                    pageNum: 1
                });
            },
            // 启用
            userEnable(userIds) {
                userEnable(userIds).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            // 停用
            userDisabled(userIds) {
                userDisabled(userIds).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('停用成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '停用失败'));
                    }
                });
            },
            // 重置
            userResetPwd(userIds) {
                userResetPwd(userIds).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(
                            result.msg && result.data
                                ? `${this.$t(result.msg)}，${this.$t('重置后的密码是')}：${result.data}`
                                : this.$t('重置成功')
                        );
                    } else {
                        this.$errorMsg(this.$t(result.msg || '重置失败'));
                    }
                });
            },
            // 人员操作-前置
            preOption(userIds, type) {
                let typeVal = '';
                let message = '';
                switch (type) {
                    case 'start':
                        typeVal = 'info';
                        message = this.$t('确定启用选中的账号吗');
                        break;
                    case 'stop':
                        typeVal = 'error';
                        message = this.$t('确定停用选中的账号吗');
                        break;
                    case 'reset':
                        typeVal = 'warning';
                        message = this.$t('确定重置选中账号的密码吗?');
                        break;
                    case 'changeInnerType':
                        typeVal = 'info';
                        message = this.$t('确定变更为内部学员吗?');
                        break;
                }
                this.$confirm(message, {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: typeVal
                }).then(() => {
                    switch (type) {
                        case 'start':
                            this.userEnable(userIds);
                            break;
                        case 'stop':
                            this.userDisabled(userIds);
                            break;
                        case 'reset':
                            this.userResetPwd(userIds);
                            break;
                        case 'changeInnerType':
                            this.changeUserInnerType(userIds);
                            break;
                    }
                });
            },
            // 人员操作-前置
            option(ids, type) {
                let userIds = [];
                if (Array.isArray(ids)) {
                    userIds = ids;
                } else {
                    userIds.push(ids);
                }

                this.preOption(userIds, type);
            },
            // 批量操作
            batchOption(type) {
                if (!this.multiSelection.length) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }

                const userIds = [];
                this.multiSelection.map(item => {
                    userIds.push(item.id);
                });

                this.preOption(userIds, type);
            },
            addUser() {
                this.$router.push({
                    name: 'personEdit'
                });
            },
            openUpload(type) {
                this.importType = type;
                this.templateUrl =
                    type === 'ADD'
                        ? this.addUserTemplateUrl
                        : this.updateUserTemplateUrl;
                this.title = type === 'ADD' ? this.title : '修改导入';
                this.funCode = type === 'ADD' ? this.funCode : 'UC_UPD_IMPORT_USER';
                this.$refs.velnFileUpload.open();
            },
            includeChildChange(includeChild) {
                this.listQuery.includeChild = includeChild;
                this.listQuery.pageNum = 1;

                this.getList();
            },
            checkAddExcel(fileId) {
                importUser(fileId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$refs.velnFileUpload.close();
                        this.getList({pageNum: 1});
                    } else if (result.data) {
                        this.errorUrl = `${process.env.FS_API}/file/d/${result.data}?_token=${this.token}`;
                        this.uploadErrorVisible = true;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '导入失败'));
                    }
                });
            },
            checkUpdateExcel(fileId) {
                importUpdateUser(fileId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$refs.velnFileUpload.close();
                        this.getList({pageNum: 1});
                    } else if (result.data) {
                        this.errorUrl = `${process.env.FS_API}/file/d/${result.data}?_token=${this.token}`;
                        this.uploadErrorVisible = true;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '导入失败'));
                    }
                });
            },
            // 导入成功
            uploadSuccess(re) {
                if (re.success) {
                    if (this.importType === 'ADD') {
                        this.checkAddExcel(re.data.fileId);
                    } else {
                        this.checkUpdateExcel(re.data.fileId);
                    }
                } else {
                    this.$errorMsg(this.$t(re.msg || '导入失败'));
                }
            },
            // 预加载excel
            preExportExcel() {
                this.excelMsgType = 'info';
                this.excelMsg = this.$t('人员详情excel正在生成中');
                this.excelInfo = {
                    status: 'RUNNING'
                };

                const params = Object.assign({}, this.listQuery, {pageNum: 1});
                params.statusList = params.statusList.length
                    ? params.statusList.join(',')
                    : '';
                params.positionId =
                    params.positionId === '*' ? '' : params.positionId;
                userExport(params).then(re => {
                    const result = re.data;
                    if (result.success && result.data) {
                        this.excelInfo = result.data;
                        if (result.data && result.data.status === 'FINISHED') {
                            this.excelMsgType = 'success';
                            this.excelMsg = this.$t(
                                `excel 生成日期为${result.data.finishTime}`
                            );
                        } else if (result.data && result.data.status === 'FAILED') {
                            this.excelMsgType = 'error';
                            this.excelMsg = this.$t(`excel 生成失败`);
                        }
                    }
                });
            },
            // 导出excel
            exportExcel() {
                const url = `${getUcPrefix()}/user/downloadExport/${this.excelInfo.id}?_token=${this.token}`;
                window.open(url);
            },
            // 继续导入
            continueImport() {
                if (this.importType === 'ADD') {
                    saveImport().then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$t('导入成功');
                        } else {
                            this.$t(result.msg || '导入失败');
                        }
                    });
                    return;
                }
                updateImport().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$t('导入成功');
                    } else {
                        this.$t(result.msg || '导入失败');
                    }
                });
            },
            changeUserInnerType(userIds) {
                this.$errorMsg(this.$t('后台接口还没做完，敬请期待'));
                /** changeUserInnerType(userIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('更新成功'));
                            this.getList({pageNum: 1});
                        } else {
                            this.$errorMsg(this.$t(result.msg || '更新失败'));
                        }
                    }); **/
            }
        }
    };
</script>
