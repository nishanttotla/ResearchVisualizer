function BFS(id) {
  var numNodes = Force.nodes().length;

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
  var allNodes = Svg.selectAll(".node");
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

function countOutgoingEdges() {
  var allNodes = Force.nodes();
  allNodes = _.map(allNodes, function(n) { n['outgoing'] = 0; return n; });
  var allLinks = Force.links();
  for(var i=0; i<allLinks.length; i++) {
    var srcId = allLinks[i].source.id;
    allNodes[findNodeIndex(srcId)].outgoing++;
  }
  return allNodes;
}

function countOutgoingWeight() {
  var allNodes = Force.nodes();
  allNodes = _.map(allNodes, function(n) { n['outgoing'] = 0; return n; });
  var allLinks = Force.links();
  for(var i=0; i<allLinks.length; i++) {
    var srcId = allLinks[i].source.id;
    allNodes[findNodeIndex(srcId)].outgoing+= allLinks[i].value;
  }
  return allNodes;
}