<style lang="scss" src='./style.scss'>
</style>
<template>
    <article class="group__member__wrapper">
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('指定人员')" name="fixed">
                <fixed-member v-if="activeName === 'fixed'" :group-id="id"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('动态人员')" name="dynamic">
                <dynamic-member v-if="activeName === 'dynamic'" :group-id="id"/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>

<script>
    import FixedMember from './fixedMember';
    import DynamicMember from './dynamicMember';

    export default {
        name: 'MemberList',
        components: {
            FixedMember,
            DynamicMember
        },
        props: {
            groupId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                id: this.groupId,
                activeName: 'fixed'
            };
        },
        watch: {
            groupId(val) {
                this.id = val;
            }
        }
    };
</script>
