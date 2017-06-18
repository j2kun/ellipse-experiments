import * as d3 from 'd3';
import { Vector, Ellipse } from './geometry';

let width = 600;
let height = 400;
let svg = d3.select("body").insert("svg", ":first-child")
                           .attr("width", width)
                           .attr("height", height);

// should abstract this into something like EuclideanPlane
// A mixin on any object that has x, y attributes
// which just adds renderX and renderY methods
let unit = 20;  // unit to pixel conversion
let originX = width / 2;
let originY = height / 2;
let origin = new Vector(originX, originY);
let fill = 'rgb(120,33,33)';
let strokeColor = 'black';
function fromCartesianX(x) { return origin.x + x; }
function fromCartesianY(y) { return origin.y - y; }
function toCartesianX(x) { return x - origin.x; }
function toCartesianY(y) { return -y + origin.y; }

let matrix = {
  'a11': 1, 
  'a12': 0, 
  'a21': 0, 
  'a22': 1,
};


function createEllipseSVG(ellipse) {
  let ellipseSVG = svg.append("ellipse").datum(ellipse);
  return {
    ellipse: ellipseSVG
  };
}

function setupEllipseStyle(ellipseSVG, color) {
  let {ellipse} = ellipseSVG;
  if (!color) {
    color = fill;
  }
  ellipse.attr("fill", color)
         .attr("stroke", function (d) { return strokeColor; })
         .attr("stroke-width", 2)
         .attr("fill-opacity", 0.3);
}

function setEllipsePosition(svg) {
  /*
  svg.attr("cx", function(d) { return fromCartesianX(d.center.x); })
     .attr("cy", function(d) { return fromCartesianY(d.center.y); })
     .attr("rx", function(d) { return d.majorAxisLength; })
     .attr("ry", function(d) { return d.minorAxisLength; });
  */

  svg.attr("cx", fromCartesianX(0))
     .attr("cy", fromCartesianY(0))
     .attr("rx", unit)
     .attr("ry", unit);

  svg.attr('transform', function(d) {
    let angleDegrees = (-d.rotationAngle) * (180 / Math.PI);
    let center = d.center;
    let centerX = fromCartesianX(center.x);
    let centerY = fromCartesianY(center.y);
    return ("matrix(" + 
      matrix['a11'] + " " + matrix['a21'] + " " + 
      matrix['a12'] + " " + matrix['a22'] + " 0 0)"
    );
  });
}

function setMatrixText() {
  let output = (
    '[[ ' + matrix['a11'] + ', ' + matrix['a12'] + ' ],\n' + 
    ' [ ' + matrix['a21'] + ', ' + matrix['a22'] + ' ]]'
  );
  d3.select('#matrix_input').text(output);
}

function setupBehavior(ellipseSVG, sliders) {
  let {ellipse} = ellipseSVG;
  let {a11, a12, a21, a22} = sliders;

  /*
  function dragged(d) {
    d.x += d3.event.dx;
    d.y -= d3.event.dy;
  }
  */

  for (let k in sliders) {
    let slider = sliders[k];
    slider.on("input", function() {
      let value = +this.value;
      matrix[k] = value;
      setMatrixText();
      setEllipsePosition(ellipse);
    });
  }

  // point.call(d3.drag().on("drag", dragged));
  setEllipsePosition(ellipse);
}

function createSliders() {
  let ids = ['a11', 'a12', 'a21', 'a22'];
  let sliders = {};
  ids.forEach(function(x) { 
    sliders[x] = d3.select('#' + x);
    sliders[x].attr('value', parseInt(matrix[x] / unit));
  });
  return sliders;
}

let circle = new Ellipse(new Vector(0, 0), unit, unit, 0);
let circleSVG = createEllipseSVG(circle);
setupEllipseStyle(circleSVG, 'rgb(33,33,120)');
setEllipsePosition(circleSVG.ellipse);

let e1 = new Ellipse(new Vector(0, 0), 2 * unit, unit, Math.PI / 6);
let p = new Vector(unit, -2 * unit);
let ellipseSVG = createEllipseSVG(e1);
setupEllipseStyle(ellipseSVG);

let sliders = createSliders();
setupBehavior(ellipseSVG, sliders);
