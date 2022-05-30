<style lang="scss" scoped>
@import "./style";
</style>
<style lang="scss">
.app-main{
    background-color: $white;
}
</style>
<template>
    <section v-if="course" class="course-wrapper">
        <div class="open__course__bg">
            <div class="open__course__title">{{ course.name }}</div>
            <article class="open__course__wrapper center__width__breadcrumb">
                <div class="open__course--top">
                    <!--视频-->
                    <course-video v-if="course.standard === 'VIDEO'"/>
                    <!--文档-->
                    <course-article v-if="course.standard === 'DOC'"/>
                    <!--音频-->
                    <course-audio v-if="course.standard === 'AUDIO'"/>
                </div>
                <!--                <div class="open__course&#45;&#45;bottom">-->
                <!--                    <div class="course__detail">-->
                <!--                        <course-info :course="course"/>-->
                <!--                    </div>-->
                <!--                </div>-->
            </article>
        </div>
    </section>
</template>
<script>
    import CourseVideo from '@/components/Course/CourseVideo';
    import CourseArticle from '@/components/Course/CourseArticle';
    import CourseAudio from '@/components/Course/CourseAudio';
    // import CourseInfo from '@/components/Course/CourseInfo';
    import {openCourseInfo} from '@/api/course/course';
    import {setToken, setAppKey} from '@/utils/auth';
    // import {createSocketLink} from '@/utils/socket';

    export default {
        name: 'OpenCourse',
        components: {
            CourseVideo,
            CourseAudio,
            // CourseInfo,
            CourseArticle
        },
        data() {
            return {
                id: this.$route.query.id,
                course: null
            };
        },
        created() {
            const {token, appKey} = this.$route.query;
            if (token) {
                this.$store.dispatch('setToken', token);
                setToken(token);
            }
            if (appKey) {
                setAppKey(appKey);
            }
        },
        mounted() {
            this.getInfo();
            // if (!window.Socket) {
            //     createSocketLink();
            // }
        },
        methods: {
            // 课程详情
            getInfo() {
                openCourseInfo(this.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.course = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取数据失败'));
                    }
                });
            }
        }
    };
</script>
