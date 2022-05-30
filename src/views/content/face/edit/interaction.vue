<style lang="scss">
@import '../style';
</style>
<template>
    <article class="app-container face-edit-container interaction__container">
        <veln-form-section :title="$t('现场互动')" :can-expand="false">
            <veln-steps :data="steps" :active="active" @change="stepChange"/>
            <section class="interaction__content">
                <section class="interaction__left">
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
                        <div
                            v-for="(item, index) in editQuery.activityList"
                            :key="index"
                            class="interaction__item"
                        >
                            <div class="interaction">
                                <div v-if="item.relType === 'SIGN'" class="activity">
                                    <svg-icon class-name="tool__icon" icon-class="sign"/>
                                    {{ $t('签到') }}
                                </div>
                                <div v-if="item.relType === 'ENROLL'" class="activity">
                                    <svg-icon class-name="tool__icon" icon-class="signUp"/>
                                    {{ $t('活动') }}
                                </div>
                                <div v-if="item.relType === 'WORK'" class="activity">
                                    <svg-icon class-name="tool__icon" icon-class="work"/>
                                    {{ $t('作业') }}
                                </div>
                                <div v-if="item.relType == 'PE'" class="activity">
                                    <svg-icon class-name="tool__icon" icon-class="exam"/>
                                    {{ $t('考试') }}
                                </div>
                                <div class="name text-hide">{{ item.name }}</div>
                                <div
                                    v-if="item.relType === 'SIGN'"
                                    class="time text-hide"
                                >{{ item.startTime }}</div>
                                <div
                                    v-if="item.relType != 'SIGN'"
                                    class="time text-hide"
                                >{{ item.startTime }}~{{ item.endTime }}</div>
                                <div class="btn">
                                    <!--<span class="btn__item" @click="view(item)">-->
                                    <!--<svg-icon class-name="btn__icon" icon-class="view"></svg-icon>-->
                                    <!--{{$t('预览')}}-->
                                    <!--</span>-->
                                    <!--<span
                                        class="btn__item"
                                        v-if="item.status == 'DRAFT' || item.status == 'NOT_STARTED'"
                                        @click="edit(item)"
                                    >
                                        <svg-icon class-name="btn__icon" icon-class="edit"></svg-icon>
                                        {{$t('编辑')}}
                                    </span>
                                    <span
                                        class="btn__item"
                                        v-if="item.status == 'DRAFT'  || item.status == 'NOT_STARTED'"
                                        @click="delActivity(item.id)"
                                    >
                                        <svg-icon class-name="btn__icon" icon-class="del"></svg-icon>
                                        {{$t('删除')}}
                                    </span>
                                    <span
                                        class="btn__item"
                                        v-if="item.status == 'FINISHED'"
                                        @click="view(item)"
                                    >
                                        <svg-icon class-name="btn__icon" icon-class="view"></svg-icon>
                                        {{$t('查看')}}
                                    </span>-->
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
                                    <el-input v-model.number="item.rewardNum" type="text"/>
                                    {{ $t('个能量石') }}
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                    <section class="interaction__btn">
                        <el-button @click="cancel">{{ $t('取消') }}</el-button>
                        <el-button @click="last">{{ $t('上一步') }}</el-button>
                        <el-button type="primary" @click="sure">{{ $t('完成') }}</el-button>
                    </section>
                </section>
            </section>
        </veln-form-section>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnSteps from '@/components/VelnSteps';
    import {
        listAll,
        activitySave,
        activityDelete,
        unFinish
    } from '@/api/activity';
    import {validateInteger} from '@/utils/validate';
    export default {
        name: 'CourseInteraction',
        components: {
            VelnFormSection,
            VelnSteps
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: true
                },
                {
                    title: this.$t('面授安排'),
                    status: 'done',
                    disabled: false
                }
            // ,
            // {
            //     title: this.$t('现场互动（可不添加）'),
            //     status: 'wait',
            //     disabled: true
            // }
            ];
            const activity = [
                {
                    id: null,
                    relType: 'SIGN',
                    type: 'sign',
                    title: this.$t('签到')
                },
                {
                    id: null,
                    relType: 'ENROLL',
                    type: 'signUp',
                    title: this.$t('活动')
                },
                {
                    id: null,
                    relType: 'WORK',
                    type: 'work',
                    title: this.$t('作业')
                },
                {
                    id: null,
                    relType: 'PE',
                    type: 'exam',
                    title: this.$t('考试')
                }
            ];
            return {
                validateInteger,
                steps,
                activity,
                active: 3,
                editQuery: {
                    id: this.$route.query.id || this.$store.getters.temporaryId,
                    activityList: []
                }
            };
        },
        created() {
            this.init();
            this.listAll();
            this.unFinish();
        },
        methods: {
            init() {
                if (this.editQuery.id) {
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                    this.$store.dispatch('setTemporaryId', this.editQuery.id);
                }
            },
            last() {
                this.$router.push({
                    name: 'coursePlan',
                    query: {id: this.$route.query.id}
                });
            },
            next() {
                this.$router.push({
                    name: 'courseParticipants',
                    query: {id: this.$route.query.id}
                });
            },
            sure() {
                this.$router.push({name: 'faceCourseList'});
            },
            save() {
                this.$refs['editQuery'].validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const params = {
                            activityList: this.editQuery.activityList
                        };
                        activitySave(params).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.next();
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                        });
                    }
                });
            },
            cancel() {
                this.$router.push({name: 'faceCourseList'});
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.$router.push({
                            name: 'courseBaseInfo',
                            query: {id: this.$route.query.id}
                        });
                        break;
                    case 1:
                        this.$router.push({
                            name: 'courseParticipants',
                            query: {id: this.editQuery.id}
                        });
                        break;
                    case 2:
                        this.$router.push({
                            name: 'coursePlan',
                            query: {id: this.$route.query.id}
                        });
                        break;
                }
            },
            edit(item) {
                switch (item.relType) {
                    case 'SIGN':
                        this.$router.push({
                            name: 'faceSignBasic',
                            query: {
                                sourceId: this.editQuery.id,
                                id: item.relId,
                                source: 'FACE'
                            }
                        });
                        break;
                    case 'ENROLL':
                        this.$router.push({
                            name: 'faceBasicInfo',
                            query: {
                                sourceId: this.editQuery.id,
                                id: item.relId,
                                source: 'FACE'
                            }
                        });
                        break;
                    case 'WORK':
                        this.$router.push({
                            name: 'faceHomeworkBase',
                            query: {
                                sourceId: this.editQuery.id,
                                id: item.relId,
                                source: 'FACE'
                            }
                        });
                        break;
                    case 'PE':
                        this.$router.push({
                            name: 'faceExamBase',
                            query: {
                                sourceId: this.editQuery.id,
                                id: item.relId,
                                source: 'FACE'
                            }
                        });
                        break;
                }
            },
            listAll() {
                const params = {faceCourseId: this.editQuery.id};
                listAll(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.activityList = result.data
                            ? result.data
                            : [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取互动活动异常'));
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
