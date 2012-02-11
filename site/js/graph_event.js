function GraphEvent(graphRender) {
	// graph render for this graph event
	this.graphRender = graphRender;
	
	/*
	// on circle click
	this.graphRender.circle
		.on("click", grow)
		.on("mousemove", shrink);

	// on circle hover
	function grow(d) {
		var r = +d3.select(this).attr("r");
		d3.select(this).transition()
		.attr("r", r * 1.5);
	};
	
	// on mouse movement in circle
	function shrink(d) {
		var r = +d3.select(this).attr("r");
		d3.select(this).transition()
		.attr("r", r / 1.5);
	};
	*/
	
        var progress = function(alpha) {
	    var range = 0.1 - 0.005009;
	    var percent = ((0.1 - alpha) / range) * 100;
	    return Math.floor(percent);
	};

	// circles stay stacked unless they change every tick
	this.graphRender.force.on("tick", function() {
		var alpha = graphRender.force.alpha();
		$("#progress").progressBar(progress(alpha),
				   {boxImage:"static/bar.gif",
					barImage:{0:"static/bar_fill.gif",
						  30:"static/bar_fill.gif",
						  70:"static/bar_fill.gif",}});
			
		// start drawing lines when the graph is about to stay stable
		if (alpha<0.01 && graphRender.ready==false) {
			graphRender.drawLines();
			//graphRender.drawCircles();
			$("circle").wTooltip({
				content: function() {return 'userID='+this.title;}
			}); 
			graphRender.ready = true;
		}
		
		graphRender.line
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		graphRender.circle.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	});
	
	// changes the svg size on window
	$(window).resize(function() {
		var w = $("#d3").width();
		var h = $(window).height();
		this.graphRender.svg
			.attr("width", w)
			.attr("height", h);
		this.graphRender.force.size([w, h]);
	});
}
