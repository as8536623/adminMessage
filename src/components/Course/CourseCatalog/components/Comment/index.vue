<style lang="scss">
    @import "./style";
</style>
<template>
    <vue-scroll class="comment__wrapper">
        <div class="comment__content">
            <div class="comment__start">
                <label v-if="!commented" class="comment__label">{{ $t('我要评论') }}</label>
                <label v-else class="comment__label">{{ $t('已评论') }}</label>
                <div class="start__list">
                    <div class="start__item">
                        <label>{{ $t('课程评分') }}</label>
                        <el-rate
                            v-model="editQuery.judgeScore"
                            :disabled="commented"
                            disabled-void-icon-class="el-icon-star-off"
                        />
                    </div>
                    <div class="start__item">
                        <label>{{ $t('内容实用') }}</label>
                        <el-rate v-model="editQuery.judgeA" :disabled="commented" disabled-void-icon-class="el-icon-star-off"/>
                    </div>
                    <div class="start__item">
                        <label>{{ $t('通俗易懂') }}</label>
                        <el-rate v-model="editQuery.judgeB" :disabled="commented" disabled-void-icon-class="el-icon-star-off"/>
                    </div>
                    <div class="start__item">
                        <label>{{ $t('逻辑清晰') }}</label>
                        <el-rate v-model="editQuery.judgeC" :disabled="commented" disabled-void-icon-class="el-icon-star-off"/>
                    </div>

                </div>
            </div>
            <el-input
                v-model="editQuery.comment"
                type="textarea"
                rows="8"
                maxlength="300"
                :placeholder="$t('看完课程，留下点话吧')"
                show-word-limit
                :readonly="commented"
            />
            <el-button v-if="!commented" type="primary" class="comment__button" @click="submitComment">
                {{ $t('发表评论') }}
            </el-button>
        </div>
    </vue-scroll>
</template>
<script>
    import {getComment, submitComment} from '@/api/course/course/courseJudge';

    export default {
        name: 'Comment',
        props: {
            courseId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                editQuery: {
                    comment: '',
                    judgeScore: 0,
                    judgeA: 0,
                    judgeB: 0,
                    judgeC: 0,
                    id: ''
                }
            };
        },
        computed: {
            commented() {
                return this.editQuery && this.editQuery.id != null && this.editQuery.id !== '';
            }
        },
        watch: {
            courseId: {
                handler(v) {
                    if (v) {
                        this.getComment(this.courseId);
                    }
                },
                immediate: true
            }
        },
        methods: {
            async submitComment() {
                const param = {courseId: this.courseId, judgeContent: this.editQuery};
                const res = await submitComment(param);
                if (res && res.success) {
                    this.$successMsg(this.$t('评论成功'));
                } else {
                    this.$errorMsg(this.$t(res.msg || '评论失败'));
                }
                await this.getComment(this.courseId);
            },
            async getComment(courseId) {
                const re = await getComment({courseId: courseId});
                const res = re.data;
                if (res && res.success && res.data) {
                    this.editQuery = res.data.extraContent;
                    this.editQuery.comment = res.data.content;
                    this.editQuery.id = res.data.id;
                } else if (!res || !res.success) {
                    this.$errorMsg(this.$t(res.msg || '获取已有评论失败'));
                }
            }
        }
    };
</script>
