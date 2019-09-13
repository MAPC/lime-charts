d3.csv("/assets/data/tod_quarter_dow_copy.csv").then(function(data) {
    setGraph(data)
})

function setGraph(data) {
    var margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 800 - margin.left - margin.right
    , height = 650 - margin.top - margin.bottom;
    const colors = ["#1b5eb8", "#5eb81b", "#ffca00", "#e9770b", "#0bbae9"]

    var parseTime = d3.timeParse("%I%p");

    let startTime = new Date(1900,0,1)
    startTime.setHours(0)
    let endTime = new Date(1900,0,1)
    endTime.setHours(23)

    var svg = d3.select(".chart-2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    
    svg.append("text")
        .attr("class", "graph__title")
        .text("Hourly Pattern of Trips by Quarter on Weekdays or Weekends")
        .attr("transform", `translate(75, 15)`)

    var graph= svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class","graph")
        
    var xScale = d3.scaleTime()
    .domain([startTime, endTime])
    .range([0, width - margin.right])

    var yScale = d3.scaleLinear()
        .domain([0, .1])
        .range([height-margin.top, 0]);

    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.top) + ")")
        .call(d3.axisBottom(xScale)
            .tickArguments([22, d3.timeFormat("%I%p")]))
            .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    graph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)
        .tickFormat(d3.format("~p"))) 
    
    svg.append("text")
        .attr("fill", "#000")
        .attr("transform", "translate(25, 225) rotate(-90)")
        .attr("text-anchor", "end")
        .text("Percentage (%) of Rides")
        .attr("class", "axis-label")
        
    svg.append("text")
        .attr("fill", "#000")
        .attr("transform", `translate(375, ${height + margin.top +25})`)
        .attr("text-anchor", "end")
        .text("Time")
        .attr("class", "axis-label")
        
    const line = d3.line()
        .x(function(d, i) { return xScale(d.x); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number

    const weekdayData = [
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q2_2018_wd,
                    "color": colors[0] } }),
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q3_2018_wd,
                    "color": colors[1] } }),
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q4_2018_wd,
                    "color": colors[2] } }),
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q1_2019_wd,
                    "color": colors[3] } }),
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q2_2019_wd,
                    "color": colors[4] } })
        
    ]

    const weekendData = [
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q2_2018_wnd,
                    "color": colors[0] } }),
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q3_2018_wnd,
                    "color": colors[1] } }),
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q4_2018_wnd,
                    "color": colors[2] } }),
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q1_2019_wnd,
                    "color": colors[3] } }),
        data.map(function(d) {
            return {"x": parseTime(d.tod),
                    "y": d.proportion_q2_2019_wnd,
                    "color": colors[4] } })
        
    ]

    const toggleWeekday = document.querySelector("input[value='weekday']")
    const toggleWeekend = document.querySelector("input[value='weekend']")



    weekdayData.forEach(dataset => {
        graph.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", dataset[0].color)
        .attr("stroke-width", "2.5")
    })
    
    toggleWeekday.addEventListener("click", function(e) {
        d3.select(".graph")
        .selectAll(".line")
        .remove()
        weekdayData.forEach(dataset => {
            graph.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", dataset[0].color)
            .attr("stroke-width", "2.5");
        })
    })

    toggleWeekend.addEventListener("click", function(e) {
        d3.select(".graph")
        .selectAll(".line")
        .remove()
        weekendData.forEach(dataset => {
            graph.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", dataset[0].color)
            .attr("stroke-width", "2.5");
        })
    })

    createLegend(colors, width)
}

function createLegend(colors, width){
    const legend = d3.select(".chart-2").append("svg")
    .attr("class","legend")
    .attr("x", `${width + 25}`)
    .attr("y", 40)

    legend.append("circle")
    .attr("fill", colors[0])
    .attr("r",5)
    .attr("transform", "translate(10,50)")

    legend.append("text")
    .attr("transform", "translate(20,55)")
    .text("Q2 2018")

    ///

    legend.append("circle")
    .attr("fill", colors[1])
    .attr("r",5)
    .attr("transform", "translate(10,70)")

    legend.append("text")
    .attr("transform", "translate(20,75)")
    .text("Q3 2018")

    ///

    legend.append("circle")
    .attr("fill", colors[2])
    .attr("r",5)
    .attr("transform", "translate(10,90)")

    legend.append("text")
    .attr("transform", "translate(20,95)")
    .text("Q4 2018")

    ///

    legend.append("circle")
    .attr("fill", colors[3])
    .attr("r",5)
    .attr("transform", "translate(10,110)")

    legend.append("text")
    .attr("transform", "translate(20,115)")
    .text("Q1 2019")

    ///

    legend.append("circle")
    .attr("fill", colors[4])
    .attr("r",5)
    .attr("transform", "translate(10,130)")

    legend.append("text")
    .attr("transform", "translate(20,135)")
    .text("Q2 2019")
}