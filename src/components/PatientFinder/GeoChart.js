import React, { StyleSheet, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { select, geoPath, geoAlbersUsa } from 'd3';
import { showModal } from '../../store/modals';
import * as constants from '../../Constant';
import { useSelector, useDispatch } from 'react-redux';
import './PatientFinder.css';

const GeoChart = ({ data, property }) => {

    const svgRef = useRef();
    const dispatch = useDispatch();
    const wrapperRef = useRef();
    const pointerRef = useRef();

    const statesData = {
        "New York":45,
        "New Jersey":99,
        "Colorado":140,
        "California":10
    }

    useEffect(() => {
        const svg = select(svgRef.current);

        //Width and height of map
        const width = 960;
        const height = 500;

        // D3 Projection
        var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])    // translate to center of screen
            .scale([1000]);          // scale things down so see entire US

        // Define path generator
        var path = d3.geoPath()             // path generator that will convert GeoJSON to SVG paths
            .projection(projection);  // tell path generator to use albersUsa projection

        var colorScale = d3.scaleThreshold()
            .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
            .range(d3.schemeBlues[7]);


        var Tooltip = d3.select(".tooltip")
            .style("opacity", 0)
            .style("postion", "absolute")
            .style("z-index", 10)

        let mouseOver = function (event, d) {
            d3.selectAll(".states")
                .transition()
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .style("opacity", 0.5)

            console.log(event);

            Tooltip.style("opacity", 1)
                .style("top", (event.clientX - 10) + "px")
                .style("left", (event.clientY + 10) + "px")
                .html(`${d.properties.NAME}`)
        }

        let mouseLeave = function (d) {
            d3.selectAll(".states")
                .transition()
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .style("opacity", 1)

            Tooltip.style("opacity", 0)
        }

        let viewPaitents = (d) => {
            dispatch(showModal({ messageType: constants.MESSAGE_TYPES.VIEW_HEATMAP_PATIENTS, action: 'open' }));
        }

        svg.selectAll("path")
            .data(data.features)
            .join("path")
            .attr("fill", '#6495ED')
            .attr("class", "states")
            .attr("d", feature => path(feature))
            .attr("fill", function (d) {
                let val = statesData[d.properties.NAME] || 0;
                return colorScale(val*1000000);
            })
            .on("click", viewPaitents)
            .style("stroke", "black")
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)


    }, [data, property])

    return (
        <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
            <svg style={{ width: 960, height: 500 }} ref={svgRef}></svg>
            <div className="tooltip"></div>

        </div>
    )
}

export default GeoChart
