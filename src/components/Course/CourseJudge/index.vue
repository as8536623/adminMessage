<style lang="scss" scoped>
    @import './style.scss';
</style>

<template>
    <div class="course__judge__component">
        <div>
            <section v-for="(judge, index) in list" :key="index" class="course__judge__item">
                <veln-image :src="judge.faceUrl" class="judge__avatar" type="user"/>
                <div class="judge__content">
                    <div class="judge__header">
                        <span class="teacher__name">{{ judge.userName }}</span>
                        <veln-rate :value="judge.extraContent.judgeScore"/>
                    </div>
                    <div class="judge__text">{{ judge.content }}</div>
                    <div class="judge__time">{{ judge.createDateTime }}</div>
                    <div v-if="judge.approveContent && judge.approveTime" class="judge__reply">
                        <div class="reply__content">
                            <span class="reply__tip">{{ $t('讲师回复') }}：</span>
                            <span class="reply__text">{{ judge.approveContent }}</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <el-pagination
            :hide-on-single-page="true"
            :page-size="listQuery.pageSize"
            :total="total"
            background
            class="judge__page"
            layout="prev, pager, next, total"
            @current-change="handleChangePage"
        />
        <default-page v-if="!list.length" type="comment"/>
    </div>
</template>

<script>
    import VelnRate from '@/components/VelnRate';
    import DefaultPage from '@/components/DefaultPage';
    import {getCourseJudge} from '@/api/course/course';

    export default {
        name: 'VueTemplate',
        components: {
            VelnRate,
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
                listQuery: {
                    pageNum: 1,
                    pageSize: 10,
                    courseId: this.courseId
                },
                list: [],
                total: 0
            };
        },
        watch: {
            courseId: {
                handler(v) {
                    if (v) {
                        this.getList({pageNum: 1, pageSize: 10, courseId: this.courseId});
                    }
                },
                immediate: true
            }
        },
        methods: {
            async getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.articleId = this.courseId;
                const result = await getCourseJudge(params);
                const {list, total} = result.data;
                this.list = list || [];
                this.total = total;
                this.listQuery.pageNum = params.pageNum;
            },
            handleChangePage(pageNum) {
                this.getList({pageNum});
            }
        }
    };
</script>
