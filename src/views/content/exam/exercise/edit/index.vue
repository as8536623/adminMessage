<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding exercise__edit">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
            :disabled="readonly"
        >
            <veln-steps :data="steps" :active="active" @change="stepChange"/>
            <!--<veln-form-section :title="$t('基本信息')" :canExpand="false">-->
            <section class="tool-form-item">
                <el-form-item :label="$t('练习编号') + '：'" prop="exerciseCode">
                    <el-input
                        v-model.trim="editQuery.exerciseCode"
                        :placeholder="$t('练习编号')"
                        maxlength="50"
                        :disabled="!!editQuery.id"
                    />
                </el-form-item>
                <el-form-item :label="$t('练习名称') + '：'" prop="exerciseName">
                    <el-input
                        v-model.trim="editQuery.exerciseName"
                        :placeholder="$t('练习名称')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item :label="$t('练习类型') + '：'" prop="type">
                    <el-radio-group v-model="editQuery.type">
                        <el-radio label="COMMON">普通练习</el-radio>
                        <el-radio label="DAILY">每日一练</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('选择题库') + '：'" prop="itemBankIds">
                    <el-tag
                        v-for="(tag, index) in editQuery.itemBanks"
                        :key="tag.bankName"
                        class="itembank__tag"
                        :closable="!editQuery.id"
                        @close="handleCloseTag(tag, index)"
                    >{{ tag.bankName }}</el-tag>
                    <el-button
                        v-if="editQuery.status!=='ENABLED'"
                        type="text"
                        @click="showItemBank"
                    >
                        {{ $t('选择题库')
                        }}
                    </el-button>
                    <div class="exercise__tip">{{ $t('练习仅针对所选题库中的客观题，包括单选、多选、不定项和判断题。') }}</div>
                </el-form-item>
                <!--<el-form-item :label="$t('去主观题')">-->
                <!--<el-radio-group v-model="editQuery.itemType">-->
                <!--<el-radio label="subject">{{$t('是')}}</el-radio>-->
                <!--<el-radio label="all">{{$t('否')}}</el-radio>-->
                <!--</el-radio-group>-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('知识点') + '：'">
                    <el-tag
                        v-for="item in editQuery.knowledgeList"
                        :key="item.id"
                        class="itembank__tag"
                        :disable-transitions="false"
                        :closable="true"
                        @close="knowledgeDel(index)"
                    >{{ item.knowledgeName }}</el-tag>
                    <el-button type="text" @click="showKnowledgeSelect">{{ $t('请选择知识点') }}</el-button>
                </el-form-item>
                <el-form-item :label="$t('截止时间') + '：'" prop="endAt">
                    <veln-datetime v-model="editQuery.endAt"/>
                    <span class="veln__tips">{{ $t('不填则一直生效') }}</span>
                </el-form-item>
                <el-form-item v-if="!readonly">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
                </el-form-item>
            </section>
            <!--</veln-form-section>-->
        </el-form>
        <el-dialog
            v-if="itemBankVisible"
            append-to-body
            :title="$t('选择题库')"
            :visible.sync="itemBankVisible"
            width="939px"
            @close="itemBankClose"
        >
            <veln-item-banks
                :active="JSON.parse(JSON.stringify(editQuery.itemBanks))"
                @select="handleSelect"
                @close="itemBankClose"
            />
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
    import VelnSteps from '@/components/VelnSteps';
    import VelnItemBanks from '@/components/VelnItemBanks';
    import VelnKnowledgePointsSelect from '@/components/VelnKnowledgePointsSelect';
    import {
        exedciseSave,
        getExercise,
        getExerciseCode
    } from '@/api/exam/exam/exercise';

    export default {
        name: 'ExerciseBasic',
        components: {
            VelnItemBanks,
            VelnKnowledgePointsSelect,
            VelnSteps
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('范围设置'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                steps,
                active: 0,
                editQuery: {
                    id: '',
                    exerciseCode: '',
                    exerciseName: '',
                    itemBankIds: [],
                    itemBanks: [],
                    useScope: 'ALL',
                    type: 'COMMON',
                    endAt: '',
                    knowledgeList: [],
                    knowledgeIds: [],
                    itemType: 'subject'
                },
                rules: {
                    exerciseCode: [
                        {
                            required: true,
                            message: '请输入练习编号',
                            trigger: 'blur'
                        }
                    ],
                    exerciseName: [
                        {
                            required: true,
                            message: '请输入练习名称',
                            trigger: 'blur'
                        }
                    ],
                    itemBankIds: [
                        {
                            required: true,
                            message: '请选择题库',
                            trigger: 'blur'
                        }
                    ]
                },
                itemBankVisible: false,
                dgpDialogVisible: false,
                readonly: false,
                pointsVisible: false
            };
        },
        mounted() {
            const id = this.$route.query.id;
            const readonly = this.$route.query.readonly;
            if (id) {
                this.editQuery.id = id;
                this.steps.map(step => {
                    step.status = 'done';
                    step.disabled = false;
                });
                this.getExercise();
            } else {
                this.getExerciseCode();
            }

            if (readonly) {
                this.readonly = readonly;
            }
        },
        methods: {
            // 题库 弹框 关闭
            itemBankClose() {
                this.itemBankVisible = false;
                this.formatItemBank();
            },
            // 格式化题库信息
            formatItemBank() {
                const list = [];
                this.editQuery.itemBanks.map(item => {
                    list.push(item.id);
                });
                this.editQuery.itemBankIds = list;

                this.$refs.editQuery.validateField('itemBankIds');
            },
            // 选择题库确定
            handleSelect(active) {
                this.editQuery.itemBanks = active;
                this.itemBankClose();
            },
            // 显示 选择题库 弹框
            showItemBank() {
                this.itemBankVisible = true;
            },
            handleCloseTag(tag, index) {
                this.editQuery.itemBankIds.splice(index, 1);
                this.editQuery.itemBanks.splice(index, 1);
            },
            // 获取code
            getExerciseCode() {
                getExerciseCode().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery.exerciseCode = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取练习编号失败'));
                    }
                });
            },
            getExercise() {
                const params = {
                    exerciseId: this.editQuery.id
                };
                getExercise(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const itemBankIds = [];
                        const {itemBanks} = result.data;
                        itemBanks.map(item => {
                            itemBankIds.push(item.id);
                        });
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data,
                            {itemBankIds}
                        );
                        this.editQuery.knowledgeIds = [];
                        this.editQuery.knowledgeList && this.editQuery.knowledgeList.map(item => {
                            this.editQuery.knowledgeIds.push(item.id);
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            handleUserClose() {
                this.dgpDialogVisible = false;
            },
            onClose() {
                this.dgpDialogVisible = false;
            },
            selectUser() {
                this.dgpDialogVisible = true;
            },
            cancel() {
                history.go(-1);
            },
            next(id) {
                this.$router.push({
                    name: 'exerciseSetting',
                    query: {id: id, readonly: this.$route.query.readonly}
                });
            },
            stepChange(index) {
                switch (index) {
                    case 1:
                        this.next(this.editQuery.id);
                        break;
                }
            },
            sure() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    exedciseSave(this.editQuery).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t(result.msg || '保存成功'));
                            // this.cancel();
                            this.next(result.data);
                        } else {
                            this.$errorMsg(this.$t(result.msg || '保存失败'));
                        }
                    });
                });
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
                results &&
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
