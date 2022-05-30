<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="arrange-item-content">
        <el-form
            :model="editQuery"
            label-width="140px"
        >
            <el-form-item v-if="editQuery.batchName" :label="$t('批次名称') + '：'" class="required">
                {{ editQuery.batchName ? editQuery.batchName : '--' }}
            </el-form-item>
            <el-form-item :label="$t('考试开始时间') + '：'" class="required">
                {{ editQuery.startTime ? editQuery.startTime : '--' }}
            </el-form-item>
            <el-form-item :label="$t('考试结束时间') + '：'" class="required">
                {{ editQuery.endTime ? editQuery.endTime : '--' }}
            </el-form-item>
            <el-form-item :label="$t('考试范围') + '：'">
                <!--<span class="arrange__user">-->
                <!--{{editQuery.typeCountMap && editQuery.typeCountMap.USER ?-->
                <!--editQuery.typeCountMap.USER + $t('人') : 0 + $t('人')}} +-->
                <!--{{editQuery.typeCountMap && editQuery.typeCountMap.ORG ?-->
                <!--editQuery.typeCountMap.ORG + $t('个组织') : 0 + $t('个组织')}}-->
                <!--</span>-->
                <veln-organization-scope
                    :read-only="true"
                    fun-code="EXAM_USER"
                    :business-id="data.id"
                    :app-code="$appCodes.pe + '/pe'"
                    route="examUser"
                />
            </el-form-item>
            <!--<el-form-item :label="$t('监考员设置') + '：'">-->
            <!--<div v-if="editQuery.monitorUsers && editQuery.monitorUsers.length">-->
            <!--<el-tag-->
            <!--type="success"-->
            <!--v-for="(item, index) in editQuery.monitorUsers"-->
            <!--:key="index"-->
            <!--&gt;{{item.name}}-->
            <!--</el-tag>-->
            <!--</div>-->
            <!--<span v-else>&#45;&#45;</span>-->
            <!--</el-form-item>-->
        </el-form>
    </article>
</template>
<script>
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    export default {
        name: 'ArrangeItem',
        components: {
            VelnOrganizationScope
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        batchName: '',
                        startTime: '',
                        endTime: '',
                        monitorUserIds: [],
                        id: ''
                    };
                }
            },
            index: {
                type: Number,
                default: 0
            },
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                editQuery: this.data
            };
        }
    };
</script>
