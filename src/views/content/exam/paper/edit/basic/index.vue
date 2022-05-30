<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container paper-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-steps :data="steps" :active="active" @change="stepChange"/>
            <section class="tool-form-item">
                <el-form-item :label="$t('试卷编号') + '：'" prop="paperCode">
                    <el-input
                        v-model.trim="editQuery.paperCode"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item :label="$t('试卷名称') + '：'" prop="paperName">
                    <el-input
                        v-model.trim="editQuery.paperName"
                        class="input__limit"
                        type="text"
                        :placeholder="$t('长度小于50')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item :label="$t('试卷类型') + '：'">
                    <el-radio-group
                        v-model="editQuery.paperType"
                        :disabled="editQuery.id && editQuery.paperStatus !== 'DRAFT' ? true: false"
                        @change="paperTypeChange"
                    >
                        <div v-for="item in TEST_PAPER_TYPE_ENUM.arr" :key="item.code" class="el__item--radio">
                            <el-radio :label="item.code">
                                {{ item.name }}
                            </el-radio>
                            <span v-show="item.code === 'FIXED'" class="el__item__tip">{{ $t('每位考生接收到的试卷内容完全一致') }}</span>
                            <span v-show="item.code === 'RANDOM'" class="el__item__tip">{{ $t('生成试卷模板，考试时每位考生会随机抽取其中一套参加考试') }}</span>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('试卷属性') + '：'" class="el__form__item--security">
                    <el-radio-group v-model="editQuery.security">
                        <el-radio :label="false">
                            <div class="el__item--common">
                                <div class="security">{{ $t('普通试卷') }}</div>
                                <div class="security__desc">{{ $t('除创建人外，被授权的管理员也可使用和预览') }}</div>
                            </div>
                        </el-radio>
                        <el-radio :label="true">
                            <div class="el__item--common el__item--security">
                                <div class="security">{{ $t('绝密试卷') }}</div>
                                <div class="security__desc">{{ $t('仅创建人可以管理、使用和预览') }}</div>
                            </div>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('所属类别') + '：'">
                    <el-input
                        ref="categoryInput"
                        v-model.trim="editQuery.categoryName"
                        :placeholder="$t('请选择类别')"
                        :max-length="32"
                        clearable
                        @clear="clearCategory"
                        @focus="showCategorySelect"
                    />
                </el-form-item>
                <el-form-item :label="$t('') ">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure(1)">{{ $t('下一步') }}</el-button>
                </el-form-item>
            </section>
        </el-form>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择类别')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-paper-category-select
                ref="category"
                :default-expand-all="defaultExpandAll"
                :show-include-child="false"
            />
            <div class="dialog__btn__line">
                <el-button @click="categoryDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="categorySelect">{{ $t('确定') }}</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import VelnPaperCategorySelect from '@/components/VelnPaperCategorySelect';
    import {getPaperCode, getBasic, saveBasic} from '@/api/paper/paperTemplate';
    // import {getInfoTime} from '@/api/faceCourse';
    import {TEST_PAPER_TYPE_ENUM} from '@/enum';

    export default {
        name: 'PaperBasic',
        components: {
            VelnSteps,
            VelnPaperCategorySelect
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('必考题'),
                    status: 'wait',
                    disabled: true
                },
                {
                    title: this.$t('随机题'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                TEST_PAPER_TYPE_ENUM,
                editQuery: {
                    id: this.$route.query.id,
                    paperCode: '',
                    paperName: '',
                    paperType: 'FIXED',
                    categoryId: this.$route.query.cId,
                    categoryName: this.$route.query.cName,
                    security: false
                },
                rules: {
                    paperName: [
                        {
                            required: true,
                            message: this.$t('请输入试卷标题'),
                            trigger: 'blur'
                        }
                    ],
                    paperCode: [
                        {
                            required: true,
                            message: this.$t('请输入试卷编号'),
                            trigger: 'blur'
                        }
                    ]
                },
                active: 0,
                steps,
                selectedList: [],
                categoryDialogVisible: false,
                defaultExpandAll: true
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.getBasic(this.$route.query.id);
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                } else {
                    this.getCode();
                    this.paperTypeChange();
                }
            },
            getCode() {
                getPaperCode().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.paperCode = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取编号异常'));
                    }
                });
            },
            cancel() {
                this.$router.push({
                    name: 'paperList'
                });
            },
            sure(index) {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        saveBasic(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.next(index, result.data.id);
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            // 编辑回显
            getBasic(id) {
                const params = {paperTemplateId: id};
                getBasic(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        this.selectedList[0] = result.data.paperTemplate
                            ? result.data.paperTemplate.id
                            : [];
                        this.paperTypeChange();
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            paperTypeChange() {
                if (this.editQuery.paperType === 'FIXED') {
                    this.steps.pop();
                } else {
                    const data = {
                        title: this.$t('随机题'),
                        status: 'wait',
                        disabled: true
                    };
                    if (this.editQuery.id) {
                        data.status = 'done';
                        data.disabled = false;
                    }
                    this.$set(this.steps, 2, data);
                }
            },
            stepChange(index) {
                this.sure(index);
            },
            next(index, id) {
                switch (index) {
                    case 1:
                        this.$router.push({
                            name: 'fixedQuestion',
                            query: {
                                id
                            }
                        });
                        break;
                    case 2:
                        this.$router.push({
                            name: 'randomQuestion',
                            query: {
                                id: this.editQuery.id
                            }
                        });
                        break;
                }
            },
            // 类别选择
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.editQuery.categoryId = result.id;
                this.editQuery.categoryName = result.name;
                this.categoryDialogVisible = false;
                this.$refs.editQuery.validateField('categoryId');
            },
            showCategorySelect() {
                this.categoryDialogVisible = true;
                this.$refs.categoryInput.blur();
            },
            clearCategory() {
                this.editQuery.categoryId = '';
                this.$refs.editQuery.validateField('categoryId');
            },
            categoryDlgClose() {
                this.$refs.editQuery.validateField('categoryId');
            }
        }
    };
</script>
