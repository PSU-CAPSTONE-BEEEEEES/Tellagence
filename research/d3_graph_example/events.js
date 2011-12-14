circle.on("click", grow)
    .on("mousemove", shrink);

// on circle click
function grow(d) {
    var r = +d3.select(this).attr("r");
    d3.select(this).transition()
	.attr("r", r * 1.5);
};

// on mouse movement in circle
function shrink(d) {
    var r = +d3.select(this).attr("r");
    d3.select(this).transition()
	.attr("r", r / 1.5);
};

// circles stay stacked unless they change every tick
graph.on("tick", function() {
    line.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    circle.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
});

// changes the svg size on window
$(window).resize(function() {
    var w = $(window).width();
    var h = $(window).height();
    svg.attr("width", w)
	.attr("height", h);
    graph.size([w, h]);
});