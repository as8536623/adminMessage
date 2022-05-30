<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="course__edit app-container-block">
        <!--<el-form-->
        <!--:model="editQuery"-->
        <!--label-width="140px"-->
        <!--:inline-message="true"-->
        <!--:rules="rules"-->
        <!--ref="editQuery"-->
        <!--&gt;-->
        <!--<veln-course-open-scope-->
        <!--type="detail"-->
        <!--:businessId="businessId"-->
        <!--:funCode="funCode"-->
        <!--:scp="editQuery.openScope"-->
        <!--:appCode="editQuery.appCode"-->
        <!--:route="editQuery.route"-->
        <!--:onSure="onSure"-->
        <!--&gt;</veln-course-open-scope>-->
        <!--</el-form>-->
        <el-form
            ref="editQuery"
            class="course__setting__form"
            :model="editQuery"
            label-width="120px"
            :inline-message="true"
        >
            <veln-course-open-scope
                type="detail"
                :business-id="businessId"
                :fun-code="funCode"
                :scp="editQuery.openScope"
                :app-code="editQuery.appCode"
                :route="editQuery.route"
                :on-sure="onSure"
            />
            <el-form-item class="course__exam__item" :label="$t('课后练习') + '：   '">
                <qgu-table
                    :columns="tableColumns"
                    :data="exerciseList"
                    :page="exerciseQuery"
                    :total="exerciseTotal"
                    :loading="listExerciseLoading"
                    @size-change="handleExerciseSizeChange"
                    @current-change="handleExerciseCurrentChange"
                />
            </el-form-item>
            <el-form-item class="course__exam__item" :label="$t('考试试题') + '：   '">
                <qgu-table
                    :columns="tableColumns"
                    :data="examList"
                    :page="examQuery"
                    :total="examTotal"
                    :loading="listLoading"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import VelnCourseOpenScope from '@/components/VelnCourseOpenScope';

    import {getCourse, openScope} from '@/api/course';
    import {searchCourseItem} from '@/api/exam/item/item';
    import {
        TEST_ATTRIBUTE_ENUM,
        TEST_QUESTION_LEVEL_ENUM,
        TEST_QUESTION_TYPE_ENUM,
        TEST_STATUS_ENUM
    } from '@/enum';

    export default {
        name: 'CourseItemUser',
        components: {
            VelnCourseOpenScope
        },
        data() {
            const tableColumns = [
                {
                    field: 'type',
                    text: this.$t('题型'),
                    minWidth: 90,
                    render: (h, param) => {
                        const type = param.row.type;
                        return type
                            ? this.TEST_QUESTION_TYPE_ENUM.getName(type)
                            : '--';
                    }
                },
                {
                    field: 'level',
                    text: this.$t('难度'),
                    minWidth: 80,
                    render: (h, param) => {
                        const level = param.row.level;
                        return level
                            ? this.TEST_QUESTION_LEVEL_ENUM.getName(level)
                            : '--';
                    }
                },
                {
                    field: 'stemOutline',
                    text: this.$t('试题内容'),
                    minWidth: 260,
                    render: (h, param) => {
                        const stemOutline = param.row.stemOutline;
                        return h('div', [
                            h(
                                'span',
                                {},
                                stemOutline
                                    ? stemOutline.replace(/<\/?p[^>]*>/gi, '')
                                    : '--'
                            )
                        ]);
                    }
                }
                // {
                //     field: 'opt',
                //     text: this.$t('操作'),
                //     minWidth: 60,
                //     fixed: 'right',
                //     render: (h, param) => {
                //         const optArr = [];
                //         const deleteBtn = h('QguButton', {
                //             props: {
                //                 toolTip: this.$t('删除'),
                //                 type: 'text',
                //                 icon: 'del'
                //             },
                //             on: {
                //                 click: () => {
                //                     this.del(param.row);
                //                 }
                //             }
                //         });
                //         optArr.push(deleteBtn);
                //         return h('div', optArr, '');
                //     }
                // }
            ];
            return {
                tableColumns,
                TEST_ATTRIBUTE_ENUM,
                TEST_QUESTION_LEVEL_ENUM,
                TEST_QUESTION_TYPE_ENUM,
                TEST_STATUS_ENUM,
                businessId: this.$route.query.id,
                funCode: 'COURSE',
                editQuery: {
                    roleIds: '',
                    id: this.$route.query.id,
                    openScope: '',
                    appCode: 'veln-stu',
                    route: 'openScope'
                },
                rules: {},
                dgpDialogVisible: false,
                examQuery: {
                    courseId: this.$route.query.id,
                    pageNum: 1,
                    pageSize: 10,
                    attribute: 'EXAMEXERCISE'
                },
                exerciseQuery: {
                    courseId: this.$route.query.id,
                    pageNum: 1,
                    pageSize: 10,
                    attribute: 'EXERCISE'
                },
                examList: [],
                exerciseList: [],
                examTotal: 0,
                exerciseTotal: 0,
                listLoading: false,
                listExerciseLoading: false
            };
        },
        created() {
            this.getCourse();
            this.getExamPage();
            this.getExercisePage();
        },
        methods: {
            getCourse() {
                getCourse(this.editQuery.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery.openScope = result.data.openScope;
                    }
                });
            },
            cancel() {
                history.go(-1);
            },
            // 完成操作
            onSure(value) {
                if (this.editQuery.id) {
                    this.editQuery.openScope = value;
                    openScope(this.editQuery).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$router.push({name: 'courseManage'});
                            // this.$successMsg(this.$t('保存成功'));
                        } else {
                            this.$errorMsg(result.msg || this.$t('保存失败'));
                        }
                    });
                }
            },
            getExamPage(condition) {
                const params = Object.assign({}, this.examQuery, condition);
                this.listLoading = true;
                searchCourseItem(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        if (result.data) {
                            const {list, total} = result.data;
                            this.examList = list || [];
                            this.examTotal = total;
                        }
                        this.listLoading = false;
                        this.examQuery.pageNum = params.pageNum;
                        this.examQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            getExercisePage(condition) {
                const params = Object.assign({}, this.exerciseQuery, condition);
                this.listExerciseLoading = true;
                searchCourseItem(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        if (result.data) {
                            const {list, total} = result.data;
                            this.exerciseList = list || [];
                            this.exerciseTotal = total;
                        }
                        this.listExerciseLoading = false;
                        this.exerciseQuery.pageNum = params.pageNum;
                        this.exerciseQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            handleSizeChange(v) {
                this.getExamPage({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleExerciseSizeChange(v) {
                this.getExercisePage({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChange(v) {
                this.getExamPage({
                    pageNum: v
                });
            },
            handleExerciseCurrentChange(v) {
                this.getExercisePage({
                    pageNum: v
                });
            }
        }
    };
</script>
