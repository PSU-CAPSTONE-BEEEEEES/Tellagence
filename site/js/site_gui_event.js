function initZoom(render) {
    function subgraphCheck(node, i, array) {
        var circle = $("title:contains('id="+node.subgraph_id+" num="+node.num+"')").parent();
        var cx = circle.position().left;
        var cy = circle.position().top;
        if ((cx < 0) || (cx > render.w)) { return true; }    // check x
        if ((cy < 0) || (cy > render.h)) { return true; }    // check y
        return false;
    }

    var offNodes = [];
    if (render.graphs !== undefined) {
        // in subgraph
        offNodes = render.graphs.filter(subgraphCheck);
        while (offNodes.length > 0) {
	    new ChromeWheel(1, 1);
            offNodes = offNodes.filter(subgraphCheck);
        }
    }
    else {
        // in graph
    }
    $("#slider").attr("value", 50);
}

function SiteGuiEvent() {
	// changes the svg size on window
	$(window).resize(function() {
		// obtain new w/h from resized window
		var w = $("#d3").width();
		var h = $(window).height();
		// apply to subgraph render 
		window.sgr.svg
			.attr("width", w)
			.attr("height", h);
		window.sgr.force.size([w, h]);
		// apply to actual render
		window.sgr.svg
			.attr("width", w)
			.attr("height", h);
		window.sgr.force.size([w, h]);
	});
}
