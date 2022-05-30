<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <section class="opt__line">
            <el-button type="primary" @click="handleAdd">{{ $t('新增') }}</el-button>
            <search-input
                v-model="listQuery.name"
                class="pull-right"
                width="320px"
                :placeholder="$t('请输入版权名称')"
                @enter="search"
            />
            <search-input
                v-model="listQuery.teacherName"
                class="pull-right"
                width="320px"
                :placeholder="$t('请输入讲师名称')"
                @enter="search"
            />
        </section>
        <qgu-table
            :columns="tableColumns"
            :data="list"
            :page="listQuery"
            :total="total"
            :loading="listLoading"
            @selection-change="selectionChange"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />

        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t(editQuery.id ? '版权-编辑' : '版权-新增')"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose"
        >
            <el-form ref="editQuery" :model="editQuery" label-width="100px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('名称' + '：')" prop="name">
                        <el-input v-model.trim="editQuery.name" :maxlength="20"/>
                    </el-form-item>
                    <el-form-item
                        :label="$t('授课讲师') + '：'"
                        prop="teacherIdList"
                    >
                        <el-tag
                            v-if="editQuery.teacherName"
                            class="course__teacher__tag"
                            closable
                            :disable-transitions="false"
                            @close="handleCloseTeacher(tag)"
                        >{{ editQuery.teacherName }}
                        </el-tag>
                        <el-button class="course__teacher__btn" @click="showTeacherDlg">{{ $t('选择') }}
                        </el-button>
                    </el-form-item>
                    <el-form-item
                        :label="$t('版权图片') + '：'"
                        class="course__upload__line"
                        prop="srcUrl"
                    >
                        <div class="course__upload__sec" @click="coverUrlShowFileSelect">
                            <img
                                v-if="editQuery.srcUrl"
                                class="course__cover"
                                :src="editQuery.srcUrl"
                                :alt="$t('封面')"
                            >
                            <svg-icon
                                v-if="!editQuery.srcUrl"
                                icon-class="plus"
                                class-name="course__upload__plus"
                            />
                        </div>
                        <span class="course__upload__tips">{{ $t('图片大小不能超过5M，建议尺寸640*370px') }}</span>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button
                        type="primary"
                        @click="onSure"
                    >保存
                    </el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            v-if="teacherDialogVisible"
            append-to-body
            :title="$t('选择讲师')"
            :visible.sync="teacherDialogVisible"
            width="700px"
            :before-close="handleTeacherClose"
        >
            <section class="dlg__content">
                <div class="teacher__search">
                    <search-input
                        v-model="teacherQuery.name"
                        class="pull-right"
                        :placeholder="$t('讲师姓名/编号')"
                        @enter="searchTeacher"
                    />
                </div>
                <qgu-table
                    :border="true"
                    :columns="teacherTableColumns"
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
                <el-button @click="handleTeacherClose">{{ $t('取消') }}</el-button>
                <el-button
                    type="primary"
                    @click="onTeacherSure"
                >{{ $t('确定') }}
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="coverUrlFileDialogVisible"
            :key="coverUrlFileDialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="coverUrlFileDialogVisible"
            width="890px"
            :before-close="coverUrlHandleFileClose"
            @close="coverUrlFileDialogClose"
        >
            <veln-file-select
                app-code="veln-stu"
                fun-code="COPYRIGHT"
                :multi-select="false"
                :type-arr="['IMAGE']"
                @on-sure="coverUrlOnSure"
                @on-cancel="coverUrlOnCancel"
            />
        </el-dialog>
    </article>
</template>

