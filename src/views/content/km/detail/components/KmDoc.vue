<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="km__detail__doc">
        <iframe v-if="src" class="detail__doc__frame" :src="src" frameborder="0"/>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'KmDetailDoc',
        props: {
            viewUrl: {
                type: String,
                default: ''
            },
            corpCode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                src: ''
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        mounted() {
            this.src = `${this.viewUrl}&_token=${this.token}&corpCode=${this.corpCode}`;
        },
        methods: {}
    };
</script>
