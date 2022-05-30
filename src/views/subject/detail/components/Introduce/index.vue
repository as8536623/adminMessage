<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <div class="course__introduce">
        <div v-if="desc" class="course__introduce__content" v-html="desc"/>
        <default-page v-if="!desc"/>
    </div>
</template>

<script>
    import DefaultPage from '@/components/DefaultPage';

    export default {
        name: 'CourseIntroduce',
        components: {
            DefaultPage
        },
        props: {
            desc: {
                type: String,
                default: ''
            }
        },
        data() {
            return {};
        }
    };
</script>
