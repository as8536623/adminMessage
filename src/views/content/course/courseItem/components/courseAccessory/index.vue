<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="course__accessory">
        <div class="course__paragraph__upload" @click="upload">
            <div v-if="!course.srcId" class="course__paragraph--empty">
                <svg-icon icon-class="fold_o" class-name="course__paragraph--empty__icon"/>
                <div class="course__paragraph--empty__text">{{ $t('选择关联文件') }}</div>
            </div>
            <div v-if="course.srcId" class="course__paragraph__file">
                <div class="course__file__icon" :data-type="course.srcType"/>
                <div class="course__file__info">
                    <div class="course__file__name">{{ course.srcName }}</div>
                    <div class="course__file__bottom">
                        <span
                            class="course__file__length"
                            :data-size="course.srcSize"
                        >{{ transformSize(course) }}</span>
                        <el-button
                            v-if="type === 'COURSE' && canModifyItem"
                            class="course__file__del pull-right"
                            type="text"
                            @click.stop="deleteFile"
                        >{{ $t('删除') }}
                        </el-button>
                        <el-button
                            v-if="course.convertStatus === 'complete' || course.convertStatus === 'noNeed'"
                            class="course__file__preview pull-right"
                            type="text"
                            @click.stop="previewFile(course)"
                        >{{ $t('预览') }}
                        </el-button>
                        <span v-else class="pull-right resource__transform">{{ $t('资源转换中') }}</span>
                        <el-button
                            v-if="type === 'COURSE' && course.tape && canModifyItem"
                            class="course__file__tape pull-right"
                            type="text"
                            @click.stop="showQrcode(course)"
                        >{{ $t('去录音') }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {transformSecondToMS} from '@/utils/time';

    export default {
        name: 'CourseAccessory',
        props: {
            course: {
                type: Object,
                default() {
                    return {
                        tape: '',
                        srcId: '',
                        srcType: '',
                        srcName: '',
                        srcCreated: '',
                        srcSize: '',
                        viewUrl: ''
                    };
                }
            },
            canModifyItem: {
                type: Boolean,
                default: true
            },
            type: {
                type: String,
                default: 'COURSE'
            }
        },
        mounted() {
        },
        methods: {
            previewFile(course) {
                this.$emit('preview', course);
            },
            deleteFile() {
                this.$emit('delete');
            },
            upload() {
                this.$emit('upload');
            },
            showQrcode() {
                this.$emit('showQrcode');
            },
            transformSize(section) {
                // 如果是音频/视频，length是时长，其他是页数
                if (section.srcType === 'audio' || section.srcType === 'video') {
                    return transformSecondToMS(section.srcSize);
                } else {
                    return `${section.srcSize || 0}页`;
                }
            }
        }
    };
</script>
