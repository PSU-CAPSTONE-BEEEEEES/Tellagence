function GuiEvent(graphRender) {
    // graph render for this gui event
    this.graphRender = graphRender;

    // extract input capture on enter
    $("#search").keypress(function(e) {
        // 13 is the ascii code for the enter key
        if (e.which == 13) {
			// retrieve username and depth
			var username = $("#searchbar").val();
			var depth = 20;
			// erase and empty current render
			graphRender.empty();
			// call to server to obtain new graph info
			d3.json('data/search.php?user='+username+'&depth='+depth, function(data) {
				// data for new graph
				graphRender.data(data.nodes, data.links);
				// redraw with new graph and new graph events
				graphRender.draw();
			});
        }
    });

    var initial;
    $("#slider").mousedown(function () {
        initial = this.value;
    }).bind("mouseup mouseleave", function () {
        //alert(this.value - initial);
        var diff = this.value - initial;
        if (diff < 0) {
            return new ChromeWheel( 1 , Math.abs(diff) / 5);
        }
        else {
            return new ChromeWheel( 0 , diff / 5);
        }
    });

    function ChromeWheel ( shift_key , clicks) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent('dblclick', true, true, window, clicks, 10, 10,
        $(window).width() / 2, $(window).height() / 2, 0, 0, shift_key, 0, 1, null);
        document.getElementById('inner').dispatchEvent(evt);
    }
}
