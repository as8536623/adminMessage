<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="veln__upload__item">
        <div v-if="!section.srcId" class="course__paragraph--empty" @click="select">
            <svg-icon icon-class="fold_o" class-name="course__paragraph--empty__icon"/>
            <div class="course__paragraph--empty__text">{{ $t('选择关联文件') }}</div>
        </div>
        <div v-if="section.srcId" class="course__paragraph__file">
            <div class="course__file__icon" :data-type="section.srcType"/>
            <div class="course__file__info">
                <div class="course__file__name">{{ section.srcName }}</div>
                <!-- <div class="course__file__created">{{section.srcCreated}}</div> -->
                <div class="course__file__bottom">
                    <span class="course__file__length">{{ transformSize(section) }}</span>
                    <el-button
                        class="course__file__del pull-right"
                        type="text"
                        @click="delFile"
                    >{{ $t('删除') }}</el-button>
                </div>
            </div>
        </div>
        <slot/>
    </div>
</template>

<script>
    import {calFileSize} from '@/utils';
    import {transformSecondToMS} from '@/utils/time';

    export default {
        name: '',
        props: {
            section: {
                type: Object,
                default: () => {
                    return {
                        srcId: '',
                        srcType: '',
                        srcName: '',
                        srcSize: ''
                    };
                }
            }
        },
        mounted() {},
        methods: {
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
            select() {
                this.$emit('select');
            },
            delFile() {
                this.$emit('delete');
            }
        }
    };
</script>
