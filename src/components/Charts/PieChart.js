import './Charts.css';
import React, { useEffect } from 'react'
import * as d3 from 'd3';

const PieChart = () => {

    const height = 450;
    const width = 450;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin

    useEffect(() => {
        // create a tooltip
        var tooltip = d3.select(".tooltip")
            .style("opacity", 0)
            .attr("position", "absolute")
            .style("padding", "5px")

        let mouseOver = function (event, d) {
            tooltip
            .style("opacity", 1)
            .html(`${d.data[0]}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY-80) + "px")

            svg.selectAll(".pie")
                .transition()
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .style("opacity", 0.5)
                .style("cursor", "pointer")
        }

        let mouseLeave = function (d) {
            tooltip
            .style("opacity", 0)

            svg.selectAll(".pie")
                .transition()
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .style("opacity", 1)
        }

        const svg = d3.select("#pieChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`)
            .attr("align", "center");

        const data = { 'CKD': 9, 'Both CKD and T2D': 20, 'T2D': 25 }
        
        const color = d3.scaleOrdinal()
            .range(["#7FC8F8", "#FF6392", "#033860", "#6b486b"])

        const pie = d3.pie()
            .value(function (d) { return d[1] })
        const data_ready = pie(Object.entries(data))

        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        svg
            .selectAll('.pie')
            .data(data_ready)
            .join('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', function (d) { return (color(d.data[1])) })
            .style("opacity", 0.7)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)

        svg
            .selectAll('.pie')
            .data(data_ready)
            .join('text')
            .text(function (d) { return d.data[0] })
            .attr("transform", function (d) { return `translate(${arcGenerator.centroid(d)})` })
            .style("text-anchor", "middle")
            .style("font-size", 17)
    })

    return (
        <div id="pieChart" align="center">
            <h3> Patient Cohorts </h3>
            <div className="tooltip"></div>
        </div>
    )
}

export default React.memo(PieChart)
