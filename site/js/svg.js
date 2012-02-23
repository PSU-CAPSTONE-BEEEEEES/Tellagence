// An implementation of getScreenBBox, by Antoine Quint
// http://the.fuchsia-design.com/2006/12/getting-svg-elementss-full-bounding-box.html
//
// Note that the selectors in createPoint and createRect were modified to use
// jQuery for our purpose instend of document.getElementById
function getScreenBBox_impl(element) {

  // macro to create an SVGPoint object
  function createPoint (x, y) {
    var point = $("svg")[0].createSVGPoint();
    point.x = x;
    point.y = y;
    return point;
  }

  // macro to create an SVGRect object
  function createRect (x, y, width, height) {
    var rect = $("svg")[0].createSVGRect();
    rect.x = x;
    rect.y = y;
    rect.width = width;
    rect.height = height;
    return rect; 
  }

  // get the complete transformation matrix
  var matrix = element.getScreenCTM();
  // get the bounding box of the target element
  var box = element.getBBox();

  // create an array of SVGPoints for each corner
  // of the bounding box and update their location
  // with the transform matrix
  var corners = [];
  var point = createPoint(box.x, box.y);
  corners.push( point.matrixTransform(matrix) );
  point.x = box.x + box.width;
  point.y = box.y;
  corners.push( point.matrixTransform(matrix) );
  point.x = box.x + box.width;
  point.y = box.y + box.height;
  corners.push( point.matrixTransform(matrix) );
  point.x = box.x;
  point.y = box.y + box.height;
  corners.push( point.matrixTransform(matrix) );
  var max = createPoint(corners[0].x, corners[0].y);
  var min = createPoint(corners[0].x, corners[0].y);

  // identify the new corner coordinates of the
  // fully transformed bounding box
  for (var i = 1; i < corners.length; i++) {
    var x = corners[i].x;
    var y = corners[i].y;
    if (x < min.x) {
      min.x = x;
    }
    else if (x > max.x) {
      max.x = x;
    }
    if (y < min.y) {
      min.y = y;
    }
    else if (y > max.y) {
      max.y = y;
    }
  }
  
  // return the bounding box as an SVGRect object
  return createRect(min.x, min.y, max.x - min.x, max.y - min.y);
}

function redraw(a) {
    d3.select("#inner").attr("transform",
                             "translate(" + d3.event.translate + ")" +
                             " scale(" + d3.event.scale + ")");

    // resize rect with inner
    var ssb = getScreenBBox_impl($("#inner")[0]);
    $("#rect").width(ssb.width);
    $("#rect").height(ssb.height);
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
