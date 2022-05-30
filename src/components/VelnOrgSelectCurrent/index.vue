<style lang="scss" src='./style.scss'>
</style>

<template>
    <article v-loading="ajaxTotal" class="veln__org__select--current">
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
            <veln-transfer-right
                ref="transfer"
                node-key="id"
                :right-data="rightData"
                :show-page="false"
                :show-search="false"
                @right-select="rightSelect"
                @select="select"
                @remove="remove"
            />
            <div class="btn__wrapper">
                <el-button @click="onClose">{{ $t('关闭') }}</el-button>
                <el-button type="primary" @click="onSure">{{ $t('确定') }}</el-button>
            </div>
        </div>
    </article>
</template>

<script>
/**
 * 实时选择部门组件
 */
    import QguTree from '@/components/QguTree';
    import VelnTransferRight from '@/components/VelnTransferRight';
    import {getOrgTree} from '@/api/org';
    import {deepClone} from './utils';

    export default {
        name: 'VelnOrgSelectCurrent',
        components: {
            QguTree,
            VelnTransferRight
        },
        data() {
            return {
                filterText: '',
                dTreeData: [], // 部门树 数据源
                treeData: [], // 树
                currentNodeKey: '',
                defaultExpandedKeys: [], // 默认展开树节点
                rightData: [], // 穿梭框右边数据
                rightSelectIds: [], // 右边选择人员IDs
                ajaxTotal: 0,
                activeNode: null
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
        },
        methods: {
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
            // 树节点点击事件
            nodeClick({data, node, list, includeChild}) {
                this.activeNode = data;
                this.currentNodeKey = data.id;
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
                const nodeCopy = deepClone(this.activeNode);
                const list = deepClone(this.rightData);
                let index = -1;
                list.map((item, idx) => {
                    if (item.id === nodeCopy.id) {
                        index = idx;
                    }
                });
                if (index === -1) {
                    list.push(nodeCopy);
                    this.rightData = list;
                }
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
            onClose() {
                this.$emit('onClose');
            },
            onSure() {
                this.$emit('onSure', this.rightData);
            }
        }
    };
</script>
