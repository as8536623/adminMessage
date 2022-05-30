<style scoped lang="scss">
    @import 'style.scss';
</style>

<template>
    <div :key="renderKey" class="l-workflow">
        <div v-for="(node, idx) in flow.children" :key="idx">
            <apply-node
                v-if="node.type === 'apply'"
                :data="node"
                :index="idx"
                :parent="flow"
                @add="handleNodeAdd"
            />
            <audit-node
                v-if="node.type === 'audit'"
                :data="node"
                :index="idx"
                :parent="flow"
                @click="handleNodeClick"
                @add="handleNodeAdd"
                @delete="handleNodeDelete"
            />
            <cc-node
                v-if="node.type === 'cc'"
                :data="node"
                :index="idx"
                :parent="flow"
                @click="handleNodeClick"
                @add="handleNodeAdd"
                @delete="handleNodeDelete"
            />
            <condition-tree
                v-if="node.type === 'condition'"
                :data="node"
                :index="idx"
                :parent="flow"
                @click="handleNodeClick"
                @add="handleNodeAdd"
                @add-branch="handleAddBranch"
                @delete="handleNodeDelete"
                @cond-delete="handleNodeDelete"
            />
        </div>
        <finish-node/>

        <el-drawer
            v-if="drawerVisible"
            class="workflow__drawer"
            :title="drawerTitle"
            :visible.sync="drawerVisible"
            :direction="direction"
        >
            <audit-setting
                v-if="drawerVisible && activeNode && activeNode.type==='audit'"
                :process-model-id="$parent.editQuery.id"
                :process-node-id="activeNode.id"
            />
            <cc-setting
                v-if="drawerVisible && activeNode && activeNode.type==='cc'"
                :process-model-id="$parent.editQuery.id"
                :process-node-id="activeNode.id"
            />
        </el-drawer>
    </div>
</template>

