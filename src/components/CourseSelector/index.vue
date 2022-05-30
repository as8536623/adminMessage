<style lang="scss" src="./style.scss">
</style>

<template>
    <el-dialog
        v-if="dialogVisible"
        top="5vh"
        append-to-body
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="1200px"
    >
        <section class="dialog__form__container">
            <div class="dialog-search">
                <el-input
                    v-if="!readonlyCategory"
                    v-model="listQuery.categoryName"
                    class="course-category"
                    placeholder="请选择课程类别"
                    clearable
                    @focus="handleFocus"
                    @clear="clearCategory"
                />
                <search-input
                    v-if="showSearch"
                    v-model="listQuery.nameCodeKey"
                    class="course__search"
                    :placeholder="$t('输入课程编号/名称搜索')"
                    @enter="search"
                />
            </div>
            <qgu-table
                :columns="tableColumns"
                :data="list"
                :page="listQuery"
                :total="total"
                :loading="listLoading"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @selection-change="selectionChange"
            />
        </section>
        <div class="dialog__btn__line">
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
        <course-category-selector ref="category" @on-sure="handleCategorySure"/>
    </el-dialog>
</template>

<script>
    import {listCourse} from '@/api/course/project/stageTask';
    import {mapGetters} from 'vuex';
    import {commonPost} from '@/api/common/common';
    import CourseCategorySelector from '@/components/CourseCategorySelector';

    export default {
        name: 'VueTemplate',
        components: {
            CourseCategorySelector
        },
        props: {
            title: {
                type: String,
                default: '学习阶段'
            },
            url: {
                type: String,
                default: ''
            },
            showSearch: {
                type: Boolean,
                default: false
            },
            enableExcludeCourse: {
                type: Boolean,
                default: true
            },
            hasNotCheckSelectedCourses: {
                type: Boolean,
                default: false
            },
            tableColumns: {
                type: Array,
                default() {
                    return [
                        {
                            type: 'checkbox'
                        },
                        {
                            field: 'code',
                            text: this.$t('编号'),
                            minWidth: 100
                        },
                        {
                            field: 'name',
                            text: this.$t('课程名称'),
                            minWidth: 160
                        },
                        {
                            field: 'period',
                            text: this.$t('学时'),
                            width: 80
                        },
                        {
                            field: 'score',
                            text: this.$t('学分'),
                            width: 80
                        }
                    ];
                }
            },
            readonlyCategory: {
                type: Boolean,
                default: false
            },
            extraParam: {
                type: Object,
                default: null
            }
        },
        data() {
            const defaultQueryObj = {
                nameCodeKey: '',
                categoryId: '',
                categoryName: '',
                pageNum: 1,
                pageSize: 10,
                proId: '',
                excludeCourseIds: []
            };

            return {
                dialogVisible: false,
                listQuery: Object.assign({}, defaultQueryObj, this.extraParam),
                list: [],
                total: 0,
                multiSelection: []
            };
        },
        computed: {
            ...mapGetters(['selectedIds'])
        },
        mounted() {
            if (this.$route.query.id) {
                this.listQuery.proId = this.$route.query.id;
            }
        },
        beforeDestroy() {
            this.$store.commit('SET_SELECTED_IDS', []);
        },
        methods: {
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            show() {
                this.dialogVisible = true;
                this.getList({
                    pageNum: 1
                });
            },
            hide() {
                this.dialogVisible = false;
                this.listQuery.excludeCourseIds = [];
                this.multiSelection = [];
            },
            listCourse(params) {
                listCourse(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            commonPost(params) {
                commonPost(this.url, params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(result.msg || '数据查询异常');
                    }
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                if (this.enableExcludeCourse) {
                    params.excludeCourseIds = this.selectedIds;
                }
                params.hasNotCheckSelectedCourses = this.hasNotCheckSelectedCourses;
                if (this.url) {
                    this.commonPost(params);
                    return;
                }
                this.listCourse(params);
            },
            selectionChange(v) {
                this.multiSelection = v;
            },
            handleSizeChange(v) {
                this.getList({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v
                });
            },
            save() {
                const list = [];
                let ids = this.selectedIds;
                this.multiSelection.map(item => {
                    ids.push(item.id);

                    const {id, name, score, period, courseName, price} = item;
                    const course = {
                        courseName,
                        relResourceName: name,
                        relType: 'REQUIRE_ONLINE_COURSE', // 任务类型
                        relId: id, // 任务资源id
                        courseScore: score, // 在线课或面授课的学分
                        coursePeriod: period, // 在线课或面授课的学时
                        relResourceStartAt: '', // 非课程类的开始时间
                        relResourceEndAt: '', // 非课程类的结束时间
                        stoneNum: 10,
                        price
                    };

                    list.push(course);
                });

                ids = [...new Set(ids)];
                this.$store.commit('SET_SELECTED_IDS', ids);

                this.$emit('select', list);
                this.hide();
            },
            handleFocus() {
                this.$refs.category.show();
            },
            handleCategorySure(category) {
                const {id, name} = category;
                this.listQuery.categoryId = id;
                this.listQuery.categoryName = name;
                this.search();
            },
            clearCategory() {
                this.listQuery.categoryId = '';
                this.listQuery.categoryName = '';
                this.search();
            }
        }
    };
</script>
