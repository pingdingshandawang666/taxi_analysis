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

// 按钮4
function echart_4() {
    var dom = document.getElementById("chart_4");
    var myChart = echarts.init(dom);
    option = null;

    // X轴时段标签（和图二底部完全一致）
    var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
        '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];
    // Y轴星期顺序（从上到下和图二一致：周六→周日）
    var days = ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

    // 小时数字0~23 映射到hours数组下标
    const hourToXIdx = {
        0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,
        13:12,14:13,15:14,16:15,17:16,18:17,19:18,20:19,21:20,22:21,23:22
    };
    // getDay()返回值映射Y轴下标：0=周日→下标6，6=周六→下标0
    const dayToYIdx = {0:6,1:5,2:4,3:3,4:2,5:1,6:0};

    var arr = [];
    Array.prototype.range = function (start, end) {
        var length = end - start + 1;
        var step = start - 1;
        return Array.apply(null, {length: length}).map(function () {
            step++;
            return step.toString();
        });
    };

    // 读取CSV数据
    function get_data_flaw() {
        var data_TIME = {xiuying: []};
        $.ajax({
            url: '../static/data/JN_TIME_O_WEEK.csv',
            async: false,
            success: function (csvstr) {
                var dataSet = mapv.csv.getDataSet(csvstr);
                var data = dataSet._data;
                for (var i = 0; i < data.length; i++) {
                    data_TIME.xiuying.push([
                        new Date(data[i].time).getDay(),
                        new Date(data[i].time).getHours(),
                        parseInt(data[i].count)
                    ]);
                }
            }
        });
        return data_TIME;
    }

    var DIDI_data = get_data_flaw();

    // 原始数据 [周几, 小时, 数量] → 转 [小时, 周几, 数量]
    var data_XY = DIDI_data.xiuying.map(function (item) {
        return [item[1], item[0], item[2]];
    });

    // 按单周168条分割多周数据
    var result_XY = [];
    for (var i = 0; i < data_XY.length; i += 168) {
        var weekRaw = data_XY.slice(i, i + 168);
        // 关键：转换为ECharts散点标准格式 [x下标, y下标, count]
        var weekScatter = weekRaw.map(item => {
            const [hour, day, count] = item;
            const x = hourToXIdx[hour] ?? 0;
            const y = dayToYIdx[day] ?? 0;
            return [x, y, count];
        });
        result_XY.push(weekScatter);
    }

    // 格式化每一周的option配置
    function dataForm(obj1) {
        var data_opt = [];
        for (let week = 0; week < obj1.length; week++) {
            var data_0 = {
                title: {
                    text: '一周内客流量分布',
                    left: 20,
                    textStyle: { color: '#fff' }
                },
                series: [{
                    name: '订单量',
                    type: 'scatter',
                    data: obj1[week],
                    itemStyle: {
                        color: '#c92020',
                        opacity: 0.85
                    }
                }]
            };
            data_opt.push(data_0);
        }
        return data_opt;
    }

    var data_opt_0 = dataForm(result_XY);

    // 完整ECharts配置（baseOption公共配置 + timeline + 多周options）
    option = {
        backgroundColor: '#0c1730', // 深色背景匹配图二
        timeline: {
            axisType: 'category',
            autoPlay: true,
            playInterval: 1000,
            left: 100,
            bottom: 5,
            lineStyle: { color: '#4060a0' },
            label: { color: '#fff' },
            controlStyle: { color: '#fff' }
        },
        baseOption: {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return days[params.data[1]] + ' ' + hours[params.data[0]] + '<br/>订单量：' + params.data[2]
                }
            },
            legend: {
                data: ['订单量'],
                right: 10,
                top: 0,
                textStyle: { color: '#fff' }
            },
            xAxis: {
                type: 'category',
                data: hours,
                axisLine: { lineStyle: { color: '#446699' } },
                axisLabel: { color: '#eee' },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#283858'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: days,
                axisLine: { lineStyle: { color: '#446699' } },
                axisLabel: { color: '#eee' },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#283858'
                    }
                }
            },
            // 控制气泡大小（图二凌晨极小、白天巨大）
            visualMap: {
                min: 0,
                max: 600, // 根据你的订单峰值调整，值越大尺寸差距越明显
                show: false,
                dimension: 2,
                inRange: {
                    symbolSize: [4, 65] // 最小气泡/最大气泡尺寸差
                }
            }
        },
        options: data_opt_0 // 多周切换的数据配置
    };

    // 【必加】渲染图表（原代码缺失此行，图表空白核心原因）
    myChart.setOption(option);
    // 窗口自适应
    window.addEventListener('resize', function () {
        myChart.resize();
    });
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
// 按钮6
function echart_6() {
    var dom = document.getElementById("chart_6");
    var myChart = echarts.init(dom, 'dark');
    option = null;

    // 读取交通流量的数据
    function get_flaw_data() {
        var data_TIME = {time: [], week: [], num_05: []};
        $.ajax({
            url: '../static/data/JN_TIME_O.csv',
            async: false,
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

    // 读取天气的数据
    function yiTouShu02() {
        var data_TIME = {time: [], rain: [], wind: [], temp: [], hum: [], vis: []};
        $.ajax({
            url: '../static/data/jn_weather_c.csv',
            async: false,
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
            x: 'left'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}<br/>{a}'
        },
        legend: {
            data: ['客流量', '降雨量', '风速', '湿度', '温度'],
            x: 'right'
        },
        backgroundColor: '#0c1c31',
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 10,
                end: 70,
                xAxisIndex: [0, 1]
            },
            {
                type: 'inside',
                realtime: true,
                start: 30,
                end: 70,
                xAxisIndex: [0, 1]
            }
        ],
        grid: [
            {
                left: 50,
                right: 50,
                height: '35%'
            },
            {
                left: 50,
                right: 50,
                top: '55%',
                height: '35%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                boundaryGap: false,
                axisLine: {onZero: true},
                data: DIDI_TIME.time
            },
            {
                gridIndex: 1,
                type: 'category',
                boundaryGap: false,
                axisLine: {onZero: true},
                data: weather_TIME.time,
                position: 'top'
            }
        ],
        yAxis: [
            {
                name: '人流量(人/15分钟)',
                type: 'value'
            },
            {
                gridIndex: 1,
                type: 'value',
                inverse: true
            }
        ],
        series: [
            {
                name: '客流量',
                type: 'line',
                symbolSize: 8,
                hoverAnimation: true,
                data: DIDI_TIME.num_05
            },
            {
                name: '降雨量',
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: 8,
                hoverAnimation: false,
                data: weather_TIME.rain
            },
            {
                name: '风速',
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: 8,
                hoverAnimation: false,
                data: weather_TIME.wind
            },
            {
                name: '湿度',
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: 8,
                hoverAnimation: false,
                data: weather_TIME.hum
            },
            {
                name: '温度',
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: 8,
                hoverAnimation: false,
                data: weather_TIME.temp
            }
        ]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

// 按钮7
var myVar = null; // 载客车辆的定时器
function echart_7() {
    var dom = document.getElementById("chart_7");
    var myChart = echarts.init(dom);

    function yy_cl() {
        var dataSet = []; // 在函数内设置一个变量
        var numb = [];
        $.ajax({
            url: '../static/data/JN_o_number.csv',
            async: false, // ajax 取消异步状态
            success: function (csvstr) {
                dataSet = mapv.csv.getDataSet(csvstr); // 得到数据
                dataSet = dataSet._data;
                for (var i = 0; i < dataSet.length; i++) {
                    numb.push({
                        value: parseFloat(dataSet[i].number),
                        name: dataSet[i].TIME.substr(11, 16) // 取字符串部分 时: 分: 秒
                    })
                }
            }
        });
        // 返回该变量，变成外部变量
        return numb;
    }

    var dataSet = yy_cl();

    var time = new Date(); // 获得当时的时间
    // time = time.getHours() + ':' + time.getMinutes() + ':00'; // 得到对应的时分秒，整数补零
    time = ("0000000000000000" + time.getHours()).substr(-2) + ':' + ("0000000000000000" + time.getMinutes()).substr(-2) + ':00';
    console.log(time);

    for (var k = 0; k < dataSet.length; k++) {
        if (dataSet[k].name === time) { // 匹配时间
            dataSet = dataSet.slice(k); // 数组重新拼接
        }
    }
    console.log(dataSet);

    option1 = {
        // backgroundColor: '#0c1b2d',
        tooltip: {
            formatter: "{a}: {c}辆"
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '载客车辆',
                type: 'gauge',
                min: 0,
                max: 4180,
                splitNumber: 11,
                radius: '50%',
                axisLine: {
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                        width: 3,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: { // 坐标轴小标记
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: { // 坐标轴小标记
                    length: 15, // 属性length控制线长
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: { // 分隔线
                    length: 25, // 属性length控制线长
                    lineStyle: { // 属性lineStyle (详见lineStyle) 控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: { // 分隔线
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5
                },
                title: {
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail: {
                    fontWeight: 'bolder',
                    borderRadius: 3,
                    backgroundColor: '#444',
                    borderColor: '#aaa',
                    shadowBlur: 5,
                    shadowColor: '#333',
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                    borderWidth: 2,
                    textBorderColor: '#000',
                    textBorderWidth: 2,
                    textShadowBlur: 2,
                    textShadowColor: '#fff',
                    textShadowOffsetX: 0,
                    textShadowOffsetY: 0,
                    fontFamily: 'Arial',
                    width: 100,
                    color: '#eee',
                    rich: {},
                    offsetCenter: [0, '50%'], // x, y, 单位px
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                    }
                },
                data: [{ value: dataSet[0].value, name: '载客车辆数' }],
                // clockwise: false
            }
        ]
    };

    var nN = 0;
    clearTimeout(myVar);
    myVar = setInterval(function () { // setInterval()方法可按照指定的周期（以毫秒计）来调用函数或计算表达式
        option1.series[0].data[0].value = dataSet[nN].value;
        nN++;
        if (nN > dataSet.length) {
            nN = 0;
        }
        myChart.setOption(option1, true);
    }, 2000);

    if (option1 && typeof option1 === "object") {
        myChart.setOption(option1, true);
    }
}

// 按钮8
function echart_8() {
    var dom = document.getElementById("chart_8");
    var myChart = echarts.init(dom);
    option2 = null;
    var pieRadius = 35;    // 饼图的圆半径

    function PIE_DATA() {
        var dataSet = [];        // 在函数内设置一个变量
        $.ajax({
            url: '../static/data/JN_LuC.csv',
            async: false,        // ajax 取消异步状态
            success: function (csvstr) {
                dataSet = mapv.csv.getDataSet(csvstr);    // 得到数据
                dataSet = dataSet._data;                  // 得到经纬度
            }
        });
        // 返回该变量，变成外部变量
        return dataSet;
    }

    var dataSet = PIE_DATA();
    console.log(dataSet);

    //只不过是支起了2月到3月的28天的日历的架子，数字不重要，日期才重要
    function getVirtulData() {
        //parse() 方法可解析一个日期时间字符串，并返回 1970/1/1 午夜距离该日期时间的毫秒数。
        var date = Date.parse('2013-9-12');
        var end = Date.parse('2013-9-19');
        var dayTime = 3600 * 24 * 1000;    // 60*60*24*1000，一天的毫秒数
        var data = [];
        for (var time = date; time < end; time += dayTime) {
            // 从起止时间（毫秒），到终止时间（毫秒）
            data.push([
                echarts.format.formatTime('yyyy-MM-dd', time),    // 将时间统一格式，转为字符串
                // Math.floor(Math.random() * 10000)    // Math.floor() 返回小于或等于一个给定数字的最大整数
            ]);
        }
        return data;
    }

    function getPieSeries(scatterData, chart) {
        // 遍历数组
        return scatterData.map(function (item, index) {    // item表示日期（位置），index表示索引（数据）
            // console.log(item, index);
            // item:["2017-10-01"]到["2017-10-31"]; index: 0到30
            var center = chart.convertToPixel('calendar', item);    //将时间投影到日历中的位置上，item表示日期
            return {
                id: index + 'pie',
                type: 'pie',
                center: center,        // 饼图的中心（圆心）坐标，绝对的像素值
                label: {               // 饼图图形上的文本标签，可用于说明图形的一些数据信息
                    normal: {
                        formatter: '{d}',    // {c}: 数据值
                        position: 'inside'   // 饼图扇区内部
                    }
                },
                radius: pieRadius,     // 饼图的半径
                data: [    // 指定每个数据项的名称，这时候需要每个项为一个对象
                    {name: '近距离', value: parseFloat(dataSet[index].near)},
                    {name: '中距离', value: parseFloat(dataSet[index].middle)},
                    {name: '远距离', value: parseFloat(dataSet[index].far)}
                ]
            };
        });
    }

    var scatterData = getVirtulData();
    console.log(scatterData);    // 日期

    option2 = {
        tooltip: {},
        legend: {
            textStyle: {color: '#fdffff'},
            data: ['近距离', '中距离', '远距离'],
            bottom: 20
        },
        calendar: {        // 日历设置
            top: 'middle',    // calendar组件离容器上侧的距离。
            left: 'center',
            orient: 'vertical',    // 日历坐标的布局朝向。horizontal/vertical
            cellSize: ['auto', 100],    // 日历每格框的大小，可设置单值 或数组 第一个元素是宽 第二个元素是高。
            // 宽自适应，高为40
            itemStyle: {
                normal: {
                    color: '#0c1f33',
                    borderWidth: 1,
                    borderColor: '#060709'
                }
            },
            yearLabel: {        // 设置日历坐标中 年的样式
                // show: false,
                textStyle: {
                    fontSize: 20
                }
            },
            dayLabel: {         // 设置日历坐标中 星期轴的样式
                margin: 10,     // 星期标签与轴线之间的距离
                firstDay: 0,    // 一周从周几开始，默认从周日开始
                color: '#fdffff',
                nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                // 星期显示的效果
            },
            monthLabel: {       // 月的设置
                // show: false,
                position: 'end',    // 放在右边
                nameMap: 'cn',      // 中文显示
                color: '#fdffff',
                textStyle: {
                    fontSize: 20
                }
            },
            // top: 50,      // 居上，左，右
            // left: 0,
            right: 50,
            range: '2013-9'      // 必填，日历坐标的范围 支持多种格式
        }
        // series: [],
    };

    setTimeout(function () {    // setTimeout()用于在指定的毫秒数后调用函数
        myChart.setOption({
            series: getPieSeries(scatterData, myChart)
        });
    }, 10);    // 等一会的目的，应该是等待myChart建造完毕

    if (option2 && typeof option2 === "object") {
        myChart.setOption(option2, true);
    }
}


// 按钮9
function echart_9() {
    var dom = document.getElementById("chart_9");
    var myChart = echarts.init(dom);
    option = null;

    myChart.showLoading();

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    // 读取交通流量的数据
    function get_speed() {
        var data_TIME = { date: [], time: [], week: [], SD: [] };      // 在函数内设置一个变量
        $.ajax({
            url: '../static/data/JN_5T_kmh.csv',
            async: false,        // ajax 取消异步状态
            success: function (csvstr) {
                var dataSet = mapv.csv.getDataSet(csvstr);    // 得到数据
                var data = dataSet._data;
                for (var i = 0, _l = data.length - 1; i < _l; i++) {
                    data_TIME.date.push(data[i].O_time.replace('2013-', '').slice(0, 5));
                    data_TIME.time.push(data[i].O_time.replace('2013-', '').slice(6, -3));
                    data_TIME.week.push(weekday[new Date(data[i].O_time).getDay()]);
                    data_TIME.SD.push(parseFloat(data[i].sudu));
                }
            }
        });
        // 返回该变量，变成外部变量
        return data_TIME;
    }

    var DIDI_TIME0 = get_speed();
    // console.log(DIDI_TIME0.time.slice(0, 288).slice(84, 288));

    var time_line = Array.from(new Set(DIDI_TIME0.date));    // 时间轴名称

    myChart.hideLoading();

    option = {
        baseOption: {
            timeline: {
                axisType: 'category',        // 轴的类型 'category' 类目轴，适用于离散的类目数据
                orient: 'vertical',          // 摆放方式 'vertical': 竖直放置。
                autoPlay: true,              // 表示是否自动播放。
                inverse: true,               // 是否反向放置 timeline，反向则首位颠倒过来。
                playInterval: 1000,          // 表示播放的速度（跳动的间隔），单位毫秒（ms）
                left: null,                  // timeline组件离容器左侧的距离
                right: 0,
                top: 20,
                bottom: 20,
                width: 55,
                height: null,
                label: {                     // 轴的文本标签
                    normal: {
                        textStyle: {
                            color: '#999'
                        }
                    }
                },
                symbol: 'none',              // timeline标记的图形
                lineStyle: {
                    color: '#555'           // timeline 线的颜色
                },
                checkpointStyle: {           // 『当前项』(checkpoint) 的图形样式。
                    color: '#bbb',          // 『当前项』(checkpoint) 的颜色。
                    borderColor: '#777',    // timeline组件中『当前项』(checkpoint) 的边框颜色。
                    borderWidth: 2          // 『当前项』(checkpoint) 的边框宽度
                },
                controlStyle: {              // 『控制按钮』的样式。控制按钮 包括:『播放按钮』、『前进按钮』、『后退按钮』
                    showNextBtn: false,     // 是否显示『前进按钮』
                    showPrevBtn: false,     // 是否显示『后退按钮』
                    normal: {
                        color: '#666',
                        borderColor: '#666'
                    }
                },
                data: time_line              // timeline 数据, Array 的每一项，可以是直接的数值
            },
            backgroundColor: null,
            // backgroundColor: '#0c1c31',
            title: [
                {
                    text: time_line[0],      // 主标题文本，支持使用 \n 换行。data.timeline 时间轴数据
                    textAlign: 'center',     // 整体（包括 text 和 subtext）的水平对齐。
                    left: '63%',
                    top: '55%',
                    textStyle: {
                        fontSize: 50,
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                {
                    text: '城市交通状态监控（平均车速）',
                    left: 'left',
                    top: 10,
                    textStyle: {
                        color: '#fdffff',
                        fontSize: 20
                    }
                }
            ],
            tooltip: {                    // 标签激活，鼠标移上去。会显示数据
                trigger: 'item',
                formatter: '{b}<br/>{c}km/h'
            },
            grid: {
                top: 100,
                containLabel: true,      // grid 区域是否包含坐标轴的刻度标签
                left: 30,
                right: 110
            },
            visualMap: {
                show: false,
                pieces: [{
                    gt: 0.6,        // gt 大于
                    lte: 14,        // lte 小于等于
                    color: '#7e0023'
                }, {
                    gt: 14,
                    lte: 18,
                    color: '#ffde33'
                }, {
                    gt: 18,
                    color: '#096'
                }],
                outOfRange: {
                    color: '#999'
                }
            },
            xAxis: {
                type: 'category',        // 类目轴。适用于对数数据。
                name: '时间',
                nameGap: 25,             // 坐标轴名称与轴线之间的距离
                nameLocation: 'middle',  // 坐标轴名称显示位置
                splitLine: {
                    show: false          // 是否显示分隔线
                },
                axisLine: {              // 坐标轴轴线相关设置
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                data: DIDI_TIME0.time.slice(0, 288).slice(84, 288)    // 所有类目名称列表
            },
            yAxis: {
                type: 'value',
                name: '道路速度km/h',
                max: 26,
                min: 10,
                nameTextStyle: {            // 坐标轴名称的文字样式
                    color: '#ccc'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    type: 'line',
                    data: DIDI_TIME0.SD.slice(0, 288).slice(84, 288),
                    markLine: {
                        silent: true,
                        data: [
                            {
                                yAxis: 14
                            },
                            {
                                yAxis: 18
                            }
                        ]
                    }
                }
            ]
        },
        options: []
    };

    for (var n = 0; n < DIDI_TIME0.time.length; n += 288) {
        // console.log(data.series[n]);
        option.options.push({
            title: {
                show: true,
                text: DIDI_TIME0.week.slice(n, n + 288)[0]
            },
            series: {
                name: DIDI_TIME0.time.slice(n, n + 288).slice(84, 288),
                type: 'line',
                data: DIDI_TIME0.SD.slice(n, n + 288).slice(84, 288),
            }
        });
    }

    myChart.setOption(option);

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
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











