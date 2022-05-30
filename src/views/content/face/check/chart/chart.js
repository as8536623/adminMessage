// 学员互动参与率
export function rateChartFun(config) {
    const eChart = window.echarts.init(config.elem);
    const option = {
        color: ['#3398DB'],
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            padding: [5, 10],
            borderRadius: 2,
            textStyle: {
                fontSize: 14,
                color: '#FFFFFF'
            }
        },
        grid: {
            left: '0',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    // X轴刻度配置
                    interval: 0, // 0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                    show: true,
                    textStyle: {
                        color: '#666666',
                        fontSize: 14
                    },
                    formatter: function(params) {
                        return params.length > 5 ? params.substring(0, 5) + '...' : params;
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#666666', // 左边线的颜色
                        width: '1' // 坐标线的宽度
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                lineStyle: {
                    color: ['#666666'],
                    width: 1,
                    type: 'solid',
                    opacity: 0.1
                }
            }
        ],
        series: [
            {
                name: '参与率%',
                type: 'bar',
                barWidth: '30px',
                data: []
            }
        ]
    };
    eChart.setOption(option);
    return {
        eChart,
        setData(d) {
            const v = [];
            const vName = [];
            d.map(item => {
                const passNum = item.passNum ? item.passNum : 0;
                const totalNum = item.totalNum ? item.totalNum : 0;
                const rate = ((passNum / totalNum) * 100).toFixed(2);
                v.push(rate);
                vName.push(item.name);
            });
            eChart.setOption({
                xAxis: [
                    {
                        data: vName
                    }
                ],
                series: [
                    {
                        data: v
                    }
                ],
                tooltip: {
                    formatter: function(params) {
                        const item = params[0];
                        // let passNum = d[item.dataIndex].passNum ? d[item.dataIndex].passNum : 0;
                        // let totalNum = d[item.dataIndex].totalNum ? d[item.dataIndex].totalNum : 0;
                        // let rate = ((passNum / totalNum) * 100).toFixed(2);
                        let html = `<div>`;
                        html += `<div>${item.name}</div>`;
                        html += `<div><span style="color: #ffffff">${item.seriesName}</span>：`;
                        html += `<span style="color: #ffffff">${item.value}</span></div>`;
                        html += `</div>`;
                        return html;
                    }
                }
            });
        }
    };
}

const color = ['#4BCCFD', ' #02D4B1', '#DEFCF8'];

// 互动形式
export function interactionChartFun(config) {
    const eChart = window.echarts.init(config.elem);
    const pieOption = {
        grid: {
            x: 25
        },
        tooltip: {
            show: true,
            trigger: 'item',
            position: function(p) {
                // 其中p为当前鼠标的位置
                return [p[0] + 10, p[1] - 10];
            },
            formatter: '{b} : {d}%',
            padding: [5, 10],
            borderRadius: 2,
            textStyle: {
                fontSize: 14,
                color: '#FFFFFF'
            }
        },
        legend: {
            icon: 'circle', // 设置图标现状
            itemWidth: 8, // 设置图标大小
            itemHeight: 8,
            itemGap: 20, // 设置图标间距
            bottom: 0,
            left: 'center',
            data: [],
            textStyle: {
                // 图例文字的样式
                color: '#666666',
                fontSize: 14
            }
        },
        toolbox: {
            show: true,
            feature: {}
        },
        calculable: true,
        series: [
            {
                type: 'pie',
                color: color,
                radius: ['0', '60%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    }
                },
                labelLine: {
                    show: true
                },
                data: []
            }
        ]
    };
    eChart.setOption(pieOption);
    return {
        eChart,
        setData(d) {
            const vName = [];
            d.map(item => {
                vName.push(item.name);
            });
            eChart.setOption({
                series: [
                    {
                        data: d
                    }
                ],
                legend: {
                    data: vName
                }
            });
        }
    };
}

// 互动参与情况
export function interactFun(config) {
    const eChart = window.echarts.init(config.elem);
    const pieOption = {
        grid: {
            x: 25
        },
        tooltip: {
            show: true,
            trigger: 'item',
            position: function(p) {
                // 其中p为当前鼠标的位置
                return [p[0] + 10, p[1] - 10];
            },
            formatter: '{b} : {d}%',
            padding: [5, 10],
            borderRadius: 2,
            textStyle: {
                fontSize: 14,
                color: '#FFFFFF'
            }
        },
        legend: {
            icon: 'circle', // 设置图标现状
            itemWidth: 8, // 设置图标大小
            itemHeight: 8,
            itemGap: 20, // 设置图标间距
            bottom: 0,
            left: 'center',
            data: [],
            textStyle: {
                // 图例文字的样式
                color: '#666666',
                fontSize: 14
            }
        },
        toolbox: {
            show: true,
            feature: {}
        },
        calculable: true,
        series: [
            {
                type: 'pie',
                radius: ['45%', '60%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    }
                },
                labelLine: {
                    show: true
                },
                data: []
            }
        ]
    };
    eChart.setOption(pieOption);
    return {
        eChart,
        setData(d) {
            const vName = [];
            d.map(item => {
                vName.push(item.name);
            });
            eChart.setOption({
                series: [
                    {
                        data: d
                    }
                ],
                legend: {
                    data: vName
                }
            });
        }
    };
}

// 培训人数
export function trainChartFun(config) {
    const eChart = window.echarts.init(config.elem);
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}，{d}%'
        },
        legend: {
            show: false
        },
        calculable: true,
        series: [
            {
                type: 'funnel',
                left: '10%',
                width: '75%',
                label: {
                    normal: {
                        formatter: '{b}: {c}'
                    },
                    emphasis: {
                        position: 'inside',
                        formatter: '{b}: {c}'
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        opacity: 0.7
                    }
                },
                data: []
            }
        ]
    };
    eChart.setOption(option);
    return {
        eChart,
        setData(d) {
            // let total = 0;
            const vName = [];
            d.map(item => {
                vName.push(item.name);
                // total += item.value;
            });
            eChart.setOption({
                series: [
                    {
                        data: d
                    }
                ],
                legend: {
                    data: vName
                }
            });
        }
    };
}
