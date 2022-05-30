<style lang="scss" src="./style.scss">
</style>

<template>
    <section class="error__template__link">
        <span class="error__template__label">{{ $t('导入失败') }}，</span>
        <el-link type="primary" @click="downloadErrorExcel">{{ $t('请下载错误文档') }}</el-link>
        <div class="error__template__btn">
            <el-button @click="continueImport">{{ $t('继续导入') }}</el-button>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'VelnUploadError',
        props: {
            url: {
                type: String,
                default: ''
            }
        },
        mounted() {},
        methods: {
            downloadErrorExcel() {
                window.open(this.url);
            },
            continueImport() {
                this.$emit('continue');
            }
        }
    };
</script>
