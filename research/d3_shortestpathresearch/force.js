//by default, small size for canvas
var w = 600,
    h = 500;
//if user select full view, change size of the canvas    
if (document.getElementById("full_view").checked == true){
	w = document.body.clientWidth;
	h = 1000;
}

var  fill = d3.scale.category20(); 

var vis = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);    


d3.json("testcases/"+document.getElementById("test_file").value+".json", function(json) {
	
  var force = d3.layout.force()
  	  
      .charge(-2)
      .linkDistance(function(d) {
      	if (document.getElementById("using_shortestpaths").checked == true)//by default, link's length = shortest path value
      		return d.shortestpath*30;//30: scaling factor changed by slider in interface
      	else// else, use link's length = value infered from frequency , right now just use random data
      		return d.value*30;//30: scaling factor changed by slider in interface
      	})
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
      .start();


  var link = vis.selectAll("line.link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { 
      		if (d.value == 0) 
      			return 0; 
      		else 
      			return 8*1/d.value;//cause right now, we don't have frequency, so use frequency infered from random data (normal path) 
      							   // 8 : scaling factor changed by slider in interface
      })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
            
  link.append("title")
      .text(function(d) { return d.value+','+d.shortestpath; });
  
   var node = vis.selectAll("g.node")
        .data(json.nodes)
        .enter().append("svg:g")
        .attr("class", "node")
        .call(force.drag);

      node.append("svg:image")
    .attr("class", "node")
    .attr("xlink:href", "https://d3nwyuy0nl342s.cloudfront.net/images/icons/public.png")
    .attr("x", "-8px")
    .attr("y", "-8px")
    .attr("width", "16px")
    .attr("height", "16px");
     
      
  	node.append("text")
        .attr("class", "nodetext")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name });
  
  
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
	
    // node.attr("cx", function(d) { return d.x; })
        // .attr("cy", function(d) { return d.y; });
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});
