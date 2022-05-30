<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <el-dialog
        v-if="dialogVisible"
        append-to-body
        :title="$t('选择课程类别')"
        :visible.sync="dialogVisible"
        width="339px"
        @close="dialogClose"
    >
        <veln-course-category-select ref="category" :default-expand-all="defaultExpandAll"/>
        <div class="dialog__btn__line">
            <router-link :to="{name: 'courseCategory'}">
                <el-button type="primary" class="pull-left">{{ $t('新增') }}</el-button>
            </router-link>
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="categorySelect">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import VelnCourseCategorySelect from '@/components/VelnCourseCategorySelect';
    export default {
        name: 'CourseCategorySelector',
        components: {
            VelnCourseCategorySelect
        },
        data() {
            return {
                dialogVisible: false,
                defaultExpandAll: []
            };
        },
        mounted() {
        },
        methods: {
            dialogClose() {
                this.dialogVisible = false;
            },
            show() {
                this.dialogVisible = true;
            },
            categorySelect() {
                const $category = this.$refs.category;
                const {id, name} = $category.getActive();
                const result = {
                    id,
                    name
                };
                this.$emit('on-sure', result);
                this.dialogClose();
            }
        }
    };
</script>
