var w = $(window).width();
var h = $(window).height();

var graph = d3.select("body").append("svg")
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


$(document).ready(function() {
    // used to save the interval handle
    var i;

    // Keeps track of times the functions in setInterval are called. This is
    // offset to 1 for the .join() operation in search_bar.
    var num_called = 1;

    /*
      These two functions select the up and down buttons on mousedown events and
      repeat a function at the given interval (100 ms). The repetition will
      continue until mouseup or mouseleave events occur.
     */
    $("#pan_up").mousedown(function() {
	i = setInterval(function() {search_bar("up");}, 100);
    }).bind("mouseup mouseleave", function() {
	clearInterval(i);
    });

    $("#pan_down").mousedown(function() {
	i = setInterval(function() {search_bar("down");}, 100);
    }).bind("mouseup mouseleave", function() {
	clearInterval(i);
    });

    /*
      Author: Aren Edlund-Jermain
      The redraw button function is linked to the redraw button in the control
      panel. It will eventually redraw the image. I think.
    */
    function redrawButton()
    {
	alert("Hello World!");
    }

    /*
      Author: Aren Edlund-Jermain
      The zoomSlider function is linked to the zoom slider in the control panel. It
      will redraw the render with different sizing. Making the object smaller or
      larger depending upon the value retrieved from the actual slider.
    */
    function zoomSlider()
    {
	
    }

    /*
      search_bar is a demo function that increases/decreases the number of '|'
      in the text input field on up/down button presses. It is purely to show
      how holding the buttons can trigger functions continuously until the
      button is released.
     */
    function search_bar(type)
    {
	if (type == "up") {
	    num_called += 1;
	}
	else if (type == "down"){
	    num_called -= 1;
	}

	// creates an Array of '|' at length num_called - 1 and sets it in the
	// input text field
	var text = Array(num_called).join("|")
	$("#search").attr("value", text);
    };

});
