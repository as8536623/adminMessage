<style lang="scss">
</style>

<template>
    <veln-file-select
        ref="fileSelect"
        :outer="true"
        :app-code="appCode"
        :fun-code="funCode"
        :multi-select="false"
        :type-arr="typeArr"
    />
</template>

<script>
    import VelnFileSelect from '@/components/VelnFileSelect';

    export default {
        name: 'OuterFile',
        components: {
            VelnFileSelect
        },
        data() {
            return {
                appCode: '',
                funCode: '',
                typeArr: ['VIDEO']
            };
        },
        created() {
            if (this.$route.query.types) {
                let types = this.$route.query.types || '';
                types = types.split(',');
                this.appCode = this.$route.query.appCode || '';
                this.funCode = this.$route.query.funCode || '';
                this.typeArr = types;
            }

            window.getSelectFile = () => {
                return this.$refs.fileSelect.getSelected();
            };
        }
    };
</script>
