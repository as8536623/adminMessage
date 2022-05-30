<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <div class="veln__audio__player__voice">
        <svg-icon
            icon-class="audio_voice_c"
            class-name="voice__icon"
        />
        <div class="voice__level">
            <div ref="voiceLine" class="voice__level__wrapper">
                <div class="voice__level__progress" :style="{height: height}">
                    <div ref="voiceBar" class="voice__level__bar"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'VideoVoice',
        props: {
            volume: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                isKeyUp: false,
                line: '',
                bar: '',
                lineHeight: 0,
                height: '',
                volumeVal: this.volume * 100
            };
        },
        watch: {
            volumeVal: {
                handler(val) {
                    this.height = `${val}%`;
                },
                immediate: true
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.bar = this.$refs.voiceBar;
                this.line = this.$refs.voiceLine;
                // 鼠标按下方块 滑动
                this.bar.addEventListener('mousedown', this.start);
                // 点击进度条快进
                this.line.addEventListener('mousedown', this.lineClick);
            },

            lineClick(e) {
                this.lineHeight = this.line.offsetHeight;
                const y = e.pageY;
                const lineTop = this.getPosition(this.line).top;
                const barTop = y - lineTop;
                this.setVolume(barTop);
            },
            start(e) {
                e.stopPropagation();
                this.isKeyUp = true;
                // 拖动
                window.addEventListener('mousemove', this.move);
                // 当监听到鼠标松开的时候，移除mousemove事件
                window.addEventListener('mouseup', this.end);
            },
            move(e) {
                if (this.isKeyUp) {
                    this.lineHeight = this.line.offsetHeight;
                    const y = e.pageY;
                    const lineTop = this.getPosition(this.line).top;
                    let barTop = y - lineTop;
                    if (barTop >= this.lineHeight) {
                        barTop = this.lineHeight;
                    } else if (barTop < 0) {
                        barTop = 0;
                    }
                    this.setVolume(barTop);
                }
            },
            end() {
                this.isKeyUp = false;
            },
            // 获取元素的绝对位置
            getPosition(node) {
                let top = node.offsetTop;
                let current = node.offsetParent;
                // 一直循环直到根元素
                while (current != null) {
                    top += current.offsetTop;
                    current = current.offsetParent;
                }
                return {
                    'top': top
                };
            },
            setVolume(barTop) {
                const v = parseInt(((60 - barTop) / this.lineHeight) * 100);
                this.volumeVal = v;
                this.$emit('setVolume', v);
            }
        }
    };
</script>
