d3.csv("/assets/data/ele_assis_monthly_cnt.csv").then( data => {
    //X AXIS: yr_qtr (ex: trip_q4_2018)
    //Y AXIS: total_count (ex: 4093)
    console.log(data)

    var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = 700- margin.left - margin.right // Use the window's width 
  , height = 600 - margin.top - margin.bottom; // Use the window's height
  var n = 7


    var svg = d3.select(".trips-analysis-by-quarter")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
    
    x.domain(data.map( d => { return d.yr_qtr}))

    var y = d3.scaleLinear()
        .range([height, 0])
    y.domain([450, 45000])

    console.log(d3.max(data, function(d) { return d.total_count}))

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

    g.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function (d) { return x(d.yr_qtr); })
	.attr("y", function (d) {
        console.log(+d.total_count)
        console.log(y(+d.total_count))
        return y(+d.total_count); })
	.attr("width", x.bandwidth())
	.attr("height", function (d) {
	 	return height - y(+(d.total_count));
	 });

})
