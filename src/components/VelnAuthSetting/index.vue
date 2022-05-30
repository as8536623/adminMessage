<style lang="scss" src="./style.scss">
</style>

<template>
    <article v-loading="ajaxTotal" class="veln__auth__setting" :class="{'outer': outer}">
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
    import {roleListAll} from '@/api/role';
    import {deepCloneSimple} from './utils';
    import {postData} from './api';
    import {getUcPrefix, getUcCode} from '@/utils/ajax';

    export default {
        name: 'VelnDgpOrg',
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
            relType: {
                type: String,
                default: 'USER'
            },
            optType: {
                type: String,
                default: 'USER'
            },
            // 部门-获取人员分页数据
            leftUserUrl: {
                type: String,
                default: `${getUcPrefix()}/userComponent/searchUser`
            },
            // 获取已选人员分页数据
            rightUserUrl: {
                type: String,
                default: `${getUcPrefix()}/userComponent/searchSelectedUser`
            },
            // 选择人员
            selectUrl: {
                type: String,
                default: `${getUcPrefix()}/userComponent/addUsers`
            },
            // 选择全部人员
            selectAllUrl: {
                type: String,
                default: `${getUcPrefix()}/userComponent/addAllUsers`
            },
            // 移除人员
            removeUrl: {
                type: String,
                default: `${getUcPrefix()}/userComponent/removeUsers`
            },
            // 移除全部人员
            removeAllUrl: {
                type: String,
                default: `${getUcPrefix()}/userComponent/removeAllUsers`
            },
            outer: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                filterText: '',
                type: 'ROLE',
                groupFuncCode: 'uc_group_category', // 获取群组funcCode
                postFuncCode: 'uc_position_category', // 获取岗位funcCode
                treeData: [
                    {
                        id: '0',
                        name: '管理员',
                        isRoot: true,
                        manage: true,
                        child: []
                    }
                ], // 树
                currentNodeKey: '',
                defaultExpandedKeys: [], // 默认展开树节点
                leftQuery: {
                    // 查询穿梭框左边query
                    category: true,
                    manage: true,
                    relType: 'ROLE',
                    keywords: '',
                    relId: '',
                    relIds: [],
                    route: this.route,
                    optType: this.optType,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    funId: this.funId,
                    includeChild: true,
                    pageNum: 1,
                    pageSize: 9
                },
                getLeftUrl: `${getUcPrefix()}/userComponent/searchUser`, // 查询穿梭框左边url
                leftData: [], // 穿梭框左边数据
                leftTotal: 0, // 穿梭框左边数据总数
                leftPageNum: 0, // 穿梭框左边页码
                leftSelectIds: [], // 左边选择人员IDs
                rightQuery: {
                    // 查询穿梭框右边query
                    category: true,
                    relType: this.relType,
                    keywords: '',
                    relId: '',
                    relIds: [],
                    route: this.route,
                    optType: this.optType,
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
                rangList: []
            };
        },
        watch: {
            relType: {
                handler(val) {
                    this.rightQuery.type = val;
                },
                immediate: true
            },
            funId: {
                handler(val) {
                    this.leftQuery.funId = this.rightQuery.funId = val;
                },
                immediate: true
            },
            ajaxTotal(val) {
                if (val < 0) {
                    this.ajaxTotal = 0;
                }
            }
        },
        mounted() {
            this.getRoleData();
        },
        methods: {
            // 获取部门数据
            getRoleData() {
                this.ajaxTotal++;
                const params = {
                    manage: true
                };
                roleListAll(params)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.treeData[0].child = result.data;
                            this.defaultExpandedKeys = ['0'];
                            const data = this.treeData[0];
                            this.nodeClick({data});
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
            // 获取待选用户
            getLeftUser() {
                this.leftQuery.relType = this.type;
                this.leftQuery.relId =
                    this.leftQuery.relId === '0' ? '' : this.leftQuery.relId;
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
                this.rightQuery.relType = this.relType;
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
                this.leftQuery = {
                    category: true,
                    manage: true,
                    keywords: this.leftQuery.keywords,
                    relId: data.id,
                    includeChild,
                    optType: this.optType,
                    relType: this.relType,
                    route: this.route,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    funId: this.funId,
                    pageNum: 1,
                    pageSize: 9
                };

                this.rightQuery.relId = data.id;

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
                this.leftQuery.relType = this.relType;
                const data = deepCloneSimple(this.leftQuery);
                data.relIds = this.leftSelectIds;
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
                this.leftQuery.relType = this.type;
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

                            this.$refs.transfer.reset();
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
                this.rightQuery.relType = this.relType;
                const data = deepCloneSimple(this.rightQuery);
                data.relIds = this.rightSelectIds;
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

                            this.$refs.transfer.reset();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '移除出错'));
                        }
                    })
                    .catch(() => {
                        this.ajaxTotal--;
                    });
            },
            removeAll() {
                this.rightQuery.relType = this.relType;
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

                            this.$refs.transfer.reset();
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
