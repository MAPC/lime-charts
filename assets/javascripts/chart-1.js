d3.csv("/assets/data/ele_assis_monthly_cnt.csv").then( data => {
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = 800 - margin.left - margin.right
    , height = 650 - margin.top - margin.bottom;

    const toggleQuarters = document.querySelector(".quarterly")
    const toggleMonths = document.querySelector(".monthly")

    toggleMonths.addEventListener("click", function() {
        d3.selectAll(".ridetype-quarterly")
        .attr("visibility", "hidden")

        d3.select(".xaxis-quarterly")
        .attr("visibility", "hidden")

        d3.selectAll(".ridetype-monthly")
        .attr("visibility", "visible")

        d3.select(".xaxis-monthly")
        .attr("visibility", "visible")
    })

    toggleQuarters.addEventListener("click", function() {
        d3.selectAll(".ridetype-monthly")
        .attr("visibility", "hidden")

        d3.select(".xaxis-monthly")
        .attr("visibility", "hidden")

        d3.selectAll(".ridetype-quarterly")
        .attr("visibility", "visible")

        d3.select(".xaxis-quarterly")
        .attr("visibility", "visible")
    })

    var dataset = d3.stack()
        .keys(["ele_prcntg", "mechanical_prcntg"])
        const series = dataset(data)

    var xQuarterly = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map( d => { return d.yr_qtr}))
    
    var xMonthly = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map( d => { return d._month}))

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1])

    var svg = d3.select(".chart-1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    g.append("g")
	.call(d3.axisLeft(y))
	.append("text")
	.attr("fill", "#000")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
    .text("% of Rides")

    var colors = ["#3B67BC", "#EA722B"]

    g.append("g")
        .attr("class", "xaxis-quarterly")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xQuarterly))
    
    g.append("g")
        .attr("class", "xaxis-monthly")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xMonthly))
        .attr("visibility","hidden")

    const quarterlyLayers = svg.selectAll("g.ridetype-quarterly")
        .data(series)
        .enter().append("g")
        .attr("class", "ridetype-quarterly")
        .style("fill", function(d, i) { return colors[i]; })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    quarterlyLayers.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xQuarterly(d.data.yr_qtr) })
        .attr("y", d => { return y(d[1]) })
        .attr("height", d => Math.abs(y(d[1]) - y(d[0])))
        .attr("width", xQuarterly.bandwidth())

    const monthlyLayers = svg.selectAll("g.ridetype-monthly")
        .data(series)
        .enter().append("g")
        .attr("class", "ridetype-monthly")
        .style("fill", function(d, i) { return colors[i]; })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("visibility","hidden")

    monthlyLayers.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xMonthly(d.data._month) })
        .attr("y", d => { return y(d[1]) })
        .attr("height", d => Math.abs(y(d[1]) - y(d[0])))
        .attr("width", xMonthly.bandwidth())

    createLegend(colors)
})

function createLegend(colors){
    const legend = d3.select(".chart-1").append("svg")
    .attr("class","legend")
    .attr("transform", `translate(50, 0)`)
    .attr("width", 200)
    .attr("height", 50)

    legend.append("circle")
    .attr("fill", colors[0])
    .attr("r",5)
    .attr("transform", "translate(5,10)")

    legend.append("text")
    .attr("transform", "translate(15,15)")
    .text("E-Bikes")

    ///

    legend.append("circle")
    .attr("fill", colors[1])
    .attr("r",5)
    .attr("transform", "translate(5,30)")

    legend.append("text")
    .attr("transform", "translate(15,35)")
    .text("Mechanical Bikes")

    
}