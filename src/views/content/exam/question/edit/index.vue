<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container question__edit">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <el-form-item
                    :label="$t('所属题库') + '：'"
                    prop="itemBank.id"
                    :rules="[{required: true, message: $t('请选择题库类别'), trigger: 'blur'}]"
                >
                    <el-input
                        ref="categoryInput"
                        v-model.trim="editQuery.itemBank.bankName"
                        :placeholder="$t('请选择所属题库')"
                        :max-length="32"
                        clearable
                        @focus="showCategorySelect"
                    />
                </el-form-item>
                <el-form-item :label="$t('试题分值') + '：'" prop="mark">
                    <el-input-number
                        v-model="editQuery.mark"
                        :precision="1"
                        :step="1"
                        :min="0.1"
                        :max="100"
                        :placeholder="$t('分值')"
                    />
                </el-form-item>
                <el-form-item :label="$t('试题难度') + '：'" class="required form__item__level">
                    <el-rate v-model="level" show-text :texts="texts" @change="levelHandle"/>
                </el-form-item>
            </veln-form-section>
            <veln-form-section :title="$t('试题内容')" :can-expand="false">
                <el-form-item :label="$t('选择题型') + '：'">
                    <el-radio-group v-model="editQuery.type" @change="questionTypeChange">
                        <el-radio
                            v-for="item in TEST_QUESTION_TYPE_ENUM.arr"
                            :key="item.code"
                            :label="item.code"
                            :disabled="!!editQuery.id"
                        >{{ item.name }}
                        </el-radio>
                    </el-radio-group>
                    <section class="exam__type">
                        <exam-single
                            v-if="editQuery.type === 'SINGLE_SELECTION'"
                            ref="question"
                            :content="editQuery.content"
                        />
                        <exam-multiple
                            v-if="editQuery.type === 'MULTI_SELECTION'"
                            ref="question"
                            :content="editQuery.content"
                        />
                        <exam-multiple
                            v-if="editQuery.type === 'INDEFINITE_SELECTION'"
                            ref="question"
                            :content="editQuery.content"
                            type="indefinite"
                        />
                        <exam-judgment
                            v-if="editQuery.type === 'JUDGMENT'"
                            ref="question"
                            :content="editQuery.content"
                        />
                        <exam-fill
                            v-if="editQuery.type === 'FILL'"
                            ref="question"
                            :content="editQuery.content"
                        />
                        <exam-questions
                            v-if="editQuery.type === 'QUESTIONS'"
                            ref="question"
                            :content="editQuery.content"
                        />
                    </section>
                </el-form-item>
            </veln-form-section>
            <veln-form-section :title="$t('其他信息')" :expand="false">
                <el-form-item :label="$t('是否绝密') + '：'" prop="security">
                    <el-radio-group v-model="editQuery.security">
                        <div class="el__form-radio">
                            <el-radio :label="false">否</el-radio>
                            <span>{{ $t('非绝密试题允许创建人和其他被授权管理员查看并使用试题') }}</span>
                        </div>
                        <div class="el__form-radio">
                            <el-radio :label="true">是</el-radio>
                            <span>{{ $t('绝密试题只允许创建人查看并使用试题') }}</span>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('试题编号') + '：'" :rules="rules.required">
                    <el-input
                        v-model.trim="editQuery.itemCode"
                        :placeholder="$t('试题编号')"
                        :max-length="50"
                    />
                </el-form-item>
                <el-form-item :label="$t('试题用途') + '：'" :rules="rules.select">
                    <el-select
                        v-model="editQuery.attribute"
                        class="course__type__select"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in TEST_ATTRIBUTE_ENUM.arr"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('试题语言') + '：'" :rules="rules.select">
                    <el-select
                        v-model="editQuery.languageType"
                        class="course__type__select"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in LANGUAGE_TYPE_ENUM.arr"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('知识点') + '：'">
                    <el-tag
                        v-for="(item, index) in editQuery.knowledgeList"
                        :key="item.id"
                        :disable-transitions="false"
                        :closable="true"
                        @close="knowledgeDel(index)"
                    >{{ item.knowledgeName }}
                    </el-tag>
                    <el-button type="text" @click="showKnowledgeSelect">{{ $t('请选择知识点') }}</el-button>
                </el-form-item>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button type="primary" @click="sure">{{ $t('保存') }}</el-button>
                <el-button type="primary" @click="sure('enable')">{{ $t('启用') }}</el-button>
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
            </section>
        </el-form>

        <el-dialog append-to-body :title="$t('选择题库')" :visible.sync="itemBankVisible" width="339px">
            <veln-item-bank-select ref="itemBank" :category="true" @select="itemBankSelect"/>
            <div class="dialog__btn__line">
                <el-button @click="itemBankVisible=false">取消</el-button>
                <el-button type="primary" @click="itemBankSure">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="pointsVisible"
            append-to-body
            :title="$t('选择知识点')"
            :visible.sync="pointsVisible"
            width="339px"
        >
            <veln-knowledge-points-select
                ref="points"
                :category="true"
                :show-checkbox="true"
                :check-strictly="true"
                :expand-on-click-node="true"
                :default-checked-keys="editQuery.knowledgeIds"
            />
            <div class="dialog__btn__line">
                <el-button @click="pointsVisible=false">取消</el-button>
                <el-button type="primary" @click="pointsSelect">保存</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnItemBankSelect from '@/components/VelnItemBankSelect';
    import ExamQuestions from '@/components/VelnQuestion/Questions';
    import ExamFill from '@/components/VelnQuestion/Fill';
    import ExamJudgment from '@/components/VelnQuestion/Judgment';
    import ExamSingle from '@/components/VelnQuestion/Single';
    import ExamMultiple from '@/components/VelnQuestion/Multiple';
    import VelnKnowledgePointsSelect from '@/components/VelnKnowledgePointsSelect';
    import {
        LANGUAGE_TYPE_ENUM,
        TEST_ATTRIBUTE_ENUM,
        TEST_QUESTION_LEVEL_ENUM,
        TEST_QUESTION_TYPE_ENUM
    } from '@/enum';
    import {
        addEnableItem,
        addItem,
        genItemCode,
        getItem
    } from '@/api/exam/item/item';
    import {deepClone} from '@/utils';
    // 题干初始化数据
    import ct from './data';

    export default {
        name: 'EditExamQuestion',
        components: {
            VelnFormSection,
            ExamQuestions,
            ExamFill,
            ExamJudgment,
            ExamSingle,
            ExamMultiple,
            VelnItemBankSelect,
            VelnKnowledgePointsSelect
        },
        data() {
            return {
                TEST_QUESTION_TYPE_ENUM,
                TEST_QUESTION_LEVEL_ENUM,
                TEST_ATTRIBUTE_ENUM,
                LANGUAGE_TYPE_ENUM,
                editQuery: {
                    itemBank: {
                        id: this.$route.query.bankId || '',
                        bankName: this.$route.query.bankName || ''
                    },
                    mark: 1.0,
                    level: 'RELATIVELY_SIMPLE',
                    type: 'SINGLE_SELECTION',
                    content: {
                        ct: deepClone(ct),
                        ios: [
                            {
                                ct: deepClone(ct),
                                t: true,
                                tp: 'TEXT'
                            },
                            {
                                ct: deepClone(ct),
                                tp: 'TEXT'
                            },
                            {
                                ct: deepClone(ct),
                                tp: 'TEXT'
                            },
                            {
                                ct: deepClone(ct),
                                tp: 'TEXT'
                            }
                        ],
                        ep: deepClone(ct),
                        m: ''
                    },
                    security: false,
                    languageType: 'CHINESE',
                    choosenLanguage: '',
                    knowledgeIds: [],
                    knowledgeList: [],
                    attribute: 'EXAMEXERCISE',
                    choosenAttribute: '',
                    itemCode: '',
                    id: this.$route.query.id
                },
                texts: [
                    this.$t('简单'),
                    this.$t('较简单'),
                    this.$t('中等'),
                    this.$t('较难'),
                    this.$t('困难')
                ],
                level: 2,
                rules: {
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ],
                    select: [
                        {
                            required: true,
                            message: this.$t('请选择'),
                            trigger: 'change'
                        }
                    ],
                    mark: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ]
                },
                options: [
                    {
                        value: 'VIDEO',
                        label: '视频'
                    },
                    {
                        value: 'AUDIO',
                        label: '音频'
                    },
                    {
                        value: 'WORD',
                        label: '文档'
                    }
                ],
                itemBankVisible: false,
                pointsVisible: false
            };
        },
        created() {
            this.init();
        },
        methods: {
            // 获取初始化编号ƒ
            getCode() {
                genItemCode().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.itemCode = result.data;
                    } else {
                        this.$errorMsg(result.msg);
                    }
                });
            },
            // 初始化
            init() {
                if (this.$route.query.id) {
                    this.getItem();
                } else {
                    this.getCode();
                }
            },
            getItem() {
                getItem(this.$route.query.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        const level = this.TEST_QUESTION_LEVEL_ENUM.getName(
                            result.data.level
                        );
                        this.level = this.texts.indexOf(level) + 1;
                        this.editQuery.knowledgeIds = [];
                        Array.isArray(this.editQuery.knowledgeList) &&
                            this.editQuery.knowledgeList.map(item => {
                                this.editQuery.knowledgeIds.push(item.id);
                            });
                        // 数据处理 content
                        this.dataFormat(result.data);
                        // this.editQuery.content = JSON.parse(result.data.content);

                        // this.editQuery.content.ct = JSON.parse(
                        //     this.editQuery.content.ct
                        // );
                        // this.editQuery.content.ep ? this.editQuery.content.ep = JSON.parse(
                        //     this.editQuery.content.ep
                        // ) : this.editQuery.content.ep = deepClone(ct);
                        // Array.isArray(this.editQuery.content.ios) &&
                        // this.editQuery.content.ios.map(item => {
                        //     item.ct = JSON.parse(item.ct);
                        // });
                        console.log(this.editQuery.content);
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            dataFormat(data) {
                const content = JSON.parse(data.content);
                // 题干
                content.ct = Object.assign({}, deepClone(ct), JSON.parse(content.ct));
                // 解析处理
                if (content.ep) {
                    content.ep = Object.assign({}, deepClone(ct), JSON.parse(content.ep));
                } else {
                    content.ep = deepClone(ct);
                }
                // 选项
                Array.isArray(content.ios) &&
                    content.ios.map(item => {
                        item.ct = Object.assign({}, deepClone(ct), JSON.parse(item.ct));
                        item.tp = item.tp ? item.tp : 'TEXT';
                    });
                this.editQuery.content = content;
            },
            // 所属题库
            showCategorySelect() {
                this.itemBankVisible = true;
                this.$refs.categoryInput.blur();
            },
            itemBankSure() {
                const node = this.$refs.itemBank.getActive();
                this.itemBankSelect(node);
            },
            // 试题-选择题库
            itemBankSelect(node) {
                const {category, id, name} = node;
                if (category) {
                    this.$warnMsg(this.$t('不能选择题库类别'));
                    return;
                }
                this.editQuery.itemBank.id = id;
                this.editQuery.itemBank.bankName = name;
                this.$refs.editQuery.validateField('itemBank.id');
                this.itemBankVisible = false;
            },
            // 提醒切换
            questionTypeChange() {
                this.editQuery.content = {};
                let data = {};
                switch (this.editQuery.type) {
                    case 'SINGLE_SELECTION':
                    case 'INDEFINITE_SELECTION':
                        data = {
                            ct: deepClone(ct),
                            ios: [
                                {ct: deepClone(ct), t: true, tp: 'TEXT'},
                                {ct: deepClone(ct), tp: 'TEXT'},
                                {ct: deepClone(ct), tp: 'TEXT'},
                                {ct: deepClone(ct), tp: 'TEXT'}
                            ],
                            ep: deepClone(ct),
                            m: ''
                        };
                        break;
                    case 'MULTI_SELECTION':
                        data = {
                            ct: deepClone(ct),
                            ios: [
                                {ct: deepClone(ct), t: true, tp: 'TEXT'},
                                {ct: deepClone(ct), t: true, tp: 'TEXT'},
                                {ct: deepClone(ct), tp: 'TEXT'},
                                {ct: deepClone(ct), tp: 'TEXT'}
                            ],
                            ep: deepClone(ct),
                            m: ''
                        };
                        break;
                    case 'JUDGMENT':
                        data = {
                            ct: deepClone(ct),
                            t: true,
                            ep: deepClone(ct),
                            m: ''
                        };
                        break;
                    case 'FILL':
                    case 'QUESTIONS':
                        data = {
                            ct: deepClone(ct),
                            a: '',
                            ep: deepClone(ct),
                            m: ''
                        };
                        break;
                }
                this.editQuery.content = data;
            },
            // 校验 题干 是否为空
            isCtEmpty() {
                return (
                    !this.editQuery.content.ep.ct &&
                    !this.editQuery.content.ep.code &&
                    !this.editQuery.content.ep.imageList.length &&
                    !this.editQuery.content.ep.videoList.length &&
                    !this.editQuery.content.ep.audioList.length
                );
            },
            sure(type) {
                if (this.editQuery.type === 'FILL') {
                    const list = [];
                    const blankList = this.$refs.question.editQuery.blankList;
                    Array.isArray(blankList) &&
                        blankList.map(item => {
                            list.push(item.value);
                        });
                    this.editQuery.content.a = list ? list.join('|') : '';
                }
                // 题干空时默认为“暂无”
                if (this.isCtEmpty()) {
                    this.editQuery.content.ep.ct = '暂无';
                }
                const msg = this.validateHandle();
                const params = deepClone(this.editQuery);
                params.content.ct = JSON.stringify(params.content.ct);
                params.content.ep = JSON.stringify(params.content.ep);
                Array.isArray(params.content.ios) &&
                    params.content.ios.map(item => {
                        item.ct = JSON.stringify(item.ct);
                    });
                params.content = JSON.stringify(params.content);
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        this.$errorMsg(this.$t('请正确填写表单内容'));
                    }
                    if (valid && !msg) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        // 保存并启用
                        if (type === 'enable') {
                            addEnableItem(params).then(res => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = res.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.cancel();
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                        } else {
                            // 保存为草稿
                            addItem(params).then(res => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = res.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.cancel();
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                        }
                    } else if (msg) {
                        this.$warnMsg(this.$t(msg));
                    }
                });
            },
            validateHandle() {
                let msg = '';
                if (!this.editQuery.content.ct.ct) {
                    return (msg = '请完善题干内容');
                }
                switch (this.editQuery.type) {
                    case 'SINGLE_SELECTION':
                    case 'INDEFINITE_SELECTION':
                        msg = this.optionValidate(this.editQuery.type);
                        break;
                    case 'MULTI_SELECTION':
                        msg = this.optionValidate(this.editQuery.type);
                        break;
                    case 'JUDGMENT':
                        break;
                    case 'FILL':
                        if (!this.$refs.question.validate()) {
                            msg = '请完善填空题';
                        }
                        break;
                    case 'QUESTIONS':
                        if (!this.editQuery.content.a) {
                            msg = '请完善参考答案';
                        }
                        break;
                }
                return msg;
            },
            // 校验选项是否为空
            isOptionCtEmpty(ct) {
                return (
                    !ct.ct &&
                    !ct.imageList.length &&
                    !ct.videoList.length &&
                    !ct.audioList.length
                );
            },
            optionValidate(type) {
                let msg = '';
                let total = 0;
                for (let i = 0; i < this.editQuery.content.ios.length; i++) {
                    if (this.isOptionCtEmpty(this.editQuery.content.ios[i].ct)) {
                        msg = this.$t('请完善选项内容');
                        return msg;
                    }
                    if (this.editQuery.content.ios[i].t) {
                        total++;
                    }
                }
                switch (type) {
                    case 'MULTI_SELECTION':
                        msg = total <= 1 ? '正确答案至少两项' : '';
                        break;
                    default:
                        msg = total < 1 ? '正确答案至少一项' : '';
                        break;
                }
                return msg;
            },
            cancel() {
                this.$router.push({name: 'examQuestion'});
            },
            // 试题难度
            levelHandle(index) {
                this.editQuery.level = this.TEST_QUESTION_LEVEL_ENUM.arr[
                    index - 1
                ].code;
            },
            // 知识点
            showKnowledgeSelect() {
                this.pointsVisible = true;
            },
            // 知识点选择
            pointsSelect() {
                const $points = this.$refs.points;
                const results = $points.getActives();
                const ids = [];
                const knowledgeList = [];
                Array.isArray(results) &&
                    results.map(item => {
                        if (item.parentName && !item.category) {
                            ids.push(item.id);
                            const data = {
                                id: item.id,
                                knowledgeName: item.name
                            };
                            knowledgeList.push(data);
                        }
                    });
                this.editQuery.knowledgeIds = ids;
                this.editQuery.knowledgeList = knowledgeList;
                this.pointsVisible = false;
            },
            knowledgeDel(index) {
                this.editQuery.knowledgeIds.splice(index, 1);
                this.editQuery.knowledgeList.splice(index, 1);
            }
        }
    };
</script>
