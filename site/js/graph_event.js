function GraphEvent(renderObject) {
	// render object for this graph event
	this.renderObject = renderObject;
	this.renderType = this.renderObject.constructor.name;
	
	var progress = function(alpha) {
		// range should match start to drawLines/drawCircles
	    var range = 0.1 - 0.01;
	    var percent = ((0.1 - alpha) / range) * 100;
	    return Math.floor(percent);
	};
	
	// circles stay stacked unless they change every tick
	this.renderObject.force.on("tick", function() {
		var alpha = renderObject.force.alpha();
				// use callback on bar to disable popup at 100%
		$("#progress").progressBar(progress(alpha),
										   {callback:progressCallback});
			
		// start drawing lines when the graph is about to stay stable
		if (alpha<0.01 && renderObject.ready===false) {
			$("#step2").hide();
			$("#step3").show();
			
			// IF A SPECIFIC GRAPH IS BEING RENDERED
			if (this.renderType=='GraphRender') {
				// draw paths, nodes, and name for each node
				renderObject.drawPaths();
				renderObject.drawCircles();
				//renderObject.writeName();
				// stop ticking immeidately as the complete graph was drawn
				renderObject.force.stop();
				
				// on click redraw the graph with the selected node being the center node of the new graph
				renderObject.circle.on('click', function(d, i) {
					// throw a new popup up
					resetPopup();
					// retrieve depth
					var depth = 100;
					// erase and empty current render
					renderObject.empty();
					// call to server to obtain new graph info
					d3.json('data/search.php?id='+d.id+'&depth='+depth, function(data) {
						// switch the spinning bar for the loading bar
						switchBars();
						// data for new graph
						renderObject.data(data.nodes, data.links);
						renderObject.setCenterNode(d.id);
						// redraw with new graph and new graph events
						renderObject.draw();
					});
				});
			}
			// ELSE: IF THE SUBGRAPH IS BEING RENDERED
			else {
				// draw nodes
				renderObject.drawCircles();
				// stop ticking immeidately as the complete graph was drawn
				renderObject.force.stop();
				
				// on click render the selected subgraph
				renderObject.circle.on('click', function(d, i) {
					// remove current svg element on page
					$('svg').remove();
					// throw a new popup up
					resetPopup();
					// call to server to obtain the selected graph info
					//d3.json('data/search.php?subgraph='+d.subgraph_id+'&cutoff=2', function(data) {
					d3.json('data/search.php?id=1&depth=5', function(data) {
						// switch the spinning bar for the loading bar
						switchBars();
						
						// unset current render object
						delete renderObject;
						delete sgr;
						
						// new render for this selected graph
						var gr = new GraphRender(data.nodes, data.links);
						// draw this graph (w/ graph events ready)
						gr.draw();
						
						// gui event handler for the  selected graph
						var ge = new GuiEvent(gr);
					});
				});
			}
			
			// mark render object as completely ready
			renderObject.ready = true;
		}
		
		// IF A SPECIFIC GRAPH IS BEING RENDERED
		if (this.renderType=='GraphRender') {
			// ticking the paths
			renderObject.path.attr("d", function(d) {
				var dx = d.target.x - d.source.x,
					dy = d.target.y - d.source.y,
					dr = 0;
				return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
			});
		}
		
		// ticking the cirlces
		renderObject.circle
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
			
		/*
		// ticking the texts
		renderObject.text.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
		*/
	});
	
	// changes the svg size on window
	$(window).resize(function() {
		var w = $("#d3").width();
		var h = $(window).height();
		this.renderObject.svg
			.attr("width", w)
			.attr("height", h);
		this.renderObject.force.size([w, h]);
	});
}
