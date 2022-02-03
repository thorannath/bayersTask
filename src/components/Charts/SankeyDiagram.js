import React, { useEffect, useRef, useState } from 'react';
import './Charts.css';
import * as d3 from 'd3';
import { select, interpolateCool, scaleSequential } from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";


const SankeyNode = ({ name, x0, x1, y0, y1, color }) => (
  <g>
    <rect
      x={x0} y={y0} width={x1 - x0} height={y1 - y0}
      fill={color}>
    </rect>
    <title>{name}</title>
  </g>


);

const SankeyLink = ({ link, color }) => (
  <path
    d={sankeyLinkHorizontal()(link)}
    style={{
      fill: "none",
      strokeOpacity: ".3",
      stroke: color,
      strokeWidth: Math.max(1, link.width)
    }}
  />
);

const SankeyDiagram = ({ data }) => {

  const wrapperRef = useRef();
  const svgRef = useRef();

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 450 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

  const { nodes, links } = d3Sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 5]])(data);

  // Color scale used
  const color = d3.scaleOrdinal(d3.schemePastel1);

  const colorScale = d3
    .scaleLinear()
    .domain([0, nodes.length])
    .range([0, 1]);

  console.log(nodes)

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }} align="center">
      <h3> Sankey Diagram </h3>

      <svg id="svg" style={{ width: 960, height: 500 }} ref={svgRef}>

        <g style={{ mixBlendMode: "multiply" }}>
          {nodes.map((node, i) => (
            <SankeyNode
              {...node}
              key={i}
              color={color(colorScale(i))}
              key={node.name}
            />
          ))}

          {links.map((link, i) => (
            <SankeyLink
              link={link}
              key={i}
              color={color(colorScale(link.source.index))}
            />
          ))}
        </g>
      </svg>

    </div>
  )
};

export default React.memo(SankeyDiagram);
