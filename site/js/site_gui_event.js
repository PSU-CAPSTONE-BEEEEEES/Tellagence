function initZoom(render) {
    // initialize the render to a decent zoom level
    var w = $(window).width(),
        h = $(window).height();

    function graphCheck(node, i, array) {
        // find all the nodes and filter for the ones off screen
        var contains = node.subgraph_id !== undefined ?
                "id="+node.subgraph_id+" num="+node.num :
                'UserId='+node.id+'UserName='+node.name;
        var circle = $("title:contains("+contains+")").parent();
        var cx = circle.position().left;
        var cy = circle.position().top;
        if ((cx < 0) || (cx > w)) { return true; }    // check x
        if ((cy < 0) || (cy > h)) { return true; }    // check y
        return false;
    }

    // subgraphs and graphs have different names for nodes
    var offNodes = render.graphs !== undefined ?
            render.graphs.filter(graphCheck) : render.nodes.filter(graphCheck);

    // zoom in first if we can
    while (offNodes.length === 0) {
        var click = new ChromeWheel(0, 1);
        offNodes = render.graphs !== undefined ?
            render.graphs.filter(graphCheck) : render.nodes.filter(graphCheck);
    }

    // zoom out until all nodes are on the screen
    while (offNodes.length > 0) {
	var shiftClick = new ChromeWheel(1, 1);
        offNodes = offNodes.filter(graphCheck);
    }

    // reset the zoom slider to halfway to match the initial zoom level
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
