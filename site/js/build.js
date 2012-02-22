d3.json("data/subgraph.php", function(data) {
	// switch the spinning bar for the loading bar
	switchBars();
	// render for this graph
	var sgr = new SubgraphRender(data.graphs);
	// draw subgraph (w/ graph events ready)
	sgr.draw();
});
