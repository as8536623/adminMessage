<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <article class="course__article">
        <div class="course__article--top">
            <div class="course__article__left">
                <veln-document-player
                    v-if="currentData"
                    :src="currentData.src"
                    :convert-type="currentData.convertType"
                    :total="currentData.total"
                    :course-id="currentData.courseId"
                    :item-id="currentData.id"
                />
            </div>
            <div class="course__article__right">
                <course-catalog
                    :list="catalogList"
                    :c-index="cIndex"
                    :b-index="bIndex"
                    @chapterHandle="chapterBackHandle"
                />
            </div>
        </div>
    </article>
</template>
<script>
    import CourseCatalog from '../CourseCatalog';
    import {getCourseItem} from '@/api/course/course/courseItem';
    import VelnDocumentPlayer from '@/components/VelnDocumentPlayer';

    export default {
        name: 'CourseArticle',
        components: {
            VelnDocumentPlayer,
            CourseCatalog
        },
        data() {
            return {
                catalogList: [], // 目录
                cIndex: 0, // 当前章节
                bIndex: 0, // 当前章节小节
                currentData: null, // 当前小节数据
                key: null,
                isPlaying: false
            };
        },
        mounted() {
            this.getDirectory(true);
        },
        methods: {
            // 目录
            getDirectory(sortFlag) {
                const params = {
                    courseId: this.$parent.id,
                    sortFlag: sortFlag
                };
                getCourseItem(params).then(re => {
                    const res = re.data;
                    if (res && res.success) {
                        const result = res.data;
                        this.catalogList = result.directory;
                        this.changeActiveIndex(result.lastStudyItemId);
                    } else {
                        this.$errorMsg(this.$t(res.msg || '获取数据失败'));
                    }
                });
            },
            // 定位到当前课程
            changeActiveIndex(second) {
                let index = 0;
                let idx = 0;
                const catalogList = this.catalogList;
                for (let i = 0; i < catalogList.length; i++) {
                    const list = catalogList[i].list || [];
                    for (let j = 0; j < list.length; j++) {
                        if (list[j].id === second) {
                            index = i;
                            idx = j;
                        }
                    }
                }
                this.cIndex = index;
                this.bIndex = idx;
                this.getCurrentChapter();
            },
            // 获取小节数据
            getCurrentChapter() {
                const item = this.catalogList[this.cIndex].list[this.bIndex];
                this.currentData = {
                    courseId: item.courseId,
                    id: item.id,
                    src: item.viewUrl,
                    total: item.page,
                    learned: item.learned,
                    convertType: item.convertType,
                    sp: true
                };
                this.key = +new Date();
            },
            chapterBackHandle(e) {
                // eslint-disable-next-line camelcase
                const {c_index, b_index} = e;
                // eslint-disable-next-line camelcase
                this.cIndex = c_index;
                // eslint-disable-next-line camelcase
                this.bIndex = b_index;
                this.isPlaying = true;
                this.getCurrentChapter(false);
            }
        }
    };
</script>
