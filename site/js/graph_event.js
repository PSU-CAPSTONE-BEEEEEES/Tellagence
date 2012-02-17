function GraphEvent(graphRender) {
	// graph render for this graph event
	this.graphRender = graphRender;
	
	var progress = function(alpha) {
            // range should match start to drawLines/drawCircles
	    var range = 0.1 - 0.01;
	    var percent = ((0.1 - alpha) / range) * 100;
	    return Math.floor(percent);
	};
	
	// circles stay stacked unless they change every tick
	this.graphRender.force.on("tick", function() {
		var alpha = graphRender.force.alpha();
                // use callback on bar to disable popup at 100%
		$("#progress").progressBar(progress(alpha),
                                           {callback:progressCallback});
			
		// start drawing lines when the graph is about to stay stable
		if (alpha<0.01 && graphRender.ready===false) {
			// draw lines and circles
<<<<<<< HEAD
                        $("#step2").hide();
                        $("#step3").show();
			graphRender.drawPaths();
=======
			graphRender.drawLines();
>>>>>>> 63f776c76c95ac6dfad0cecfa055a463bad878f2
			graphRender.drawCircles();
			
			// on click redraw the graph with the selected node being the center node of the new graph
			graphRender.circle.on('click', function(d, i) {
                                // throw a new popup up
                                resetPopup();
				// retrieve depth
				var depth = 30;
				// erase and empty current render
				graphRender.empty();
				// call to server to obtain new graph info
				d3.json('data/search.php?id='+d.id+'&depth='+depth, function(data) {
                                        // switch the spinning bar for the loading bar
                                        switchBars();
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
