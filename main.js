import * as d3 from 'd3';
import { Vector, Ellipse } from './geometry';

let width = 800;
let height = 600;
let svg = d3.select("body").insert("svg", ":first-child")
                           .attr("width", width)
                           .attr("height", height);

// should abstract this into something like EuclideanPlane
// A mixin on any object that has x, y attributes
// which just adds renderX and renderY methods
let unit = 60;  // unit to pixel conversion
let originX = width / 2;
let originY = height / 2;
let origin = Vector(originX, originY);
function fromCartesianX(x) { return originX + x; }
function fromCartesianY(y) { return originY - y; }
function toCartesianX(x) { return x - originX; }
function toCartesianY(y) { return -y + originY; }


function createEllipseSVG(ellipse) {
  let ellipseSVG = svg.append("ellipse").datum(ellipse);
  return {
    ellipse: ellipseSVG
  };
}


function setupEllipseStyle(ellipseSVG) {
  let {ellipse} = ellipseSVG;
  ellipse.attr("fill", function (d) { return d.fill; })
         .attr("stroke", function (d) { return d.strokeColor; })
         .attr("stroke-width", 2)
         .id("ellipse");
}

function setupBehavior(ellipseSVG) {
  let {ellipse} = ellipseSVG;

  function setEllipsePosition(svg) {
    svg.attr("cx", function(d) { return fromCartesianX(d.center.x); })
       .attr("cy", function(d) { return fromCartesianX(d.center.y); })
       .attr("rx", function(d) { return d.majorAxisLength; })
       .attr("ry", function(d) { return d.minorAxisLength; });

    svg.attr('transform', function(d) {
      let rotationFromHorizontal = d.rotationAngle;
      let rotationFromVeritcal = (Math.PI / 2) - rotationFromHorizontal;
      return ("rotate(" + rotationFromVertical + ")");
    });
  }

  function dragged(d, labelName) {
    d.x += d3.event.dx;
    d.y -= d3.event.dy;
    // update svgs
  }

  // ellipse.call(d3.drag().on("drag", dragged));
  setEllipsePosition(ellipse);
}

let e1 = new Ellipse(origin, 2 * unit, unit);
let ellipseSVG = createEllipseSVG(e1);
setupEllipseStyle(ellipseSVG);
setupBehavior(ellipseSVG);
