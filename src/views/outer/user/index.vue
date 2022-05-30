<style lang="scss">
</style>

<template>
    <veln-dgp-user
        :outer="true"
        opt-type="USER"
        :app-code="appCode"
        :route="route"
        :fun-id="funId"
        :fun-code="funCode"
    />
</template>

<script>
    import VelnDgpUser from '@/components/VelnDgpUser';
    export default {
        name: 'OuterUser',
        components: {
            VelnDgpUser
        },
        data() {
            return {
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
                this.appCode = this.$route.query.appCode || '';
                this.route = this.$route.query.route || '';
                this.funCode = this.$route.query.funCode || '';
                this.funId = funId || '';
            }
        }
    };
</script>
