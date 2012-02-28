function SubgraphEvent(renderObject) {
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
			// stop ticking immeidately as the complete graph was drawn
			renderObject.force.stop();
			
			// on click render the selected subgraph
			renderObject.circle.on('click', function(d, i) {
				// throw a new popup up
				resetPopup();

                                // make only the graph tick
                                renderObject.canTick = false;

                                // reenable the search and subgraph button
	                        $("#searchbar").show();
                                $("#dots").show();

				// erase and empty current render
				renderObject.empty();
				// call to server to obtain the selected graph info
				var ajaxUrl = 'data/search.php?subgraph='+d.subgraph_id;
				if (d.subgraph_id==1)
					ajaxUrl = 'data/search.php?user=vmworld&depth=100';
				d3.json(ajaxUrl, function(data) {
					// switch the spinning bar for the loading bar
					switchBars();
					// data for new graph
					window.gr.data(data.nodes, data.distances, data.links);
					window.gr.setCenterNode(0);
					// redraw selected graph with new graph events
					window.gr.draw();
				});
			});			
			// mark render object as completely ready
			renderObject.ready = true;
		}
		
		// ticking the cirlces
		renderObject.circle
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	});
}
