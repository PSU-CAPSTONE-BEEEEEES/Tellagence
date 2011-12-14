// svg size
var w = $(window).width();
var h = $(window).height();

// fake node and link data
var n = [{n1:'1',n2:'2'}, {n1:'3',n2:'6'}, {n1:'0',n2:'1'}];
var l = [{source:0, target:1},{source:1, target:2}];

// draw svg
var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

// init force graph
var graph = d3.layout.force()
    .nodes(n)
    .links(l)
    .linkDistance(100)
    .charge(-100)          // pos for node attraction, neg for repulsion
    .size([w, h])
    .start();

// draw both lines
var line = svg.selectAll("line")
    .data(l)
  .enter().append("line")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

// draw three circles
var circle = svg.selectAll("circle")
    .data(n)
  .enter().append("circle")
    .attr("r", 15)
    .attr("cx", function(d) {return d.x;})
    .attr("cy", function(d) {return d.y;});