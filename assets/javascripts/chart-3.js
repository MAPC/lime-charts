d3.csv("/assets/data/chart-3.csv").then(function(data) {
    setGraph(data)
})

function setGraph(data) {
    var margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 600 - margin.left - margin.right
    , height = 425 - margin.top - margin.bottom;
    const colors = ["#1b5eb8", "#0bbae9", "#5eb81b", "#ffca00"]

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([.1, 6.5]) // input
        .range([0, width ]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, .1]) // input 
        .range([height, 0]); // output

    var svg = d3.select(".chart-3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        svg.append("text")
        .attr("class", "graph__title")
        .text("Trip Length by Season and Day of Week")
        .attr("transform", `translate(135, 15)`)
    
    var graph = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class","graph")

    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
    
    svg.append("text")
        .text("Length (miles)")
        .attr("transform", `translate(250, ${(height + margin.top + margin.bottom -5)})`)
        .attr("class", "axis-label")

    graph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)
        .tickFormat(d3.format("~p"))) 

    svg.append("text")
        .text("Percentage (%) of Trips")
        .attr("transform", `translate(25, 300) rotate(-90)`)
        .attr("class", "axis-label")
    

    const line = d3.line()
        .x(function(d) { return xScale(+d.bin_center); })
        .y(function(d) { return yScale(d.y); })


    const dataArray = [
        data.map(function(d) {
            return {"bin_center": d.bin_center,
                    "y": d.proportion_winter_wd,
                    "color": colors[0],
                    "title": "Fall/Winter Weekdays",
                    "class": "winter_wd" } }),
        data.map(function(d) {
            return {"bin_center": d.bin_center,
                    "y": d.proportion_winter_wnd,
                    "color": colors[1],
                    "title": "Fall/Winter Weekends",
                    "class": "winter_wnd" } }),
        data.map(function(d) {
            return {"bin_center": d.bin_center,
                    "y": d.proportion_summer_wd,
                    "color": colors[2],
                    "title": "Spring/Summer Weekdays",
                    "class": "summer_wd" } }),
        data.map(function(d) {
            return { "bin_center": d.bin_center,
                    "y": d.proportion_summer_wnd,
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

    createLegend()
}

function createLegend(){
    const legendEl = document.querySelector(".legend")
    legendEl.addEventListener("click", function(e){
        console.log(e)
        switch(e.target.classList[0]) {
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