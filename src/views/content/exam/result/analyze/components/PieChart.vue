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
                const legendData = [];
                const selected = {};
                this.data.map(item => {
                    legendData.push(item.name);
                    selected[item.name] = true;
                });
                this.chart.setOption({
                    title: {
                        text: '考试结果饼状图',
                        x: 'center'
                    },
                    color: ['#d4d4d4', '#7ccd88', '#ffa614'],
                    tooltip: {
                        trigger: 'item',
                        formatter: params => {
                            const {percent} = params;
                            const {name, seriesDatas, value} = params.data;

                            const tooltip = [];
                            tooltip.push(
                                `<div>${name}: ${value}（${percent}%）</div>`
                            );
                            var isShowBatch = true;
                            for (let i = 0; i < seriesDatas.length; i++) {
                                if (!seriesDatas.name) {
                                    isShowBatch = false;
                                }
                            }
                            if (isShowBatch) {
                                tooltip.push('<hr/>');
                                seriesDatas.map(item => {
                                    tooltip.push(
                                        `<div><span style="display: inline-block;width: 100px;">${item.name}:</span> ${item.value}</div>`
                                    );
                                });
                            }

                            return `<div>${tooltip.join('')}</div>`;
                        }
                    },
                    legend: {
                        type: 'plain',
                        show: true,
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: legendData,
                        selected: selected
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: this.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            }
        }
    };
</script>
