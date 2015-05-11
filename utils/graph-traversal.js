function BFS(id) {
  var numNodes = forceGlobal.nodes().length;

  // distances stores distance from id. -1 means unreachable or unexplored
  var distances = _.range(numNodes).map(function() { return -1; });
  var traversalQueue = [[id, 0]];

  while(traversalQueue.length > 0) {
    var curr = traversalQueue[0];
    traversalQueue = traversalQueue.splice(1);
    if(distances[curr[0]] < 0) {
      distances[curr[0]] = curr[1];
      traversalQueue = _.union(traversalQueue, adjacencyList[curr[0]].map(function(n) { return [n, curr[1]+1]; }));
    }
  }
  colorByDistance(distances);
}

// color nodes based on distance from a fixed node (temporary function for debugging)
function colorByDistance(distances) {
  var svg = d3.select("svg");
  var allNodes = svg.selectAll(".node");
  allNodes.select("circle")
    .style("fill", function(d) {
      if(distances[d.id] == -1) {
        return "red";
      } else if(distances[d.id] <= 1) {
        return "green";
      } else if(distances[d.id] <= 2) {
        return "blue";
      } else {
        return "yellow";
      }
    });
}