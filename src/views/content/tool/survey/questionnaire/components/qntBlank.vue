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
        <el-input class="qnt__blank__npt" disabled/>
    </div>
</template>

<script>
    import {deepClone} from '@/utils/index';

    export default {
        name: 'QntBlank',
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
            const radioTemp = {
                id: '',
                title: this.$t('选项'),
                imgUrls: []
            };
            return {
                radioTemp,
                val: this.value
            };
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
                this.val.itemList.push(deepClone(this.radioTemp));
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