<script>
    import {insert, update, search} from '@/api/teacherCopyright';
    import {getTeacherPage} from '@/api/teacher';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import {COMMON_STATUS_ENUM} from '@/enum';

    export default {
        name: 'Copyright',
        components: {
            VelnFileSelect
        },
        data() {
            const tableColumns = [
                {
                    field: 'name',
                    text: this.$t('名称'),
                    minWidth: 140
                },
                {
                    field: 'teacherName',
                    text: this.$t('讲师名称'),
                    minWidth: 60
                },
                {
                    field: 'srcUrl',
                    text: this.$t('版权证明'),
                    minWidth: 90,
                    align: 'center',
                    render: (h, param) => {
                        const {srcUrl} = param.row;
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        window.open(srcUrl);
                                    }
                                }
                            },
                            '点击查看'
                        );
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 80,
                    align: 'center',
                    render: (h, param) => {
                        const optArr = [];
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.editQuery = param.row;
                                    this.dialogVisible = true;
                                }
                            }
                        });
                        optArr.push(editBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            const teacherTableColumns = [
                {
                    type: 'radio'
                },
                {
                    field: 'name',
                    text: this.$t('讲师姓名')
                },
                {
                    field: 'code',
                    minWidth: 100,
                    text: this.$t('讲师编号')
                },
                {
                    field: 'source',
                    minWidth: 100,
                    text: this.$t('讲师来源'),
                    render: (h, param) => {
                        return param.row.source === 'OUTER' ? '外部' : '内部';
                    }
                }
            ];
            return {
                COMMON_STATUS_ENUM,
                tableColumns,
                total: 0,
                list: [],
                listLoading: false,
                time: [],
                dialogVisible: false,
                listQuery: {
                    keywords: '',
                    pageNum: 1,
                    pageSize: 20
                },
                editQuery: {
                    teacherName: ''
                },
                teacherDialogVisible: false,
                teacherList: [],
                teacherSelect: [],
                teacherQuery: {
                    name: '',
                    source: '',
                    pageNum: 1,
                    pageSize: 20
                },
                teacherTotal: 0,
                coverUrlFileDialogVisible: false,
                coverUrlFileDialogKey: null,
                uploadURL: `${process.env.FS_API}/file/upload`, // 上传地址
                teacherListLoading: false,
                teacherMultiSelection: [],
                courseIds: [],
                teacherTableColumns,
                multiSelection: [],
                authIds: [],
                isCourseEdit: true,
                currentCode: null, // 下载文档的编号
                isSqkcsl: true
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                search(params).then(re => {
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
            handleClose() {
                this.dialogVisible = false;
            },
            selectionChange(v) {
                this.multiSelection = v;
            },
            search() {
                this.getList({pageNum: 1});
            },
            cancel() {
                if (this.editQuery.id) {
                    this.handleCheckChange();
                }
                this.clickFlag = false;
                this.authDialogVisible = false;
                this.updateUoloadFlag = false;
                this.teacherSelect = [];
                this.editQuery = {
                    id: '',
                    name: '',
                    teacherIdList: []
                };
                this.deleteDemo();
                this.dialogKey = +new Date();
            },
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
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
            onSure() {
                insert(this.editQuery).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg('添加成功');
                    } else {
                        this.$errorMsg(this.$t(result.msg || '添加失败'));
                    }
                });
                this.dialogVisible = false;
                this.getList();
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
                this.teacherMultiSelection.map(teacher => {
                    this.editQuery.teacherId = teacher.id;
                    this.editQuery.teacherName = teacher.name;
                });
                this.teacherDialogVisible = false;
            },
            handleCloseTeacher(teacher) {
                const index = this.editQuery.teacherIdList.indexOf(teacher.id);
                this.editQuery.teacherIdList.splice(index, 1);

                let idx = -1;
                const list = this.teacherSelect;
                list.map((t, i) => {
                    if (t.id === teacher.id) {
                        idx = i;
                    }
                });

                if (idx > -1) {
                    list.splice(idx, 1);
                    this.teacherSelect = list;
                }
            },
            // 搜索老师列表
            searchTeacher() {
                this.getTeacherList({pageNum: 1});
            },
            showTeacherDlg() {
                this.teacherDialogVisible = true;
                this.searchTeacher();
            },
            handleSizeChange(v) {
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
            },
            coverUrlShowFileSelect() {
                this.coverUrlFileDialogVisible = true;
            },
            coverUrlFileDialogClose() {
                this.coverUrlFileDialogKey = +new Date();
            },
            coverUrlHandleFileClose() {
                this.coverUrlFileDialogVisible = false;
            },
            coverUrlOnSure(files) {
                const fileId = files[0].fileId;
                this.editQuery.srcUrl = files[0].viewUrl;
                this.editQuery.srcId = fileId;
                this.coverUrlFileDialogVisible = false;
            },
            coverUrlOnCancel() {
                this.coverUrlFileDialogVisible = false;
            },
            batchOpt(type) {
                const ids = [];
                this.multiSelection.map(item => {
                    ids.push(item.id);
                });

                if (!(Array.isArray(ids) && ids.length)) {
                    this.$errorMsg(this.$t('请选择需要操作的数据'));
                    return;
                }

                switch (type) {
                    case 'auth':
                        this.auth(ids);
                        break;
                }
            },
            auth(ids) {
                this.authIds = ids;
                this.isCourseEdit = true;
                this.$refs.selector.show();
            },
            enable(id) {
                // todo ajax
                enable({id}).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('操作成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            disable(id) {
                this.$confirm(this.$t('确定停用这家客户么？'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    // todo ajax
                    disable({id}).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.getList({pageNum: 1});
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            },
            handleAdd() {
                this.dialogVisible = true;
            }
        }
    };
</script>
