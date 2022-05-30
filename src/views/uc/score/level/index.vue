<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="score__rule container__padding">
        <el-form ref="editQuery" :model="editQuery" :inline="true">
            <div class="score__rule__header">
                <div class="score__table__th level">{{ $t('积分等级') }}</div>
                <div class="score__table__th name">{{ $t('等级名称') }}</div>
                <div class="score__table__th min">{{ $t('等级最小积分') }}</div>
                <div class="score__table__th max">{{ $t('等级最大积分') }}</div>
                <div class="score__table__th opt">{{ $t('操作') }}</div>
            </div>
            <div v-for="(item, index) in editQuery.list" :key="index" class="score__rule__line">
                <div class="score__table__td level">
                    <span class="level--icon">Lv.{{ index + 1 }}</span>
                </div>
                <el-form-item
                    class="score__table__td name"
                    :prop="'list.' + index + '.name'"
                    :rules="[rules.required]"
                >
                    <el-input
                        v-model="item.name"
                        class="score__name__npt input__limit"
                        maxlength="20"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item
                    class="score__table__td min"
                    :prop="'list.' + index + '.minScore'"
                    :rules="[rules.required]"
                >
                    <el-input-number v-model="item.minScore" :min="0" :max="maxScore"/>
                </el-form-item>
                <el-form-item
                    class="score__table__td max"
                    :prop="'list.' + index + '.maxScore'"
                    :rules="index===(editQuery.list.length - 1) ? null : [rules.required]"
                >
                    <el-input-number v-if="index===(editQuery.list.length - 1)" disabled/>
                    <el-input-number
                        v-if="index!==(editQuery.list.length - 1)"
                        v-model="item.maxScore"
                        :min="1"
                        :max="maxScore"
                    />
                </el-form-item>
                <div class="score__table__td opt">
                    <el-tooltip class="item" effect="dark" :content="$t('新增')" placement="top">
                        <i class="rule__opt__icon el-icon-circle-plus-outline" @click="add(index)"/>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('删除')" placement="top">
                        <i class="rule__opt__icon el-icon-remove-outline" @click="del(index)"/>
                    </el-tooltip>
                </div>
            </div>
            <div class="text--center score__rule__btns">
                <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
            </div>
        </el-form>
    </article>
</template>

<script>
    import {getAllLevel, batchAdd} from '@/api/score/level';
    import {deepClone} from '@/utils';
    export default {
        name: 'ScoreLevel',
        data() {
            const scoreTemp = {
                name: '',
                minScore: null,
                maxScore: null
            };
            return {
                scoreTemp,
                list: [],
                editQuery: {
                    list: []
                },
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
                        trigger: 'blur'
                    }
                },
                maxScore: 99999, // 最大积分
                step: 99 // 初始化积分间隔
            };
        },
        mounted() {
            this.getAllLevel();
        },
        methods: {
            // 获取全部等级
            getAllLevel() {
                getAllLevel().then(re => {
                    const result = re.data;
                    if (result.success) {
                        const list = result.data || [];
                        list.map(item => {
                            item.id = '';
                        });
                        if (!list.length) {
                            list.push(deepClone(this.scoreTemp));
                        }
                        this.editQuery.list = list;
                        this.emptyLastMax();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取积分等级失败'));
                    }
                });
            },
            // 校验积分连续 & 某一等级大小积分对比
            checkScore() {
                let result = true;
                let msg = '';
                this.editQuery.list.map((item, index) => {
                    if (!result) {
                        return;
                    }
                    if (item.maxScore < item.minScore) {
                        result = false;
                        msg = `第${index + 1}等级初始积分不能大于结束积分`;
                        return;
                    }
                    if (!index) {
                        return;
                    }
                    if (
                        item.minScore - 1 !==
                        this.editQuery.list[index - 1].maxScore
                    ) {
                        result = false;
                        msg = `第${index}等级和第${index + 1}累计积分区间要连续`;
                    }
                });
                if (msg) {
                    this.$errorMsg(msg);
                }
                return result;
            },
            // 保存
            save() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid || !this.checkScore()) {
                        return;
                    }
                    batchAdd(this.editQuery.list).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            },
            // 最后一级maxScore改为99999
            emptyLastMax() {
                const len = this.editQuery.list.length;
                this.$set(this.editQuery.list[len - 1], 'maxScore', this.maxScore);
            },
            // 新增等级
            add(index) {
                const temp = deepClone(this.scoreTemp);
                let max = 0;
                if (this.editQuery.list[index].maxScore === this.maxScore) {
                    max = this.editQuery.list[index].minScore + this.step;
                    this.$set(this.editQuery.list[index], 'maxScore', max);
                } else {
                    max = this.editQuery.list[index].maxScore;
                }
                temp.minScore = max + 1;
                temp.maxScore = max + this.step;
                this.editQuery.list.splice(index + 1, 0, temp);
                this.emptyLastMax();
            },
            // 删除某等级
            del(index) {
                this.editQuery.list.splice(index, 1);
                this.emptyLastMax();
            }
        }
    };
</script>
