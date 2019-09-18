d3.csv("/assets/data/ele_assis_monthly_cnt.csv").then(data => {
    const margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 700 - margin.left - margin.right
    , height = 425 - margin.top - margin.bottom;

    const seriesGen = d3.stack().keys(["ele_assis", "mechanical"])

    const quarterlyData = data.reduce(function(quarters,month) {
        let quarter = quarters.find(quarter => { return quarter.yr_qtr === month.yr_qtr })
        if (!quarter) {
            quarter = { yr_qtr: month.yr_qtr,
                        total_count: 0,
                        mechanical: 0,
                        ele_assis: 0
                    }
            quarters.push(quarter)
        }

        quarter.total_count += parseInt(month.total_count)
        quarter.mechanical += parseInt(month.mechanical)
        quarter.ele_assis += parseInt(month.ele_assis)
        return quarters
    }, [])

    const monthlySeries = seriesGen(data)
    const quarterlySeries = seriesGen(quarterlyData)

    const xQuarterly = d3.scaleBand()
    .range([0, width-margin.right])
    .padding(0.1)
    .domain(data.map( d => { return d.yr_qtr}))
    
    const xMonthly = d3.scaleBand()
    .range([0, width-margin.right])
    .padding(0.1)
    .domain(data.map( d => { return d._month}))

    const yQuarterly = d3.scaleLinear()
    .range([height-25, 0])
    .domain([0, 120000])
    
    const yMonthly = d3.scaleLinear()
    .range([height-25, 0])
    .domain([0, 45000])


    const svg = d3.select(".chart-4")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    
    svg.append("text")
    .attr("class", "graph__title")
    .text("E-Bike vs. Manual Bike Rides, Quarterly or Monthly")
    .attr("transform", `translate(125, 15)`)

    const graph = svg.append("g")
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

    const colors = ["#1b5eb8", "#5eb81b"]

    graph.append("g")
    .attr("class", "xaxis-quarterly")
    .attr("transform", "translate(0," + (height - 25) + ")")
    .call(d3.axisBottom(xQuarterly))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");
    
    graph.append("g")
    .attr("class", "xaxis-monthly")
    .attr("transform", "translate(0," + (height - 25) + ")")
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
    .on("mousemove", function(d) {
        tooltip.html(quarterlyToolTip(d.data))
        tooltip.attr("width", "200")
        tooltip.attr("height", "200")
        tooltip.style("display", null)
        tooltip.style("left", (event.clientX + 20) + "px")
        tooltip.style("top", (event.clientY) + "px");
    })
    .on("mouseleave", function(d) { tooltip.style("display", "none") })

    const monthlyLayers = graph.selectAll("g.ridetype-monthly")
    .data(monthlySeries)
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
    .on("mousemove", function(d) {
        tooltip.html(monthlyToolTip(d.data))
        tooltip.attr("width", "200")
        tooltip.attr("height", "200")
        tooltip.style("display", null)
        tooltip.style("left", (event.clientX + 20) + "px")
        tooltip.style("top", (event.clientY) + "px");
    })
    .on("mouseleave", function(d) { tooltip.style("display", "none") })

    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");
        
    tooltip.append("rect")
    .attr("width", 50)
    .attr("height", 50)
    .attr("fill", "white")
    .style("opacity", 0.5);

    tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
})

function quarterlyToolTip(data){
    return "<span class='tooltip__title'>" + data.yr_qtr + "</span>"
    + "<br/> Total number of rides: " + data.total_count.toLocaleString() 
    + "<br />Mechanical bike rides: " + data.mechanical.toLocaleString() + ` (${((data.mechanical / data.total_count) * 100).toFixed(0)}%)`
    + "<br />E-Bike rides: " + data.ele_assis.toLocaleString() + ` (${((data.ele_assis / data.total_count)* 100).toFixed(0)}%)`
}

function monthlyToolTip(data) {
    return "<span class='tooltip__title'>" + data._month + "</span>"
    + "<br/> Total number of rides: " + parseInt(data.total_count).toLocaleString()
    + "<br />Mechanical bike rides: " + parseInt(data.mechanical).toLocaleString() + ` (${((data.mechanical / data.total_count) * 100).toFixed(0)}%)`
    + "<br />E-Bike rides: " + parseInt(data.ele_assis).toLocaleString() + ` (${((data.ele_assis / data.total_count) * 100).toFixed(0)}%)`
}