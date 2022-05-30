<template>
    <div>
        <router-view :key="key"/>
    </div>
</template>

<script>
    export default {
        name: 'NoneLayout',
        computed: {
            key() {
                return this.$route.fullPath;
            }
        }
    };
</script>

<style scoped>

</style>
