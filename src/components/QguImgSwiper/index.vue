<style lang="scss" scoped>
    @import './style.scss';
</style>

<template>
    <article class="qgu__img__swiper">
        <div class="qgu__img__swiper__shadow" @click="handleClose"/>
        <section class="qgu__img__swiper__container">
            <div class="close" @click="handleClose">
                <svg-icon icon-class="close"/>
            </div>
            <div class="left" :class="{'disabled': active === 0}" @click="handlePrev">
                <svg-icon icon-class="prev" class-name="prev"/>
            </div>
            <div class="right" :class="{'disabled': active === list.length - 1}" @click="handleNext">
                <svg-icon icon-class="next" class-name="next"/>
            </div>
            <div class="main__img">
                <div
                    class="main__img__i"
                    :style="{backgroundImage: 'url('+ list[active].fileUrl +')'}"
                />
            </div>
            <div class="main__preview__line">
                <div
                    v-for="(item, index) in list"
                    :key="index"
                    class="main__preview"
                    :class="{'active': active === index}"
                    @click="handleSelect(index)"
                >
                    <div
                        class="main__preview__i"
                        :style="{backgroundImage: 'url('+ item.fileUrl +')'}"
                    />
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    export default {
        name: 'QguImgSwiper',
        props: {
            list: {
                type: Array,
                default: null
            }
        },
        data() {
            return {
                active: 0
            };
        },
        methods: {
            handleClose() {
                this.$emit('close');
            },
            handleSelect(index) {
                this.active = index;
            },
            handlePrev() {
                this.active && this.active--;
            },
            handleNext() {
                if (this.active < (this.list.length - 1)) {
                    this.active++;
                }
            }
        }
    };
</script>
