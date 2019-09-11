d3.csv("/assets/data/tod_quarter_dow.csv").then(function(data) {
    setGraph(data)
})

function setGraph(data) {
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = 600 - margin.left - margin.right // Use the window's width 
    , height = 500 - margin.top - margin.bottom; // Use the window's height
    const colors = ["#3B67BC", "#EA722B", "#A7A7A7", "#FFB801", "#5191CF"]

    var svg = d3.select(".trips-analysis-by-quarter")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class","graph")

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, 23]) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, .1]) // input 
        .range([height, 0]); // output 

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))


    // 4. Call the y axis in a group tag
    const yAxis = svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft
    yAxis.append("text")
    .text("Axis")
    .attr("transform", "translate(0," + height + ")")

    // 7. d3's line generator
    const line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number

    const weekdayData = [
        data.map(function(d) {
            return {"y": d.proportion_q2_2018_wd,
                    "color": colors[0] } }),
        data.map(function(d) {
            return {"y": d.proportion_q3_2018_wd,
                    "color": colors[1] } }),
        data.map(function(d) {
            return {"y": d.proportion_q4_2018_wd,
                    "color": colors[2] } }),
        data.map(function(d) {
            return {"y": d.proportion_q1_2019_wd,
                    "color": colors[3] } }),
        data.map(function(d) {
            return {"y": d.proportion_q2_2019_wd,
                    "color": colors[4] } })
        
    ]

    const weekendData = [
        data.map(function(d) {
            return {"y": d.proportion_q2_2018_wnd,
                    "color": colors[0] } }),
        data.map(function(d) {
            return {"y": d.proportion_q3_2018_wnd,
                    "color": colors[1] } }),
        data.map(function(d) {
            return {"y": d.proportion_q4_2018_wnd,
                    "color": colors[2] } }),
        data.map(function(d) {
            return {"y": d.proportion_q1_2019_wnd,
                    "color": colors[3] } }),
        data.map(function(d) {
            return {"y": d.proportion_q2_2019_wnd,
                    "color": colors[4] } })
        
    ]

    const toggleWeekday = document.querySelector("input[value='weekday']")
    const toggleWeekend = document.querySelector("input[value='weekend']")

    weekdayData.forEach(dataset => {
        svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", dataset[0].color)
        .attr("stroke-width", "2.5");
    })
    
    toggleWeekday.addEventListener("click", function(e) {
        d3.select(".graph")
        .selectAll(".line")
        .remove()
        weekdayData.forEach(dataset => {
            svg.append("path")
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
            svg.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", dataset[0].color)
            .attr("stroke-width", "2.5");
        })
    })

    createLegend(colors)
}

function createLegend(colors){
    const legend = d3.select(".test").append("svg")
    .attr("class","legend")
    .attr("transform", "translate(60,55)")

    legend.append("circle")
    .attr("fill", colors[0])
    .attr("r",5)
    .attr("transform", "translate(5,10)")

    legend.append("text")
    .attr("transform", "translate(15,15)")
    .text("Proportion of Q2 2018 Rides")

    ///

    legend.append("circle")
    .attr("fill", colors[1])
    .attr("r",5)
    .attr("transform", "translate(5,30)")

    legend.append("text")
    .attr("transform", "translate(15,35)")
    .text("Proportion of Q3 2018 Rides")

    ///

    legend.append("circle")
    .attr("fill", colors[2])
    .attr("r",5)
    .attr("transform", "translate(5,50)")

    legend.append("text")
    .attr("transform", "translate(15,55)")
    .text("Proportion of Q4 2018 Rides")

    ///

    legend.append("circle")
    .attr("fill", colors[3])
    .attr("r",5)
    .attr("transform", "translate(5,70)")

    legend.append("text")
    .attr("transform", "translate(15,75)")
    .text("Proportion of Q1 2019 Rides")

    ///

    legend.append("circle")
    .attr("fill", colors[4])
    .attr("r",5)
    .attr("transform", "translate(5,90)")

    legend.append("text")
    .attr("transform", "translate(15,95)")
    .text("Proportion of Q2 2019 Rides")
}