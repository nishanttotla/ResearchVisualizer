// global reference for the force directed graph
var forceGlobal;

// nodes selected on click
var selectedNodes = [];

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

  // highlight citing nodes
  highlightCitingNodes(this.__data__.id)
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

function highlightAllCitedNodesForList(idList) {
  var links = forceGlobal.links();
  var citedNodes = [];
  // collect nodes that are cited by all of the nodes in idList
  for(i=0; i<links.length; i++) {
    if(idList.indexOf(links[i].target.id) > -1) {
      citedNodes.push(links[i].source.id);
    }
  }
  var svg = d3.select("svg");
  var allNodes = svg.selectAll(".node");
  allNodes.select("circle")
    .style("fill", function(d) {
      if(citedNodes.indexOf(d.id) > -1) {
        return "red";
      } else {
        return color(d.type);
      }
    });
}

// function to check if publication id1 cites id2 - naive search through all links
// FIX: needs optimization
function cites(id1,id2) {
  var links = forceGlobal.links();
  for(i=0; i<links.length; i++) {
    if((links[i].target.id == id1) && (links[i].source.id == id2)) {
      return true;
    }
  }
  return false;
}

function highlightCommonCitedNodesForList(idList) {
  var links = forceGlobal.links();
  var citedNodes = [];
  // collect nodes that are cited by all of the nodes in idList
  for(i=0; i<links.length; i++) {
    if(idList.indexOf(links[i].target.id) > -1) {
      citedNodes.push(links[i].source.id);
    }
  }
  var svg = d3.select("svg");
  var allNodes = svg.selectAll(".node");
  allNodes.select("circle")
    .style("fill", function(d) {
      if(citedNodes.indexOf(d.id) > -1) {
        return "red";
      } else {
        return color(d.type);
      }
    });
}

function highlightCitingNodes(id) {
  var links = forceGlobal.links();
  var citingNodes = [];
  // collect nodes that cite the present node
  for(i=0; i<links.length; i++) {
    if(links[i].source.id == id) {
      citingNodes.push(links[i].target.id);
    }
  }
  var svg = d3.select("svg");
  var allNodes = svg.selectAll(".node");
  allNodes.select("circle")
    .style("fill", function(d) {
      if(citingNodes.indexOf(d.id) > -1) {
        return color(5);
      } else {
        return color(d.type);
      }
    });
}

function clickEvent() {
  // highlight selected node
  // d3.select(this)
  //   .select("circle")
  //   .style("fill", color(3)); // FIX : Color not showing up

  // if current node is selected, unselect, else select
  var index = selectedNodes.indexOf(this.__data__.id);
  if(index > -1) {
    // remove border
    d3.select(this)
      .select("circle")
      .style("stroke-width",0);
    selectedNodes.splice(index,1);
  } else {
    // make border and highlight cited nodes
    d3.select(this)
      .select("circle")
      .style("stroke-width",2)
      .style("stroke","black");
    selectedNodes.push(this.__data__.id);
  }
  // highlight citing nodes
  highlightAllCitedNodesForList(selectedNodes);
}