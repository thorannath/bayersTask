import React, { useEffect, useRef } from 'react';
import './Charts.css';
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import * as d3 from 'd3';

const NewSankeyDiagram = ({ data }) => {

    console.log(data);
    const svgRef = useRef();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // Color scale used
    const color = d3.scaleOrdinal(d3.schemePastel2);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        const sankey = d3Sankey()
            .nodes(data.nodes)
            .links(data.links)
            .nodeWidth(36)
            .nodePadding(290)
            .size([960, 500]);

        const link = svg.append("g")
            .selectAll(".link")
            .data(data.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) { return sankeyLinkHorizontal()(d) })
            .style("stroke-width", function (d) { return Math.max(1, d.width) })
            .sort(function (a, b) { return (b.width) - (a.width); });

        const node = svg.append("g")
            .selectAll(".node")
            .data(data.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                console.log(d)
                return "translate(" + (d.x0) + "," + (d.y0) + ")";
            })
            // .call(d3.drag()
            //     .subject(function (d) { return d; })
            //     .on("start", function () { this.parentNode.appendChild(this); })
            //     .on("drag", dragmove));

        //Add node rectangle to the svg
        node.append("rect")
            .attr("height", function (d) { return (d.y1 - d.y0); })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function (d) { return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function (d) { return d.name + "\n" + "There is " + d.value + " stuff in this node"; });

        //Add label to the nodes
        node.append("text")
            .attr("x", sankey.nodeWidth() + 50)
            .attr("y", function (d) { return (d.y1 - d.y0) / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) { return d.name; })
            .filter(function (d) { return d.x < 960 / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // // the function for moving the nodes
        // function dragmove(event, d) {
        //     var dx = Math.round(d.x = Math.max(0, Math.min(960, event.x)));
        //     var dy = Math.round(d.y = Math.max(0, Math.min(500, event.y)));

        //     console.log(d);
        //     d3.select(this).attr("transform", "translate(" + [dx, dy] + ")");
        //     sankey.update({nodes: sankey.nodes(), links: data.links})
            
        //     link.attr("d", function (d) { return sankeyLinkHorizontal()(d) });
        // }


    }, [data]);


    return <div style={{ marginBottom: '2rem' }}>
        <svg id="svg" style={{ width: 960, height: 500 }} ref={svgRef}>
        </svg>
    </div>;
};

export default React.memo(NewSankeyDiagram);
