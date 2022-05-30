<style lang="scss" scoped>
@import '../style';
</style>
<template>
    <article class="app-container face-edit-container">
        <veln-form-section :title="$t('课程安排')" :can-expand="false">
            <!--<veln-steps :data="steps" :active="active" @change="stepChange"></veln-steps>-->
            <veln-course-plan
                v-for="(item, index) in editQuery.courseItemList"
                :key="index"
                ref="plan"
                :data="item"
                :index="index"
                @del="delItem"
            />
            <section style="padding-left: 160px">
                <el-button class="plan__add__btn" size="small" @click="addItem">+ {{ $t('添加小节') }}</el-button>
                <section class="plan__btn__list">
                    <el-button @click="cancel">{{ $t('取消') }}</el-button>
                    <!--<el-button @click="last">{{$t('上一步')}}</el-button>-->
                    <el-button type="primary" @click="next">{{ $t('完成') }}</el-button>
                </section>
            </section>
        </veln-form-section>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnCoursePlan from './components/VelnCoursePlan';
    import {content} from '@/api/faceCourse';
    import {courseItemsDetail} from '@/api/courseItems';
    export default {
        name: 'CoursePlan',
        components: {
            VelnFormSection,
            VelnCoursePlan
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
                    status: 'wait',
                    disabled: true
                }
            // ,
            // {
            //     title: this.$t('现场互动（可不添加）'),
            //     status: 'wait',
            //     disabled: true
            // }
            ];
            return {
                steps,
                active: 2,
                editQuery: {
                    courseItemList: [],
                    id: this.$route.query.id
                }
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.editQuery.id) {
                    this.detail(this.$route.query.id);
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                } else {
                    this.addItem(true);
                }
            },
            // 编辑回显
            detail(id) {
                const params = {id};
                courseItemsDetail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.courseItemList = result.data
                            ? result.data
                            : [];
                        if (
                            !this.editQuery.courseItemList ||
                            this.editQuery.courseItemList.length === 0
                        ) {
                            this.addItem(true);
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            addItem(flag) {
                const data = {
                    name: '',
                    startTime: '',
                    endTime: '',
                    teachingLocations: '',
                    longitude: '',
                    latitude: '',
                    lecturer: '',
                    lectureList: []
                };
                if (flag) {
                    this.editQuery.courseItemList.push(data);
                } else {
                    if (this.planFormValidate()) {
                        this.editQuery.courseItemList.push(data);
                    }
                }
            },
            delItem(index) {
                this.editQuery.courseItemList.splice(index, 1);
            },
            planFormValidate() {
                if (!this.$refs.plan) {
                    return false;
                }
                for (let i = 0; i < this.$refs.plan.length; i++) {
                    if (!this.$refs.plan[i].formValidate()) {
                        this.$warnMsg(this.$t('请完善信息'));
                        return false;
                    }
                }
                return true;
            },
            cancel() {
                this.$router.push({name: 'faceCourseList'});
            },
            next() {
                if (this.planFormValidate()) {
                    if (this.$store.getters.ajaxIng) {
                        return;
                    }
                    this.$store.dispatch('setAjaxIng', true);
                    content(this.editQuery).then(res => {
                        this.$store.dispatch('setAjaxIng', false);
                        const result = res.data;
                        if (result.success) {
                            this.$successMsg(this.$t('保存成功'));
                            // this.$router.push({
                            //     name: 'courseInteraction',
                            //     query: { id: this.$route.query.id }
                            // });
                            this.cancel();
                        } else {
                            this.$errorMsg(result.msg || this.$t('保存失败'));
                        }
                    });
                }
            },
            last() {
                this.$router.push({
                    name: 'courseParticipants',
                    query: {id: this.$route.query.id}
                });
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
                            query: {id: this.$route.query.id}
                        });
                        break;
                    case 3:
                        this.$router.push({
                            name: 'courseInteraction',
                            query: {id: this.$route.query.id}
                        });
                        break;
                }
            }
        }
    };
</script>
