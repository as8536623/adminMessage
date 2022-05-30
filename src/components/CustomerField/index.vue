<style lang="scss" src='./style.scss'>
</style>
<template>
    <article class="stu__info__setting">
        <el-form label-width="140px">
            <el-form-item :label="$t('学员填写信息') + '：'">
                <el-form :inline="true" class="demo-form-inline">
                    <section v-for="(item, index) in stuInfoList" :key="index">
                        <el-form-item>
                            <el-input type="text" :placeholder="$t(item.columnName)" disabled/>
                        </el-form-item>
                        <el-form-item v-show="item.columnName !== '手机号码' && item.columnName !== '姓名'">
                            <el-checkbox v-model="item.required" :disabled="item.system">必填</el-checkbox>
                        </el-form-item>
                        <el-form-item>
                            <el-tooltip
                                v-if="!item.notDeletable"
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
                                v-if="!item.system"
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
                <veln-form-section :key="key" :title="$t('添加更多')" :expand="expandFlag">
                    <section class="stu__info__block">
                        <div class="stu__info__list">
                            <div>{{ $t('系统字段') }}</div>
                            <el-tag
                                v-for="(item, index) in systemFieldList"
                                :key="index"
                                @click="defaultTagClick(item, index)"
                            >{{ $t(item.columnName) }}
                            </el-tag>
                            <el-button
                                v-if="customFieldList.length === 0"
                                class="button-new-tag"
                                size="small"
                                @click="showCustom"
                            >+ {{ $t('自定义') }}
                            </el-button>
                        </div>
                        <div v-if="customFieldList.length > 0" class="stu__info__list">
                            <div>{{ $t('自定义字段') }}</div>
                            <el-tag
                                v-for="(item, index) in customFieldList"
                                :key="index"
                                @click="defaultTagClick(item, index)"
                            >{{ $t(item.columnName) }}
                            </el-tag>
                            <el-button
                                class="button-new-tag"
                                size="small"
                                @click="showCustom"
                            >+ {{ $t('自定义') }}
                            </el-button>
                        </div>
                    </section>
                </veln-form-section>
            </el-form-item>
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
                            v-model="editQuery.columnName"
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
    import {listAll} from '@/api/formBase';
    import {deepClone} from '@/utils';

    export default {
        name: 'StuInfoSetting',
        components: {
            VelnFormSection
        },
        props: {
            formList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            const validateRepeat = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入名称'));
                }
                if (this.repeatValidate()) {
                    callback();
                } else {
                    callback(new Error('名称重复'));
                }
            };
            return {
                stuInfoList: [],
                systemFieldList: [], // 系统字段
                customFieldList: [], // 自定义字段
                customDialogVisible: false,
                editQuery: {
                    columnName: '',
                    columnValue: '',
                    type: '',
                    required: false,
                    system: false
                },
                oldColumnName: '',
                activeIndex: -1, // 当前编辑stuInfoList下标
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
                expandFlag: false,
                loading: false
            };
        },
        watch: {
            formList: {
                handler(val) {
                    if (val.length > 0) {
                        this.stuInfoList = deepClone(val);
                        this.customFieldHandle();
                    } else {
                        this.defaultFieldHandle();
                    }
                },
                immediate: true
            }
        },
        created() {
            // this.listAll();
        },
        methods: {
            // 系统字段
            listAll() {
                this.loading = true;
                if (this.systemFieldList.length) {
                    return;
                }
                listAll().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.systemFieldList = result.data;
                        (this.systemFieldList || []).map(item => {
                            item.system = true;
                        });
                        (this.systemFieldList || []).map(item => {
                            if (item.required) {
                                item.notDeletable = true;
                                this.stuInfoList.push(item);
                            }
                        });
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            showCustom() {
                this.customDialogVisible = true;
                this.editQuery = {
                    columnName: '',
                    columnValue: '',
                    type: '',
                    required: false,
                    system: false
                };
            },
            handleClose() {
                this.editQuery = {
                    columnName: '',
                    columnValue: '',
                    type: '',
                    required: false,
                    system: false
                };
                this.oldColumnName = '';
                this.customDialogVisible = false;
            },
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.editQuery.columnName === '姓名' || this.editQuery.columnName === '手机号码') {
                            return;
                        }
                        if (!this.editQuery.isEdit) {
                            this.customFieldList.push(this.editQuery);
                            this.stuInfoList.push(this.editQuery);
                        } else {
                            // 编辑--自定义字段/信息修改
                            const data = this.stuInfoList[this.activeIndex];
                            this.stuInfoList[this.activeIndex] = this.editQuery;
                            this.customFieldList.map((item, index) => {
                                if (item.columnName === data.columnName) {
                                    this.customFieldList[index] = this.editQuery;
                                    this.customFieldList[index].required = false;
                                }
                            });
                        }
                        this.customDialogVisible = false;
                        this.key = +new Date();
                        this.expandFlag = true;
                    }
                });
            },
            defaultTagClick(item) {
                for (let i = 0; i < this.stuInfoList.length; i++) {
                    if (this.stuInfoList[i].columnName === item.columnName) {
                        return;
                    }
                }
                this.stuInfoList.push(item);
            },
            del(index) {
                this.stuInfoList.splice(index, 1);
                this.key = +new Date();
                this.expandFlag = true;
            },
            // 自定义字段回显
            customFieldHandle() {
                this.customFieldList = [];
                this.systemFieldList = [];
                this.stuInfoList.map(item => {
                    if (!item.system) {
                        this.customFieldList.push(item);
                    } else {
                        this.systemFieldList.push(item);
                    }
                });
                this.key = +new Date();
            },
            // 默认显示--姓名/手机号码
            defaultFieldHandle() {
                if (this.loading) {
                    return;
                }
                this.listAll();
            },
            // 自定义字段新增--验证名称重复
            repeatValidate() {
                if (this.oldColumnName === this.editQuery.columnName) {
                    return true;
                }
                if (
                    !(Array.isArray(this.stuInfoList) &&
                        this.stuInfoList.length)
                ) {
                    return true;
                }
                for (let i = 0; i < this.stuInfoList.length; i++) {
                    if (
                        this.stuInfoList[i].columnName ===
                        this.editQuery.columnName
                    ) {
                        return false;
                    }
                }
                return true;
            },
            edit(item, index) {
                this.editQuery = Object.assign({}, this.editQuery, item);
                this.editQuery.isEdit = true;
                this.oldColumnName = item.columnName;
                this.activeIndex = index;
                this.customDialogVisible = true;
            }
        }
    };
</script>
