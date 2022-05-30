<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail tool-participants">
        <el-form label-width="140px" :inline-message="true">
            <veln-form-section :title="$t('参与人员')" :can-expand="false">
                <!--<span class="sign__edit__btn" @click="edit">{{$t('编辑')}}</span>-->
                <el-form-item :label="$t('指定人员') + '：'" class="sign__label-item">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="$t('已开放人员')" name="user">
                            <qgu-table
                                ref="table"
                                :columns="userTableColumns"
                                :data="userList"
                                :page="listQuery"
                                :total="total"
                                :loading="listLoading"
                                :highlight-current-row="true"
                                @selection-change="selectionChange"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                            />
                        </el-tab-pane>
                        <el-tab-pane :label="$t('已开放组织')" name="org">
                            <qgu-table
                                ref="table"
                                :columns="orgTableColumns"
                                :data="orgList"
                                :page="listQuery"
                                :total="total"
                                :loading="listLoading"
                                :highlight-current-row="true"
                                @selection-change="selectionChange"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                            />
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
                <el-form-item
                    v-if="enrollId && applyList.includes('veln-enroll')"
                    :label="$t('报名人员') + '：'"
                >
                    <section class="sign__up__set">
                        {{ $t('已设置接受报名') }}
                        <el-button
                            size="small"
                            type="text"
                            class="face__view__btn"
                            @click="signUpView"
                        >
                            {{ $t('去查看') }}
                        </el-button>
                    </section>
                </el-form-item>
                <el-form-item :label="$t('指定助教') + '：'">
                    <el-tag
                        v-for="(item, index) in assistantList"
                        :key="index"
                        type="success"
                    >{{ item.name }}</el-tag>
                    {{ !assistantList || !assistantList.length ? '--' : '' }}
                </el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {getUserList} from '@/api/userComponent';
    import {getOrgList} from '@/api/orgComponent';
    import {ORG_TYPE_ENUM, OUT_USER_JOIN_ENUM} from '@/enum';
    import {detail} from '@/api/faceCourse';
    import {getAppCodes} from '@/api/system/csFeign';
    export default {
        name: 'Participants',
        components: {
            VelnFormSection
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                }
            },
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            const userTableColumns = [
                {
                    field: 'code',
                    text: this.$t('工号')
                },
                {
                    field: 'name',
                    text: this.$t('姓名')
                },
                {
                    field: 'loginName',
                    text: this.$t('用户名')
                },
                {
                    field: 'orgName',
                    text: this.$t('部门'),
                    render: (h, param) => {
                        const row = param.row;
                        if (!row.orgNamePath) {
                            return row.orgName || '--';
                        }
                        return h(
                            'ElTooltip',
                            {
                                props: {
                                    effect: 'dark',
                                    placement: 'right',
                                    content: row.orgNamePath
                                }
                            },
                            [h('span', row.orgName || '--')]
                        );
                    }
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位'),
                    render: (h, param) => {
                        return param.row.positionName
                            ? param.row.positionName
                            : '--';
                    }
                }
            ];
            const orgTableColumns = [
                {
                    field: 'relType',
                    text: this.$t('类型'),
                    width: 100,
                    render: (h, param) => {
                        const relType = param.row.relType;
                        return ORG_TYPE_ENUM[relType].name;
                    }
                },
                {
                    field: 'orgName',
                    text: this.$t('名称'),
                    render: (h, param) => {
                        const row = param.row;
                        if (row.orgRelName) {
                            return row.orgRelName;
                        }
                        return row.name;
                    }
                }
            ];
            return {
                OUT_USER_JOIN_ENUM,
                ORG_TYPE_ENUM,
                userTableColumns,
                orgTableColumns,
                activeName: 'user',
                total: 0,
                listLoading: false,
                userList: [],
                orgList: [],
                listQuery: {
                    funId: this.id,
                    funCode: 'FACE',
                    relType: 'USER',
                    pageSize: 10,
                    pageNum: 1,
                    appCode: 'veln-face',
                    route: 'faceScope'
                },
                enrollId: '',
                assistantList: [],
                applyList: []
            };
        },
        created() {
            this.getUserList();
            this.detail();
            this.getAppCodes();
        },
        methods: {
            // 编辑回显
            detail() {
                const params = {id: this.id};
                detail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.enrollId = result.data.enrollId;
                        this.assistantList = result.data.assistantVoList || [];
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            // 获取公司应用
            getAppCodes() {
                getAppCodes().then(res => {
                    const result = res.data;
                    if (result.length) {
                        this.applyList = result || [];
                    }
                });
            },
            signUpView() {
                this.$router.push({
                    name: 'signUpDetail',
                    query: {
                        sourceId: this.id,
                        source: 'FACE_ENROLL_DETAIL',
                        id: this.enrollId
                    }
                });
            },
            handleClick(tab, event) {
                this.selectedData = [];
                if (tab.name === 'user') {
                    this.listQuery.relType = 'USER';
                    this.getUserList({
                        pageNum: 1
                    });
                } else {
                    this.listQuery.relType = 'ORG';
                    this.getOrgList({
                        pageNum: 1
                    });
                }
                this.activeName = tab.name;
            },
            selectionChange(v) {
                if (this.listQuery.relType === 'USER') {
                    this.selectedData = v;
                } else {
                    this.selectedData = v;
                }
            },
            handleSizeChange(v) {
                if (this.listQuery.relType === 'ORG') {
                    this.getUserList({
                        pageSize: v,
                        pageNum: 1
                    });
                } else {
                    this.getOrgList({
                        pageSize: v,
                        pageNum: 1
                    });
                }
            },
            handleCurrentChange(v) {
                if (this.listQuery.relType === 'USER') {
                    this.getUserList({
                        pageNum: v
                    });
                } else {
                    this.getOrgList({
                        pageNum: v
                    });
                }
            },
            getUserList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                getUserList(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.userList = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getOrgList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                getOrgList(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.orgList = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            edit() {
                this.$emit('editHandle', 'courseParticipants');
            }
        }
    };
</script>
