// draw a gobal svg area
var svg = new SVG();

// render for subgraph
var sgr = new SubgraphRender([]);
// gui event for subgraphs
var sge = new SubgraphGuiEvent(sgr);

// render for an actual graph
var gr = new GraphRender([], []);
// gui event for an actual subgraph
var ge = new GuiEvent(gr);

d3.json("data/subgraph.php", function(data) {
    // switch the spinning bar for the loading bar
    switchBars();
    // retrieve data for subgraph render
    window.sgr.data(data.graphs);
    // draw subgraph (w/ graph events ready)
    window.sgr.draw();
});

// events for global user gui
var sgui = new SiteGuiEvent();
