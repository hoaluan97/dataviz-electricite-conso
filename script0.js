var keys = ["cuisine", "laverie", "climatiseur", "autre"]

        var width = 700,
            height = 350,
            radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(['#f7b7bf', '#bef9c5', '#c1c3fe', '#b9ecfd']);

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.value; });

        var svg = d3.select("#visual0").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var tooltip = d3.select('visual0').append('div')
            .attr('class', 'hidden tooltip');


        d3.csv("https://raw.githubusercontent.com/hoaluan97/dataviz-electricite-conso/master/avg-consum-by-year.csv", function (data) {

            var updatePie = function (data) {

                var sum = 0;
                for (i = 0; i < data.values.length; i++) {
                  sum += data.values[i].value
                }
              
                // join
                var arcs = svg.selectAll(".arc")
                    .data(pie(data.values));

                // update
                arcs
                    .transition()
                    .duration(1500)
                    .attrTween("d", arcTween);

                // enter
                arcs.enter().append("path")
                    .attr("class", "arc")
                    .style("fill", function (d) { return color(d.value); })
                    .attr("d", arc)
                    //.each(function (d) { this._current = d; })
                    .on('mousemove', function (d) {
                        console.log("la")
                        // on recupere la position de la souris
                        var mousePosition = d3.mouse(this);
                        // on affiche le toolip
                        tooltip.classed('hidden', false)
                            // on positionne le tooltip en fonction 
                            // de la position de la souris
                            .attr('style', 'left:' + (mousePosition[0] + 380) +
                                'px; top:' + (mousePosition[1] + 150) + 'px')
                            // on recupere le nom et la valeur de region
                            .html((d.value*100/sum).toFixed(2) + "%")
                    })
                    .on('mouseout', function () {
                        // on cache le toolip
                        tooltip.classed('hidden', true);
                    });
            }

            var my_data = []
           for (i = 0; i < data.length; i++) {
                var obj = {
                    'year': data[i].year,
                    'values': [
                        {
                            'label': 'Sub_metering_1',
                            'value': +data[i].Sub_metering_1
                        },
                        {
                            'label': 'Sub_metering_2',
                            'value': +data[i].Sub_metering_2
                        },
                        {
                            'label': 'Sub_metering_3',
                            'value': +data[i].Sub_metering_3
                        },
                        {
                            'label': 'Sub_metering_other',
                            'value': +data[i].Sub_metering_other
                        }
                    ]
                }
                my_data.push(obj)
            }

            var size = 30
            svg.selectAll("mydots")
                .data(my_data[0].values)
                .enter()
                .append("rect")
                .attr("x", 200)
                .attr("y", function (d, i) { return 0 + i * (size + 5) })
                .attr("width", size)
                .attr("height", size)
                .style("fill", function (d) { return color(d.value) })

            svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", 200 + size * 1.2)
                .attr("y", function (d, i) {
                    return 0 + i * (size + 5) + (size / 2)
                }) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")



            updatePie(my_data[0])

            var dropdownChange = function () {
                var newCereal = d3.select(this).property('value'),
                    newData = my_data[parseInt(newCereal)];

                updatePie(newData);
            };


            d3.select("select")
                .on("change", dropdownChange);

        })

        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }
    
