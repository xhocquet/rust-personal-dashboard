import * as innerSVG from 'innersvg-polyfill';
import { stratify, tree as d3Tree } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { linkHorizontal } from 'd3-shape';
import { zoomIdentity, zoomTransform, zoom as d3Zoom } from 'd3-zoom';
import { event as d3Event, create as d3Create } from 'd3';

import RadialMenu from './radial_menu';

import trashSVG from '../../../assets/trash.svg';

export default class Tree {
  constructor(selector, treeData = null) {
    this.selector = selector;
    this.treeData = treeData;
    this.width = 954;
    this.height = 600;

    // Menu
    const data = [
      { icon: trashSVG, action: 'segment 1', function: this.deleteNode },
      { icon: trashSVG, action: 'segment 1', function: this.deleteNode },
      { icon: trashSVG, action: 'segment 1', function: this.deleteNode },
    ];
    this.radialMenu = new RadialMenu(data).init();
  }

  onItemClick(node) {
    this.radialMenu.move(node);
  }

  deleteNode(node) {
    const itemId = select(node).datum().data.id
    alert(`deleting item ${itemId}`)
  }

  setupTree() {
    this.setupDataTree();
    this.setupZoomContainer();
    this.renderLines();
    this.renderItems();
  }

  setupDataTree() {
    const treeDataWithParent = [{ id: 0 }, ...this.treeData];
    const data = stratify()
      .id(d => d.id)
      .parentId(d => {
        if (d.id === 0) return null;
        return d.note_id || 0;
      })(treeDataWithParent);
    data.dx = 80;
    data.dy = this.width / (data.height + 1);
    this.dataTree = d3Tree().nodeSize([data.dx, data.dy])(data);
  }

  setupZoomContainer() {
    const idContainerSelector = `#${this.selector}`;
    const containerElement = document.getElementById(this.selector);

    const svg = select(containerElement)
      .append('svg')
      .attr('viewBox', [0, 0, containerElement.offsetWidth, containerElement.offsetHeight])
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('background-color', 'gray');

    // Zoom container
    this.zoomContainer = svg
      .append('svg:g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);

    const zoomed = () => this.zoomContainer.attr('transform', d3Event.transform);
    const zoom = d3Zoom().on('zoom', zoomed);
    svg.call(zoom).call(zoom.transform, zoomIdentity.translate(this.width / 4, this.height / 2));
  }

  renderItems() {
    const children = this.dataTree.descendants();
    // Remove the blank parent
    children.shift();

    // Children
    const node = this.zoomContainer
      .append('svg:g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      .data(children)
      .join('svg:g')
      .attr('class', 'node-item')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Circles
    node
      .append('circle')
      .attr('fill', '#6c567b')
      .attr('r', 6)
      .on('mouseover', (data, i, nodes) => nodes[i].setAttribute('fill', '#dd5555'))
      .on('mouseout', (data, i, nodes) => nodes[i].setAttribute('fill', '#000'))
      .on('click', (_, i, nodes) => this.onItemClick(nodes[i]));

    node
      .append('text')
      .attr('font-size', '14px')
      .attr('dy', '0.31em')
      .attr('x', d => (d.children ? -6 : 6))
      .attr('text-anchor', d => (d.children ? 'end' : 'start'))
      .clone(true)
      .attr('fill', 'black');
  }

  renderLines() {
    // Lines
    const link = this.zoomContainer
      .append('svg:g')
      .attr('fill', 'none')
      .attr('stroke', '#f67280')
      .attr('stroke-width', 3)
      .selectAll('path')
      .data(this.dataTree.links())
      .join('path')
      .style('opacity', function(d, i) {
        return !d.source.depth ? 0 : 1;
      })
      .attr(
        'd',
        linkHorizontal()
          .x(d => d.y)
          .y(d => d.x),
      );
  }
}
