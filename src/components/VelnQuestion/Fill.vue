<style lang="scss" scoped>
    @import './style';
</style>
<template>
    <article class="exam__block">
        <div class="exam__item">
            <exam-content
                v-if="domHandleFlag"
                :title="$t('题干内容')"
                :content="content.ct"
                type="fill"
                :max-index="maxIndex"
                :editor="true"
                @blankHandle="blankBack"
                @blankDel="blankDel"
            />
        </div>
        <div class="exam__item">
            <div class="exam__item exam__text__block">
                <div class="exam__nav">
                    <div class="exam__text__title">{{ $t('正确答案') }}</div>
                </div>
                <div class="exam__text exam__fill__text">
                    <el-form
                        ref="editQuery"
                        :key="formKey"
                        label-width="80px"
                        :inline-message="true"
                        :model="editQuery"
                    >
                        <el-form-item
                            v-for="(item, index) in editQuery.blankList"
                            :key="index"
                            :label="$t('填空') + (index+1)"
                            :prop="'blankList[' + index + '].value'"
                            :rules="[{
                                required: true,
                                message: $t('请完善必填项'),
                                trigger: 'blur'
                            }]"
                        >
                            <el-input
                                v-model="item.value"
                                :placeholder="$t('请输入第' + (index +1) +'个填空的答案')"
                            />
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="exam__item exam__analyze">
            <exam-content :title="$t('试题解析')" :content="content.ep"/>
        </div>
    </article>
</template>
<script>
    import ExamContent from './Content';
    import {deepClone} from '@/utils';

    export default {
        name: 'Fill',
        components: {
            ExamContent
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                formKey: null,
                editQuery: {
                    blankList: []
                },
                domHandleFlag: false,
                maxIndex: 0
            };
        },
        watch: {
            content: {
                handler(val) {
                    this.editQuery = Object.assign(this.editQuery, []);
                    if (val && val.a) {
                        this.blankInputHandle(val.a);
                    } else {
                        this.domHandleFlag = true;
                    }
                },
                immediate: true
            }
        },
        methods: {
            blankBack(index) {
                const list = deepClone(this.editQuery.blankList);
                const data = {value: '', index: index};
                list.push(data);
                this.editQuery.blankList = deepClone(list);
                this.formKey = +new Date();
            },
            validate() {
                let flag = false;
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        flag = true;
                    }
                });
                return flag;
            },
            // 空格删除回调
            blankDel(list) {
                this.editQuery.blankList.map((item, index) => {
                    if (!list.includes(item.index)) {
                        this.editQuery.blankList.splice(index, 1);
                    }
                });
                console.log('111', this.editQuery.blankList);
            },
            // 编辑回显空格data-index对应上blankList的index
            blankInputHandle(val) {
                const list = val ? val.split('|') : [];
                const reg = new RegExp('(?<=<input.*data-index=").*?(?=")', 'g');
                const regSingle = new RegExp("(?<=<input.*data-index=').*?(?=')", 'g');
                let result = this.content.ct.ct.match(reg) || [];
                !result.length ? result = this.content.ct.ct.match(regSingle) : null;
                list.map((item, index) => {
                    const data = {
                        value: item,
                        index: result[index]
                    };
                    this.editQuery.blankList.push(data);
                    console.log('000', this.editQuery.blankList);
                });
                console.log('222', this.editQuery.blankList);
                // data-index取最大值
                this.maxIndex = Math.max(...result);
                this.domHandleFlag = true;
            }
        }
    };
</script>
