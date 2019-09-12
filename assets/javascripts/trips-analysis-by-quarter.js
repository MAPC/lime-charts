d3.csv("/assets/data/trips_simplified.csv").then( data => {
    //X AXIS: yr_qtr (ex: trip_q4_2018)
    //Y AXIS: total_count (ex: 4093)
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = 700- margin.left - margin.right
    , height = 600 - margin.top - margin.bottom;

    console.log(data)


    var dataset = d3.stack()
        .keys(["ele_prcntg","mechanical_prcntg"])

    const series = dataset(data)

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map( d => { return d.yr_qtr}))

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1])

    var svg = d3.select(".trips-analysis-by-quarter")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
	.attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    
    g.append("g")
	.call(d3.axisLeft(y))
	.append("text")
	.attr("fill", "#000")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
    .text("Total Count");

    var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];
    var groups = svg.selectAll("g.cost")
    .data(series)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });

    groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) {
        console.log(d.data.yr_qtr)
        return x(d.data.yr_qtr) })
    .attr("y", d => {
        console.log(d)
        y(d[1])
    })
	.attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
})
