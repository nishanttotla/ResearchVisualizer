// create adjacency list for the graph, as a list of lists
// only incoming edges are listed
function createAdjacencyList() {
  var links = Force.links();
  var numNodes = Force.nodes().length;
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

// compute list of roots for node id using the adjacency list
// FIX : Use memoization and compute roots for all nodes at once
function findRoots(id, adjList) {
  if(adjList[id].length == 0) {
    return [id];
  } else {
    var roots = [];
    for(var i=0; i<adjList[id].length; i++) {
      roots = _.union(roots, findRoots(adjList[id][i], adjList));
    }
    return roots;
  }
}