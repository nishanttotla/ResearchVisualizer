/* functions to update graph structure dynamically
 */

// function to search for a node, returns index
// FIX : Should use force.nodes() instead of NodesData?
function findNodeIndex(id) {
  var ids = _.map(NodesData, function(n) { return n.id; });
  return ids.indexOf(id);
}

// function to add a node, assumes it does not already exist
// requires a full node object
function addNode(newnode) {
  if(findNodeIndex(newnode.id) > -1) {
    alert("Node already exists!");
  } else {
    NodesData.push(newnode);
    update();
  }
}

// function to remove a node by id, also removes incident edges
function removeNode(nodeId) {
  var index = findNodeIndex(nodeId);
  if(index > -1) {
    NodesData.splice(index, 1);
  } else {
    alert("Tried to remove non-existent node!");
  }
  // remove incident edges
  var i=0;
  while(i < LinksData.length) {
    if(LinksData[i].source.id == nodeId || LinksData[i].target.id == nodeId) {
      LinksData.splice(i,1);
    } else {
      i++;
    }
  }

  update();
}

// the 'newlink' argument is specified using ids of the objects that the link is incident upon
// the ids are used to retrieve the indices of the two objects in the node list
// this must be done because force needs references (objects or indices) to relevant nodes
// FIX : Use adjacency list to find if the link exists faster
function addLink(newlink) {
  var index1 = findNodeIndex(newlink.source);
  var index2 = findNodeIndex(newlink.target);
  newlink.source = index1;
  newlink.target = index2;
  if(index1 > -1 && index2 > -1) {
    LinksData.push(newlink);
    update();
  } else {
    alert("One or both nodes not in the graph!");
  }
}

// update the graph after adding/removing nodes/links
function update() {
  // update links
  var newLinks = Svg.select("g").selectAll("path") // first g element contains all links
                  .data(LinksData, function(d) { return d.source.id + "-" + d.target.id; });

  var enterLinks = newLinks.enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("marker-mid", "url(#end)");

  var exitLinks = newLinks.exit().remove();

  // update nodes
  var newNodes = Svg.selectAll(".node")
                  .data(NodesData, function(d) { return d.id; });

  var enterNodes = newNodes.enter()
                    .append("g")
                    .attr("class", "node")
                    .on("click", retrieveCitations)
                    .call(Force.drag);

  enterNodes.append("circle")
    .attr("r", function(d) { return 5*d.authors.length; })
    .style("fill", function(d) { return Color(d.type); });

  enterNodes.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) {return d.id; });

  var exitNodes = newNodes.exit().remove();

  Force.start();
}