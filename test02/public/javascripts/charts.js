$(window).load(function(){
    
    if($("#chart_activity").length > 0){
        
        var stuff = [], contacts = [];

        for (var i = 0; i < 7; i += 1) {
            stuff.push([i, parseInt(Math.random() * 30)]);
            contacts.push([i, parseInt(Math.random() * 30)]);
        }

        $.plot($("#chart_activity"), [ { data: stuff, label: "stuff"}, { data: contacts, label: "contacts"}], {xaxis: {show: true}, yaxis: { show: true}});
        
    }
    
    if($(".visitsChart-2").length > 0){

        var d1 = [];
        
        for (var i = 1; i <= 30; i += 1)
            d1.push([i, parseInt(Math.random() * 30)]);

        $.plot($(".visitsChart-2"), [ { data: d1 }], {xaxis: {show: true}, yaxis: { show: true}});
    
    }  

    if($("#chart-2").length > 0){
        

        var d1 = [];
        for (var i = 0; i <= 10; i += 1)
            d1.push([i, parseInt(Math.random() * 30)]);

        var d2 = [];
        for (var i = 0; i <= 10; i += 1)
            d2.push([i, parseInt(Math.random() * 30)]);

        var d3 = [];
        for (var i = 0; i <= 10; i += 1)
            d3.push([i, parseInt(Math.random() * 30)]);

        var stack = 0, bars = true, lines = false, steps = false;


        $.plot($("#chart-2"), [ { data: d1, label: "data 1" }, { data: d2, label: "data 2" }, { data: d3, label: "data 3" } ], {
            series: {
                stack: stack,
                lines: { show: lines, fill: true, steps: steps },
                bars: { show: bars, barWidth: 0.6 }
            }
        });
        
        
    }
    
    if($("#chart-4").length > 0){
        
        var data = [], totalPoints = 301;
        
        var updateInterval = 1000;

        var plot = $.plot($("#chart-4"),[  { data: getSpectrumData() , label: "当前"}, { data: getTemplateData() , label: "模板"} ], {
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
