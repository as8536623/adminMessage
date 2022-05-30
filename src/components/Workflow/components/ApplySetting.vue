<style scoped lang="scss">
    @import '../style.scss';
</style>

<template>
    <div class="workflow__setting apply__setting">
        <el-form ref="form">
            <el-form-item label="审批人">
                <el-input v-model="nameStr" class="el-input--handle" readonly @focus="showDgp"/>
            </el-form-item>
        </el-form>
        <el-dialog
            v-if="dgpDialogVisible"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="959px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                app-code="qgyun-service-workflow"
                route="userComponent"
                process-model-id="123"
                process-node-id="123"
                opt-type="USER"
                @onClose="handleUserClose"
            />
        </el-dialog>
    </div>
</template>

<script>
    import VelnDgpUser from '@/components/VelnDgpUser';

    export default {
        name: 'ApplySetting',
        components: {
            VelnDgpUser
        },
        props: {
            field: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                dgpDialogVisible: false,
                nameStr: ''
            };
        },
        mounted() {
        },
        methods: {
            handleUserClose() {
                this.dgpDialogVisible = false;
            },
            showDgp() {
                this.dgpDialogVisible = true;
            }
        }
    };
</script>
