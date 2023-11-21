import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getData } from "./getData.js";
//import { TOPOLOGY, DATA } from "./data.js";

const TOPO_URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
const DATA_URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

const TOPOLOGY = await getData(TOPO_URL)
const DATA = await getData(DATA_URL);




//#region global vars  

const legendWidth = 400;
const legendHeight = 20;

const path = d3.geoPath();

const color = d3.scaleQuantize([1,70], d3.schemeGreens[8]);

const scaleMin = d3.min(DATA, d => d.bachelorsOrHigher) // 2.6
const scaleMax = d3.max(DATA, d => d.bachelorsOrHigher) // 75.1

const counties = topojson.feature(TOPOLOGY, TOPOLOGY.objects.counties);
const statemesh = topojson.mesh(TOPOLOGY, TOPOLOGY.objects.states, (a, b) => a !== b);
const valuemap = new Map(DATA.map(d => [d.fips, d.bachelorsOrHigher]))

//#endregion


//#region scaling and axis stuff  

const legendXScale = d3.scaleLinear()
  .domain([0, 80])
  .range([0, legendWidth])

const legendXAxis = d3.axisBottom(legendXScale)

//#endregion


//#region render stuff  

const tooltip = d3.select("#vis")
  .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .attr("id", "tooltip")
    .text("");

const svg = d3.select("#vis")
  .append("svg")
    .attr("width", 975)
    .attr("height", 670)

svg.append("g")
  .selectAll("path")
  .data(counties.features)
  .join("path")
    .attr("fill", d => color(valuemap.get(d.id)))
    .attr("class", "county")
    .attr("data-fips", d => d.id)
    .attr("data-education", d => valuemap.get(d.id))
    .attr("d", path)
    .on("mouseover", e => {
      tooltip.html(`
        <p>Fips: ${e.target.dataset.fips}</p>
        <p>Education: ${e.target.dataset.education}</p>
      `)
      tooltip.style("top", e.pageY - 100 + "px")
      tooltip.style("left", e.pageX - 30 + "px")
      tooltip.style("visibility", "visible")
      tooltip.attr("data-education", e.target.dataset.education)
    })
    .on("mouseout", e => tooltip.style("visibility", "hidden"))
  .append("title")
    .text("hi")

svg.append("path")
  .datum(statemesh)
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-linejoin", "round")
  .attr("d", path)

const legend = svg
  .append("g")
  .attr("transform", "translate(250, 20)")
  .attr("id", "legend")
  .call(legendXAxis)

legend.append("g")
  .selectAll("rect")
  .data(color.range())
  .enter()
  .append("rect")
    .style("fill", d => d)
    .attr("x", (d,i) => {return legendWidth / 8 * i})
    .attr("y", -legendHeight)
    .attr("width", legendWidth / 8)
    .attr("height", legendHeight)

//#endregion
