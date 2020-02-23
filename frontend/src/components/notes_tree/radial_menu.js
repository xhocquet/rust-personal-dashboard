import { create, select } from 'd3';
import { interpolate } from 'd3-interpolate';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';

export default class RadialMenu {
  constructor(data) {
    this.data = data;
    this.node = null;
    this.currentParent = null;
  }

  move(node) {
    this.currentParent.querySelector('.menu-container').remove();
    this.currentParent = node.parentNode;
    this.currentParent.appendChild(this.menuContainer.node());
  }

  init(node) {
    var self = this;
    var padding = 1;
    var iconSize = 16;

    var offsetAngleDeg = -180 / this.data.length; // Initial rotation angle designed to put centre the first segment at the top

    if (this.currentParent) {
      this.move(node);
      return;
    }

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
      .append('svg:g')
      .attr('class', 'arc');

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', '#8ac6d1')
      .on('mouseover', (data, i, nodes) => nodes[i].setAttribute('fill', '#bbded6'))
      .on('mouseout', (data, i, nodes) => nodes[i].setAttribute('fill', '#8ac6d1'));

    arc
      .append('image')
      .attr('class', 'menu-icon')
      .attr('xlink:href', function(d) {
        return d.data.icon;
      })
      .attr('width', iconSize)
      .attr('height', iconSize)
      .attr('x', function(d) {
        return self.calcMidPoint(d).x - iconSize / 2;
      })
      .attr('y', function(d) {
        return self.calcMidPoint(d).y - iconSize / 2;
      })
      .attr('transform', function(d) {
        var mp = self.calcMidPoint(d);
        return 'rotate(0,' + mp.x + ',' + mp.y + ')';
      })
      .attr('pointer-events', 'none');

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
