d3.json("data/search.php?id=1&depth=10", function(data) {
    console.log('here');
        $("#step1").hide();
        $("#step2").show();
	// render for this graph
	var gr = new GraphRender(data.nodes, data.links);
	// draw this graph (w/ graph events ready)
	gr.draw();
	
	// gui event handler for this graph render
	var ge = new GuiEvent(gr);
});
