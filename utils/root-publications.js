// create adjacency list for the graph, as a list of lists
// only incoming edges are listed
function createAdjacencyList() {
  var links = forceGlobal.links();
  var numNodes = forceGlobal.nodes().length;
  var adjList = [];
  // initialize the adjacency list
  for(var i=0; i<numNodes; i++) {
    adjList.push([]);
  }

  for(var i=0; i<links.length; i++) {
    adjList[links[i].target.id].push(links[i].source.id);
  }
  return adjList;
}

// compute list of roots for all nodes
