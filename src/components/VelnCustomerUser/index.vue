<style lang="scss" src="./style.scss">
</style>

<template>
    <article v-loading="ajaxTotal" class="veln__dgp__select" :class="{'outer': outer}">
        <aside class="dgp--left">
            <header class="dgp__search__wrapper">
                <svg-icon icon-class="search" class-name="dgp__search__icon"/>
                <el-input
                    v-model.trim="filterText"
                    class="dgp__search__npt"
                    :placeholder="$t('输入关键字进行过滤')"
                    @keyup.enter.native="search"
                />
            </header>
            <ul class="dgp__type__ul">
                <li
                    v-if="rangList.includes('ORG')"
                    class="dgp__type__line"
                    :class="{'active': type === 'ORG'}"
                    @click="handleChangeType('ORG')"
                >{{ $t('org') }}</li>
                <li
                    v-if="rangList.includes('GROUP')"
                    class="dgp__type__line"
                    :class="{'active': type === 'GROUP'}"
                    @click="handleChangeType('GROUP')"
                >{{ $t('groupAndCategory') }}</li>
                <li
                    v-if="rangList.includes('POSITION')"
                    class="dgp__type__line"
                    :class="{'active': type === 'POSITION'}"
                    @click="handleChangeType('POSITION')"
                >{{ $t('position') }}</li>
            </ul>
            <section class="dgp__tree">
                <qgu-tree
                    ref="tree"
                    :datalist="treeData"
                    :default-expanded-keys="defaultExpandedKeys"
                    :current-node-key="currentNodeKey"
                    :show-search="false"
                    :show-header="false"
                    @node-click="(data, node, list, includeChild) => {nodeClick({data, node, list, includeChild})}"
                    @include-child-change="includeChildChange"
                />
            </section>
        </aside>
        <div class="dgp--right">
            <veln-transfer
                ref="transfer"
                :left-data="leftData"
                :left-total="leftTotal"
                :left-page-num="leftPageNum"
                :left-page-size="leftQuery.pageSize"
                :right-data="rightData"
                :right-total="rightTotal"
                :right-page-num="rightPageNum"
                :right-page-size="rightQuery.pageSize"
                @left-page-change="leftPageChange"
                @left-search="leftSearch"
                @left-select="leftSelect"
                @right-page-change="rightPageChange"
                @right-search="rightSearch"
                @right-select="rightSelect"
                @select="select"
                @select-all="selectAll"
                @remove="remove"
                @remove-all="removeAll"
            />
            <div class="btn__wrapper">
                <el-button @click="onClose">{{ $t('关闭') }}</el-button>
            </div>
        </div>
    </article>
</template>

