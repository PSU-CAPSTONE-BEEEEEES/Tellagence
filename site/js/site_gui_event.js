function getNode(node) {
    // translate a d3 node into a jquery selected element
    var contains = node.subgraph_id !== undefined ?
            "id="+node.subgraph_id+" num="+node.num :
            'UserId='+node.id+'UserName='+node.name;
    return $("title:contains("+contains+")").parent();
}

function centerGraph(nodes, w, h) {
    // find nodes at farthest right, left, top, and bottom
    var tNode, bNode, rNode, lNode;
    for (var i = 0; i < nodes.length; i++) {
        var top  = getNode(nodes[i]).position().top;
        var left = getNode(nodes[i]).position().left;

        if ((tNode === undefined) || (top < tNode.position().top)) {
            tNode = getNode(nodes[i]);
        }
        if ((bNode === undefined) || (top > bNode.position().top)) {
            bNode = getNode(nodes[i]);
        }
        if ((lNode === undefined) || (left < lNode.position().left)) {
            lNode = getNode(nodes[i]);
        }
        if ((rNode === undefined) || (left > rNode.position().left)) {
            rNode = getNode(nodes[i]);
        }
    }

    // within 5 pixels seems reasonable
    function hCentered() {
        return Math.abs(tNode.position().top - (h - bNode.position().top)) < 20;
    };
    function wCentered() {
        return Math.abs(lNode.position().left - (w - rNode.position().left)) < 20;
    };

    // translate the graph until centered
    while ((hCentered() && wCentered()) !== true) {
        // translate(0, 0) scale(1)
        var splits = $("#inner").attr("transform").split("(");
        var transSplit = splits[1].split(")")[0].split(",");
        var scaleSplit = parseInt(splits[2].split(")")[0]);

        if (transSplit.length == 1) { break; }

        var trans1 = parseInt(transSplit[0]);
        var trans2 = parseInt(transSplit[1]);

        var newTrans1, newTrans2;
        if (tNode.position().top < (h - bNode.position().top)) {
            newTrans1 = trans1 - 20;
        }
        else if (tNode.position().top > (h - bNode.position().top)) {
            newTrans1 = trans1 + 20;
        }
        else {
            newTrans1 = trans1;
        }

        if (lNode.position().left > (w - rNode.position().left)) {
            newTrans2 = trans2 - 20;
        }
        else if (lNode.position().left < (w - rNode.position().left)){
            newTrans2 = trans2 + 20;
        }
        else {
            newTrans2 = trans2;
        }

        d3.select("#inner").attr("transform",
                                 "translate(" + newTrans1 + ", " + newTrans2 + ")"
                                 + " scale(" + scaleSplit + ")");
    }
}

function initZoom(render) {
    // initialize the render to a decent zoom level
    var w = $(window).width(),
        h = $(window).height();

    function graphCheck(node, i, array) {
        // find all the nodes and filter for the ones off screen
        var circle = getNode(node);
        var cx = circle.position().left;
        var cy = circle.position().top;
        if ((cx < 0) || (cx > w)) { return true; }    // check x
        if ((cy < 0) || (cy > h)) { return true; }    // check y
        return false;
    }

    // subgraphs and graphs have different names for nodes
    var nodes = render.graphs !== undefined ? render.graphs : render.nodes;
    var offNodes = render.graphs !== undefined ?
            render.graphs.filter(graphCheck) : render.nodes.filter(graphCheck);

    // recenter graph
    centerGraph(nodes, w, h);

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
