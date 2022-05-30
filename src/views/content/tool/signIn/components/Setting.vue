<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail">
        <el-form
            label-width="140px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('签到设置')" :can-expand="false">
                <!--<span class="sign__edit__btn" @click="edit">{{$t('编辑')}}</span>-->
                <el-form-item :label="$t('签到设置') + '：'">
                    <el-form class="tool__sign__form" label-width="140px">
                        <el-form-item :label="$t('防作弊') + '：'">
                            <el-checkbox-group v-model="data.antiFakeType" disabled>
                                <el-checkbox
                                    v-for="item in ANTIFAKE_TYPE_ENUM.arr"
                                    :key="item.code"
                                    :label="item.code"
                                >{{ $t(item.name) }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <!--                        <el-form-item :label="$t('签到成功提示语') + '：'">-->
                        <!--                            {{data.markedWords ? data.markedWords : '&#45;&#45;'}}-->
                        <!--                        </el-form-item>-->
                    </el-form>
                </el-form-item>
                <el-form-item :label="$t('提醒方式') + '：'">
                    <el-checkbox-group v-model="data.remindType" disabled>
                        <el-checkbox
                            v-for="item in REMINDER_ENUM.arr"
                            :key="item.code"
                            :label="item.code"
                        >{{ $t(item.name) }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </veln-form-section>
        </el-form>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {REMINDER_ENUM, ANTIFAKE_TYPE_ENUM} from '@/enum';
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
            }
        },
        data() {
            return {
                REMINDER_ENUM,
                ANTIFAKE_TYPE_ENUM
            };
        },
        methods: {
            edit() {
                this.$emit('editHandle', 'signInSetting');
            }
        }
    };
</script>
