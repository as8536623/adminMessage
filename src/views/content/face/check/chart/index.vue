<style lang="scss" scoped src="../style.scss">
</style>
<template>
    <article class="chart-container">
        <section class="data__total">
            <span class="chart__title">{{ $t('考核数据汇总') }}</span>
            <div class="data__list">
                <div v-for="(item, index) in statisticsList" :key="index" class="data__item">
                    <div class="data__icon">
                        <svg-icon v-if="item.type === 'INTERACT'" icon-class="join_f" class-name="statistics__icon"/>
                        <svg-icon v-if="item.type === 'WORK'" icon-class="work_f" class-name="statistics__icon"/>
                        <svg-icon v-if="item.type === 'ENROLL'" icon-class="pass_f" class-name="statistics__icon"/>
                        <svg-icon v-if="item.type === 'SIGN'" icon-class="sign_f" class-name="statistics__icon"/>
                        <svg-icon v-if="item.type === 'PE'" icon-class="exam_f" class-name="statistics__icon"/>
                    </div>
                    <div class="data__desc">
                        <div v-if="item.type === 'INTERACT'" class="data__name">
                            {{ SET_CHECK_CONDITION.getName(item.type) }}{{ $t('参与率') }}
                        </div>
                        <div v-else class="data__name">{{ SET_CHECK_CONDITION.getName(item.type) }}{{ $t('通过率') }}</div>
                        <div class="data__info">
                            {{ (item.passNum/item.totalNum*100).toFixed(2) + '%' }}
                            （{{ item.passNum }}/{{ item.totalNum }}）
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="train__block">
            <div class="train__item">
                <span class="chart__title">{{ $t('培训人数') }}</span>
                <div ref="trainChart" class="train__chart"/>
            </div>
            <div class="rank__item">
                <div class="tab__list">
                    <span class="rank__title">{{ $t('排行榜') }}</span>
                    <div class="rank__btn">
                        <span :class="activeName === 'stone' ? 'activeBtn' : ''" @click="handleClick('stone')">{{ $t('能量石排行榜') }}</span>
                        <span :class="activeName === 'interaction' ? 'activeBtn' : ''" @click="handleClick('interaction')">{{ $t('互动排行') }}</span>
                    </div>
                </div>
                <section v-if="activeName === 'stone'">
                    <div
                        v-for="(item, index) in stoneList"
                        :key="index"
                        class="range__item"
                    >
                        <div class="order__item">
                            <span
                                class="order"
                                :class="{'first': index === 0,'second': index === 1,'third': index ===2}"
                            >{{ index+1 }}
                            </span>
                        </div>
                        <!--<div class="image">-->
                        <!--<img :src="require('../images/default@2x.png')" class="head__portrait"/>-->
                        <!--</div>-->
                        <div class="username">{{ item.name }}</div>
                        <div class="number">{{ item.num + $t('颗能量石') }}</div>
                    </div>
                    <div v-if="!stoneList.length" class="no__data">{{ $t('暂无数据') }}</div>
                </section>
                <section v-if="activeName === 'interaction'">
                    <div
                        v-for="(item, index) in interactionRangeList"
                        :key="index"
                        class="range__item"
                    >
                        <div class="order__item">
                            <span
                                class="order"
                                :class="{'first': index === 0,'second': index === 1,'third': index ===2}"
                            >{{ index+1 }}
                            </span>
                        </div>
                        <!--<div class="image">-->
                        <!--<img :src="require('../images/default@2x.png')" class="head__portrait"/>-->
                        <!--</div>-->
                        <div class="username">{{ item.userName }}</div>
                        <div class="number">{{ $t('参与') + item.count + $t('次互动') }}</div>
                    </div>
                    <div v-if="!interactionRangeList.length" class="no__data">{{ $t('暂无数据') }}</div>
                </section>
            </div>
        </section>
        <section class="rate__block">
            <span class="chart__title">{{ $t('学员互动参与率') }}</span>
            <div ref="rateChart" class="rate__chart"/>
        </section>
        <section class="interaction__block">
            <div class="interaction__item">
                <span class="chart__title">{{ $t('互动形式') }}</span>
                <div ref="interactionChart" class="interaction__chart"/>
            </div>
            <div class="interaction__item">
                <span class="chart__title">{{ $t('互动参与情况') }}</span>
                <div ref="interact" class="interaction__chart"/>
            </div>
        </section>
    </article>
</template>
<script>
    import {
        interactionRate, interactionShape, interact,
        train, interactRange, activityStatistics
    } from '@/api/activity';
    import {rateChartFun, interactionChartFun, interactFun, trainChartFun} from './chart';
    import {getList} from '@/api/face/stone';
    import {SET_CHECK_CONDITION} from '@/enum';

    export default {
        name: 'Chart',
        data() {
            return {
                SET_CHECK_CONDITION,
                faceCourseId: this.$route.query.relId,
                rateChart: '',
                interactionChart: '',
                interactChart: '',
                trainChart: '',
                activeName: 'stone',
                interactionRangeList: [],
                listQuery: {
                    relId: this.$route.query.relId,
                    pageNum: 1,
                    pageSize: 5,
                    sort: 'desc'
                },
                stoneList: [],
                statisticsList: []
            };
        },
        created() {
            this.activityStatistics();
            this.getList();
            this.interactionRate();
            this.interactionShape();
            this.interact();
            this.train();
        },
        mounted: function() {
            /* 载入后状态 */
            this.rateChart = rateChartFun({elem: this.$refs.rateChart});
            this.interactionChart = interactionChartFun({elem: this.$refs.interactionChart});
            this.interactChart = interactFun({elem: this.$refs.interact});
            this.trainChart = trainChartFun({elem: this.$refs.trainChart});
        },
        methods: {
            // 考核数据汇总
            activityStatistics() {
                const params = {faceCourseId: this.faceCourseId};
                activityStatistics(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.statisticsList = result.data ? result.data : [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            // 互动参与率
            interactionRate() {
                const params = {faceCourseId: this.faceCourseId};
                interactionRate(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const list = result.data && result.data.length ? result.data : [];
                        if (list.length) {
                            this.rateChart.setData(list);
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            // 互动形式
            interactionShape() {
                const params = {faceCourseId: this.faceCourseId};
                interactionShape(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const list = result.data && result.data.length ? result.data : [];
                        if (list.length) {
                            this.interactionChart.setData(list);
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            // 互动参与情况
            interact() {
                const params = {faceCourseId: this.faceCourseId};
                interact(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const list = result.data && result.data.length ? result.data : [];
                        if (list.length) {
                            this.interactChart.setData(list);
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            // 培训人数
            train() {
                const params = {faceCourseId: this.faceCourseId};
                train(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const list = result.data && result.data.length ? result.data : [];
                        if (list.length) {
                            this.trainChart.setData(list);
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            handleClick(tab) {
                this.activeName = tab;
                if (tab === 'stone') {
                    this.getList();
                } else {
                    this.interactRange();
                }
            },
            // 互动排行
            interactRange() {
                const params = {faceCourseId: this.faceCourseId, pageSize: 5};
                interactRange(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.interactionRangeList = result.data ? result.data : [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            // 能量石排行
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                getList(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.stoneList = result.data.list || [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
