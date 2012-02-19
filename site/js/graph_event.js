function GraphEvent(graphRender) {
	// graph render for this graph event
	this.graphRender = graphRender;
	
	var progress = function(alpha) {
	    var range = 0.1 - 0.005009;
	    var percent = ((0.1 - alpha) / range) * 100;
	    return Math.floor(percent);
	};
	
	// circles stay stacked unless they change every tick
	this.graphRender.force.on("tick", function() {
		var alpha = graphRender.force.alpha();
                $("#spingress").hide();
		$("#progress").progressBar(progress(alpha));
			
		// start drawing lines when the graph is about to stay stable
		if (alpha<0.01 && graphRender.ready==false) {
			// draw lines and circles
                        $("#step2").hide();
                        $("#step3").show();
			graphRender.drawLines();
			graphRender.drawCircles();
			
			// on click redraw the graph with the selected node being the center node of the new graph
			graphRender.circle.on('click', function(d, i) {
				// retrieve depth
				var depth = 100;
				// erase and empty current render
				graphRender.empty();
				// call to server to obtain new graph info
				d3.json('data/search.php?id='+d.id+'&depth='+depth, function(data) {
					// data for new graph
					graphRender.data(data.nodes, data.links);
					graphRender.setCenterNode(d.id);
					// redraw with new graph and new graph events
					graphRender.draw();
				});
			});
			
			// mark that graph is completely ready
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
