<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <div class="subject-course-list">
        <div class="course-list-header">包含课程</div>
        <section v-for="(course, index) in list" :key="index" class="sc-sec">
            <div class="sc-sec__content">
                <section
                    v-for="(chapter, idx) in course.directoryVo.directory"
                    :key="idx"
                    class="sc-sec__course van-hairline--top"
                >
                    <div
                        v-for="(lesson, i) in chapter.list"
                        :key="i"
                        class="sc-sec__chapter"
                    >
                        <veln-image class="sc-sec__cover" :src="lesson.coverUrl"/>
                        <div class="sc-sec__chapter--right">
                            <div class="sc-sec__chapter__name">{{ lesson.name }}</div>
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
            }
        },
        data() {
            return {
            };
        },
        mounted() {
        },
        methods: {
        }
    };
</script>
