<style lang="scss" scoped src="./style.scss">
</style>

<template>
    <article class="sign__container__detail">
        <el-form
            label-width="140px"
            :inline-message="true"
        >
            <el-form-item :label="$t('项目编号') + '：'" class="required">
                {{ data.code }}
            </el-form-item>
            <el-form-item :label="$t('项目名称') + '：'" class="required">
                {{ data.name }}
            </el-form-item>
            <el-form-item :label="$t('项目标签') + '：'">
                <el-tag v-for="(item, index) in data.labels" :key="index" type="success">{{ item }}</el-tag>
                {{ !data.labels || !data.labels.length ? '--' : '' }}
            </el-form-item>
            <el-form-item v-if="data.type==='TIME_LIMIT'" :label="$t('项目时间') + '：'" class="required">
                {{ (!data.startAt ? '--': data.startAt) + ' 至 ' + (!data.endAt ? '--': data.endAt) }}
            </el-form-item>
            <el-form-item :label="$t('项目封面') + '：'">
                {{ !data.coverUrl ? '--' : '' }}
                <div v-if="data.coverUrl" class="course__upload__sec">
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
                    >{{ $t(item.name) }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import {REMINDER_ENUM} from '@/enum';

    export default {
        name: 'Basic',
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
                this.$emit('editHandle', 'projectBasic');
            }
        }
    };
</script>
