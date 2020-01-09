// https://www.d3-graph-gallery.com/graph/area_lineDot.html
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 1060 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    var dateUpdate = "1/1/2007"
    d3.select("#myCheckbox7").on("change",check);
    d3.select("#myCheckbox8").on("change",check);
    d3.select("#myCheckbox9").on("change",check);
    var checkline1 = 0
    var checkline2 = 0
    var checkline3 = 1
    function check(){
      if(d3.select("#myCheckbox7").property("checked")){
					checkline1 = 1
				} else {
					checkline1 = 0
				}
      if(d3.select("#myCheckbox8").property("checked")){
					checkline2 = 1
				} else {
					checkline2 = 0
				}	
      if(d3.select("#myCheckbox9").property("checked")){
					checkline3 = 1
				} else {
					checkline3 = 0
				}	
      update4()
    }
    
    update4()
		
    function update4(){
      var dateUpdate = document.getElementById("date4").value
      d3.select("#visual4").selectAll("*").remove();
    // append the svg object to the body of the page
    	var svg = d3.select("#visual4")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    //Read the data
      d3.csv("https://raw.githubusercontent.com/hoaluan97/dataviz-electricite-conso/master/Sum_Mean_12Mois_FilterYear.csv",

        // When reading the csv, I must format variables:
        function(d){
              if(d.Year==dateUpdate.split("/")[2]){
                return {date : d3.timeParse("%m/%Y")(d.Month +
                                                       "/" + d.Year),
                        Global_active_power : d.Global_active_power_Sum,
                        Sub_metering_1 : d.Sub_metering_1_Mean,
                        Sub_metering_2 : d.Sub_metering_2_Mean,
                        Sub_metering_3 : d.Sub_metering_3_Mean,
                        Sub_metering_other : d.Sub_metering_other_Sum,}
                }
            },

        // Now I can use this dataset:
        function(data) {
          // Add X axis --> it is a date format
          console.log(data)
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
          
          var rayon = 1.5
          
          
          var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);

          xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

          // Add Y axis
          var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +Math.max(d.Sub_metering_1,
                                     d.Sub_metering_2,
                                     d.Sub_metering_3); })])
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
          
          var areaGenerator1 = d3.area()
          .x(function(d) { return x(d.date) })
          .y0(y(0))
          .y1(function(d) { return y(d.Sub_metering_1) })
          var areaGenerator2 = d3.area()
          .x(function(d) { return x(d.date) })
          .y0(y(0))
          .y1(function(d) { return y(d.Sub_metering_2) })
          var areaGenerator3 = d3.area()
          .x(function(d) { return x(d.date) })
          .y0(y(0))
          .y1(function(d) { return y(d.Sub_metering_3) })
          
          if(checkline1){
            line.append("path")
              .datum(data)
              .attr("class", "line1")
              .attr("fill", "#fd243e")
              .attr("fill-opacity", .3)
              .attr("stroke", "#006c93")
              .attr("stroke-width", 2)
              .attr("d", areaGenerator1)

            line.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle1")
            .attr("fill", "red")
            .attr("stroke", "none")
            .attr("cx", function(d) { return x(d.date) })
            .attr("cy", function(d) { return y(d.Sub_metering_1) })
            .attr("r", rayon)
          }
          if(checkline2){
            line.append("path")
              .datum(data)
              .attr("class", "line2")
              .attr("fill", "#24fd3a")
              .attr("fill-opacity", .3)
              .attr("stroke", "#006c93")
              .attr("stroke-width", 2)
              .attr("d", areaGenerator2)

            line.selectAll("myCircles")
              .data(data)
              .enter()
              .append("circle")
              .attr("class", "circle2")
              .attr("fill", "green")
              .attr("stroke", "none")
              .attr("cx", function(d) { return x(d.date) })
              .attr("cy", function(d) { return y(d.Sub_metering_2) })
              .attr("r", rayon)
          }
          
          if(checkline3){
            line.append("path")
              .datum(data)
              .attr("class", "line3")
              .attr("fill", "#2453fd")
              .attr("fill-opacity", .3)
              .attr("stroke", "#006c93")
              .attr("stroke-width", 2)
              .attr("d", areaGenerator3)

            line.selectAll("myCircles")
              .data(data)
              .enter()
              .append("circle")
              .attr("class", "circle3")
              .attr("fill", "blue")
              .attr("stroke", "none")
              .attr("cx", function(d) { return x(d.date) })
              .attr("cy", function(d) { return y(d.Sub_metering_3) })
              .attr("r", rayon)
          }

          // Add the brushing

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
              .attr("cy", y(Math.max(selectedData.Sub_metering_1,
                                     selectedData.Sub_metering_2,
                                     selectedData.Sub_metering_3)))
            focusText
              .html("x:" + d3.timeFormat("%d/%m")(selectedData.date )+ "  -  " + "y:" + Math.max(selectedData.Sub_metering_1,
                                     selectedData.Sub_metering_2,
                                     selectedData.Sub_metering_3))
              .attr("x", x(selectedData.date)+15)
              .attr("y", y(Math.max(selectedData.Sub_metering_1,
                                     selectedData.Sub_metering_2,
                                     selectedData.Sub_metering_3)))
            }
          function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
          }
        
        	d3.csv("https://raw.githubusercontent.com/hoaluan97/dataviz-electricite-conso/master/Mean_12Mois_AllYear.csv",
                 function(d){

                return {date2 : d3.timeParse("%m/%Y")(d.Month +
                                                       "/" + dateUpdate.split("/")[2]),
                        Global_active_power_Mean : d.Global_active_power_Mean,
                        Sub_metering_1_Mean : d.Sub_metering_1_Mean,
                        Sub_metering_2_Mean : d.Sub_metering_2_Mean,
                        Sub_metering_3_Mean : d.Sub_metering_3_Mean,
                        Sub_metering_other_Mean : d.Sub_metering_other_Mean,}
                
            },function(data2){
            if(checkline1){
                line.append("path")
                  .datum(data2)
                  .attr("class", "lineMean1")
                  .attr("fill", "none")
                  .attr("stroke", "FireBrick ")
                  .attr("stroke-width", 1)
                  .attr("d", d3.line()
                       .x(function(d,i){return x(d.date2)})
                       .y(function(d,i){return y(d.Sub_metering_1_Mean)}))
              }
            	if(checkline2){
              line.append("path")
                .datum(data2)
                .attr("class", "lineMean2")
                .attr("fill", "none")
                .attr("stroke", "ForestGreen ")
                .attr("stroke-width", 1)
                .attr("d", d3.line()
                     .x(function(d,i){return x(d.date2)})
                     .y(function(d,i){return y(d.Sub_metering_2_Mean)}))
              }
              if(checkline3){
              line.append("path")
                .datum(data2)
                .attr("class", "lineMean3")
                .attr("fill", "none")
                .attr("stroke", "mediumblue ")
                .attr("stroke-width", 1)
                .attr("d", d3.line()
                     .x(function(d,i){return x(d.date2)})
                     .y(function(d,i){return y(d.Sub_metering_3_Mean)}))
              }
          })
        
        	
          // A function that update the chart for given boundaries
          function updateChart() {
            
            line.selectAll('.circle1').remove()
            line.selectAll('.circle2').remove()
            line.selectAll('.circle3').remove()
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
            if(checkline1){
              line.select('.line1')
                  .transition()
                  .duration(1000)
                  .attr("d", areaGenerator1)

              line.select('.line1')
                  .transition()
                  .duration(1000)
                  .attr("d", d3.line()
                       .x(function(d,i){return x(d.Time2)})
                       .y(function(d,i){return y(d.Sub_metering_1)}))
              
              line.selectAll("myCircles")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circle1")
                .attr("fill", "red")
                .attr("stroke", "none")
                .attr("cx", function(d) { return x(d.date) })
                .attr("cy", function(d) { return y(d.Sub_metering_1) })
                .attr("r", 2)
            }
            if(checkline2){
              line.select('.line2')
                  .transition()
                  .duration(1000)
                  .attr("d", areaGenerator2)
              line.select('.line2')
                  .transition()
                  .duration(1000)
                  .attr("d", d3.line()
                       .x(function(d,i){return x(d.Time2)})
                       .y(function(d,i){return y(d.Sub_metering_2)}))
              line.selectAll("myCircles")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circle2")
                .attr("fill", "green")
                .attr("stroke", "none")
                .attr("cx", function(d) { return x(d.date) })
                .attr("cy", function(d) { return y(d.Sub_metering_2) })
                .attr("r", rayon)
             }
            
            if(checkline3){
              line.select('.line3')
                  .transition()
                  .duration(1000)
                  .attr("d", areaGenerator3)

              line.select('.line3')
                  .transition()
                  .duration(1000)
                  .attr("d", d3.line()
                       .x(function(d,i){return x(d.Time2)})
                       .y(function(d,i){return y(d.Sub_metering_3)}))
              line.selectAll("myCircles")
              .data(data)
              .enter()
              .append("circle")
              .attr("class", "circle3")
              .attr("fill", "blue")
              .attr("stroke", "none")
              .attr("cx", function(d) { return x(d.date) })
              .attr("cy", function(d) { return y(d.Sub_metering_3) })
              .attr("r", 2)
            }
            
          }

      })
      
      
      
    }
