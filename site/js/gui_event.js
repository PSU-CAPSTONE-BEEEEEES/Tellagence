function GuiEvent(renderObject) {
    // render object for this gui event
    this.renderObject = renderObject;

    $.getJSON("data/userlist.php", function(json) {
        var names = [];
        $.each(json.users, function(i, entry) {
            // builds array from JSON
            names.push(entry.username);
        });

        // need access to names after getJSON, so we put autocomplete here
        $("#searchbar").autocomplete({
            source: names,
            minLength: 2,   //minimum number of characters before matching
            max: 5,         //maximum number of matched results
            select: function(event, ui) {
                // throw a new popup up
                resetPopup();
                var depth = 100;
                // erase and empty current render
                renderObject.empty();
                // call to server to obtain new graph info
                d3.json('data/search.php?user='+ui.item.value+'&depth='+depth, function(data) {
                    // switch the spinning bar for the loading bar
                    switchBars();

                    // reenable the subgraph button
                    $("#dots").show();

                    // data for new graph
                    renderObject.data(data.nodes, data.distances, data.links);
                    renderObject.setCenterNode(data.nodes[0].id);
                    // redraw with new graph and new graph events
                    renderObject.draw();
                });
            }
        });
    });

	var initial;
	$("#slider").mousedown(function () {
		initial = this.value;
	});
	
	$("#slider").mouseup(function () {
		//alert(this.value - initial);
		var diff = this.value - initial;
        //if diff is 0 do nothing
        if (diff == 0) {
            return;
        }
		if (diff < 0) {
			return new ChromeWheel( 1 , (Math.abs(diff) / 5));
		}
		else {
			return new ChromeWheel( 0 , (diff / 5));
		}
		diff = 0;
	});
}
