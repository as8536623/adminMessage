<style scoped lang="scss">
    .veln__datetime {
        .veln__datetime__date {
            width: 196px;
        }

        .veln__datetime__time {
            width: 100px;
        }
    }
</style>

<template>
    <span class="veln__datetime">
        <el-date-picker
            v-model="date"
            class="veln__datetime__date"
            type="date"
            :placeholder="$t('请选择日期')"
            value-format="yyyy/MM/dd"
            :disabled="disabled"
            :picker-options="pickerOptions"
            @change="dateChange"
        />
        <el-time-select
            :key="timeKey"
            v-model="time"
            class="veln__datetime__time"
            :placeholder="$t('请选择时间')"
            :disabled="disabled || !date"
            :picker-options="{start: '00:00',step: '00:05',end: '23:45', minTime: minTime, maxTime: maxTime}"
            @change="timeChange"
        />
    </span>
</template>

<script>
    import moment from 'moment';
    import {dateFormat} from '@/utils';

    export default {
        name: 'VelnDatetime',
        props: {
            value: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            minDatetime: {
                type: String,
                default: ''
            },
            maxDatetime: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                date: '',
                time: '',
                isClear: false,
                pickerOptions: {
                    disabledDate(time) {
                        return (
                            time.getTime() < new Date().getTime() - 3600 * 1000 * 24
                        );
                    }
                },
                minTime: '', // 最小时间
                maxTime: '', // 最大时间
                minDatetimeProp: this.minDatetime,
                maxDatetimeProp: this.maxDatetime,
                limitFlag: false,
                timeKey: null
            };
        },
        watch: {
            value(v) {
                this.formatValue(v);
            },
            // date() {
            //     this.emitInput();
            // },
            // time() {
            //     this.emitInput();
            // },
            minDatetime: {
                handler(v) {
                    this.minDatetimeProp = moment(this.minDatetime).format(
                        'YYYY/MM/DD HH:mm:ss'
                    );
                    this.maxDatetimeProp = moment(this.maxDatetime).format(
                        'YYYY/MM/DD HH:mm:ss'
                    );
                    this.formatLimit();
                },
                immediate: true
            },
            maxDatetime: {
                handler(v) {
                    this.minDatetimeProp = moment(this.minDatetime).format(
                        'YYYY/MM/DD HH:mm:ss'
                    );
                    this.maxDatetimeProp = moment(this.maxDatetime).format(
                        'YYYY/MM/DD HH:mm:ss'
                    );
                    this.formatLimit();
                },
                immediate: true
            }
        },
        created() {
            this.formatLimit();
        },
        mounted() {
            this.formatValue(this.value);
        },
        methods: {
            dateFormat,
            // 初始化限制条件
            formatLimit() {
                if (
                    moment(this.minDatetimeProp).toDate() === 'Invalid Date' ||
                    moment(this.maxDatetimeProp).toDate() === 'Invalid Date'
                ) {
                    return;
                }
                if (
                    this.minDatetimeProp &&
                    this.maxDatetimeProp &&
                    new Date(this.minDatetimeProp).getTime() >=
                    new Date(this.maxDatetimeProp).getTime()
                ) {
                    this.maxDatetimeProp = this.minDatetimeProp;
                }
                let disabledDate = null;
                if (
                    this.minDatetimeProp !== 'Invalid date' &&
                    this.maxDatetimeProp !== 'Invalid date'
                ) {
                    disabledDate = time => {
                        const t = moment(time).format('YYYY/MM/DD');
                        const t1 = `${t} 23:59:59`;
                        const t2 = `${t} 00:00:00`;
                        return !(
                            new Date(t1).getTime() >=
                            new Date(this.minDatetimeProp).getTime() &&
                            new Date(t2).getTime() <=
                            new Date(this.maxDatetimeProp).getTime()
                        );
                    };
                }
                if (this.minDatetimeProp && !this.maxDatetimeProp) {
                    disabledDate = time => {
                        let t = moment(time).format('YYYY/MM/DD');
                        t = `${t} 23:59:59`;

                        const minT = moment(this.minDatetimeProp).format(
                            'YYYY/MM/DD HH:mm:ss'
                        );
                        return !(new Date(t).getTime() >= new Date(minT).getTime());
                    };
                }
                if (!this.minDatetimeProp && this.maxDatetimeProp) {
                    disabledDate = time => {
                        let t = moment(time).format('YYYY/MM/DD');
                        t = `${t} 00:00:00`;
                        const maxT = moment(this.maxDatetimeProp).format(
                            'YYYY/MM/DD HH:mm:ss'
                        );
                        return !(new Date(t).getTime() <= new Date(maxT).getTime());
                    };
                }
                this.pickerOptions = {
                    disabledDate
                };
            },
            // 向上算 时:分
            calTimeUp(time, type) {
                const timeArr = time.split(':');
                const second = timeArr[1];
                const t = Math.floor(Number(second) / 15);
                const r = Number(second) % 15;
                let total = '';
                if (!r) {
                    return time;
                }
                if (type === 'up') {
                    total = Number(timeArr[0] * 60 + (t + 1) * 15);
                }
                if (type === 'down') {
                    total = Number(timeArr[0] * 60 + t * 15);
                }
                return this.secondToTime(total);
            },
            // second转换为 时:分
            secondToTime(second) {
                const h = Math.floor(Number(second) / 60);
                const s = Number(second) % 60;
                return `${h < 10 ? '0' + h : h}:${s < 10 ? '0' + s : s}`;
            },
            // 将 时:分转换为分
            getTimeSecond(time) {
                const timeArr = time.split(':');
                const s = Number(timeArr[0]) * 60 + Number(timeArr[1]);
                return s;
            },
            // 最小/最大时间 格式化 time-select
            formatTime() {
                let minDate = '';
                let minTime = '';
                let maxDate = '';
                let maxTime = '';
                let minT = '';
                let maxT = '';
                let key = '';
                if (this.minDatetimeProp) {
                    minDate = moment(this.minDatetimeProp).format('YYYY/MM/DD');
                    minTime = moment(this.minDatetimeProp).format('HH:mm');
                }

                if (this.maxDatetimeProp) {
                    maxDate = moment(this.maxDatetimeProp).format('YYYY/MM/DD');
                    maxTime = moment(this.maxDatetimeProp).format('HH:mm');
                }

                if (this.date === minDate) {
                    minT = minTime;
                    key = +new Date();
                }

                if (this.date === maxDate) {
                    maxT = maxTime;
                    key = +new Date();
                }

                if (key) {
                    this.minTime = minT;
                    this.maxTime = maxT;
                    this.timeKey = key;
                }
                this.$nextTick(() => {
                    if (
                        this.getTimeSecond(this.time) < this.getTimeSecond(minTime)
                    ) {
                        this.time = this.calTimeUp(minTime, 'up');
                    }

                    if (
                        this.getTimeSecond(this.time) > this.getTimeSecond(maxTime)
                    ) {
                        this.time = this.calTimeUp(maxTime, 'up');
                        return;
                    }
                });
            },
            // 格式化数值
            formatValue(v) {
                const value = v.trim();
                if (
                    !value ||
                    moment(value)
                        .toDate()
                        .toString() === 'Invalid Date'
                ) {
                    this.date = '';
                    this.time = '';
                    this.$emit('input', '');
                    return;
                }
                const date = moment(value);
                let hour = date.hour();
                let minute = date.minute();
                // minute = Math.floor(minute / 15) * 15;
                hour = hour < 10 ? `0${hour}` : `${hour}`;
                minute = minute < 10 ? `0${minute}` : `${minute}`;
                this.date = date.format('YYYY/MM/DD');
                this.time = `${hour}:${minute}`;
            },
            dateChange() {
                this.limitTimeHandle();
                this.formatValue(`${this.date} ${this.time}`);
                this.formatTime();
                this.isClear = !(this.date && this.time);
                if (this.date) {
                    const date = moment(`${this.date} ${this.time}:00`).format(
                        'YYYY-MM-DD HH:mm:ss'
                    );
                    console.info('date', date);
                    this.$emit('input', date);
                } else {
                    this.date = '';
                    this.time = '';
                    this.$emit('input', '');
                }

                // this.$emit('input', `${this.date} ${this.time}:00`);
            },
            timeChange() {
                // this.limitTimeHandle();
                this.isClear = !(this.date && this.time);
                const date = moment(`${this.date} ${this.time}:00`).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
                this.$emit('input', date);
            },
            limitTimeHandle() {
                const timeStamp = Date.parse(new Date(this.date));
                const currentStamp = Date.parse(
                    moment(new Date()).format('YYYY/MM/DD')
                );
                if (timeStamp === currentStamp) {
                    this.limitTime = moment(new Date()).format('HH:mm');
                    this.time = this.limitTime;
                    const dateStr = this.date + ' ' + this.time;
                    const current = Date.parse(new Date(dateStr)) + 15 * 60 * 1000;
                    this.time = this.dateFormat(new Date(current), 'hh:mm');
                } else {
                    this.limitTime = '';
                    this.time = moment(new Date()).format('HH:mm');
                }
            }
        }
    };
</script>
