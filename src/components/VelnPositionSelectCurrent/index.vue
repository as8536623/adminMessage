<style lang="scss" src="./style.scss">
</style>

<template>
    <article v-loading="ajaxTotal" class="veln__position__select--current">
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
                :show-all-select="false"
                :left-data="leftData"
                :left-total="leftTotal"
                :left-page-num="leftPageNum"
                :left-page-size="leftQuery.pageSize"
                :right-data="rightData"
                :show-right-search="false"
                :show-right-page="false"
                @left-page-change="leftPageChange"
                @left-search="leftSearch"
                @left-select="leftSelect"
                @right-select="rightSelect"
                @select="select"
                @remove="remove"
                @remove-all="removeAll"
            />
            <div class="btn__wrapper">
                <el-button type="primary" @click="onSure">{{ $t('确定') }}</el-button>
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
    import {deepClone} from './utils';
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
            // 岗位-获取人员分页数据
            positionUserUrl: {
                type: String,
                default: `${getUcPrefix()}/position/search`
            }
        },
        data() {
            return {
                filterText: '',
                type: 'ORG', // 当前类型 ORG-部门/GROUP-群组/POSITION-岗位
                groupFuncCode: 'uc_group_category', // 获取群组funcCode
                postFuncCode: 'uc_position_category', // 获取岗位funcCode
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
                rightData: [], // 穿梭框右边数据
                rightSelectIds: [], // 右边选择人员IDs
                ajaxTotal: 0,
                activeNode: null,
                rangList: []
            };
        },
        watch: {
            funId(val) {
                this.leftQuery.funId = val;
                this.funId = val;
            },
            ajaxTotal(val) {
                if (val < 0) {
                    this.ajaxTotal = 0;
                }
            }
        },
        mounted() {
            this.getPostData();
            this.getLeftUser();
        },
        methods: {
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
                            this.currentNodeKey = result.data.id;
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
            // 树节点点击事件
            nodeClick({data, node, list, includeChild}) {
                this.activeNode = data;
                this.currentNodeKey = data.id;
            },
            // 左边选择人员
            leftSelect(ids) {
                this.leftSelectIds = ids;
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
            rightSelect(ids) {
                this.rightSelectIds = ids;
            },
            search() {
                this.$refs.tree.filter(this.filterText);
            },
            // 选择人员
            select() {
                if (!this.activeNode) {
                    this.$warnMsg(this.$t('请选择树节点'));
                    return;
                }
                const result = [];
                const copyRightData = deepClone(this.rightData);
                this.leftData.map(item => {
                    if (this.leftSelectIds.includes(item.id)) {
                        const _data = deepClone(item);
                        _data.id = `${_data.id}_${this.activeNode.id}`;
                        result.push(_data);
                    }
                });
                result.map(item => {
                    const filter = copyRightData.filter(right => {
                        return right.id === item.id;
                    });
                    if (!filter.length) {
                        copyRightData.push(item);
                    }
                });
                this.rightData = copyRightData;
                this.$refs.transfer.reset();
            },
            remove() {
                const list = deepClone(this.rightData);
                for (let i = 0; i < list.length; i++) {
                    if (this.rightSelectIds.includes(list[i].id)) {
                        list.splice(i, 1);
                        i--;
                    }
                }

                this.rightData = list;
                this.$refs.transfer.reset();
            },
            removeAll() {
                this.rightData = [];
                this.$refs.transfer.reset();
            },
            onClose() {
                this.$emit('onClose');
            },
            onSure() {
                this.$emit('onSure', this.rightData);
            }
        }
    };
</script>
