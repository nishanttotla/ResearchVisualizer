// color "red" all nodes that are in idList
function colorNodeList(idList) {
  var allNodes = Svg.selectAll(".node");
  allNodes.select("circle")
    .style("fill", function(d) {
      if(idList.indexOf(d.id) > -1) {
        return "red";
      } else {
        return Color(d.type);
      }
    });
}

// reset selections to original
function resetSelections() {
  // reset colors
  var allNodes = Svg.selectAll(".node");
  allNodes.select("circle")
    .style("fill", function(d) {
      return Color(d.type);
    })
    .style("stroke-width",0);

  // clear selection
  SelectedNodes = [];
}

function highlightCitingNodes(id) {
  var links = Force.links();
  var citingNodes = [];
  // collect nodes that cite the present node
  for(var i=0; i<links.length; i++) {
    if(links[i].source.id == id) {
      citingNodes.push(links[i].target.id);
    }
  }
  colorNodeList(citingNodes);
}

function highlightCitedNodes(id) {
  var links = Force.links();
  var citedNodes = [];
  // collect nodes that are cited by the present node
  for(var i=0; i<links.length; i++) {
    if(links[i].target.id == id) {
      citedNodes.push(links[i].source.id);
    }
  }
  colorNodeList(citedNodes);
}

function highlightAllCitedNodesForList(idList) {
  var links = Force.links();
  var citedNodes = [];
  // collect nodes that are cited by all of the nodes in idList
  for(var i=0; i<links.length; i++) {
    if(idList.indexOf(links[i].target.id) > -1) {
      citedNodes.push(links[i].source.id);
    }
  }
  // citedNodes list can potentially contain duplicates
  colorNodeList(citedNodes);
}

// function to check if publication id1 cites id2 - naive search through all links
// FIX: needs optimization
function cites(id1,id2) {
  var links = Force.links();
  for(var i=0; i<links.length; i++) {
    if((links[i].target.id == id1) && (links[i].source.id == id2)) {
      return true;
    }
  }
  return false;
}

// function to check if publication id is cited by all publications in idList
function citedByAll(id, idList) {
  for(var i=0; i<idList.length; i++) {
    if(!(cites(idList[i],id))) {
      return false;
    }
  }
  return true;
}

// find all common citations for publications in idList
// FIX: Needs optimization (compute citation lists of all in idList then perform intersections)
//      one way to optimize is to sort citedNodes and keep only those elements that occur exactly
//      idList times, because would have been added once for each element in idList
function highlightCommonCitedNodesForList(idList) {
  var links = Force.links();
  var citedNodes = [];
  var commonCitedNodes = [];
  // collect nodes that are cited by all of the nodes in idList (the union)
  for(var i=0; i<links.length; i++) {
    if(idList.indexOf(links[i].target.id) > -1) {
      citedNodes.push(links[i].source.id);
    }
  }

  for(var i=0; i<citedNodes.length; i++) {
    if(citedByAll(citedNodes[i],idList)) {
      commonCitedNodes.push(citedNodes[i]);
    }
  }

  colorNodeList(commonCitedNodes);
}

function clickEvent() {
  // highlight selected node
  // d3.select(this)
  //   .select("circle")
  //   .style("fill", Color(3)); // FIX : Color not showing up

  // if current node is selected, unselect, else select
  var index = SelectedNodes.indexOf(this.__data__.id);
  if(index > -1) {
    // remove border
    d3.select(this)
      .select("circle")
      .style("stroke-width",0);
    SelectedNodes.splice(index,1);
  } else {
    // make border and highlight cited nodes
    d3.select(this)
      .select("circle")
      .style("stroke-width",2)
      .style("stroke","black");
    SelectedNodes.push(this.__data__.id);
  }
  // highlight citing nodes
  // highlightAllCitedNodesForList(SelectedNodes); // works
  highlightCommonCitedNodesForList(SelectedNodes); // works
}