var width = 960, height = 500;
var svg = d3.select("#passengersoilgraph").append("svg"),
    margin = {top: 30, right: 80, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
var parseTime = d3.timeParse("%Y")
    bisectDate = d3.bisector(function(d) { return d.year; }).left;
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
//right hand y axis for passengers
var y2 = d3.scaleLinear().range([height, 0]);
var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });
    //second line
var line2 = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y2(d.passengers); });    
 //   
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.json("data/data1.json", function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
      d.year = parseTime(d.year);
      d.value = +d.value;
      //passengers data
      d.passengers = +d.passengers;
    });
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([d3.min(data, function(d) { return d.value; }) / 1.005, d3.max(data, function(d) { return d.value; }) * 1.005]);
    // scale the range of the passengers data
    y2.domain([d3.min(data, function(d) { return d.passengers; }) / 1.005, d3.max(data, function(d) { return d.passengers; }) * 1.005]);
    
  //title 
    g.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "end")  
        .style("font-size", "20px") 
        .style("text-decoration", "bold")  
        .text("Light-Sweet Crude Prices and Global Passengers");
    //x axis format and label
 g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(15))
        
        //x axis title
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(0)")
        .attr("x", 10)
        .attr("dx", "79.91em")
        .style("text-anchor", "right")
        .attr("fill", "#5D6971")
        .text("Year");
        
 // y axis and format label
  g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(8).tickFormat(function(d) { return parseInt(d); })) 
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".91em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Avg. oil Price ($/barrel)"); 
        
g.append("g")
      .attr("class", "axis axis--y2")
      .attr("transform", "translate(" + width + ",0)")
      .call(d3.axisRight(y2).ticks(12).tickFormat(function(d) { return parseInt(d); })) 
    .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-.91em")
      .style("text-anchor", "end")
      .attr("fill", "#5D6971")
      .text("Global Passengers (Billions)"); 
 
    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);  
    g.append("path")
        .datum(data)
        .attr("class", "line2")
        .attr("d", line2);
    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");
    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);
    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);
    focus.append("circle")
        .attr("r", 7.5);
    focus.append("text")
        .attr("x", 15)
      	.attr("dy", ".31em");
    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", "initial"); }) // "initial" gives the default display attribute
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);
    //legend
    
var color = d3.scaleLinear()
  .range(["#247f66", "#6c247f"]);
var legendText = ["Oil Price","Global Passengers"];
                
var legend = d3.select("#passengersoilgraph").append("svg")
      			.attr("class", "legend")
     			.attr("width", 300)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);
  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
 
   
     
    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.year > d1.year - x0 ? d1 : d0;
      var value_y = y(d.value);
      var passengers_y = y2(d.passengers);
      var mouse_y = d3.mouse(this)[1];
      var vert_offset = 0.0;
      var display_text = "";
      if (Math.abs(mouse_y-value_y) < Math.abs(mouse_y-passengers_y)) {
        vert_offset = value_y;
        display_text = "" + d.value;
      }
      else {
        vert_offset = passengers_y;
        display_text = "" + d.passengers;
      }
      focus.attr("transform", "translate(" + x(d.year) + "," + vert_offset + ")");
      focus.select("text").text(function() { return display_text; });
      focus.select(".x-hover-line").attr("y2", height - vert_offset);
      focus.select(".y-hover-line").attr("x2", width + width);
      
    }
});