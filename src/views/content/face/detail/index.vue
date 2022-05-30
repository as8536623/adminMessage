<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="app-container face-detail-container">
        <el-tabs v-if="data" v-model="activeName">
            <el-tab-pane :label="$t('基本信息')" name="first">
                <basic-info v-if="activeName === 'first'" :data="data" @editHandle="editBack"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('参与人员')" name="fourth">
                <participants v-if="activeName === 'fourth'" :id="id" :data="data" @editHandle="editBack"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('面授安排')" name="second">
                <plan v-if="activeName === 'second'" :id="id" @editHandle="editBack"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('现场互动（可不添加）')" name="third">
                <interaction v-if="activeName === 'third'" :id="id" @editHandle="editBack"/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script>
    import BasicInfo from './base';
    import Plan from './plan';
    import Interaction from './interaction';
    import Participants from './participants';
    import {
        detail
    } from '@/api/faceCourse';
    export default {
        name: 'FaceCourseDetail',
        components: {
            BasicInfo,
            Plan,
            Interaction,
            Participants
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
                const params = {id: this.id};
                detail(params).then(res => {
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
