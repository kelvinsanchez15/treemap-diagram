// Fetch json
const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

d3.json(url).then((data) => render(data));

// SVG layout setup
const width = 975;
const height = 550;
const margin = { top: 30, right: 0, bottom: 50, left: 0 };

const svg = d3
  .select("#tree-map")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const treemap = d3
  .treemap()
  .size([width, height - margin.bottom])
  .padding(2);

const colorScale = d3.scaleOrdinal([
  "#b9b5f3",
  "#b1bf81",
  "#74aff3",
  "#e5d196",
  "#7cccee",
  "#eab494",
  "#77d9e3",
  "#ecabb7",
  "#67ccc2",
  "#e1abd8",
  "#a0d3a0",
  "#d6c0eb",
  "#dceeb6",
  "#9cafd7",
  "#cec7a1",
  "#abc8f5",
  "#a9ebd3",
  "#90c4ad",
]);

// Render function
const render = (data) => {
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  treemap(root);

  const cells = svg.selectAll("g").data(root.leaves()).enter().append("g");

  const tiles = cells
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return colorScale(d.data.name);
    })
    .on("mousemove", (d) => tooltipMouseOver(d))
    .on("mouseout", (d) => tooltipMouseOut(d));

  // Append labels
  cells
    .append("text")
    .attr("class", "tile-text")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => 10 + d.y0)
    .text((d) => d.data.name);

  // Interaction logic
  const tooltip = d3
    .select("#tree-map")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const tooltipMouseOver = (d) => {
    tooltip.transition().duration(200).style("opacity", 0.9);

    tooltip
      .html(
        `
      ${d.data.name}<br />
      Platform: ${d.data.category}<br />
      Value: $${d.data.value}M
      `
      )
      .attr("data-value", d.data.value)
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY + 20 + "px");
  };

  const tooltipMouseOut = () =>
    tooltip.transition().duration(200).style("opacity", 0);

  // Legend logic
  const size = 10;

  const categories = root
    .leaves()
    .map((nodes) => nodes.data.category)
    .filter((category, i, arr) => arr.indexOf(category) === i);

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(100, 510)");

  const legendElem = legend
    .append("g")
    .selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "legendElem")
    .attr("transform", (d, i) => {
      xOff = (i % 9) * 90;
      yOff = Math.floor(i / 9) * 20;
      return `translate(${xOff}, ${yOff})`;
    });

  legendElem
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", size)
    .attr("height", size)
    .attr("fill", (d) => colorScale(d));

  legendElem
    .append("text")
    .attr("dx", size + 5)
    .attr("dy", size)
    .style("text-anchor", "front")
    .style("fill", "white")
    .text((d) => d);
};
