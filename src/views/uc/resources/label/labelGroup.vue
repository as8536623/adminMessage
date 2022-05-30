<style lang="scss">
    @import './style.scss';

    .label-container {
        .el-tabs__nav-scroll {
            height: 55px;
            line-height: 55px;
        }

        .el-tab-pane {
            padding: 0 20px;
        }

        .el-tabs__header {
            margin: 0;
        }
    }
</style>
<template>
    <article class="app-container label-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="标签管理" name="labelManage"/>
            <el-tab-pane label="标签组管理" name="labelGroup">
                <el-form
                    :model="listQuery"
                    :inline="true"
                    class="demo-form-inline veln__width label-form"
                    label-width="110px"
                >
                    <el-button type="primary" @click="add()">{{ $t('新增') }}</el-button>
                    <el-button @click="batchDel()">{{ $t('删除') }}</el-button>
                    <el-form-item class="pull-right">
                        <search-input
                            v-model="listQuery.name"
                            :placeholder="$t('请输入标签组名称')"
                            @enter="search"
                        />
                    </el-form-item>
                </el-form>
                <qgu-table
                    :columns="tableColumns"
                    :data="list"
                    :page="listQuery"
                    :total="total"
                    :loading="listLoading"
                    @selection-change="selectionChange"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    @sort-change="handleSortChange"
                />
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t('标签组-新增/编辑')"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible"
            width="520px"
            :before-close="handleClose"
            custom-class="label__dialog"
        >
            <el-form ref="editQuery" :model="editQuery" :rules="rules" label-width="110px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('标签组名称') + '：'" prop="name">
                        <el-input
                            v-model.trim="editQuery.name"
                            :maxlength="20"
                            :placeholder="$t('请输入标签组名称')"
                        />
                    </el-form-item>
                    <el-form-item v-if="!hasBgk" :label="$t('适用于') + '：'" prop="labelList">
                        <el-checkbox-group v-model="editQuery.labelList">
                            <el-checkbox
                                v-for="item in labelGroup.arr"
                                :key="item.code"
                                :label="item.code"
                            >{{ item.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item :label="$t('包含标签') + '：'">
                        <div class="tag__list">
                            <el-tag
                                v-for="tag in editQuery.labels"
                                :key="tag"
                                closable
                                :disable-transitions="false"
                                @close="handleTagClose(tag)"
                            >{{ tag }}
                            </el-tag>
                            <el-input
                                v-if="inputVisible"
                                ref="saveTagInput"
                                v-model="inputValue"
                                class="input-new-tag"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                            />
                            <el-button
                                v-else
                                class="button-new-tag"
                                size="small"
                                @click="showInput"
                            >+ {{ $t('请输入') }}
                            </el-button>
                        </div>
                        <svg-icon class-name="tip__icon" icon-class="tip"/>
                        <span class="label__desc">回车可添加标签，标签组内添加的标签也会添加到标签管理中</span>
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="dialogVisible=false">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="onSure">{{ $t('保存') }}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </article>
</template>
<script>
    import {deleteLabelGroup, editLabelGroup, getLabelGroupDetail, getList} from '@/api/labelCategory';
    import {LABEL_GROUP_ENUM} from '@/enum';
    import moment from 'moment';

    export default {
        name: 'LabelGroup',
        data() {
            const corpCode = this.$store.getters.corpCode;
            const hasBgk = 'bgk' === corpCode || 'bgh' === corpCode;
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    text: this.$t('标签组名称'),
                    minWidth: 160
                },
                {
                    hidden: hasBgk,
                    field: 'apps',
                    text: this.$t('应用于'),
                    minWidth: 130,
                    render: (h, param) => {
                        const names = this.labelGroupHandle(param.row.apps);
                        return names ? names.join('，') : '--';
                    }
                },
                {
                    field: 'labelCount',
                    text: this.$t('包含标签数量')
                },
                {
                    field: 'createdAt',
                    text: this.$t('创建时间'),
                    minWidth: 150,
                    sortable: 'custom',
                    render: (h, param) => {
                        const createdAt = param.row.createdAt;
                        return createdAt
                            ? moment(param.row.createdAt).format('YYYY-MM-DD HH:mm')
                            : '';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    minWidth: 100,
                    fixed: 'right',
                    render: (h, param) => {
                        const optArr = [];
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.del(param.row);
                                }
                            }
                        });
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.edit(param.row);
                                }
                            }
                        });
                        optArr.push(editBtn);
                        optArr.push(deleteBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                hasBgk,
                activeName: 'labelGroup',
                listQuery: {
                    name: '',
                    pageNum: 1,
                    pageSize: 20,
                    sort: 'desc'
                },
                tableColumns,
                list: [],
                total: 0,
                listLoading: false,
                labelGroup: LABEL_GROUP_ENUM,
                editQuery: {
                    id: '',
                    name: '',
                    labels: [],
                    labelList: ['COURSE'],
                    apps: ''
                },
                dialogVisible: false,
                inputVisible: false,
                inputValue: '',
                rules: {
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入标签组名称'),
                            trigger: 'blur'
                        }
                    ],
                    labelList: [
                        {
                            type: 'array',
                            required: true,
                            message: this.$t('请选择所属标签组'),
                            trigger: 'change'
                        }
                    ]
                }
            };
        },
        created() {
            this.getList();
        },
        methods: {
            handleClick(tab) {
                this.$router.push({name: tab.name});
            },
            selectionChange(v) {
                this.selectedData = v;
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
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                getList(params).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            add() {
                this.editQuery = {
                    id: '',
                    name: '',
                    labels: [],
                    labelList: ['COURSE'],
                    apps: ''
                };
                this.dialogVisible = true;
            },
            edit(row) {
                this.dialogVisible = true;
                getLabelGroupDetail({id: row.id}).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const {apps, name, labels, id} = result.data;
                        this.editQuery.labelList = apps ? apps.split(',') : [];
                        this.editQuery.name = name;
                        this.editQuery.labels = labels;
                        this.editQuery.id = id;
                    } else {
                        this.$errorMsg(result.msg || this.$t('获取信息失败'));
                    }
                });
            },
            batchDel() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }
                    deleteLabelGroup(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    deleteLabelGroup(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('删除成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            // 新增
            onSure() {
                this.editQuery.apps = this.editQuery.labelList
                    ? this.editQuery.labelList.join(',')
                    : null;
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        editLabelGroup(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.getList({
                                    pageNum: 1
                                });
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                            this.dialogVisible = false;
                        });
                    }
                });
            },
            handleClose() {
                this.editQuery = {
                    id: '',
                    name: '',
                    labels: [],
                    labelList: ['COURSE'],
                    apps: ''
                };
                this.dialogVisible = false;
            },
            // 标签删除
            handleTagClose(tag) {
                this.editQuery.labels.splice(this.editQuery.labels.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                const inputValue = this.inputValue;
                if (inputValue && !this.editQuery.labels.includes(inputValue)) {
                    this.editQuery.labels.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            labelGroupHandle(apps) {
                const list = apps ? apps.split(',') : [];
                const names = [];
                list.map(item => {
                    names.push(this.labelGroup.getName(item));
                });
                return names;
            },
            // 排序
            handleSortChange(column, prop, order) {
                if (this.listQuery.sort === 'desc') {
                    this.listQuery.sort = 'asc';
                } else {
                    this.listQuery.sort = 'desc';
                }
                this.getList({
                    pageNum: 1
                });
            }
        }
    };
</script>

