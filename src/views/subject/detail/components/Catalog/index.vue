<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <div class="subject-catalog">
        <section v-for="(course, index) in list" :key="index" :class="{'active': foldList.includes(course.id)}" class="sc-sec">
            <div class="sc-sec__header" @click="fold(course)">
                <div class="sc-sec__title">
                    <div class="sc-sec__title__index">课程{{ index+1 }}</div>
                    <div class="sc-sec__title__name">
                        <div class="text-inner" :title="course.courseName">{{ course.courseName }}</div>
                    </div>
                </div>
                <svg-icon icon-class="arrow_down" class-name="sc-sec__arrow"/>
            </div>
            <div v-show="foldList.includes(course.id)" class="sc-sec__content">
                <section
                    v-for="(chapter, idx) in course.directoryVo.directory"
                    :key="idx"
                    class="sc-sec__course van-hairline--top"
                >
                    <div class="sc-sec__course__name">
                        <div class="sc-sec__course__order">{{ idx+1 }}：</div>
                        <span class="sc-sec__course__title">
                            <div class="text-inner" :title="chapter.name">{{ chapter.name }}</div>
                        </span>
                    </div>
                    <div
                        v-for="(lesson, i) in chapter.list"
                        :key="i"
                        class="sc-sec__chapter"
                        :class="{'active': active === lesson.id}"
                        @click="handleSel(lesson)"
                    >
                        <div class="sc-sec__chapter--left">
                            <svg-icon icon-class="video_o" class-name="sc-sec__chapter__icon"/>
                        </div>
                        <div class="sc-sec__chapter--right">
                            <div class="sc-sec__chapter__name">
                                <div class="text-inner" :title="lesson.name">{{ lesson.name }}</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: 'Catalog',
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            canSkip: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                active: '',
                foldList: []
            };
        },
        mounted() {
        },
        methods: {
            handleSel(lesson) {
                if (!this.canSkip) {
                    this.$toast('请先购买此专题课程');
                    return;
                }
                this.active = lesson.id;

                this.$emit('select', lesson);
            },
            fold(course) {
                const {id} = course;
                const list = this.foldList;
                const index = list.indexOf(id);
                if (index === -1) {
                    list.push(id);
                } else {
                    list.splice(index, 1);
                }

                this.foldList = list;
            }
        }
    };
</script>
