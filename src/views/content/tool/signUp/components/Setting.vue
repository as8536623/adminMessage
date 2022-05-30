<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail">
        <el-form
            label-width="140px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('报名设置')" :can-expand="false">
                <!--<span class="sign__edit__btn" @click="edit" v-if="source === 'enroll'">{{$t('编辑')}}</span>-->
                <el-form-item :label="$t('报名时间') + '：'" class="required">
                    {{ data.startTime }} ~ {{ data.endTime }}
                </el-form-item>
                <el-form-item :label="$t('名额限制') + '：'" class="required">
                    {{ data.limitNumber + $t('人') }}
                </el-form-item>
                <el-form-item :label="$t('审核设置') + '：'" class="required">
                    <el-radio-group v-model="data.approveType" disabled>
                        <el-radio label="NO_NEED">{{ $t('无需审核') }}</el-radio>
                        <el-radio label="MANUALLY">{{ $t('手动审核') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="source === 'enroll'" :label="$t('提醒方式') + '：'">
                    <el-checkbox-group v-model="data.remindType" disabled>
                        <el-checkbox
                            v-for="item in REMINDER_ENUM.arr"
                            :key="item.code"
                            :label="item.code"
                        >{{ $t(item.name) }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('学员填写信息') + '：'">
                    <el-form class="tool__sign__form">
                        <el-form-item
                            v-for="(item, index) in data.userFormList"
                            :key="index"
                            :label="$t(item.columnName) + '：'"
                        >
                            {{ item.required ? $t('必填') : $t('非必填') }}
                        </el-form-item>
                    </el-form>
                </el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {REMINDER_ENUM} from '@/enum';
    export default {
        name: 'Setting',
        components: {
            VelnFormSection
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                }
            },
            source: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                REMINDER_ENUM
            };
        },
        methods: {
            edit() {
                this.$emit('editHandle', 'signUpSetting');
            }
        }
    };
</script>
