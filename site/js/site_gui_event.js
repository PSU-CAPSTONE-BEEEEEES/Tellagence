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
