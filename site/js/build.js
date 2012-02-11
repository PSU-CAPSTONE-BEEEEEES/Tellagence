d3.json("data/search.php?id=100&depth=10", function(data) {
	// render for this graph
	var gr = new GraphRender(data.nodes, data.links);
	// draw this graph (w/ graph events ready)
	gr.draw();
	
	// gui event handler for this graph render
	var ge = new GuiEvent(gr);
	
});
