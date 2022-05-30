<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail">
        <veln-form-section :title="$t('面授安排')" :can-expand="false">
            <!--<span class="sign__edit__btn" @click="edit">{{$t('编辑')}}</span>-->
            <section v-for="(item, index) in courseItemList" :key="index" class="veln__course__plan">
                <el-form
                    label-width="140px"
                    :inline-message="true"
                    class="veln__plan-form"
                >
                    <el-form-item :label="$t('内容名称') + '：'" class="required">
                        {{ item.name }}
                    </el-form-item>
                    <el-form-item :label="$t('授课时间') + '：'" class="required">
                        {{ item.startTime }} ~ {{ item.endTime }}
                    </el-form-item>
                    <el-form-item :label="$t('授课地点') + '：'">
                        {{ item.teachingLocations ? item.teachingLocations: '--' }}
                    </el-form-item>
                    <el-form-item :label="$t('讲师') + '：'">
                        {{ item.lecturerName ? item.lecturerName: '--' }}
                    </el-form-item>
                    <el-form-item :label="$t('讲义') + '：'">
                        <div class="course__paragraph__upload">
                            <div v-for="(fItem, fIndex) in item.lectureList" :key="fIndex" class="course__paragraph__file">
                                <div class="course__file__icon" :data-type="fItem.srcType"/>
                                <div class="course__file__info">
                                    <div class="course__file__name">{{ $t(fItem.srcName) }}</div>
                                    <div class="course__file__bottom">
                                        <span class="course__file__length">{{ transformSize(fItem) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </section>
        </veln-form-section>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {transformSecondToMS} from '@/utils/time';
    import {courseItemsDetail} from '@/api/courseItems';
    import {calFileSize} from '@/utils';
    export default {
        name: 'Plan',
        components: {
            VelnFormSection
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                courseItemList: []
            };
        },
        created() {
            if (this.id) {
                this.detail(this.id);
            }
        },
        methods: {
            edit() {
                this.$emit('editHandle', 'coursePlan');
            },
            transformSize(section) {
                // 如果是音频/视频，length是时长，其他是页数
                if (section.srcType === 'audio' || section.srcType === 'video') {
                    return transformSecondToMS(section.srcSize);
                } else if (section.srcType === 'image') {
                    return calFileSize(section.srcSize);
                } else {
                    return `${section.srcSize || 0}页`;
                }
            },
            // 编辑回显
            detail(id) {
                const params = {id};
                courseItemsDetail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.courseItemList = result.data;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
