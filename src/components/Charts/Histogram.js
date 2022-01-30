import React, { useEffect } from 'react'
import * as d3 from 'd3';

const Histogram = ({ data, title }) => {

    let sourceNames = Object.keys(data), sourceCount = Object.values(data);

    var margin = { top: 30, right: 30, bottom: 30, left: 50 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    useEffect(() => {
        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        var y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(sourceNames);
        y.domain([0, d3.max(sourceCount, function (d) { return d; })]);

        var svg = d3
            .select("#histogram")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y).ticks(3))

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(`${title}`);

        // Create rectangles
        let bars = svg.selectAll('.bar')
            .data(sourceNames)
            .enter()
            .append("g");

        bars.append('rect')
            .attr('class', 'bar')
            .attr("fill", "#F7996E")
            .attr("x", function (d) { return x(d); })
            .attr("y", function (d) { return y(data[d]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(data[d]); })

        bars.append("text")
            .text(function (d) {
                return data[d];
            })
            .attr("x", function (d) {
                return x(d) + x.bandwidth() / 2;
            })
            .attr("y", function (d) {
                return y(data[d]) - 5;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr("text-anchor", "middle");
    })

    return (
        <div id="histogram" align="center"></div>
    )
}

export default React.memo(Histogram)
