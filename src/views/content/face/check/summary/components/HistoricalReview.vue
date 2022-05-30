<style lang="scss" scoped>
@import './style';
</style>
<template>
    <article class="review__content">
        <div v-for="(item, index) in list" :key="index" class="review__item">
            <i class="circle" :class="{'circle__active': item.join}"/>
            <div v-if="item.relType === 'SIGN'" class="review__info">
                <div class="info flex__row">
                    <div class="name">{{ item.name }}</div>
                    <div
                        class="status"
                        :class="{'ing': item.status === 'PROGRESSING',
                                 'no__start': item.status === 'NOT_STARTED'}"
                    >{{ SIGN_STATUS_ENUM.getName(item.status) }}</div>
                </div>
                <div class="desc flex__row">
                    <div class="join" :class="{'join__active': item.join}">{{ item.join ? $t('已参加') : $t('未参加') }}</div>
                    <div class="time">
                        {{ $t('签到时间' + '：') }}
                        {{ item.signTime ? dateFormat(item.signTime, 'MM-dd hh:mm'): '--' }}
                    </div>
                    <div v-if="item.rewardNum" class="bean">
                        {{ $t('奖励' + '：') }}
                        <span class="bean__icon"/>
                        +{{ item.rewardNum }}
                    </div>
                </div>
            </div>
            <div v-if="item.relType === 'WORK'" class="review__info">
                <div class="info flex__row">
                    <div class="name">{{ item.name }}</div>
                    <div
                        class="status"
                        :class="{'ing': item.status === 'PROGRESSING',
                                 'no__start': item.status === 'NOT_STARTED'}"
                    >{{ HOMEWORK_STATUS_ENUM.getName(item.status) }}</div>
                </div>
                <div class="desc flex__row">
                    <div class="join" :class="{'join__active': item.join}">{{ item.join ? $t('已参加') : $t('未参加') }}</div>
                    <div class="time">
                        {{ $t('完成时间' + '：') }}
                        {{ item.finishTime ? dateFormat(item.finishTime, 'MM-dd hh:mm'): '--' }}
                    </div>
                    <div
                        v-if="item.score"
                        class="score"
                    >{{ $t('通过' + '：') +item.score.toFixed(2) + $t('分') }}
                    </div>
                    <div
                        v-else
                        class="no__submit"
                    >{{ HOMEWORK_USER_TYPE_ENUM.getName(item.userStatus) }}</div>
                    <div v-if="item.rewardNum" class="bean">{{ $t('奖励' + '：') }}+{{ item.rewardNum }}</div>
                </div>
            </div>
            <div v-if="item.relType === 'ENROLL'" class="review__info">
                <div class="info flex__row">
                    <div class="name">{{ item.name }}</div>
                    <div
                        class="status"
                        :class="{'ing': item.status === 'PROGRESSING',
                                 'no__start': item.status === 'NOT_STARTED'}"
                    >{{ PROJECT_STATUS_ENUM.getName(item.status) }}</div>
                </div>
                <div class="desc flex__row">
                    <div class="join" :class="{'join__active': item.join}">{{ item.join ? $t('已参加') : $t('未参加') }}</div>
                    <div class="time">
                        {{ $t('完成时间' + '：') }}
                        {{ item.finishTime ? dateFormat(item.finishTime, 'MM-dd hh:mm'): '--' }}
                    </div>
                    <div v-if="item.rewardNum" class="bean">{{ $t('奖励' + '：') }}+{{ item.rewardNum }}</div>
                </div>
            </div>
            <div v-if="item.relType === 'PE'" class="review__info">
                <div class="info flex__row">
                    <div class="name">{{ item.name }}</div>
                    <div
                        class="status"
                        :class="{'ing': item.status === 'PROGRESSING',
                                 'no__start': item.status === 'NOT_STARTED'}"
                    >{{ EXAM_STATUS_ENUM.getName(item.status) }}</div>
                </div>
                <div class="desc flex__row">
                    <div class="join" :class="{'join__active': item.join}">{{ item.join ? $t('已参加') : $t('未参加') }}</div>
                    <div class="time">
                        {{ $t('交卷时间' + '：') }}
                        {{ item.finishTime ? dateFormat(item.finishTime, 'MM-dd hh:mm'): '--' }}
                    </div>
                    <div
                        v-if="item.score"
                        class="score"
                    >{{ $t('通过' + '：') +item.score.toFixed(2) + $t('分') }}
                    </div>
                    <div v-if="item.rewardNum" class="bean">{{ $t('奖励' + '：') }}+{{ item.rewardNum }}</div>
                </div>
            </div>
        </div>
    </article>
</template>
<script>
    import {
        PROJECT_STATUS_ENUM,
        HOMEWORK_STATUS_ENUM,
        SIGN_STATUS_ENUM,
        HOMEWORK_USER_TYPE_ENUM,
        EXAM_STATUS_ENUM
    } from '@/enum';
    import {dateFormat} from '@/utils';
    export default {
        name: 'HistoricalReview',
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                PROJECT_STATUS_ENUM,
                HOMEWORK_STATUS_ENUM,
                SIGN_STATUS_ENUM,
                HOMEWORK_USER_TYPE_ENUM,
                EXAM_STATUS_ENUM,
                dateFormat
            };
        }
    };
</script>
