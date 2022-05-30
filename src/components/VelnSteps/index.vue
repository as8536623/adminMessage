<style lang="scss" scoped>
@import './style.scss';
</style>

<template>
    <ul
        class="veln__steps"
        :class="{'left': type==='left','center': type==='center','right': type==='right'}"
    >
        <li
            v-for="(step, index) in data"
            :key="index"
            class="veln__step"
            :class="{'done': step.status === 'done'}"
        >
            <div
                class="veln__step__item"
                :class="{'disabled': step.disabled, 'active': activeStep===index}"
                @click="change(index, step)"
            >
                <svg-icon
                    v-if="activeStep===index"
                    icon-class="editing"
                    class-name="veln__step__icon"
                />
                <svg-icon
                    v-else-if="step.status === 'done'"
                    icon-class="done"
                    class-name="veln__step__icon"
                />
                <svg-icon v-else icon-class="unedit" class-name="veln__step__icon"/>
                <span class="veln__step__title">{{ step.title }}</span>
            </div>
            <svg-icon icon-class="point" class-name="veln__step__point"/>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'VelnSteps',
        props: {
            type: {
                type: String,
                default: 'left' // left/center/right
            },
            data: {
                type: Array,
                default: () => {
                    return [
                        {
                            title: '步骤一',
                            status: 'done',
                            disabled: false
                        },
                        {
                            title: '步骤二',
                            status: 'wait',
                            disabled: true
                        }
                    ];
                }
            },
            active: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                activeStep: this.active
            };
        },
        watch: {
            active: {
                handler(val) {
                    this.activeStep = val;
                },
                immediate: true
            }
        },
        methods: {
            change(index, step) {
                if (step.disabled) {
                    return;
                }
                this.activeStep = index;
                this.$emit('change', index);
            }
        }
    };
</script>

