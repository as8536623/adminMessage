<style lang="scss" src="../style.scss">
</style>
<template>
    <article class="app-container tool-edit-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
        >
            <veln-form-section :title="$t('签到设置')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item :label="$t('签到设置') + '：'">
                        <el-form class="tool__sign__form" label-width="140px">
                            <el-form-item :label="$t('防作弊') + '：'">
                                <el-checkbox-group v-model="antiFakeType">
                                    <el-checkbox
                                        v-for="item in ANTIFAKE_TYPE_ENUM.arr"
                                        :key="item.code"
                                        :label="item.code"
                                    >{{ $t(item.name) }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <!--  <el-form-item :label="$t('签到成功提示语') + '：'">
                                <el-input
                                    type="text"
                                    v-model.trim="editQuery.markedWords"
                                ></el-input>
                            </el-form-item>-->
                        </el-form>
                    </el-form-item>
                    <el-form-item v-if="!editQuery.sourceId" :label="$t('提醒方式') + '：'">
                        <el-checkbox-group v-model="remindType">
                            <el-checkbox
                                v-for="item in REMINDER_ENUM.arr"
                                :key="item.code"
                                :label="item.code"
                            >{{ $t(item.name) }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div class="tool__tip">{{ $t('发布和停用时提醒') }}</div>
                    </el-form-item>
                </section>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button @click="last">{{ $t('上一步') }}</el-button>
                <el-button type="primary" @click="sure">{{ editQuery.sourceId ? $t('完成') : $t('下一步') }}</el-button>
            </section>
        </el-form>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import VelnFormSection from '@/components/VelnFormSection';
    import {
        settingInfoEdit,
        getInfoById
    } from '@/api/signIn';
    import {REMINDER_ENUM, ANTIFAKE_TYPE_ENUM} from '@/enum';

    export default {
        name: 'SignInSetting',
        components: {
            VelnSteps,
            VelnFormSection
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('签到设置'),
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                steps,
                REMINDER_ENUM,
                ANTIFAKE_TYPE_ENUM,
                active: 1,
                editQuery: {
                    remindType: '',
                    antiFakeType: '',
                    markedWords: '',
                    id: this.$route.query.id,
                    sourceId: this.$route.query.sourceId, // 面授课程--签到
                    source: this.$route.query.source, // 面授课程--签到
                    finish: false
                },
                remindType: [],
                antiFakeType: []
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.sourceId) {
                    this.steps.pop();
                    this.editQuery.finish = true;
                }
                if (this.$route.query.id) {
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                    this.getInfoById(this.$route.query.id);
                }
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.last();
                        break;
                    case 2:
                        this.next();
                        break;
                }
            },
            cancel() {
                const sourceId = this.$route.query.sourceId;
                // 返回面授添加互动页面
                if (sourceId) {
                    if (this.$route.query.quick) {
                        this.$router.push({
                            name: 'quickInteraction',
                            query: {id: sourceId}
                        });
                    } else {
                        this.$router.push({name: 'courseInteraction', query: {id: sourceId}});
                    }
                    return;
                }
                this.$router.push({name: 'signIn'});
            },
            sure() {
                this.editQuery.remindType = this.remindType.join(',');
                this.editQuery.antiFakeType = this.antiFakeType.join(',');
                if (this.editQuery.sourceId) {
                    this.editQuery.finish = true;
                }
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                settingInfoEdit(this.editQuery).then(res => {
                    this.$store.dispatch('setAjaxIng', false);
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        // 返回面授添加互动页面
                        if (this.$route.query.sourceId) {
                            this.cancel();
                            return;
                        }
                        this.next();
                    } else {
                        this.$errorMsg(
                            result.msg || this.$t('保存失败')
                        );
                    }
                    this.dialogVisible = false;
                });
            },
            last() {
                const sourceId = this.$route.query.sourceId;
                let name = 'singInBasicInfo';
                if (sourceId) {
                    name = 'faceSignBasic';
                }
                this.$router.push({
                    name,
                    query: {
                        id: this.editQuery.id,
                        sourceId,
                        source: this.editQuery.source
                    }
                });
            },
            next() {
                this.$router.push({name: 'participants', query: {id: this.$route.query.id}});
            },
            // 编辑回显
            getInfoById(id) {
                const params = {id};
                getInfoById(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.remindType = result.data.remindType ? result.data.remindType.split(',') : [];
                        this.antiFakeType = result.data.antiFakeType ? result.data.antiFakeType.split(',') : [];
                        this.editQuery = Object.assign({}, this.editQuery, result.data);
                        this.editQuery.sourceId = this.$route.query.sourceId;
                    } else {
                        this.$errorMsg(
                            result.msg || this.$t('数据查询失败')
                        );
                    }
                });
            }
        }
    };
</script>
