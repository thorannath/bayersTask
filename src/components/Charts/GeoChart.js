import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { select } from 'd3';
import * as constants from '../../Constant';
import jsPDF from 'jspdf'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button } from '@mui/material';
import './Charts.css';

const GeoChart = ({ data, stateData, property, viewPatients }) => {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const [states, setStates] = useState({})
    const epsilon = 1e-6;
    
    const downloadGraph = () => {
        var svgElement = document.getElementById('svg');
        let { width, height } = svgElement.getBBox();

        let clonedSvgElement = svgElement.cloneNode(true);

        let outerHTML = clonedSvgElement.outerHTML,
            blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
        let URL = window.URL || window.webkitURL || window;
        let blobURL = URL.createObjectURL(blob);

        let image = new Image();
        image.src = blobURL;
        let canvas = document.createElement('canvas');
        canvas.widht = width;

        canvas.height = height;
        let context = canvas.getContext('2d');
        // draw image in canvas starting left-0 , top - 0  
        context.drawImage(image, 0, 0, width, height);
        //  downloadImage(canvas); need to implement
        var dataUrl = canvas.toDataURL("image/png");

        var doc = new jsPDF();
        doc.text(`Geochart`, 60, 15)
        doc.addImage(dataUrl, 15, 40, 180, 100);
        doc.save(`GeoChart-${Date.now()}.pdf`);
    }

    function geoAlbersUsaPr() {
        var cache,
            cacheStream,
            lower48 = d3.geoAlbers(), lower48Point,
            alaska = d3.geoConicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]),
            alaskaPoint,
            hawaii = d3.geoConicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]),
            hawaiiPoint,
            puertoRico = d3.geoConicEqualArea().rotate([66, 0]).center([0, 18]).parallels([8, 18]),
            puertoRicoPoint,
            point,
            pointStream = { point: function (x, y) { point = [x, y]; } };

        function albersUsa(coordinates) {
            var x = coordinates[0], y = coordinates[1];
            return point = null,
                (lower48Point.point(x, y), point)
                || (alaskaPoint.point(x, y), point)
                || (hawaiiPoint.point(x, y), point)
                || (puertoRicoPoint.point(x, y), point);
        }

        albersUsa.invert = function (coordinates) {
            var k = lower48.scale(),
                t = lower48.translate(),
                x = (coordinates[0] - t[0]) / k,
                y = (coordinates[1] - t[1]) / k;
            return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
                : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
                    : y >= 0.204 && y < 0.234 && x >= 0.320 && x < 0.380 ? puertoRico
                        : lower48).invert(coordinates);
        };

        albersUsa.stream = function (stream) {
            return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream), puertoRico.stream(stream)]);
        };

        albersUsa.precision = function (_) {
            if (!arguments.length) return lower48.precision();
            lower48.precision(_), alaska.precision(_), hawaii.precision(_), puertoRico.precision(_);
            return reset();
        };

        albersUsa.scale = function (_) {
            if (!arguments.length) return lower48.scale();
            lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_), puertoRico.scale(_);
            return albersUsa.translate(lower48.translate());
        };

        albersUsa.translate = function (_) {
            if (!arguments.length) return lower48.translate();
            var k = lower48.scale(), x = +_[0], y = +_[1];

            lower48Point = lower48
                .translate(_)
                .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
                .stream(pointStream);

            alaskaPoint = alaska
                .translate([x - 0.307 * k, y + 0.201 * k])
                .clipExtent([[x - 0.425 * k + epsilon, y + 0.120 * k + epsilon], [x - 0.214 * k - epsilon, y + 0.234 * k - epsilon]])
                .stream(pointStream);

            hawaiiPoint = hawaii
                .translate([x - 0.205 * k, y + 0.212 * k])
                .clipExtent([[x - 0.214 * k + epsilon, y + 0.166 * k + epsilon], [x - 0.115 * k - epsilon, y + 0.234 * k - epsilon]])
                .stream(pointStream);

            puertoRicoPoint = puertoRico
                .translate([x + 0.350 * k, y + 0.224 * k])
                .clipExtent([[x + 0.320 * k, y + 0.204 * k], [x + 0.380 * k, y + 0.234 * k]])
                .stream(pointStream).point;

            return reset();
        };

        function reset() {
            cache = cacheStream = null;
            return albersUsa;
        }

        return albersUsa.scale(1070);
    }

    function multiplex(streams) {
        const n = streams.length;
        return {
            point(x, y) { for (const s of streams) s.point(x, y); },
            sphere() { for (const s of streams) s.sphere(); },
            lineStart() { for (const s of streams) s.lineStart(); },
            lineEnd() { for (const s of streams) s.lineEnd(); },
            polygonStart() { for (const s of streams) s.polygonStart(); },
            polygonEnd() { for (const s of streams) s.polygonEnd(); }
        };
    }

    useEffect(() => {
        if (stateData.states && Object.keys(stateData).length > 0) {
            Object.keys(stateData.states).map(e => {
                states[constants.AcronymToStateNames[e]] = stateData.states[e];
            });
            setStates(states);
        }

        const svg = select(svgRef.current);

        //Width and height of map
        const width = 960;
        const height = 500;

        // D3 Projection
        var projection = geoAlbersUsaPr()
            .scale(1070)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(projection);
        // translate to center of screen
        // scale things down so see entire US

        // Data and color scale
        var colorScale = d3.scaleThreshold()
            .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
            .range(d3.schemeBlues[7]);


        // create a tooltip
        var tooltip = d3.select(".map-tooltip")
            .style("opacity", 0)
            .attr("position", "absolute")
            .style("padding", "5px")

        let mouseOver = function (event, d) {
            tooltip
                .style("opacity", 1)
                .html(`${d.properties.name} \n Count: ${states[d.properties.name] || 0}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 80) + "px")

            d3.selectAll(".states")
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
            d3.selectAll(".states")
                .transition()
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .style("opacity", 1)
        }


        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("fill", '#6495ED')
            .attr("class", "states")
            .attr("d", path)
            .attr("fill", function (d) {
                let val = states[d.properties.name] || 0;
                return colorScale(val * 1000000);
            })
            .on("click", viewPatients)
            .attr("class", "states")
            .style("stroke", "black")
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)

    }, [data, property, stateData])

    return (
        <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
            {/* {Object.keys(stateData).length != 0 && <Button id='geochart-download'
                onClick={downloadGraph}
                className="download-icon"
                style={{ color: 'royalblue' }}
                title="Download">
                <FileDownloadIcon />
                Download
            </Button>} */}
            <svg id="svg" style={{ width: 960, height: 500 }} ref={svgRef}>
            </svg>
            <div className="map-tooltip"></div>
        </div>
    )
}

export default React.memo(GeoChart)
