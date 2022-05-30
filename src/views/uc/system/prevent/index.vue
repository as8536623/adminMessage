<style lang="scss">
    @import "../style";
    @import "./style.scss";
</style>
<template>
    <article class="system-content prevent-content">
        <el-form
            ref="editQuery"
            :model="editQuery"
            :inline-message="true"
            :rules="rules"
        >
            <div class="system__item">
                <el-form-item>
                    <div class="system__title">{{ $t('学习时防作弊设置') }}</div>
                </el-form-item>
                <el-form-item class="el__form-checkbox">
                    <el-checkbox v-model="editQuery.preventHangUp">
                        {{ $t('启用防挂机学习功能（系统检测到学员疑似挂机后，会弹出是否在线的弹框，检查学员是否挂机）') }}
                    </el-checkbox>
                </el-form-item>
                <el-form-item prop="confirmOnlineCycle">
                    {{ $t('学员在学习知识时，系统在') }}
                    <el-input v-model.number="editQuery.confirmOnlineCycle" type="text"/>
                    {{ $t('分钟确认学员是否在线') }}
                </el-form-item>
                <el-form-item>
                    <div class="system__label">{{ $t('确认学员是否在线提示语') + '：' }}</div>
                    <el-input
                        v-model="editQuery.confirmMsg"
                        type="textarea"
                        :place-holder="placeHolder"
                        :rows="5"
                    />
                </el-form-item>
                <el-form-item class="el__form-checkbox">
                    <el-checkbox v-model="editQuery.preventConcurrentStudy">
                        {{ $t('启用防多知识同时学习功能（同一时间只对一个知识记录学习进度及学分，防止学习者同时打开多个知识学习而获得学习进度及学分）') }}
                    </el-checkbox>
                </el-form-item>
            </div>
            <div class="system__item">
                <el-form-item>
                    <div class="system__title">{{ $t('防录屏设置') }}</div>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="editQuery.preventRecording">{{ $t('启用防录屏模式') }}</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="editQuery.preventRecordingScreenModel">
                        <div class="el__item-radio">
                            <el-radio label="BARRAGE">{{ $t('登录者的账号相关信息会以弹幕当时在播放区随机滚动') }}</el-radio>
                        </div>
                        <div>
                            <el-radio label="WATERMARK">{{ $t('登录者的账号相关信息会以水印的方式展示在播放区') }}</el-radio>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="editQuery.customWater">{{ $t('自定义水印或者弹幕的内容') }}</el-checkbox>
                </el-form-item>
                <el-form-item class="el__form-input">
                    {{ $t('姓名（账号）+ 部门 + 换行') }}
                    <el-input v-model="editQuery.customWatermark" type="text"/>
                </el-form-item>
            </div>
            <div class="system__btn">
                <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
            </div>
        </el-form>
    </article>
</template>
<script>
    import {corpConfig, editCorpConfig} from '@/api/system/corpConfig';
    import {validateInteger} from '@/utils/validate';

    export default {
        name: 'PreventSetting',
        data() {
            return {
                editQuery: {
                    preventHangUp: '',
                    preventConcurrentStudy: '',
                    confirmOnlineCycle: '',
                    confirmMsg: '',
                    preventRecording: false,
                    preventRecordingScreenModel: '',
                    customWatermark: '',
                    customWater: false,
                    id: '',
                    editType: 'PREVENT_SETTING'
                },
                placeHolder: this.$t('亲，您在学吗？学习计时中，请不要走开哦，点击“我在”继续学习，否则我们认为您已临时走开，在您离开的这段时间我们不会计入您的学习时间及相应学分。'),
                rules: {
                    confirmOnlineCycle: [
                        {validator: validateInteger, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
            this.corpConfig();
        },
        methods: {
            save() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        editCorpConfig(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            corpConfig() {
                corpConfig().then(res => {
                    const result = res.data;
                    if (result.success) {
                        const data = result.data;
                        this.editQuery = Object.assign({}, this.editQuery, data);
                        data.preventRecordingScreenModel ? this.editQuery.preventRecording = true : null;
                        data.customWatermark ? this.editQuery.customWater = true : null;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
