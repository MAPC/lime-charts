d3.csv("/lime-charts/assets/data/tod_quarter_dow_thru_q3.csv").then(function(data) {
    setGraph(data)
})


function setGraph(data) {
    const margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 790 - margin.left - margin.right
    , height = 415 - margin.top - margin.bottom;
    const colors = ["#1b5eb8", "#5eb81b", "#ffca00", "#e9770b", "#0bbae9", "#006729"]
    const parseTime = d3.timeParse("%-I%p");
    const startTime = new Date(1900,0,1).setHours(0)
    const endTime = new Date(1900,0,1).setHours(23)
    
    const svg = d3.select(".chart-2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

    const graph= svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + 40 + ")")
    .attr("class","graph")
    .attr("width", width - 15)
    .attr("height", height - margin.top)
        
    const xScale = d3.scaleTime()
    .domain([startTime, endTime])
    .range([0, width - margin.right])

    const yScale = d3.scaleLinear()
    .domain([0, .1])
    .range([height, 0]);

    graph.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(d3.axisBottom(xScale)
        .tickArguments([18, d3.timeFormat("%-I%p")]))
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
    .attr("transform", "translate(15, 115) rotate(-90)")
    .attr("text-anchor", "end")
    .text("Percentage (%) of Rides")
    .attr("class", "axis-label")
        
    const line = d3.line()
    .x(function(d, i) { return xScale(parseTime(d.tod)); })
    .y(function(d) { return yScale(+d.proportion); })
    
    const tooltip = d3.select('.tooltip').style("display","none")
    const tooltipLine = graph.append('line');

    const weekdayData = [
        {
            "lineName": "Q2 2018",
            "color": colors[0],
            "dayType": "Weekday",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q2_2018_wd
                }
            })
        },
        {
            "lineName": "Q3 2018",
            "color": colors[1],
            "dayType": "Weekday",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q3_2018_wd
                }
            })   
        },
        {
            "lineName": "Q4 2018",
            "color": colors[2],
            "dayType": "Weekday",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q4_2018_wd
                }
            })   
        },
        {
            "lineName": "Q1 2019",
            "color": colors[3],
            "dayType": "Weekday",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q1_2019_wd
                }
            })   
        },
        {
            "lineName": "Q2 2019",
            "color": colors[4],
            "dayType": "Weekday",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q2_2019_wd
                }
            })   
        },
        {
            "lineName": "Q3 2019",
            "color": colors[5],
            "dayType": "Weekday",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q3_2019_wd
                }
            })   
        }
    ]

    const weekendData = [
        {
            "lineName": "Q2 2018",
            "color": colors[0],
            "dayType": "Weekend",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q2_2018_wnd
                }
            })
        },
        {
            "lineName": "Q3 2018",
            "color": colors[1],
            "dayType": "Weekend",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q3_2018_wnd
                }
            })   
        },
        {
            "lineName": "Q4 2018",
            "color": colors[2],
            "dayType": "Weekend",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q4_2018_wnd
                }
            })   
        },
        {
            "lineName": "Q1 2019",
            "color": colors[3],
            "dayType": "Weekend",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q1_2019_wnd
                }
            })   
        },
        {
            "lineName": "Q2 2019",
            "color": colors[4],
            "dayType": "Weekend",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q2_2019_wnd
                }
            })   
        },
        {
            "lineName": "Q3 2019",
            "color": colors[5],
            "dayType": "Weekend",
            "timeData": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q3_2019_wnd
                }
            })   
        }
    ]

    const toggleWeekday = document.querySelector("input[value='weekday']")
    const toggleWeekend = document.querySelector("input[value='weekend']")
    const classNames = ["q2-2018", "q3-2018", "q4-2018", "q1-2019", "q2-2019", "q3-2019"];

    let tipBox = graph.append('rect')
    .attr('width', width - margin.left + 15)
    .attr('height', height)
    .attr('opacity', 0)
    .on('mousemove', function(d){
        let tooltipData;
        if (d3.select('.weekday')._groups[0][0]){
            tooltipData = weekdayData
        } else {
            tooltipData = weekendData
        }
     
        const time = xScale.invert(d3.mouse(tipBox.node())[0]).getHours()
        const tipTime = new Date(1900,0,1).setHours(time)

        tooltipLine.attr("stroke", "black")
        .attr("stroke-width", "2")
        .attr("x1", xScale(tipTime) +.5)
        .attr("x2", xScale(tipTime) + .5)
        .attr("y1", 0)
        .attr("y2", height)

        tooltip.html("<span class='tooltip__title'>" + convertTime(time) + ", " + tooltipData[0].dayType + "</span>")
        .style('display', 'block')
        .style('left', d3.event.pageX + 20)
        .style('top', d3.event.pageY - 20)
        .selectAll()
        .data(tooltipData).enter()
        .append('div')
        .html(function(d){
            const proportion = d.timeData.find(element => element.tod == convertTime(time)).proportion
            return `<svg class='tooltip__circle'><circle r='5' fill=${d.color} transform='translate(5,9)'></cirlce> </svg>`
            + d.lineName + ': '
            + (parseFloat(proportion) * 100).toFixed(2) + "%"
        })

        tooltip.style("left", (event.clientX + 20) + "px")
        tooltip.style("top", (event.clientY) + "px");
    })
    .on('mouseout', function(d){
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
    })

    graph.selectAll(".line")
    .data(weekdayData).enter()
    .append("path")
    .attr('fill', 'none')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2)
    .datum(d => { return d.timeData })
    .attr('d', line)
    .attr('visibility', 'visible')
    .attr("class", function(d, i) { return "line weekday " + classNames[i]});
    
    toggleWeekday.addEventListener("click", function(e) {
        const visibleLines =  Array.from(d3.select(".graph")
        .selectAll(".line")
        ._groups[0])
        const visibilityArray = visibleLines.map(line => line.getAttribute("visibility"))
        
        d3.select(".graph")
        .selectAll(".line")
        .remove()

        graph.selectAll(".line")
        .data(weekdayData).enter()
        .append("path")
        .attr('fill', 'none')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2)
        .datum(d => d.timeData)
        .attr('d', line)
        .attr('visibility', function(d, i) { return visibilityArray[i]})
        .attr("class", function(d, i) { return "line weekday " + classNames[i]});

    })

    toggleWeekend.addEventListener("click", function(e) {
        const visibleLines =  Array.from(d3.select(".graph")
        .selectAll(".line")
        ._groups[0])
        const visibilityArray = visibleLines.map(line => line.getAttribute("visibility"))
        
        d3.select(".graph")
        .selectAll(".line")
        .remove()
        
        graph.selectAll(".line")
        .data(weekendData).enter()
        .append("path")
        .attr('fill', 'none')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2)
        .datum(d => d.timeData)
        .attr('d', line)
        .attr('visibility', function(d, i) { return visibilityArray[i]})
        .attr("class", function(d, i) { return "line weekend " + classNames[i]});
    })
    activateLegend();
}

function convertTime(hour){
    if (hour === 0) { return "12AM"}
    else if (hour < 12 ) { return hour+"AM" }
    else if (hour === 12 ) { return "12PM"}
    else if (hour > 12) { return hour%12+"PM"}
}

function toggleLine(elementClass){
    const selection = document.querySelector(elementClass)
    if (selection.getAttribute("visibility") === "hidden"){
        d3.select(elementClass).attr("visibility", "visible")
    } else {
        d3.select(elementClass).attr("visibility", "hidden")
    }
}

function activateLegend(){
    const legendEl = document.querySelector(".legend__chart2")
    legendEl.addEventListener("click", function(e){
        switch(e.target.classList[0]) {
            case "legend-q2-2018":
                toggleLine('.q2-2018')
                break
            case "legend-q3-2018":
                toggleLine('.q3-2018')
                break
            case "legend-q4-2018":
                toggleLine('.q4-2018')
                break
            case "legend-q1-2019":
                toggleLine('.q1-2019')
                break
            case "legend-q2-2019":
                toggleLine('.q2-2019')
                break
            case "legend-q3-2019":
                toggleLine('.q3-2019')
                break
        }
    })
}