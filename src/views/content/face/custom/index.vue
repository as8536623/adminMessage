<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="custom__container">
        <el-form
            ref="listQuery"
            :model="listQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('自定义字段')" :can-expand="false">
                <el-form-item :label="$t('自定义字段') + '：'">
                    <el-form :inline="true" class="demo-form-inline">
                        <section v-for="(item, index) in listQuery.list" :key="index">
                            <el-form-item>
                                <el-input type="text" :placeholder="$t(item.columnName)" disabled/>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox v-model="item.required">必填</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="$t('删除')"
                                    placement="top"
                                >
                                    <el-button type="text" size="mini" @click="del(index)">
                                        <svg-icon class-name="tree__icon" icon-class="del"/>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="$t('编辑')"
                                    placement="top"
                                >
                                    <el-button type="text" size="mini" @click="edit(item, index)">
                                        <svg-icon class-name="tree__icon" icon-class="edit_s"/>
                                    </el-button>
                                </el-tooltip>
                            </el-form-item>
                        </section>
                    </el-form>
                    <div class="opt__line">
                        <el-button type="primary" @click="addMore">{{ $t('添加更多') }}</el-button>
                    </div>
                </el-form-item>
                <el-form-item :label="$t('')">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
                </el-form-item>
            </veln-form-section>
        </el-form>
        <el-dialog
            v-if="customDialogVisible"
            append-to-body
            :title="$t('自定义字段')"
            :visible.sync="customDialogVisible"
            width="600px"
            :before-close="handleClose"
            custom-class="custom__dialog"
        >
            <section class="dialog__form__container">
                <el-form ref="editQuery" label-width="100px" :rules="rules" :model="editQuery">
                    <el-form-item :label="$t('名称') + '：'" prop="columnName">
                        <el-input
                            v-model.trim="editQuery.columnName"
                            type="text"
                            :placeholder="$t('请输入名称')"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('类型') + '：'" prop="type">
                        <el-radio v-model="editQuery.type" label="RADIO" border>{{ $t('单选') }}</el-radio>
                        <el-radio v-model="editQuery.type" label="TEXT" border>{{ $t('文本') }}</el-radio>
                        <el-radio v-model="editQuery.type" label="NUMBER" border>{{ $t('数字') }}</el-radio>
                        <el-radio v-model="editQuery.type" label="DATE" border>{{ $t('日期') }}</el-radio>
                        <section v-if="editQuery.type === 'RADIO'" class="custom__type__container">
                            <span>{{ $t('请用英文逗号分隔每个选项') }}</span>
                            <div>
                                <el-input
                                    v-model.trim="editQuery.columnValue"
                                    type="textarea"
                                    :placeholder="$t('请输入')"
                                    :rows="5"
                                />
                            </div>
                        </section>
                        <section
                            v-else-if="editQuery.type === 'TEXT'"
                            class="custom__type__container"
                        >
                            <span>{{ $t('示意') + '：' }}</span>
                            <div class="custom__type__block">
                                <el-form>
                                    <el-form-item :label="$t('文本') + '：'">
                                        <el-input type="text" :placeholder="$t('请输入')" readonly/>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </section>
                        <section
                            v-else-if="editQuery.type === 'NUMBER'"
                            class="custom__type__container"
                        >
                            <span>{{ $t('示意') + '：' }}</span>
                            <div class="custom__type__block">
                                <el-form>
                                    <el-form-item :label="$t('数字') + '：'">
                                        <el-input type="text" :placeholder="$t('请输入数字')" readonly/>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </section>
                        <section
                            v-else-if="editQuery.type === 'DATE'"
                            class="custom__type__container"
                        >
                            <span>{{ $t('示意') + '：' }}</span>
                            <div class="custom__type__block">
                                <el-form>
                                    <el-form-item :label="$t('日期') + '：'">
                                        <el-date-picker
                                            type="datetime"
                                            readonly
                                            :placeholder="$t('选择日期时间')"
                                        />
                                    </el-form-item>
                                </el-form>
                            </div>
                        </section>
                    </el-form-item>
                </el-form>
                <div class="dialog__btn__line">
                    <el-button @click="customDialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="onSure">保存</el-button>
                </div>
            </section>
        </el-dialog>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {getBaseForm, saveBaseForm} from '@/api/faceCourse';

    export default {
        name: 'CustomFields',
        components: {
            VelnFormSection
        },
        data() {
            const validateRepeat = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入名称'));
                }
                if (this.editQuery.isEdit || this.repeatValidate()) {
                    callback();
                } else {
                    callback(new Error('名称重复'));
                }
            };
            return {
                listQuery: {
                    appCode: 'veln-face',
                    list: []
                },
                customDialogVisible: false,
                editQuery: {
                    columnName: '',
                    columnValue: '',
                    type: '',
                    isEdit: false
                },
                rules: {
                    columnName: [
                        {
                            required: true,
                            message: this.$t('请输入名称'),
                            trigger: 'blur'
                        },
                        {validator: validateRepeat, trigger: 'blur'}
                    ],
                    type: [
                        {
                            required: true,
                            message: this.$t('请选择类型'),
                            trigger: 'change'
                        }
                    ]
                },
                key: null,
                activeIndex: -1
            };
        },
        created() {
            this.getBaseForm();
        },
        methods: {
            getBaseForm() {
                const params = {appCode: this.listQuery.appCode};
                getBaseForm(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.listQuery.list = result.data || [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            addMore() {
                this.customDialogVisible = true;
                this.editQuery = {
                    columnName: '',
                    columnValue: '',
                    type: ''
                };
            },
            handleClose() {
                this.editQuery = {
                    columnName: '',
                    columnValue: '',
                    type: '',
                    isEdit: false
                };
                this.customDialogVisible = false;
            },
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (!this.editQuery.isEdit) {
                            this.listQuery.list.push(this.editQuery);
                        } else {
                            // 编辑--自定义字段/信息修改
                            this.listQuery.list[this.activeIndex] = this.editQuery;
                        }
                        this.customDialogVisible = false;
                        this.key = +new Date();
                    }
                });
            },
            // 编辑
            edit(item, index) {
                this.editQuery = Object.assign({}, this.editQuery, item);
                this.editQuery.isEdit = true;
                this.activeIndex = index;
                this.customDialogVisible = true;
            },
            del(index) {
                this.listQuery.list.splice(index, 1);
                this.key = +new Date();
            },
            // 自定义字段新增--验证名称重复
            repeatValidate() {
                for (let i = 0; i < this.listQuery.list.length; i++) {
                    if (
                        this.listQuery.list[i].columnName ===
                        this.editQuery.columnName
                    ) {
                        return false;
                    }
                }
                return true;
            },
            cancel() {
                this.$router.push({name: 'faceCourseList'});
            },
            save() {
                saveBaseForm(this.listQuery).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.cancel();
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            }
        }
    };
</script>
