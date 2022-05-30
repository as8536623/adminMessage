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
    import {listBankTree} from '@/api/exam/item/item';
    import {deepClone, deepCloneSimple} from './utils';
    import {postData} from './api';
    import {TEST_QUESTION_TYPE_ENUM} from '@/enum';
    import ac from '@/utils/appCodes';

    const appCodes = ac.getAppCodes();

    export default {
        name: 'VelnDgpUser',
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
                default: 'ITEM_BANK'
            },
            // appCode
            appCode: {
                type: String,
                default: appCodes.pe + '/pe/'
            },
            // 角色ID
            funId: {
                type: String,
                default: ''
            },
            // 待选试题
            leftTestQuestionUrl: {
                type: String,
                default: `${process.env.BASE_API}/${appCodes.pe}/pe/selectItem/searchItem`
            },
            // 获取已选人员分页数据
            rightTestQuestionUrl: {
                type: String,
                default: `${process.env.BASE_API}/${appCodes.pe}/pe/selectItem/searchSelectedItem`
            },
            // 选择试题
            selectUrl: {
                type: String,
                default: `${process.env.BASE_API}/${appCodes.pe}/pe/selectItem/addItems`
            },
            // 选择全部试题
            selectAllUrl: {
                type: String,
                default: `${process.env.BASE_API}/${appCodes.pe}/pe/selectItem/addAllItems`
            },
            // 移除试题
            removeUrl: {
                type: String,
                default: `${process.env.BASE_API}/${appCodes.pe}/pe/selectItem/removeItems`
            },
            // 移除全部
            removeAllUrl: {
                type: String,
                default: `${process.env.BASE_API}/${appCodes.pe}/pe/selectItem/removeAllItems`
            },
            outer: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                appCodes: this.$appCodes,
                TEST_QUESTION_TYPE_ENUM,
                filterText: '',
                groupFuncCode: 'uc_group_category', // 获取群组funcCode
                postFuncCode: 'uc_position_category', // 获取岗位funcCode
                dTreeData: [], // 树 数据源
                treeData: [], // 树
                currentNodeKey: '',
                defaultExpandedKeys: [], // 默认展开树节点
                leftQuery: {
                    // 查询穿梭框左边query
                    category: true,
                    relType: '',
                    keywords: '',
                    funId: this.funId,
                    relIds: [],
                    route: this.route,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    relId: '',
                    includeChild: true,
                    pageNum: 1,
                    pageSize: 9,
                    itemBankId: ''
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
                    funId: this.funId,
                    relIds: [],
                    route: this.route,
                    funCode: this.funCode,
                    appCode: this.appCode,
                    relId: '',
                    includeChild: true,
                    pageNum: 1,
                    pageSize: 9,
                    itemBankId: ''
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
            this.getTreeData();
        },
        methods: {
            // 获取试题数类别数据
            getTreeData() {
                // 如果有数据，不再请求
                if (this.dTreeData.length) {
                    this.treeData = deepClone(this.dTreeData);
                    this.defaultExpandedKeys = [];
                    return;
                }

                this.ajaxTotal++;
                listBankTree()
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.treeData = deepClone([result.data]);
                            this.dTreeData = deepClone([result.data]);
                            this.defaultExpandedKeys = [];
                            const data = {
                                id: this.treeData[0].id,
                                category: this.treeData[0].category
                            };
                            const includeChild = this.leftQuery.includeChild;
                            this.nodeClick({data, includeChild});
                            this.getRightData();
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
            // 获取待选试题
            getLeftDate() {
                if (!this.leftQuery.relId) {
                    return;
                }
                this.leftQuery.relType = this.type;
                this.ajaxTotal++;
                postData(this.leftTestQuestionUrl, this.leftQuery)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.leftData = result.data ? result.data.list || [] : [];
                            this.leftData.map(item => {
                                item.name = `[${this.TEST_QUESTION_TYPE_ENUM.getName(
                                    item.type
                                )}] ${item.stemOutline}`;
                            });
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
            // 获取已选试题
            getRightData() {
                this.leftQuery.relType = this.type;
                this.ajaxTotal++;
                postData(this.rightTestQuestionUrl, this.rightQuery)
                    .then(re => {
                        this.ajaxTotal--;
                        const result = re.data;
                        if (result.success) {
                            this.rightData = result.data ? result.data.list || [] : [];
                            this.rightData.map(item => {
                                item.name = `[${this.TEST_QUESTION_TYPE_ENUM.getName(
                                    item.type
                                )}] ${item.stemOutline}`;
                            });
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
                this.getLeftDate();
            },
            // 树节点点击事件
            nodeClick({data, node, list, includeChild}) {
                this.leftQuery = {
                    category: data.category,
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
                this.rightQuery.relId = data.id;
                this.rightQuery.category = data.category;
                // if (!data.includeChild && data.id !== '*') {
                //     this.leftQuery.itemBankId = data.id;
                //     this.rightQuery.itemBankId = data.id;
                // }
                this.currentNodeKey = data.id;
                this.getLeftDate();
            },
            // 左侧分页变化
            leftPageChange(pageNum) {
                this.leftQuery.pageNum = pageNum;
                this.getLeftDate();
            },
            // 左边搜索方法
            leftSearch(keywords) {
                this.leftQuery.keywords = keywords;
                this.leftQuery.pageNum = 1;
                this.getLeftDate();
            },
            // 左边选择试题
            leftSelect(ids) {
                this.leftSelectIds = ids;
            },
            // 左侧分页变化
            rightPageChange(pageNum) {
                this.rightQuery.pageNum = pageNum;
                this.getRightData();
            },
            // 左边搜索方法
            rightSearch(keywords) {
                this.rightQuery.keywords = keywords;
                this.rightQuery.pageNum = 1;
                this.getRightData();
            },
            // 左边选择试题
            rightSelect(ids) {
                this.rightSelectIds = ids;
            },
            search() {
                this.$refs.tree.filter(this.filterText);
            },
            // 选择试题
            select() {
                if (!this.leftSelectIds.length) {
                    this.$warnMsg(this.$t('请选择待操作数据！'));
                    return;
                }
                const data = deepCloneSimple(this.leftQuery);
                data.relIds = this.leftSelectIds;
                data.id = data.templateId;
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
                            this.getLeftDate();

                            this.rightQuery.keywords = '';
                            this.rightQuery.pageNum = 1;
                            this.rightSelectIds = [];
                            this.getRightData();

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
                            this.getLeftDate();

                            this.rightQuery.keywords = '';
                            this.rightQuery.pageNum = 1;
                            this.rightSelectIds = [];
                            this.getRightData();

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
                const data = deepCloneSimple(this.rightQuery);
                data.relIds = this.rightSelectIds;
                data.id = data.templateId;
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
                            this.getLeftDate();

                            this.rightQuery.keywords = '';
                            this.rightQuery.pageNum = 1;
                            this.rightSelectIds = [];
                            this.getRightData();

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
                            this.getLeftDate();

                            this.rightQuery.keywords = '';
                            this.rightQuery.pageNum = 1;
                            this.rightSelectIds = [];
                            this.getRightData();

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
