import * as d3 from 'd3';
import { Vector, Ellipse } from './geometry';

let width = 800;
let height = 800;
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
  ellipse.attr("fill", function (d) { return fill; })
         .attr("stroke", function (d) { return strokeColor; })
         .attr("stroke-width", 2)
         .attr("fill-opacity", 0.3)
         .attr("id", "ellipse");
}

function setupBehavior(ellipseSVG, sliders) {
  let {ellipse} = ellipseSVG;
  let {rotationSlider} = sliders;

  function setEllipsePosition(svg) {
    svg.attr("cx", function(d) { return fromCartesianX(d.center.x); })
       .attr("cy", function(d) { return fromCartesianX(d.center.y); })
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

  function dragged(d, labelName) {
    d.x += d3.event.dx;
    d.y -= d3.event.dy;
    // update svgs
  }

  rotationSlider.on("input", function() {
    let value = +this.value;
    let angleRadians = value * Math.PI / 180;
    ellipse.datum().rotationAngle = angleRadians;
    setEllipsePosition(ellipse);
  })

  // ellipse.call(d3.drag().on("drag", dragged));
  setEllipsePosition(ellipse);
}

function createSliders() {
  let rotationSlider = d3.select('#rotationAngle');
  return {
    rotationSlider: rotationSlider
  };
}

let e1 = new Ellipse(new Vector(0, 0), 2 * unit, unit, Math.PI / 6);
let ellipseSVG = createEllipseSVG(e1);
setupEllipseStyle(ellipseSVG);

let sliders = createSliders();
setupBehavior(ellipseSVG, sliders);
