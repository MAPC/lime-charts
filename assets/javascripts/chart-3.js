d3.csv("/assets/data/chart-3.csv").then(function(data) {
    setGraph(data)
})

function setGraph(data) {
    var margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 700 - margin.left - margin.right
    , height = 650 - margin.top - margin.bottom;
    const colors = ["#1b5eb8", "#0bbae9", "#5eb81b", "#ffca00"]

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, 50]) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, .1]) // input 
        .range([height, 0]); // output

    var svg = d3.select(".chart-3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    
    var graph = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class","graph")

    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
    
    svg.append("text")
        .text("Length (m)")
        .attr("transform", `translate(275, ${(height + margin.top + margin.bottom -5)})`)

    graph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale))

    svg.append("text")
        .text("Percentage (%) of Trips")
        .attr("transform", `translate(25, 325) rotate(-90)`)
    

    const line = d3.line()
        .x(function(d, i) { return xScale(i); })
        .y(function(d) { return yScale(d.y); })
        .curve(d3.curveMonotoneX)


    const dataArray = [
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

    dataArray.forEach(dataset => {
        graph.append("path")
        .datum(dataset)
        .attr("class", `${dataset[0].class} line`)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", dataset[0].color)
        .attr("stroke-width", "2")
    })

    // const tooltip = d3.select("svg").append("svg")
    //     .attr("class", "tooltip")

    // svg.selectAll(".line")
    //     .on("mouseover", function(d) {
    //         tooltip.transition()
    //         .duration(50)
    //         .style("opacity", .9);
            
    //         tooltip.html(htmlValue(d))
    //         .style("left", (d3.event.pageX + 10) + "px")
    //         .style("top", (d3.event.pageY + 10) + "px");
    //     })


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
    .attr("class", "legend-winter-wd")

    ///

    legend.append("circle")
    .attr("fill", colors[1])
    .attr("r",5)
    .attr("transform", "translate(5,30)")
    .attr("class", "legend-winter-wnd")

    legend.append("text")
    .attr("transform", "translate(15,35)")
    .text("Fall/Winter Weekend")
    .attr("class", "legend-winter-wnd")

    ///

    legend.append("circle")
    .attr("fill", colors[2])
    .attr("r",5)
    .attr("transform", "translate(5,50)")
    .attr("class", "legend-summer-wd")

    legend.append("text")
    .attr("transform", "translate(15,55)")
    .text("Spring/Summer Weekday")
    .attr("class", "legend-summer-wd")

    ///

    legend.append("circle")
    .attr("fill", colors[3])
    .attr("r",5)
    .attr("transform", "translate(5,70)")
    .attr("class", "legend-summer-wnd")

    legend.append("text")
    .attr("transform", "translate(15,75)")
    .text("Spring/Summer Weekend")
    .attr("class", "legend-summer-wnd")

    const legendEl = document.querySelector(".legend")
    legendEl.addEventListener("click", function(e){
        switch(e.target.attributes.class.nodeValue) {
            case "legend-winter-wd":
                toggleLine('.winter_wd')
                break
            case "legend-winter-wnd":
                toggleLine('.winter_wnd')
                break
            case "legend-summer-wd":
                toggleLine('.summer_wd')
                break
            case "legend-summer-wnd":
                toggleLine('.summer_wnd')
                break
        }
    })
}

function toggleLine(elementClass){
    const selection = document.querySelector(elementClass)
    if (selection.getAttribute("visibility") === "hidden"){
        d3.select(elementClass).attr("visibility", "visible")
    } else {
        d3.select(elementClass).attr("visibility", "hidden")
    }
}

function htmlValue(data){
    return 'Hello world!'
}