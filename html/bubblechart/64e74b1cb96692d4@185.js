// https://observablehq.com/@d3/bubble-chart@185
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["flare.csv",new URL("./flare.csv",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# People Dashboard
`
)});
  main.variable(observer("bubbleChart")).define("bubbleChart", ["pack","data","d3","width","height","DOM","color","format"], function(pack,data,d3,width,height,DOM,color,format)
{
  const root = pack(data);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("font-size", 28)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("fill", "white");

  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  leaf.append("circle")
      .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("r", d => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", d => color(d.data.group));

  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
    .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d);

  leaf.append("title")
      .text(d => `${d.data.title === undefined ? "" : `${d.data.title}
`}${format(d.value)}`);

  return svg.node();
}
);
main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("flare.csv").text(), ({id, value}) => ({name: id.split(".").pop(), title: id.replace(/\./g, "/"), group: id.split(".")[1], value: +value}))
)});
 main.variable(observer("pack")).define("pack", ["d3","width","height"], function(d3,width,height){return(
data => d3.pack()
    .size([width - 2, height - 2])
    .padding(3)
  (d3.hierarchy({children: data})
    .sum(d => d.value))
)});
  main.variable(observer("width")).define("width", function(){return(
932
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(",d")
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(data.map(d => d.group), d3.schemeCategory10)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
