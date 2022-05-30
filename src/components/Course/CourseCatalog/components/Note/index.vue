<style lang="scss">
    @import "./style";
</style>
<template>
    <div class="note__wrapper">
        <vue-scroll>
            <div class="note__content">
                <el-input
                    v-model="editQuery.noteText"
                    type="textarea"
                    rows="8"
                    maxlength="300"
                    :placeholder="$t('写下你的笔记吧')"
                    show-word-limit
                />
                <el-button type="primary" class="note__button" @click="saveCourseNote">{{ $t('提交笔记') }}</el-button>
                <div class="my__note__wrapper">
                    <label class="note__label">{{ $t('我的笔记') }}</label>
                    <div v-for="(item, index) in list" :key="index" class="my__note__content">
                        {{ index + 1 }}、{{ item.noteText }}
                    </div>
                </div>
            </div>
        </vue-scroll>
        <div class="my-note__btn hide">
            <el-button type="primary" class="el__button--more" @click="enter">{{ $t('查看更多我的笔记') }}</el-button>
        </div>
    </div>
</template>
<script>
    import {courseNotePage, saveCourseNote} from '@/api/course/course/note';

    export default {
        name: 'Note',
        data() {
            return {
                editQuery: {
                    noteText: '',
                    courseId: this.$route.query.id
                },
                listQuery: {
                    keywords: '',
                    courseId: this.$route.query.id,
                    pageNum: 1,
                    pageSize: 100,
                    myself: true
                },
                list: [],
                total: 0
            };
        },
        created() {
            this.getList();
        },
        methods: {
            async getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                courseNotePage(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            saveCourseNote(condition) {
                const data = Object.assign({}, this.editQuery, condition);
                if (!data.noteText) {
                    this.$infoMsg(this.$t('请输入笔记内容'));
                    return;
                }
                if (data.noteText.length < 10) {
                    this.$infoMsg(this.$t('笔记内容至少十个字符'));
                    return;
                }
                saveCourseNote(data).then(re => {
                    const res = re.data;
                    const result = res.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t(result.msg || '保存成功'));
                        this.editQuery.noteText = '';
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            enter() {
                this.$router.push({name: 'personalNote'});
            }
        }
    };
</script>
