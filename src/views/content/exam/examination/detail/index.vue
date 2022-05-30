<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container examination-container">
        <el-form
            label-width="140px"
        >
            <veln-steps :data="steps" :active="active" @change="stepChange"/>
            <exam-basic v-if="active === 0" :id="id"/>
            <paper-setting v-if="active === 1" :id="id"/>
            <exam-arrange v-if="active === 2" :id="id"/>
            <exam-setting v-if="active === 3" :id="id"/>
            <!--<el-form-item :label="$t('')" style="text-align: center;margin-top: 20px">-->
            <!--<el-button @click="cancel">{{$t('取消')}}</el-button>-->
            <!--</el-form-item>-->
        </el-form>
    </article>
</template>
<script>
    import ExamBasic from './components/basic';
    import PaperSetting from './components/paperSetting';
    import ExamArrange from './components/arrange';
    import ExamSetting from './components/examSetting';
    import VelnSteps from '@/components/VelnSteps';

    export default {
        name: 'ExaminationDetail',
        components: {
            VelnSteps,
            ExamBasic,
            PaperSetting,
            ExamArrange,
            ExamSetting
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('试卷设置'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('考试安排'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('考试设置'),
                    status: 'done',
                    disabled: false
                }
            ];
            return {
                id: this.$route.query.id,
                active: 0,
                steps
            };
        },
        methods: {
            stepChange(index) {
                this.active = index;
            },
            cancel() {
                this.$router.push({
                    name: 'examList'
                });
            }
        }
    };
</script>
