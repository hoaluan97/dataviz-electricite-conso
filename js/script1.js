// https://www.d3-graph-gallery.com/graph/area_lineDot.html
				// set the dimensions and margins of the graph
				var margin = {top: 10, right: 30, bottom: 30, left: 60},
					width = 860 - margin.left - margin.right,
					height = 400 - margin.top - margin.bottom;
				
				var dateUpdate = "1/1/2007"
				
				update()
					
				function update(){
				  var dateUpdate = document.getElementById("date").value
				  d3.select("#visual").selectAll("*").remove();
				// append the svg object to the body of the page
					var svg = d3.select("#visual")
				  .append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				  .append("g")
					.attr("transform",
						  "translate(" + margin.left + "," + margin.top + ")");
				//Read the data
				  d3.csv("https://raw.githubusercontent.com/hoaluan97/dataviz-electricite-conso/master/Individual_Household_Electric_Power_Consumption.csv",
			
					// When reading the csv, I must format variables:
					function(d){
			
					  if(d.Date==dateUpdate){
						return { Date : d3.timeParse("%d/%m/%Y")(d.Date),
								Time : d3.timeParse("%H:%M:%S")(d.Time),
								date : d3.timeParse("%d/%m/%Y %H:%M:%S")(d.Date +" "+ d.Time),
								Global_active_power : d.Global_active_power,
								Sub_metering_1 : d.Sub_metering_1,
								Sub_metering_2 : d.Sub_metering_2,
								Sub_metering_3 : d.Sub_metering_3,
								Sub_metering_other : d.Sub_metering_other }
						}
					},
			
					// Now I can use this dataset:
					function(data) {
					  // Add X axis --> it is a date format
					  console.log(data.length)
					  // This allows to find the closest X index of the mouse:
							  var bisect = d3.bisector(function(d) { return d.date; }).left;
					
						var focus = svg.append('g')
						.append('circle')
						.style("fill", "#47ff6f")
						.attr("stroke", "black")
						.attr('r', 8.5)
						.style("opacity", 0)
					  
					  var focusText = svg.append('g')
						  .append('text')
						.style("opacity", 0)
						.attr("text-anchor", "left")
						.attr("alignment-baseline", "middle")
					  
					  
					  
					  
					  var x = d3.scaleTime()
						.domain(d3.extent(data, function(d) { return d.date; }))
						.range([ 0, width ]);
			
					  xAxis = svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));
			
					  // Add Y axis
					  var y = d3.scaleLinear()
						.domain([0, d3.max(data, function(d) { return +d.Sub_metering_other; })])
						.range([ height, 0 ]);
					  yAxis = svg.append("g")
						.call(d3.axisLeft(y));
			
					  // Add a clipPath: everything out of this area won't be drawn.
					  var clip = svg.append("defs").append("svg:clipPath")
						  .attr("id", "clip")
						  .append("svg:rect")
						  .attr("width", width )
						  .attr("height", height )
						  .attr("x", 0)
						  .attr("y", 0)
								.on('mouseover', mouseover)
						  .on('mousemove', mousemove)
						  .on('mouseout', mouseout);
			
					  // Add brushing
					  var brush = d3.brushX()                
						  .extent( [ [0,0], [width,height] ] ) 
						  .on("end", updateChart)
			
					  
					  
					  // Create the line variable: where both the line and the brush take place
					  var line = svg.append('g')
						.attr("clip-path", "url(#clip)")
						  .on('mouseover', mouseover)
						.on('mousemove', mousemove)
						.on('mouseout', mouseout);
								
					  // Add the line
					  var areaGenerator = d3.area()
					  .x(function(d) { return x(d.date) })
					  .y0(y(0))
					  .y1(function(d) { return y(d.Sub_metering_other) })
					  line.append("path")
						.datum(data)
						.attr("class", "line")/*
						.attr("fill", "none")
						.attr("stroke", "steelblue")
						.attr("stroke-width", 1.5)
						.attr("d", d3.line()
						  .x(function(d, i) { return x(d.date) })
						  .y(function(d) { return y(d.Sub_metering_other) })
						  )*/
						  .attr("fill", "#23c4fe")
						.attr("fill-opacity", .3)
						.attr("stroke", "#006c93")
						.attr("stroke-width", 2)
						  
						  .attr("d", areaGenerator)
					  
								
					  
					  
					  line.selectAll("myCircles")
					  .data(data)
					  .enter()
					  .append("circle")
					  .attr("class", "circle")
					  .attr("fill", "red")
					  .attr("stroke", "none")
					  .attr("cx", function(d) { return x(d.date) })
					  .attr("cy", function(d) { return y(d.Sub_metering_other) })
					  .attr("r", 1)
			
					  // Add the brushing
					  line
						.append("g")
						  .attr("class", "brush")
						  .call(brush);
			
					  // A function that set idleTimeOut to null
					  var idleTimeout
					  function idled() { idleTimeout = null; }
					
						  // What happens when the mouse move -> show the annotations at the right positions.
					  function mouseover() {
						focus.style("opacity", 1)
						focusText.style("opacity",1)
					  }
			
					  function mousemove() {
						// recover coordinate we need
						var x0 = x.invert(d3.mouse(this)[0]);
						var i = bisect(data, x0, 1);
						selectedData = data[i]
						focus
						  .attr("cx", x(selectedData.date))
						  .attr("cy", y(selectedData.Sub_metering_other))
						focusText
						  .html("x:" + d3.timeFormat("%H:%M:%S")(selectedData.Time )+ "  -  " + "y:" + selectedData.Sub_metering_other)
						  .attr("x", x(selectedData.date)+15)
						  .attr("y", y(selectedData.Sub_metering_other))
						}
					  function mouseout() {
						focus.style("opacity", 0)
						focusText.style("opacity", 0)
					  }
			
					  // A function that update the chart for given boundaries
					  function updateChart() {
						
						line.selectAll('.circle').remove()
									console.log(xAxis)
						// What are the selected boundaries?
						extent = d3.event.selection
			
						// If no selection, back to initial coordinate. Otherwise, update X axis domain
						if(!extent){
						  if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
						  x.domain([ 4,8])
						}else{
						  x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
						  line.select(".brush").call(brush.move, null) 
						}
			
						// Update axis and line position
						xAxis.transition().duration(1000).call(d3.axisBottom(x))
						line.select('.line')
							.transition()
							.duration(1000)
							.attr("d", areaGenerator)
						line.selectAll("myCircles")
						  .data(data)
						  .enter()
						  .append("circle")
						  .attr("class", "circle")
						  .attr("fill", "red")
						  .attr("stroke", "none")
						  .attr("cx", function(d) { return x(d.date) })
						  .attr("cy", function(d) { return y(d.Sub_metering_other) })
						  .attr("r", 2)
					  }
			
					  // If user double click, reinitialize the chart
					  svg.on("dblclick",function(){
						x.domain(d3.extent(data, function(d) { return d.date; }))
						xAxis.transition().call(d3.axisBottom(x))
						line.select('.line')
						  .transition()
						  .attr("d", areaGenerator)
						line.selectAll("myCircles")
						  .data(data)
						  .enter()
						  .append("circle")
						  .attr("class", "circle")
						  .attr("fill", "red")
						  .attr("stroke", "none")
						  .attr("cx", function(d) { return x(d.date) })
						  .attr("cy", function(d) { return y(d.Sub_metering_other) })
						  .attr("r", 2)
						
					  });
			
				  })
				}
			