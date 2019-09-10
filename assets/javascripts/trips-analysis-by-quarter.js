d3.csv("/assets/data/tod_quarter_dow.csv").then(function(data) {
    setGraph(data)
})


function setGraph(data){
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 860 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const x = d3.scaleLinear().range([0, width])
    const y = d3.scaleLinear().range([height, 0]);
    
    x.domain([0, 23]);
    y.domain([0, .1]);



    const weekday = [
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q2_2018_wd); }),
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q3_2018_wd); }),
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q4_2018_wd); }),
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q1_2019_wd); }),
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q2_2019_wd) })
    ]
    const weekend = [
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q2_2018_wnd); }),
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q3_2018_wnd); }),
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q4_2018_wnd); }),  
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q1_2019_wnd); }),        
        d3.line()
            .x(function(d) { return x(+d.tod); })
            .y(function(d) { return y(+d.proportion_q2_2019_wnd); })
    ]

    let i = 0
    const colors = ["#3B67BC", "#EA722B", "#A7A7A7", "#FFB801", "#5191CF"]

    const svg = d3.select(".trips-analysis-by-quarter")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    weekday.forEach(line => {
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d",line)
            .attr("fill","none")
            .attr("stroke",colors[i++])
            .attr("stroke-width", "2")
    })


    const xAxis = d3.axisBottom(x)
    .ticks(23)

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

    svg.append("g")
        .call(d3.axisLeft(y));
}
