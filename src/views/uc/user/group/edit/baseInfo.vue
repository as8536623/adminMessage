<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container form__page">
        <el-form
            ref="editQuery"
            :model="editQuery"
            :rules="rules"
            label-width="140px"
            :inline-message="true"
        >
            <el-form-item :label="$t('群组类别') + '：'" prop="categoryName">
                <el-input
                    ref="groupCategoryInput"
                    v-model.trim="editQuery.categoryName"
                    :placeholder="$t('请选择群组类别')"
                    :max-length="32"
                    clearable
                    @focus="showGroupSelect"
                />
                <el-button type="text" class="text--primary" @click="toNewGroupCategory">新建类别</el-button>
            </el-form-item>
            <el-form-item :label="$t('群组名称') + '：'" prop="name">
                <el-input v-model.trim="editQuery.name" :placeholder="$t('群组名称')" :max-length="50"/>
            </el-form-item>
            <section v-if="type!=='VIEW' && type==='ADD'" class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="onSure">{{ $t('下一步') }}</el-button>
            </section>
            <section v-if="type!=='VIEW' && type!=='ADD'" class="form__page__btn">
                <el-button type="primary" @click="onSure">{{ $t('保存') }}</el-button>
            </section>
        </el-form>
        <el-dialog
            v-if="groupDialogVisible"
            append-to-body
            :title="$t('选择群组分类')"
            :visible.sync="groupDialogVisible"
            width="339px"
            @close="groupDlgClose"
        >
            <veln-group-select ref="groupCategory"/>
            <div class="dialog__btn__line">
                <el-button @click="groupDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="groupSelect">确定</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnGroupSelect from '@/components/VelnGroupSelect';
    import {insertGroup, updateGroup} from '@/api/group';
    export default {
        name: 'GroupEdit',
        components: {
            VelnGroupSelect
        },
        props: {
            info: {
                type: Object,
                default: () => {
                    return {
                        categoryId: '',
                        categoryName: '',
                        name: '',
                        id: ''
                    };
                }
            },
            type: {
                type: String,
                default: 'Add'
            },
            activityType: {
                type: [String],
                default: ''
            },
            editData: {
                type: [Object],
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                editType: this.type,
                funCode: 'uc_group_category',
                groupDialogVisible: false, // 部门选择
                editQuery: {
                    categoryId: '',
                    categoryName: '',
                    name: '',
                    id: this.$route.query.id
                },
                rules: {
                    categoryName: [
                        {
                            required: true,
                            message: this.$t('请选择群组'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入群组名称'),
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        watch: {
            info: {
                handler(val) {
                    const pathList = val.categoryNamePath
                        ? val.categoryNamePath.split('.')
                        : '';
                    this.editQuery = {
                        categoryId: val.categoryId,
                        categoryName:
                            val.categoryName || pathList[pathList.length - 1],
                        name: val.name,
                        id: val.id
                    };
                },
                immediate: true,
                deep: true
            },
            type: {
                handler(val) {
                    this.editType = val;
                },
                immediate: true
            }
        },
        created() {},
        methods: {
            groupSelect() {
                const $groupCategory = this.$refs.groupCategory;
                const result = $groupCategory.getActive();
                this.editQuery.categoryId = result.id;
                this.editQuery.categoryName = result.name;
                this.groupDialogVisible = false;
                this.$refs.editQuery.validateField('categoryName');
            },
            showGroupSelect() {
                this.groupDialogVisible = true;
                this.$refs.groupCategoryInput.blur();
            },
            toNewGroupCategory() {
                this.$router.push({name: `groupCategory`});
            },
            onSure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (!this.editQuery.id) {
                            insertGroup(this.editQuery).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    if (this.type === 'ADD') {
                                        this.$emit(
                                            'next',
                                            result.data,
                                            this.editQuery
                                        );
                                    }
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                            return;
                        }
                        updateGroup(this.editQuery).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.$emit('next');
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                    }
                });
            },
            cancel() {
                history.go(-1);
            },
            groupDlgClose() {
                this.$refs.editQuery.validateField('categoryName');
            }
        }
    };
</script>
