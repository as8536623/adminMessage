<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <article class="course__info">
        <ul
            class="course__info__tab"
        >
            <li
                v-for="item in tabList"
                :key="item.type"
                class="course__info__tab__item"
                :class="{'active': activeTab === item.type}"
                @click="activeTab = item.type"
            >
                {{ item.title }}
            </li>
        </ul>
        <!--课程简介-->
        <course-detail v-show="activeTab === 'courseIntroduce'" :course-file-list="courseData.fileList"/>
        <!--课堂讨论-->
        <course-discuss v-show="activeTab === 'trainerIntroduce'"/>
    </article>
</template>
<script>
    import CourseDetail from './components/CourseDetail';
    import CourseDiscuss from './components/CourseDiscuss';

    const tabs = {
        tabCourseInfo: {
            title: '课程资源',
            type: 'courseIntroduce'
        },
        tabTrainerInfo: {
            title: '课堂讨论',
            type: 'trainerIntroduce'
        }
    };

    export default {
        name: 'CourseInfo',
        components: {
            CourseDetail,
            CourseDiscuss
        },
        props: {
            course: {
                type: Object, // 详情
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                courseType: '',
                tabList: [],
                activeTab: '',
                courseData: {},
                trainerData: []
            };
        },
        watch: {
            course: {
                handler(newValue) {
                    this.initDate(newValue);
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            /*
            * 初始化tab
            * courseData 课程简介简介数据
            * trainerData 讲师简介数据
            * */
            initDate(data) {
                const {standard, description, lectureList, teacherList} = data;
                this.setTab(standard);
                this.courseData.description = description || '';
                this.courseData.fileList = lectureList || [];
                this.trainerData = teacherList || [];
            },

            setTab(type) {
                this.courseType = type;
                this.tabList = [];
                this.tabList.push(tabs.tabCourseInfo);
                if (this.course && this.course.id) {
                    this.tabList.push(tabs.tabTrainerInfo);
                }
                this.activeTab = this.tabList[0].type;
            },

            chapterBackHandle(e) {
                this.$emit('chapterHandle', e);
            }
        }
    };
</script>
