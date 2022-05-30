<style scoped lang="scss">
    @import '../style.scss';
</style>

<template>
    <div class="workflow__setting cc__setting">
        <el-form ref="form">
            <el-form-item label="抄送人">
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
                :process-model-id="processModelId"
                :process-node-id="processNodeId"
                opt-type="USER"
                @onClose="handleUserClose"
            />
        </el-dialog>
    </div>
</template>

<script>
    import VelnDgpUser from '@/components/VelnDgpUser';
    import {searchUser} from '../api/workflow';

    export default {
        name: 'CcSetting',
        components: {
            VelnDgpUser
        },
        props: {
            processModelId: {
                type: String,
                default: ''
            },
            processNodeId: {
                type: String,
                default: ''
            },
            setting: {
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
            this.getUsers();
        },
        methods: {
            async getUsers() {
                const params = {
                    category: true,
                    keywords: '',
                    relId: '',
                    includeChild: true,
                    relType: 'ORG',
                    route: 'userComponent',
                    optType: 'USER',
                    processModelId: this.processModelId,
                    appCode: 'qgyun-service-workflow',
                    processNodeId: this.processNodeId,
                    pageNum: 1,
                    pageSize: 9
                };

                const re = await searchUser(params);
                const result = re.data;
                let str = '';
                if (result.success && Array.isArray(result.data.list)) {
                    result.data.list.map(item => {
                        str = str ? str + `,${item.name}` : item.name;
                    });
                }
                this.nameStr = str;
            },
            handleUserClose() {
                this.dgpDialogVisible = false;
                this.getUsers();
            },
            showDgp() {
                this.dgpDialogVisible = true;
            }
        }
    };
</script>
