import * as innerSVG from 'innersvg-polyfill';
import { stratify, tree as d3Tree } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { linkHorizontal } from 'd3-shape';
import { zoomIdentity, zoomTransform, zoom as d3Zoom } from 'd3-zoom';
import { event as d3Event, create as d3Create } from 'd3';

import RadialMenu from './radial_menu';

import trashSVG from '../../../assets/trash.svg';
import plusSVG from '../../../assets/plus.svg';

export default class Tree {
  constructor(selector, createNode, deleteNode) {
    this.selector = selector;
    this.createNode = createNode;
    this.propsDeleteNode = deleteNode;
    this.dataTree = null;
    this.zoomContainer = null;
    this.radialMenu = null;
    this.width = 954;
    this.height = 600;
    this.linksContainer = null;
    this.nodesContainer = null;
  }

  setupTree(data) {
    this.setupDataTree(data);
    this.setupZoomContainer();
    this.prepareMenu();
    this.renderLines();
    this.renderItems();
  }

  onItemClick(node) {
    this.radialMenu.selectNode(node);
  }

  onNodeCircleOver(item, i, nodes) {
    nodes[i].setAttribute('fill', '#dd5555');
  }

  onNodeCircleOut(item, i, nodes) {
    nodes[i].setAttribute('fill', '#000');
  }

  addToNode(node) {
    const parentNoteId = select(node).datum().data.id;
    this.createNode({
      note_id: parentNoteId,
      title: 'API-created',
      body: '',
      finished: false,
    });
  }

  deleteNode(node) {
    const itemId = select(node).datum().data.id;
    this.propsDeleteNode(itemId);
  }

  setupDataTree(rawData) {
    const data = stratify()
      .id(d => d.id)
      .parentId(d => {
        if (d.id === 0) return null;
        return d.note_id || 0;
      })([{ id: 0 }, ...rawData]);
    data.dx = 80;
    data.dy = this.width / (data.height + 1);
    this.dataTree = d3Tree().nodeSize([data.dx, data.dy])(data);
  }

  setupZoomContainer() {
    if (this.zoomContainer) return;

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

  prepareMenu() {
    if (this.radialMenu) return this.radialMenu.remove();

    const data = [
      { icon: trashSVG, function: this.deleteNode.bind(this) },
      { icon: plusSVG, function: this.addToNode.bind(this) },
    ];
    this.radialMenu = new RadialMenu(data).init();
  }

  renderItems() {
    const children = this.dataTree.descendants();
    // Remove the blank parent
    children.shift();

    if (!this.nodesContainer) {
      this.nodesContainer = this.zoomContainer.append('svg:g').attr('class', 'nodes-container');
    }

    const nodes = this.nodesContainer
      .selectAll('g')
      .data(children)
      .join(
        enter => enter.append('svg:g'),
        update => update,
      )
      .attr('class', 'node-item')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Circles
    // TODO: Better re-render
    nodes.selectAll('circle').remove()
    nodes
      .append('circle')
      .attr('fill', '#6c567b')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 6)
      .attr('stroke', 'transparent')
      .attr('r', 6)
      .on('mouseover', (item, i, node) => this.onNodeCircleOver(item, i, node))
      .on('mouseout', (item, i, node) => this.onNodeCircleOut(item, i, node))
      .on('click', (_, i, nodes) => this.onItemClick(nodes[i]));

    // TODO: Better re-render
    nodes.selectAll('text').remove()
    nodes
      .append('text')
      .attr('font-size', '14px')
      .attr('dy', '0.31em')
      .attr('x', d => (d.children ? -6 : 6))
      .attr('text-anchor', d => (d.children ? 'end' : 'start'))
      .attr('fill', 'black');
  }

  renderLines() {
    if (!this.linksContainer) {
      this.linksContainer = this.zoomContainer.append('svg:g').attr('class', 'links-container');
    }

    this.linksContainer
      .selectAll('path')
      .data(this.dataTree.links())
      .join(
        enter => enter.append('path'),
        update => update,
      )
      .attr('fill', 'none')
      .attr('stroke', '#f67280')
      .attr('stroke-width', 3)
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
