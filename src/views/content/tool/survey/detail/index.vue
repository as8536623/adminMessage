<style lang="scss" scoped>
.tool-edit-container {
    padding: 20px !important;
}
</style>
<template>
    <article class="app-container tool-edit-container">
        <el-tabs v-if="data" v-model="activeName">
            <el-tab-pane :label="$t('基本信息')" name="first">
                <basic-info @editHandle="editBack"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('参与人员')" name="third">
                <participants @editHandle="editBack"/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script>
    import BasicInfo from './base';
    import Participants from './participants';
    import {getInfoById} from '@/api/survey/surveyInfo';
    import {REMINDER_ENUM} from '@/enum';
    export default {
        name: 'SurveyDetail',
        components: {
            BasicInfo,
            Participants
        },
        data() {
            return {
                activeName: 'first',
                id: this.$route.query.id,
                data: null,
                reminder: REMINDER_ENUM
            };
        },
        created() {
            if (this.$route.query.id) {
                this.init(this.$route.query.id);
            }
        },
        methods: {
            init(id) {
                getInfoById(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data;
                        const list = result.data.remindType;
                        const valList = [];
                        list.map(item => {
                            valList.push(this.reminder.getName(item));
                        });
                        this.data.remindType = valList.join('，');
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            editBack(name) {
                if (name) {
                    this.$router.push({
                        name,
                        query: {id: this.$route.query.id}
                    });
                }
            }
        }
    };
</script>
