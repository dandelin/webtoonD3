function drawLinechart(title, stars){

	temp = [];

	for(var i = 1; i < stars.length + 1; i++){
		temp.push({x: i, y: stars[i-1]});
	}

	stars = temp;

	var	margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 1000 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var svg = d3.select('#linechart')
		.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5);
	var yAxis = d3.svg.axis().scale(y).orient('left').ticks(5);

	var valueline = d3.svg.line()
		.x(function(d){ return x(d.x); })
		.y(function(d){ return y(d.y); })
		.interpolate('basis');

	var focus = svg.append('g')
		.attr('class', 'trail')
		.style('display', 'none');

	var bisectEpisode = d3.bisector(function(d) { return d.x; }).left;

	x.domain(d3.extent(stars, function(d){ return d.x; }));
	y.domain(d3.extent(stars, function(d){ return d.y; }));

	svg.append('path')
		.attr('class', 'line')
		.attr('d', valueline(stars))

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis)

	svg.append('g')
		.attr('class', 'y axis')
		.call(yAxis)

	focus.append('line')
		.attr('class', 'x')
		.style('stroke', 'blue')
		.style('stroke-dasharray', '3.3')
		.style('opacity', 0.5)
		.attr('y1', 0)
		.attr('y2', height);

	focus.append('line')
		.attr('class', 'y')
		.style('stroke', 'blue')
		.style('stroke-dasharray', '3.3')
		.style('opacity', 0.5)
		.attr('x1', width)
		.attr('x2', width);

	focus.append('circle')
		.attr('class', 'y')
		.style('fill', 'none')
		.style('stroke', 'blue')
		.attr('r', 4);

    focus.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");
    
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]),
		    i = bisectEpisode(stars, x0, 1),
		    d0 = stars[i - 1],
		    d1 = stars[i],
		    d = x0 - d0.x > d1.x - x0 ? d1 : d0;

		focus.select("circle.y")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")");

		focus.select("text.y1")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		    .text(d.y);

		focus.select("text.y2")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		    .text(d.y);

		focus.select("text.y3")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		    .text(d.x + '화');

		focus.select("text.y4")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		    .text(d.x + '화');

		focus.select(".x")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		               .attr("y2", height - y(d.y));

		focus.select(".y")
		    .attr("transform",
		          "translate(" + width * -1 + "," +
		                         y(d.y) + ")")
		               .attr("x2", width + width);
	}

}

function updateLinechart(title, stars){

	temp = [];

	for(var i = 1; i < stars.length + 1; i++){
		temp.push({x: i, y: stars[i-1]});
	}


	stars = temp;

	var	margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 1000 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5);
	var yAxis = d3.svg.axis().scale(y).orient('left').ticks(5);

	var focus = d3.select('.trail')

	var valueline = d3.svg.line()
		.x(function(d){ return x(d.x); })
		.y(function(d){ return y(d.y); })
		.interpolate('basis');

	var svg = d3.select('#linechart').transition();

	var bisectEpisode = d3.bisector(function(d) { return d.x; }).left;

	x.domain(d3.extent(stars, function(d){ return d.x; }));
	y.domain(d3.extent(stars, function(d){ return d.y; }));

	svg.select('.line')
		.duration(750)
		.attr('d', valueline(stars));
	svg.select('.x.axis')
		.duration(750)
		.call(xAxis);
	svg.select('.y.axis')
		.duration(750)
		.call(yAxis);

	d3.select('rect').on("mousemove", mousemove);

    function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]),
		    i = bisectEpisode(stars, x0, 1),
		    d0 = stars[i - 1],
		    d1 = stars[i],
		    d = x0 - d0.x > d1.x - x0 ? d1 : d0;

		focus.select("circle.y")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")");

		focus.select("text.y1")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		    .text(d.y);

		focus.select("text.y2")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		    .text(d.y);

		focus.select("text.y3")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		    .text(d.x + '화');

		focus.select("text.y4")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		    .text(d.x + '화');

		focus.select(".x")
		    .attr("transform",
		          "translate(" + x(d.x) + "," +
		                         y(d.y) + ")")
		               .attr("y2", height - y(d.y));

		focus.select(".y")
		    .attr("transform",
		          "translate(" + width * -1 + "," +
		                         y(d.y) + ")")
		               .attr("x2", width + width);
	}
}