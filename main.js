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
let origin = new Vector(originX, originY);
let fill = 'rgb(120,33,33)';
let strokeColor = 'black';
function fromCartesianX(x) { return origin.x + x; }
function fromCartesianY(y) { return origin.y - y; }
function toCartesianX(x) { return x - origin.x; }
function toCartesianY(y) { return -y + origin.y; }


function createEllipseSVG(ellipse) {
  let ellipseSVG = svg.append("ellipse").datum(ellipse);
  return {
    ellipse: ellipseSVG
  };
}

function createPointSVG(vector) {
  let pointSVG = svg.append("circle").datum(vector);
  return {
    point: pointSVG
  };
}

function setupEllipseStyle(ellipseSVG) {
  let {ellipse} = ellipseSVG;
  ellipse.attr("fill", function (d) { return fill; })
         .attr("stroke", function (d) { return strokeColor; })
         .attr("stroke-width", 2)
         .attr("fill-opacity", 0.3)
         .attr("id", "ellipse");
}

function setupPointStyle(pointSVG) {
  let {point} = pointSVG;
  point.attr("fill", function (d) { return 'rgb(33,120,33)'; })
       .attr("stroke", function (d) { return strokeColor; })
       .attr("stroke-width", 2)
       .attr("fill-opacity", 0.3)
       .attr("id", "point");
}

function setupBehavior(ellipseSVG, pointSVG, sliders) {
  let {ellipse} = ellipseSVG;
  let {point} = pointSVG;
  let {rotationSlider} = sliders;

  function setEllipsePosition(svg) {
    svg.attr("cx", function(d) { return fromCartesianX(d.center.x); })
       .attr("cy", function(d) { return fromCartesianY(d.center.y); })
       .attr("rx", function(d) { return d.majorAxisLength; })
       .attr("ry", function(d) { return d.minorAxisLength; });

    svg.attr('transform', function(d) {
      let angleDegrees = (-d.rotationAngle) * (180 / Math.PI);
      let center = d.center;
      let centerX = fromCartesianX(center.x);
      let centerY = fromCartesianY(center.y);
      return ("rotate(" + angleDegrees + " " + centerX + " " + centerY + ")");
    });
  }

  function setPointPosition(svg) {
    svg.attr("cx", function(d) { return fromCartesianX(d.x); })
       .attr("cy", function(d) { return fromCartesianY(d.y); })
       .attr("r", function(d) { return 10; });
  }


  function dragged(d) {
    d.x += d3.event.dx;
    d.y -= d3.event.dy;
    setPointPosition(point);
  }

  rotationSlider.on("input", function() {
    let value = +this.value;
    let angleRadians = value * Math.PI / 180;
    ellipse.datum().rotationAngle = angleRadians;
    setEllipsePosition(ellipse);
  })

  // ellipse.call(d3.drag().on("drag", dragged));
  point.call(d3.drag().on("drag", dragged));
  setEllipsePosition(ellipse);
  setPointPosition(point);
}

function createSliders() {
  let rotationSlider = d3.select('#rotationAngle');
  return {
    rotationSlider: rotationSlider
  };
}

let e1 = new Ellipse(new Vector(0, 0), 2 * unit, unit, Math.PI / 6);
let p = new Vector(unit, -2 * unit);
let ellipseSVG = createEllipseSVG(e1);
let pointSVG = createPointSVG(p);
setupEllipseStyle(ellipseSVG);
setupPointStyle(pointSVG);

let sliders = createSliders();
setupBehavior(ellipseSVG, pointSVG, sliders);
