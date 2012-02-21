d3.json("data/search.php?id=1&depth=300", function(data) {
        // switch the spinning bar for the loading bar
        switchBars();
	// render for this graph
	var gr = new GraphRender(data.nodes, data.links);
	// draw this graph (w/ graph events ready)
	gr.draw();
	
	// gui event handler for this graph render
	var ge = new GuiEvent(gr);
});
