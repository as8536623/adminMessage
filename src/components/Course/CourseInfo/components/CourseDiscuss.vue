<style lang="scss">
    @import "./style";
</style>
<template>
    <div class="course__discuss">
        <div class="discuss__ask__wrapper">
            <el-button type="primary" @click="discussHandle">{{ $t('我要提问') }}</el-button>
        </div>
        <div class="discuss__list">
            <div
                v-for="(item, index) in discussList"
                :key="index"
                :loading="listLoading"
                class="discuss__item"
            >
                <div class="discuss__item--top">
                    <div class="discuss__avatar">
                        <veln-image :src="item.faceUrl" alt="用户头像" class="avatar" type="user"/>
                    </div>
                    <div class="discuss__info">
                        <div class="discuss__header">
                            <span class="discuss__title">{{ item.title }}</span>
                            <el-button class="release_btn" size="mini" @click="answerHandle(index)">
                                <svg-icon class-name="edit__icon" icon-class="edit"/>
                                {{ $t('我要回答') }}
                            </el-button>
                        </div>
                        <div class="discuss__text">{{ item.content }}</div>
                    </div>
                </div>
                <div class="discuss__item--bottom">
                    <div class="answer__list">
                        <div
                            v-for="(aItem, aIndex) in item.answerList"
                            :key="aIndex"
                            class="answer__item"
                        >
                            <div class="answer__time">
                                <span>{{ formatTime(aItem.createdAtTime) }}</span> / <span>{{ aItem.userName }}</span>
                            </div>
                            <div class="answer__text">{{ aItem.content }}</div>
                        </div>
                    </div>
                    <div class="discuss__statistics">
                        <div class="discuss__total">{{ item.answerNum }}{{ $t('回答') }}</div>
                        <div class="discuss__time">{{ formatTime(item.createdAtTime) }}</div>
                    </div>
                    <div v-show="item.show" class="answer__wrapper">
                        <el-input
                            v-model="answerText"
                            :placeholder="$t('留下你的精彩回答~')"
                            maxlength="500"
                            rows="5"
                            show-word-limit
                            type="textarea"
                        />
                        <el-button class="release_btn" size="mini" type="primary" @click="publish(index)">{{ $t('发布') }}</el-button>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            custom-class="discuss__dialog"
            title="我要提问"
            width="500px"
            class="dialog__input"
        >
            <el-form :model="editQuery" label-width="100px">
                <el-form-item :label="$t('标题') + '：'">
                    <el-input
                        v-model="title"
                        :max-length="50"
                        :placeholder="$t('请输入标题~')"
                    />
                </el-form-item>
                <el-form-item :label="$t('内容') + '：'">
                    <el-input
                        v-model="discussText"
                        :placeholder="$t('留下你的问题描述~')"
                        maxlength="500"
                        rows="5"
                        show-word-limit
                        type="textarea"
                    />
                </el-form-item>
                <el-button class="release_btn" size="mini" type="primary" @click="submit">{{ $t('发布') }}</el-button>
            </el-form>
        </el-dialog>
        <el-pagination
            :hide-on-single-page="true"
            :page-size="listQuery.pageSize"
            :total="total"
            background
            class="note__page"
            layout="prev, pager, next, total"
            @current-change="handleChangePage"
        />
        <default-page v-if="!discussList.length"/>
    </div>
</template>
<script>
    import DefaultPage from '@/components/DefaultPage';
    import {mapGetters} from 'vuex';
    import {formatTime} from '@/utils';
    import {saveCourseDiscuss, searchCourseDiscuss} from '@/api/course/course/courseDiscuss';

    export default {
        name: 'CourseDiscuss',
        components: {
            DefaultPage
        },
        data() {
            return {
                editQuery: {
                    content: null,
                    courseId: this.$route.query.id
                },
                listQuery: {
                    courseId: this.$route.query.id,
                    pageNum: 1,
                    pageSize: 5
                },
                discussList: [],
                listLoading: false,
                answerText: null,
                dialogVisible: false,
                total: 0,
                discussText: null,
                title: null
            };
        },
        computed: {
            ...mapGetters(['avatar'])
        },
        created() {
            this.getList();
        },
        methods: {
            formatTime,
            async getList(condition) {
                this.listLoading = true;
                const params = Object.assign({}, this.listQuery, condition);
                searchCourseDiscuss(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.discussList = result.data.list || [];
                        this.discussList.map(item => {
                            item.show = false;
                        });
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                    this.discussText = null;
                    this.answerText = null;
                    this.title = null;
                    this.listLoading = false;
                });
            },
            answerHandle(index) {
                this.discussList.map(item => {
                    item.show = false;
                });
                this.discussList[index].show = true;
                this.$forceUpdate();
            },
            publish(index, condition) {
                if (!this.answerText) {
                    this.$infoMsg(this.$t('请输入回答内容'));
                    return;
                }
                if (this.answerText.length < 5) {
                    this.$infoMsg(this.$t('回答内容至少五个字符'));
                    return;
                }
                this.editQuery.content = this.answerText;
                const data = Object.assign({}, this.editQuery, condition);
                data.toUserId = this.discussList[index].fromUserId;
                data.parentId = this.discussList[index].id;
                this.saveCourseDiscuss(data);
            },
            handleChangePage(pageNum) {
                this.getList({pageNum});
            },
            discussHandle() {
                this.dialogVisible = true;
                this.discussText = null;
                this.answerText = null;
                this.title = null;
            },
            saveCourseDiscuss(data) {
                saveCourseDiscuss(data).then(re => {
                    const result = re;
                    if (result && result.success) {
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据保存异常'));
                    }
                });
                this.discussText = null;
                this.answerText = null;
                this.title = null;
            },
            submit(condition) {
                if (!this.discussText) {
                    this.$infoMsg(this.$t('请输入讨论内容'));
                    return;
                }
                if (this.discussText.length < 5) {
                    this.$infoMsg(this.$t('讨论内容至少五个字符'));
                    return;
                }
                if (!this.title) {
                    this.$infoMsg(this.$t('请输入标题'));
                    return;
                }
                if (this.discussText.length < 5 || this.discussText.length > 500) {
                    this.$infoMsg(this.$t('提问内容为五到五百个字符之间'));
                    return;
                }
                this.editQuery.content = this.discussText;
                const data = Object.assign({}, this.editQuery, condition);
                data.title = this.title;
                this.saveCourseDiscuss(data);
                this.dialogVisible = false;
            }
        }
    };
</script>
