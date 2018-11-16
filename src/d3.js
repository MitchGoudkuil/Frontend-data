
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.amountBooks); });


// de update functie
function draw(data, country) {

  var data = data[country];

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.year; }))
  y.domain([0, 50])

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .ticks(data.length - 1)
      .tickFormat(d3.format('y')))

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
  }

const data = {
  "mickey": [
    {
      'year': 2000,
      'amountBooks': "10"
    },
    {
      'year': 2001,
      'amountBooks': "44"
    },
    {
      'year': 2002,
      'amountBooks': "3"
    },
    {
      'year': 2003,
      'amountBooks': "10"
    },
    {
      'year': 2004,
      'amountBooks': "9"
    }
  ],
  "donald": [
    {
      'year': 2000,
      'amountBooks': "3"
    },
    {
      'year': 2001,
      'amountBooks': "20"
    },
    {
      'year': 2002,
      'amountBooks': "33"
    },
    {
      'year': 2003,
      'amountBooks': "5"
    },
    {
      'year': 2004,
      'amountBooks': "19"
    }
  ]
  }

  draw(data, "mickey");
  draw(data, "donald");
