<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <div v-if="!!list && list.length > 0" class="course__chapter">
        <div v-for="(chapter, index) in list" :key="index" class="chapter__sec">
            <svg-icon icon-class="chapter" class-name="chapter__icon"/>
            <div class="chapter__content">
                <div class="chapter__header">
                    <div class="chapter__title">{{ chapter.name }}</div>
                    <div v-if="chapter.description" class="chapter__description">{{ chapter.description }}</div>
                </div>
                <div v-for="(section, i) in chapter.list" :key="i" class="chapter__item">
                    <span class="chapter__item__title">{{ section.name }}</span>
                    <el-button class="chapter__btn" type="primary" size="mini" plain>{{ $t('试看') }}</el-button>
                </div>
            </div>
        </div>
    </div>
    <empty v-else/>
</template>

<script>
    import {getCourseItemForOpen} from '@/api/course/courseItem';

    export default {
        name: 'VueTemplate',
        props: {
            courseId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                list: []
            };
        },
        watch: {
            courseId: {
                handler(v) {
                    if (v) {
                        this.getCourseItem();
                    }
                },
                immediate: true
            }
        },
        methods: {
            // 获取章节信息
            async getCourseItem() {
                const params = {
                    courseId: this.courseId,
                    sortFlag: true
                };

                const result = await getCourseItemForOpen(params);
                const {data} = result;
                this.list = data.directory || [];
            }
        }
    };
</script>
