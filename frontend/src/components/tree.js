import { hierarchy, tree } from 'd3-hierarchy'
import { select } from 'd3-selection'
import { linkHorizontal } from 'd3-shape'
import { zoomIdentity, zoom as d3Zoom } from 'd3-zoom'
import { event as d3Event } from 'd3'

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

  const overCircle = (data, i, nodes) => {
    nodes[i].setAttribute('r', 7)
  }
  const outCircle = (data, i, nodes) => {
    nodes[i].setAttribute('r', 4)
  }

  const svg = select("body").append("svg")
    .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2])
    .attr("background-color", "gray")

  const g = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

  // Lines
  const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#f67280")
    .attr("stroke-width", 3)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", linkHorizontal()
      .x(d => d.y)
      .y(d => d.x))

  // Children
  const node = g.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`)

  // Circles
  node.append("circle")
    .attr("fill", "#6c567b")
    .attr("r", 4)
    .on("mouseover", overCircle)
    .on("mouseout", outCircle)

  node.append("text")
    .attr("font-size", "14px")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.title)
    .clone(true).lower()
    .attr("fill", "black")

  const zoomed = () => {
    g.attr("transform", d3Event.transform);
  }

  const zoom = d3Zoom().on("zoom", zoomed);

  svg.call(zoom).call(zoom.transform, zoomIdentity)
}
