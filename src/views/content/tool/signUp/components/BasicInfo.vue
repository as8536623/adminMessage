<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail">
        <el-form
            label-width="140px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <!--<span class="sign__edit__btn" @click="edit" v-if="source === 'enroll'">{{$t('编辑')}}</span>-->
                <el-form-item v-if="source === 'enroll'" :label="$t('项目编号') + '：'" class="required">
                    {{ data.code }}
                </el-form-item>
                <el-form-item :label="$t('项目名称') + '：'" class="required">
                    {{ data.name }}
                </el-form-item>
                <el-form-item v-if="source === 'enroll'" :label="$t('项目标签') + '：'">
                    <el-tag v-for="(item, index) in data.tagList" :key="index" type="success">{{ item }}</el-tag>
                </el-form-item>
                <el-form-item v-if="data.coverUrl && source === 'enroll'" :label="$t('项目封面') + '：'">
                    <div class="course__upload__sec">
                        <img
                            v-if="data.coverUrl"
                            class="course__cover"
                            :src="data.coverUrl"
                            :alt="$t('封面')"
                        >
                    </div>
                </el-form-item>
                <el-form-item v-if="source === 'enroll'" :label="$t('项目简介') + '：'">
                    <section class="sign__description" v-html="data.description"/>
                </el-form-item>
                <el-form-item v-if="source === 'enroll'" :label="$t('自定义字段') + '：'">
                    <el-form :inline="true" class="tool__sign__form">
                        <section
                            v-for="(item, index) in data.adminFormList"
                            :key="index"
                        >
                            <el-form-item :label="$t('只读文本框字段名称') + '：'">
                                {{ $t(item.columnName) }}
                            </el-form-item>
                            <el-form-item :label="$t('对应值') + '：'">
                                {{ $t(item.columnName) }}
                                {{ item.columnValue }}
                            </el-form-item>
                        </section>
                    </el-form>
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
            },
            source: {
                type: String,
                default: ''
            }
        },
        data() {
            return {};
        },
        methods: {
            edit() {
                this.$emit('editHandle', 'basicInfo');
            }
        }
    };
</script>
