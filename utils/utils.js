// global reference for the force directed graph
var forceGlobal;

// color palette for
// 0-2=publication types, 3=selected node, 4=cited node, 5=citing node
var color = d3.scale.category10();

function mouseover() {
  // add tooltip
  d3.select(this)
    .append("text")
    .text(function(d) { return d.title });

  // highlight selected node
  d3.select(this)
    .select("circle")
    .style("fill", color(3)); // FIX : Color not showing up

  // highlight cited nodes
  highlightCitedNodes(this.__data__.id)
}

function mouseout() {
  // because this text is the 3rd child (circle, text, text)
  d3.select(this).select("text:nth-child(3)").remove();
  // reset all colors to original
  d3.select("svg")
    .selectAll(".node")
    .select("circle")
    .style("fill", function(d) { return color(d.type); })
}

function highlightCitedNodes(id) {
  var links = forceGlobal.links();
  var citedNodes = [];
  // collect nodes that are cited by the present node
  for(i=0; i<links.length; i++) {
    if(links[i].target.id == id) {
      citedNodes.push(links[i].source.id);
    }
  }
  var svg = d3.select("svg");
  var allNodes = svg.selectAll(".node");
  allNodes.select("circle")
    .style("fill", function(d) {
      if(citedNodes.indexOf(d.id) > -1) {
        return color(4);
      } else {
        return color(d.type);
      }
    });
}