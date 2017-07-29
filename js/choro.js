    var color_na = d3.rgb("#d4d4d4");
    // only works if array.length-1 is between 3 and 9 (d3 color scheme)
    var quantiles = [0, 0.2, 0.4, 0.6, 0.8, 1]
    var init_year = 1970;
    var headline = "Airline Passengers by Country of Flight Origin ";

    // slider
    d3.select("#choroplethmap").insert("p", ":first-child").append("input")
        .attr("type", "range")
        .attr("min", "1970")
        .attr("max", "2016")
        .attr("value", init_year)
        .attr("id", "year");

    d3.select("#choroplethmap").insert("h2", ":first-child").text(headline + init_year);

    // init map container, projection
    var width = 1360, height = 425;     //orig 960
    var svg_map = d3.select("#choroplethmap").insert("svg")
                  .attr("id", "map")
                  .attr("height", height)
                  .attr("width", width);
    var path = d3.geoPath(d3.geoRobinson());

    // init legend container
    svg_map.append("g")
        .attr("class", "legend");
    svg_map.append("g")
        .attr("class", "legend_title")
        .append("text");

    // init bars container
    var margin = {top: 50, right:10, bottom:50, left:80}; //{top: 50, right:10, bottom:50, left:30};
    var svgBarsWidth = 1660 - margin.left - margin.right,
        svgBarsHeight = 200 - margin.top - margin.bottom;

      var x = d3.scaleBand()
                .rangeRound([0, svgBarsWidth])
                .padding(.05);
   var y = d3.scaleLinear().range([svgBarsHeight, 0]);
    
    //comment out this next block to remove bars
//  var svg_bars = d3.select("body")
//      .append("svg")
//        .attr("id", "bars")
//        .attr("width", svgBarsWidth + margin.left + margin.right)
//        .attr("height", svgBarsHeight + margin.top + margin.bottom)
//      .append("g")
//        .attr("class", "bars")
//        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // load data
    d3.json("data/dataChloro.json", function(error, d) {

      if (error) throw error;

      let data_all = d['Passengers'];

      let data = data_all[init_year];
      let color = calcColorScale(data);

      // load map data and render it
      d3.json("world.json", function(error, worldmap) {
        if (error) throw error;

        // init map
        svg_map.append("g")
          .attr("class", "countries")
          .selectAll("path")
          .data(topojson.feature(worldmap, worldmap.objects.world).features)
          .enter().append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .call(fillMap, color, data)
          .append("title")
            .call(setPathTitle, data);

        // init legend
        renderLegend(color, data);
        renderBars(color, data);
      }); // map data

      // was the slider used?
      d3.select("#year").on("input", function() {
          let upd_color = calcColorScale(data_all[this.value]);
          updateMap(upd_color, data_all[this.value]);
          renderLegend(upd_color, data_all[this.value]);
          renderBars(upd_color, data_all[this.value]);
      });

    }); 