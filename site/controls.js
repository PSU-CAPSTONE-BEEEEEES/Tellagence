$(document).ready(function() {
var w = $(window).width();
var h = $(window).height();

var graph = d3.select("#d3").append("svg")
    .attr("width", w)
    .attr("height", h)
    .append('g')
      .call(d3.behavior.zoom().on("zoom", redraw))
    .append('g')
      .attr("id", "inner")
      .attr("transform", "translate(0,0) scale(1)");

graph.append('rect')
    .attr('width', w)
    .attr('height', h)
    .style("fill", "white");

function redraw(a) {
    var x = $("rect").position().left;
    var y = $("rect").position().top - 22;
    var s = $("#inner").attr("transform");
    if (s) {
	s = s.slice(s.indexOf(" scale"));
    }

    if (a) {
	if (a == "up") {
	    graph.attr("transform",
		       "translate(" + [x, y - 1] + ")" + s);
	}
	else if (a == "left") {
	    graph.attr("transform",
		       "translate(" + [x - 1, y] + ")" + s);
	}
	else if (a == "right") {
	    graph.attr("transform",
		       "translate(" + [x + 1, y] + ")" + s);
	}
	else {
	    graph.attr("transform",
		       "translate(" + [x, y + 1] + ")" + s);
	}
    }
    else {
	    graph.attr("transform",
		   "translate(" + d3.event.translate + ")"
		   + " scale(" + d3.event.scale + ")");
    }
}

var draw = function(nodes, links) {
    var force = d3.layout.force()
	.charge(-120)
	.linkDistance(100)
	.nodes(nodes)
	.links(links)
	.size([w, h])
	.start();

    var link = graph.selectAll("line.link")
	.data(links)
	.enter().append("line")
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; });

    var node = graph.selectAll("circle.node")
	.data(nodes)
	.enter().append("circle")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", 15)
	.call(force.drag);

    force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

	node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
};

/*
  The following methods select the various input elements from the HTML5
  page and feed the input to the proper handler methods.

  Note that the navigation buttons are held, so the handlers are called
  continuously until the mouse either unclicks or leaves the button area.
*/

// var i;    // used to save the interval handle
// $("input[type=button]").mousedown(function() {
//         var val = $(this).attr("value");
//         i = setInterval(function() {return redrawButton(val);}, 100);
//     }).bind("mouseup mouseleave", function() {
//         clearInterval(i);
//     });

$("input[value=help]").click(function() {
    $("#help").toggle();
});

/*
  Author: Aren Edlund-Jermain
  The redraw button function is linked to the redraw button in the control
  panel. It will eventually redraw the image. I think.
*/
function redrawButton(direction)
{
    console.log("redrawButton called with direction: " + direction);
}

/*
  Author: Aren Edlund-Jermain
  The zoomSlider function is linked to the zoom slider in the control panel. It
  will redraw the render with different sizing. Making the object smaller or
  larger depending upon the value retrieved from the actual slider.
*/
function zoomSlider(val)
{
    console.log("zoomSlider called with value: " + val);
}

$("#toolbar").hide();
$(".toggle").click(function(){
    $("#toolbar").slideToggle("fast");
    return false;
});
});