<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="task__types">
        <div v-for="(item, index) in types" :key="index" class="task__type" @click="handleClick(item)">
            <svg-icon :icon-class="item.icon" class-name="task__icon"/>
            <span class="task__name">{{ item.name }}</span>
            <svg-icon icon-class="add_i" class-name="task__add"/>
        </div>
    </div>
</template>

<script>
    import {types} from './types';

    export default {
        name: 'TaskTypes',
        data() {
            return {
                types
            };
        },
        mounted() {
        },
        methods: {
            handleClick(item) {
                const {type} = item;
                this.$emit('click', type);
            }
        }
    };
</script>
