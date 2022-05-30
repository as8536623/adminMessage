<template>
    <div :id="id" :class="className" style="margin: 15px 8px;" :style="{height:height,width:width}"/>
</template>

<script>
    import echarts from 'echarts';

    export default {
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            id: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '1000px'
            },
            height: {
                type: String,
                default: '400px'
            },
            data: {
                type: Object,
                default() {
                    return {
                        x: [],
                        y: []
                    };
                }
            }
        },
        data() {
            return {
                chart: null
            };
        },
        mounted() {
            this.initChart();
        },
        beforeDestroy() {
            if (!this.chart) {
                return;
            }
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            initChart() {
                this.chart = echarts.init(document.getElementById(this.id));

                this.chart.setOption({
                    title: {
                        text: '考试成绩分布直方图',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: params => {
                            const {name, seriesDatas, value} = params[0].data;

                            const tooltip = [];
                            tooltip.push(`<div>${name}: ${value}</div>`);
                            var isShowBatch = true;
                            if (!seriesDatas) {
                                return `<div>${tooltip.join('')}</div>`;
                            }
                            for (let i = 0; i < seriesDatas.length; i++) {
                                if (!seriesDatas.name) {
                                    isShowBatch = false;
                                }
                            }
                            if (isShowBatch) {
                                tooltip.push('<hr/>');
                                seriesDatas.map(item => {
                                    tooltip.push(
                                        `<div><span style="display: inline-block;width: 60px;">${item.name}:</span> ${item.value}</div>`
                                    );
                                });
                            }
                            return `<div>${tooltip.join('')}</div>`;
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            name: '成绩',
                            data: this.data.scoreRanges,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            name: '人数',
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '成绩分布',
                            type: 'bar',
                            barWidth: '40%',
                            data: this.data.columnData,
                            itemStyle: {
                                normal: {
                                    color: params => {
                                        const colorList = [
                                            '#acd3f5',
                                            '#f0d480',
                                            '#b8d071',
                                            '#eeaf86',
                                            '#75bbba',
                                            '#e29c9d',
                                            '#c19ec1',
                                            '#9ab280',
                                            '#cbc56e',
                                            '#4598c3'
                                        ];
                                        return colorList[params.dataIndex];
                                    }
                                }
                            }
                        }
                    ]
                });
            }
        }
    };
</script>
