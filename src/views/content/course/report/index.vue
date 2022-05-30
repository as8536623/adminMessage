<style lang="scss">
    @import './index';
</style>
<template>
    <div
        class="container__wrap"
    >
        <svg-icon
            v-show="!isFullscreen"
            icon-class="fullscreen"
            class-name="report__fullscreen"
            @click="requestFullscreen"
        />
        <svg-icon
            v-show="isFullscreen"
            icon-class="halfscreen"
            class-name="report__halfscreen"
            @click="exitFullscreen"
        />
        <section class="container" :style="style?`transform:scale(${style.scale});height:${style.height}px`:''">
            <header class="board__hd">合肥市中小企业服务中心培训数据看板</header>
            <section class="board__bd">
                <section class="board-flex">
                    <section class="board-flex__item">
                        <div class="board-card__section">
                            <div class="board-card">
                                <div class="board-card__label">服务企业数量</div>
                                <div class="board-card__detail">
                                    <countTo
                                        :start-val="0"
                                        :end-val="889"
                                        :duration="3000"
                                    />
                                </div>
                            </div>
                            <div class="board-card">
                                <div class="board-card__label">课程数量</div>
                                <div class="board-card__detail">
                                    <countTo
                                        :start-val="0"
                                        :end-val="data.trainTotal || 0"
                                        :duration="3000"
                                    />
                                </div>
                            </div>
                            <div class="board-card">
                                <div class="board-card__label">累计时长(小时)</div>
                                <div class="board-card__detail">
                                    <countTo
                                        :start-val="0"
                                        :end-val="data.durTotal || 0"
                                        :duration="3000"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="board-analyze board-analyze-1">
                            <header class="board-analyze__hd">课程标签</header>
                            <div v-if="data.courseTagsStat" class="board-analyze__bd">
                                <pie-chart id="courseTagPie" :data="data.courseTagsStat"/>
                                <wordcloud
                                    :data="cloudWords"
                                    name-key="name"
                                    class="board-word-cloud"
                                    value-key="value"
                                    :font-size="[12,24]"
                                    :color="myColors"
                                />
                            </div>
                        </div>
                        <div class="board-analyze board-analyze-2">
                            <header class="board-analyze__hd">学习人次曲线</header>
                            <div v-if="data.learnTime" class="board-analyze__bd">
                                <line-chart
                                    id="studyAnalyzeChart"
                                    :data="{x:data.learnTime.date,y:data.learnTime.data}"
                                />
                            </div>
                        </div>
                    </section>
                    <section class="board-flex__item">
                        <div class="board-analyze board-analyze-2">
                            <header class="board-analyze__hd">课程学习排行榜</header>
                            <div class="board-analyze__bd">
                                <ol class="board-course-ranks">
                                    <li
                                        v-for="(item,i) in data.courseRank"
                                        :key="item.id"
                                        class="board-course-rank"
                                        @click="showCourseCompany(item)"
                                    >
                                        <span :class="`board-course-rank__no no-${i+1}`">{{ i+1 }}</span>
                                        <div class="board-course-rank__ft">
                                            <div class="board-course-rank-progress__wrap">
                                                <span
                                                    class="board-course-rank-progress"
                                                    :style="`width:${item.alreadyLearn/(data.courseRank[0].alreadyLearn+100)*100}%`"
                                                />
                                            </div>
                                        </div>
                                        <p
                                            class="board-course-rank__bd"
                                            :title="item.courseName"
                                        >{{ item.courseName }}</p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div class="board-analyze board-analyze-2">
                            <header class="board-analyze__hd">课程类别</header>
                            <div v-if="data.courseCategory" class="board-analyze__bd">
                                <bar-chart
                                    id="courseCategoryAnalyze"
                                    :data="{x:data.courseCategory.category,y:data.courseCategory.num}"
                                />
                            </div>
                        </div>
                        <div class="board-analyze board-analyze-2">
                            <header class="board-analyze__hd">在线时长曲线</header>
                            <div v-if="data.onlineTime" class="board-analyze__bd">
                                <line-chart
                                    id="onlineAnalyzeChart"
                                    :data="{x:data.onlineTime.date,y:data.onlineTime.data}"
                                />
                            </div>
                        </div>
                    </section>
                    <section class="board-flex__item">
                        <div class="board-analyze board-analyze-3">
                            <header class="board-analyze__hd">企业学时排行榜</header>
                            <div class="board-analyze__bd">
                                <ol v-if="data.periodRank" class="board-company-ranks">
                                    <li
                                        v-for="(item,i) in data.periodRank"
                                        :key="item.id"
                                        class="board-company-rank"
                                    >
                                        <span class="board-company-rank__no">{{ i+1 }}</span>
                                        <span class="board-company-rank__ft">{{ item.period }}学时</span>
                                        <p
                                            class="board-company-rank__bd"
                                            :title="item.companyName"
                                        >{{ item.companyName }}</p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div class="board-analyze board-analyze-2">
                            <header class="board-analyze__hd">产品活跃度</header>
                            <div class="board-analyze__bd board-flex board-dashboard__panel">
                                <div class="board-dashboard board-flex__item">
                                    <div class="board-dashboard__bd">
                                        <div
                                            class="board-dashboard__point"
                                            :style="`transform:rotate(${data.dau/100*180}deg);-webkit-transform:rotate(${data.dau/100*180}deg)`"
                                        />
                                    </div>
                                    <div class="board-dashboard__des">产品日活 {{ data.dau }}%</div>
                                </div>
                                <div class="board-dashboard board-flex__item">
                                    <div class="board-dashboard__bd">
                                        <div
                                            class="board-dashboard__point"
                                            :style="`transform:rotate(${data.mau/100*180}deg);-webkit-transform:rotate(${data.mau/100*180}deg)`"
                                        />
                                    </div>
                                    <div class="board-dashboard__des">产品月活 {{ data.mau }}%</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </section>
            <section v-if="showDialog" class="board-dialog">
                <div class="board-dialog-mask" @click="showDialog = false"/>
                <div class="board-dialog__bd">
                    <div class="board-dialog__hd">参与学习企业</div>
                    <div class="board-dialog__course-name">{{ courseInfo && courseInfo.courseName }}</div>
                    <table class="board-table">
                        <col align="left" width="300">
                        <col align="left" width="200">
                        <col align="left" width="130">
                        <thead>
                            <tr>
                                <td>企业姓名</td>
                                <td>联系人</td>
                                <td>联系电话</td>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(item,i) in courseInfo.companyList">
                                <tr
                                    v-if="i<11"
                                    :key="item.id"
                                >
                                    <td>
                                        <div
                                            class="text-ellipsis"
                                            :title="item.companyName"
                                        >{{ item.companyName }}
                                        </div>
                                    </td>
                                    <td>{{ item.contact }}</td>
                                    <td>{{ item.phone }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </section>
        </section>
    </div>
</template>

<script>
    import {exitFullscreen, requestFullscreen} from '@/utils/dom';
    import LineChart from './components/LineChart.vue';
    import BarChart from './components/BarChart.vue';
    import PieChart from './components/PieChart.vue';
    import countTo from 'vue-count-to';
    import wordcloud from 'vue-wordcloud';

    import {fetchData} from '@/api/statistics';

    export default {
        name: 'Dashboard',
        components: {LineChart, BarChart, PieChart, countTo, wordcloud},
        data() {
            return {
                style: null,
                showDialog: false,
                courseInfo: {},
                data: {},
                myColors: ['#00F1FF', '#629fc9', '#94bedb', '#c9e0ef'],
                cloudWords: [],
                isFullscreen: false
            };
        },

        computed: {},
        created() {
            this.fetchData();
            this.handleReize();
        },
        mounted() {
            this.bindFullscreenListener();
        },
        beforeDestroy() {
            exitFullscreen();
            this.unbindFullscreenListener();
        },
        methods: {
            requestFullscreen() {
                requestFullscreen(document.body);
                this.isFullscreen = true;
                this.handleReize();
            },
            exitFullscreen() {
                exitFullscreen();
                this.isFullscreen = false;
                this.handleReize();
            },
            fullscreenChange() {
                this.isFullscreen = !!document.fullscreenElement;
                this.handleReize();
            },
            bindFullscreenListener() {
                const that = this;
                document.addEventListener(
                    'fullscreenchange',
                    that.fullscreenChange
                );
            },
            unbindFullscreenListener() {
                document.removeEventListener(
                    'fullscreenchange',
                    this.fullscreenChange
                );
            },
            showCourseCompany(item) {
                this.courseInfo = item;
                this.showDialog = true;
            },
            handleReize() {
                const width = 1920;
                const height = 1080;
                const actWidth = window.innerWidth;
                const actHeight = window.innerHeight;
                var style = {
                    height: actHeight,
                    width: actWidth
                };
                if (actWidth / width > 1) {
                    style.scale = actWidth / width;
                }

                if (actWidth / width < 1) {
                    style.scale = actWidth / width;
                }

                if (style.scale * height > actHeight) {
                    style.height = style.scale * height;
                }

                this.style = style;
            },
            fetchData() {
                fetchData().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.transformData(result.data);
                    } else {
                        this.$message.error('获取数据失败');
                    }
                });
            },
            transformData(data) {
                if (!data) {
                    return;
                }

                if (data.courseTags) {
                    data.courseTags.forEach(item => {
                        this.cloudWords.push({name: item, value: 14});
                    });
                }

                if (Array.isArray(data.periodRank)) {
                    data.periodRank = data.periodRank.slice(0, 12);
                }

                if (Array.isArray(data.courseRank)) {
                    data.courseRank = data.courseRank.slice(0, 6);
                    data.courseRank.map(item => {
                        if (Array.isArray(item.companyList)) {
                            item.companyList.map(item => {
                                item.phone =
                                    item.phone.substr(0, 3) +
                                    '****' +
                                    item.phone.substr(7, 11);
                            });
                        }
                    });
                }

                if (Array.isArray(data.courseTagsStat)) {
                    data.courseTagsStat.sort((a, b) => {
                        return Number(a.value) - Number(b.value);
                    });
                    data.courseTagsStat[0].name = '其他';
                }

                this.data = data;
            }
        }
    };
</script>
