d3.csv("/assets/data/chart-3.csv").then(function(data) {
    setGraph(data)
})

function setGraph(data) {
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = 600 - margin.left - margin.right
    , height = 500 - margin.top - margin.bottom;
    const colors = ["#3B67BC", "#EA722B", "#A7A7A7", "#FFB801", "#5191CF"]

    var svg = d3.select(".chart-3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class","graph")

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, 50]) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, .1]) // input 
        .range([height, 0]); // output 

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("height", 20)
        .call(d3.axisBottom(xScale))


    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .text("Axis")
        .attr("transform", "translate(0," + height + ")")

    // 7. d3's line generator
    const line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX)

    const dataset = data.map(function(datapoint) {
        return {y: datapoint.proportion_winter_wd}
    })

    const weekdayData = [
        data.map(function(d) {
            return {"y": d.proportion_winter_wd,
                    "color": colors[0],
                    "title": "Fall/Winter Weekdays",
                    "class": "winter_wd" } }),
        data.map(function(d) {
            return {"y": d.proportion_winter_wnd,
                    "color": colors[1],
                    "title": "Fall/Winter Weekends",
                    "class": "winter_wnd" } }),
        data.map(function(d) {
            return {"y": d.proportion_summer_wd,
                    "color": colors[2],
                    "title": "Spring/Summer Weekdays",
                    "class": "summer_wd" } }),
        data.map(function(d) {
            return {"y": d.proportion_summer_wnd,
                    "color": colors[3],
                    "title": "Spring/Summer Weekends",
                    "class": "summer_wnd" } })
    ]



    weekdayData.forEach(dataset => {
        console.log(dataset)
        svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", dataset[0].color)
        .attr("stroke-width", "2.5")
        .attr("class", dataset[0].class)
    })

    svg.selectAll(".line")
    .on("mouseover", function(d) {
        console.log(d[0].title)
    })


    createLegend(colors)
}

function createLegend(colors){
    const legend = d3.select(".chart-3").append("svg")
    .attr("class","legend")
    .attr("transform", "translate(300,55)")

    legend.append("circle")
    .attr("fill", colors[0])
    .attr("r",5)
    .attr("transform", "translate(5,10)")
    .attr("class", "legend-winter-wd")

    legend.append("text")
    .attr("transform", "translate(15,15)")
    .text("Fall/Winter Weekday")

    ///

    legend.append("circle")
    .attr("fill", colors[1])
    .attr("r",5)
    .attr("transform", "translate(5,30)")

    legend.append("text")
    .attr("transform", "translate(15,35)")
    .text("Fall/Winter Weekend")

    ///

    legend.append("circle")
    .attr("fill", colors[2])
    .attr("r",5)
    .attr("transform", "translate(5,50)")

    legend.append("text")
    .attr("transform", "translate(15,55)")
    .text("Spring/Summer Weekend")

    ///

    legend.append("circle")
    .attr("fill", colors[3])
    .attr("r",5)
    .attr("transform", "translate(5,70)")

    legend.append("text")
    .attr("transform", "translate(15,75)")
    .text("Spring/Summer Weekday")

    const test = document.querySelector(".legend-winter-wd")
    test.addEventListener("click", function(e){
        d3.select(".winter_wd")
        .attr("visibility","hidden")
    })
}