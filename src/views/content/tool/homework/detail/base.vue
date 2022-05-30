<style lang="scss">
@import '../../style.scss';
</style>
<template>
    <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
        <section class="tool-form-item">
            <el-form-item :label="$t('编号') + '：'" prop="code">{{ editQuery.code }}</el-form-item>
            <el-form-item :label="$t('标题') + '：'" prop="title">{{ editQuery.title }}</el-form-item>
            <el-form-item
                :label="$t('可提交时间') + '：'"
                prop="submitSt"
            >{{ editQuery.submitSt }} ~ {{ editQuery.submitEt }}</el-form-item>
            <el-form-item :label="$t('作业类型') + '：'" prop="workType">
                <div>{{ HOMEWORK_TYPE_EDIT_ENUM.getName(editQuery.workType || '') }}</div>
            </el-form-item>
            <el-form-item :label="$t('封面') + '：'" class="course__upload__line">
                <div class="course__upload__sec">
                    <img
                        v-if="editQuery.coverUrl"
                        class="course__cover"
                        :src="editQuery.coverUrl"
                        :alt="$t('封面')"
                    >
                    <svg-icon
                        v-if="!editQuery.coverUrl"
                        icon-class="plus"
                        class-name="course__upload__plus"
                    />
                </div>
            </el-form-item>
            <el-form-item :label="$t('作业要求') + '：'" prop="requirements">{{ editQuery.requirements }}</el-form-item>
            <el-form-item :label="$t('附件') + '：'">
                <div v-if="editQuery.attachment" class="homework__link">
                    <span class="homework__link__name">{{ editQuery.attachmentName }}</span>
                </div>
            </el-form-item>
        </section>
    </el-form>
</template>
<script>
    import {HOMEWORK_TYPE_EDIT_ENUM} from '@/enum';
    import {
        getWorkInfo
    } from '@/api/workInfo';

    export default {
        name: 'HomeworkBasicInfo',
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                HOMEWORK_TYPE_EDIT_ENUM,
                editQuery: this.data
            };
        },
        created() {},
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.getInfoById(this.$route.query.id);
                }
            },
            // 编辑回显
            getInfoById(id) {
                getWorkInfo(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
