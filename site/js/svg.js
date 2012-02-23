function redraw(a) {
    d3.select("#inner").attr("transform",
                             "translate(" + d3.event.translate + ")" +
                             " scale(" + d3.event.scale + ")");
}

function SVG() {
	// defined width & height of svg
	this.w = $(window).width();
	this.h = $(window).height();
	
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

        this.svg.append('rect')
                .attr("width", this.w)
                .attr("height", this.h)
                .style("fill", "white");
}
