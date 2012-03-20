function GraphRender(nodes, distances, links) {
    // nodes and links for this graph render
    this.nodes 		= nodes;
    this.distances 	= distances;
    this.links 		= links;
    this.singleLinks = [];
    this.doubleLinks = [];
    this.centerNode = null;
    // defined width & height of svg
    this.w = $(window).width();
    this.h = $(window).height();

    // temp
    this.ready = false;
    this.canTick = true;
    this.radScale = null;
    //this.existOverlap = false;

    // set the svg for resizing and use the inner for drawing
    this.svg = d3.select("#d3").select("svg");
    this.inner = d3.select("#d3").select("svg").select("#inner");

    // scale the nodes linearly: draw them as their property "r" was ready for rendering
    this.drawCircles = function() {
        // draw circles
        var center = this.centerNode;
        this.circle.enter().append("circle")
            .attr("id", function(d) {return d.id; })
            .attr("r", function(d) {return d.r;})
            .attr("cx", function(d) {return d.x;})
            .attr("cy", function(d) {return d.y;})
            .attr("title", function(d) {return 'UserId='+d.id+'UserName='+d.name;})
            .attr("class", function(d) {return (d.id==center) ?'center' :'' ;})
            .append("title").text(function(d) { return 'UserId='+d.id+'UserName='+d.name; });
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
    };

    this.drawPaths = function() {
        // define defs area to initialize all arrows
        var defs = this.inner.append("defs").selectAll("marker");

        // arrows for single links
        defs.data(this.singleLinks).enter().append("marker")
            .attr("id", function(d) {return "marker-"+d.source.id+"-"+d.target.id; })
            .attr("viewBox", "0 -1 15 15")
            .attr("refX", function(d) { return 15; })
            .attr("refY", 5)
            .style("fill", "red")
            .attr("markerWidth", 3)
            .attr("orient", "auto")
            .append("path").attr("d", "M 0 0 L 15 5 L 0 10 z");
        //.attr("d", "M 0 0 L 100 100 M 0 100 L 100 0");
        // arrows for target->source in double links
        defs.data([]);
        defs.data(this.doubleLinks).enter().append("marker")
            .attr("id", function(d) {return "marker-"+d.target.id+"-"+d.source.id; })
            .attr("viewBox", "0 -1 15 15")
            .attr("refX", function(d) { return 0; })
            .attr("refY", 5)
            .attr("markerWidth", 3)
            .attr("orient", "auto")
            .append("path").attr("d", "M 15 0 L 0 5 L 15 10 z");
        // arrows for source->target in double links
        defs.data([]);
        defs.data(this.doubleLinks).enter().append("marker")
            .attr("id", function(d) {return "marker-"+d.source.id+"-"+d.target.id; })
            .attr("viewBox", "0 -1 15 15")
            .attr("refX", function(d) { return 15; })
            .attr("refY", 5)
            .attr("markerWidth", 3)
            .attr("orient", "auto")
            .append("path").attr("d", "M 0 0 L 15 5 L 0 10 z");
        //.append("path").attr("d", "M0,-5L10,0L0,5");

        // draw single paths
        this.singlePath.enter().append("path")
            .attr("class", function(d) { return "link"; })
            .attr("marker-end", function(d) { return "url(#marker-"+d.source.id+"-"+d.target.id+")"; })
            .attr("title", function(d) {
                return d.i12 + " " + d.i21;
            })
        .style("stroke-width", function(d) { return d.w; });
        // draw double paths
        this.doublePath.enter().append("path")
            .attr("class", function(d) { return "link"; })
            .attr("marker-start", function(d) { return "url(#marker-"+d.target.id+"-"+d.source.id+")"; })
            .attr("marker-end", function(d) { return "url(#marker-"+d.source.id+"-"+d.target.id+")"; })
            .attr("title", function(d) {
                return d.i12 + " " + d.i21;
            })
        .style("stroke-width", function(d) { return d.w; });

        var that = this;
        $('path.link').each(function(i) {
            $(this).tipsy({
                html: true,
                gravity: 'c',
                show: function(e, $el) {$el.fadeIn(100);},
                delayIn: 1000,
                title: function() {
                    var isplits = $(this).attr("original-title").split(" ");
                    var i12 = isplits[0],
                i21 = isplits[1];
            var splits = $(this).attr("marker-end").split("-");
            var sid = parseInt(splits[1]);
            var tid = parseInt(splits[2].split(")")[0]);

            var source = null,
                target = null;
            // map the link ends to the right nodes
            for (var i = 0; i < that.nodes.length; i++) {
                if (sid == that.nodes[i].id) {
                    source = that.nodes[i];
                }
                if (tid == that.nodes[i].id) {
                    target = that.nodes[i];
                }
            }
            var to2 = source.name + " -> " + target.name + " = " + i12;
            var to1 = target.name + " -> " + source.name + " = " + i21;
            return to2 + "</br>" + to1;
                }
            });
        });

        //this.clearDataLinks();
    };

    this.normalize = function() {
        // normalize circles size to a specific linear scale
        var minDeg = this.nodes[0].sum_degree;
        var maxDeg = this.nodes[0].sum_degree;
        for (i=1; i<this.nodes.length; i++) {
            deg = parseInt(this.nodes[i].sum_degree);
            minDeg = (deg < minDeg) ?deg :minDeg ;
            maxDeg = (deg > maxDeg) ?deg :maxDeg ;
        }
        minR = 10; maxR = 50;
        if (maxDeg-minDeg < maxR-minR) {
            minR = minDeg; maxR = maxDeg;
        }
        var radiusScale = d3.scale.linear()
            .domain([minDeg, maxDeg])
            .range([minR, maxR]);
        for (i=0; i<this.nodes.length; i++)
            this.nodes[i].r = radiusScale(this.nodes[i].sum_degree);

        // normalize links length linearly to avoid nodes overlap
        s = this.nodes[this.distances[0].source];
        t = this.nodes[this.distances[0].target];
        alpha = this.distances[0].sp/(s.r + t.r);
        offset = 0;
        for (i=1; i<this.distances.length; i++) {
            s = this.nodes[this.distances[i].source];
            t = this.nodes[this.distances[i].target];
            thisAlpha = this.distances[i].sp/(s.r + t.r);
            if (thisAlpha < alpha) {
                alpha = thisAlpha;
                offset = i;
            }
        }
        // calculate multiplier factor c
        s = this.nodes[this.distances[offset].source];
        t = this.nodes[this.distances[offset].target];
        c = (s.r + t.r + Math.max(s.r, t.r))/this.distances[offset].sp;
        // propagate c to calculate new sp for rendering
        for (i=0; i<this.distances.length; i++)
            this.distances[i].sp = this.distances[i].sp * c;

        // normalize links thickness linearly to avoid link width exceeding connected nodes size
        alpha = 0;
        offset = 0;
        for (i=0; i<this.links.length; i++) {
            inf = this.links[i].i12 + this.links[i].i21;
            s = this.nodes[this.links[i].source];
            t = this.nodes[this.links[i].target];
            newAlpha = (2*Math.min(s.r, t.r))/inf;
            if (newAlpha < 1) {
                if (alpha==0 || newAlpha<alpha)
                    alpha = newAlpha;
            }
        }
        // propagate alpha (normalization multiplier) to calculate new thichness for each link
        for (i=0; i<this.links.length; i++) {
            // if there's some normalization need for thickness
            if (alpha > 0)
                this.links[i].w = (this.links[i].i12 + this.links[i].i21) * alpha;
            else
                this.links[i].w = (this.links[i].i12 + this.links[i].i21);
        }
    }

    this.draw = function() {
        // graph overall normalization
        this.normalize();

        // initialize the count in the toolbar
        var that = this;
        $.getJSON("data/subgraph.php", function(data) {
            var count = data.graphs[parseInt(that.nodes[0].subgraph) - 1];
            $("#count").html(count.num);
        });

        // init force graph
        this.ready = false;
        this.force = d3.layout.force()
            .nodes(this.nodes)
            .links(this.distances)
            .linkDistance(function(d) { return d.sp; })
            .charge(-100)          // pos for node attraction, neg for repulsion
            .size([this.w, this.h])
            .start();

        // only render paths with sum influences > 0
        // to make sure, we copy only link whose sum_inf>0 to another array, so d3 can still this.links array with all of the links
        var singles = [];	// 1-way relationships
        var doubles = [];	// 2-way relationships
        for (i=0; i<this.links.length; i++) {
            // current influences
            inf_1to2 = this.links[i].i12;
            inf_2to1 = this.links[i].i21;
            width = this.links[i].w;
            source = this.links[i].source;
            target = this.links[i].target;
            path = {};
            path.inf = inf_1to2 + inf_2to1;
            path.w = width;
            // if this is a single relationship
            if ( Math.max(inf_1to2, inf_2to1)==(inf_1to2+inf_2to1) ) {
                path.source = (inf_1to2!==0) ?this.nodes[source] :this.nodes[target] ;
                path.target = (path.source.id==this.nodes[source].id) ?this.nodes[target] :this.nodes[source] ;
                path.i12 = inf_1to2;
                path.i21 = inf_2to1;
                singles.push(path);
            } else {
                path.source = this.nodes[source];
                path.target = this.nodes[target];
                path.i12 = inf_1to2;
                path.i21 = inf_2to1;
                doubles.push(path);
            }
        }
        this.singleLinks = singles;
        this.doubleLinks = doubles;

        // define area to draw all paths
        var pathsArea = this.inner.append('g').attr("id", "paths");
        pathsArea.attr("opacity", .5);
        // define paths area to draw all paths
        this.singlePath = pathsArea.selectAll("path")
            .data(this.singleLinks);
        this.doublePath = pathsArea.selectAll("path")
            .data(this.doubleLinks);

        // define area to draw all circles
        var circlesArea = this.inner.append('g').attr("id", "circles");
        circlesArea.attr("opacity", .7);
        // init circles as nodes
        this.circle = circlesArea.selectAll("circle")
            .data(this.nodes);

        // init texts
        /*
           this.text = this.inner.selectAll("text")
           .data(this.nodes);
         */

        zoomable = this.nodes.length > 15 ? true : false;

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
        var circles = this.inner.select("#circles").remove();
        var paths = this.inner.select("#paths").remove();
    };

    this.clearDataNodes = function() {
        // empty nodes and links
        this.nodes = [];
        // empty the force graph
        this.force = d3.layout.force().nodes([]);
        // empty actual circles
        this.circle = this.inner.selectAll("circle").data([]);
    };
    this.clearDataLinks = function() {
        // empty nodes and links
        this.links = [];
        this.singleLinks = [];
        this.doubleLinks = [];
        // empty the force graph
        this.force = d3.layout.force().links([]);
        // empty actual circles and paths
        this.path = this.inner.selectAll("path").data([]);
    };
}
