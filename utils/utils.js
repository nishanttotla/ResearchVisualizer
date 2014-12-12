function mouseover() {
  d3.select(this).select("circle")
    .transition()
    .duration(750)
    .attr("r", 16);
}

function mouseout() {
  d3.select(this).select("circle")
    .transition()
    .duration(750)
    .style("fill", "red");
}