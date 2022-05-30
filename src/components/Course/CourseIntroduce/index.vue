<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <div class="course__introduce">
        <div v-if="description" class="course__introduce__content" v-html="description"/>
        <default-page v-if="!description"/>
    </div>
</template>

<script>
    import {getIntroduceById} from '@/api/course/course';
    import DefaultPage from '@/components/DefaultPage';

    export default {
        name: 'CourseIntroduce',
        components: {
            DefaultPage
        },
        props: {
            courseId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                description: ''
            };
        },
        watch: {
            courseId: {
                handler(v) {
                    if (v) {
                        this.getIntroduceById();
                    }
                },
                immediate: true
            }
        },
        methods: {
            async getIntroduceById() {
                const result = await getIntroduceById(this.courseId);
                const {description} = result.data;
                this.description = description;
            }
        }
    };
</script>
