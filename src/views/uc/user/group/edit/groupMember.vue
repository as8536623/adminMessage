<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="group__member__wrapper app-container">
        <el-form :model="listQuery" :inline-message="true">
            <el-form-item>
                <el-tabs v-model="activeName">
                    <el-tab-pane :label="$t('指定人员')" name="first">
                        <section v-if="type!=='VIEW'" class="opt__line">
                            <el-button type="primary" @click="addUser">{{ $t('添加人员') }}</el-button>
                            <el-button @click="batchDel()">{{ $t('删除') }}</el-button>
                        </section>
                        <qgu-table
                            :columns="tableColumns"
                            :data="list"
                            :page="listQuery"
                            :total="total"
                            :loading="listLoading"
                            class="veln__table"
                            @selection-change="selectionChange"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                    </el-tab-pane>
                    <el-tab-pane :label="$t('设置条件')" name="second">
                        <div
                            v-for="(item, index) in dynamicGroupList"
                            :key="'dynamic' + index"
                            class="veln__dynamic__have__select"
                        >
                            <div class="select__item">
                                <label class="select__label">{{ $t('已选择') }}：</label>
                                <div class="veln__ynamic__desc">{{ item }}</div>
                                <div class="select__right__icon" style="display: none">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        :content="$t('编辑')"
                                        placement="top"
                                    >
                                        <svg-icon
                                            class-name="veln__ynamic__icon"
                                            icon-class="edit_p"
                                            @click.native="editHandle(index)"
                                        />
                                    </el-tooltip>
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        :content="$t('删除')"
                                        placement="top"
                                    >
                                        <svg-icon
                                            class-name="veln__ynamic__icon"
                                            icon-class="del"
                                            @click.native="delHandle(index)"
                                        />
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <veln-dynamic-group
                            v-for="(group, index) in groupList"
                            v-show="activeIndex === index"
                            :key="index"
                            ref="group"
                            :index="index"
                            :data="group"
                            :type="type"
                            @delDynamic="delDynamicHandle"
                        />
                        <div
                            v-if="type==='VIEW' && !groupList.length"
                            class="empty__text"
                        >{{ $t('暂无数据') }}
                        </div>
                        <div
                            v-if="type !== 'VIEW'"
                            class="veln__dynamic__select"
                            @click="addDynamic"
                        >
                            <div class="veln__dynamic__select__btn">
                                <svg-icon class-name="select__icon" icon-class="add"/>
                                <span class="select__btn">{{ $t('选择条件') }}</span>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>
            <section
                v-if="type!=='VIEW' && type==='ADD'"
                class="text--center"
                style="margin-top: 20px"
            >
                <el-button @click="cancel">上一步</el-button>
                <el-button type="primary" @click="onSure(false)">保存</el-button>
                <el-button type="primary" @click="onSure(true)">{{ $t('保存并启用') }}</el-button>
            </section>
            <section v-if="type!=='VIEW' && type!=='ADD'" class="text--center">
                <el-button type="primary" @click="onSure(false)">保存</el-button>
            </section>
        </el-form>
        <el-dialog
            v-if="dgpDialogVisible"
            :key="dgpUserKey"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                route="groupMember"
                :fun-id="editQuery.groupId"
                @onClose="handleUserClose"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnDgpUser from '@/components/VelnDgpUser';
    import VelnDynamicGroup from '@/components/VelnDynamicGroup';
    import {deleteUsers, groupMemberPage} from '@/api/groupMember';
    import {editGroupMember, enabledGroup} from '@/api/group';
    import {PERSON_STATUS_ENUM} from '@/enum';
    import moment from 'moment';

    export default {
        name: 'GroupEdit',
        components: {
            VelnDgpUser,
            VelnDynamicGroup
        },
        props: {
            groupId: {
                type: String,
                default: ''
            },
            gcpList: {
                type: Array,
                default() {
                    return [];
                }
            },
            orgIdNameMap: {
                type: Object,
                default() {
                    return {};
                }
            },
            posIdNameMap: {
                type: Object,
                default() {
                    return {};
                }
            },
            type: {
                type: String,
                default: ''
            }
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'code',
                    text: this.$t('工号'),
                    minWidth: 120
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
                    minWidth: 110,
                    render: (h, param) => {
                        return param.row.mobile ? param.row.mobile : '--';
                    }
                },
                {
                    field: 'positionName',
                    text: this.$t('岗位'),
                    minWidth: 110,
                    render: (h, param) => {
                        return param.row.positionName
                            ? param.row.positionName
                            : '--';
                    }
                },
                {
                    field: 'orgName',
                    text: this.$t('部门'),
                    minWidth: 120,
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
                    field: 'status',
                    text: this.$t('状态'),
                    render: (h, param) => {
                        const status = param.row.status;
                        return status ? PERSON_STATUS_ENUM[status].name : '--';
                    }
                }
            ];
            return {
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    groupId: this.groupId,
                    source: 'APPOINT',
                    name: '',
                    pageNum: 1,
                    pageSize: 20
                },
                editQuery: {
                    groupId: this.groupId
                },
                activeName: 'first',
                multiSelection: [],
                dialogVisible: false,
                dgpDialogVisible: false,
                dgpUserKey: null,
                groupList: [], // 动态群组
                dynamicGroupList: [], // 动态群组生成
                activeIndex: 0
            };
        },
        // created() {
        //     this.getList();
        // },
        watch: {
            groupId: {
                handler(val) {
                    this.listQuery.groupId = val;
                    this.editQuery.groupId = val;
                    this.dgpUserKey = +new Date();
                    this.getList({pageNum: 1});
                },
                immediate: true
            },
            gcpList: {
                handler(val) {
                    this.gcpListHandle();
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
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
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                groupMemberPage(params).then(re => {
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
            cancel() {
                this.$emit('last');
            },
            // 添加人员关闭
            handleUserClose() {
                this.dgpDialogVisible = false;
                this.getList({pageNum: 1});
            },
            // 添加人员
            addUser() {
                this.dgpDialogVisible = true;
            },
            batchDel() {
                const selectedData = this.multiSelection;
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

                    const params = {};
                    params.userIds = selectedIds;
                    params.groupId = this.editQuery.groupId;
                    params.source = 'APPOINT';
                    deleteUsers(params).then(re => {
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
            // 动态人员--添加条件
            onSure(flag) {
                // 表单验证
                const dFlag = this.dynamicFormJudge();
                if (dFlag) {
                    const list = [];
                    this.$refs.group &&
                        this.$refs.group.map((item, index) => {
                            if (item.data.checkList.length > 0) {
                                const {
                                    entryRange,
                                    leftMonth,
                                    rightMonth,
                                    deptList,
                                    postList,
                                    ageRange,
                                    leftAge,
                                    rightAge,
                                    checkList
                                } = item.data;
                                const obj = {
                                    org: false,
                                    pos: false,
                                    age: false,
                                    ent: false,
                                    showOrder: 0
                                };
                                const dList = [];
                                const pList = [];
                                deptList.map(dept => {
                                    dList.push(dept.id);
                                });
                                postList.map(post => {
                                    pList.push(post.id);
                                });
                                obj.showOrder = index;
                                checkList.includes('dept')
                                    ? (obj.org = true)
                                    : null;
                                obj.org ? (obj.orgIds = dList.join(',')) : null;
                                checkList.includes('post')
                                    ? (obj.pos = true)
                                    : null;
                                obj.pos ? (obj.posIds = pList.join(',')) : '';
                                checkList.indexOf('age') > -1
                                    ? (obj.age = true)
                                    : null;
                                let ageList = [];
                                ageRange === 'bt'
                                    ? (ageList = [ageRange, leftAge, rightAge])
                                    : (ageList = [ageRange, rightAge]);
                                obj.age ? (obj.ageCon = ageList.join(',')) : null;
                                checkList.includes('entry')
                                    ? (obj.ent = true)
                                    : null;
                                let entryList = [];
                                entryRange === 'bt'
                                    ? (entryList = [
                                        'MONTH',
                                        entryRange,
                                        leftMonth,
                                        rightMonth
                                    ])
                                    : (entryList = [
                                        'MONTH',
                                        entryRange,
                                        rightMonth
                                    ]);
                                obj.ent ? (obj.entCon = entryList.join(',')) : null;
                                list.push(obj);
                            }
                        });
                    const params = {
                        gcpList: list,
                        id: this.groupId
                    };
                    if (this.$store.getters.ajaxIng) {
                        return;
                    }
                    this.$store.dispatch('setAjaxIng', true);
                    this.listLoading = true;
                    editGroupMember(params).then(re => {
                        const result = re.data;
                        if (result && result.success) {
                            this.$store.dispatch('setAjaxIng', false);
                            this.$successMsg(this.$t('保存成功'));
                            if (flag) {
                                const params = [];
                                params.push(this.groupId);
                                enabledGroup(params).then(re => {
                                    const result = re.data;
                                    if (result.success) {
                                        this.$successMsg(this.$t('启用成功'));
                                    } else {
                                        this.$errorMsg(
                                            this.$t(result.msg || '启用失败')
                                        );
                                    }
                                });
                            }
                            if (this.type === 'ADD') {
                                this.$router.push({name: 'groupManage'});
                            } else {
                                this.dynamicHandle();
                            }
                        } else {
                            this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                        }
                        this.listLoading = false;
                    });
                }
            },
            // 动态人员--添加条件
            addDynamic() {
                // 表单验证
                const flag = this.dynamicFormJudge();
                if (flag) {
                    // 动态生成数据
                    this.dynamicHandle();
                }
                if (!this.$refs.group || flag) {
                    const data = Object.assign({}, this.getDataObject());
                    this.groupList.push(data);
                    this.activeIndex = this.groupList.length - 1;
                }
            },
            // 动态人员--删除
            delDynamicHandle(index) {
                this.groupList.splice(index, 1);
                this.dynamicGroupList.splice(index, 1);
                this.$successMsg(this.$t('删除成功'));
            },
            // 时间处理
            dateHandle(month) {
                return moment()
                    .subtract(month, 'months')
                    .format('YYYY.MM.DD');
            },
            // 动态生成数据
            dynamicHandle() {
                this.dynamicGroupList = [];
                this.$refs.group &&
                    this.$refs.group.map(item => {
                        const desc = this.dynamicGroupDescHandle(item.data);
                        this.dynamicGroupList.push(desc);
                    });
            },
            // 生成文字
            dynamicGroupDescHandle(data) {
                const {
                    entryRange,
                    leftMonth,
                    rightMonth,
                    deptList,
                    postList,
                    ageRange,
                    leftAge,
                    rightAge,
                    checkList
                } = data;
                const list = [];
                if (checkList.includes('entry')) {
                    let yearStr = '';
                    switch (entryRange) {
                        case 'gt':
                            yearStr +=
                                this.dateHandle(Number(rightMonth)) + '之后入职';
                            break;
                        case 'bt':
                            yearStr +=
                                this.dateHandle(Number(leftMonth)) +
                                '-' +
                                this.dateHandle(Number(rightMonth)) +
                                '期间入职';
                            break;
                        case 'lt':
                            yearStr +=
                                '早于' +
                                this.dateHandle(Number(rightMonth)) +
                                '入职';
                            break;
                        case 'et':
                            yearStr += this.dateHandle(Number(rightMonth)) + '入职';
                            break;
                        default:
                            break;
                    }
                    yearStr ? list.push(yearStr) : null;
                }
                const dList = [];
                const pList = [];
                deptList.map(item => {
                    dList.push(item.name);
                });
                postList.map(item => {
                    pList.push(item.name);
                });
                dList.length > 0 ? list.push(dList.join('和')) : null;
                pList.length > 0 ? list.push(pList.join('和')) : null;
                const str1 = list.join('的');
                const list2 = [];
                str1 ? list2.push(str1) : null;
                if (checkList.includes('age')) {
                    let age = '';
                    switch (ageRange) {
                        case 'gt':
                            age += '要求年龄大于等于' + rightAge + '岁';
                            break;
                        case 'bt':
                            age +=
                                '要求年龄介于' +
                                leftAge +
                                '-' +
                                rightAge +
                                '岁期间';
                            break;
                        case 'lt':
                            age += '要求年龄小于等于' + rightAge + '岁';
                            break;
                        case 'et':
                            age += '要求年龄等于' + rightAge + '岁';
                            break;
                        default:
                            break;
                    }
                    age ? list2.push(age) : null;
                }
                return list2.join('，');
            },
            // 动态人员验证
            dynamicFormJudge() {
                if (!this.$refs.group) {
                    return true;
                }
                for (let i = 0; i < this.$refs.group.length; i++) {
                    if (
                        !this.$refs.group[i].formValidate() ||
                        this.$refs.group[i].data.checkList.length <= 0
                    ) {
                        this.$warnMsg(this.$t('请完善信息'));
                        return false;
                    }
                }
                return true;
            },
            // 删除动态人员
            delHandle(index) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    this.groupList.splice(index, 1);
                    this.dynamicGroupList.splice(index, 1);
                    this.$successMsg(this.$t('删除成功'));
                });
            },
            // 删除空的动态人员
            delNoCheckDynamicHandle() {
                if (!this.$refs.group) {
                    return false;
                }
                for (let i = 0; i < this.$refs.group.length; i++) {
                    if (this.$refs.group[i].data.checkList.length <= 0) {
                        this.groupList.splice(i, 1);
                    }
                }
            },
            // 编辑动态人员
            editHandle(index) {
                this.delNoCheckDynamicHandle();
                this.activeIndex = index;
            },
            // 动态人员回显
            gcpListHandle() {
                this.activeIndex = -1;
                this.gcpList &&
                    this.gcpList.map(item => {
                        const {
                            orgIds,
                            org,
                            posIds,
                            pos,
                            age,
                            ageCon,
                            ent,
                            entCon
                        } = item;
                        const data = Object.assign({}, this.getDataObject());
                        if (org) {
                            data.checkList.push('dept');
                            const dList = orgIds.split(',');
                            for (const [id, name] of Object.entries(
                                this.orgIdNameMap
                            )) {
                                if (dList.includes(id)) {
                                    const obj = {id, name};
                                    data.deptList.push(obj);
                                }
                            }
                        }
                        if (pos) {
                            data.checkList.push('post');
                            const pList = posIds.split(',');
                            for (const [id, name] of Object.entries(
                                this.posIdNameMap
                            )) {
                                if (pList.includes(id)) {
                                    const obj = {id, name};
                                    data.postList.push(obj);
                                }
                            }
                        }
                        if (age) {
                            data.checkList.push('age');
                            const ageList = ageCon.split(',');
                            data.ageRange = ageList[0];
                            if (data.ageRange === 'bt') {
                                data.leftAge = ageList[1];
                                data.rightAge = ageList[2];
                            } else {
                                data.rightAge = ageList[1];
                            }
                        }
                        if (ent) {
                            data.checkList.push('entry');
                            const entList = entCon.split(',');
                            data.entryRange = entList[1];
                            if (data.entryRange === 'bt') {
                                data.leftMonth = entList[2];
                                data.rightMonth = entList[3];
                            } else {
                                data.rightMonth = entList[2];
                            }
                        }
                        this.groupList.push(data);
                        const desc = this.dynamicGroupDescHandle(data);
                        this.dynamicGroupList.push(desc);
                    });
            },
            getDataObject() {
                const data = {
                    checkList: [],
                    deptList: [],
                    postList: [],
                    ageRange: 'bt',
                    leftAge: '',
                    rightAge: '',
                    year: '',
                    entryRange: 'bt',
                    leftMonth: '',
                    rightMonth: ''
                };
                return data;
            }
        }
    };
</script>
