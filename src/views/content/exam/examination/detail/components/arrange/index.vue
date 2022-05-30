<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container examination-container">
        <section class="tool-form-item tool-arrange-item">
            <div
                v-for="(item, index) in examArranges"
                :key="index"
            >
                <arrange-item
                    :id="id"
                    :key="key"
                    ref="arrange"
                    :data="item"
                    :index="index"
                />
            </div>
        </section>
    </article>
</template>
<script>
    import ArrangeItem from './components/arrangeItem';
    import {listExamArrange} from '@/api/exam/exam/exam';

    export default {
        name: 'ExamArrange',
        components: {
            ArrangeItem
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                examArranges: [],
                key: null
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                listExamArrange(this.id).then(re => {
                    const result = re.data;
                    this.listLoading = false;
                    if (result && result.success) {
                        this.examArranges = result.data || [];
                        this.key = +new Date();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
