// functions to update graph structure dynamically

function addNode(newnode) {
  nodesData.push(newnode);
  update();
}

// assumes that both nodes exist
function addLink(newlink) {
  linksData.push(newlink);
  update();
}

// update the graph after adding/removing nodes/links
function update() {
  // update links
  var newLinks = svg.select("g").selectAll("path") // first g element contains all links
                  .data(linksData, function(d) { return d.source.id + "-" + d.target.id; });

  var enterLinks = newLinks.enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("marker-mid", "url(#end)");

  var exitLinks = newLinks.exit().remove();

  // update nodes
  var newNodes = svg.selectAll(".node")
                  .data(nodesData, function(d) { return d.id; });

  var enterNodes = newNodes.enter()
                    .append("g")
                    .attr("class", "node")
                    .on("click", clickEvent)
                    .call(force.drag);

  enterNodes.append("circle")
    .attr("r", function(d) { return 5*d.authors.length; })
    .style("fill", function(d) { return color(d.type); });

  enterNodes.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) {return d.id; });

  var exitNodes = newNodes.exit().remove();

  force.start();
}