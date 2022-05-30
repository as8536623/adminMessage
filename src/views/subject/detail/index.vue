<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <article class="subject-detail">
        <div class="subject-content">
            <div v-if="course" class="subject-info">
                <veln-image
                    class="subject-cover"
                    :src="course.centerImage"
                />
                <div class="subject-info--right">
                    <div class="subject-name">{{ course.name }}</div>
                    <div class="subject-price">￥{{ course.price }}</div>
                    <div class="subject-info--bottom">
                        <div v-if="previewFile" class="subject-info__btn default" @click="dialogVisible=true">我要试学</div>
                        <div class="subject-info__btn primary" @click="buy">立即购买</div>
                    </div>
                </div>
            </div>
            <div class="subject-more">
                <div class="subject-more--left">
                    <nav class="subject-more__nav">
                        <div
                            v-for="(item, index) in navList"
                            :key="index"
                            class="subject-more__nav-item"
                            :class="{'active': item.code === active}"
                            @click="handleNavClick(item.code)"
                        >{{ item.name }}
                        </div>
                    </nav>
                    <div v-if="course" class="subject-more__content">
                        <introduce v-show="active==='INTRODUCE'" :desc="course.desc"/>
                        <catalog v-if="courseReferList" v-show="active==='CHAPTER'" :list="courseReferList"/>
                    </div>
                </div>
                <div class="subject-more--right">
                    <course-list v-if="courseReferList" :list="courseReferList"/>
                </div>
            </div>
        </div>
        <el-dialog
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            custom-class="pure__dialog"
            title="提示"
            width="800px"
        >
            <div v-if="previewFile" class="audition__content">
                <veln-video-player
                    ref="videoDemo"
                    :list="[{src: previewFile.m3u8Url, definition: '超清', defCode: '720'}]"
                    :poster="previewFile.coverUrl"
                    @ended="ended"
                />
                <buy-tips
                    v-show="showBuyTips && course.price > 0"
                    :course="course"
                    @sure="buy"
                    @cancel="auditionCancel"
                />
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import Introduce from './components/Introduce';
    import Catalog from './components/Catalog';
    import CourseList from './components/CourseList';
    import VelnVideoPlayer from '@/components/VelnVideoPlayer';
    import BuyTips from './components/BuyTips';

    import {getSubject, getSubjectCourse} from '@/api/course/subject';

    export default {
        name: 'SubjectDetail',
        components: {
            Introduce,
            Catalog,
            CourseList,
            VelnVideoPlayer,
            BuyTips
        },
        data() {
            return {
                active: 'INTRODUCE',
                navList: [{name: '课程介绍', code: 'INTRODUCE'}, {name: '章节', code: 'CHAPTER'}],
                id: '',
                course: null,
                previewFile: null,
                courseReferList: null,
                dialogVisible: false,
                showBuyTips: false
            };
        },
        mounted() {
            const id = this.$route.query.id;
            if (id) {
                this.id = id;
                this.getSubject();
            }
        },
        methods: {
            handleNavClick(code) {
                this.active = code;
            },
            async getSubject() {
                try {
                    const re = await getSubject(this.id);
                    const {name, coverUrl, teacherList, period, desc, internalPrice} = re.data.data;
                    this.course = {
                        name,
                        bgImage: coverUrl,
                        centerImage: coverUrl,
                        teacherList,
                        period,
                        desc,
                        price: internalPrice
                    };
                    await this.getSubjectCourse();
                } catch (e) {
                    console.error(e);
                }
            },
            async getSubjectCourse() {
                try {
                    const re = await getSubjectCourse(this.id);
                    const {previewFile, courseReferList} = re.data.data;
                    if (previewFile) {
                        previewFile.viewUrl = previewFile.m3u8Url;
                    }
                    this.previewFile = previewFile;
                    this.courseReferList = courseReferList;
                } catch (e) {
                    console.error(e);
                }
            },
            buy() {
                this.$router.push({
                    name: 'PayDetail',
                    query: {
                        id: this.id,
                        type: 'subject'
                    }
                });
            },
            auditionCancel() {
                this.showBuyTips = false;
            },
            ended() {
                this.showBuyTips = true;
            },
            handleDialogClose() {
                this.$refs.videoDemo.pause();
                this.dialogVisible = false;
            }
        }
    };
</script>
