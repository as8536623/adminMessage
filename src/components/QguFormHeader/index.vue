<style lang="scss">
    .qgu__form__header {
        position: relative;
        border-bottom: 1px solid #DDDDDD;
        overflow: hidden;
        transition: 0.2s;
        .qgu__form__header__arrow {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            color: #009FA8;
        }
    }
</style>

<template>
    <section
        class="qgu__form__header"
        :class="{'show-more': showMore}"
        :style="{'height': showMore ? hideHeight + 'px' : 'auto'}"
    >
        <i
            v-if="hasShowMore && !showMore"
            class="qgu__form__header__arrow el-icon-caret-bottom"
            @click="handleClick"
        />
        <i v-if="hasShowMore && showMore" class="qgu__form__header__arrow el-icon-caret-top" @click="handleClick"/>
        <slot/>
    </section>
</template>

<script>
    export default {
        name: 'Index',
        props: {
            hasShowMore: {
                type: [Boolean],
                default: true
            },
            hideHeight: {
                type: [String, Number],
                default: 50
            }
        },
        data() {
            return {
                showMore: false
            };
        },
        methods: {
            handleClick() {
                this.showMore = !this.showMore;
            }
        }
    };
</script>
