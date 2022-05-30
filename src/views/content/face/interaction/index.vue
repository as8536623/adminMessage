<style lang="scss" src="../style.scss">
</style>
<template>
    <article class="app-container face-edit-container interaction__container">
        <veln-form-section :title="$t('现场互动')" :can-expand="false">
            <section class="interaction__content">
                <section v-if="activity.length" class="interaction__left">
                    <div
                        v-for="(item, index) in activity"
                        :key="index"
                        class="interaction__item"
                        @click="edit(item)"
                    >
                        <div :class="item.relId ? 'active interaction' : 'interaction'">
                            <svg-icon class-name="tool__icon" :icon-class="item.type"/>
                            {{ item.title }}
                            <svg-icon class-name="add__icon" icon-class="add_i"/>
                        </div>
                    </div>
                </section>
                <section class="interaction__right">
                    <el-form ref="editQuery" :model="editQuery" label-width="50px">
                        <div v-for="(item, index) in editQuery.activityList" :key="index" class="interaction__item">
                            <div class="interaction">
                                <div v-if="item.relType == 'SIGN'" class="activity">
                                    <svg-icon class-name="tool__icon" icon-class="sign"/>
                                    {{ $t('签到') }}
                                </div>
                                <div v-if="item.relType == 'WORK'" class="activity">
                                    <svg-icon class-name="tool__icon" icon-class="work"/>
                                    {{ $t('作业') }}
                                </div>
                                <div v-if="item.relType == 'ENROLL'" class="activity">
                                    <svg-icon class-name="tool__icon" icon-class="signUp"/>
                                    {{ $t('活动') }}
                                </div>
                                <div v-if="item.relType == 'PE'" class="activity">
                                    <svg-icon class-name="tool__icon" icon-class="exam"/>
                                    {{ $t('考试') }}
                                </div>
                                <div class="name text-hide">{{ $t(item.name) }}</div>
                                <div v-if="item.relType === 'SIGN'" class="time text-hide">
                                    {{ item.startTime }}
                                </div>
                                <div v-if="item.relType != 'SIGN'" class="time text-hide">
                                    {{ item.startTime }}~{{ item.endTime }}
                                </div>
                                <div class="btn">
                                    <!--<span class="btn__item">-->
                                    <!--<svg-icon class-name="btn__icon" icon-class="view"></svg-icon>-->
                                    <!--{{$t('预览')}}-->
                                    <!--</span>-->
                                    <!--<span class="btn__item"-->
                                    <!--v-if="item.status == 'DRAFT' || item.status == 'NOT_STARTED'"-->
                                    <!--@click="edit(item)">-->
                                    <!--<svg-icon class-name="btn__icon" icon-class="edit"></svg-icon>-->
                                    <!--{{$t('编辑')}}-->
                                    <!--</span>-->
                                    <!--<span class="btn__item"-->
                                    <!--v-if="item.status == 'DRAFT'  || item.status == 'NOT_STARTED'"-->
                                    <!--@click="delActivity(item.id)">-->
                                    <!--<svg-icon class-name="btn__icon" icon-class="del"></svg-icon>-->
                                    <!--{{$t('删除')}}-->
                                    <!--</span>-->
                                    <!--<span class="btn__item" v-if="item.status == 'FINISHED'" @click="view(item)">-->
                                    <!--<svg-icon class-name="btn__icon" icon-class="view"></svg-icon>-->
                                    <!--{{$t('查看')}}-->
                                    <!--</span>-->
                                </div>
                            </div>
                            <div class="gold">
                                <el-form-item
                                    :label="$t('')"
                                    :prop="'activityList[' + index + '].rewardNum'"
                                    :rules="[{
                                        type: 'number', message: $t('能量石必须为数字值')
                                    }, {
                                        validator: validateInteger, trigger: 'blur'
                                    }]"
                                >
                                    <el-input
                                        v-model.number="editQuery.activityList[index].rewardNum"
                                        type="text"
                                    />
                                    {{ $t('个能量石') }}
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                    <section class="interaction__btn">
                        <el-button @click="cancel">{{ $t('取消') }}</el-button>
                        <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
                    </section>
                </section>
            </section>
        </veln-form-section>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {listAll, activitySave, activityDelete, unFinish} from '@/api/activity';
    import {getAppCodes} from '@/api/system/csFeign';
    import {validateInteger} from '@/utils/validate';

    export default {
        name: 'QuickInteraction',
        components: {
            VelnFormSection
        },
        data() {
            const activity = [
                // {
                //     id: null,
                //     relType: 'SIGN',
                //     type: 'sign',
                //     title: this.$t('签到')
                // },
                // {
                //     id: null,
                //     relType: 'ENROLL',
                //     type: 'signUp',
                //     title: this.$t('活动')
                // },
                // {
                //     id: null,
                //     relType: 'WORK',
                //     type: 'work',
                //     title: this.$t('作业')
                // },
                // {
                //     id: null,
                //     relType: 'PE',
                //     type: 'exam',
                //     title: this.$t('考试')
                // }
            ];
            return {
                validateInteger,
                activity,
                active: 2,
                editQuery: {
                    id: this.$route.query.id || this.$store.getters.temporaryId,
                    activityList: []
                }
            };
        },
        created() {
            this.init();
            this.getAppCodes();
            this.listAll();
            this.unFinish();
        },
        methods: {
            init() {
                this.$store.dispatch('setTemporaryId', this.$route.query.id);
            },
            // 获取公司应用
            getAppCodes() {
                getAppCodes().then(res => {
                    const result = res.data;
                    if (result.length) {
                        this.activityHandle(result);
                    }
                });
            },
            activityHandle(list) {
                if (list.includes('veln-sign')) {
                    const data = {
                        id: null,
                        relType: 'SIGN',
                        type: 'sign',
                        title: this.$t('签到')
                    };
                    this.activity.push(data);
                }
                if (list.includes('veln-enroll')) {
                    const data = {
                        id: null,
                        relType: 'ENROLL',
                        type: 'signUp',
                        title: this.$t('活动')
                    };
                    this.activity.push(data);
                }
                if (list.includes('veln-work')) {
                    const data = {
                        id: null,
                        relType: 'WORK',
                        type: 'work',
                        title: this.$t('作业')
                    };
                    this.activity.push(data);
                }
                if (list.includes('veln-pe')) {
                    const data = {
                        id: null,
                        relType: 'PE',
                        type: 'exam',
                        title: this.$t('考试')
                    };
                    this.activity.push(data);
                }
            },
            last() {
                this.$router.push({
                    name: 'coursePlan',
                    query: {id: this.$route.query.id}
                });
            },
            cancel() {
                this.$router.push({name: 'faceCourseList'});
            },
            unFinish() {
                const params = {faceCourseId: this.editQuery.id};
                unFinish(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        if (result.data) {
                            this.activity.forEach(function(element) {
                                const id = result.data[element.relType.toUpperCase()];
                                if (null !== id || '' !== id) {
                                    element.relId = id;
                                }
                            });
                        }
                    }
                });
            },
            delActivity(id) {
                const params = {id: id};
                activityDelete(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.listAll();
                    } else {
                        this.$errorMsg(result.msg || this.$t('删除失败'));
                    }
                });
            },
            save() {
                this.$refs['editQuery'].validate((valid) => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const params = {activityList: this.editQuery.activityList};
                        activitySave(params).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            edit(item) {
                switch (item.relType) {
                    case 'SIGN':
                        this.$router.push({
                            name: 'faceSignBasic',
                            query: {
                                sourceId: this.editQuery.id,
                                id: item.relId,
                                source: 'FACE',
                                quick: true
                            }
                        });
                        break;
                    case 'ENROLL':
                        this.$router.push({
                            name: 'faceBasicInfo',
                            query: {
                                sourceId: this.editQuery.id,
                                id: item.relId,
                                source: 'FACE',
                                quick: true
                            }
                        });
                        break;
                    case 'WORK':
                        this.$router.push({
                            name: 'faceHomeworkBase',
                            query: {
                                sourceId: this.editQuery.id,
                                id: item.relId,
                                source: 'FACE',
                                quick: true
                            }
                        });
                        break;
                    case 'PE':
                        this.$router.push({
                            name: 'faceExamBase',
                            query: {
                                sourceId: this.editQuery.id,
                                id: item.relId,
                                source: 'FACE',
                                quick: true
                            }
                        });
                        break;
                }
            },
            listAll() {
                const params = {faceCourseId: this.$route.query.id};
                listAll(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.activityList = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取数据异常'));
                    }
                });
            },
            view(item) {
                this.$router.push({
                    name: 'faceCourseCheck',
                    query: {
                        relId: this.$route.query.id,
                        type: item.relType
                    }
                });
            }
        }
    };
</script>
