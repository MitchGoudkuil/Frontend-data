
d3.json('newdata.json').then(data => {

const possibleAnswers = ['mickey', 'donald', 'peter', 'winnie', 'frozen']

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


const mickeyImg = document.querySelector("#mickey-image")
const donaldImg = document.querySelector("#donald-image")
const peterImg = document.querySelector("#peter-image")
const winnieImg = document.querySelector("#winnie-image")
const frozenImg = document.querySelector("#frozen-image")


//checkboxes

const mickeyCheck = document.querySelector("#mickey").addEventListener("change", function() {
    mickeyGroup.classList.toggle("noshow");
    mickeyImg.classList.toggle("noshowimg");
});
const donaldCheck = document.querySelector("#donald").addEventListener("change", function() {
    donaldGroup.classList.toggle("noshow")
    donaldImg.classList.toggle("noshowimg");
});
const peterCheck = document.querySelector("#peter").addEventListener("change", function() {
    peterGroup.classList.toggle("noshow")
    peterImg.classList.toggle("noshowimg");
});
const winnieCheck = document.querySelector("#winnie").addEventListener("change", function() {
    winnieGroup.classList.toggle("noshow")
    winnieImg.classList.toggle("noshowimg");
});
const frozenCheck = document.querySelector("#frozen").addEventListener("change", function() {
    frozenGroup.classList.toggle("noshow")
    frozenImg.classList.toggle("noshowimg");
});





const newData = data.filter(book => {
  possibleAnswers.forEach(name => {
    if(book.bookTitle.toLowerCase().includes(name)) {
       book.disneyCharacter = name
     }
  })
  if (book.disneyCharacter) {
    return book
  }
})

// ophalen van namen van characters
const organizedByCharacter = d3.nest().key(function(book) { return book.disneyCharacter }).entries(newData);

const goodData = organizedByCharacter.map(character => {
  const byYear = d3.nest()
    .key(function(book) {
      return book.itemYear
    })
    .entries(character.values)
  return {
    name: character.key,
    years: byYear,
  }
})

console.log(goodData);

let yearCount = goodData.map(d => {
  return d.years.length
})

const maxYearCount = d3.max(yearCount, function(d) { return d } );
const uniqueYears = d3.map(newData, d => d.itemYear).keys().sort(function(a, b){return a - b})
const domainYears = d3.extent(newData, function(d) { return d.itemYear });

let scaleX = d3.scaleLinear()
  .domain(domainYears)
  .range([0, width])

let scaleY = d3.scaleLinear()
  .domain([0, d3.max(yearCount)])
  .range([height, 0 ])

var svg = d3.select("#visual").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltipDiv = d3.select("#visual").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Scale the range of the data
x.domain(d3.extent(uniqueYears, function(d) { return d; }))
y.domain([0, maxYearCount])

 // Add the x Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
    .ticks(uniqueYears.length)
    .tickFormat(d3.format('y'))
    )

// Add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y))

    update(goodData)


// de update functie
function update(data) {

    const groups = svg
    .selectAll('.group')
    .data(data)

    groups
    .enter()
    .append('g')
    .attr('class', d => {
      return 'group ' + d.name
    })

    const circles = d3.selectAll('.group')
      .selectAll('circle')
      .data(d => d.years.map(book => {
        return book
      }))

    circles.enter()
    .append('circle')
    .attr("class", "item")
    .attr("cx", function(d){
      return scaleX(d.key)
    })
    .attr("cy", function(d){
      return scaleY(d.values.length)
    })
    .attr("r", 10)
    .on("mouseover", function(d) {
      tooltipDiv.transition()
        .duration(200)
        .style("opacity", .9);
      tooltipDiv
        .html(d.values.length + " boeken")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 10) + "px");
      })
    .on("mouseout", function(d) {
      tooltipDiv.transition()
        .duration(500)
        .style("opacity", 0);
    });

}


mickeyGroup = document.querySelector(".mickey");
donaldGroup = document.querySelector(".donald")
winnieGroup = document.querySelector(".winnie")
peterGroup = document.querySelector(".peter")
frozenGroup = document.querySelector(".frozen")







}).catch(err => {
  // console.log(err);
})
