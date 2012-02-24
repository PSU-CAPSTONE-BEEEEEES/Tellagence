var w = 960,
    h = 600,
    fill = d3.scale.category20();

var vis = d3.select("#chart").append("svg")
    .attr("width", w)
    .attr("height", h);

d3.json("subgraphs.json", function(json) {
  var force = d3.layout.force()
      .charge(function(d) {return -5*5*Math.log(d.num);}) //charge = 5*radius to separate nodes -> no overlapping
      .nodes(json.graphs)
      .size([w, h])
      .start();
	  
  var node = vis.selectAll("circle.node")
      .data(json.graphs)
    .enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return 5*Math.log(d.num); }) //radius is scaled in logarithmic scale
      .style("fill", function(d) {
      	q = d3.scale.log().range(["blue","red"]); //color is scaled from blue(cold) -> red(hot) by using logarithmic scale
      	return q(d.num);
      	})
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.num; });
 
  force.on("tick", function() {
  
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});
