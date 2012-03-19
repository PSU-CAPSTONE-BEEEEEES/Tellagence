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
	
			// draw nodes
			renderObject.drawCircles();
			// stop ticking immediately as all the nodes were drawn
			renderObject.force.stop();
			// now adjust some nodes such that there will be no overlap
			checkValidCirclesPos(renderObject.nodes, renderObject.distances);
			// and it's valid now to draw paths, with arrow heads
			renderObject.drawPaths();

			// initialize zoom
            initZoom(renderObject);
			
			// ticking the single paths
			renderObject.singlePath.attr("d", tickingPath);
			// ticking the double paths
			renderObject.doublePath.attr("d", tickingPath);
			// ticking all arrow heads
			var defs = renderObject.inner.selectAll("marker");
			defs.attr("markerWidth", tickingMarkerWidth);
			// mark render object as completely ready
			renderObject.ready = true;

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
				
			renderObject.singlePath.on('mouseover', function(d, i) {
				$("circle#"+d.source.id).attr("fill", "red")
				$("circle#"+d.target.id).attr("fill", "red")
			});
		}
		
		function tickingPath(d) {
			// common figures to adjust source [x,y] and target [x,y]
			xsxt = Math.abs(d.target.x - d.source.x);
			ysyt = Math.abs(d.target.y - d.source.y);
			alpha = xsxt/ysyt;
			// adjust [x,y] for path source
			r = d.source.r ;
			dy = Math.sqrt(r*r/(alpha*alpha+1));
			dx = Math.sqrt(r*r - dy*dy);
			sDx = (d.source.x < d.target.x) ?1 :-1 ;
			sDy = (d.source.y < d.target.y) ?1 :-1 ;
			sx = d.source.x+sDx*dx;
			sy = d.source.y+sDy*dy;
			// adjust [x,y] for path target
			r = d.target.r;
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
		
		function tickingMarkerWidth(d) {
			dx = Math.abs(d.target.x - d.source.x);
			dy = Math.abs(d.target.y - d.source.y);
			s = Math.sqrt(dx*dx + dy*dy) - (d.source.r + d.target.r);
			return Math.min(6, s/(2*d.w));
		}
		
		function checkValidCirclesPos(nodes, distances) {
			for (i=0; i<distances.length; i++) {
				s = distances[i].source;
				t = distances[i].target;
				dx = Math.abs(s.x - t.x);
				dy = Math.abs(s.y - t.y);
				ds1 = Math.sqrt(dx*dx + dy*dy);
				ds2 = ds1 - (s.r + t.r);
				if (ds2<0) {
					sinA = dy/ds1; cosA = dx/ds1;
					d = (s.r + t.r + Math.min(s.r, t.r)) - Math.sqrt(dx*dx + dy*dy);
					dx = d * cosA; dy = d * sinA;
					move = (parseInt(s.sum_degree)<parseInt(t.sum_degree)) ?s :t ;
					fix = (move.id==s.id) ?t :s ;
					xSign = (move.x<fix.x)?-1 :1 ;
					ySign = (move.y<fix.y)?-1 :1 ;
					move.x = move.x + xSign*dx;
					move.y = move.y + ySign*dy;
				}
			}
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
