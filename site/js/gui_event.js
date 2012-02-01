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
}