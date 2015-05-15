// nodes selected on click
var selectedNodes = [];

// color palette FIX : needs more well-defined colors
// 0-2=publication types, 3=selected node, 4=cited node, 5=citing node
var color = d3.scale.category10();

// adjacencyList for the graph
var adjacencyList = [];