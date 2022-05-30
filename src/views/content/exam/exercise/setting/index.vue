<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="exercise__setting">
        <veln-steps :data="steps" :active="active" @change="stepChange"/>
        <section class="tool-form-item">
            <el-form label-width="140px">
                <el-form-item :label="$t('可用范围') + '：'" prop="useScope">
                    <el-radio v-model="editQuery.useScope" label="ALL" :disabled="readonly" @change="updateUserScope">
                        {{ $t('公开可用') }}
                    </el-radio>
                    <el-radio
                        v-model="editQuery.useScope"
                        label="PORTION"
                        :disabled="readonly"
                        @change="updateUserScope"
                    >{{ $t('指定可用') }}
                    </el-radio>
                </el-form-item>
                <el-form-item v-if="editQuery.useScope==='PORTION'" :label="$t('')">
                    <veln-organization-scope
                        fun-code="EXERCISE_USER"
                        :business-id="id"
                        :app-code="appCode"
                        route="exerciseUser"
                        :read-only="readonly"
                    />
                </el-form-item>
                <el-form-item v-if="!readonly">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <el-button type="primary" @click="sure">{{ $t('保存') }}</el-button>
                </el-form-item>
            </el-form>
        </section>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import {getExercise, updateUserScope} from '@/api/exam/exam/exercise';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';

    export default {
        name: 'ExerciseSetting',
        components: {
            VelnSteps,
            VelnOrganizationScope
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('范围设置'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                steps,
                active: 1,
                editQuery: {
                    id: this.$route.query.id,
                    useScope: 'ALL'
                },
                id: this.$route.query.id,
                readonly: this.$route.query.readonly,
                appCode: this.$appCodes.pe + '/pe'
            };
        },
        mounted() {
            this.getExercise();
        },
        methods: {
            getExercise() {
                const params = {
                    exerciseId: this.editQuery.id
                };
                getExercise(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery.id = result.data.id;
                        this.editQuery.useScope = result.data.useScope;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            updateUserScope() {
                const params = {
                    exerciseId: this.editQuery.id,
                    useScope: this.editQuery.useScope
                };
                updateUserScope(params).then(re => {
                    const result = re.data;
                    if (!result.success) {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.back();
                        break;
                }
            },
            back() {
                this.$router.push({name: 'exerciseBasic', query: {id: this.id, readonly: this.readonly}});
            },
            cancel() {
                history.go(-1);
            },
            sure() {
                this.$router.push({name: 'exerciseList'});
            }
        }
    };
</script>
