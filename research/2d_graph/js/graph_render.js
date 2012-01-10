function GraphRender(graph) {
	// graph for this graph render
	this.graph = graph;
	// defined width & height of svg
	this.w = $(window).width();
	this.h = $(window).height();
	
	// init svg area to draw
	this.svg = d3.select("body").append("svg")
		.attr("width", this.w)
		.attr("height", this.h);
	
	this.draw = function() {
		// init force graph
		this.force = d3.layout.force()
			.nodes(this.graph.nodes)
			.links(this.graph.links);
			
		// init lines as links
		this.line = this.svg.selectAll("line")
			.data(this.graph.links);
			
		// init circles as nodes
		this.circle = this.svg.selectAll("circle")
			.data(this.graph.nodes);
			
		// define force graph
		this.force.linkDistance(200)
			.charge(-200)          // pos for node attraction, neg for repulsion
			.size([this.w, this.h])
			.start();
			
		// draw lines
		this.line.enter().append("line")
			.attr("width", 10)
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
		this.line.append("title")
			.text(function(d) { return d.inf; });
			
		// draw circles
		this.circle.enter().append("circle")
			.attr("r", 10)
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;});
		this.circle.append("title")
			.text(function(d) { return d.title; });
			
		// handle events for graph (only for graph)
		GraphEvent(this);
	}
	
	this.erase = function() {
		this.circle.remove();
		this.line.remove();
	}
	
	this.changeData = function(size) {
		d3.json('data.php?size='+size, function(data) {
			// empty current graph
			graph.empty();
			// apply new data for current graph
			graph.data(data.nodes, data.links);
		});
		// erase current graph render
		this.erase();
		// draw new one
		this.draw();
		this.draw();
	}
}