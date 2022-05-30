<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <el-dialog
        v-if="dialogVisible"
        append-to-body
        :title="$t('选择班级')"
        :visible.sync="dialogVisible"
        width="339px"
        @close="dialogClose"
    >
        <qgu-tree
            class="class-select__tree"
            type="dialog"
            :datalist="treeData"
            :show-include-child="false"
            :check-strictly="checkStrictly"
            :show-checkbox="showCheckbox"
            @node-click="nodeClick"
        >
            <span slot-scope="{ node, data }" class="custom-tree-node">
                <span class="organize__tree__text">{{ data.name }}</span>
            </span>
        </qgu-tree>
        <div class="dialog__btn__line">
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="onSure">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import QguTree from '@/components/QguTree';
    import {getClassroomTree} from '@/api/group';

    export default {
        name: 'ClassSelect',
        components: {
            QguTree
        },
        props: {
            checkStrictly: {
                type: Boolean,
                default: false
            },
            showCheckbox: {
                type: Boolean,
                default: false
            },
            orgId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                dialogVisible: false,
                treeData: [],
                active: null
            };
        },
        watch: {
            orgId: {
                handler() {
                    this.getGroupTree();
                },
                immediate: true
            }
        },
        mounted() {
            this.getGroupTree();
        },
        methods: {
            getGroupTree() {
                const params = {
                    schoolId: this.orgId
                };
                getClassroomTree(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = result.data.child;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取岗位类别出错'));
                    }
                });
            },
            dialogClose() {
                this.dialogVisible = false;
            },
            onSure() {
                if (!this.active || (this.active && this.active.category)) {
                    this.$warnMsg(this.$t('请选择具体班级'));
                    return;
                }
                this.$emit('on-sure', this.active);
                this.dialogClose();
            },
            nodeClick(data) {
                this.active = data;
            },
            show() {
                this.dialogVisible = true;
            }
        }
    };
</script>
