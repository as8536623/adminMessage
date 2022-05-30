<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="sign__container__detail interaction__detail__container">
        <veln-form-section :title="$t('现场互动')" :can-expand="false">
            <!--<span class="sign__edit__btn" @click="edit">{{$t('编辑')}}</span>-->
            <section class="interaction__content">
                <div v-for="(item, index) in activityList" :key="index" class="interaction__item">
                    <div class="interaction">
                        <div v-if="item.relType === 'SIGN'" class="activity">
                            <svg-icon class-name="tool__icon" icon-class="sign"/>
                            {{ $t('签到') }}
                        </div>
                        <div v-if="item.relType === 'ENROLL'" class="activity">
                            <svg-icon class-name="tool__icon" icon-class="signUp"/>
                            {{ $t('报名') }}
                        </div>
                        <div v-if="item.relType === 'WORK'" class="activity">
                            <svg-icon class-name="tool__icon" icon-class="work"/>
                            {{ $t('作业') }}
                        </div>
                        <div v-if="item.relType == 'PE'" class="activity">
                            <svg-icon class-name="tool__icon" icon-class="exam"/>
                            {{ $t('考试') }}
                        </div>
                        <div class="name text-hide">{{ item.name }}</div>
                        <div v-if="item.relType === 'SIGN'" class="time text-hide">
                            {{ item.startTime }}
                        </div>
                        <div v-if="item.relType != 'SIGN'" class="time text-hide">
                            {{ item.startTime }}~{{ item.endTime }}
                        </div>
                    </div>
                    <div v-if="item.rewardNum" class="gold">
                        {{ item.rewardNum }}{{ $t('个能量石') }}
                    </div>
                </div>
            </section>
        </veln-form-section>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import {listAll} from '@/api/activity';
    export default {
        name: 'Interaction',
        components: {
            VelnFormSection
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                activityList: []
            };
        },
        created() {
            this.listAll();
        },
        methods: {
            edit() {
                this.$emit('editHandle', 'courseInteraction');
            },
            listAll() {
                const params = {faceCourseId: this.id};
                listAll(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.activityList = result.data ? result.data : [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取互动活动异常'));
                    }
                });
            }
        }
    };
</script>
