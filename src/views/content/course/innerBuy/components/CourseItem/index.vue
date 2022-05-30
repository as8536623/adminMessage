<style scoped lang="scss">
    @import './style.scss';
</style>
<style lang="scss">
    img.course-item__image {
        object-fit: cover;
    }
</style>

<template>
    <div class="course-item" @click="handleBuy">
        <veln-image
            class="course-item__image"
            :src="item.coverUrl"
        />
        <div class="course-item__content">
            <div class="course-item__name">{{ item.name }}</div>
            <div class="course-item__line">
                <div class="course-item__price">
                    <div class="course-item__price__current">￥{{ item.internalPrice }}</div>
                    <div class="course-item__price__original">￥{{ item.price }}</div>
                </div>
                <div class="course-item__count">
                    <svg-icon icon-class="user_f" class-name="course-item__count__icon"/>
                    <span class="course-item__count__num">{{ item.buyCount || 0 }}</span>
                </div>
            </div>
            <div class="course-item__line">
                <span class="course-item__grade">三年级/下学期</span>
                <div class="course-item__buy">购买</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InnerBuyItem',
        props: {
            item: {
                type: Object,
                default() {
                    return {
                        id: '',
                        name: '',
                        price: '',
                        internalPrice: ''
                    };
                }
            }
        },
        data() {
            return {};
        },
        mounted() {
        },
        methods: {
            handleBuy() {
                const routeData = this.$router.resolve({
                    name: 'SubjectInnerBuyDetail',
                    query: {id: this.item.id}
                });
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>
