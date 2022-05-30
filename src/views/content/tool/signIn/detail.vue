<style lang="scss" scoped>
    .tool-edit-container {
        padding: 10px 20px !important;
    }
</style>
<template>
    <article class="app-container tool-edit-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('基本信息')" name="first">
                <basic-info :data="data" @editHandle="editBack"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('签到设置')" name="second">
                <setting :data="data" @editHandle="editBack"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('参与人员')" name="third">
                <participants :id="id" :data="data" @editHandle="editBack"/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script>
    import BasicInfo from './components/BasicInfo';
    import Setting from './components/Setting';
    import Participants from './components/Participants';
    import {
        getInfoById
    } from '@/api/signIn';

    export default {
        name: 'SignInDetail',
        components: {
            BasicInfo,
            Setting,
            Participants
        },
        data() {
            return {
                activeName: 'first',
                id: this.$route.query.id,
                data: {}
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const params = {id: this.id};
                getInfoById(params).then(res => {
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
                        const TypeList = result.data.antiFakeType ? result.data.antiFakeType.split(',') : [];
                        this.data.antiFakeType = TypeList.filter(
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
