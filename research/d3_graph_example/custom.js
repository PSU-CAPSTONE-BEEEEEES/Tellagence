$(function() {
    d3.selectAll("circle")
	.on("click", grow)
	.on("mousemove", shrink);

    function grow(d) {
	var r = +d3.select(this).attr("r");
	d3.select(this).transition()
	    .attr("r", r * 1.5);
    };

    function shrink(d) {
	var r = +d3.select(this).attr("r");
	d3.select(this).transition()
	    .attr("r", r / 1.5);
    };
});