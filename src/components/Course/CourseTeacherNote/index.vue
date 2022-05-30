<style lang="scss" scoped>
    @import './style.scss';
</style>
<style lang="scss">
    @import './origin.scss';
</style>

<template>
    <div class="course__teacher__note">
        <div class="note__edit">
            <!--<el-input
                v-model.trim="value"
                :placeholder="$t('请用至少10个字来分享你的笔记、思考或问题')"
                :rows="6"
                class="none__resize"
                maxlength="500"
                type="textarea"
            />-->
            <!--<div class="note__btn__line">
                <el-button class="note__btn" size="small" type="primary" @click="handlePublish">{{ $t('发布') }}
                </el-button>
            </div>-->
        </div>
        <div class="note__list">
            <div v-for="(note, index) in list" :key="index" class="note__item">
                <veln-image :src="note.faceUrl?note.faceUrl:note.avatar" class="note__avatar" type="user"/>
                <div class="note__content">
                    <div class="note__user">{{ note.userName }}</div>
                    <div class="note__text">{{ note.noteText }}</div>
                    <div class="note__time">{{ note.createdAtStr }}</div>
                </div>
            </div>
        </div>
        <el-pagination
            :hide-on-single-page="true"
            :page-size="listQuery.pageSize"
            :total="total"
            background
            class="note__page"
            layout="prev, pager, next, total"
            @current-change="handleChangePage"
        />
        <default-page v-if="!list.length"/>
    </div>
</template>

<script>
    import {pageAllUserNotes, saveCourseNote} from '@/api/course/note';
    import DefaultPage from '@/components/DefaultPage';
    import checkLoginMixin from '@/mixins/checkLogin';

    export default {
        name: 'CourseTeacherNote',
        components: {
            DefaultPage
        },
        mixins: [checkLoginMixin],
        props: {
            courseId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                value: '',
                listQuery: {
                    pageNum: 1,
                    pageSize: 5,
                    courseId: this.courseId
                },
                list: [],
                total: 0,
                ignoreCheck: true // 进入页面禁止自动校验登录
            };
        },
        watch: {
            courseId: {
                handler(v) {
                    if (v) {
                        this.getList({pageNum: 1, courseId: this.courseId});
                    }
                },
                immediate: true
            }
        },
        methods: {
            async getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                pageAllUserNotes(params).then(re => {
                    const result = re;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            handleChangePage(pageNum) {
                this.getList({pageNum, courseId: this.courseId});
            },
            async handlePublish() {
                if (!this.checkLogin()) {
                    return;
                }

                if (!this.value) {
                    this.$infoMsg(this.$t('请输入笔记内容'));
                    return;
                }
                if (this.value.length < 10) {
                    this.$infoMsg(this.$t('笔记内容至少十个字符'));
                    return;
                }

                if (this.$store.getters.ajaxIng) {
                    return;
                }
                await this.$store.dispatch('setAjaxIng', true);

                const params = {
                    courseId: this.courseId,
                    noteText: this.value
                };

                await saveCourseNote(params);
                this.$successMsg(this.$t('发布成功'));
                this.value = '';
                await this.getList({pageNum: this.listQuery.pageNum, courseId: this.courseId});
                await this.$store.dispatch('setAjaxIng', false);
            }
        }
    };
</script>
