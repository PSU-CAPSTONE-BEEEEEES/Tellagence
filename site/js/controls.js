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

// draw([{n1:'1',n2:'2'}, {n1:'3',n2:'6'}, {n1:'0',n2:'1'}],
//      [{source:0, target:1},{source:1, target:2}]);

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


// text input capture on enter
$("#search").keypress(function(e) {
    // 13 is the ascii code for the enter key
    if (e.which == 13) {
	alert("enter pressed with " + $("#search").val());
    }
});

// toolbar animation and help overlay functions
$("#toolbar").hide();
$("#tab").click(
    function(){
        $("#toolbar").slideToggle("fast");
    }
);

// functions for controlling the help overlay visibility and position
function loadPopup(){
    //loads popup only if it is disabled
    if($("#bgPopup").data("state")==0){
        $("#bgPopup").css({
            "opacity": "0.7"
        });
        $("#bgPopup").fadeIn("medium");
        $("#Popup").fadeIn("medium");
        $("#bgPopup").data("state",1);
    }
}

function disablePopup(){
    if ($("#bgPopup").data("state")==1){
        $("#bgPopup").fadeOut("medium");
        $("#Popup").fadeOut("medium");
        $("#bgPopup").data("state",0);
    }
}

function centerPopup(){
    var winw = $(window).width();
    var winh = $(window).height();
    var popw = $('#Popup').width();
    var poph = $('#Popup').height();
    $("#Popup").css({
        "position" : "absolute",
        "top" : winh/2 - poph/2,
        "left" : winw/2 - popw/2
    });
}

// selectors on the help button to trigger the functions
$("#bgPopup").data("state",0);
$("#help_button").click(function(){
    centerPopup();
    loadPopup();
});
$("#bgPopup").click(function(){
    disablePopup();
});

$(window).resize(function() {
    centerPopup();
});
});