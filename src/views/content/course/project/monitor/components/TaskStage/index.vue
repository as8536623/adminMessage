<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="task-stage-container veln__width">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div
                    v-for="(item, index) in stageList"
                    :key="index"
                    class="swiper-slide task-stage-item"
                    :class="{'active': stage === index}"
                    @click="switchStage(index)"
                >
                    <span v-if="taskType === 'sign' || taskType === 'faceCourse' || taskType === 'onlineCourse'">
                        阶段{{ transferNumberToChinese(item.stageOrder + 1) }}：{{ item.taskInfo.name }}
                    </span>
                    <span v-else>
                        {{ item.taskInfo.name }}
                    </span>
                    {{ item.name }}
                </div>
            </div>
            <!-- 如果需要导航按钮 -->
            <div class="swiper-button-prev"/>
            <div class="swiper-button-next"/>
        </div>
    </article>
</template>

<script>
    import {taskList} from '../../data';
    import {transferNumberToChinese} from '@/utils/number';
    import {
        getTask
    } from '@/api/course/project/monitor';

    export default {
        name: 'TaskStage',
        props: {
            id: {
                type: String,
                default: ''
            },
            taskType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                taskList,
                stage: 0,
                stageList: []
            };
        },
        created() {
            if (this.id && this.taskType) {
                this.getTask({proId: this.id, type: this.taskList[this.taskType].type});
            }
        },
        methods: {
            transferNumberToChinese,
            getTask(params) {
                getTask(params).then(res => {
                    const result = res.data;
                    if (result && result.success) {
                        this.stageList = result.data || [];
                        if (this.stageList.length > 0) {
                            this.switchStage(0);
                            this.init();
                        }
                    }
                });
            },
            switchStage(index) {
                this.stage = index;
                this.$emit('checked', this.stageList[index]);
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
                    scrollbar: '.swiper-scrollbar',
                    observer: true, // 修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true // 修改swiper的父元素时，自动初始化swiper
                });
            }
        }
    };
</script>
