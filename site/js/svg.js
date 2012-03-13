function ChromeWheel ( shift_key , clicks) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent('dblclick', true, true, window, clicks, 10, 10,
		       $(window).width() / 2, $(window).height() / 2, 0, 0, shift_key, 0, 1, null);
    document.getElementById('inner').dispatchEvent(evt);
}

var rectSet = false;
var lastX = null;
var lastY = null;
var lastS = null;
function redraw() {
    // split "translate(0, 0) scale(1)" to get the translate and scale floats
    var splits = $("#inner").attr("transform").split("(");
    var transSplit = splits[1].split(")")[0].split(",");
    var scale = parseFloat(splits[2].split(")")[0]);
    var transX = parseFloat(transSplit[0]);
    var transY = parseFloat(transSplit[1]);

    if (lastX == null) {
        lastX = d3.event.translate[0];
        lastY = d3.event.translate[1];
        lastS = d3.event.scale;
    }
    else {
        if (d3.event.translate[0] < lastX) {
            transX -= Math.abs(d3.event.translate[0] - lastX);
            lastX = d3.event.translate[0];
        }
        else if (d3.event.translate[0] > lastX) {
            transX += Math.abs(d3.event.translate[0] - lastX);
            lastX = d3.event.translate[0];
        }

        if (d3.event.translate[1] < lastY) {
            transY -= Math.abs(d3.event.translate[1] - lastY);
            lastY = d3.event.translate[1];
        }
        else if (d3.event.translate[1] > lastY) {
            transY += Math.abs(d3.event.translate[1] - lastY);
            lastY = d3.event.translate[1];
        }

        if (d3.event.scale < lastS) {
            scale -= Math.abs(d3.event.scale - lastS);
            lastS = d3.event.scale;
        }
        else if (d3.event.scale > lastS) {
            scale += Math.abs(d3.event.scale - lastS);
            lastS = d3.event.scale;
        }
    }

    d3.select("#inner").attr("transform",
                             "translate(" + transX + "," + transY + ")" +
                             " scale(" + scale + ")");

    // resize rect to fit snug in inner
    var bbox = $("#inner")[0].getBBox();
    if (!rectSet) {
        $("rect").attr("x", bbox.x)
            .attr("y", bbox.y)
            .attr("width", bbox.width)
            .attr("height", bbox.height);
        rectSet = true;
    }
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

        // set rect to the screen size initially
        this.svg.append('rect')
                .attr("width", this.w)
                .attr("height", this.h)
                .style("fill", "white");
}