<script>
/**
 * 部门-群组-岗位 联合选择组件
 */
    import QguTree from '@/components/QguTree';
    import VelnTransfer from '@/components/VelnTransfer';
    import {getOrgTree} from '@/api/org';
    import {getNodeTree} from '@/api/commonTree';
    import {postData, putData, listRangOrg} from '@/api/customerManagement';
    import {deepClone, deepCloneSimple} from './utils';
    import {getUcPrefix, getUcCode} from '@/utils/ajax';

    export default {
        name: 'VelnCustomerUser',
        components: {
            QguTree,
            VelnTransfer
        },
        props: {
            // appCode
            route: {
                type: String,
                default: ''
            },
            // appCode
            funCode: {
                type: String,
                default: ''
            },
            // appCode
            appCode: {
                type: String,
                default: getUcCode()
            },
            // 角色ID
            funId: {
                type: String,
                default: ''
            },
            optType: {
                type: String,
                default: 'CUSTOMER'
            },
            // 部门-获取人员分页数据
            orgUserUrl: {
                type: String,
                default: `${getUcPrefix()}/customerUserRel/queryUserByPage`
            },
            // 群组-获取人员分页数据
            groupUserUrl: {
                type: String,
                default: `${getUcPrefix()}/customerUserRel/queryUserByPage`
            },
            // 岗位-获取人员分页数据
            positionUserUrl: {
                type: String,
                default: `${getUcPrefix()}/customerUserRel/queryUserByPage`
            },
            // 获取已选人员分页数据
            rightUserUrl: {
                type: String,
                default: `${getUcPrefix()}/customerUserRel/querySelectedUserByPage`
            },
            // 选择人员
            selectUrl: {
                type: String,
                default: `${getUcPrefix()}/customerUserRel/batchAddUserRel`
            },
            // 移除人员
            removeUrl: {
                type: String,
                default: `${getUcPrefix()}/customerUserRel/batchRemoveUserRel`
            },
            outer: {
                type: Boolean,
                default: false
            },
            customerId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                filterText: '',
                type: 'ORG', // 当前类型 ORG-部门/GROUP-群组/POSITION-岗位
                groupFuncCode: 'uc_group_category', // 获取群组funcCode
                postFuncCode: 'uc_position_category', // 获取岗位funcCode
                dTreeData: [], // 部门树 数据源
                gTreeData: [], // 群组树 数据源
                pTreeData: [], // 岗位树 数据源
                treeData: [], // 树
                currentNodeKey: '',
                defaultExpandedKeys: [], // 默认展开树节点
                leftQuery: {
                    // 查询穿梭框左边query
                    category: true,
                    relType: '',
                    keywords: '',
                    relId: '',
                    customerId: this.customerId,
                    userRelList: [],
                    route: this.route,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    funId: this.funId,
                    optType: this.optType,
                    includeChild: true,
                    pageNum: 1,
                    pageSize: 9
                },
                getLeftUrl: '', // 查询穿梭框左边url
                leftData: [], // 穿梭框左边数据
                leftTotal: 0, // 穿梭框左边数据总数
                leftPageNum: 0, // 穿梭框左边页码
                leftSelectIds: [], // 左边选择人员IDs
                rightQuery: {
                    // 查询穿梭框右边query
                    category: true,
                    relType: '',
                    keywords: '',
                    customerId: this.customerId,
                    userRelList: [],
                    route: this.route,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    funId: this.funId,
                    optType: this.optType,
                    includeChild: true,
                    pageNum: 1,
                    pageSize: 9
                },
                rightData: [], // 穿梭框右边数据
                rightTotal: 0, // 穿梭框右边数据总数
                rightPageNum: 0, // 穿梭框右边页码
                rightSelectIds: [], // 右边选择人员IDs
                ajaxTotal: 0,
                rangList: []
            };
        },
        watch: {
            ajaxTotal(val) {
                if (val < 0) {
                    this.ajaxTotal = 0;
                }
            }
        },
        mounted() {
            this.getOrgData();
            this.listRangOrg();
        },
        methods: {
            listRangOrg() {
                this.ajaxTotal++;
                listRangOrg().then(re => {
                    this.ajaxTotal--;
                    const result = re.data;
                    if (result.success) {
                        this.rangList = result.data || [];
                    }
                });
            },
            // 类型修改时
            handleChangeType(type) {
                this.type = type;
                this.leftData = [];
                switch (type) {
                    case 'ORG':
                        this.getOrgData();
                        break;
                    case 'GROUP':
                        this.getGroupData();
                        break;
                    case 'POSITION':
                        this.getPostData();
                        break;
                }
            },
            // 获取部门数据
            getOrgData() {
                // 如果有数据，不再请求
                if (this.dTreeData.length) {
                    this.treeData = deepClone(this.dTreeData);
                    this.defaultExpandedKeys = [];
                    return;
                }

                this.ajaxTotal++;
                getOrgTree()
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.treeData = deepClone([result.data]);
                            this.dTreeData = deepClone([result.data]);
                            this.defaultExpandedKeys = [];
                            const data = {
                                id: this.treeData[0].id
                            };
                            const includeChild = this.leftQuery.includeChild;
                            this.nodeClick({data, includeChild});
                            this.getRightUser();
                        } else {
                            this.$errorMsg(
                                this.$t(result.msg || '获取部门数据出错')
                            );
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            // 获取群组数据
            getGroupData() {
                // 如果有数据，不再请求
                if (this.gTreeData.length) {
                    this.treeData = deepClone(this.gTreeData);
                    this.defaultExpandedKeys = [];
                    return;
                }

                this.ajaxTotal++;
                getNodeTree(this.groupFuncCode)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.treeData = deepClone([result.data]);
                            this.gTreeData = deepClone([result.data]);
                            this.defaultExpandedKeys = [];
                        } else {
                            this.$errorMsg(
                                this.$t(result.msg || '获取部门数据出错')
                            );
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            // 获取岗位数据
            getPostData() {
                // 如果有数据，不再请求
                if (this.pTreeData.length) {
                    this.treeData = deepClone(this.pTreeData);
                    this.defaultExpandedKeys = [];
                    return;
                }

                this.ajaxTotal++;
                getNodeTree(this.postFuncCode)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.treeData = deepClone([result.data]);
                            this.pTreeData = deepClone([result.data]);
                            this.defaultExpandedKeys = [];
                        } else {
                            this.$errorMsg(
                                this.$t(result.msg || '获取部门数据出错')
                            );
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            // 获取待选用户
            getLeftUser() {
                if (!this.leftQuery.relId) {
                    return;
                }
                this.leftQuery.relType = this.type;
                this.ajaxTotal++;
                postData(this.getLeftUrl, this.leftQuery)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.leftData = result.data.list || [];
                            this.leftPageNum = result.data.pageNum;
                            this.leftTotal = result.data.total;
                        } else {
                            this.$errorMsg(
                                this.$t(result.msg || '获取用户数据出错')
                            );
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            // 获取已选用户
            getRightUser() {
                this.leftQuery.relType = this.type;
                this.ajaxTotal++;
                postData(this.rightUserUrl, this.rightQuery)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.rightData = result.data.list || [];
                            this.rightPageNum = result.data.pageNum;
                            this.rightTotal = result.data.total;
                        } else {
                            this.$errorMsg(
                                this.$t(result.msg || '获取已选用户数据出错')
                            );
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            includeChildChange(includeChild) {
                this.leftQuery.includeChild = includeChild;
                this.leftQuery.pageNum = 1;

                this.getLeftUser();
            },
            // 树节点点击事件
            nodeClick({data, node, list, includeChild}) {
                switch (this.type) {
                    case 'ORG':
                        this.getLeftUrl = this.orgUserUrl;
                        break;
                    case 'GROUP':
                        this.getLeftUrl = this.groupUserUrl;
                        break;
                    case 'POSITION':
                        this.getLeftUrl = this.positionUserUrl;
                        break;
                }

                this.leftQuery = {
                    category: true,
                    customerId: this.customerId,
                    keywords: this.leftQuery.keywords,
                    relId: data.id,
                    includeChild,
                    relType: '',
                    route: this.route,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    funId: this.funId,
                    pageNum: 1,
                    pageSize: 9
                };
                this.currentNodeKey = data.id;
                this.getLeftUser();
            },
            // 左侧分页变化
            leftPageChange(pageNum) {
                this.leftQuery.pageNum = pageNum;
                this.getLeftUser();
            },
            // 左边搜索方法
            leftSearch(keywords) {
                this.leftQuery.keywords = keywords;
                this.leftQuery.pageNum = 1;
                this.getLeftUser();
            },
            // 左边选择人员
            leftSelect(ids) {
                this.leftSelectIds = ids;
            },
            // 左侧分页变化
            rightPageChange(pageNum) {
                this.rightQuery.pageNum = pageNum;
                this.getRightUser();
            },
            // 左边搜索方法
            rightSearch(keywords) {
                this.rightQuery.keywords = keywords;
                this.rightQuery.pageNum = 1;
                this.getRightUser();
            },
            // 左边选择人员
            rightSelect(ids) {
                this.rightSelectIds = ids;
            },
            search() {
                this.$refs.tree.filter(this.filterText);
            },
            // 选择人员
            select() {
                if (!this.leftSelectIds.length) {
                    this.$warnMsg(this.$t('请选择待操作数据！'));
                    return;
                }
                const data = deepCloneSimple(this.leftQuery);
                data.userRelList = this.leftSelectIds;
                data.customerId = this.customerId;
                this.ajaxTotal++;
                putData(this.selectUrl, data)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.commonReset(this.$t('保存成功'));
                        } else {
                            this.$errorMsg(
                                this.$t(result.msg || '获取选择人员出错')
                            );
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            selectAll() {
                const data = deepCloneSimple(this.leftQuery);
                data.customerId = this.customerId;
                this.ajaxTotal++;
                putData(this.selectUrl, data)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.commonReset(this.$t('保存成功'));
                        } else {
                            this.$errorMsg(this.$t(result.msg || '保存出错'));
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            remove() {
                if (!this.rightSelectIds.length) {
                    this.$warnMsg(this.$t('请选择待操作数据！'));
                    return;
                }
                const data = {};
                data.customerId = this.customerId;
                data.userRelList = this.rightSelectIds;
                this.ajaxTotal++;
                putData(this.removeUrl, data)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.commonReset(this.$t('移除成功'));
                        } else {
                            this.$errorMsg(this.$t(result.msg || '移除出错'));
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            removeAll() {
                const data = {};
                data.customerId = this.customerId;
                data.userRelList = this.rightSelectIds;
                this.ajaxTotal++;
                putData(this.removeUrl, data)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.commonReset(this.$t('移除成功'));
                        } else {
                            this.$errorMsg(this.$t(result.msg || '移除出错'));
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            commonReset: function(msg) {
                this.$successMsg(msg);

                // 重置搜索条件
                this.leftQuery.keywords = '';
                this.leftQuery.pageNum = 1;
                this.leftSelectIds = [];
                this.getLeftUser();

                this.rightQuery.keywords = '';
                this.rightQuery.pageNum = 1;
                this.rightSelectIds = [];
                this.getRightUser();

                this.$refs.transfer.reset();
            },
            onClose() {
                this.$emit('onClose');
            }
        }
    };
</script>
