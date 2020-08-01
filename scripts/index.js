// Fetch json
const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

d3.json(url).then((data) => render(data));

// SVG layout setup
const width = 975;
const height = 1060;

const svg = d3
  .select("#tree-map")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const treemap = d3.treemap().size([width, height]).padding(2);

// Render function
const render = (data) => {
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  treemap(root);

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

  const cells = svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  const tiles = cells
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return colorScale(d.data.name);
    });

  cells
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => 13 + i * 10)
    .text((d) => d);
};
