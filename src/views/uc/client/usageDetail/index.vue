<style lang="scss" scoped>
    @import "style";
</style>

<template>
    <div slot="left" class="app__row--left">
        <section>
            <el-form inline>
                <el-form-item :label="$t('客户名称') + '：'">
                    <el-select
                        v-model="listQuery.customerId"
                        class="course__type__select"
                        size="mini"
                        placeholder="请选择"
                        @change="handleCheckChange"
                    >
                        <el-option
                            v-for="item in domainList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('间隔') + '：'">
                    <el-select
                        v-model="listQuery.interval"
                        class="course__type__select"
                        size="mini"
                        placeholder="请选择"
                        @change="handleCheckChange"
                    >
                        <el-option
                            v-for="item in intervalOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('自定义时间') + '：'">
                    <el-date-picker
                        v-model="searchDateTime"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        clearable
                        @change="handleCheckChange"
                    />
                </el-form-item>
                <el-form-item :label="$t('流量单位') + '：'">
                    <el-radio-group v-model="listQuery.unit" @change="handleCheckChange()">
                        <el-radio-button label="B"/>
                        <el-radio-button label="KB"/>
                        <el-radio-button label="MB"/>
                        <el-radio-button label="GB"/>
                        <el-radio-button label="TB"/>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('时间范围') + '：'">
                    <el-radio-group v-model="timeOption " @change="handleCheckChange('time')">
                        <el-radio-button label="今天"/>
                        <el-radio-button label="昨天"/>
                        <el-radio-button label="近七天"/>
                        <el-radio-button label="近三十天"/>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-button
                type="primary"
                @click="exportUsageData()"
            >{{ $t('导出') }}
            </el-button>
        </section>
        <section id="home" class="home__index">
            <section id="count-chart"/>
            <template>
                <el-table
                    ref="table"
                    :data="tableData"
                    show-summary
                    height="500"
                    border
                >
                    <el-table-column
                        sortable
                        prop="startTime"
                        label="开始时间"
                    />
                    <el-table-column
                        prop="endTime"
                        label="截止时间"
                    />
                    <el-table-column
                        prop="value"
                        label="总流量"
                    />
                    <el-table-column
                        prop="unit"
                        width="80"
                        label="单位"
                    />
                </el-table>
            </template>
        </section>
    </div>
</template>

<script>

    import {getInfo, listDomain, exportUsageData} from '@/api/usageData';
    import {getToken} from '@/utils/auth';

    export default {
        name: 'UsageDetail',

        data() {
            return {
                listQuery: {
                    interval: 3600,
                    customerId: this.$route.query.id,
                    unit: 'GB',
                    startTime: null,
                    endTime: null
                },
                searchDateTime: [],
                intervalOptions: [
                    {
                        value: 3600,
                        label: '小时'
                    },
                    {
                        value: 86400,
                        label: '天'
                    }
                ],
                timeOption: '今天',
                domainList: [],
                tableData: []
            };
        },
        created() {
            // eslint-disable-next-line no-extend-native
            Date.prototype.Format = function(fmt) { // author: meizz
                var o = {
                    'M+': this.getMonth() + 1, // 月份
                    'd+': this.getDate(), // 日
                    'h+': this.getHours(), // 小时
                    'm+': this.getMinutes(), // 分
                    's+': this.getSeconds(), // 秒
                    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
                    'S': this.getMilliseconds() // 毫秒
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp('(' + k + ')').test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                    }
                }
                return fmt;
            };

            this.listQuery.customerId = this.$route.query.id;
        },
        updated() {
            this.$nextTick(() => {
                this.$refs['table'].doLayout();
            });
        },
        async mounted() {
            await this.getDomainList();
            this.getList();
        },
        methods: {
            getList: function(condition = {}) {
                if (this.searchDateTime && this.searchDateTime.length !== 0) {
                    this.timeOption = '';
                    this.listQuery.startTime = this.searchDateTime[0] + ' 00:00:01';
                    this.listQuery.endTime = this.searchDateTime[1] + ' 23:59:59';
                } else {
                    if (this.timeOption === '今天') {
                        const nowTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                        const nowDate = new Date().Format('yyyy-MM-dd');
                        this.listQuery.startTime = nowDate + ' 00:00:01';
                        this.listQuery.endTime = nowTime;
                    } else if (this.timeOption === '昨天') {
                        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).Format('yyyy-MM-dd');
                        this.listQuery.startTime = yesterday + ' 00:00:01';
                        this.listQuery.endTime = yesterday + ' 23:59:59';
                    } else if (this.timeOption === '近七天') {
                        const nowTime = new Date().Format('yyyy-MM-dd');
                        const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).Format('yyyy-MM-dd');
                        this.listQuery.startTime = oneWeekAgo + ' 00:00:01';
                        this.listQuery.endTime = nowTime + ' 23:59:59';
                    } else if (this.timeOption === '近三十天') {
                        const nowTime = new Date().Format('yyyy-MM-dd');
                        const oneMonthAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).Format('yyyy-MM-dd');
                        this.listQuery.startTime = oneMonthAgo + ' 00:00:01';
                        this.listQuery.endTime = nowTime + ' 23:59:59';
                    }
                }
                const data = {...this.listQuery, ...condition};
                const x = [];
                const y = [];
                getInfo(data).then(re => {
                    const result = re.data;
                    if (!result.success) {
                        this.$message.error(result.data);
                        return;
                    }

                    this.tableData = result.data;
                    for (const item in result.data) {
                        x.push(result.data[item].startTime.substr(5, 11));
                        y.push(result.data[item].value);
                        if (result.data.length === 1) {
                            x.push(result.data[item].endTime.substr(5, 11));
                            y.push(result.data[item].value);
                        }
                    }

                    // 先请求数据，然后塞数据
                    const element = document.getElementById('count-chart');
                    const dayChart = this.$echarts.init(element);
                    const option = {
                        title: {
                            text: '流量趋势'
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: x // 轴展示数据
                        },
                        yAxis: {
                            type: 'value'
                        },
                        tooltip: {
                            show: true
                        },
                        series: [{
                            data: y, // 值
                            type: 'line'
                        }, {
                            data: x,
                            type: 'line',
                            areaStyle: {}
                        }]
                    };
                    option && dayChart.setOption(option);
                });
            },
            getDomainList() {
                return new Promise((resolve, reject) => {
                    listDomain().then(res => {
                        const {data: {success = false, msg = '查询失败'}} = res;
                        if (success) {
                            this.domainList = res.data.data;
                            if (!this.listQuery.customerId) {
                                this.listQuery.customerId = this.domainList[0].id;
                            }
                            resolve();
                        } else {
                            this.$message.error(msg);
                        }
                    });
                });
            },
            handleCheckChange(type) {
                if (this.searchDateTime === null) {
                    if (!this.timeOption) {
                        this.timeOption = '今天';
                    }
                } else {
                    if (type === 'time') {
                        this.searchDateTime = [];
                    }
                }
                this.getList();
            },
            async exportUsageData() {
                const token = getToken();
                const callback = await exportUsageData(this.listQuery);
                const {data: {data: {id = ''} = {}} = {}} = callback;
                if (!id) {
                    return;
                }
                const url = `${process.env.STU_API}/export/downloadExport/${id}?_token=${token}`;
                window.open(url);
            }
        }
    };
</script>
