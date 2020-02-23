import { create, select } from 'd3';
import { interpolate } from 'd3-interpolate';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';

export default class RadialMenu {
  constructor(data) {
    this.data = data;
    this.node = null;
    this.currentParent = null;
  }

  init() {
    var self = this;
    var padding = 2;
    var iconSize = 24;
    var offsetAngleDeg = -180 / this.data.length;

    this.menuContainer = create('svg:g')
      .attr('width', 500)
      .attr('height', 500)
      .attr('class', 'menu-container');

    var pie = d3Pie()
      .sort(null)
      .value(d => {
        return 10;
      });

    var path = d3Arc()
      .outerRadius(60)
      .innerRadius(30)
      .padAngle((padding * Math.PI) / 180);

    var arc = this.menuContainer
      .selectAll('.arc')
      .data(pie(this.data))
      .enter()
      .append('svg:g');

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', '#8ac6d1')
      .on('mouseover', (_, i, nodes) => nodes[i].setAttribute('fill', '#bbded6'))
      .on('mouseout', (_, i, nodes) => nodes[i].setAttribute('fill', '#8ac6d1'))
      .on('click', (item, i, nodes) => item.data.function(self.currentParent));

    arc
      .append('svg:g')
      .html(d => d.data.icon)
      .attr('transform', function(d) {
        var x = self.calcMidPoint(d).x - iconSize / 2;
        var y = self.calcMidPoint(d).y - iconSize / 2;
        return `translate(${x},${y})`;
      })
      .attr('pointer-events', 'none');

    return this;
  }

  remove() {
    if (this.currentParent) {
      this.currentParent.querySelector('.menu-container').remove();
      this.currentParent = null
    }
  }

  selectNode(node) {
    if (this.currentParent) {
      this.currentParent.querySelector('.menu-container').remove();

      // Hide if already open for node
      if (node.parentElement === this.currentParent) return (this.currentParent = null);
    }

    this.currentParent = node.parentNode;
    this.currentParent.appendChild(this.menuContainer.node());
  }

    // private

  calcMidPoint(d) {
    var angle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    var r = 45;
    return {
      x: r * Math.sin(angle),
      y: -r * Math.cos(angle),
    };
  }
}
