function drawLinechart(title, stars){

	temp = [];

	for(var i = 1; i < stars.length + 1; i++){
		temp.push({x: i, y: stars[i-1]});
	}

	stars = temp;

	var	margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5);
	var yAxis = d3.svg.axis().scale(y).orient('left').ticks(5);

	var valueline = d3.svg.line()
		.x(function(d){ return x(d.x); })
		.y(function(d){ return y(d.y); })
		.interpolate('basis');

	var svg = d3.select('#linechart')
		.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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

}

function updateLinechart(title, stars){

	temp = [];

	for(var i = 1; i < stars.length + 1; i++){
		temp.push({x: i, y: stars[i-1]});
	}


	stars = temp;

	var	margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5);
	var yAxis = d3.svg.axis().scale(y).orient('left').ticks(5);

	var valueline = d3.svg.line()
		.x(function(d){ return x(d.x); })
		.y(function(d){ return y(d.y); })
		.interpolate('basis');

	x.domain(d3.extent(stars, function(d){ return d.x; }));
	y.domain(d3.extent(stars, function(d){ return d.y; }));

	var svg = d3.select('#linechart').transition();

	svg.select('.line')
		.duration(750)
		.attr('d', valueline(stars));
	svg.select('.x.axis')
		.duration(750)
		.call(xAxis);
	svg.select('.y.axis')
		.duration(750)
		.call(yAxis);
}