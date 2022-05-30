<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container judge-container">
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('待评卷')" name="wait">
                <wait-paper/>
            </el-tab-pane>
            <el-tab-pane :label="$t('已评卷')" name="marked">
                <marked-paper/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script>
    import WaitPaper from './components/waitPaper';
    import MarkedPaper from './components/markedPaper';
    export default {
        name: 'JudgeList',
        components: {
            WaitPaper,
            MarkedPaper
        },
        data() {
            return {
                activeName: 'wait'
            };
        }
    };
</script>
