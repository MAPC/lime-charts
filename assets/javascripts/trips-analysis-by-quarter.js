var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// // define the line
var valueline = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q1_2019_wd); });
    

// // append the svg obgect to the body of the page
// // appends a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
var svg = d3.select(".trips-analysis-by-quarter")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // Get the datas
d3.csv("/assets/data/tod_quarter_dow.csv").then(data => {
    console.log(data)
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return +d.tod; } ));
  y.domain([0, d3.max(data, function(d) { return +d.proportion_q1_2019_wd; })]);

  const tooltip = d3.select("body").append("div")
                   .attr("class", "tooltip")
                   .style("opacity", 0);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline)
      .attr("fill","none")
      .attr("stroke", "red")
      .on("mouseover", (d) => {
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);
        tooltip.html(htmlValue(d))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
});

function htmlValue(data) {
    return data.proportion_q1_2019_wd
  }
