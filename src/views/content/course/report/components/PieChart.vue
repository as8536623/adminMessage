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
                type: Array,
                default() {
                    return [];
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
                                color: '#57617B'
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
                    series: [
                        {
                            type: 'pie',
                            radius: ['40%', '70%'],
                            label: {
                                normal: {
                                    formatter: '{b|{b}({d}%)}',
                                    rich: {
                                        b: {
                                            fontSize: 14,
                                            lineHeight: 33
                                        }
                                    }
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
                                    color: params => {
                                        const colors = [
                                            '#34A6BF',
                                            '#378BCC',
                                            '#0FBCF7',
                                            '#2E54A9',
                                            '#3EE6E3',
                                            '#c23531',
                                            '#2f4554',
                                            '#61a0a8',
                                            '#d48265',
                                            '#91c7ae',
                                            '#749f83',
                                            '#ca8622',
                                            '#bda29a',
                                            '#6e7074',
                                            '#546570',
                                            '#c4ccd3'
                                        ];
                                        console.log(params);
                                        return colors[params.dataIndex]
                                            ? colors[params.dataIndex]
                                            : '';
                                    }
                                }
                            },
                            data: this.data
                        }
                    ]
                });
            }
        }
    };
</script>
