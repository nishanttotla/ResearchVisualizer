/* functions to update graph structure dynamically
 */

// function to search for a node, returns index
// FIX : Should use force.nodes() instead of NodesData?
function findNodeIndex(id) {
  var ids = _.map(NodesData, function(n) { return n.id; });
  return ids.indexOf(id);
}

function findHiddenNodeIndex(id) {
  var ids = _.map(HiddenNodesData, function(n) { return n.id; });
  return ids.indexOf(id);
}

// function to add a node, assumes it does not already exist
// requires a full node object
function addNode(newnode) {
  if(findNodeIndex(newnode.id) > -1) {
    alert("Node already exists!");
    return;
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
    return;
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

// add all links for newly added node
// the relevant node must be newly added and it's links not present yet
function addAllLinks(n) {
  var nodes = Force.nodes();
  var additionalLinks = [];
  // add links for nodes that cite this id, and nodes that id cites
  for(var i=0; i<nodes.length; i++) {
    var sim = nodeSimilarity(n, nodes[i]);
    if(sim >= LinkThreshold) {
      if(nodes[i].citations.indexOf(n.id) > -1) {
        additionalLinks.push({"source":n.id, "target":nodes[i].id, "value":sim});
      }
      if(n.citations.indexOf(nodes[i].id) > -1) {
        additionalLinks.push({"source":nodes[i].id, "target":n.id, "value":sim});
      }
    }
  }
  // add all links one by one
  for(var i=0; i<additionalLinks.length; i++) {
    addLink(additionalLinks[i]);
  }
}

// the 'newlink' argument is specified using ids of the objects that the link is incident upon
// the ids are used to retrieve the indices of the two objects in the node list
// this must be done because force needs references (objects or indices) to relevant nodes
// FIX : check if link already exists
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
    return;
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
                    .attr("marker-mid", "url(#end)")
                    .style("stroke-width", function(d) { return d.value; });

  var exitLinks = newLinks.exit().remove();

  // update nodes
  var newNodes = Svg.selectAll(".node")
                  .data(NodesData, function(d) { return d.id; });

  var enterNodes = newNodes.enter()
                    .append("g")
                    .attr("class", "node")
                    .on("click", clickEvent)
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

// move node to hidden list, and delete all incident nodes
function hideNode(nodeId) {
  var index = findNodeIndex(nodeId);
  if(index > -1) {
    HiddenNodesData.push(NodesData.splice(index, 1)[0]);
  } else {
    alert("Node already invisible or does not exist!");
    return;
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

// show hidden nodes
function showNode(nodeId) {
  var index = findHiddenNodeIndex(nodeId);
  var nodeToShow = null;
  if(index > -1) {
    nodeToShow = HiddenNodesData.splice(index, 1)[0];
    NodesData.push(nodeToShow);
  } else {
    alert("Node already visible or does not exist!");
    return;
  }
  // remove incident edges
  // FIX : This will recompute edge weights, but that's a fair price to pay
  // as opposed to the alternative, which would involve storing and searching over links
  addAllLinks(nodeToShow);

  update();
}

// update threshold
function updateThreshold(val) {
  PreviousLinkThreshold = LinkThreshold;
  LinkThreshold = val;
  console.log('Updating, please wait...');
  filterLinksByThreshold();
  console.log('Done!');
}

// update graph based on new link threshold
// if the threshold went up, then nothing more to do
// if the threshold went down, then for each node, only add links that are
// no less than the new threshold, but less than the old threshold
// FIX : Reducing threshold is inefficient for large graphs right now
function filterLinksByThreshold() {
  if(LinkThreshold > PreviousLinkThreshold) { // some links must be removed
    var i=0;
    while(i < LinksData.length) {
      if(LinksData[i].value < LinkThreshold) {
        LinksData.splice(i,1);
      } else {
        i++;
      }
    }
    update();
  } else if(LinkThreshold < PreviousLinkThreshold) { // some links must be added
    var nodes = Force.nodes();
    var additionalLinks = [];
    for(var i=0; i<nodes.length; i++) {
      for(var j=i+1; j<nodes.length; j++) {
        var sim = nodeSimilarity(nodes[i], nodes[j]);
        if(sim >= LinkThreshold && sim < PreviousLinkThreshold) {
          if(nodes[j].citations.indexOf(nodes[i].id) > -1) {
            additionalLinks.push({"source":nodes[i].id, "target":nodes[j].id, "value":sim});
          }
          if(nodes[i].citations.indexOf(nodes[j].id) > -1) {
            additionalLinks.push({"source":nodes[j].id, "target":nodes[i].id, "value":sim});
          }
        }
      }
    }
    // add all links one by one
    for(var i=0; i<additionalLinks.length; i++) {
      addLink(additionalLinks[i]);
    }
  }
}