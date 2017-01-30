var width = 900, height = 600;

var svg = d3.select('.diagram')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g');

var div = d3.select("body")
	.append("div")   
	.attr("class", "tooltip")               
	.style("opacity", 0);

var projection = d3.geoMercator().translate([width / 2, height / 2]).scale(2500);
var path = d3.geoPath();

d3.queue()
	.defer(d3.json, './libs/ukraine.geojson')
	.await(ready);

function ready(error, data) {

projection.center(d3.geoCentroid(data));
path.projection(projection);

	var regions = svg.append('g')
		.attr('class', 'regions')
		.selectAll('.region')
		.data(data.features)
		.enter().append('path')
		.attr('class', 'region')
		.attr('d', path)
		.attr('fill', 'rgb(213, 222, 217)')
		.attr('stroke', 'white')
		.on('mouseover', function(d) {
			d3.select(this).attr('fill-opacity', 0.7)
		})
		.on('mouseout', function(d) {
			d3.select(this).attr('fill-opacity', 1)
		});

	var circles = svg.append('g')
		.attr('class', 'circles')
		.selectAll('.circle')
		.data(data.links)
		.enter().append('circle')
		.attr('class', 'circle')
		.attr('cx', function(d) { return path.centroid(data.features[d.source])[0] })
		.attr('cy', function(d) { return path.centroid(data.features[d.source])[1] })
		.attr('r', function(d) { 
			var radius = 0;
			data.links.forEach(function(value) {
				if (d.source === value.source) { radius++ }
			})
			return Math.sqrt(radius) * 4;
		 })
		.attr('fill', 'rgb(247, 122, 82)')
		.attr('opacity', 0.75)
		.on("mouseover", function(d) {      
			div.transition()        
				.duration(200)      
				.style("opacity", .9)    
			div.text(function() {
				return data.features[d.source].properties.name;
			})
			.style("left", (d3.event.pageX) + "px")     
			.style("top", (d3.event.pageY - 28) + "px");    
		})          
		.on("mouseout", function(d) {       
			div.transition()        
				.duration(500)      
				.style("opacity", 0);   
		});
}