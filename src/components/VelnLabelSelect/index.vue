 <style lang="scss" src="./style.scss">
</style>
<template>
    <article class="veln__label__container">
        <el-form
            ref="listQuery"
            :label-width="labelWidth + 'px'"
            :model="listQuery"
            @submit.native.prevent
        >
            <el-form-item :label="$t(labelName) + '：'" :prop="validatorFlag ? labels : null">
                <div
                    class="tag__list"
                    :style="{width: width + 'px'}"
                    :class="{'tag__disable': !inputEnable}"
                >
                    <el-tag
                        v-for="tag in listQuery.labels"
                        :key="tag"
                        :closable="(!disabled && inputEnable) || closeEnable"
                        :disable-transitions="false"
                        @close="handleTagClose(tag)"
                    >{{ tag }}</el-tag>
                    <el-input
                        v-if="!disabled && inputVisible && inputEnable"
                        ref="saveTagInput"
                        v-model="inputValue"
                        class="input-new-tag"
                        size="small"
                        @keyup.native.enter="handleInputConfirm('ENTER')"
                        @blur="handleInputConfirm"
                    />
                    <el-button
                        v-else-if="!disabled && inputEnable"
                        class="button-new-tag"
                        size="small"
                        @click="showInput"
                    >+ {{ $t('请输入') }}</el-button>
                </div>
                <div class="default__tag__list" :style="{width: width + 'px'}">
                    <el-tag
                        v-for="(item,index) in listQuery.defaultLabelList"
                        :key="index"
                        @click="defaultTagClick(item, index)"
                    >{{ item }}</el-tag>
                </div>
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import {listByLabelType} from '@/api/label';
    import {inputTag} from '@/api/system/corpConfig';

    export default {
        name: 'VelnLabelSelect',
        props: {
            labelType: {
                type: String,
                default: 'COURSE'
            },
            labelName: {
                type: String,
                default: '标签'
            },
            labelWidth: {
                type: Number,
                default: 120
            },
            width: {
                type: Number,
                default: 614
            },
            defaultLabels: {
                type: Array,
                default() {
                    return [];
                }
            },
            validatorFlag: {
                type: Boolean,
                default: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            closeEnable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                listQuery: {
                    labels: this.defaultLabels,
                    defaultLabelList: []
                },
                inputVisible: false,
                inputValue: '',
                labels: 'labels',
                inputEnable: true
            };
        },
        watch: {
            defaultLabels: {
                handler(val) {
                    this.listQuery.labels = val;
                },
                immediate: true
            }
        },
        created() {
            this.getDefaultLabel();
            this.getInputEnabled();
        },
        methods: {
            getInputEnabled() {
                inputTag().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.inputEnable = result.data;
                    } else {
                        this.inputEnable = false;
                    }
                });
            },
            // 标签删除
            handleTagClose(tag) {
                this.listQuery.labels.splice(this.listQuery.labels.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm(type) {
                const inputValue = this.inputValue;
                if (inputValue && !this.listQuery.labels.includes(inputValue)) {
                    this.listQuery.labels.push(inputValue);
                }
                if (type !== 'ENTER') {
                    this.inputVisible = false;
                }
                this.inputValue = '';
            },
            // 默认标签点击选中
            defaultTagClick(item) {
                if (!this.inputEnable) {
                    return;
                }
                if (!this.listQuery.labels.includes(item)) {
                    this.listQuery.labels.push(item);
                }
            },
            // 默认显示标签
            getDefaultLabel() {
                const params = {labelType: this.labelType};
                listByLabelType(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const list = result.data ? result.data : [];
                        list.map(item => {
                            this.listQuery.defaultLabelList.push(item.name);
                        });
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            validateHandle() {
                let flag = false;
                this.$refs.listQuery.validate(valid => {
                    if (valid) {
                        flag = true;
                    }
                });
                return flag;
            }
        }
    };
</script>
