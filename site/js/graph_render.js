function GraphRender(nodes, links) {
	// nodes and links for this graph render
	this.nodes = nodes;
	this.links = links;
	this.centerNode = 100;
	// defined width & height of svg
	this.w = $(window).width();
	this.h = $(window).height();
	
	// temp
	this.ready = false;
        this.canTick = true;

	// set the svg for resizing and use the inner for drawing
	this.svg = d3.select("#d3").select("svg");
	this.inner = d3.select("#d3").select("svg").select("#inner");
	
	this.drawCircles = function() {
		// draw circles
		var center = this.centerNode;
		this.circle.enter().append("circle")
			.attr("r", function(d) { return d.sum_degree*10+'px'; })
			.attr("opacity", 0.5)
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("title", function(d) {return 'UserId='+d.id+'UserName='+d.name;})
			.attr("class", function(d) {return (d.id==center) ?'center' :'' ;});
	};
	
	this.writeName = function() {
		// A copy of the text with a thick white stroke for legibility.
		this.text.enter().append("text")
			.attr("x", 8)
			.attr("y", ".31em")
			.attr("class", "shadow")
			.text(function(d) { return d.name; });
		
		this.text.enter().append("text")
			.attr("x", 8)
			.attr("y", ".31em")
			.text(function(d) { return d.name; });
	}
	
	this.drawPaths = function() {
		// define markers (arrow heads)
		this.inner.append("defs").selectAll("marker")
			.data(["suit", "licensing", "resolved"])
			.enter().append("marker")
				.attr("id", String)
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 50)
				.attr("refY", 0)
				.attr("markerWidth", 50)
				.attr("markerHeight", 10)
				.attr("orient", "auto")
				.append("path")
					//.attr("d", "M0,-5L10,0L0,5");
					.attr("d", "M0,-5L10,0L0,5");
		
		// as a result, only draw lines with sum inf > 0
		this.path.enter().append("svg:path")
			.attr("class", function(d) { return "link"; })
			.attr("marker-end", "url(#suit)")
			.attr("marker-start", "url(#suit)")
			.style("stroke-width", function(d) { return d.inf+'px'; });
	}
	
	this.draw = function() {
		// init force graph
		this.ready = false;
		this.force = d3.layout.force()
			.nodes(this.nodes)
			.links(this.links)
			.linkDistance(function(d) { return d.shortestpath * 500; })
			.charge(-100)          // pos for node attraction, neg for repulsion
			.size([this.w, this.h])
			.start();
			
		// only render paths with sum influences > 0
		var renderLinks = new Array();//to make sure, we copy only link whose sum_inf>0 to another array, so d3 can still this.links array with all of the links
		for (i=0; i<this.links.length; i++)
			if ((this.links[i].inf_1to2+this.links[i].inf_2to1) > 0) {
				path = new Object();
				path.source = this.links[i].source;
				path.target = this.links[i].target;
				path.inf = this.links[i].inf_1to2 + this.links[i].inf_2to1;
				renderLinks.push(path);
			}
		this.path = this.inner.selectAll("path")
			.data(renderLinks);
			
		// init circles as nodes
		this.circle = this.inner.selectAll("circle")
			.data(this.nodes);
			
		// init texts
		this.text = this.inner.selectAll("text")
			.data(this.nodes);
			
		// handle events for graph (only for graph)
		return new GraphEvent(this);
	};
	
	this.data = function(nodes, links) {
		this.nodes = nodes;
		this.links = links;
	};
	
	this.setCenterNode = function(id) {
		this.centerNode = id;
	};
	
	this.hide = function() {
		this.circle.remove();
		this.line.remove();
	};
	this.show = function() {
		this.drawCircles();
		this.drawLines();
	};
	
	this.empty = function() {
		// empty nodes and links
		this.nodes = [];
		this.links = [];
		// empty the force graph
		this.force = d3.layout.force()
			.nodes([])
			.links([]);
		// empty actual circles and links
		this.circle = this.inner.selectAll("circle").data([]);
		this.circle.exit().remove();
		this.path = this.inner.selectAll("path").data([]);
		this.path.exit().remove();
	};
}
