// nodes selected on click
var SelectedNodes = [];

// color palette FIX : needs more well-defined colors
// 0-2=publication types, 3=selected node, 4=cited node, 5=citing node
var Color = d3.scale.category10();

// adjacencyList for the graph
// this is a dictionary that stores a list of incoming node ids against node ids (converted to String)
// for example, "2332":[121,5322,4,1234]
var AdjacencyList = {};