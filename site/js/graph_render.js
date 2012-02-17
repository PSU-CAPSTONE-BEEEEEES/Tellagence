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
				
	// Per-type markers, as they don't inherit styles.
	this.svg.append("defs").selectAll("marker")
		.data(["suit", "licensing", "resolved"])
		.enter().append("marker")
		.attr("id", String)
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", 15)
		.attr("refY", -1.5)
		.attr("markerWidth", 6)
		.attr("markerHeight", 6)
		.attr("orient", "auto")
		.append("path")
		.attr("d", "M0,-5L10,0L0,5");

	// rect to move graph
	this.svg.append('rect')
		.attr('width', this.w)
		.attr('height', this.h)
		.style("fill", "white");
				
	function redraw(a) {
		//lines = d3.select("#d3").selectAll("line");
		//lines.remove();
		d3.select("#inner").attr("transform",
				 "translate(" + d3.event.translate + ")" +
				 " scale(" + d3.event.scale + ")");
		//GraphRender.drawLines();
    }

    this.drawCircles = function() {
		// draw circles
		var center = this.centerNode;
		this.circle.enter().append("circle")
			.attr("r", function(d) { return d.sum_degree/10+'px'; })
			.attr("opacity", .5)
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("title", function(d) {return 'UserId='+d.id+'UserName='+d.name;})
			.attr("class", function(d) {return (d.id==center) ?'center' :'' ;})
			.append("svg:title").text(function(d) { return 'UserId='+d.id+'UserName='+d.name; });
	}
	
	this.drawPaths = function() {
		// as a result, only draw lines with sum inf > 0
		this.path.enter().append("path")
			.attr("class", function(d) { return "link"; })
			.attr("marker-end", function(d) { return "url(#licensing)"; })
			.style("stroke-width", function(d) { return (d.inf/2)+'px'; });
	}
	
	this.draw = function() {
		// init force graph
		this.ready = false;
		this.force = d3.layout.force()
			.nodes(this.nodes)
			.links(this.links)
			.linkDistance(function(d) { return d.shortestpath * 100; })
			.charge(-100)          // pos for node attraction, neg for repulsion
			.size([this.w, this.h])
			.start();
			
		// only render paths with inf>0
		var renderLinks = new Array();//to make sure, we copy only link whose sum_inf >0 to another array, so d3 can still this.links array with all of the links
		for (i=0; i<this.links.length; i++){
			if (this.links[i].inf_1to2 > 0){
				console.log(this.links[i].inf_1to2);
				var path = new Object();
				path.source = this.links[i].source;
				path.target = this.links[i].target;
				path.inf = this.links[i].inf_1to2;
				renderLinks.push(path);
			}
			if (this.links[i].inf_2to1 > 0){
				console.log(this.links[i].inf_2to1);
				var path = new Object();
				path.source = this.links[i].target;
				path.target = this.links[i].source;
				path.inf = this.links[i].inf_2to1;
				renderLinks.push(path);
			}
		}
		this.path = this.svg.selectAll("path")
			.data(renderLinks);
			
			
		// init circles as nodes
		this.circle = this.svg.selectAll("circle")
			.data(this.nodes);
			
		// handle events for graph (only for graph)
		return new GraphEvent(this);
	};
	
	this.data = function(nodes, links) {
		this.nodes = nodes;
		this.links = links;
	}
	
	this.setCenterNode = function(id) {
		this.centerNode = id;
	}
	
	this.hide = function() {
		this.circle.remove();
		this.line.remove();
	};
	this.show = function() {
		this.drawCircles();
		this.drawLines();
	}
	
	this.empty = function() {
		// empty nodes and links
		this.nodes = [];
		this.links = [];
		// empty the force graph
		this.force = d3.layout.force()
			.nodes([])
			.links([]);
		// empty actual circles and links
		this.circle = this.svg.selectAll("circle").data([]);
		this.circle.exit().remove();
		this.line = this.svg.selectAll("line").data([]);
		this.line.exit().remove();
	};
}
