angular.module('test').
	directive('test',function(){

function link(scope,element){
	var el = element[0];
				  //console.log(el);
				  var width = el.clientWidth;
			       var height = el.clientHeight;
			      var svg = d3.select(el).append('svg').attr("width", width).attr("height",height).append('g')
				        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
				      
				   

			       var min = Math.min(width, height);
			       var color = d3.scale.category10();
					 //var colors=d3.scaleOrdinal(colorbrewer.Set3[12]);
				   var pie = d3.layout.pie().sort(null).value(function(d) { return d.value; });

					var arc = d3.svg.arc()
				      .outerRadius(min / 2 * 0.8)
				      .innerRadius(min / 2 * 0.4);
				      
    scope.$watch('data', function(newVal, oldVal) {
        if (newVal !== oldVal) {

		   svg.selectAll("*").remove();
	       
			
				    svg.selectAll('path').data(pie(scope.data))
				      .enter().append('path')
				        .style('stroke', 'white')
				        .attr('d', arc)
				        .attr('fill', function(d, i){ return color(i) });


				    var legend = d3.select('svg').selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
					  .data(pie(scope.data))
					  .enter().append("g")
					  .attr("transform", function(d,i){
					    return "translate(" + (width-width/6) + "," + (height-35*i-30) + ")"; // place each legend on the right and bump each one down 15 pixels
					  })
					  .attr("class", "legend");   

					legend.append("rect") // make a matching color rect
					  .attr("width", 10)
					  .attr("height", 10)
					  .attr("fill", function(d, i) {
					    return color(i);
					  });

					legend.append("text") // add the text
					  .text(function(d){
					    return d.data.option;
					  })
					  .style("font-size", 12)
					  .attr("y", 21)
					  .attr("x", 0);

			  		}
				});
    

	}

	return {
			scope: { 'data': '=' },
			link:link,
			restrict : 'E'
	}
});