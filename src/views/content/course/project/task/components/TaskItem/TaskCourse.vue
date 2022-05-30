<style lang="scss" src="./style.scss">
</style>

<style lang="scss" src="./origin.scss">
</style>

<template>
    <div class="task__item course">
        <svg-icon icon-class="task_course" class="task__type__icon"/>
        <div class="task__type">{{ $t('在线课') }}</div>
        <div class="task__name" :title="task.relResourceName">
            <span v-if="task.relType === 'OPTIONAL_ONLINE_COURSE'" class="optional">[{{ $t('选修') }}]</span>
            <span>{{ task.relResourceName }}</span>
        </div>
        <div class="task__info">
            <div class="task__score">
                <span>{{ $t('学时') }}</span>
                <span>{{ task.coursePeriod }}</span>
            </div>
            <div class="task__score">
                <span>{{ $t('学分') }}</span>
                <span>{{ task.courseScore }}</span>
            </div>
        </div>
        <div class="task__stones">
            <el-input-number
                v-model="task.stoneNum"
                class="task__stone__input"
                size="mini"
                :placeholder="$t('能量石')"
                :min="0"
                :max="100"
                :disabled="readOnly"
            />
            <span class="stone__num">{{ $t('个能量石') }}</span>
        </div>
        <div class="task__opts">
            <el-tooltip
                v-if="task.relType === 'OPTIONAL_ONLINE_COURSE' && !readOnly"
                :content="$t('取消选修')"
                placement="top"
            >
                <div @click="handleSetType('REQUIRE_ONLINE_COURSE')">
                    <i class="el-icon-document-delete task__icon"/>
                </div>
            </el-tooltip>
            <el-tooltip
                v-if="task.relType === 'REQUIRE_ONLINE_COURSE' && !readOnly"
                :content="$t('设为选修')"
                placement="top"
            >
                <div @click="handleSetType('OPTIONAL_ONLINE_COURSE')">
                    <i class="el-icon-document-checked task__icon"/>
                </div>
            </el-tooltip>
            <el-tooltip v-if="!readOnly" :content="$t('删除')" placement="top">
                <div @click="handleDelete">
                    <svg-icon icon-class="delete" class-name="task__icon"/>
                </div>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TaskCourse',
        props: {
            task: {
                type: Object,
                default() {
                    return {
                        name: '',
                        relType: '', // 任务类型
                        relId: '', // 任务资源id
                        courseTime: '', // 在线课或面授课的学时
                        courseScore: '', // 在线课或面授课的学分
                        relResourceStartAt: '', // 非课程类的开始时间
                        relResourceEndAt: '', // 非课程类的结束时间
                        stoneNum: 0 // 能量石数量
                    };
                }
            },
            index: {
                type: [String, Number],
                default: ''
            },
            readOnly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {};
        },
        mounted() {
        },
        methods: {
            handleDelete() {
                this.$confirm(this.$t('确定删除这门课程么?'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    this.$emit('delete');
                });
            },
            handleSetType(type) {
                this.task.relType = type;
                this.$successMsg(this.$t('修改课程类型成功'));
            }
        }
    };
</script>
