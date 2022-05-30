<style lang="scss">
@import '../style';
@import './style';
</style>
<template>
    <article class="app-container paper__question__container paper__fixed__block">
        <veln-steps :data="steps" :active="active" @change="stepChange"/>
        <section class="paper__question__content">
            <div class="paper__left">
                <default-page v-if="!info"/>
                <div v-else>
                    <span class="paper__tip">{{ $t('*必考题的添加、删除为实时保存') }}</span>
                    <paper-single
                        v-if="info['SINGLE_SELECTION'] &&
                            info['SINGLE_SELECTION'].length"
                        :list="info['SINGLE_SELECTION']"
                        @move="move"
                        @del="del"
                    />
                    <paper-multiple
                        v-if="info['MULTI_SELECTION'] && info['MULTI_SELECTION'].length"
                        :list="info['MULTI_SELECTION']"
                        @move="move"
                        @del="del"
                    />
                    <paper-multiple
                        v-if="info['INDEFINITE_SELECTION'] && info['INDEFINITE_SELECTION'].length"
                        :list="info['INDEFINITE_SELECTION']"
                        title="不定项选择"
                        @move="move"
                        @del="del"
                    />
                    <paper-judgement
                        v-if="info['JUDGMENT'] && info['JUDGMENT'].length"
                        :list="info['JUDGMENT']"
                        @move="move"
                        @del="del"
                    />
                    <paper-fill
                        v-if="info['FILL'] && info['FILL'].length"
                        :list="info['FILL']"
                        @move="move"
                        @del="del"
                    />
                    <paper-question
                        v-if="info['QUESTIONS'] && info['QUESTIONS'].length"
                        :list="info['QUESTIONS']"
                        @move="move"
                        @del="del"
                    />
                </div>
                <div class="page__btn__item">
                    <el-button class="paper__btn" @click="addFixedQuestion">{{ $t('添加必考题') }}</el-button>
                </div>
            </div>
            <div class="paper__right">
                <page-info :info="info" :edit-query="editQuery" :step="1" @preview="preview"/>
            </div>
        </section>
        <div class="fixed__btn__list">
            <el-button @click="back">{{ $t('取消') }}</el-button>
            <el-button @click="last">{{ $t('上一步') }}</el-button>
            <el-button @click="save">{{ $t('保存为草稿') }}</el-button>
            <el-button
                v-if="editQuery.paperType === 'FIXED'"
                type="primary"
                @click="enable"
            >{{ $t('保存并启用') }}</el-button>
            <el-button
                v-if="editQuery.paperType !== 'FIXED'"
                type="primary"
                @click="next"
            >{{ $t('下一步') }}</el-button>
        </div>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t('选择必考题')"
            :visible.sync="dialogVisible"
            width="939px"
            @close="handleClose"
        >
            <veln-fixed-question
                fun-code="ITEM_BANK"
                :app-code="$appCodes.pe + '/pe'"
                route="paperTemplate"
                :fun-id="id"
                @onClose="questionClose"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import DefaultPage from './components/defaultPage';
    import VelnFixedQuestion from '@/components/VelnFixedQuestion';
    import PageInfo from '../components/paperInfo';
    import PaperSingle from '@/components/VelnQuestionsTemplate/Single';
    import PaperMultiple from '@/components/VelnQuestionsTemplate/Multiple';
    import PaperJudgement from '@/components/VelnQuestionsTemplate/Judgement';
    import PaperFill from '@/components/VelnQuestionsTemplate/Fill';
    import PaperQuestion from '@/components/VelnQuestionsTemplate/Questions';
    import {
        findFixedItem,
        moveMustItem,
        deleteFixed,
        getBasic,
        updateStatus,
        enable
    } from '@/api/paper/paperTemplate';

    export default {
        name: 'FixedQuestion',
        components: {
            VelnSteps,
            DefaultPage,
            VelnFixedQuestion,
            PageInfo,
            PaperSingle,
            PaperMultiple,
            PaperJudgement,
            PaperFill,
            PaperQuestion
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
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
                active: 1,
                steps,
                msg: '',
                fixedQuestionList: [],
                dialogVisible: false,
                id: this.$route.query.id,
                info: null,
                editQuery: {}
            };
        },
        created() {
            this.findFixedItem();
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.getBasic();
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                }
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.$router.push({
                            name: 'paperBasic',
                            query: {id: this.id}
                        });
                        break;
                    case 2:
                        this.next();
                        break;
                }
            },
            addFixedQuestion() {
                this.dialogVisible = true;
            },
            handleClose() {
                this.dialogVisible = false;
                this.findFixedItem();
            },
            questionClose() {
                this.dialogVisible = false;
                this.findFixedItem();
            },
            // 必考题试题
            findFixedItem() {
                this.info = null;
                const params = {paperTemplateId: this.id};
                findFixedItem(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.info = result.data || null;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取部门数据出错'));
                    }
                });
            },
            // 上下移动
            move(id, flag) {
                const params = {templateId: this.id, itemId: id, up: flag};
                moveMustItem(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.findFixedItem();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '移动出错'));
                    }
                });
            },
            // 删除
            del(id) {
                const items = [id];
                const params = {id: this.id, referIds: items};
                deleteFixed(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.findFixedItem();
                        this.getBasic();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            },
            // 编辑回显
            getBasic() {
                const params = {paperTemplateId: this.$route.query.id};
                getBasic(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        if (this.editQuery.paperType === 'FIXED') {
                            this.steps.pop();
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            back() {
                this.$router.push({
                    name: 'paperList'
                });
            },
            next() {
                this.$router.push({
                    name: 'randomQuestion',
                    query: {id: this.id}
                });
            },
            last() {
                this.$router.push({
                    name: 'paperBasic',
                    query: {id: this.id}
                });
            },
            // 试卷预览
            preview() {
                const routeData = this.$router.resolve({
                    name: 'paperPreview',
                    query: {id: this.id}
                });
                window.open(routeData.href, '_blank');
            },
            // 保存并启用
            enable() {
                const params = {templateId: this.id};
                enable(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.cancel();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            save() {
                const params = {templateId: this.id, status: 'DRAFT'};
                updateStatus(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.cancel();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '保存失败'));
                    }
                });
            },
            cancel() {
                if (this.editQuery.paperType === 'FIXED') {
                    this.back();
                } else {
                    this.next();
                }
            }
        }
    };
</script>
