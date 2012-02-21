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
                        $("#step2").hide();
                        $("#step3").show();
			graphRender.drawPaths();
			graphRender.drawCircles();
			graphRender.writeName();
			
			// stop ticking immeidately as the complete graph was drawn
			graphRender.force.stop();
			
			// on click redraw the graph with the selected node being the center node of the new graph
			graphRender.circle.on('click', function(d, i) {
                                // throw a new popup up
                                resetPopup();
				// retrieve depth
				var depth = 100;
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
		
		// ticking the paths
		graphRender.path.attr("d", function(d) {
			var dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				dr = 0;
			return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
	  	});
		
		// ticking the cirlces
		graphRender.circle
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
			
		// ticking the texts
		graphRender.text.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
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
