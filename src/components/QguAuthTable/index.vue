<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="qgu__auth__table">
        <section class="qat__header">
            <i v-if="icon.startsWith('el-')" class="qat__icon" :class="{icon: true}"/>
            <svg-icon v-else class="qat__icon" :icon-class="icon"/>
            <span class="qat__title">{{ $t(title) }}</span>
        </section>
        <section :key="renderKey" class="qat__main">
            <div
                v-for="(first, index) in list"
                :key="index"
                class="qat__first"
                :class="{'expand': expandKeys.includes(first.id)}"
            >
                <div class="qat__expand__arrow" @click="arrowClick(first.id)"/>
                <div class="qat__first__title">
                    <el-checkbox
                        :disabled="disabled"
                        :checked="checkedIds.includes(first.id)"
                        @change="firstChange(first)"
                    >{{ first.name }}</el-checkbox>
                </div>
                <div class="qat__sub">
                    <div v-for="(second, idx) in first.child" :key="idx" class="qat__second">
                        <div class="qat__second__title">
                            <el-checkbox
                                :disabled="disabled"
                                :checked="checkedIds.includes(second.id)"
                                @change="secondChange(second, first)"
                            >{{ second.name }}</el-checkbox>
                        </div>
                        <div class="qat__third__line">
                            <div
                                v-for="(third, i) in second.child"
                                :key="i"
                                class="qat__third pull-left"
                            >
                                <el-checkbox
                                    :disabled="disabled"
                                    :checked="checkedIds.includes(third.id)"
                                    @change="thirdChange(third, second, first)"
                                >{{ third.name }}</el-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import {uniqueArraySimple, deepClone} from '@/utils/index';

    export default {
        name: 'Index',
        props: {
            icon: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            data: {
                type: [Array],
                default: () => {
                    return [];
                }
            },
            selected: {
                type: [Array],
                default: () => {
                    return [];
                }
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                allChecked: false,
                renderKey: '',
                allIds: [],
                checkedIds: [],
                list: [],
                expandKeys: [],
                expand: false
            };
        },
        watch: {
            data() {
                this.formatList();
                this.checkAllSelected();
            }
        },
        methods: {
            // 获取所有的ID
            getIds(arr, result) {
                const ids = [];
                arr.map(item => {
                    result.allIds.push(item.id);
                    ids.push(item.id);
                    item.allIds = [];
                    if (item.child) {
                        item.allIds = item.allIds.concat(
                            this.getIds(item.child, result).nodeIds
                        );
                        item.child.map(child => {
                            item.allIds = uniqueArraySimple(
                                item.allIds.concat(child.allIds)
                            );
                        });
                    }
                });
                result.nodeIds = ids;
                return result;
            },

            // 检测是否所有节点都被点击
            checkAllSelected() {
                if (this.checkedIds.length === this.allIds.length) {
                    this.allChecked = true;
                    this.$emit('select-all', this.checkedIds);
                } else {
                    this.allChecked = false;
                }

                this.$emit('change', this.checkedIds, this.allChecked);
            },

            // 修改节点状态
            changeSelectStatus(ids, type) {
                ids.map(id => {
                    const index = this.checkedIds.indexOf(id);
                    if (index > -1 && !type) {
                        this.checkedIds.splice(index, 1);
                    }

                    if (index === -1 && type) {
                        this.checkedIds.push(id);
                    }
                });
            },

            // 一、二级节点点击
            nodeChangeWithChild(self, parent) {
                const id = self.id;
                let ids = self.allIds;
                ids.push(id);
                ids = uniqueArraySimple(ids);
                if (this.checkedIds.includes(id)) {
                    // 当二级节点取消勾选，只需要取消二级节点，不影响祖先节点
                    this.changeSelectStatus(ids, false);
                } else {
                    this.changeSelectStatus(ids, true);
                    if (parent) {
                        // 当二级节点选中时，初级节点需要选中
                        this.checkedIds.push(parent.id);
                        this.uniqueCheckedIds();
                    }
                }
            },

            // 末级节点点击
            nodeChangeWithoutChild(self, parent, first) {
                const id = self.id;
                let ids = [];
                ids.push(id);
                ids = uniqueArraySimple(ids);
                if (this.checkedIds.includes(id)) {
                    // 当末级节点取消勾选，只需要取消末级节点，不影响祖先节点
                    this.changeSelectStatus(ids, false);
                } else {
                    // 当末级节点选中时，父级节点和初级节点需要选中
                    this.changeSelectStatus(ids, true);
                    this.checkedIds.push(parent.id);
                    this.checkedIds.push(first.id);
                    this.uniqueCheckedIds();
                }
            },

            // 选中节点去重
            uniqueCheckedIds() {
                let ids = this.checkedIds;
                ids = [...new Set(ids)];
                this.checkedIds = ids;
            },

            // 检查父级节点
            checkParentNode(parent) {
                const ids = uniqueArraySimple(parent.allIds);
                let result = true;
                const index = ids.indexOf(parent.id);
                if (index > -1) {
                    ids.splice(index, 1);
                }
                ids.map(id => {
                    if (!this.checkedIds.includes(id)) {
                        result = false;
                    }
                });

                return result;
            },

            // 初级节点点击
            firstChange(self) {
                this.nodeChangeWithChild(self);
                this.checkAllSelected();
                this.renderKey = +new Date();
            },

            // 次级节点点击
            secondChange(self, parent) {
                this.nodeChangeWithChild(self, parent);
                if (this.checkParentNode(parent)) {
                    this.checkedIds.push(parent.id);
                    this.uniqueCheckedIds();
                } else {
                // const index = this.checkedIds.indexOf(parent.id);
                // index > -1 && this.checkedIds.splice(index, 1);
                }
                this.checkAllSelected();
                this.renderKey = +new Date();
            },

            // 末级节点点击
            thirdChange(self, parent, first) {
                this.nodeChangeWithoutChild(self, parent, first);
                // if (this.checkParentNode(parent)) {
                // this.checkedIds.push(parent.id);
                // this.uniqueCheckedIds();
                // this.secondChange(parent, first);
                // } else {
                // const index = this.checkedIds.indexOf(parent.id);
                // index > -1 && this.checkedIds.splice(index, 1);
                //
                // const ids = this.checkedIds.indexOf(first.id);
                // ids > -1 && this.checkedIds.splice(ids, 1);
                // }
                this.checkAllSelected();
                this.renderKey = +new Date();
            },

            // 格式化初始化数据
            formatList() {
                let result = {
                    allIds: [],
                    nodeIds: []
                };
                result = this.getIds(this.data, result);
                this.allIds = result.allIds;
                this.list = deepClone(this.data);
                this.checkedIds = this.selected || [];
                if (this.checkedIds.length === this.allIds.length) {
                    this.allChecked = true;
                }
            },

            // 获取当前选择ID数组
            getSelectedIds() {
                return this.checkedIds;
            },

            // 全选
            selecteAll() {
                this.checkedIds = this.allIds || [];
                this.checkAllSelected();
                this.renderKey = +new Date();
            },

            // 清空
            empty() {
                this.checkedIds = [];
                this.checkAllSelected();
                this.renderKey = +new Date();
            },

            // 展开 收起
            arrowClick(id) {
                const index = this.expandKeys.indexOf(id);
                if (index > -1) {
                    this.expandKeys.splice(index, 1);
                } else {
                    this.expandKeys.push(id);
                }
            }
        }
    };
</script>
