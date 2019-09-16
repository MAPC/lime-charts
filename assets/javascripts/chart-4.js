d3.csv("/assets/data/ele_assis_monthly_cnt_copy.csv").then(data => {

    var margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 700 - margin.left - margin.right
    , height = 425 - margin.top - margin.bottom;


    const quarterlyData = data.reduce(function(quarters,month) {
        let quarter = quarters.find(quarter => { return quarter.yr_qtr === month.yr_qtr })
        if (!quarter) {
            quarter = { yr_qtr: month.yr_qtr,
                        total_count: 0,
                        mechanical: 0,
                        ele_assis: 0 }
            quarters.push(quarter)
        }

        quarter.total_count += parseInt(month.total_count)
        quarter.mechanical += parseInt(month.mechanical)
        quarter.ele_assis += parseInt(month.ele_assis)
        return quarters
    }, [])

    var dataset = d3.stack()
    .keys(["ele_assis", "mechanical"])
    const series = dataset(data)

    const quarterlySeries = dataset(quarterlyData)

    var xQuarterly = d3.scaleBand()
        .range([0, width-margin.right])
        .padding(0.1)
        .domain(data.map( d => { return d.yr_qtr}))
    
    var xMonthly = d3.scaleBand()
        .range([0, width-margin.right])
        .padding(0.1)
        .domain(data.map( d => { return d._month}))

    var yQuarterly = d3.scaleLinear()
        .range([height-margin.top, 0])
        .domain([0, 120000])
    
    var yMonthly = d3.scaleLinear()
        .range([height-margin.top, 0])
        .domain([0, 45000])


    var svg = d3.select(".chart-4")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    
    svg.append("text")
        .attr("class", "graph__title")
        .text("E-Bike vs. Manual Bike Rides, Quarterly or Monthly")
        .attr("transform", `translate(125, 15)`)

    var graph = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "graph")
        .attr("height", height-margin.top)
    
    graph.append("g")
        .call(d3.axisLeft(yQuarterly)
        .tickFormat(d3.format("~s")))
        .attr("class", "yaxis-quarterly")

    graph.append("g")
        .call(d3.axisLeft(yMonthly)
        .tickFormat(d3.format("~s")))
        .attr("class", "yaxis-monthly")
        .attr("visibility", "hidden")
    
    
    svg.append("text")
	.attr("fill", "#000")
	.attr("transform", "translate(15, 125) rotate(-90)")
	.attr("text-anchor", "end")
    .text("Number of Rides")
    .attr("class", "axis-label")

    svg.append("text")
	.attr("fill", "#000")
	.attr("transform", `translate(325, ${height + margin.top + margin.bottom})`)
	.attr("text-anchor", "end")
    .text("Time")
    .attr("class", "axis-label")

    const toggle = svg.append("svg")
        .attr("class", "toggle__section")
        .attr("x", `${width + 25}`)
        .attr("y", 140)
        .attr("width", 125)
        .attr("height", 100)
    
    toggle.append("text")
        .text("Timeframe")
        .attr("transform", "translate(5,25)")
        .attr("class", "toggle__title")
    
    toggle.append("text")
        .text("- Quarterly")
        .attr("transform", "translate(5,50)")
        .attr("class", "toggle__item toggle__item-active quarterly")
    
    toggle.append("text")
        .text("- Monthly")
        .attr("transform", "translate(5,70)")
        .attr("class", "toggle__item monthly")
    
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

            d3.select('.monthly')
            .classed("toggle__item-active", true)

            d3.select('.quarterly')
            .classed("toggle__item-active", false)

            d3.select(".yaxis-monthly")
            .attr("visibility", "visible")

            d3.select(".yaxis-quarterly")
            .attr("visibility", "hidden")
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

            d3.select('.monthly')
            .classed("toggle__item-active", false)

            d3.select('.quarterly')
            .classed("toggle__item-active", true)

            d3.select(".yaxis-monthly")
            .attr("visibility", "hidden")

            d3.select(".yaxis-quarterly")
            .attr("visibility", "visible")
        })

    var colors = ["#1b5eb8", "#5eb81b"]

    graph.append("g")
        .attr("class", "xaxis-quarterly")
        .attr("transform", "translate(0," + (height - margin.top) + ")")
        .call(d3.axisBottom(xQuarterly))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    
    graph.append("g")
        .attr("class", "xaxis-monthly")
        .attr("transform", "translate(0," + (height - margin.top) + ")")
        .attr("visibility","hidden")
        .call(d3.axisBottom(xMonthly))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    const quarterlyLayers = graph.selectAll("g.ridetype-quarterly")
        .data(quarterlySeries)
        .enter().append("g")
        .attr("class", "ridetype-quarterly")
        .style("fill", function(d, i) { return colors[i]; })

    quarterlyLayers.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xQuarterly(d.data.yr_qtr) })
        .attr("y", d => { return yQuarterly(d[1]) })
        .attr("height", d => Math.abs(yQuarterly(d[1]) - yQuarterly(d[0])))
        .attr("width", xQuarterly.bandwidth())

    const monthlyLayers = graph.selectAll("g.ridetype-monthly")
        .data(series)
        .enter().append("g")
        .attr("class", "ridetype-monthly")
        .style("fill", function(d, i) { return colors[i]; })
        .attr("visibility","hidden")

    monthlyLayers.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xMonthly(d.data._month) })
        .attr("y", d => { return yMonthly(d[1]) })
        .attr("height", d => Math.abs(yMonthly(d[1]) - yMonthly(d[0])))
        .attr("width", xMonthly.bandwidth())

    createLegend(colors,width)
})

function createLegend(colors, width){
    const legend = d3.select(".chart-4").append("svg")
    .attr("class","legend")
    .attr("left", "625")
    .attr("x", `${width + 25}`)
    .attr("y", 40)
    .attr("display", "inline-block")
    .attr("width", 125)
    .attr("height", 100)

    
    legend.append("circle")
    .attr("fill", colors[0])
    .attr("r",5)
    .attr("transform", "translate(10,50)")

    legend.append("text")
    .attr("transform", "translate(20,55)")
    .text("E-Bikes")
    .attr("class", "legend__item")

    ///

    legend.append("circle")
    .attr("fill", colors[1])
    .attr("r",5)
    .attr("transform", "translate(10,70)")

    legend.append("text")
    .attr("transform", "translate(20,75)")
    .text("Mechanical Bikes")
    .attr("class", "legend__item")

    
}