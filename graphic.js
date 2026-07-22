var points = [];
var heatmapOverlay;
function get_data() {
    var dataSet = [];          // 在函数内设置一个变量
    $.ajax({
        url: '/static/data/0912_heart.csv',
        async: false,         // ajax 取消异步状态
        success: function (csvstr) {
            dataSet = mapv.csv.getDataSet(csvstr);    // 得到数据
            dataSet.initGeometry();                  // 得到经纬度
        },
    });
    // 返回该变量，变成外部变量
    points = dataSet._data;
    return dataSet._data;
}

  // 按钮0
function echart_0() {
    var myChart = echarts.init(document.getElementById('chart_0'));
    // 读取json数据
    $.get('/static/data/styleJson.json').done(function (styleJson) {
        // 新创建地图
        var map = new BMap.Map("chart_0");
        map.centerAndZoom(new BMap.Point(117.04, 36.678), 14);
        map.enableScrollWheelZoom();

        map.setMapStyleV2({
            styleJson
        });

        var data = get_data();
        var dataSet2 = new mapv.DataSet(data);
        var options2 = {
            draw: 'heatmap',
            size: 7, // 每个热力点半径大小
            gradient: { // 热力图渐变色
                0.25: "rgb(0,0,255)",
                0.55: "rgb(0,255,0)",
                0.85: "yellow",
                1.0: "rgb(255,0,0)"
            },
            max: 15, // 最大权重值
        };

        var mapvLayer = new mapv.baiduMapLayer(map, dataSet2, options2);
    })
}
function getValue() {
    var map = new BMap.Map("chart_0");
    map.centerAndZoom(new BMap.Point(117.078115728003, 36.6721433229127), 13);
    map.enableScrollWheelZoom();      // 初始化地图界面

    // 设置地图样式 'midnight'
    map.setMapStyle({
        style: 'midnight'
    });

    var timest = document.f.t.value;    // 获取输入的时间
    var timestar = new Date(timest).getTime();    // 将时间转为UTC
    // console.log(timestar)
    var data_new = points.filter(function (item) {
        return (timestar + 15 * 60 * 1000 > new Date(item.time).getTime()) && (new Date(item.time).getTime() >= timestar);
    });        // 提取时间内的数据
    // console.log(data\_new);

    heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 20});
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data: data_new, max: 10});    // 设置热力格式

    heatmapOverlay.show();    // 展示热力界面
}
function echart_1() {
// 按钮1rt_1() {
    var dom = document.getElementById("chart_1");
    var myChart = echarts.init(dom);
    option = null;

    var schema = [
        {name: '距离', index: 0},
        {name: '时段', index: 1},
        {name: '耗时', index: 2},
    ];

    var fieldIndices = schema.reduce(function (obj, item) {
        obj[item.name] = item.index;
        return obj;
    }, {});

    var data;

    var config = {
        xAxis3D: '耗时',
        yAxis3D: '时段',
        zAxis3D: '距离',
        color: '时段',      // 以'fiber'这一列作为颜色的划分
    };

    $.getJSON('/static/data/record.json', function (_data) {
        data = _data;

        myChart.setOption({
            tooltip: {},
            visualMap: [
                {
                    top: 10,
                    left: 20,
                    calculable: true,
                    dimension: 1,        // 指定用数据的『哪个维度』，映射到视觉元素上
                    max: 24,
                    inRange: {            // 定义 在选中范围中 的视觉元素
                        color: ['#1710c0', '#0b9df0', '#00fea8', '#00ff0d', '#f5f811', '#f09a09', '#fe0300']
                    },
                    textStyle: {
                        color: '#fff'
                    }
                }
            ],
            xAxis3D: {
                name: config.xAxis3D + '(s)',
                type: 'value'
            },
            yAxis3D: {
                name: config.yAxis3D + '(点)',
                type: 'value'
            },
            zAxis3D: {
                name: config.zAxis3D + '(m)',
                type: 'value'
            },
            grid3D: {
                // environment: '#0c1b2d',    // 背景色
                axisLine: {         // 表格的网
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisPointer: {     // 指引线
                    lineStyle: {
                        color: '#ffbd67'
                    }
                },
                viewControl: {
                    // autoRotate: true
                    // projection: 'orthographic'
                }
            },
            series: [{
                type: 'scatter3D',
                dimensions: [      // 对点的信息表述有重要作用
                    config.xAxis3D,
                    config.yAxis3D,
                    config.zAxis3D,
                    'color',
                    'idx'
                ],
                data: data.map(function (item, idx) {
                    return [
                        item[fieldIndices[config.xAxis3D]],
                        item[fieldIndices[config.yAxis3D]],
                        item[fieldIndices[config.zAxis3D]],
                        item[fieldIndices[config.color]],      // 表示颜色的一维
                        idx
                    ];
                }),
                symbolSize: 12,     // 标记的大小，可以设置成诸如 10 这样单一的数字
                itemStyle: {        // 散点图颜色描边等样式
                    borderWidth: 1,      // 图形描边宽度
                    borderColor: 'rgba(255,255,255,0.8)'   // 图形描边颜色
                },
                emphasis: {         // 图形和标签高亮的样式
                    itemStyle: {
                        color: '#fff'     // 图形的颜色
                    }
                }
            }]
        });

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    })
}

// 按钮2
function echart_2() {
var map = new BMap.Map("map", {
        enableMapClick: false
    });  // 创建Map实例
    map.centerAndZoom(new BMap.Point(117.078115728003, 36.6721433229127), 14);  // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    // 设置地图样式 'midnight'
    map.setMapStyle({
        style: 'grayscale'
    });

    $.get('/static/data/0912_heart.csv', function (csvstr) {
        var dataSet = mapv.csv.getDataSet(csvstr);
        dataSet.initGeometry();  // 读取经纬度的地方
        // 获取当前数据集的数据
        var data = dataSet.get();
        for (var i = 0; i < data.length; i++) {
            var time = data[i].time;
            data[i].time = new Date(time).getTime();
            // Date 返回该日期到1970年1月1日午夜之间的毫秒数
        }
        // 修改数据集的内容
        dataSet.set(data);
        console.log(data);

        // 添加百度地图可视化叠加层
        var options = {
            // size: 900,    // 每个热力点半径大小
            unit: 'm',    // 以米为单位绘制，会跟随地图比例放大缩小
            // gradient 热力图渐变色
            //gradient: {0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
            max: dataSet.getMax('count') * 0.7,   // 最大权重值
            animation: {
                type: 'time',    // 按时间展示动画
                trails: 15 * 60 * 1000,  // 时间动画的拖尾大小,15分钟为时间间隔
                duration: 20,     // 单个动画的时间，单位秒
            },
            updateCallback: function (e) {
                var time = new Date(e);
                $('#panel').html('时间' + time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() +
                    '日 ' + time.getHours() + ':' + time.getMinutes());
            },
            // coordType: 'bd09ll',  // 可选百度墨卡托坐标类型bd09mc和百度经纬度坐标类型bd09ll(默认)
            draw: 'bubble'
        };

        var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
        $('#loading').hide();
    });
}

// 按钮3
function echart_3() {
    // 初始化
    var dom = document.getElementById("chart_3");
    var myChart = echarts.init(dom);

    option = null;

    // JSON引入示例
    $.get('../static/data/JiNan.json', function (geoJson) {
        // 注册可用的地图，必须在包括 geo 组件或者 map 图表类型的时候才能使用
        echarts.registerMap('JiNan', geoJson);

        myChart.setOption(option = {
            title: {
                text: '2013年济南市10区人口地图',
                textStyle: {
                    color: '#fdffff',
                    fontSize: 25
                }
            },
            tooltip: {
                // 标签激活，鼠标移上去。会显示数据
                trigger: 'item',
                formatter: '{b}<br/>{c} (万人)'
            },
            toolbox: {
                // 工具箱
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            visualMap: {
                // 视觉映射组件，用于进行「视觉编码」，也就是将数据映射到视觉元素（视觉通道）
                show: false,
                min: 30,
                max: 90,
                text: ['High', 'Low'],
                realtime: false,
                // ture:拖拽手柄过程中实时更新图表视图。false:拖拽结束时，才更新视图。
                calculable: true,
                // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
                inRange: {
                    // 定义 在选中范围中 的视觉元素
                    color: ['lightskyblue', 'yellow', 'orangered']
                }
                // 左下角的数量条
            },
            series: [
                {
                    name: '济南市2013年10区人口密度',
                    type: 'map',
                    mapType: 'JiNan', // 自定义扩展图表类型
                    itemStyle: {
                        normal: {label: {show: true}},
                        emphasis: {label: {show: true}}
                    },
                    data: [
                        {name: '历下区', value: 77.15},
                        {name: '市中区', value: 72.87},
                        {name: '章丘区', value: 108.66},
                        {name: '槐荫区', value: 48.74},
                        {name: '历城区', value: 114.81},
                        {name: '平阴县', value: 33.72},
                        {name: '天桥区', value: 70.25},
                        {name: '济阳区', value: 52.58},
                        {name: '长清区', value: 59.06},
                        {name: '商河县', value: 57.16},
                    ]
                }
            ]
        });
    });

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

﻿// 按钮4
function echart_4() {
    var dom = document.getElementById("chart_4");
    var myChart = echarts.init(dom);

    var hours = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
        '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
    var daysCN = ['周日','周一','周二','周三','周四','周五','周六'];

    function loadData() {
        var result = [];
        $.ajax({
            url: '../static/data/JN_TIME_O_WEEK.csv', async: false,
            success: function (csvstr) {
                var ds = mapv.csv.getDataSet(csvstr)._data;
                for (var i = 0; i < ds.length; i++) {
                    var d = new Date(ds[i].time);
                    result.push([d.getHours(), d.getDay(), parseInt(ds[i].count)]);
                }
            }
        });
        return result;
    }

    var data = loadData();

    // Find max for color scale
    var maxVal = 0, minVal = 999999;
    data.forEach(function(d) { if (d[2] > maxVal) maxVal = d[2]; if (d[2] < minVal) minVal = d[2]; });

    option = {
        title: { text: '一周客流量热力分布', left: 'center', top: 5, textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: {
            position: 'top',
            formatter: function(p) {
                return daysCN[p.data[1]] + ' ' + hours[p.data[0]] + '<br/>客流量: <b>' + p.data[2].toLocaleString() + '</b> 人次';
            }
        },
        grid: { left: 90, right: 160, top: 50, bottom: 40 },
        xAxis: {
            type: 'category', data: hours, splitArea: { show: true, areaStyle: { color: ['rgba(0,0,0,0.1)','rgba(255,255,255,0.03)'] } },
            axisLabel: { color: '#aaa', fontSize: 10, interval: 2 },
            axisLine: { lineStyle: { color: '#335577' } }
        },
        yAxis: {
            type: 'category', data: daysCN, splitArea: { show: true, areaStyle: { color: ['rgba(0,0,0,0.1)','rgba(255,255,255,0.03)'] } },
            axisLabel: { color: '#aaa', fontSize: 11 },
            axisLine: { lineStyle: { color: '#335577' } }
        },
        visualMap: {
            min: minVal, max: maxVal, calculable: true,
            orient: 'vertical', right: 10, top: 'center',
            text: ['高', '低'], textStyle: { color: '#ccc' },
            inRange: { color: ['#0a1628','#0d3360','#1a5e9e','#3399cc','#66ccee','#f4a261','#e76f51'] },
            itemWidth: 16, itemHeight: 160
        },
        series: [{
            name: '客流量', type: 'heatmap', data: data,
            label: { show: true, color: '#fff', fontSize: 10,
                formatter: function(p) { return p.data[2] > maxVal * 0.5 ? (p.data[2]/1000).toFixed(1)+'k' : ''; } },
            emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(255,255,255,0.4)', borderColor: '#fff', borderWidth: 1 } }
        }]
    };

    myChart.setOption(option);
    window.addEventListener('resize', function () { myChart.resize(); });
}
// 按钮5
function echart_5() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chart_5'));

    function showProvince() {
        var geoCoordMap = {
            '济南市': [117.078115728003, 36.6721433229127],
        };
        var data = [{
            name: '济南市',
            value: 100
        }];

        var max = 480,
            min = 9; // todo
        var maxSize4Pin = 100,
            minSize4Pin = 20;

        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };

        myChart.setOption(option = {
            geo: {
                show: true,
                map: 'shandong',
                mapType: 'shandong',
                zoom: 1,
                label: {
                    normal: {},
                    //鼠标移入后查看效果
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                //鼠标缩放和平移
                roam: true,
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(147, 235, 248, 1)',
                        borderWidth: 1,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba( 47,79,79, .2)' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(128, 217, 248, 1)',
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                }
            },
            series: [{
                name: 'light',
                type: 'map',
                coordinateSystem: 'geo',
                data: convertData(data),
                itemStyle: {
                    normal: {
                        color: '#F4E925'
                    }
                }
            },
            {
                name: '点',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin',
                symbolSize: function (val) {
                    var a = (maxSize4Pin - minSize4Pin) / (max - min);
                    var b = minSize4Pin - a * min;
                    b = maxSize4Pin - a * max;
                    return a * val[2] + b;
                },
                label: {
                    normal: {}
                },
                itemStyle: {
                    normal: {
                        color: '#F62157', //标志颜色
                    }
                },
                zlevel: 6,
                data: convertData(data),
            },
            {
                name: '',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(data.sort(function (a, b) {
                    return b.value - a.value;
                }).slice(0, 5)),
                symbolSize: function (val) {
                    return val[2] / 10;
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#05C3F9',
                        shadowBlur: 10,
                        shadowColor: '#05C3F9'
                    }
                },
                zlevel: 1
            }
            ]
        });
    }

    showProvince();

    window.addEventListener("resize", function () {
        myChart.resize();
    });
}
﻿// 按钮6
function echart_6() {
    var dom = document.getElementById("chart_6");
    var myChart = echarts.init(dom, 'dark');
    option = null;

    function get_flaw_data() {
        var data_TIME = {time: [], week: [], num_05: []};
        $.ajax({
            url: '../static/data/JN_TIME_O.csv', async: false,
            success: function (csvstr) {
                dataSet = mapv.csv.getDataSet(csvstr);
                var data = dataSet._data;
                for (var i = 0; i < data.length; i++) {
                    data_TIME.time.push(data[i].O_time.replace('2013-', ''));
                    data_TIME.week.push(new Date(data[i].O_time).getDay());
                    data_TIME.num_05.push(parseFloat(data[i].count));
                }
            }
        });
        return data_TIME;
    }

    var DIDI_TIME = get_flaw_data();

    function yiTouShu02() {
        var data_TIME = {time: [], rain: [], wind: [], temp: [], hum: []};
        $.ajax({
            url: '../static/data/jn_weather_c.csv', async: false,
            success: function (csvstr) {
                dataSet = mapv.csv.getDataSet(csvstr);
                var data = dataSet._data;
                for (var i = 0; i < data.length; i++) {
                    data_TIME.time.push(data[i].Time_new.replace('2013-', ''));
                    data_TIME.rain.push(parseFloat(data[i].Precip));
                    data_TIME.wind.push(parseFloat(data[i].Wind_Speed));
                    data_TIME.temp.push(parseFloat(data[i].Temperature));
                    data_TIME.hum.push(parseFloat(data[i].Humidity));
                }
            }
        });
        return data_TIME;
    }

    var weather_TIME = yiTouShu02();

    option = {
        title: {
            text: '天气与客流量关系图',
            left: 'center', top: 5,
            textStyle: { color: '#fff', fontSize: 16, fontWeight: 'normal' }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                var r = '<b>' + params[0].axisValue + '</b><br/>';
                for (var i = 0; i < params.length; i++) {
                    r += params[i].marker + ' ' + params[i].seriesName + ': ' + params[i].value + '<br/>';
                }
                return r;
            }
        },
        legend: {
            data: ['客流量', '降雨量', '风速', '湿度', '温度'],
            top: 30, textStyle: { color: '#ccc' },
            selected: { '风速': false, '湿度': false }
        },
        backgroundColor: '#0c1c31',
        dataZoom: [
            { show: true, realtime: true, start: 10, end: 70, xAxisIndex: [0, 1], bottom: 5, height: 20,
              textStyle: { color: '#aaa' }, borderColor: '#335577' },
            { type: 'inside', realtime: true, start: 30, end: 70, xAxisIndex: [0, 1] }
        ],
        grid: [
            { left: 60, right: 60, top: 70, height: '38%' },
            { left: 60, right: 60, top: '56%', height: '34%' }
        ],
        xAxis: [
            { type: 'category', boundaryGap: false, axisLine: { onZero: true, lineStyle: { color: '#557799' } },
              axisLabel: { color: '#aaa', fontSize: 9, show: false }, data: DIDI_TIME.time },
            { gridIndex: 1, type: 'category', boundaryGap: false, axisLine: { onZero: true, lineStyle: { color: '#557799' } },
              axisLabel: { color: '#aaa', fontSize: 9, interval: 80 }, data: weather_TIME.time, position: 'top' }
        ],
        yAxis: [
            { name: '客流量(人/15min)', type: 'value', nameTextStyle: { color: '#4ea8de' }, axisLabel: { color: '#aaa' },
              splitLine: { lineStyle: { color: '#1e3050', type: 'dashed' } } },
            { gridIndex: 1, type: 'value', inverse: true, name: '天气值', nameTextStyle: { color: '#f4a261' },
              axisLabel: { color: '#aaa' }, splitLine: { lineStyle: { color: '#1e3050', type: 'dashed' } } }
        ],
        series: [
            { name: '客流量', type: 'line', data: DIDI_TIME.num_05, symbol: 'none',
              lineStyle: { color: '#4ea8de', width: 2 },
              areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[
                  {offset:0,color:'rgba(78,168,222,0.4)'},{offset:1,color:'rgba(78,168,222,0.02)'}])} },
            { name: '降雨量', type: 'bar', xAxisIndex: 1, yAxisIndex: 1,
              data: weather_TIME.rain, barWidth: '60%', itemStyle: { color: '#90e0ef' } },
            { name: '风速', type: 'line', xAxisIndex: 1, yAxisIndex: 1,
              data: weather_TIME.wind, symbol: 'none', lineStyle: { color: '#888', type: 'dotted', width: 1 } },
            { name: '湿度', type: 'line', xAxisIndex: 1, yAxisIndex: 1,
              data: weather_TIME.hum, symbol: 'none', lineStyle: { color: '#6c5ce7', type: 'dotted', width: 1 } },
            { name: '温度', type: 'line', xAxisIndex: 1, yAxisIndex: 1,
              data: weather_TIME.temp, symbol: 'none', lineStyle: { color: '#ff6b6b', width: 2.5 } }
        ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', function () { myChart.resize(); });
}
var myVar = null; // 载客车辆的定时器
﻿// 按钮7
var myVar = null;
function echart_7() {
    var dom = document.getElementById("chart_7");
    var myChart = echarts.init(dom);

    function yy_cl() {
        var numb = [];
        $.ajax({
            url: '../static/data/JN_o_number.csv', async: false,
            success: function (csvstr) {
                var dataSet = mapv.csv.getDataSet(csvstr)._data;
                for (var i = 0; i < dataSet.length; i++) {
                    numb.push({
                        value: parseFloat(dataSet[i].number),
                        name: dataSet[i].TIME.substr(11, 16)
                    });
                }
            }
        });
        return numb;
    }

    var dataSet = yy_cl();
    var time = ("0000000000000000" + new Date().getHours()).substr(-2) + ':' +
               ("0000000000000000" + new Date().getMinutes()).substr(-2) + ':00';
    for (var k = 0; k < dataSet.length; k++) {
        if (dataSet[k].name === time) { dataSet = dataSet.slice(k); break; }
    }

    option1 = {
        backgroundColor: '#0c1a2d',
        tooltip: { formatter: "{a}: {c} 辆" },
        toolbox: { feature: { restore: {}, saveAsImage: {} } },
        series: [{
            name: '载客车辆', type: 'gauge', min: 0, max: 4180, splitNumber: 11,
            radius: '55%', center: ['50%', '55%'],
            axisLine: { lineStyle: {
                color: [[0.15, '#67e0a5'], [0.5, '#4ea8de'], [0.85, '#f4a261'], [1, '#e76f51']],
                width: 8, shadowColor: '#4ea8de', shadowBlur: 15
            }},
            axisLabel: { textStyle: { color: '#ccc', fontSize: 12 } },
            axisTick: { length: 12, lineStyle: { color: 'auto', shadowBlur: 8 } },
            splitLine: { length: 22, lineStyle: { width: 3, color: '#fff', shadowBlur: 10 } },
            pointer: { shadowColor: '#4ea8de', shadowBlur: 8, length: '70%', width: 6 },
            title: { offsetCenter: [0, '75%'], textStyle: { fontSize: 16, color: '#ccc' } },
            detail: {
                offsetCenter: [0, '45%'], borderRadius: 6, backgroundColor: '#1a3050',
                borderColor: '#4ea8de', borderWidth: 2, width: 120, color: '#fff',
                fontSize: 28, fontWeight: 'bold', fontFamily: 'Arial',
                formatter: '{value} 辆'
            },
            data: [{ value: dataSet[0].value, name: '实时载客车辆' }]
        }]
    };

    var nN = 0;
    clearTimeout(myVar);
    myVar = setInterval(function () {
        option1.series[0].data[0].value = dataSet[nN].value;
        nN++;
        if (nN >= dataSet.length) nN = 0;
        myChart.setOption(option1, true);
    }, 2000);

    myChart.setOption(option1);
    window.addEventListener('resize', function () { myChart.resize(); });
}
﻿// 按钮8
﻿// 按钮8
function echart_8() {
    var dom = document.getElementById("chart_8");
    var myChart = echarts.init(dom);

    function loadData() {
        var result = [];
        $.ajax({
            url: '../static/data/JN_LuC.csv', async: false,
            success: function (csvstr) {
                var ds = mapv.csv.getDataSet(csvstr)._data;
                var weekDays = ['周一','周二','周三','周四','周五','周六','周日'];
                for (var i = 0; i < ds.length; i++) {
                    result.push({
                        day: weekDays[i],
                        near: parseFloat(ds[i].near),
                        middle: parseFloat(ds[i].middle),
                        far: parseFloat(ds[i].far)
                    });
                }
            }
        });
        return result;
    }

    var rawData = loadData();
    var days = rawData.map(function(d){return d.day;});
    var nearData = rawData.map(function(d){return d.near;});
    var midData  = rawData.map(function(d){return d.middle;});
    var farData  = rawData.map(function(d){return d.far;});

    // Percentage for labels
    var totals = rawData.map(function(d){return d.near + d.middle + d.far;});

    option = {
        title: { text: '每日路程分布', left: 'center', top: 5, textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: {
            trigger: 'axis', axisPointer: { type: 'shadow' },
            formatter: function(p) {
                var html = '<b>' + p[0].axisValue + '</b><br/>';
                var total = totals[p[0].dataIndex];
                for (var i = p.length-1; i >= 0; i--) {
                    var pct = (p[i].value / total * 100).toFixed(1);
                    html += p[i].marker + ' ' + p[i].seriesName + ': <b>' + p[i].value.toLocaleString() + '</b> (' + pct + '%)<br/>';
                }
                return html;
            }
        },
        legend: { data: ['近距离 (<3km)', '中距离 (3-10km)', '远距离 (>10km)'], top: 30, textStyle: { color: '#ccc' } },
        grid: { left: 70, right: 40, top: 70, bottom: 30 },
        xAxis: {
            type: 'value', name: '次数',
            nameTextStyle: { color: '#aaa' },
            axisLabel: { color: '#aaa', formatter: function(v){return (v/1000).toFixed(0)+'k';} },
            splitLine: { lineStyle: { color: '#1e3050', type: 'dashed' } }
        },
        yAxis: {
            type: 'category', data: days,
            axisLabel: { color: '#ccc', fontSize: 12 },
            axisLine: { lineStyle: { color: '#335577' } },
            axisTick: { show: false }
        },
        series: [
            {
                name: '近距离 (<3km)', type: 'bar', stack: 'total', data: nearData,
                itemStyle: { color: new echarts.graphic.LinearGradient(0,0,1,0,[
                    {offset:0,color:'#1a659e'},{offset:1,color:'#4ea8de'}]) },
                label: { show: true, position: 'insideRight', color: '#fff', fontSize: 10,
                    formatter: function(p){ var pct = (p.value/totals[p.dataIndex]*100).toFixed(0); return pct+'%'; } }
            },
            {
                name: '中距离 (3-10km)', type: 'bar', stack: 'total', data: midData,
                itemStyle: { color: new echarts.graphic.LinearGradient(0,0,1,0,[
                    {offset:0,color:'#e07b39'},{offset:1,color:'#f4a261'}]) },
                label: { show: true, position: 'insideRight', color: '#fff', fontSize: 10,
                    formatter: function(p){ var pct = (p.value/totals[p.dataIndex]*100).toFixed(0); return pct+'%'; } }
            },
            {
                name: '远距离 (>10km)', type: 'bar', stack: 'total', data: farData,
                itemStyle: { color: new echarts.graphic.LinearGradient(0,0,1,0,[
                    {offset:0,color:'#c0392b'},{offset:1,color:'#e76f51'}]) },
                label: { show: true, position: 'insideRight', color: '#fff', fontSize: 10,
                    formatter: function(p){ var pct = (p.value/totals[p.dataIndex]*100).toFixed(0); return pct+'%'; } }
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', function () { myChart.resize(); });
}
// 按钮9
function echart_9() {
    var dom = document.getElementById("chart_9");
    var myChart = echarts.init(dom);
    option = null;

    myChart.showLoading();

    var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    function get_speed() {
        var data_TIME = { date: [], time: [], week: [], SD: [] };
        $.ajax({
            url: '../static/data/JN_5T_kmh.csv', async: false,
            success: function (csvstr) {
                var dataSet = mapv.csv.getDataSet(csvstr);
                var data = dataSet._data;
                for (var i = 0, _l = data.length - 1; i < _l; i++) {
                    data_TIME.date.push(data[i].O_time.replace('2013-', '').slice(0, 5));
                    data_TIME.time.push(data[i].O_time.replace('2013-', '').slice(6, -3));
                    data_TIME.week.push(weekday[new Date(data[i].O_time).getDay()]);
                    data_TIME.SD.push(parseFloat(data[i].sudu));
                }
            }
        });
        return data_TIME;
    }

    var DIDI_TIME0 = get_speed();
    var time_line = Array.from(new Set(DIDI_TIME0.date));

    myChart.hideLoading();

    option = {
        baseOption: {
            timeline: {
                axisType: 'category', orient: 'vertical', autoPlay: true, inverse: true,
                playInterval: 1200, right: 0, top: 20, bottom: 20, width: 55,
                label: { normal: { textStyle: { color: '#aaa' } } },
                symbol: 'none', lineStyle: { color: '#4060a0' },
                checkpointStyle: { color: '#4ea8de', borderColor: '#90e0ef', borderWidth: 2 },
                controlStyle: { showNextBtn: false, showPrevBtn: false,
                    normal: { color: '#557799', borderColor: '#557799' } },
                data: time_line
            },
            backgroundColor: '#0c1a2d',
            title: [
                { text: time_line[0], textAlign: 'center', left: '62%', top: '52%',
                  textStyle: { fontSize: 40, color: 'rgba(255,255,255,0.4)' } },
                { text: '城市交通状态监控（平均车速）', left: 10, top: 5,
                  textStyle: { color: '#fff', fontSize: 16, fontWeight: 'normal' } }
            ],
            tooltip: { trigger: 'axis', formatter: '{b}<br/>车速: <b>{c} km/h</b>' },
            grid: { top: 90, containLabel: true, left: 40, right: 110 },
            visualMap: {
                show: false,
                pieces: [
                    { gt: 0.6, lte: 14, color: '#e74c3c' },
                    { gt: 14, lte: 18, color: '#f4a261' },
                    { gt: 18, color: '#2ecc71' }
                ],
                outOfRange: { color: '#999' }
            },
            xAxis: {
                type: 'category', name: '时间', nameLocation: 'middle', nameGap: 28,
                splitLine: { show: false }, axisLine: { lineStyle: { color: '#557799' } },
                axisLabel: { color: '#aaa', fontSize: 9, interval: 30 },
                data: DIDI_TIME0.time.slice(0, 288).slice(84, 288)
            },
            yAxis: {
                type: 'value', name: '道路速度 (km/h)', max: 26, min: 10,
                nameTextStyle: { color: '#aaa' }, axisLine: { lineStyle: { color: '#557799' } },
                axisLabel: { color: '#aaa' }, splitLine: { lineStyle: { color: '#1e3050', type: 'dashed' } }
            },
            series: [{
                type: 'line', data: DIDI_TIME0.SD.slice(0, 288).slice(84, 288),
                symbol: 'none', lineStyle: { width: 2.5 },
                areaStyle: { opacity: 0.15 },
                markLine: {
                    silent: true, symbol: 'none',
                    label: { formatter: '{b}', color: '#aaa' },
                    data: [
                        { name: '拥堵线 14km/h', yAxis: 14, lineStyle: { color: '#e74c3c', type: 'dashed' } },
                        { name: '缓行线 18km/h', yAxis: 18, lineStyle: { color: '#f4a261', type: 'dashed' } }
                    ]
                }
            }]
        },
        options: []
    };

    for (var n = 0; n < DIDI_TIME0.time.length; n += 288) {
        option.options.push({
            title: { show: true, text: DIDI_TIME0.week.slice(n, n + 288)[0] },
            series: {
                name: DIDI_TIME0.time.slice(n, n + 288).slice(84, 288),
                type: 'line',
                data: DIDI_TIME0.SD.slice(n, n + 288).slice(84, 288)
            }
        });
    }

    myChart.setOption(option);
    window.addEventListener('resize', function () { myChart.resize(); });
}


//------------------------------------------------------------------------------------------------------------------

//操作按钮

// 按钮0
function show_map_jn(){
    $('.center_text').css('display', 'none');
    $('.t_cos0').css('display', 'block');
    echart_0();
}

// 按钮1
function show_time(){
        $('.center_text').css('display', 'none');
        $('.t_cos3').css('display', 'block');
        echart_1();
}

// 按钮2
function show_heart(){
        $('.center_text').css('display', 'none');
        $('.t_cos14').css('display', 'block');
        echart_2();
}

// 按钮3
function show_pop(){
        $('.center_text').css('display', 'none');
        $('.t_cos13').css('display', 'block');
        echart_3();
}

// 按钮4
function show_week(){
        $('.center_text').css('display', 'none');
        $('.t_cos2').css('display', 'block');
        echart_4();
}

// 按钮5
function show_map_sd(){
        $('.center_text').css('display', 'none');
        $('.t_cos1').css('display', 'block');
        echart_5();
}

// 按钮6
function show_weather(){
        $('.center_text').css('display', 'none');
        $('.t_cos7').css('display', 'block');
        echart_6();
}

// 按钮7
function show_num(){
        $('.center_text').css('display', 'none');
        $('.t_cos8').css('display', 'block');
        echart_7();
}

// 按钮8
function show_distance(){
        $('.center_text').css('display', 'none');
        $('.t_cos9').css('display', 'block');
        echart_8();
}

// 按钮9
function show_speed(){
        $('.center_text').css('display', 'none');
        $('.t_cos12').css('display', 'block');
        echart_9();
}











