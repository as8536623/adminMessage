<style lang="scss" src="./style.scss">
</style>

<template>
    <div>
        <svg x="0px" y="0px" class="veln__audio__circle" viewBox="0 0 200 200">
            <circle
                class
                :stroke="color"
                opacity=".2 "
                fill="none"
                stroke-width="12"
                cx="100"
                cy="100"
                r="88"
            />
            <circle
                ref="path"
                class="path"
                :stroke="color"
                fill="none"
                stroke-width="12"
                stroke-linecap="round"
                cx="100"
                cy="100"
                r="88"
            />
        </svg>
    </div>
</template>

<script>
    export default {
        name: 'CircleProgress',
        props: {
            progress: {
                type: [String, Number],
                default: 0
            },
            color: {
                type: String,
                default: '#FFFFFF'
            }
        },
        data() {
            return {
                circleEl: null,
                circleElLength: 0
            };
        },
        watch: {
            progress: {
                handler(v) {
                    this.calProgress(v);
                },
                immediate: true,
                deep: true
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.circleEl = this.$refs.path;
                if (!this.circleEl) {
                    return;
                }
                this.circleElLength = 2 * Math.PI * this.circleEl.getAttribute('r');

                this.circleEl.style.strokeDasharray = this.circleElLength;
                this.circleEl.style.strokeDashoffset = this.circleElLength;
                this.calProgress(this.progress);
            },
            calProgress(progress) {
                if (!this.circleEl) {
                    this.init();
                    return;
                }
                const rangeValue = Number(progress);
                this.circleEl.style.strokeDashoffset =
                    this.circleElLength - rangeValue * this.circleElLength;
                this.circleEl.style.transition =
                    'stroke-dashoffset .25s ease-in-out';
            }
        }
    };
</script>
