<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="veln__upload__item">
        <div v-if="section.fileId" class="course__paragraph__file">
            <div class="course__file__icon" :data-type="section.type"/>
            <div class="course__file__info">
                <div class="course__file__name">{{ section.name }}</div>
                <div class="course__file__bottom">
                    <span class="course__file__length">{{ section.size }}</span>
                    <el-button
                        class="course__file__del pull-right"
                        type="text"
                        @click="delFile"
                    >{{ $t('删除') }}
                    </el-button>
                </div>
            </div>
        </div>
        <slot/>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            section: {
                type: Object,
                default: () => {
                    return {
                        fileId: '',
                        type: '',
                        name: '',
                        size: ''
                    };
                }
            },
            // 视频/音频当前index
            index: {
                type: Number,
                default: 0
            },
            // 父当前index
            pIndex: {
                type: Number,
                default: 0
            }
        },
        mounted() {
        },
        methods: {
            delFile() {
                this.$emit('delete', this.index, this.section.type, this.pIndex);
            }
        }
    };
</script>
