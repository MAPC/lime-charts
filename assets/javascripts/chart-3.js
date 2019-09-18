const colors = ["#1b5eb8", "#0bbae9", "#5eb81b", "#ffca00"]

d3.csv("/assets/data/chart-3.csv").then(function(data) {
    const xDomain = data.map(row => +row.bin_center)
    const formattedData = [
        {
            "lineName": "Fall/Winter Weekday",
            "color": colors[0],
            "rideLengths": data.map(row => {
                return {
                    "bin": row.bin_center,
                    "proportion": row.proportion_winter_wd
                }
            })
        },
        {
            "lineName": "Fall/Winter Weekend",
            "color": colors[1],
            "rideLengths": data.map(row => {
                return {
                    "bin": row.bin_center,
                    "proportion": row.proportion_winter_wnd
                }
            })
        },
        {
            "lineName": "Spring/Summer Weekday",
            "color": colors[2],
            "rideLengths": data.map(row => {
                return {
                    "bin": row.bin_center,
                    "proportion": row.proportion_summer_wd
                }
            })
        },
        {
            "lineName": "Spring/Summer Weekend",
            "color": colors[3],
            "rideLengths": data.map(row => {
                return {
                    "bin": row.bin_center,
                    "proportion": row.proportion_summer_wnd
                }
            })
        }
    ]
    setGraph(formattedData, xDomain)
})

function getRange(xDomain, width){
    const max = xDomain[xDomain.length-1]
    const xRange = xDomain.map(value => {
        return {"pixelWidth": (+value * width)/max,
                  "bin": +value   
        } 
    })
    return xRange
}

function getTicks(dataSet){
    return dataSet.map(row => +row.bin)
}

function setGraph(data, xDomain) {
    var margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 600 - margin.left - margin.right
    , height = 425 - margin.top - margin.bottom;
    
    var xScale = d3.scaleLinear()
    .domain([0, 6.2])
    .range([0, width])
    .clamp(true)

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, .1]) // input 
        .range([height-25, 0]); // output

    var svg = d3.select(".chart-3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        svg.append("text")
        .attr("class", "graph__title")
        .text("Trip Length by Season and Day of Week")
        .attr("transform", `translate(135, 15)`)
    
    var graph = svg.append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
        .attr("class","graph")

    graph.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height-25) + ")")
        .call(d3.axisBottom(xScale)
        )
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
    
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
    
    const tooltip = d3.select('.tooltip');
    tooltip.style("display","none")
    const tooltipLine = graph.append('line');

    const line = d3.line()
        .x(function(d) { return xScale(+d.bin); })
        .y(function(d) { return yScale(+d.proportion); })

    const classNames = ['winter_wd', 'winter_wnd', 'summer_wd', 'summer_wnd']
    const rangeDict = getRange(xDomain, width)

    graph.selectAll(".line")
    .data(data).enter()
    .append("path")
    .attr('fill', 'none')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2)
    .datum(d => d.rideLengths)
    .attr('d', line)
    .attr("class", function(d, i) { return classNames[i]});


    let tipBox = graph.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0)
    .on('mousemove', function(d){
        const xPixelsAcross = d3.mouse(tipBox.node())[0]
        const lengthBin = rangeDict.filter(function(row){ return xPixelsAcross <= +row.pixelWidth })[0].bin
        const linePosition = rangeDict.filter ( row => xPixelsAcross <= +row.pixelWidth)[0].pixelWidth

        tooltipLine.attr("stroke", "black")
        .attr("stroke-width", "2")
        .attr("x1", linePosition)
        .attr("x2", linePosition)
        .attr("y1", 0)
        .attr("y2", height-25)

        tooltip.html("<span class='tooltip__title'>At approx. " + lengthBin.toFixed(2) + " miles:" + "</span>")
        .style('display', 'block')
        .style('left', d3.event.pageX + 20)
        .style('top', d3.event.pageY - 20)
        .selectAll()
        .data(data).enter()
        .append('div')
        .html(function(d){
            return `<svg class='tooltip__circle'><circle r='5' fill=${d.color} transform='translate(5,9)'></cirlce> </svg>` + d.lineName + ": " + (parseFloat(d.rideLengths.find(el => el.bin == lengthBin).proportion) * 100).toFixed(2) + "%"
        })

        tooltip.style("left", (event.clientX + 20) + "px")
        tooltip.style("top", (event.clientY) + "px");
    })
    .on('mouseout', function(d){
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
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