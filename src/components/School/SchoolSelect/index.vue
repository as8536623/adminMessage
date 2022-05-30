<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <section class="school-select">
        <div v-if="active" class="school-selected" :class="{'show': show}" @click="toggleWait">
            <div class="school-select__name">{{ active.name }}</div>
            <div class="school-select__deadline">到期时间：{{ active.endAt || '永久' }}</div>
            <svg-icon icon-class="arrow_down" class-name="school-arrow"/>
        </div>
        <div class="school-wait-select" :class="{'select--hide': !show}">
            <div v-for="(item, index) in list" :key="index" class="school-wait__item" @click="handleSelect(item)">
                <div class="school-select__name">{{ item.name }}</div>
                <div class="school-select__deadline">到期时间：{{ item.endAt || '永久' }}</div>
            </div>
        </div>
    </section>
</template>

<script>
    import {getOwnSchool} from '@/api/org';
    import {mapGetters} from 'vuex';

    export default {
        name: 'VueTemplate',
        data() {
            return {
                list: [],
                active: null,
                show: false
            };
        },
        computed: {
            ...mapGetters(['schoolId'])
        },
        mounted() {
            this.getOwnSchool();
        },
        methods: {
            getCurrentSchool() {
                let result = null;
                for (let i = 0; i < this.list.length; i++) {
                    const item = this.list[i];
                    const {id} = item;
                    if (id === this.schoolId) {
                        result = item;
                        break;
                    }
                }

                return result || this.list[0];
            },
            getOwnSchool() {
                getOwnSchool().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.list = result.data;
                        const school = this.getCurrentSchool();
                        if (school) {
                            this.handleSelect(school, true);
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取学校数据失败'));
                    }
                });
            },
            handleSelect(item, type) {
                this.active = item;
                this.$store.dispatch('setSchoolId', item.id);
                this.$emit('select', item);
                if (!type) {
                    this.toggleWait();
                }
            },
            toggleWait() {
                this.show = !this.show;
            }
        }
    };
</script>
