d3.json("data/search.php?id=100&depth=100", function(data) {
	// init a new graph upload new page loading
	var g = new Graph(data.nodes, data.links);
	
	// render for this graph
	var gr = new GraphRender(g);
	// draw this graph (w/ graph events ready)
	gr.draw();
	
	// gui event handler for this graph render
	var ge = new GuiEvent(gr);
	
	// funcky alert
	$('input#depth').val('finished!');
});