<script>
    import {TYPE_ENUM} from './enum';
    import {deepClone, getRandomString} from './utils';
    // 节点组件
    import ApplyNode from './components/ApplyNode';
    import AuditNode from './components/AuditNode';
    import CcNode from './components/CcNode';
    import FinishNode from './components/FinishNode';
    import ConditionTree from './components/ConditionTree';
    // 设置组件
    import AuditSetting from './components/AuditSetting';
    import CcSetting from './components/CcSetting';
    import template from './temp';

    export default {
        name: 'Workflow',
        components: {
            ApplyNode,
            AuditNode,
            CcNode,
            FinishNode,
            ConditionTree,
            AuditSetting,
            CcSetting
        },
        props: {
            canEdit: {
                type: Boolean,
                default: true
            },
            editQuery: {
                type: Object,
                default() {
                    return {
                        id: '',
                        name: '空模板',
                        desc: '',
                        type: '',
                        defKey: '',
                        appCode: '',
                        categoryId: '',
                        mateInfo: '',
                        nodes: []
                    };
                }
            },
            flowData: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        data() {
            return {
                flow: {
                    children: [
                        {
                            id: 'START_USER_ADJUSTMENT_NODE',
                            type: 'apply',
                            nodeType: 'USER_TASK',
                            name: '发起人',
                            field: {}
                        },
                        {
                            id: getRandomString(),
                            type: 'finish',
                            nodeType: 'END_EVENT',
                            name: '流程结束',
                            field: {}
                        }
                    ]
                },
                nodeList: [],
                nodeIdList: [],
                lineList: [],
                index: 0,
                drawerTitle: '',
                drawerVisible: false,
                direction: 'rtl',
                settingQuery: {
                    nameStr: '',
                    idStr: ''
                },
                activeNode: null,
                activeTab: 'setting',
                renderKey: null
            };
        },
        watch: {
            flowData: {
                handler(v) {
                    if (v) {
                        this.flow = v;
                    }
                },
                immediate: true,
                deep: true
            }
        },
        mounted() {
        },
        methods: {
            reRender() {
                this.renderKey = +new Date();
            },
            // 点击 Node 用于编辑
            handleNodeClick(data) {
                if (!this.canEdit) {
                    return;
                }
                this.drawerTitle = TYPE_ENUM[data.type];
                this.drawerVisible = true;
                this.activeNode = data;
                console.log(data);
            },
            // 新增节点
            handleNodeAdd(parent, index, type) {
                if (!this.canEdit) {
                    return;
                }
                const temp = deepClone(template[`${type.toUpperCase()}_TEMP`]);
                if (type !== 'condition') {
                    temp.id = getRandomString();
                    parent.children.splice(index + 1, 0, temp);
                    return;
                }

                temp.children.map(node => {
                    node.id = getRandomString();
                });
                const result = deepClone(parent.children.splice(index + 1));
                let finish = null;
                if (result.length && result[result.length - 1].type === 'finish') {
                    finish = result.pop();
                }
                temp.children[0].children = temp.children[0].children.concat(
                    result
                );
                temp.id = getRandomString();
                parent.children.splice(index + 1, 0, temp);
                if (finish) {
                    parent.children.push(finish);
                }
            },
            // 新增分支节点
            handleAddBranch(self, index) {
                if (!this.canEdit) {
                    return;
                }
                const temp = deepClone(template[`BRANCH_TEMP`]);
                temp.id = getRandomString();
                self.children.splice(index + 1, 0, temp);
            },
            // 删除节点
            handleNodeDelete(parent, index, gp, idx) {
                if (!this.canEdit) {
                    return;
                }
                const item = parent.children[index];
                if (item.type !== 'branch') {
                    parent.children.splice(index, 1);
                    return;
                }
                this.handleCondNodeDelete(parent, index, gp, idx);
            },
            // 删除分支节点
            handleCondNodeDelete(parent, index, gp, idx) {
                if (!this.canEdit) {
                    return;
                }
                parent.children.splice(index, 1);
                if (parent.children.length === 1) {
                    const list = parent.children[0].children;
                    gp.children.splice(idx, 1, ...list);
                }
            },
            // 获取 节点拆成 一级List，以及链接 线段 List
            transformNode(node, parent, list, index) {
                const {type, id, children} = node;
                if (this.nodeIdList.includes[id]) {
                    return;
                }
                this.nodeIdList.push(id);
                const idx = this.idx;
                // 保存 节点信息
                const nodeObj = deepClone(node);
                nodeObj.index = idx;
                this.nodeList.push(nodeObj);

                const line = {
                    id: '',
                    from: '',
                    to: ''
                };

                // 保存连线信息
                const lineId = getRandomString();
                if (
                    index > 0 &&
                    list[index - 1] &&
                    list[index - 1].type === 'condition'
                ) {
                    return;
                }

                if (index > 0 && list[index - 1] && node.type !== 'branch') {
                    line.id = lineId;
                    line.from = list[index - 1].id;
                    line.to = id;
                } else if (parent) {
                    line.id = lineId;
                    line.from = parent.id;
                    line.to = id;
                    line.conditionExpression = node.field.conditionExpression;
                }

                if (line.id) {
                    this.lineList.push(line);
                }

                if (
                    (type === 'branch' && !(children && children.length)) ||
                    (type !== 'branch' &&
                    index === list.length - 1 &&
                    !(node.children && node.children.length) &&
                    node.id)
                ) {
                    const next = this.getParentNext(node);
                    if (!next) {
                        return;
                    }
                    const {id} = next;
                    const newLine = {};
                    newLine.id = lineId;
                    newLine.from = node.id;
                    newLine.to = id;
                    this.lineList.push(newLine);
                }

                if (node.children && node.children.length) {
                    this.transformNodeList(node.children, node);
                }

                this.index++;
            },
            // 格式化 每个 节点集合
            transformNodeList(arr, parent) {
                arr.map((node, index) => {
                    this.transformNode(node, parent, arr, index);
                });
            },
            transform() {
                this.nodeList = [];
                this.lineList = [];
                this.index = 0;
                this.formatNodeNext(this.flow);
                this.formatNodeParent(this.flow);
                this.transformNodeList(this.flow.children);

                console.log(this.lineList);

                const nList = [];
                const lList = [];

                const nodeList = [];
                this.nodeList.map(item => {
                    if (item.type === 'branch') {
                        return;
                    }
                    nodeList.push(item);
                    nList.push(`${item.type}:${item.id}`);
                });

                const lineList = [];
                let exp = '';
                this.lineList.map(item => {
                    const {from, to, conditionExpression} = item;
                    if (from === to) {
                        exp = conditionExpression;
                        return;
                    }
                    const node = {
                        id: getRandomString(),
                        nodeType: 'SEQUENCE_FLOW',
                        sourceRef: from,
                        targetRef: to,
                        conditionExpression: exp || ''
                    };
                    if (exp) {
                        exp = '';
                    }
                    console.log('node', conditionExpression);
                    lineList.push(node);
                    lList.push(`${from} -> ${to}`);
                });

                console.log(nList);
                console.log(lList);

                return {
                    nodeList, lineList
                };
            },
            // 在每个节点记录下一个节点
            formatNodeNextList(list) {
                list.map((node, index) => {
                    const next = list[index + 1];
                    if (node && next) {
                        this.formatNodeNext(node, next);
                    }
                });
            },
            formatNodeNext(node, next) {
                if (node && next) {
                    const {name, field, type, id, nodeType} = next;
                    // 保存 节点信息
                    const nodeObj = {
                        id,
                        type,
                        nodeType,
                        name,
                        field
                    };
                    node.next = nodeObj;
                }

                if (node.children) {
                    this.formatNodeNextList(node.children);
                }
            },
            // 在每个节点记录父级节点
            formatNodeParentList(list, parent) {
                list.map((node, index) => {
                    this.formatNodeParent(node, parent);
                });
            },
            formatNodeParent(node, parent) {
                if (node && parent) {
                    node.parent = parent;
                }
                if (node.type === 'branch') {
                    node.id = node.parent.id;
                }
                const {name, field, type, id, next, nodeType} = node;
                const nodeCopy = {
                    id,
                    type,
                    name,
                    nodeType,
                    field,
                    next,
                    parent
                };

                if (node.children) {
                    this.formatNodeParentList(node.children, nodeCopy);
                }
            },
            getParentNext(node) {
                if (
                    node &&
                    node.parent &&
                    node.parent.next &&
                    !(
                        node.parent.type === 'branch' &&
                        node.parent.next.type === 'branch'
                    )
                ) {
                    return node.parent.next;
                }

                if (node.parent) {
                    return this.getParentNext(node.parent);
                }
                return null;
            },
            handleDrawClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.activeTab = 'setting';
                        done();
                    })
                    .catch(_ => {
                    });
            }
        }
    };
</script>
