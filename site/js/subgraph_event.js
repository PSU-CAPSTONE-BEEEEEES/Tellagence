function SubgraphEvent(renderObject) {
	// render object for this graph event
	this.renderObject = renderObject;
	
	var progress = function(alpha) {
		// range should match start to drawLines/drawCircles
	    var range = 0.1 - 0.01;
	    var percent = ((0.1 - alpha) / range) * 100;
	    return Math.floor(percent);
	};
	
	var setCookie = function(c_name, value, exdays) {
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	}
	var getCookie = function(c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++)
		{
		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  if (x==c_name)
			{
			return unescape(y);
			}
		  }
	}
	
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
				var ajaxUrl = 'data/generate.php?subgraph='+d.subgraph_id;
				if (d.subgraph_id==1)
					ajaxUrl = 'data/generate.php?user=vmworld&depth=100';
				d3.json(ajaxUrl, function() {
					$.get('data/nodes.json', function(data) {
					  setCookie('nodes', data.nodes, 1);
					  $.get('data/links.json', function(data) {
					    console.log(data);
					    setCookie('links', data, 1);
					  });
					});
					
					
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
