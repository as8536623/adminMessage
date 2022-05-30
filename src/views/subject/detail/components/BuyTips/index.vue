<style scoped lang="scss">
    @import './style.scss';
</style>
<style lang="scss">
    @import './origin.scss';
</style>

<template>
    <div class="buy-tips">
        <div class="buy-tips__title">{{ $t('请付费后学习完整内容') }}</div>
        <div class="buy-tips__course-name">{{ course.courseName }}</div>
        <div class="buy-tips__price">￥{{ course.price }}</div>
        <div class="buy-tips__btns">
            <el-button class="buy-tips__btn" type="primary" @click="sure">{{ $t('立即购买') }}</el-button>
            <el-button class="buy-tips__btn" @click="cancel">{{ $t('继续试学') }}</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BuyTips',
        props: {
            course: {
                type: Object,
                default: () => {
                    return null;
                }
            }
        },
        data() {
            return {};
        },
        mounted() {
        },
        methods: {
            sure() {
                this.$emit('sure');
            },
            cancel() {
                this.$emit('cancel');
            }
        }
    };
</script>
