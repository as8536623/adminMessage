<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="new__detail">
        <h3 class="news__title">{{ news.name }}</h3>
        <p v-if="news.createdAt || news.author" class="news__tips">
            <span v-if="news.createdAt" class="news__time">{{ $t('创建时间') }}：{{ news.createdAt }}</span>
            <span v-if="news.author" class="news__author">{{ $t('作者') }}：{{ news.author }}</span>
        </p>
        <veln-image v-if="news.coverUrl" class="news__cover" :src="news.coverUrl"/>
        <div class="news__content" v-html="news.blobContent"/>
    </article>
</template>

<script>
    import {getNewsById} from '@/api/info/info';
    export default {
        name: 'NewsDetail',
        data() {
            return {
                news: {
                    name: '',
                    coverUrl: '',
                    blobContent: '',
                    createdAt: '',
                    author: ''
                }
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.getInfoById(this.$route.query.id);
            }
        },
        methods: {
            getInfoById(id) {
                const params = {id};
                getNewsById(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const {
                            name,
                            coverUrl,
                            blobContent,
                            createdAt,
                            author
                        } = result.data;
                        this.news = {
                            name,
                            coverUrl,
                            blobContent,
                            createdAt,
                            author
                        };
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取资讯失败'));
                    }
                });
            }
        }
    };
</script>
