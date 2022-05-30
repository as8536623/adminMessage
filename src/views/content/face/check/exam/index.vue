<style lang="scss" src="../style.scss">
</style>
<template>
    <article class="enroll__container">
        <section class="veln__width">
            <div v-if="enrollList.length" class="check-section swiper-container">
                <div class="swiper-wrapper">
                    <div
                        v-for="(item, index) in enrollList"
                        :key="index"
                        class="swiper-slide"
                        :class="activeId === item.relId ? 'active check__item': 'check__item'"
                        :title="item.name"
                        @click="enrollOpt(item)"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <!-- 如果需要导航按钮 -->
                <div class="swiper-button-prev"/>
                <div class="swiper-button-next"/>
            </div>
        </section>
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('按人员查看')" name="person">
                <exam-person-list :id="activeId"/>
            </el-tab-pane>
            <!--<el-tab-pane :label="$t('按题目查看')" name="question">-->
            <!--</el-tab-pane>-->
        </el-tabs>
    </article>
</template>
<script>
    import {listByType} from '@/api/activity';
    import ExamPersonList from './list/index';
    export default {
        name: 'Exam',
        components: {
            ExamPersonList
        },
        data() {
            return {
                faceCourseId: this.$route.query.relId,
                relType: 'PE',
                enrollList: [],
                activeId: '',
                activeName: 'person'
            };
        },
        created() {
            this.listByType();
        },
        methods: {
            listByType() {
                const params = {faceCourseId: this.faceCourseId, relType: this.relType};
                listByType(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.enrollList = result.data ? result.data : [];
                        this.activeId = this.enrollList.length > 0 ? this.enrollList[0].relId : '';
                        this.$nextTick(() => {
                            this.init();
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询失败'));
                    }
                });
            },
            enrollOpt(item) {
                this.activeId = item.relId;
            },
            init() {
                new window.Swiper('.swiper-container', {
                    // 轮播图的方向，也可以是vertical方向
                    direction: 'horizontal',
                    // 播放速度
                    loop: false,
                    // 自动播放时间
                    autoplay: 1000,
                    width: '188',
                    // 播放的速度
                    speed: 2000,
                    // 如果需要前进后退按钮
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    },
                    // 这样，即使我们滑动之后， 定时器也不会被清除
                    autoplayDisableOnInteraction: false,
                    // 如果需要滚动条
                    scrollbar: '.swiper-scrollbar'
                });
            }
        }
    };
</script>
