function initZoom(render) {
    function graphCheck(node, i, array) {
        var contains = node.subgraph_id !== undefined ?
                "id="+node.subgraph_id+" num="+node.num :
                'UserId='+node.id+'UserName='+node.name;
        var circle = $("title:contains("+contains+")").parent();
        var cx = circle.position().left;
        var cy = circle.position().top;
        if ((cx < 0) || (cx > render.w)) { return true; }    // check x
        if ((cy < 0) || (cy > render.h)) { return true; }    // check y
        return false;
    }

    var offNodes = [];
    if (render.graphs !== undefined) {
        // in subgraph
        offNodes = render.graphs.filter(graphCheck);
        while (offNodes.length > 0) {
	    new ChromeWheel(1, 1);
            offNodes = offNodes.filter(graphCheck);
        }
    }
    else {
        // in graph
        offNodes = render.nodes.filter(graphCheck);
        while (offNodes.length > 0) {
	    new ChromeWheel(1, 1);
            offNodes = offNodes.filter(graphCheck);
        }
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
