d3.csv("/assets/data/tod_quarter_dow.csv").then(function(data) {
    setGraph(data)
})

function setGraph(data)
{
// 2. Use the margin convention practice 
var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = 600 - margin.left - margin.right // Use the window's width 
  , height = 500 - margin.top - margin.bottom; // Use the window's height

// 1. Add the SVG to the page and employ #2
var svg = d3.select(".test")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// The number of datapoints
var n = 24;

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width]); // output

// 6. Y scale will use the randomly generate number 
var yScale = d3.scaleLinear()
    .domain([0, .1]) // input 
    .range([height, 0]); // output 

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var dataset1 = data.map(function(d) {
    return {"y": d.proportion_q2_2018_wd } })

var dataset2 = data.map(function(d) {
    return {"y": d.proportion_q2_2019_wd,
            "color": "red"} })

console.log(dataset2)

// 9. Append the path, bind the data, and call the line generator 
svg.append("path")
    .datum(dataset1) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line) // 11. Calls the line generator
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", "2.5")

svg.append("path")
    .datum(dataset2) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line) // 11. Calls the line generator
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", "2.5")

// 12. Appends a circle for each datapoint 
svg.selectAll(".dot")
    .data(dataset1)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5);
}