<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="app-container survey__edit">
        <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
            <el-form-item :label="$t('编号') + '：'" prop="code">{{ editQuery.code }}</el-form-item>
            <el-form-item :label="$t('项目名称') + '：'" prop="name">{{ editQuery.name }}</el-form-item>
            <el-form-item :label="$t('项目开始时间') + '：'" prop="startAt">{{ editQuery.startAt }}</el-form-item>
            <el-form-item :label="$t('项目结束时间') + '：'" prop="endAt">{{ editQuery.endAt }}</el-form-item>
            <el-form-item :label="$t('关联问卷') + '：'" prop="templateId">{{ editQuery.templateName }}</el-form-item>
            <el-form-item :label="$t('封面') + '：'" class="survey__upload__line">
                <div class="survey__upload__sec">
                    <img
                        v-if="editQuery.imgUrl"
                        class="survey__cover"
                        :src="editQuery.imgUrl"
                        :alt="$t('封面')"
                    >
                </div>
            </el-form-item>
            <el-form-item :label="$t('设置') + '：'" prop="setting">
                <el-checkbox-group v-model="setting" class="checkbox__group__block" disabled>
                    <el-checkbox
                        v-for="(item, index) in SURVEY_SETTING_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('提醒设置') + '：'" prop="remindType">
                <el-checkbox-group v-model="editQuery.remindType" disabled>
                    <el-checkbox
                        v-for="(item, index) in REMINDER_ENUM.arr"
                        :key="index"
                        :label="item.code"
                    >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('项目简介') + '：'" prop="description">
                <div v-html="editQuery.introduction"/>
            </el-form-item>
        </el-form>
    </article>
</template>

<script>
/**
 * TODO 关联问卷 交互
 */
    import moment from 'moment';
    import {SURVEY_SETTING_ENUM, REMINDER_ENUM} from '@/enum';
    import {getInfoById} from '@/api/survey/surveyInfo';

    export default {
        name: 'SurveyDetailBase',
        data() {
            return {
                SURVEY_SETTING_ENUM,
                REMINDER_ENUM,
                editQuery: {
                    id: '',
                    source: 'COMMON', // 类型 COMMON | FACE
                    code: '', // 编号
                    name: '', // 名称
                    startAt: moment().format('YYYY-MM-DD HH:mm:ss'), // 开始时间
                    endAt: moment().format('YYYY-MM-DD HH:mm:ss'), // 结束时间
                    templateId: '', // 问卷ID
                    templateName: '', // 问卷名称
                    coverId: '', // 封面ID
                    imgUrl: '', // 封面URL
                    introduction: '', // 介绍
                    anonymous: false, // 匿名
                    remindType: [], // 提醒类型
                    partakeType: [] // 参与方式
                },
                setting: []
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.detail(this.$route.query.id);
            }
        },
        methods: {
            // 编辑回显
            detail(id) {
                getInfoById(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const _data = Object.assign({}, result.data);
                        const setting = _data.partakeType.split(',');
                        _data.remindType = _data.remindType.split(',');
                        _data.partakeType = [];
                        if (_data.anonymous) {
                            setting.push('ANONYMITY');
                        }
                        this.editQuery = Object.assign({}, this.editQuery, _data);
                        this.setting = setting;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
