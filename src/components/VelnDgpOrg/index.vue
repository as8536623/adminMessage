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
                >{{ $t('org') }}
                </li>
                <li
                    v-if="rangList.includes('GROUP')"
                    class="dgp__type__line"
                    :class="{'active': type === 'GROUP'}"
                    @click="handleChangeType('GROUP')"
                >{{ $t('groupAndCategory') }}
                </li>
                <li
                    v-if="rangList.includes('POSITION')"
                    class="dgp__type__line"
                    :class="{'active': type === 'POSITION'}"
                    @click="handleChangeType('POSITION')"
                >{{ $t('position') }}
                </li>
            </ul>
            <section class="dgp__tree">
                <qgu-tree
                    ref="tree"
                    :datalist="treeData"
                    :default-expanded-keys="defaultExpandedKeys"
                    :current-node-key="currentNodeKey"
                    :show-search="false"
                    :show-header="false"
                    :show-include-child="false"
                    @node-click="(data, node, list, includeChild) => {nodeClick({data, node, list, includeChild})}"
                />
            </section>
        </aside>
        <div class="dgp--right">
            <veln-transfer
                v-if="type==='POSITION'"
                ref="transfer"
                :show-all-select="false"
                :show-all-remove="false"
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
            <veln-transfer-right
                v-if="type!=='POSITION'"
                :right-data="rightData"
                :right-total="rightTotal"
                :right-page-num="rightPageNum"
                :right-page-size="rightQuery.pageSize"
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
    import VelnTransferRight from '@/components/VelnTransferRight';
    import {getOrgTree} from '@/api/org';
    import {getGroupTree} from '@/api/group';
    import {listRangOrg} from '@/api/userComponent';
    import {deepClone, deepCloneSimple} from './utils';
    import {postData} from './api';
    import {getUcCode, getUcPrefix} from '@/utils/ajax';

    export default {
        name: 'VelnDgpOrg',
        components: {
            QguTree,
            VelnTransfer,
            VelnTransferRight
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
            // 部门-获取人员分页数据
            orgUserUrl: {
                type: String,
                default: `${getUcPrefix()}/orgComponent/searchOrg`
            },
            // 群组-获取人员分页数据
            groupUserUrl: {
                type: String,
                default: `${getUcPrefix()}/orgComponent/searchOrg`
            },
            // 岗位-获取人员分页数据
            positionUserUrl: {
                type: String,
                default: `${getUcPrefix()}/position/search`
            },
            // 获取已选人员分页数据
            rightUserUrl: {
                type: String,
                default: `${getUcPrefix()}/orgComponent/searchSelectedOrg`
            },
            // 选择人员
            selectUrl: {
                type: String,
                default: `${getUcPrefix()}/orgComponent/addOrgs`
            },
            // 选择全部人员
            selectAllUrl: {
                type: String,
                default: `${getUcPrefix()}/orgComponent/addAllOrgs`
            },
            // 移除人员
            removeUrl: {
                type: String,
                default: `${getUcPrefix()}/orgComponent/removeOrgs`
            },
            // 移除全部人员
            removeAllUrl: {
                type: String,
                default: `${getUcPrefix()}/orgComponent/removeAllOrgs`
            },
            types: {
                type: Array,
                default: () => {
                    return ['ORG', 'GROUP', 'POSITION'];
                }
            },
            outer: {
                type: Boolean,
                default: false
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
                    relIds: [],
                    route: this.route,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    funId: this.funId,
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
                    relId: '',
                    relIds: [],
                    route: this.route,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    funId: this.funId,
                    includeChild: true,
                    pageNum: 1,
                    pageSize: 9
                },
                rightData: [], // 穿梭框右边数据
                rightTotal: 0, // 穿梭框右边数据总数
                rightPageNum: 0, // 穿梭框右边页码
                rightSelectIds: [], // 右边选择人员IDs
                ajaxTotal: 0,
                activeNode: null,
                rangList: []
            };
        },
        watch: {
            funId(val) {
                this.leftQuery.funId = val;
                this.rightQuery.funId = val;
                this.funId = val;
            },
            ajaxTotal(val) {
                if (val < 0) {
                    this.ajaxTotal = 0;
                }
            }
        },
        mounted() {
            this.getOrgData();
            this.getRightUser();
            this.getLeftUser();
            this.listRangOrg();
        },
        methods: {
            listRangOrg() {
                listRangOrg().then(re => {
                    const result = re.data;
                    if (result.success) {
                        const list = result.data || [];
                        for (let i = 0; i < list.length; i++) {
                            if (!this.types.includes(list[i])) {
                                list.splice(i, 1);
                                i--;
                            }
                        }
                        this.rangList = list || [];
                    }
                });
            },
            // 类型修改时
            handleChangeType(type) {
                this.type = type;
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
                            const includeChild = this.includeChild;
                            this.nodeClick({data, includeChild});
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
                getGroupTree()
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
                getOrgTree()
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
                this.leftQuery.relType = this.type;
                this.ajaxTotal++;
                postData(this.positionUserUrl, this.leftQuery)
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

                this.activeNode = data;

                this.leftQuery = {
                    category: true,
                    keywords: '',
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
                const data = deepCloneSimple(this.leftQuery);
                if (this.type !== 'POSITION') {
                    data.relIds = [data.relId];
                } else {
                    for (let i = 0; i < this.leftSelectIds.length; i++) {
                        this.leftSelectIds[i] = `${this.leftSelectIds[i]}_${this.activeNode.id}`;
                    }
                    data.relIds = this.leftSelectIds;
                }
                if (this.type === 'GROUP' && this.activeNode.category) {
                    data.relType = 'GROUP_CATEGORY';
                    // this.$warnMsg(this.$t('不能添加群组类别！'));
                    // return;
                }
                if (!(Array.isArray(data.relIds) && data.relIds.length)) {
                    this.$warnMsg(this.$t('请选择待操作数据'));
                    return;
                }
                if (data.relType !== 'GROUP_CATEGORY') {
                    data.relType = this.type;
                }
                this.ajaxTotal++;
                postData(this.selectUrl, data)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('保存成功'));

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
                this.ajaxTotal++;
                postData(this.selectAllUrl, data)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('保存成功'));

                            // 重置搜索条件
                            this.leftQuery.keywords = '';
                            this.leftQuery.pageNum = 1;
                            this.leftSelectIds = [];
                            this.getLeftUser();

                            this.rightQuery.keywords = '';
                            this.rightQuery.pageNum = 1;
                            this.rightSelectIds = [];
                            this.getRightUser();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '保存出错'));
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            remove() {
                const data = deepCloneSimple(this.rightQuery);
                data.relIds = this.rightSelectIds;
                if (!data.relIds.length) {
                    this.$warnMsg(this.$t('请选择待操作的数据'));
                    return;
                }
                this.ajaxTotal++;
                postData(this.removeUrl, data)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('移除成功'));

                            // 重置搜索条件
                            this.leftQuery.keywords = '';
                            this.leftQuery.pageNum = 1;
                            this.leftSelectIds = [];
                            this.getLeftUser();

                            this.rightQuery.keywords = '';
                            this.rightQuery.pageNum = 1;
                            this.rightSelectIds = [];
                            this.getRightUser();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '移除出错'));
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            removeAll() {
                const data = deepCloneSimple(this.rightQuery);
                data.relIds = this.rightSelectIds;
                this.ajaxTotal++;
                postData(this.removeAllUrl, data)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('移除成功'));

                            // 重置搜索条件
                            this.leftQuery.keywords = '';
                            this.leftQuery.pageNum = 1;
                            this.leftSelectIds = [];
                            this.getLeftUser();

                            this.rightQuery.keywords = '';
                            this.rightQuery.pageNum = 1;
                            this.rightSelectIds = [];
                            this.getRightUser();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '移除出错'));
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            onClose() {
                this.$emit('onClose');
            }
        }
    };
</script>
