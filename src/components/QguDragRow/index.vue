<style lang="scss" scoped>
@import './style';
</style>

<template>
    <article ref="qguDragRow" class="qgu__drag__row">
        <div
            class="qgu__drag__row--left"
            :class="{'flex-auto' : type === 'right'}"
            :style="type==='left' ? {
                'width': (leftW || leftWidth) + 'px'
            } : null"
        >
            <slot name="left"/>
        </div>
        <div class="qgu__drag__row--center">
            <div
                class="qgu__drag__row__drag"
                draggable="true"
                @dragstart="handleDragStart"
                @dragend="handleDragEnd"
                @drag="handleDrag($event)"
            />
            <div class="qgu__drag__row__split__line" :style="{'width': lineWidth + 'px'}"/>
            <svg-icon icon-class="drag" class-name="qgu__drag__row__split__icon"/>
        </div>
        <div
            class="qgu__drag__row--right"
            :class="{'flex-auto' : type === 'left'}"
            :style="type==='right' ? {
                'width': (rightW || rightWidth) + 'px'
            } : null"
        >
            <slot name="right"/>
        </div>
    </article>
</template>

<script>
    import {debounce} from './utils';

    export default {
        name: 'QguDragRow',
        props: {
            type: {
                default: 'left', // left | right
                type: String
            },
            lineWidth: {
                default: '1',
                type: String
            },
            leftWidth: {
                default: '264',
                type: String
            },
            rightWidth: {
                default: '300',
                type: String
            }
        },
        data() {
            return {
                leftW: 0,
                rightW: 0,
                containerWidth: '',
                containerLeft: '',
                containerRight: '',
                mouseDown: false
            };
        },
        mounted() {
            const $qguDragRowE = this.$refs.qguDragRow;
            const rect = $qguDragRowE.getBoundingClientRect();
            this.containerWidth = rect.width;
            this.containerLeft = rect.left;
            this.containerRight = rect.right;
        },
        methods: {
            handleDragStart() {
                this.mouseDown = true;
                return false;
            },
            handleDragEnd() {
                this.mouseDown = false;
            },
            /**
             * 拖拽最后松开鼠标时也会触发 drag
             * 但是pageX 为0
             * @param e
             */
            drag(e) {
                const pageX = e.pageX;
                if (this.type === 'left' && pageX > 0) {
                    const l = pageX - this.containerLeft;
                    this.leftW =
                        l <= 1
                            ? this.leftW
                            : l > this.containerWidth
                                ? this.containerWidth
                                : l;
                }

                if (this.type === 'right' && pageX > 0) {
                    const r = this.containerRight - pageX;
                    this.rightW =
                        r <= 1
                            ? this.rightW
                            : r > this.containerWidth
                                ? this.containerWidth
                                : r;
                }
            },
            handleDrag(e) {
                if (!this.mouseDown) {
                    return;
                }

                debounce(this.drag(e), 300, true);
            }
        }
    };
</script>
