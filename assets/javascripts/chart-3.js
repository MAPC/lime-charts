const colors = ["#1b5eb8", "#0bbae9", "#5eb81b", "#ffca00"]

d3.csv("/assets/data/chart-3.csv").then(function(data) {
    const formattedData = [
        {
            "lineName": "Fall/Winter Weekday",
            "color": colors[0],
            "rideLengths": data.map(row => {
                return {
                    "length": row.bin_center,
                    "proportion": row.proportion_winter_wd
                }
            })
        },
        {
            "lineName": "Fall/Winter Weekend",
            "color": colors[1],
            "rideLengths": data.map(row => {
                return {
                    "length": row.bin_center,
                    "proportion": row.proportion_winter_wnd
                }
            })
        },
        {
            "lineName": "Spring/Summer Weekday",
            "color": colors[2],
            "rideLengths": data.map(row => {
                return {
                    "length": row.bin_center,
                    "proportion": row.proportion_summer_wd
                }
            })
        },
        {
            "lineName": "Spring/Summer Weekend",
            "color": colors[3],
            "rideLengths": data.map(row => {
                return {
                    "length": row.bin_center,
                    "proportion": row.proportion_summer_wnd
                }
            })
        }
    ]
    setGraph(formattedData)
})

function setGraph(data) {
    var margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 600 - margin.left - margin.right
    , height = 425 - margin.top - margin.bottom;

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
        .x(function(d) { return xScale(+d.length); })
        .y(function(d) { return yScale(d.proportion); })

    const classNames = ['winter_wd', 'winter_wnd', 'summer_wd', 'summer_wnd']
    graph.selectAll(".line")
        .data(data).enter()
        .append("path")
        .attr('fill', 'none')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2)
        .datum(d => d.rideLengths)
        .attr('d', line)
        .attr("class", function(d, i) { return classNames[i]});

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