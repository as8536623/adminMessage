<style lang="scss" scoped>
    @import "./style";
</style>
<template>
    <div class="course__catalog__content">
        <div v-for="(item, c_index) in list" :key="c_index" class="course__catalog__item">
            <div class="chapter__item">
                <svg-icon icon-class="chapter" class-name="chapter__icon"/>
                <span class="chapter__order">{{ $t('第') + NumberToChinese(c_index+1) + $t('章') }}</span>
                <span class="chapter__name overflow--hide" :title="item.name">{{ item.name }}</span>
            </div>
            <div
                v-for="(b_Item, b_index) in item.list"
                :key="b_index"
                class="bar__item"
                :class="{'active': c_index === cIndex && bIndex === b_index}"
                @click="chapterClick(c_index, b_index)"
            >
                <span class="bar__order">{{ c_index+1 }}-{{ b_index+1 }}</span>
                <span class="bar__name overflow--hide" :title="b_Item.name">{{ b_Item.name }}</span>
                <svg-icon
                    v-if="showPlay(b_Item, c_index, b_index)"
                    icon-class="playing_d1"
                    class-name="play__icon"
                />
                <svg-icon
                    v-if="!showPlay(b_Item, c_index, b_index)"
                    icon-class="pause_d1"
                    class-name="pause__icon"
                />
                <!--<svg-icon icon-class="finish_d" class-name="finish__icon"-->
                <!--v-if="finish(b_Item, c_index, b_index)"></svg-icon>-->
            </div>
        </div>
    </div>
</template>
<script>
    import {NumberToChinese} from '@/utils/number';

    export default {
        name: 'Chapter',
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            cIndex: {
                type: Number,
                default: 0
            },
            bIndex: {
                type: Number,
                default: 0
            },
            isPlaying: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {};
        },
        methods: {
            NumberToChinese,
            showPlay(item, cIndex, bIndex) {
                return this.isPlaying && cIndex === this.cIndex && bIndex === this.bIndex;
            },
            finish(item, cIndex, bIndex) {
                return item.learned >= 100 && (cIndex !== this.cIndex || bIndex !== this.bIndex);
            },
            // eslint-disable-next-line camelcase
            chapterClick(c_index, b_index) {
                const data = {
                    // eslint-disable-next-line camelcase
                    c_index,
                    // eslint-disable-next-line camelcase
                    b_index,
                    isPlay: !this.isPlaying
                };
                this.$emit('chapterHandle', data);
            }
        }
    };
</script>
