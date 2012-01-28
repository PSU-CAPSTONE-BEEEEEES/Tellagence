d3.json("random2.php?size=30", function(data) {
	// init a new graph upload new page loading
	var g = new Graph(data.nodes, data.links);
	
	// render for this graph
	var gr = new GraphRender(g);
	// draw this graph (w/ graph events ready)
	gr.draw();
	
	// gui event handler for this graph render
	var ge = new GuiEvent(gr);
});