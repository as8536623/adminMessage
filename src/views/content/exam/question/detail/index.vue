<style lang="scss" scoped>
@import './style';
</style>
<template>
    <article class="app-container question-detail-container">
        <el-form label-width="140px" :inline-message="true">
            <veln-form-section :title="$t('试题内容')" :can-expand="false">
                <single-detail v-if="editQuery.type === 'SINGLE_SELECTION'" :content="editQuery"/>
                <multiple-detail v-if="editQuery.type === 'MULTI_SELECTION'" :content="editQuery"/>
                <multiple-detail
                    v-if="editQuery.type === 'INDEFINITE_SELECTION'"
                    :content="editQuery"
                    title="不定项"
                />
                <fill-detail v-if="editQuery.type === 'FILL'" :content="editQuery"/>
                <questions-detail v-if="editQuery.type === 'QUESTIONS'" :content="editQuery"/>
                <judgement-detail v-if="editQuery.type === 'JUDGMENT'" :content="editQuery"/>
            </veln-form-section>
            <veln-form-section :title="$t('试题解析')" :can-expand="false">
                <exam-ct class="question__ep" :ct="editQuery.content.ep"/>
            </veln-form-section>
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <el-form-item
                    :label="$t('编号') + '：'"
                    class="required"
                >{{ editQuery.itemCode }}</el-form-item>
                <el-form-item
                    :label="$t('所属题库') + '：'"
                    class="required"
                >{{ editQuery.itemBank.bankName }}</el-form-item>
                <el-form-item
                    :label="$t('试题难度') + '：'"
                    class="required"
                >{{ TEST_QUESTION_LEVEL_ENUM.getName(editQuery.level) }}</el-form-item>
                <el-form-item
                    :label="$t('试题属性') + '：'"
                    class="required"
                >{{ TEST_ATTRIBUTE_ENUM.getName(editQuery.attribute) }}</el-form-item>
                <el-form-item
                    :label="$t('语言属性') + '：'"
                    class="required"
                >{{ LANGUAGE_TYPE_ENUM.getName(editQuery.languageType) }}</el-form-item>
                <el-form-item
                    :label="$t('所属知识点') + '：'"
                >
                    <div v-if="editQuery.knowledgeList && editQuery.knowledgeList.length">
                        <el-tag
                            v-for="item in editQuery.knowledgeList"
                            :key="item.id"
                            class="itembank__tag"
                            :disable-transitions="false"
                        >{{ item.knowledgeName }}
                        </el-tag>
                    </div>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item :label="$t('创建日期') + '：'">{{ editQuery.createdAt }}</el-form-item>
                <el-form-item :label="$t('过期日期') + '：'">{{ editQuery.expireDate }}</el-form-item>
                <el-form-item :label="$t('是否绝密') + '：'">{{ editQuery.security ? $t('是') : $t('否') }}</el-form-item>
                <el-form-item :label="$t('出题人') + '：'">{{ editQuery.user && editQuery.user.name }}</el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import SingleDetail from './components/Single';
    import MultipleDetail from './components/Multiple';
    import FillDetail from './components/Fill';
    import QuestionsDetail from './components/Questions';
    import JudgementDetail from './components/Judgement';
    import ExamCt from '@/components/VelnFileForExam/ExamCt';
    import {
        LANGUAGE_TYPE_ENUM,
        TEST_ATTRIBUTE_ENUM,
        TEST_QUESTION_LEVEL_ENUM,
        TEST_QUESTION_TYPE_ENUM
    } from '@/enum';
    import {getItem} from '@/api/exam/item/item';
    import ct from '../edit/data';
    import {deepClone} from '@/utils';
    export default {
        name: 'QuestionDetail',
        components: {
            VelnFormSection,
            SingleDetail,
            MultipleDetail,
            FillDetail,
            QuestionsDetail,
            JudgementDetail,
            ExamCt
        },
        data() {
            return {
                id: this.$route.query.id,
                LANGUAGE_TYPE_ENUM,
                TEST_ATTRIBUTE_ENUM,
                TEST_QUESTION_LEVEL_ENUM,
                TEST_QUESTION_TYPE_ENUM,
                editQuery: {
                    knowledgeList: [],
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
                    itemBank: {}
                }
            };
        },
        created() {
            this.getItem();
        },
        methods: {
            getItem() {
                getItem(this.$route.query.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = result.data;
                        this.editQuery.content = JSON.parse(result.data.content);
                        this.editQuery.content.ct = JSON.parse(
                            this.editQuery.content.ct
                        );
                        this.editQuery.content.ep = this.editQuery.content.ep
                            ? JSON.parse(this.editQuery.content.ep)
                            : '';
                        this.editQuery.content.ios &&
                            this.editQuery.content.ios.map(item => {
                                item.ct = JSON.parse(item.ct);
                            });
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
