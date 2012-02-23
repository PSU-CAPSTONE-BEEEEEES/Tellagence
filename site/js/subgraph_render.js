function SubgraphRender(graphs) {
	// nodes for this subgraph render
	this.graphs = graphs;
	// defined width & height of svg
	this.w = $(window).width();
	this.h = $(window).height();
	this.fill = d3.scale.category20();

	// temp
	this.ready = false;

	// select the svg area to draw
	this.svg = d3.select("#inner");

	this.drawCircles = function() {
		// draw circles
		this.circle.enter().append("circle")
			.attr("class", "sgnode")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.attr("r", function(d) { return 5*Math.log(d.num); }) //radius is scaled in logarithmic scale
			.style("fill", function(d) {
				if (d.subgraph_id==101) return "black";
				q = d3.scale.log().range(["blue","red"]); //color is scaled from blue(cold) -> red(hot) by using logarithmic scale
				return q(d.num);
			})
			.call(this.force.drag);
			
		// subgraphs names
		this.circle.append("title")
			.text(function(d) { return d.num; });
	};
		
	this.draw = function() {
		// init force graph
		this.force = d3.layout.force()
			.charge(function(d) {return -5*5*Math.log(d.num);}) //charge = 5*radius to separate nodes -> no overlapping
			.nodes(this.graphs)
			.size([this.w, this.h])
			.start();
			
		// init circles as nodes
		this.circle = this.svg.selectAll("circle")
			.data(this.graphs);
		
		// handle events for graph (only for graph)
		return new SubgraphEvent(this);
	};
	
	this.data = function(graphs) {
		this.graphs = graphs;
	};
	
	this.empty = function() {
		// empty graphs
		this.graphs = [];
		// empty the force graph
		this.force = d3.layout.force()
			.nodes([]);
		// empty actual circles as graphs
		this.circle = this.svg.selectAll("circle").data([]);
		this.circle.exit().remove();
	};
}
