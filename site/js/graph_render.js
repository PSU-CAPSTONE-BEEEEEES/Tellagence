function GraphRender(nodes, distances, links) {
	// nodes and links for this graph render
	this.nodes 		= nodes;
	this.distances 	= distances;
	this.links 		= links;
	this.singleLinks = [];
	this.doubleLinks = [];
	this.centerNode = 100;
	// defined width & height of svg
	this.w = $(window).width();
	this.h = $(window).height();
	
	// temp
	this.ready = false;
	this.canTick = true;
	this.radScale = false;
	this.existOverlap = false;

	// set the svg for resizing and use the inner for drawing
	this.svg = d3.select("#d3").select("svg");
	this.inner = d3.select("#d3").select("svg").select("#inner");
	
    // scale the nodes logarithmically based on half the shortest link
    // to assure no overlapping nodes distance
    this.drawCircles = function() {
        var maxRadius = 0,
            minLength = this.distances[0].sp * 100;

        // check each link for overlapping nodes and update minLength, maxRadius
        for (i = 0; i < this.distances.length; i++) {
            var len = this.distances[i].sp * 100;
            if (len < minLength) {
                minLength = len;
            }

            var source = null,
                target = null;
            // map the link ends to the right nodes
            for (j = 0; j < this.nodes.length; j++) {
                if (this.distances[i].source.id == this.nodes[j].id) {
                    source = this.nodes[j];
                }
                if (this.distances[i].target.id == this.nodes[j].id) {
                    target = this.nodes[j];
                }
            };

            if (source && target) {
                var sr    = source.sum_degree/10,
                    tr    = target.sum_degree/10,
                    radii = sr + tr;

                // check for overlap and bigger than existing maxRadius
                if (radii > len && radii > maxRadius) {
                    maxRadius = Math.max(sr, tr);
                }
            }
        };

        // scale the nodes logarithmically, needing 1 as the base case to avoid
        // pesky NaN due to log(), with rangeRound making integer output
        var radScale = d3.scale.log()
                .domain([1, maxRadius])
                .rangeRound([1, minLength/2]);
		this.radScale = radScale;

        // draw circles
        var center = this.centerNode;
        this.circle.enter().append("circle")
            .attr("r", function(d) {
                // only scale if there exists overlap in the graph
                if (maxRadius > 0) {
                    return radScale(d.sum_degree)+'px';
					if (!this.existOverlap) {
						this.existOverlap = true;
					}
                }
                else {
                    return d.sum_degree+'px';
                }
            })
            .attr("opacity", 0.5)
            .attr("cx", function(d) {return d.x;})
            .attr("cy", function(d) {return d.y;})
            .attr("title", function(d) {return 'UserId='+d.id+'UserName='+d.name;})
            .attr("class", function(d) {return (d.id==center) ?'center' :'' ;})
            .append("svg:title").text(function(d) { return 'UserId='+d.id+'UserName='+d.name; });
			
		//this.clearDataNodes();
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
		// define defs area to initialize all arrows
		var defs = this.inner.append("defs").selectAll("marker");
		// arrows for single links
		defs.data(this.singleLinks).enter().append("marker")
			.attr("id", function(d) {return "marker-"+d.source.id+"-"+d.target.id; })
			.attr("viewBox", "0 0 15 15")
			.attr("refX", function(d) { return 15; })
			.attr("refY", 5)
			.attr("markerWidth", 15)
			.attr("markerHeight", 10)
			.attr("orient", "auto")
			.append("path").attr("d", "M 0 0 L 15 5 L 0 10 z");
			//.attr("d", "M 0 0 L 100 100 M 0 100 L 100 0");
		// arrows for target->source in double links
		defs.data([]);
		defs.data(this.doubleLinks).enter().append("marker")
			.attr("id", function(d) {return "marker-"+d.target.id+"-"+d.source.id; })
			.attr("viewBox", "0 0 15 15")
			.attr("refX", function(d) { return 0; })
			.attr("refY", 5)
			.attr("markerWidth", 15)
			.attr("markerHeight", 10)
			.attr("orient", "auto")
			.append("path").attr("d", "M 15 0 L 0 5 L 15 10 z");
		// arrows for source->target in double links
		defs.data([]);
		defs.data(this.doubleLinks).enter().append("marker")
			.attr("id", function(d) {return "marker-"+d.source.id+"-"+d.target.id; })
			.attr("viewBox", "0 0 15 15")
			.attr("refX", function(d) { return 15; })
			.attr("refY", 5)
			.attr("markerWidth", 15)
			.attr("markerHeight", 10)
			.attr("orient", "auto")
			.append("path").attr("d", "M 0 0 L 15 5 L 0 10 z");
			//.append("path").attr("d", "M0,-5L10,0L0,5");
		
		// draw single paths
		this.singlePath.enter().append("path")
			.attr("class", function(d) { return "link"; })
			.attr("marker-end", function(d) { return "url(#marker-"+d.source.id+"-"+d.target.id+")"; })
			.attr("title", "xyz - abc")
			.style("stroke-width", function(d) { return (d.inf/2.0)+'px'; });
		// draw double paths
		this.doublePath.enter().append("path")
			.attr("class", function(d) { return "link"; })
			.attr("marker-start", function(d) { return "url(#marker-"+d.target.id+"-"+d.source.id+")"; })
			.attr("marker-end", function(d) { return "url(#marker-"+d.source.id+"-"+d.target.id+")"; })
			.style("stroke-width", function(d) { return (d.inf/2.0)+'px'; });
			
		this.clearDataLinks();
	}
	
	this.draw = function() {
		var arrNodes = [];
		for (i=0; i<this.nodes.length; i++)
			arrNodes[i] = this.nodes[i].sum_degree;
		for (i=0; i<arrNodes.length-1; i++)
			for (j=i+1; j<arrNodes.length; j++)
				if ( arrNodes[j] > arrNodes[i] ) {
					temp = arrNodes[i];
					arrNodes[i] = arrNodes[j];
					arrNodes[j] = temp;
				}
		for (i=0; i<arrNodes.length; i++) {
			console.log(i + ': ' + arrNodes[i]);
		}
		
		// init force graph
		this.ready = false;
		this.force = d3.layout.force()
			.nodes(this.nodes)
			.links(this.distances)
			.linkDistance(function(d) { return d.sp*100; })
			.charge(-100)          // pos for node attraction, neg for repulsion
			.size([this.w, this.h])
			.start();
			
		// only render paths with sum influences > 0
		// to make sure, we copy only link whose sum_inf>0 to another array, so d3 can still this.links array with all of the links
		var singles = new Array();	// 1-way relationships
		var doubles = new Array();	// 2-way relationships
		for (i=0; i<this.links.length; i++) {
			// current influences
			inf_1to2 = this.links[i].i12;
			inf_2to1 = this.links[i].i21;
			source = this.links[i].source;
			target = this.links[i].target;
			path = new Object();
			path.inf = inf_1to2 + inf_2to1;
			// if this is a single relationship
			if ( Math.max(inf_1to2, inf_2to1)==(inf_1to2+inf_2to1) ) {
				path.source = (inf_1to2!=0) ?this.nodes[source] :this.nodes[target] ;
				path.target = (path.source.id==this.nodes[source].id) ?this.nodes[target] :this.nodes[source] ;
				singles.push(path);
			} else {
				path.source = this.nodes[source];
				path.target = this.nodes[target];
				doubles.push(path);
			}
		}
		this.singleLinks = singles;
		this.doubleLinks = doubles;
		this.singlePath = this.inner.selectAll("path")
			.data(this.singleLinks);
		this.doublePath = this.inner.selectAll("path")
			.data(this.doubleLinks);
			
		// init circles as nodes
		this.circle = this.inner.selectAll("circle")
			.data(this.nodes);
			
		// init texts
		this.text = this.inner.selectAll("text")
			.data(this.nodes);
			
		// handle events for graph (only for graph)
		return new GraphEvent(this);
	};
	
	this.data = function(nodes, distances, links) {
		this.nodes 		= nodes;
		this.distances 	= distances;
		this.links 		= links;
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
		this.singleLinks = [];
		this.doubleLinks = [];
		this.centerNode = 0;
		// empty the force graph
		this.force = d3.layout.force()
			.nodes([])
			.links([]);
		// empty actual circles and paths
		this.circle = this.inner.selectAll("circle").data([]);
		this.circle.exit().remove();
		this.path = this.inner.selectAll("path").data([]);
		this.path.exit().remove();
		// empty defs (arrows declaration)
		var defs = this.inner.select("defs").remove();
	};
	
	this.clearDataNodes = function() {
		// empty nodes and links
		this.nodes = [];
		// empty the force graph
		this.force = d3.layout.force().nodes([]);
		// empty actual circles
		this.circle = this.inner.selectAll("circle").data([]);
		console.log('data nodes cleared.');
	}
	this.clearDataLinks = function() {
		// empty nodes and links
		this.links = [];
		this.singleLinks = [];
		this.doubleLinks = [];
		// empty the force graph
		this.force = d3.layout.force().links([]);
		// empty actual circles and paths
		this.path = this.inner.selectAll("path").data([]);
		console.log('data links cleared.');
	}
}
