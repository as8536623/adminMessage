<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="course__detail">
        <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
                <base-info/>
            </el-tab-pane>
            <el-tab-pane label="课程内容" name="second">
                <course-list/>
            </el-tab-pane>
            <el-tab-pane label="开放范围" name="third">
                <course-user/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>

<script>
    import BaseInfo from './baseInfo';
    import CourseList from './courseList';
    import CourseUser from './courseUser';
    export default {
        name: 'CourseDetail',
        components: {
            BaseInfo,
            CourseList,
            CourseUser
        },
        data() {
            return {
                activeName: 'first'
            };
        },
        mounted() {},
        methods: {}
    };
</script>
