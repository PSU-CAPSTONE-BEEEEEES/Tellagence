/* Example script showing svg dimension selection and resize */

// select section width to get offset from toolbar, keep window height
var w = $("#d3").width();
var h = $(window).height();

// draw the svg in the d3 section
var svg = d3.select("#d3").append("svg")
    .attr("width", w)
    .attr("height", h);

// reset the svg with the new width and height after window resize
$(window).resize(function() {
    var w = $("#d3").width();
    var h = $(window).height();
    svg.attr("width", w).attr("height", h);
});