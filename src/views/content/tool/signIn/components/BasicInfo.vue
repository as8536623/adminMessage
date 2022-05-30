<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail">
        <el-form
            label-width="200px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <!--<span class="sign__edit__btn" @click="edit">{{$t('编辑')}}</span>-->
                <el-form-item :label="$t('编号') + '：'" class="required">
                    {{ data.code }}
                </el-form-item>
                <el-form-item :label="$t('签到标题') + '：'" class="required">
                    {{ data.name }}
                </el-form-item>
                <el-form-item :label="$t('开始时间') + '：'" class="required">
                    {{ data.startTime }}
                </el-form-item>
                <el-form-item :label="$t('有效时长（分钟）') + '：'" class="required">
                    {{ data.duration }}
                </el-form-item>
                <el-form-item v-if="data.coverUrl" :label="$t('封面') + '：'">
                    <div class="course__upload__sec">
                        <img
                            v-if="data.coverUrl"
                            class="course__cover"
                            :src="data.coverUrl"
                            :alt="$t('封面')"
                        >
                    </div>
                </el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    export default {
        name: 'BasicInfo',
        components: {
            VelnFormSection
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {};
        },
        methods: {
            edit() {
                this.$emit('editHandle', 'singInBasicInfo');
            }
        }
    };
</script>
