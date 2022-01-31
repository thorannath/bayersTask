import React, { useEffect, useRef, useState } from 'react';
import './Charts.css';
import * as d3 from 'd3';
import { select } from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";


const SankeyDiagram = ({ data }) => {

  const wrapperRef = useRef();
  const svgRef = useRef();

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 450 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;



  useEffect(() => {
    const svg = select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var sankey = d3Sankey()
      .nodeWidth(36)
      .nodePadding(290)
      .size([width, height])
      .nodes(data.nodes)
      .links(data.links)


    var link = svg.append("g")
      .selectAll(".link")
      .data(data.links)
      .enter()
      .append("path")
      .attr("class", "link")

    var node = svg.append("g")
      .selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
    // .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

  }, [data])

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }} align="center">
      <h3> Sankey Diagram </h3>

      <svg id="svg" style={{ width: 960, height: 500 }} ref={svgRef}>
      </svg>

    </div>
  )
};

export default React.memo(SankeyDiagram);
