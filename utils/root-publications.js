// create adjacency list for the graph, as a dictionary
// only incoming edges are listed
function CreateIncomingAdjacencyList() {
  var links = Force.links();
  var nodes = Force.nodes();
  var adjList = {};

  for(var i=0; i<nodes.length; i++) {
    adjList[nodes[i].id.toString()] = [];
  }

  for(var i=0; i<links.length; i++) {
    adjList[links[i].target.id.toString()].push(links[i].source.id);
  }
  return adjList;
}

// create adjacency list for the graph, as a dictionary
// only outgoing edges are listed
function CreateOutgoingAdjacencyList() {
  var links = Force.links();
  var nodes = Force.nodes();
  var adjList = {};

  for(var i=0; i<nodes.length; i++) {
    adjList[nodes[i].id.toString()] = [];
  }

  for(var i=0; i<links.length; i++) {
    adjList[links[i].source.id.toString()].push(links[i].target.id);
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