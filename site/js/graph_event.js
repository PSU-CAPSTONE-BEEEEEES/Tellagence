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
	
	// drag a circle (node)
	this.graphRender.circle
		.call(this.graphRender.force.drag)
	
	// init svg area to draw
	this.graphRender.svg
		.attr("pointer-events", "all")
		.call(d3.behavior.zoom().on("zoom", redraw))
		.append('svg:g');
		
	function redraw() {
		console.log("here", d3.event.translate, d3.event.scale);
		d3.select(this).attr("transform",
		  "translate(" + d3.event.translate + ")"
		  + " scale(" + d3.event.scale + ")");
	}
	
	// circles stay stacked unless they change every tick
	this.graphRender.force.on("tick", function() {
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