<style lang="scss" scoped>
    @import "./style.scss";
</style>
<style lang="scss">
    .veln__transfer__list{
        .el-checkbox-button__inner, .el-checkbox__label{
            display: inline-block;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: middle;
        }
    }
</style>

<template>
    <div class="veln__transfer__list">
        <div v-if="!data.length" class="veln__transfer__item--empty">
            {{ $t('暂无数据') }}
        </div>
        <el-checkbox-group v-if="data.length" v-model="checked" @change="handleCheckedChange">
            <div v-for="(user, index) in data" :key="index" class="veln__transfer__item" :title="user.stemOutline ? user.stemOutline : ''">
                <el-checkbox :label="user.id">{{ user.name }}</el-checkbox>
            </div>
        </el-checkbox-group>
    </div>
</template>

<script>
    export default {
        name: 'VelnTransferList',
        props: {
            data: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                checked: []
            };
        },
        methods: {
            handleCheckedChange(v) {
                this.$emit('select', v);
            },
            reset() {
                this.checked = [];
            }
        }
    };
</script>
