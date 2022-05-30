<style lang="scss" src="./style.scss">
</style>

<template>
    <el-dialog
        v-if="dialogVisible"
        append-to-body
        :title="$t('学习阶段')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="800px"
    >
        <section class="dialog__form__container">
            <search-input
                v-if="showSearch"
                v-model="listQuery.nameCodeKey"
                class="course__search"
                :placeholder="$t('输入课程编号/名称搜索')"
                @enter="search"
            />
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
    </el-dialog>
</template>

<script>
    import {listCourse} from '@/api/course/project/stageTask';
    import {mapGetters} from 'vuex';

    export default {
        name: 'VueTemplate',
        props: {
            showSearch: {
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
                            field: 'time',
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
            }
        },
        data() {
            return {
                dialogVisible: false,
                listQuery: {
                    nameCodeKey: '',
                    pageNum: 1,
                    pageSize: 10,
                    proId: '',
                    excludeCourseIds: []
                },
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
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                params.excludeCourseIds = this.selectedIds;
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

                    const {id, name, score, time} = item;
                    const course = {
                        relResourceName: name,
                        relType: 'REQUIRE_ONLINE_COURSE', // 任务类型
                        relId: id, // 任务资源id
                        courseScore: score, // 在线课或面授课的学分
                        coursePeriod: time, // 在线课或面授课的学时
                        relResourceStartAt: '', // 非课程类的开始时间
                        relResourceEndAt: '', // 非课程类的结束时间
                        stoneNum: 0
                    };

                    list.push(course);
                });

                ids = [...new Set(ids)];
                this.$store.commit('SET_SELECTED_IDS', ids);

                this.$emit('select', list);
                this.hide();
            }
        }
    };
</script>
