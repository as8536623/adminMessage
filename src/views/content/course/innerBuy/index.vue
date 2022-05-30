    <style lang="scss">
    @import './style.scss';
</style>

<template>
    <article class="container__padding inner-buy">
        <el-form
            :model="listQuery"
            :inline="true"
            label-width="80px"
            class="demo-form-inline unrequired__form"
        >
            <el-form-item :label="$t('专题名称') + '：'">
                <el-input
                    v-model="listQuery.name"
                    :placeholder="$t('请输入专题名称')"
                    maxlength="20"
                    clearable
                />
            </el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('查询') }}</el-button>
        </el-form>
        <div class="inner-buy__content">
            <course-item v-for="(item, index) in list" :key="index" :item="item"/>
            <div v-if="!list.length" class="inner-buy__default">-- 暂无数据 --</div>
        </div>
        <el-pagination
            class="inner-buy__page"
            background
            layout="prev, pager, next"
            :current-page="listQuery.pageNum"
            :total="total"
            @current-change="currentChange"
        />
    </article>
</template>

<script>
    import CourseItem from './components/CourseItem';
    import {getSubjectPage} from '@/api/course/subject';

    export default {
        name: 'InnerBuy',
        components: {
            CourseItem
        },
        data() {
            return {
                listQuery: {
                    code: '',
                    name: '',
                    status: 'ENABLED',
                    pageNum: 1,
                    pageSize: 10
                },
                list: [],
                total: 0
            };
        },
        mounted() {
            this.handleSearch();
        },
        methods: {
            currentChange(page) {
                console.log(page);
            },
            handleSearch() {
                this.getList({pageNum: 1});
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                getSubjectPage(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
