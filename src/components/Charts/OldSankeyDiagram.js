import React, { useEffect, useRef, useState } from 'react';
import './Charts.css';
import * as d3 from 'd3';
import { select, interpolateCool, scaleSequential } from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";


const SankeyDiagram = ({ data }) => {

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 450 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

  const { nodes, links } = d3Sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 5]])(data);

  return (
    <div style={{ marginBottom: '2rem' }} align="center">
      <h3> Sankey Diagram </h3>
    </div>
  )
};

export default React.memo(SankeyDiagram);
