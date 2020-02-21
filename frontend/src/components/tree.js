import { hierarchy, tree as d3Tree } from 'd3-hierarchy'
import { select } from 'd3-selection'
import { linkHorizontal } from 'd3-shape'
import { zoomIdentity, zoomTransform, zoom as d3Zoom } from 'd3-zoom'
import { event as d3Event, create as d3Create } from 'd3'

// Get JSON data
export function setupTree(treeData) {
  var treeDataWithParent = {
    title: "parent",
    children: treeData,
  }
  const width = 954
  const height = 600
  const data = hierarchy(treeDataWithParent)
  data.dx = 40;
  data.dy = width / (data.height + 1);
  var dataTree = d3Tree().nodeSize([data.dx, data.dy])(data)

  const overCircle = (data, i, nodes) => {
    nodes[i].setAttribute('r', 7)
  }
  const outCircle = (data, i, nodes) => {
    nodes[i].setAttribute('r', 4)
  }

  //
  // BEGIN SETUP CONTAINER AND ZOOM
  //

  // Root SVG
  const svg = select("#svg-container").append("svg")
    .attr("viewBox", [0, 0, document.getElementById('svg-container').offsetWidth, document.getElementById('svg-container').offsetHeight])
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("background-color", "gray")

  // Zoom container
  const zoomContainer = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("border", '1px dotted red')
    .attr("font-size", 10)

  const zoomed = () => zoomContainer.attr("transform", d3Event.transform)
  const zoom = d3Zoom().on("zoom", zoomed)
  svg.call(zoom).call(zoom.transform, zoomIdentity.translate(width / 4, height / 2));

  //
  // END SETUP CONTAINER AND ZOOM
  //

  // Lines
  const link = zoomContainer.append("g")
    .attr("fill", "none")
    .attr("stroke", "#f67280")
    .attr("stroke-width", 3)
    .selectAll("path")
    .data(dataTree.links())
    .join("path")
    .attr("d", linkHorizontal()
      .x(d => d.y)
      .y(d => d.x))

  // Children
  const node = zoomContainer.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(dataTree.descendants())
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
}
