<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="random__wrapper">
        <div class="random__item__bank">
            <div>
                <label>{{ $t('题库'+'：') }}</label>
                <div v-if="active.length" class="tag__list">
                    <el-tag
                        v-for="(tag, index) in active"
                        :key="index"
                        closable
                        type="success"
                        @close="del(index)"
                    >{{ tag.bankName }}
                    </el-tag>
                </div>
                <el-button type="text" @click="selectItemBank">{{ $t('选择题库') }}</el-button>
            </div>
            <div class="random__select__item">
                <label>{{ $t('知识点'+'：') }}</label>
                <div v-if="listQuery.knowledgeList.length" class="tag__list">
                    <el-tag
                        v-for="(item,index) in listQuery.knowledgeList"
                        :key="item.id"
                        type="success"
                        closable
                        @close="knowledgeDel(index)"
                    >{{ item.knowledgeName }}
                    </el-tag>
                </div>
                <el-button type="text" @click="showKnowledgeSelect">{{ $t('请选择知识点') }}</el-button>
            </div>
            <div>
                <label>{{ $t('试题属性'+'：') }}</label>
                <el-radio-group v-model="listQuery.sr.t" @change="itemBankDetail">
                    <el-radio label="">{{ $t('全部') }}</el-radio>
                    <el-radio :label="true">{{ $t('绝密试题') }}</el-radio>
                    <el-radio :label="false">{{ $t('非绝密试题') }}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="random__content">
            <el-form ref="listQuery" :model="listQuery" :rules="rules">
                <el-form-item>
                    <el-checkbox v-model="listQuery.sr.d" @change="itemBankDetail">{{ $t('题库') }}</el-checkbox>
                    <el-checkbox v-model="listQuery.sr.s" @change="difficultySet">{{ $t('难度') }}</el-checkbox>
                </el-form-item>
                <!--不按题库分类展示-->
                <div v-if="!listQuery.sr.d">
                    <template
                        v-for="(item, idx) in data"
                    >
                        <el-form-item
                            v-if="idx<7 && item.c > 0"
                            :key="idx"
                            :label="QUESTION_TYPE_ENUM[idx]+'：'"
                            label-width="120px"
                            class="question__type__item"
                            :prop="'sr.sm[' + idx + '].c'"
                            :rules="[{
                                required: true,
                                message: $t('请完善必填项'),
                                trigger: 'blur'
                            }]"
                        >
                            <!--简单设置-->
                            <div v-if="listQuery.sr.p">
                                <el-input-number
                                    v-model.number="listQuery.sr.sm[idx].c"
                                    :controls="false"
                                    controls-position="right"
                                    :min="0"
                                    :max="item.c"
                                />
                                / {{ item.c }}
                            </div>
                            <!--精确设置-->
                            <div v-else class="sr__detail">
                                <el-form-item
                                    v-for="(i,k) in item.m"
                                    :key="k"
                                    label-width="80px"
                                    :label="QUESTION_DIFFICULTY_ENUM[k]"
                                    :prop="'sr.sm[' + idx + '].m['+k+']'"
                                    :rules="[{
                                        required: true,
                                        message: $t('请完善必填项'),
                                        trigger: 'blur'
                                    }]"
                                >
                                    <el-input-number
                                        v-model.number="listQuery.sr.sm[idx].m[k]"
                                        :controls="false"
                                        controls-position="right"
                                        :disabled="i === 0"
                                        :min="0"
                                        :max="i"
                                    />
                                    / {{ i }}
                                </el-form-item>
                            </div>
                        </el-form-item>
                    </template>
                </div>
                <!--按照题库分类展示-->
                <template v-else>
                    <template v-for="(node, index) in list">
                        <div :key="index">
                            <div class="item__bank__name">
                                <label>{{ $t('题库'+'：') }}</label>
                                <el-tag type="success">{{ active[index].bankName }}</el-tag>
                            </div>
                            <template v-for="(item, idx) in node">
                                <el-form-item
                                    v-if="idx<7 && item.c > 0"
                                    :key="idx"
                                    :label="QUESTION_TYPE_ENUM[idx]+'：'"
                                    label-width="120px"
                                    class="question__type__item"
                                    :prop="'sr.smList['+index+'][sm][' + idx + '].c'"
                                    :rules="[{
                                        required: true,
                                        message: $t('请完善必填项'),
                                        trigger: 'blur'
                                    }]"
                                >
                                    <!--简单设置-->
                                    <div v-if="listQuery.sr.p">
                                        <el-input-number
                                            v-model.number="listQuery.sr.smList[index]['sm'][idx].c"
                                            :controls="false"
                                            controls-position="right"
                                            :min="0"
                                            :max="item.c"
                                        />
                                        / {{ item.c }}
                                    </div>
                                    <!--精确设置-->
                                    <div v-else class="sr__detail">
                                        <el-form-item
                                            v-for="(i,k) in item.m"
                                            :key="k"
                                            label-width="80px"
                                            :label="QUESTION_DIFFICULTY_ENUM[k]"
                                            :prop="'sr.smList[' + index + '][sm]['+idx+'].m['+k+']'"
                                            :rules="[{
                                                required: true,
                                                message:$t('请完善必填项'),
                                                trigger: 'blur'
                                            }]"
                                        >
                                            <el-input-number
                                                v-model.number="listQuery.sr.smList[index]['sm'][idx].m[k]"
                                                :controls="false"
                                                controls-position="right"
                                                :disabled="i === 0"
                                                :min="0"
                                                :max="i"
                                                @blur="inputBlur"
                                            />
                                            / {{ i }}
                                        </el-form-item>
                                    </div>
                                </el-form-item>
                            </template>
                        </div>
                    </template>
                </template>
            </el-form>
        </div>
        <el-dialog
            v-if="itemBankVisible"
            :key="key"
            append-to-body
            :title="$t('选择题库')"
            :visible.sync="itemBankVisible"
            width="939px"
            @close="itemBankClose"
        >
            <veln-item-banks :active="active" @select="handleSelect" @close="itemBankClose"/>
        </el-dialog>
        <el-dialog
            v-if="pointsVisible"
            append-to-body
            :title="$t('选择知识点')"
            :visible.sync="pointsVisible"
            width="339px"
            :points-key="pointsKey"
        >
            <veln-knowledge-points-select
                ref="points"
                :category="true"
                :show-checkbox="true"
                :check-strictly="true"
                :expand-on-click-node="true"
                :default-checked-keys="listQuery.knowledgeIds"
            />
            <div class="dialog__btn__line">
                <el-button @click="pointsVisible=false">取消</el-button>
                <el-button type="primary" @click="pointsSelect">保存</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnItemBanks from '@/components/VelnItemBanks';
    import VelnKnowledgePointsSelect from '@/components/VelnKnowledgePointsSelect';
    import {findCountItem, getRandomInfo} from '@/api/paper/paperTemplate';
    import {validateInteger} from '@/utils/validate';
    import {deepClone} from '@/utils';
    import sm from './data';

    export default {
        name: 'RandomSelect',
        components: {
            VelnItemBanks,
            VelnKnowledgePointsSelect
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            const QUESTION_TYPE_ENUM = Object.freeze({
                1: this.$t('单选题'),
                2: this.$t('多选题'),
                3: this.$t('不定项选择题'),
                4: this.$t('判断题'),
                5: this.$t('填空题'),
                6: this.$t('问答题')
            });
            const QUESTION_DIFFICULTY_ENUM = Object.freeze({
                1: this.$t('容易'),
                2: this.$t('较容易'),
                3: this.$t('中等'),
                4: this.$t('较难'),
                5: this.$t('困难')
            });
            return {
                validateInteger,
                QUESTION_TYPE_ENUM,
                QUESTION_DIFFICULTY_ENUM,
                itemBankVisible: false,
                key: null,
                active: [], // 选中题库
                listQuery: {
                    sr: {
                        p: true,
                        s: false,
                        t: '',
                        d: false,
                        sm: deepClone(sm),
                        smList: []
                    },
                    id: this.id,
                    itemBankIds: [],
                    knowledgeIds: [],
                    knowledgeList: []
                },
                itemBankIds: [], // 题库ids
                list: [],
                data: null,
                randomSummary: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                },
                rules: {},
                pointsVisible: false,
                pointsKey: null
            };
        },
        watch: {
            listQuery: {
                handler(val) {
                    this.dataHandle();
                },
                immediate: true,
                deep: true
            }
        },
        created() {
            if (this.id) {
                this.getRandomInfo();
            }
        },
        methods: {
            // 编辑回显
            getRandomInfo() {
                const params = {id: this.id};
                getRandomInfo(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.active = result.data.itemBanks || [];
                        if (
                            result.data.template.sr &&
                            result.data.template.sr.smList &&
                            result.data.template.sr.smList.length
                        ) {
                            this.listQuery.sr.d = true;
                        }
                        this.listQuery.sr = Object.assign(
                            this.listQuery.sr,
                            result.data.template.sr
                        );
                        this.listQuery.sr.s = !this.listQuery.sr.p;
                        this.listQuery.knowledgeList = result.data.knowledgeList || [];
                        this.listQuery.knowledgeIds = [];
                        this.listQuery.knowledgeList.map(item => {
                            this.listQuery.knowledgeIds.push(item.id);
                        });
                        this.activeHandle();
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            selectItemBank() {
                this.itemBankVisible = true;
            },
            itemBankClose() {
                this.itemBankVisible = false;
                this.key = +new Date();
            },
            // 选择题库回调
            handleSelect(active) {
                this.active = active;
                this.itemBankVisible = false;
                this.key = +new Date();
                this.activeHandle();
            },
            // 选择题库信息处理
            activeHandle() {
                const items = [];
                this.active.map(item => {
                    items.push(item.id);
                });
                this.listQuery.itemBankIds = items;
                this.itemBankIds = items;
                this.listQuery.sr.d
                    ? this.findCountItemByItemBank()
                    : this.findCountItem();
            },
            // 返回所有的题型
            findCountItem() {
                findCountItem(this.listQuery).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data.sm || null;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            // 按照题库分类获取题型
            async findCountItemByItemBank() {
                this.list = [];
                if (this.listQuery.sr.d) {
                    for (const item of this.listQuery.itemBankIds) {
                        const data = {
                            1: {c: 0, m: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}},
                            2: {c: 0, m: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}},
                            3: {c: 0, m: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}},
                            4: {c: 0, m: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}},
                            5: {c: 0, m: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}},
                            6: {c: 0, m: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}}
                        };
                        // 新增题库时，加入对应的smList
                        if (this.listQuery.itemBankIds.length > this.listQuery.sr.smList.length) {
                            this.listQuery.sr.smList[this.listQuery.sr.smList.length] = {sm: data, bankId: item};
                        }
                        const params = deepClone(this.listQuery);
                        params.itemBankIds = [item];
                        console.log('smList', this.listQuery.sr.smList);
                        const res = await findCountItem(params);
                        const result = res.data;
                        if (result.success) {
                            this.list.push(result.data.sm);
                            console.log('this.list', this.list);
                        } else {
                            this.$errorMsg(result.msg || this.$t('数据查询失败'));
                        }
                    }
                } else {
                    this.findCountItem();
                }
            },
            // 切换题型/知识点/简单/精确设置后/按题库详细设置需要清空之前输入的数据
            cleanData() {
                this.listQuery.sr.sm = deepClone(sm);
                const list = [];
                console.log('be', this.listQuery.sr.smList);
                Array.isArray(this.listQuery.sr.smList) && this.listQuery.sr.smList.map((item) => {
                    list.push({sm: deepClone(sm), bankId: item.bankId});
                });
                this.listQuery.sr.smList = list;
                console.log('af', this.listQuery.sr.smList);
            },
            // 按题库详细设置
            itemBankDetail() {
                if (!this.active.length) {
                    this.listQuery.sr.d = false;
                    this.$warnMsg(this.$t('请先选择题库'));
                    return;
                }
                this.cleanData();
                this.findCountItemByItemBank();
            },
            // 简单/精确设置
            difficultySet() {
                if (!this.active.length) {
                    this.$warnMsg(this.$t('请先选择题库'));
                    return;
                }
                this.listQuery.sr.p = !this.listQuery.sr.s;
                this.cleanData();
                this.findCountItemByItemBank();
            },
            // 题库删除
            del(index) {
                this.active.splice(index, 1);
                this.itemBankIds.splice(index, 1);
                this.listQuery.sr.smList.splice(index, 1);
                if (!this.active.length) {
                    this.list = [];
                    this.data = null;
                    this.randomSummary = {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0
                    };
                    this.$emit('summary', this.randomSummary);
                    return;
                }
                this.listQuery.itemBankIds = this.itemBankIds;
                this.listQuery.sr.d
                    ? this.findCountItemByItemBank()
                    : this.findCountItem();
            },
            // 设置题库数量，右侧题型总数展示
            dataHandle() {
                this.randomSummary = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                };
                // 按题库分类设置
                if (this.listQuery.sr.d) {
                    // 简单设置
                    if (this.listQuery.sr.p) {
                        this.listQuery.sr.smList.map(item => {
                            for (const [key, value] of Object.entries(item.sm)) {
                                value.c
                                    ? (this.randomSummary[key] = Number(this.randomSummary[key]) + Number(value.c))
                                    : null;
                            }
                        });
                        // 精确设置
                    } else {
                        this.listQuery.sr.smList.map(item => {
                            for (const [key, value] of Object.entries(item.sm)) {
                                let total = 0;
                                for (const v of Object.values(value.m)) {
                                    v ? (total += v) : null;
                                }
                                this.randomSummary[key] =
                                    Number(this.randomSummary[key]) + total;
                            }
                        });
                    }
                } else {
                    // 简单设置
                    if (this.listQuery.sr.p) {
                        for (const [key, value] of Object.entries(
                            this.listQuery.sr.sm
                        )) {
                            this.randomSummary[key] = value.c ? value.c : 0;
                        }
                        // 精确设置
                    } else {
                        for (const [key, value] of Object.entries(
                            this.listQuery.sr.sm
                        )) {
                            let total = 0;
                            for (const v of Object.values(value.m)) {
                                v ? (total += v) : null;
                            }
                            this.randomSummary[key] = total;
                        }
                    }
                }
                this.$emit('summary', this.randomSummary);
                console.log('this.randomSummary', this.randomSummary);
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
                results && results.map(item => {
                    if (item.parentName && !item.category) {
                        ids.push(item.id);
                        const data = {
                            id: item.id,
                            knowledgeName: item.name
                        };
                        knowledgeList.push(data);
                    }
                });
                this.listQuery.knowledgeIds = ids;
                this.listQuery.knowledgeList = knowledgeList;
                this.pointsVisible = false;
                this.listQuery.sr.d
                    ? this.findCountItemByItemBank()
                    : this.findCountItem();
                this.cleanData();
            },
            knowledgeDel(index) {
                this.listQuery.knowledgeIds.splice(index, 1);
                this.listQuery.knowledgeList.splice(index, 1);
                this.pointsKey = +new Date();
                this.listQuery.sr.d
                    ? this.findCountItemByItemBank()
                    : this.findCountItem();
                this.cleanData();
            },
            inputBlur() {
                this.dataHandle();
            }
        }
    };
</script>
