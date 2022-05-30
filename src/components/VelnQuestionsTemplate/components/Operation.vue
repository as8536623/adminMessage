<template>
    <article class="question__tooltip">
        <el-tooltip
            v-if="list.length > 1
                && index !== 0"
            class="item"
            effect="dark"
            :content="$t('上移')"
            placement="bottom"
        >
            <el-button
                type="text"
                size="mini"
                @click="move(true)"
            >
                <svg-icon class-name="tree__icon" icon-class="up_s"/>
            </el-button>
        </el-tooltip>
        <el-tooltip
            v-if="list.length > 1 &&
                index !== list.length - 1"
            class="item"
            effect="dark"
            :content="$t('下移')"
            placement="bottom"
        >
            <el-button
                type="text"
                size="mini"
                @click="move(false)"
            >
                <svg-icon class-name="tree__icon" icon-class="down_s"/>
            </el-button>
        </el-tooltip>
        <el-tooltip
            v-if="isEdit"
            class="item"
            effect="dark"
            :content="$t('编辑')"
            placement="bottom"
        >
            <el-button
                type="text"
                size="mini"
                @click="edit"
            >
                <svg-icon class-name="tree__icon" icon-class="edit"/>
            </el-button>
        </el-tooltip>
        <el-tooltip
            class="item"
            effect="dark"
            :content="$t('删除')"
            placement="bottom"
        >
            <el-button
                type="text"
                size="mini"
                @click="del"
            >
                <svg-icon class-name="tree__icon" icon-class="del"/>
            </el-button>
        </el-tooltip>
    </article>
</template>
<script>
    export default {
        name: 'Operation',
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            index: {
                type: Number,
                default: 0
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {};
        },
        methods: {
            move(flag) {
                const id = this.list[this.index].id;
                this.$emit('move', id, flag);
            },
            del() {
                this.$confirm(this.$t('此操作将删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const id = this.list[this.index].id;
                    this.$emit('del', id);
                });
            },
            edit() {
                const id = this.list[this.index].id;
                this.$emit('edit', id);
            }
        }
    };
</script>
