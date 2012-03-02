function SubgraphRender(graphs) {
	// nodes for this subgraph render
	this.graphs = graphs;
	// defined width & height of svg
	this.w = $(window).width();
	this.h = $(window).height();
	this.fill = d3.scale.category20();

	// temp
	this.ready = false;
        this.canTick = true;

	// set the svg for resizing and use the inner for drawing
	this.svg = d3.select("#d3").select("svg");
        this.inner = d3.select("#inner");

	this.drawCircles = function() {
		// draw circles
		this.circle.enter().append("circle")
			.attr("class", "sgnode")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.attr("r", function(d) { return 5*Math.log(d.num); }) //radius is scaled in logarithmic scale
			.style("fill", function(d) {
				q = d3.scale.log().range(["blue","red"]); //color is scaled from blue(cold) -> red(hot) by using logarithmic scale
				return q(d.num);
			})
			.call(this.force.drag);
			
		// subgraphs names
		this.circle.append("title")
			.text(function(d) { return "id="+d.subgraph_id+" num="+d.num; });
	};
		
	this.draw = function() {
		// init force graph
		this.force = d3.layout.force()
			.charge(function(d) {return -5*5*Math.log(d.num);}) //charge = 5*radius to separate nodes -> no overlapping
			.nodes(this.graphs)
			.size([this.w, this.h])
			.start();
			
		// init circles as nodes
		this.circle = this.inner.selectAll("circle")
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
		this.circle = this.inner.selectAll("circle").data([]);
		this.circle.exit().remove();
	};
}
