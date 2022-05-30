<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="qnt__question">
        <div class="qnt__question__title">
            <span class="qnt__question__index">{{ index + 1 }}.</span>
            <div class="qnt__question__name">
                <el-input
                    v-model="val.title"
                    type="textarea"
                    class="qnt__textarea qnt__question"
                    autosize
                    :placeholder="$t('请输入内容')"
                    maxlength="40"
                />
                <svg-icon
                    icon-class="image"
                    class-name="qnt__question__img"
                    @click="selectTitleImg"
                />
            </div>
            <div class="qnt__title__imgs">
                <div v-for="(img, idx) in val.imgUrls" :key="idx" class="qnt__img__wrapper">
                    <img :src="img.fileUrl" alt="IMAGE" class="qnt__img">
                    <div class="qnt__img__opt">
                        <div class="qnt__remove__wrapper" @click="removeTitleImg(idx)">
                            <svg-icon icon-class="close_o" class-name="qnt__remove"/>
                            <div class="qnt__remove__text">{{ $t('删除') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <draggable
            tag="ul"
            class="qnt__select__itemList"
            :item-list="val.itemList"
            handle=".qnt__item__sort"
            v-bind="dragOptions"
        >
            <li v-for="(item, idx) in val.itemList" :key="idx" class="qnt__select__item">
                <svg-icon icon-class="move" class-name="qnt__item__sort"/>
                <el-input
                    v-model="item.content"
                    type="textarea"
                    class="qnt__textarea qnt__answer"
                    autosize
                    :placeholder="$t('请输入内容')"
                    maxlength="40"
                />
                <svg-icon
                    icon-class="close_o"
                    class-name="qnt__item__remove"
                    @click="remove(idx)"
                />
                <svg-icon
                    icon-class="image"
                    class-name="qnt__item__img"
                    @click="selectAnswerImg(idx)"
                />
                <div class="qnt__answer__imgs">
                    <div v-for="(img, i) in item.imgUrls" :key="i" class="qnt__img__wrapper">
                        <img :src="img.fileUrl" alt="IMAGE" class="qnt__img">
                        <div class="qnt__img__opt">
                            <div class="qnt__remove__wrapper" @click="removeAnswerImg(index, i)">
                                <svg-icon icon-class="close_o" class-name="qnt__remove"/>
                                <div class="qnt__remove__text">{{ $t('删除') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-rate v-model="rateValue"/>
            </li>
        </draggable>
        <div class="qnt__add" @click="addItem">
            <svg-icon icon-class="add_s" class-name="qnt__add__icon"/>
            <span class="qnt__add__text">{{ $t('新建选项') }}</span>
        </div>
    </div>
</template>

<script>
    import {deepClone} from '@/utils/index';
    import draggable from 'vuedraggable';
    export default {
        name: 'QntRate',
        components: {
            draggable
        },
        props: {
            index: {
                type: [String, Number],
                default: 1
            },
            value: {
                type: Object,
                default: () => {
                    return {
                        title: '',
                        itemList: []
                    };
                }
            }
        },
        data() {
            const selectTemp = {
                id: '',
                title: this.$t('选项'),
                imgUrls: []
            };
            return {
                selectTemp,
                val: this.value,
                rateValue: 0
            };
        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    disabled: false
                };
            }
        },
        watch: {
            value: {
                handler(v) {
                    this.val = v;
                },
                deep: true,
                immediate: true
            },
            val: {
                handler(v) {
                    this.$emit('input', v);
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            addItem() {
                this.val.itemList.push(deepClone(this.selectTemp));
            },
            remove(index) {
                this.val.itemList.splice(index, 1);
            },
            selectTitleImg() {
                this.$emit('selectImage', 'TITLE', this.index);
            },
            selectAnswerImg(idx) {
                this.$emit('selectImage', 'ANSWER', this.index, idx);
            },
            removeTitleImg(index) {
                this.val.imgUrls.splice(index, 1);
            },
            removeAnswerImg(index, idx) {
                this.val.itemList[index].imgUrls.splice(idx, 1);
            }
        }
    };
</script>
