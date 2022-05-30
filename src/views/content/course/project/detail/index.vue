<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="project-detail-container">
        <el-tabs v-if="data" v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
                <basic v-if="activeName === 'first'" :data="data" @editHandle="editBack"/>
            </el-tab-pane>
            <el-tab-pane label="参与人员" name="second">
                <participate v-if="activeName === 'second'" :data="data" @editHandle="editBack"/>
            </el-tab-pane>
            <el-tab-pane label="任务管理" name="third">
                <project-task v-if="activeName === 'third'" :read-only="true" @editHandle="editBack"/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>

<script>
    import Basic from './components/basic';
    import Participate from './components/participate';
    import {info} from '@/api/course/project/project';
    import ProjectTask from '../task/index';

    export default {
        name: 'ProjectDetail',
        components: {
            ProjectTask,
            Basic,
            Participate
        },
        data() {
            return {
                activeName: this.$route.query.activeName || 'first',
                id: this.$route.query.id,
                data: null
            };
        },
        created() {
            if (this.id) {
                this.init();
            }
        },
        methods: {
            init() {
                info(this.$route.query.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = Object.assign(
                            {},
                            this.data,
                            result.data
                        );
                        const list = result.data.remindType ? result.data.remindType.split(',') : [];
                        this.data.remindType = list.filter(
                            item => !!item
                        );
                    } else {
                        this.$errorMsg(
                            result.msg || this.$t('数据查询失败')
                        );
                    }
                });
            },
            handleClick(e) {
                this.activeName = e.name;
            },
            editBack(name) {
                if (name) {
                    this.$router.push({name, query: {id: this.$route.query.id}});
                }
            }
        }
    };
</script>
