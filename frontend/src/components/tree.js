import { hierarchy, tree, select, linkHorizontal } from 'd3'

// Get JSON data
export function setupTree(treeData) {
  var treeDataWithParent = {
    title: "parent",
    children: treeData,
  }
  const width = 954
  const data = hierarchy(treeDataWithParent)
  data.dx = 100;
  data.dy = width / (data.height + 1);
  var root = tree().nodeSize([data.dx, data.dy])(data)

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const svg = select("body").append("svg")
    .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2])
    .attr("background-color", "gray")

  const g = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

  const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#ff0000")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", linkHorizontal()
    .x(d => d.y)
    .y(d => d.x))

  const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`)

  node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5)

  node.append("text")
      .attr("font-size", "14px")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.title)
      .clone(true).lower()
      .attr("fill", "black")

  svg.node()
}

