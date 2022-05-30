<style lang="scss" scoped>
    @import "style.scss";
</style>
<template>
    <article class="paper__preview__container">
        <div class="preview__header">
            <div v-if="paperTemplate.security" class="preview__label"/>
            <div class="preview__nav">
                <div class="preview__info">
                    <div class="paper__name">{{ paperTemplate.paperName }}</div>
                    <div class="info__item">
                        <span>{{ $t('共') + info.itemCount + $t('小题') }}</span>
                        <span>{{ $t('满分'+'：') + info.mark + $t('分') }}</span>
                        <el-link :underline="false" @click="showAnalysis = !showAnalysis">
                            <svg-icon class-name="view" :icon-class="showAnalysis ? 'view' : 'eye'"/>
                            {{ showAnalysis ? $t('显示答案解析') : $t('隐藏答案解析') }}
                        </el-link>
                    </div>
                </div>
                <div class="preview__type">
                    {{ info.paperTemplate.paperType === 'FIXED' ? $t('固定卷') : $t('随机卷') }}
                </div>
            </div>
        </div>
        <div class="preview__content">
            <div v-if="data">
                <paper-single
                    v-if="data['SINGLE_SELECTION']"
                    :content="data['SINGLE_SELECTION']"
                    :opt="opt"
                    :is-edit="isEdit"
                    :show-analysis="showAnalysis"
                    @move="move"
                    @del="del"
                    @edit="edit"
                    @score="score"
                />
                <paper-multiple
                    v-if="data['MULTI_SELECTION']"
                    :content="data['MULTI_SELECTION']"
                    :opt="opt"
                    :is-edit="isEdit"
                    :show-analysis="showAnalysis"
                    @move="move"
                    @del="del"
                    @edit="edit"
                    @score="score"
                />
                <paper-multiple
                    v-if="data['INDEFINITE_SELECTION']"
                    :content="data['INDEFINITE_SELECTION']"
                    title="不定项选择"
                    :opt="opt"
                    :is-edit="isEdit"
                    :show-analysis="showAnalysis"
                    @move="move"
                    @del="del"
                    @edit="edit"
                    @score="score"
                />
                <paper-judgement
                    v-if="data['JUDGMENT']"
                    :content="data['JUDGMENT']"
                    :opt="opt"
                    :is-edit="isEdit"
                    :show-analysis="showAnalysis"
                    @move="move"
                    @del="del"
                    @edit="edit"
                    @score="score"
                />
                <paper-fill
                    v-if="data['FILL']"
                    :content="data['FILL']"
                    :opt="opt"
                    :is-edit="isEdit"
                    :show-analysis="showAnalysis"
                    @move="move"
                    @del="del"
                    @edit="edit"
                    @score="score"
                />
                <paper-question
                    v-if="data['QUESTIONS']"
                    :content="data['QUESTIONS']"
                    :opt="opt"
                    :is-edit="isEdit"
                    :show-analysis="showAnalysis"
                    @move="move"
                    @del="del"
                    @edit="edit"
                    @score="score"
                />
            </div>
            <div class="paper__bottom">
                <el-button @click="close">{{ $t('关闭') }}</el-button>
            </div>
        </div>
        <!--编辑试题-->
        <el-dialog
            v-if="questionDialogVisible"
            append-to-body
            :title="$t('编辑题目')"
            :visible.sync="questionDialogVisible"
            width="1040px"
            custom-class="question__dialog"
            @close="questionDialogClose"
        >
            <div class="question__dialog__content">
                <el-form
                    ref="editQuery"
                    :model="editQuery"
                    label-width="100px"
                    :inline-message="true"
                    :rules="rules"
                >
                    <el-form-item :label="$t('试题题型') + '：'">
                        <div>
                            {{ QUESTION_TYPE_ENUM[editQuery.type] }}
                        </div>
                    </el-form-item>
                    <el-form-item :label="$t('试题分值') + '：'" prop="ic.m">
                        <el-input-number
                            v-model.number="editQuery.ic.m"
                            :controls="false"
                            controls-position="right"
                            :min="0"
                        />
                    </el-form-item>
                    <exam-single
                        v-if="editQuery.type === 'SINGLE_SELECTION'"
                        ref="question"
                        :content="editQuery.ic"
                    />
                    <exam-multiple
                        v-if="editQuery.type === 'MULTI_SELECTION'"
                        ref="question"
                        :content="editQuery.ic"
                    />
                    <exam-multiple
                        v-if="editQuery.type === 'INDEFINITE_SELECTION'"
                        ref="question"
                        :content="editQuery.ic"
                        type="indefinite"
                    />
                    <exam-judgment
                        v-if="editQuery.type === 'JUDGMENT'"
                        ref="question"
                        :content="editQuery.ic"
                    />
                    <exam-fill
                        v-if="editQuery.type === 'FILL'"
                        ref="question"
                        :content="editQuery.ic"
                    />
                    <exam-questions
                        v-if="editQuery.type === 'QUESTIONS'"
                        ref="question"
                        :content="editQuery.ic"
                    />
                </el-form>
                <div class="dialog__btn__list dialog__btn__line">
                    <el-button @click="questionDialogVisible=false">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('确认') }}</el-button>
                </div>
            </div>
        </el-dialog>
        <!--设置统一分值-->
        <el-dialog
            v-if="scoreDialogVisible"
            append-to-body
            :title="$t('设置统一分值')"
            :visible.sync="scoreDialogVisible"
            width="400px"
            custom-class="score__dialog"
            @close="scoreDialogClose"
        >
            <el-form
                ref="examPaper"
                :model="examPaper"
                label-width="100px"
                :inline-message="true"
                :rules="rules"
            >
                <el-form-item :label="$t('试题题型') + '：'">
                    <div>
                        {{ QUESTION_TYPE_ENUM[examPaper.type] }}
                    </div>
                </el-form-item>
                <el-form-item :label="$t('题数') + '：'">
                    <div>
                        {{ examPaper.currentQuestion.ic }}
                    </div>
                </el-form-item>
                <el-form-item :label="$t('总分') + '：'">
                    <div>
                        {{ scoreItemComputed }}
                    </div>
                </el-form-item>
                <el-form-item :label="$t('单题分值') + '：'">
                    <el-input-number
                        v-model.number="examPaper.mark"
                        :controls="false"
                        controls-position="right"
                        :min="0"
                    />
                </el-form-item>
            </el-form>
            <div class="dialog__btn__line">
                <el-button @click="scoreDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="scoreSave">{{ $t('确认') }}</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import PaperSingle from '@/components/VelnQuestions/Single';
    import PaperMultiple from '@/components/VelnQuestions/Multiple';
    import PaperJudgement from '@/components/VelnQuestions/Judgement';
    import PaperFill from '@/components/VelnQuestions/Fill';
    import PaperQuestion from '@/components/VelnQuestions/Questions';
    import ExamQuestions from '@/components/VelnQuestion/Questions';
    import ExamFill from '@/components/VelnQuestion/Fill';
    import ExamJudgment from '@/components/VelnQuestion/Judgment';
    import ExamSingle from '@/components/VelnQuestion/Single';
    import ExamMultiple from '@/components/VelnQuestion/Multiple';
    import {
        getPaper,
        movePaperItem,
        deletePaperItem,
        updatePaperMark,
        savePaperItem,
        getItemDetail
    } from '@/api/exam/exam/exam';
    import {
        formatQuestionDom,
        removePlaying,
        unbindEvents
    } from '@/utils/formatQuestion';
    import ct from '../../question/edit/data';
    import {deepClone} from '@/utils';

    export default {
        name: 'ExamPaperPreview',
        components: {
            PaperSingle,
            PaperMultiple,
            PaperJudgement,
            PaperFill,
            PaperQuestion,
            ExamQuestions,
            ExamFill,
            ExamJudgment,
            ExamSingle,
            ExamMultiple
        },
        data() {
            const QUESTION_TYPE_ENUM = Object.freeze({
                FILL: this.$t('填空题'),
                INDEFINITE_SELECTION: this.$t('不定项选择题'),
                JUDGMENT: this.$t('判断题'),
                MULTI_SELECTION: this.$t('多选题'),
                QUESTIONS: this.$t('问答题'),
                SINGLE_SELECTION: this.$t('单选题')
            });
            return {
                QUESTION_TYPE_ENUM,
                id: this.$route.query.id,
                opt: false,
                isEdit: false,
                info: {},
                paperTemplate: {}, // 试卷基本信息
                data: {}, // 题目信息
                showAnalysis: true,
                questionDialogVisible: false,
                editQuery: {
                    ic: {
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
                    type: 'SINGLE_SELECTION'
                },
                rules: {
                    'ic.m': [
                        {
                            required: true,
                            message: this.$t('请输入试题分值'),
                            trigger: 'blur'
                        }
                    ]
                },
                examPaper: {
                    id: this.$route.query.id,
                    mark: '',
                    itemIds: [],
                    currentQuestion: {}
                },
                scoreDialogVisible: false
            };
        },
        computed: {
            subjectComputed() {
                let total = 0;
                if (!this.data) {
                    return total;
                }
                for (const value of Object.values(this.data)) {
                    total += value.itemCount;
                }
                return total;
            },
            scoreComputed() {
                let score = 0;
                if (!this.data) {
                    return score;
                }
                for (const value of Object.values(this.data)) {
                    score += value.totalMark;
                }
                return score.toFixed(2);
            },
            scoreItemComputed() {
                if (this.examPaper.mark) {
                    return this.examPaper.mark * this.examPaper.currentQuestion.ic;
                } else {
                    return this.examPaper.currentQuestion.tm;
                }
            }
        },
        created() {
            this.init();
        },
        beforeDestroy() {
            // 清除事件绑定
            removePlaying();
            unbindEvents();
        },
        methods: {
            init() {
                // 考试-考试设置 试卷预览/编辑
                if (this.$route.query.id) {
                    this.getPaper();
                }
                if (this.$route.query.isEdit) {
                    this.opt = true;
                    this.isEdit = true;
                }
            },
            getPaper() {
                const params = {paperId: this.id};
                getPaper(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data.prc.prm || null;
                        this.paperTemplate = result.data.paperTemplate || null;
                        this.info = result.data || null;
                        this.$nextTick(() => {
                            formatQuestionDom();
                        });
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            close() {
                window.close();
            },
            // 上下移动
            move(id, flag) {
                const params = {paperId: this.id, itemId: id, up: flag};
                movePaperItem(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.getPaper();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '移动出错'));
                    }
                });
            },
            // 删除
            del(id) {
                const params = {paperId: this.id, itemId: id};
                deletePaperItem(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.getPaper();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            },
            // 编辑
            edit(id, type) {
                this.editQuery.type = type;
                this.questionDialogVisible = true;
                this.getItemDetail(id);
            },
            // 试题详情
            getItemDetail(id) {
                const params = {paperId: this.id, itemId: id};
                getItemDetail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.ic = result.data || {};
                        this.editQuery.ic.ct = JSON.parse(this.editQuery.ic.ct);
                        this.editQuery.ic.ep = JSON.parse(this.editQuery.ic.ep);
                        this.editQuery.ic.ios && this.editQuery.ic.ios.map(item => {
                            item.ct = JSON.parse(item.ct);
                        });
                        this.editQuery.ic.paperId = this.id;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '试题详情失败'));
                    }
                });
            },
            questionDialogClose() {
                this.questionDialogVisible = false;
            },
            // 试题编辑保存
            sure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        this.editQuery.ic.ct = JSON.stringify(this.editQuery.ic.ct);
                        this.editQuery.ic.ep = JSON.stringify(this.editQuery.ic.ep);
                        this.editQuery.ic.ios && this.editQuery.ic.ios.map(item => {
                            item.ct = JSON.stringify(item.ct);
                        });
                        savePaperItem(this.editQuery.ic).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.questionDialogVisible = false;
                                this.getPaper();
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            // 设置统一分值
            score(type) {
                this.examPaper.itemIds = [];
                this.examPaper.currentQuestion = this.data[type];
                this.examPaper.type = type;
                this.examPaper.mark = '';
                this.data[type].ics.map(item => {
                    this.examPaper.itemIds.push(item.id);
                });
                this.scoreDialogVisible = true;
            },
            scoreDialogClose() {
                this.scoreDialogVisible = false;
            },
            scoreSave() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                updatePaperMark(this.examPaper).then(res => {
                    this.$store.dispatch('setAjaxIng', false);
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.scoreDialogVisible = false;
                        this.getPaper();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '保存失败'));
                    }
                });
            }
        }
    };
</script>
