<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <article class="course__catalog">
        <nav class="course__catalog__nav">
            <span
                v-for="(item, index) in navs"
                :key="index"
                :class="{'active': item.code === code}"
                class="nav__item"
                @click="navClick(item.code)"
            >
                {{ item.name }}
            </span>
        </nav>
        <!--章节-->
        <chapter
            v-show="code === 'chapter'"
            :list="$parent.catalogList"
            :c-index="$parent.cIndex"
            :b-index="$parent.bIndex"
            :is-playing="$parent.isPlaying"
            @chapterHandle="chapterHandle"
        />
        <!--评论-->
        <comment v-show="code === 'comment'" :course-id="courseId"/>
        <!--笔记-->
        <note v-show="code === 'note'"/>
    </article>
</template>
<script>
    import Chapter from './components/Chapter';
    import Comment from './components/Comment';
    import Note from './components/Note';

    export default {
        name: 'CourseCatalog',
        components: {
            Chapter,
            Comment,
            Note
        },
        data() {
            return {
                navs: [
                    {
                        code: 'chapter',
                        name: this.$t('目录')
                    }
                    // {
                    //     code: 'comment',
                    //     name: this.$t('评论')
                    // },
                    // {
                    //     code: 'note',
                    //     name: this.$t('笔记')
                    // }
                ],
                code: 'chapter',
                courseId: this.$route.query.id
            };
        },
        methods: {
            navClick(code) {
                this.code = code;
            },
            chapterHandle(data) {
                this.$emit('chapterHandle', data);
            }
        }
    };
</script>
