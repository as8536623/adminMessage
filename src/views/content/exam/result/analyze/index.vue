<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="exam__analyze">
        <h2 class="exam__title">{{ name }}</h2>
        <veln-form-section class="analyze__sec" :title="$t('成绩总览')" :can-expand="false">
            <section v-if="overview" class="exam__analyze__preview">
                <el-checkbox-group
                    v-if="examArranges.length > 1"
                    v-model="checkList.arrangeIds"
                    class="batch__line"
                    @change="statisticOverview"
                >
                    <el-checkbox
                        v-for="(item, index) in examArranges"
                        :key="index"
                        :label="item.id"
                    >{{ item.batchName }}</el-checkbox>
                </el-checkbox-group>
                <div class="preview__header">
                    <div class="preview__header__item">{{ $t('应考') }}</div>
                    <div class="preview__header__item">{{ $t('实考') }}</div>
                    <div class="preview__header__item border--right">{{ $t('参考率') }}</div>
                    <div class="preview__header__item">{{ $t('满分') }}</div>
                    <div class="preview__header__item">{{ $t('及格线') }}</div>
                    <div class="preview__header__item border--right">{{ $t('及格率') }}</div>
                    <div class="preview__header__item">{{ $t('最高分') }}</div>
                    <div class="preview__header__item">{{ $t('最低分') }}</div>
                    <div class="preview__header__item">{{ $t('平均分') }}</div>
                </div>
                <div class="preview__content">
                    <div class="preview__content__item">{{ overview.testCount }}</div>
                    <div class="preview__content__item">{{ overview.attendCount }}</div>
                    <div class="preview__content__item border--right">{{ overview.attendRate }}</div>
                    <div class="preview__content__item">{{ overview.totalScore }}</div>
                    <div class="preview__content__item">{{ overview.passLine }}</div>
                    <div class="preview__content__item border--right">{{ overview.passRate }}</div>
                    <div class="preview__content__item">{{ overview.highScore }}</div>
                    <div class="preview__content__item">{{ overview.lowScore }}</div>
                    <div class="preview__content__item">{{ overview.averScore }}</div>
                </div>
            </section>
        </veln-form-section>
        <veln-form-section class="analyze__sec" :title="$t('成绩分布统计')" :can-expand="false">
            <section class="exam__analyze__pie">
                <pie-chart v-if="pie" id="examPieChart" :data="pie"/>
            </section>
            <section class="exam__analyze__line">
                <line-chart v-if="columnar" id="examLineChart" :data="columnar"/>
            </section>
        </veln-form-section>
    </article>
</template>

<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import LineChart from './components/LineChart';
    import PieChart from './components/PieChart';
    import {getInfo} from '@/api/exam/exam/exam';
    import {
        statisticOverview,
        statisticStatus,
        statisticScore
    } from '@/api/exam/exam/resultReport';
    export default {
        name: 'ExamAnalyze',
        components: {
            VelnFormSection,
            LineChart,
            PieChart
        },
        data() {
            return {
                id: '',
                name: '',
                columnar: null,
                overview: null,
                pie: null,
                examArranges: [],
                checkList: {
                    id: '',
                    arrangeIds: []
                }
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.id = this.$route.query.id;
                this.getInfo();
                this.statisticScore();
                this.statisticStatus();
            }
        },
        methods: {
            getInfo() {
                getInfo(this.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const {examType, examName, examArranges} = result.data;
                        this.name = `[${this.$t(
                            examType === 'ONLINE' ? '线上' : '线下'
                        )}] ${examName}`;
                        this.examArranges = examArranges;
                        const list = [];
                        this.checkList.arrangeIds = [];
                        examArranges.map(item => {
                            this.checkList.arrangeIds.push(item.id);
                            list.push(item.id);
                        });
                        this.checkList.id = result.data.id;
                        this.statisticOverview();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            statisticOverview() {
                statisticOverview(this.checkList).then(re => {
                    const res = re.data;
                    if (res.success) {
                        this.overview = res.data;
                    } else {
                        this.$errorMsg(this.$t(res.msg || '操作失败'));
                    }
                });
            },
            // 柱状图
            statisticScore() {
                const params = {examId: this.id};
                statisticScore(params).then(re => {
                    const res = re.data;
                    if (res.success) {
                        const result = res.data;
                        const categories = result.scoreRanges;
                        const scoreMap = result.scoreMap;
                        const columnData = [];
                        const scoreType = {};
                        if (!scoreMap) {
                            return;
                        }
                        for (const key in scoreMap) {
                            if (JSON.stringify(scoreMap[key]) === '{}') {
                                scoreType[key] = [];
                                continue;
                            }

                            scoreType[key] = [];
                            for (const k in scoreMap[key]) {
                                const name = result.examArrangeMap[k].batchName;
                                const value = scoreMap[key][k];
                                scoreType[key].push({name, value});
                            }
                        }
                        categories.map((v, i) => {
                            let scoreCount = 0;
                            for (const aId in result.scoreMap[v]) {
                                scoreCount += result.scoreMap[v][aId];
                            }

                            columnData.push({
                                value: scoreCount,
                                name: v,
                                seriesDatas: scoreType[v]
                            });
                        });
                        this.columnar = {
                            columnData,
                            scoreRanges: result.scoreRanges
                        };
                    } else {
                        this.$errorMsg(this.$t(res.msg || '获取数据失败'));
                    }
                });
            },
            // 饼状图
            statisticStatus() {
                const params = {examId: this.id};
                statisticStatus(params).then(re => {
                    const res = re.data;
                    if (res.success) {
                        const result = res.data;
                        var missResult = {
                            value: 0,
                            name: this.$t('缺考'),
                            seriesDatas: []
                        };
                        var passResult = {
                            value: 0,
                            name: this.$t('通过'),
                            seriesDatas: []
                        };
                        var noPassResult = {
                            value: 0,
                            name: this.$t('未通过'),
                            seriesDatas: []
                        };
                        result.map((examArrange, index) => {
                            missResult.value =
                                missResult.value + examArrange.missCount;
                            missResult.seriesDatas.push({
                                name: examArrange.batchName,
                                value: examArrange.missCount
                            });
                            noPassResult.value =
                                noPassResult.value + examArrange.noPassCount;
                            noPassResult.seriesDatas.push({
                                name: examArrange.batchName,
                                value: examArrange.noPassCount
                            });
                            passResult.value =
                                passResult.value + examArrange.passCount;
                            passResult.seriesDatas.push({
                                name: examArrange.batchName,
                                value: examArrange.passCount
                            });
                        });
                        this.pie = [missResult, passResult, noPassResult];
                    } else {
                        this.$errorMsg(this.$t(res.msg || '获取数据失败'));
                    }
                });
            }
        }
    };
</script>
