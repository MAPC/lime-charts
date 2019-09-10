var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// // define the line
    

// // append the svg obgect to the body of the page
// // appends a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
var svg = d3.select(".trips-analysis-by-quarter")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/assets/data/tod_quarter_dow.csv").then(data => {
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return +d.tod; } ));
  y.domain([0, .1]);



var valueline1 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q2_2019_wd); })

var valueline2 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q2_2019_wnd); });

var valueline3 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q1_2019_wd); });

var valueline4 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q1_2019_wnd); });

var valueline5 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q4_2018_wd); });

var valueline6 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q4_2018_wnd); });

var valueline7 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q3_2018_wd); });

var valueline8 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q3_2018_wnd); });

var valueline9 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q2_2018_wd); });

var valueline10 = d3.line()
    .x(function(d) { return x(+d.tod); })
    .y(function(d) { return y(+d.proportion_q2_2018_wnd); });


const lines = [valueline1,
                valueline2,
                valueline3,
                valueline4,
                valueline5,
                valueline6,
                valueline7,
                valueline8,
                valueline9,
                valueline10
]
  // Add the valueline path.

lines.forEach(line => {
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d",line)
      .attr("fill","none")
      .attr("stroke","red")
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
