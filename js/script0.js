
// Define margins
var margin = { top: 20, right: 80, bottom: 30, left: 50 },
  width =
    parseInt(d3.select("#visual0").style("width")) - margin.left - margin.right,
  height =
    parseInt(d3.select("#visual0").style("height")) - margin.top - margin.bottom;
  height = 360

// Define date parser
var parseYear = d3.timeParse("%Y");

// Define scales
var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal().range(d3.schemeCategory10);

// Define axes
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

// Define lines
var line = d3
  .line()
  .curve(d3.curveMonotoneX)
  .x(function(d) {
    return xScale(d["year"]);
  })
  .y(function(d) {
    return yScale(d["value"]);
  });

// Define svg canvas
var svg = d3
  .select("#visual0")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read in data
d3.csv("https://raw.githubusercontent.com/hoaluan97/dataviz-electricite-conso/master/avg-consum-by-year.csv", function(data) {

  // Set the color domain equal to the three product categories
  var categories = d3.keys(data[0]).filter(function(key) {
    return key !== "year" && key !== "Global_active_power";
  });
  color.domain(categories);
   var tooltip = d3.select('body').append('div')
            .attr('class', 'hiddenvisu0 tooltip0');
  

  // console.log(JSON.stringify(data, null, 2)) // to view the structure

  // Format the data field
  data.forEach(function(d) {
    d["year"] = parseYear(d["year"]);
  });

  // Reformat data to make it more copasetic for d3
  // data = An array of objects
  // concentrations = An array of three objects, each of which contains an array of objects
  
  var concentrations = categories.map(function(category) {
    return {
      category: category,
      values: data.map(function(d) {
        return { year: d["year"], value: +d[category] };
      })
    };
  });
  // console.log(JSON.stringify(concentrations, null, 2)) // to view the structure

  // Set the domain of the axes
  xScale.domain(
    d3.extent(data, function(d) {
      return d["year"];
    })
  ); 

  yScale.domain([0, 22]);

  // Place the axes on the chart
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("dx", ".71em")
    .style("text-anchor", "beginning")
    .text("Watt-hour");

  var products = svg
    .selectAll(".category")
    .data(concentrations)
    .enter()
    .append("g")
    .attr("class", "category");

  products
    .append("path")
    .attr("class", "lineLuan")
    .attr("d", function(d) { 
      return line(d.values);
    })
    .style("stroke", function(d) {
      return color(d.category);
    });

 
  
  // console.log(JSON.stringify(d3.values(concentrations), null, 2)) // to view the structure
  // console.log(d3.values(concentrations)); // to view the structure
  // console.log(concentrations);
  // console.log(concentrations.map(function()))
  var lineLegend = svg.selectAll(".lineLegend").data(categories)
    .enter().append("g")
    .attr("class","lineLegend")
    .attr("transform", function (d,i) {
            return "translate(" + 750 + "," + (i*20)+")";
        });

salles = ["Cuisine", "Laverie", "Climatiseur", "Autre"]
lineLegend.append("text").text(function (d, i) {return salles[i];})
    .attr("transform", "translate(15,9)"); //align texts with boxes


lineLegend.append("rect")
    .attr("fill", function (d, i) {return color(d); })
    .attr("width", 10).attr("height", 10);
  
  products.selectAll("circle")
    .data(function(d){return d.values})
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.value); })
    .style("fill", function(d,i,j) { return color(0); })
  .on('mousemove', function (d) {
                        // on recupere la position de la souris
                        var mousePosition = d3.mouse(this);
                        // on affiche le toolip
                        tooltip.classed('hiddenvisu0', false)
                            // on positionne le tooltip en fonction 
                            // de la position de la souris
                            .attr('style', 'left:' + (mousePosition[0] + 40) +
                                'px; top:' + (mousePosition[1] - 20) + 'px')
                            // on recupere le nom et la valeur de region
                            .html((d.value).toFixed(2) + " Wh")
                    })
                    .on('mouseout', function () {
                        // on cache le toolip
                        tooltip.classed('hiddenvisu0', true);
                    });
});
   
