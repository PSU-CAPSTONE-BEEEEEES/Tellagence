function GuiEvent(graphRender) {
	// graph render for this gui event
	this.graphRender = graphRender;
	
	// on click empty the graph
	$('input#btn_erase').click(function() {
		graphRender.erase();
	});
	
	// on click redraw the graph
	$('input#btn_redraw').click(function() {
		graphRender.draw();
	});

	// on click change size of current graph
	$('input#btn_redraw_data').click(function() {
		var size = $('input#nodes').val();
		graphRender.erase();
		graphRender.changeData(size);
		graphRender.draw();
	});
	
	// on change modify depth
	$('input#depth').focus(function() {
		$('input#depth').val('');
	});
	$('input#depth').blur(function() {
		var depth = $('input#depth').val();
		if (!depth)
			depth = 5;
		graphRender.erase();
		graphRender.changeData(depth);
		graphRender.draw();
	});
}