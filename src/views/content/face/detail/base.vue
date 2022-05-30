<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail">
        <el-form
            label-width="140px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <!--<span class="sign__edit__btn" @click="edit">{{$t('编辑')}}</span>-->
                <el-form-item :label="$t('项目编号') + '：'" class="required">
                    {{ data.code }}
                </el-form-item>
                <el-form-item :label="$t('项目名称') + '：'" class="required">
                    {{ data.name }}
                </el-form-item>
                <el-form-item :label="$t('学时') + '：'" class="required">
                    {{ data.period }}
                </el-form-item>
                <el-form-item :label="$t('学分') + '：'" class="required">
                    {{ data.score }}
                </el-form-item>
                <el-form-item :label="$t('项目时间') + '：'" class="required">
                    {{ data.startTime + '~' + data.endTime }}
                </el-form-item>
                <section v-for="(item, index) in data.customFormList" :key="index">
                    <el-form-item
                        v-if="item.type !== 'RADIO'"
                        :label="$t(item.columnName) + '：'"
                        :class="{'required' : item.required}"
                    >
                        {{ item.columnValue ? item.columnValue : '--' }}
                    </el-form-item>
                    <el-form-item v-else :label="$t(item.columnName) + '：'" :class="{'required' : item.required}">
                        <el-radio-group v-if="item.columnValue" v-model="item.fillValue">
                            <el-radio
                                v-for="(rItem, rIndex) in item.columnValue.split(/[，]|,/)"
                                :key="rIndex"
                                :label="rItem"
                                disabled
                            >{{ rItem }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </section>
                <el-form-item :label="$t('项目标签') + '：'">
                    <el-tag v-for="(item, index) in data.tagList" :key="index" type="success">{{ item }}</el-tag>
                    {{ !data.tagList || !data.tagList.length ? '--' : '' }}
                </el-form-item>
                <el-form-item v-if="data.coverUrl" :label="$t('项目封面') + '：'">
                    <div class="course__upload__sec">
                        <img
                            v-if="data.coverUrl"
                            class="course__cover"
                            :src="data.coverUrl"
                            :alt="$t('封面')"
                        >
                    </div>
                </el-form-item>
                <el-form-item :label="$t('详情描述') + '：'">
                    <section class="sign__description" v-html="data.description"/>
                    {{ !data.description ? '--' : '' }}
                </el-form-item>
                <el-form-item :label="$t('关联证书') + '：'">
                    <el-tag v-if="data.certName" type="success">{{ data.certName }}</el-tag>
                    {{ !data.certName ? '--' : '' }}
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
    import {REMINDER_ENUM} from '@/enum';
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
            return {
                REMINDER_ENUM
            };
        },
        methods: {
            edit() {
                this.$emit('editHandle', 'courseBaseInfo');
            }
        }
    };
</script>
