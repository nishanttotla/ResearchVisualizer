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

// function to compute similarity between nodes, independent of whether nodes are connected
// useful for computing edge weight if nodes are connected
function nodeSimilarity(n1, n2) {
  // author similarity score - HIGH priority
  // more common authors and fewer authors are better
  var authors1 = n1.authors,
      authors2 = n2.authors,
      commonAuthors = _.intersection(authors1, authors2);
  var authorsScore = (commonAuthors.length * commonAuthors.length)/(authors1.length * authors2.length);

  // citation similarity score - MODERATE priority
  var citations1 = n1.citations,
      citations2 = n2.citations,
      commonCitations = _.intersection(citations1, citations2);
  var citationsScore = 0;
  if(citations1.length > 0 && citations2.length > 0) {
    citationsScore = (commonCitations.length * commonCitations.length)/(citations1.length * citations2.length);
  }

  // title similarity score - HIGH priority
  var title1 = n1.title,
      title2 = n2.title;
  var titleScore = 0;

  // venue similarity score - MODERATE/LOW priority
  var venueScore = 0;
  if(n1.venue == n2.venue) {
    venueScore = 0.1;
  }

  // temporal proximity score - MODERATE/LOW priority
  var year1 = n1.year;
  var year2 = n2.year;
  var yearDiff = Math.abs(year1-year2);
  var yearDiffScore = 0;
  if(yearDiff < 10) { // better to cite applications that are more recent
    yearDiffScore = (10 - yearDiff)/10;
  }

  // combine everything
  var authorsWeight = 1.0,
      citationsWeight = 1.0,
      titleWeight = 2.0,
      venueWeight = 0.5,
      yearDiffWeight = 0.5;
  return authorsWeight*authorsScore + citationsWeight*citationsScore + titleWeight*titleScore +
         venueWeight*venueScore + yearDiffWeight*yearDiffScore;
}