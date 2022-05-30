<style lang="scss">
</style>

<template>
    <veln-dgp-org
        :types="types"
        :outer="true"
        :app-code="appCode"
        :route="route"
        :fun-id="funId"
        :fun-code="funCode"
    />
</template>

<script>
    import VelnDgpOrg from '@/components/VelnDgpOrg';

    export default {
        name: 'OuterOrg',
        components: {
            VelnDgpOrg
        },
        data() {
            return {
                types: ['ORG'],
                appCode: '',
                relType: '',
                route: '',
                funCode: '',
                funId: ''
            };
        },
        created() {
            if (this.$route.query.appCode) {
                let funId = this.$route.query.funId || '';
                if (funId.indexOf(',')) {
                    funId = funId.split(',')[0];
                }
                const types = this.$route.query.types || '';
                if (types) {
                    this.types = types.split(',');
                }
                this.appCode = this.$route.query.appCode || '';
                this.route = this.$route.query.route || '';
                this.funCode = this.$route.query.funCode || '';
                this.funId = funId || '';
            }
        }
    };
</script>
