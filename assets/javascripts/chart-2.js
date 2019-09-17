d3.csv("/assets/data/tod_quarter_dow_copy.csv").then(function(data) {  
    setGraph(data)
})


function setGraph(data) {
    var margin = {top: 50, right: 75, bottom: 50, left: 75}
    , width = 700 - margin.left - margin.right
    , height = 425 - margin.top - margin.bottom;
    const colors = ["#1b5eb8", "#5eb81b", "#ffca00", "#e9770b", "#0bbae9"]

    var parseTime = d3.timeParse("%-I%p");

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
        .attr("transform", "translate(15, 100) rotate(-90)")
        .attr("text-anchor", "end")
        .text("Percentage (%) of Rides")
        .attr("class", "axis-label")
        
    svg.append("text")
        .attr("fill", "#000")
        .attr("transform", `translate(325, ${height + margin.top +25})`)
        .attr("text-anchor", "end")
        .text("Time")
        .attr("class", "axis-label")
        
    const line = d3.line()
        .x(function(d, i) { return xScale(parseTime(d.tod)); })
        .y(function(d) { return yScale(+d.proportion); })
    
        const tooltip = d3.select('.tooltip');
        const tooltipLine = graph.append('line');

    const weekdayData = [
        {
            "linetype": "proportion_q2_2018_wd",
            "color": "#1b5eb8",
            "timedata": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q2_2018_wd
                }
            })
        },
        {
            "linetype": "proportion_q3_2018_wd",
            "color": "#5eb81b",
            "timedata": data.map(tod => {
                return {
                    "tod": tod.tod,
                    "proportion": tod.proportion_q3_2018_wd
                }
            })   
        }
        // data.map(function(d) {
        //     return {"x": parseTime(d.tod),
        //             "y": d.proportion_q3_2018_wd,
        //             "tooltipData": d,
        //             "color": colors[1] } }),
        // data.map(function(d) {
        //     return {"x": parseTime(d.tod),
        //             "y": d.proportion_q4_2018_wd,
        //             "color": colors[2] } }),
        // data.map(function(d) {
        //     return {"x": parseTime(d.tod),
        //             "y": d.proportion_q1_2019_wd,
        //             "color": colors[3] } }),
        // data.map(function(d) {
        //     return {"x": parseTime(d.tod),
        //             "y": d.proportion_q2_2019_wd,
        //             "color": colors[4] } })
        
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

    let tipBox = graph.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0)
    .on('mousemove', function(d){
        const time = xScale.invert(d3.mouse(tipBox.node())[0]).getHours()
        let tipTime = new Date(1900,0,1).setHours(time)

        tooltipLine.attr("stroke", "black")
        .attr("x1", xScale(tipTime) +.5)
        .attr("x2", xScale(tipTime) + .5)
        .attr("y1", 0)
        .attr("y2", height - margin.top)

        tooltip.html(convertTime(time))
        .style('display', 'block')
        .style('left', d3.event.pageX + 20)
        .style('top', d3.event.pageY - 20)
        .selectAll()
        .data(weekdayData).enter()
        .append('div')
        .style('color', d => d.color)
        .html(function(d){
            const proportion = d.timedata.find(element => element.tod == convertTime(time)).proportion
            return d.linetype + ': ' + (parseFloat(proportion) * 100).toFixed(2) + "%"
        })

        tooltip.style("left", (event.clientX + 20) + "px")
        tooltip.style("top", (event.clientY) + "px");
    })

    graph.selectAll(".line")
    .data(weekdayData).enter()
    .append("path")
    .attr('fill', 'none')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2)
    .datum(d => d.timedata)
    .attr('d', line);

            

    
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
            .attr("stroke-width", "2.5")
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


function convertTime(hour){
    if (hour === 0) { return "12AM"}
    else if (hour < 12 ) { return hour+"AM" }
    else if (hour === 12 ) { return "12PM"}
    else if (hour > 12) { return hour%12+"PM"}
}