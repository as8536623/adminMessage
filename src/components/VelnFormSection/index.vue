<style lang="scss" scoped>
@import './style';
</style>

<template>
    <section class="form__section">
        <div
            v-if="canExpand"
            class="form__section__arrow"
            :class="{'collapse': type === 'COLLAPSE'}"
            @click="triggerExpand"
        >
            <svg-icon icon-class="arrow"/>
        </div>
        <div
            v-if="titleShow"
            class="form__section__title"
            :class="{'expand': canExpand}"
            @click="triggerExpand"
        >
            <span>{{ title }}</span>
            <slot name="option"/>
        </div>
        <div
            ref="container"
            class="form__section__container"
            :style="{'height': type === 'COLLAPSE' ? 0 : height}"
            :class="{'collapse': type === 'COLLAPSE'}"
        >
            <slot/>
        </div>
    </section>
</template>

<script>
    import i18n from '@/lang';

    export default {
        name: 'VelnFormSection',
        props: {
            title: {
                type: String,
                default: i18n.t('标题')
            },
            titleShow: {
                type: Boolean,
                default: true
            },
            canExpand: {
                type: Boolean,
                default: true
            },
            expand: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                type: 'EXPAND',
                height: ''
            };
        },
        mounted() {
            if (this.canExpand) {
                this.checkHeight();
            }
        },
        methods: {
            triggerExpand() {
                if (!this.canExpand) {
                    return;
                }
                this.type = this.type === 'EXPAND' ? 'COLLAPSE' : 'EXPAND';
            },
            checkHeight() {
                const $containerEl = this.$refs.container;
                this.height = `${$containerEl.getBoundingClientRect().height}px`;
                this.type = this.expand ? 'EXPAND' : 'COLLAPSE';
            }
        }
    };
</script>
