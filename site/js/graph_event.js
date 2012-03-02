function GraphEvent(renderObject) {
	// render object for this graph event
	this.renderObject = renderObject;

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
		if (renderObject.canTick === true) {
			$("#progress").progressBar(progress(alpha),
									   {callback:progressCallback});
		}
	
		// start drawing lines when the graph is about to stay stable
		if (alpha<0.01 && renderObject.ready===false) {
			$("#step2").hide();
	
			// draw paths, nodes, and name for each node
			renderObject.drawCircles();
			//renderObject.drawPaths();
			//renderObject.writeName();
			// stop ticking immediately as the complete graph was drawn
			renderObject.force.stop();

            initZoom(renderObject);

            // on click redraw the graph with the selected node being the center node of the new graph
			renderObject.circle.on('click', function(d, i) {
				// throw a new popup up
				resetPopup();
				// erase and empty current render
				renderObject.empty();
				// retrieve depth
				var depth = 100;
				// call to server to obtain new graph info
				d3.json('data/search.php?id='+d.id+'&depth='+depth, function(data) {
				//d3.json('data/search.php?user='+d.name, function(data) {
					// switch the spinning bar for the loading bar
					switchBars();
					// data for new graph
					renderObject.data(data.nodes, data.distances, data.links);
					renderObject.setCenterNode(d.id);
					// redraw with new graph and new graph events
					renderObject.draw();
				});
			});
			// mark render object as completely ready
			renderObject.ready = true;
			
			
			// ticking the single paths
			renderObject.singlePath.attr("d", tickingPath);
			// ticking the double paths
			renderObject.doublePath.attr("d", tickingPath);
			// ticking all paths
			console.log(renderObject.existOverlap);
		}
		
		function tickingPath(d) {
			// common figures to adjust source [x,y] and target [x,y]
			xsxt = Math.abs(d.target.x - d.source.x);
			ysyt = Math.abs(d.target.y - d.source.y);
			alpha = xsxt/ysyt;
			// adjust [x,y] for path source
			r = (renderObject.existOverlap) ?renderObject.radScale(parseInt(d.source.sum_degree)) :parseInt(d.source.sum_degree) ;
			dy = Math.sqrt(r*r/(alpha*alpha+1));
			dx = Math.sqrt(r*r - dy*dy);
			sDx = (d.source.x < d.target.x) ?1 :-1 ;
			sDy = (d.source.y < d.target.y) ?1 :-1 ;
			sx = d.source.x+sDx*dx;
			sy = d.source.y+sDy*dy;
			// adjust [x,y] for path target
			r = (renderObject.existOverlap) ?renderObject.radScale(parseInt(d.target.sum_degree)) :parseInt(d.target.sum_degree) ;
			dy = Math.sqrt(r*r/(alpha*alpha+1));
			dx = Math.sqrt(r*r - dy*dy);
			tDx = (d.target.x < d.source.x) ?1 :-1 ;
			tDy = (d.target.y < d.source.y) ?1 :-1 ;
			tx = d.target.x+tDx*dx;
			ty = d.target.y+tDy*dy;
			// and draw
			dr = 0;
			return "M" + sx + "," + sy + "A" + dr + "," + dr + " 0 0,1 " + tx + "," + ty;
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
}
