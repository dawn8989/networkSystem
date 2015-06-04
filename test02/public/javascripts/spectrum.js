$(window).load(function(){

    var stack = 0, bars = true, lines = false, steps = false;
    
    if($("#chart-2").length > 0){
        
        var cucData = [], cucTotalPoints = 301;
        
        var cucUpdateInterval = 1000;

        var cucPlot = $.plot($("#chart-2"),[  { data: getCucSpectrumData() , label: "当前"}, { data: getCucTemplateData() , label: "干扰"} ], {
            series: {
                stack: stack,
                lines: { show: true, points: true },
                shadowSize: 0
            },
            grid: {
                hoverable: true,// 开启 hoverable 事件
                autoHighlight: false
            },
            crosshair: {
                mode: "x"
            }
        });

        updateCuc();
            
    }
    
    function updateCuc() {
    
        if($("#cucSpectrumRefrash").val()=="1"){
        
            cucPlot = $.plot($("#chart-2"),[  { data: getCucSpectrumData() , label: "当前"}, { data: getCucTemplateData() , label: "干扰"} ], {
                series: {
                    stack: stack,
                    lines: { show: true, points: true},
                    shadowSize: 0
                },
                grid: {
                    hoverable: true,// 开启 hoverable 事件
                    autoHighlight: false
                },
                crosshair: {
                    mode: "x"
                }
            });
            
            cucPlot.draw();
            
            $("#cucSpectrumRefrash").val("0");
        }

        setTimeout(updateCuc, cucUpdateInterval);
    }
    
    
    function getCucSpectrumData() {
        
        return eval("("+$("#cucSpectrumData").val()+")");

    }
    
    function getCucTemplateData() {
    
        return eval("("+$("#cucTemplateData").val()+")");
    }
    
    var cucLegends = $("#chart-2 .legendLabel");
    cucLegends.each(function () {
        // fix the widths so they don't jump around
        $(this).css('width', $(this).width());
    });

    var cucUpdateLegendTimeout = null;
    var cucLatestPosition = null;

    function cucUpdateLegend() {
    
        
        cucUpdateLegendTimeout = null;

        var pos = cucLatestPosition;

        var axes = plot.getAxes();
        if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max || pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) return;

        var i, j, dataset = plot.getData();
        for (i = 0; i < dataset.length; ++i) {
            var series = dataset[i];
            if(i==0) {
                //legends.eq(i).text("当前(" + series.data[i][1] + ")");
            }else{
                //legends.eq(i).text("模板(" + series.data[i][1] + ")");
            }
        }
    }

    $("#chart-2").bind("plothover", function (event, pos, item) {
        cucLatestPosition = pos;


        $("#x").text(pos.x.toFixed(2));
        $("#y").text(pos.y.toFixed(2));

        if (item) {
            if (cucPreviousPoint != item.dataIndex) {
                cucPreviousPoint = item.dataIndex;

                $(".ct").remove();
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                showTooltip(item.pageX, item.pageY,
                    item.series.label + "(" + Math.round(x) + "=" + Math.round(y) + ")");
            }
        }else {
            $(".ct").remove();
            cucPreviousPoint = null;
        }

        if (!cucUpdateLegendTimeout) cucUpdateLegendTimeout = setTimeout(cucUpdateLegend, 200);
    });
    
    
    if($("#chart-4").length > 0){
        
        var data = [], totalPoints = 301;
        
        var updateInterval = 1000;

        var plot = $.plot($("#chart-4"),[  { data: getSpectrumData() , label: "当前"}, { data: getTemplateData() , label: "模板"} ], {
            series: {
                stack: stack,
                lines: { show: true, points: true,  fill: true },
                shadowSize: 0
            },
            grid: {
                hoverable: true,// 开启 hoverable 事件
                autoHighlight: false
            },
            crosshair: {
                mode: "x"
            }
        });

        update();
            
    }
    
    
    function getSpectrumData() {
        
        return eval("("+$("#spectrumData").val()+")");

    }
    
    function getTemplateData() {
    
        return eval("("+$("#templateData").val()+")");
    }

    function update() {
    
        if($("#spectrumRefrash").val()=="1"){
        
	        plot = $.plot($("#chart-4"),[  { data: getSpectrumData() , label: "当前"}, { data: getTemplateData() , label: "模板"} ], {
	            series: {
	                stack: stack,
	                lines: { show: true, points: true },
	                shadowSize: 0
	            },
	            grid: {
	                hoverable: true,// 开启 hoverable 事件
	                autoHighlight: false
	            },
	            crosshair: {
	                mode: "x"
	            }
	        });
	        
            plot.draw();
            
            $("#spectrumRefrash").val("0");
        }

        setTimeout(update, updateInterval);
    }




    var legends = $("#chart-4 .legendLabel");
    legends.each(function () {
        // fix the widths so they don't jump around
        $(this).css('width', $(this).width());
    });

    var updateLegendTimeout = null;
    var latestPosition = null;

    function updateLegend() {
    
	    
        updateLegendTimeout = null;

        var pos = latestPosition;

        var axes = plot.getAxes();
        if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max || pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) return;

        var i, j, dataset = plot.getData();
        for (i = 0; i < dataset.length; ++i) {
            var series = dataset[i];
            if(i==0) {
                //legends.eq(i).text("当前(" + series.data[i][1] + ")");
            }else{
                //legends.eq(i).text("模板(" + series.data[i][1] + ")");
            }
        }
    }

    $("#chart-4").bind("plothover", function (event, pos, item) {
        latestPosition = pos;


        $("#x").text(pos.x.toFixed(2));
        $("#y").text(pos.y.toFixed(2));

        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;

                $(".ct").remove();
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                showTooltip(item.pageX, item.pageY,
                    item.series.label + "(" + Math.round(x) + "=" + Math.round(y) + ")");
            }
        }else {
            $(".ct").remove();
            previousPoint = null;
        }

        if (!updateLegendTimeout) updateLegendTimeout = setTimeout(updateLegend, 200);
    });

    function showTooltip(x, y, contents) {
        $('<div class="ct">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y,
            left: x + 10,
            border: '1px solid #000',
            padding: '3px',
            opacity: '0.7',
            'background-color': '#000',            
            color: '#fff'            
        }).appendTo("body").fadeIn(200);
    }
    
});
