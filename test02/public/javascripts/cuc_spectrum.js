$(window).load(function(){
    
    if($("#chart-2").length > 0){
        
        var data = [], totalPoints = 301;
        
        var updateInterval = 1000;

        var plot = $.plot($("#chart_cuc_spectrum"),[  { data: getCucSpectrumData() , label: "当前"}, { data: getTemplateData() , label: "干扰"} ], {
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

        update();
            
    }
    
    
    function getCucSpectrumData() {
        
        return eval("("+$("#cucSpectrumData").val()+")");

    }
    
    function getCucTemplateData() {
    
        return eval("("+$("#cucTemplateData").val()+")");
    }

    function update() {
    
        if($("#cuSpectrumRefrash").val()=="1"){
        
	        plot = $.plot($("#chart-2"),[  { data: getCucSpectrumData() , label: "当前"}, { data: getCucTemplateData() , label: "模板"} ], {
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




    var legends = $("#chart-2 .legendLabel");
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

    $("#chart-2").bind("plothover", function (event, pos, item) {
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
