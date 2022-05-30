<style lang="scss">
</style>

<template>
    <veln-auth-setting
        :outer="true"
        :app-code="appCode"
        :rel-type="optType"
        :route="route"
        :fun-id="funId"
        :fun-code="funCode"
    />
</template>

<script>
    import VelnAuthSetting from '@/components/VelnAuthSetting';

    export default {
        name: 'OuterUser',
        components: {
            VelnAuthSetting
        },
        data() {
            return {
                appCode: '',
                relType: '',
                route: '',
                funCode: '',
                funId: '',
                optType: ''
            };
        },
        created() {
            if (this.$route.query.appCode) {
                let funId = this.$route.query.funId || '';
                if (funId.indexOf(',')) {
                    funId = funId.split(',')[0];
                }
                this.appCode = this.$route.query.appCode || '';
                this.relType = this.$route.query.relType || '';
                this.route = this.$route.query.route || '';
                this.funCode = this.$route.query.funCode || '';
                this.funId = funId || '';
            }
        }
    };
</script>
