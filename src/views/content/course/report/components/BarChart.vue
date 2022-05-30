<template>
    <div
        :id="id"
        :class="className"
        style="margin: 15px 8px;"
        :style="{height:height,width:width}"
    />
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
                default: '600px'
            },
            height: {
                type: String,
                default: '220px'
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
                    backgroundColor: '#0d1c4d',
                    title: {
                        top: 20,
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 16,
                            color: '#F1F1F3'
                        },
                        left: '1%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            lineStyle: {
                                color: 'rgba(0,0,0,0)'
                            }
                        }
                    },
                    grid: {
                        top: 20,
                        left: '3%',
                        right: '4%',
                        bottom: '2%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            axisLine: {
                                lineStyle: {
                                    color: '#1d4476'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#26BCF8'
                                }
                            },
                            axisLabel: {
                                // margin: 10,
                                textStyle: {
                                    fontSize: 12,
                                    color: '#26BCF8'
                                }
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            data: this.data.x
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            // name: "(%)",
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#0d1c4d'
                                }
                            },
                            axisLabel: {
                                margin: 10,
                                textStyle: {
                                    fontSize: 12,
                                    color: '#26BCF8'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#1f3f6c'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            // smooth: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            showSymbol: false,
                            barWidth: '22px',
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: '#0e265a',
                                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                                    shadowBlur: 10
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {offset: 0, color: '#2771E9'},
                                        {offset: 1, color: '#00EAFF'}
                                    ])
                                }
                            },
                            data: this.data.y
                        }
                    ]
                });
            }
        }
    };
</script>
