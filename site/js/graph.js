function Graph(nodes, links) {
	// current data
	this.nodes = nodes;
	this.links = links;
	
	this.empty = function() {
		this.nodes = [];
		this.links = [];
	}
	
	this.data = function(nodes, links) {
		this.nodes = nodes;
		this.links = links;
	}
}