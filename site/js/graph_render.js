function GraphRender(graph) {
	// graph for this graph render
	this.graph = graph;
	// defined width & height of svg
	this.w = $(window).width();
	this.h = $(window).height();
	
	// temp
	this.ready = false;
	
    function redraw(a) {
	d3.select("#inner").attr("transform",
				 "translate(" + d3.event.translate + ")" +
				 " scale(" + d3.event.scale + ")");
    }

	// init svg area to draw
	this.svg = d3.select("#d3")
		.append("svg:svg")
		.attr("width", this.w)
		.attr("height", this.h)
	        .append('g')
				.call(d3.behavior.zoom().on("zoom", redraw))
			.append('g')
				.attr("id", "inner")
				.attr("transform", "translate(0, 0) scale(1)");

    this.svg.append('rect')
		.attr('width', this.w)
		.attr('height', this.h)
		.style("fill", "white");

	this.drawCircles = function() {
		// draw circles
		this.circle.enter().append("circle")
			.attr("r", function(d) { return 2+'px'; })
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("class", function(d) { return 'group: no group'; })
			.attr("title", function(d) { return d.id; });
	}
	
	this.drawLines = function() {
		this.line.enter().append("line")
			.style("stroke-width", function(d) { return (d.influence/1000)+'px'; })
			.style("opacity", .3)
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
		/*
		this.line.append("title")
			.text(function(d) { return 'i:notjhing for now' + ' ' + 'd:'+d.shortestpath; });
		*/
	}

	this.draw = function() {
		// init force graph
		this.force = d3.layout.force()
			.nodes(this.graph.nodes)
			.links(this.graph.links);
			
		// init circles as nodes
		this.circle = this.svg.selectAll("circle")
			.data(this.graph.nodes);
			
		// init lines as links
		this.line = this.svg.selectAll("line")
			.data(this.graph.links);
			
		// define force graph nodes distances
		this.force
			.linkDistance(function(d) { return d.shortestpath * 100000; })
			.charge(-1000)          // pos for node attraction, neg for repulsion
			.size([this.w, this.h])
			.start();
			
		// handle events for graph (only for graph)
		return new GraphEvent(this);
	};
	
	this.erase = function() {
		this.circle.remove();
		this.line.remove();
	};
	
	this.changeData = function(username, depth) {
		d3.json('data/search.php?user='+username+'&depth='+depth, function(data) {
			// empty current graph
			graph.empty();
			// apply new data for current graph
			graph.data(data.nodes, data.links);
		});
	};
}
