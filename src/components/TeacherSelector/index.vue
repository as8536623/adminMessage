<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <el-dialog
        v-if="teacherDialogVisible"
        append-to-body
        :title="$t('选择讲师')"
        :visible.sync="teacherDialogVisible"
        width="700px"
        top="5vh"
        :before-close="handleTeacherClose"
    >
        <section class="container__padding">
            <div class="opt__line">
                <router-link :to="{name: 'teacherEdit'}">
                    <el-button type="primary" class="pull-left">{{ $t('新增') }}</el-button>
                </router-link>
                <search-input
                    v-model="teacherQuery.name"
                    class="pull-right"
                    :placeholder="$t('讲师姓名')"
                    @enter="searchTeacher"
                />
            </div>
            <qgu-table
                ref="userTable"
                :border="false"
                :columns="tableColumns"
                :data="teacherList"
                :page="teacherQuery"
                :total="teacherTotal"
                :loading="teacherListLoading"
                @selection-change="teacherSelectionChange"
                @size-change="handleTeacherSizeChange"
                @current-change="handleTeacherCurrentChange"
            />
        </section>
        <div class="dialog__btn__line">
            <el-button @click="teacherDialogVisible=false">{{ $t('取消') }}</el-button>
            <el-button
                type="primary"
                @click="onTeacherSure"
            >{{ $t('确定') }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import i18n from '@/lang';
    import {getTeacherPage} from '@/api/teacher';

    const tableColumns = [
        {
            type: 'checkbox'
        },
        {
            field: 'name',
            text: i18n.t('讲师姓名')
        },
        {
            field: 'level',
            minWidth: 100,
            text: i18n.t('讲师等级')
        },
        {
            field: 'source',
            minWidth: 100,
            text: i18n.t('讲师来源'),
            render: (h, param) => {
                return param.row.source === 'OUTER' ? '外部' : '内部';
            }
        }
    ];

    export default {
        name: 'TeacherSelector',
        props: {
            multi: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                tableColumns,
                teacherList: [],
                teacherSelect: [],
                teacherMultiSelection: [],
                teacherTotal: 0,
                teacherListLoading: false,
                teacherQuery: {
                    name: '',
                    source: '',
                    pageNum: 1,
                    pageSize: 10
                },
                teacherDialogVisible: false
            };
        },
        mounted() {
            this.searchTeacher();
        },
        methods: {
            showTeacherDlg() {
                this.teacherDialogVisible = true;
                this.searchTeacher();
            },
            // 搜索老师列表
            searchTeacher() {
                this.getTeacherList({pageNum: 1});
            },
            getTeacherList(condition) {
                const params = Object.assign(
                    {'status': 'ENABLED'}, this.teacherQuery, condition);
                this.teacherListLoading = true;
                getTeacherPage(params).then(re => {
                    this.teacherListLoading = false;
                    const result = re.data;
                    if (result.success) {
                        this.teacherList = result.data.list || [];
                        this.teacherTotal = result.data.total;
                        this.teacherQuery.pageNum = params.pageNum;
                        this.teacherQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取讲师数据出错'));
                    }
                });
            },
            teacherSelectionChange(selection) {
                this.teacherMultiSelection = selection;
            },
            handleTeacherSizeChange(v) {
                this.getTeacherList({
                    pageNum: 1,
                    pageSize: v
                });
            },
            handleTeacherCurrentChange(v) {
                this.getTeacherList({
                    pageNum: v
                });
            },
            handleTeacherClose() {
                this.teacherDialogVisible = false;
            },
            onTeacherSure() {
                if (!this.teacherMultiSelection.length) {
                    this.$warnMsg(this.$t('请选择讲师'));
                    return;
                }
                if (!this.multi && this.teacherMultiSelection.length > 1) {
                    this.$warnMsg(this.$t('只能选择一位讲师'));
                    return;
                }
                this.$emit('sure', this.teacherMultiSelection);
                this.hide();
            },
            handleCloseTeacher() {
                this.hide();
            },
            show() {
                this.teacherDialogVisible = true;
                this.searchTeacher();
            },
            hide() {
                this.teacherDialogVisible = false;
            }
        }
    };
</script>
