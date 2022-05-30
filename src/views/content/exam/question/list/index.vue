<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="question__outer">
        <bgk-list v-if="isBgk()"/>
        <list v-else/>
    </div>
</template>

<script>
    import List from './components/List';
    import BgkList from './components/BgkList';
    import {getCorpCode} from '@/utils/auth';

    export default {
        name: 'ExamQuestion',
        components: {
            List,
            BgkList
        },
        methods: {
            isBgk() {
                return getCorpCode() === 'bgk' || getCorpCode() === 'bgh';
            }
        }
    };
</script>
