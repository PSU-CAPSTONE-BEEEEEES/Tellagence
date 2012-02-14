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

	// rect to move graph
	this.svg.append('rect')
		.attr('width', this.w)
		.attr('height', this.h)
		.style("fill", "white");
				
	function redraw(a) {
		d3.select("#inner").attr("transform",
				 "translate(" + d3.event.translate + ")" +
				 " scale(" + d3.event.scale + ")");
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
	
	this.drawLines = function() {
		/*
		// remove those lines with sum inf == 0
		var lines = this.links;
		for (i=0; i<lines.length; i++)
			if (lines[i].inf_1to2+lines[i].inf_2to1==0) {
				lines.splice(i, 1);
				i=0;
			}
		this.line = this.svg.selectAll("line")
			.data(lines);
		*/
		
		// as a result, only draw lines with sum inf > 0
		this.line.enter().append("line")
			.style("stroke-width", function(d) {
				return (d.inf_2to1+d.inf_1to2)/2+'px'; 
			})
			.style("opacity", function(d){
				return d.inf_2to1+d.inf_1to2==0?0:0.3;//set the opacity =0 for those links whose sum_inf =0 to hide the links
			})
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
		this.line.append("title")
			.text(function(d) { console.log(d.inf_1to2+d.inf_2to1); return 'frequency='+(d.inf_2to1+d.inf_1to2); });
			
	}
	
	this.draw = function() {
		// init force graph
		this.ready = false;
		this.force = d3.layout.force()
			.nodes(this.nodes)
			.links(this.links);
			
		// init circles as nodes
		this.circle = this.svg.selectAll("circle")
			.data(this.nodes);
			
		// init lines as links
		
		// only render links with sum inf >0
		var render_links = new Array();//to make sure, we copy only link whose sum_inf >0 to another array, so d3 can still this.links array with all of the links
		for (i=0;i<this.links.length;i++){
			if (this.links[i].inf_1to2+this.links[i].inf_2to1 >0){
				console.log(this.links[i].inf_1to2+this.links[i].inf_2to1);
				render_links.push(this.links[i]);
			}
		}
		this.line = this.svg.selectAll("line")
			.data(render_links);
			
		// this.line = this.svg.selectAll("line")
			// .data(this.links);
				
		// define force graph nodes distances
		this.force
			.linkDistance(function(d) { return d.shortestpath * 100; })
			.charge(-100)          // pos for node attraction, neg for repulsion
			.size([this.w, this.h])
			.start();
			
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
