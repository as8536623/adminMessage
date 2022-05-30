<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <div ref="line" class="veln__audio__player__wrapper">
        <div class="veln__audio__player__progress" :style="{'width': width}">
            <div ref="bar" class="veln__audio__player__bar"/>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'VideoProgress',
        props: {
            progress: {
                type: [Number, String],
                default: 10
            }
        },
        data() {
            return {
                width: `${this.progress}%`,
                isKeyUp: false,
                line: '',
                bar: '',
                percent: 0
            };
        },
        mounted() {
            this.init();
        },
        beforeDestroy() {
            this.unbindEvents();
        },
        methods: {
            unbindEvents() {
                this.line && this.line.removeEventListener('mousedown', this.lineClick);
                this.bar && this.bar.removeEventListener('mousedown', this.start);
                window.removeEventListener('mousemove', this.move);
                window.removeEventListener('mouseup', this.end);
            },
            init() {
                this.bar = this.$refs.bar;
                this.line = this.$refs.line;
                // 鼠标按下方块 滑动
                this.bar.addEventListener('mousedown', this.start);
                // 点击进度条快进
                this.line.addEventListener('mousedown', this.lineClick);
            },
            lineClick(e) {
                const x = e.pageX;
                const lineLeft = this.getPosition(this.line).left; // 长线条的横坐标
                const barLeft = x - lineLeft; // 小方块相对于父元素（长线条）的left值
                this.percent = parseInt((barLeft / (this.line.offsetWidth)) * 100);
                this.width = `${this.percent}%`;
                this.$emit('slide', this.percent);
            },
            start(e) {
                e.stopPropagation();
                this.isKeyUp = true;
                this.$emit('start');
                // 拖动
                window.addEventListener('mousemove', this.move);
                // 当监听到鼠标松开的时候，移除mousemove事件
                window.addEventListener('mouseup', this.end);
            },
            move(e) {
                if (this.isKeyUp) {
                    const x = e.pageX;
                    const lineLeft = this.getPosition(this.line).left; // 长线条的横坐标
                    let barLeft = x - lineLeft; // 小方块相对于父元素（长线条）的left值
                    if (barLeft >= this.line.offsetWidth) {
                        barLeft = this.line.offsetWidth;
                    }
                    if (barLeft < 0) {
                        barLeft = 0;
                    }
                    this.percent = parseInt((barLeft / (this.line.offsetWidth)) * 100);
                    this.width = this.percent + '%';
                }
            },
            end() {
                this.isKeyUp = false;
                this.$emit('slide', this.percent);
            },
            // 获取元素的绝对位置
            getPosition(node) {
                let left = node.offsetLeft; // 获取元素相对于其父元素的left值var left
                let current = node.offsetParent; // 取得元素的offsetParent
                // 一直循环直到根元素
                while (current != null) {
                    left += current.offsetLeft;
                    current = current.offsetParent;
                }
                return {
                    'left': left
                };
            }
        }
    };
</script>
