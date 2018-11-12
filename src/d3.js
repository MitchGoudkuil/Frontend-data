
d3.json('bookdata.json').then(data => {


  let bookCount = document.querySelector("#bookAmount").textContent = data.length
  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  }
  let dataset = d3.shuffle(data)

  let width = 800,
      height = window.innerHeight - 200

  let objects = data.length

  console.log(objects);

  var max = d3.max(dataset, function(book) { return book.pageCount})

  let scaleX = d3.scaleLinear()
    .domain([0, max])
    .range([0, d3.max(dataset.map(function(book){ return book.pageCount}))])
    // .paddingInner([0.1])
  //  .paddingOuter([0.3])\

  let bandScaleX = d3.scaleBand()
    .domain(dataset.map(function(book){ return book.pageCount}))
    .range([0, width])
    // .paddingInner([0.1])
  //  .paddingOuter([0.3])\
  let scaleY = d3.scaleBand()
    .domain(dataset.map(function(book){ return book.bookTitle}))
    .range([0, height])
    .paddingInner([0.1])
  //  .paddingOuter([0.3])



  const visual = d3.select("#visual")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

  function make_y_gridlines() {
    return d3.axisLeft(scaleY)
        .ticks(5)
      }

  let circles = visual.selectAll("circle")
  .data(dataset)

  visual
    .append('g')
    .attr('class', 'x-axis')
    .call(d3.axisBottom(scaleX))
    .call(d3.axisLeft(scaleY)
          .ticks(5)
          .tickSize(-height)
          .tickFormat("")
      )

      visual
      .append('g')
      .attr('class', 'aljdskf')
      .style('color', '#fff')
      .attr('transform','translate(0,' + height + ')')
      .call(d3.axisBottom(scaleX))

    visual
      .append('g')
      .attr('class', 'xx-axis')
      .call(d3.axisLeft(scaleY))


circles.enter()
  .append("circle")
  .attr("width", bandScaleX.bandwidth())
  .attr("height", scaleY.bandwidth())
  .attr("cx", function(d, i){
    return scaleX(d.pageCount)
  })
  .attr("cy", function(d){
    return scaleY(d.bookTitle) + (scaleY.bandwidth() / 2)
  })
  .attr("r", function(d){
    return d.summaryLength / 10
  })
  .attr("fill", function(d){
    if (d.murderWordCheck === true){
      return "tomato"
    } else if(d.kidnapWordCheck === true) {
      return "#ADD8E6"
    } else {
      return "#8A0707"
    }
  })
  .attr("fill-opacity", 0.8)

visual
  .append('g')
  .selectAll('text')
  .data(dataset)
  .enter()
  .append("text")
       .attr("x", function(d) { return scaleX(d.pageCount) })
       .attr("y", function(d) { return scaleY(d.bookTitle) + scaleY.bandwidth() - 3.2 })
        .text( function (d) { return d.summaryLength })
        .attr("font-size", "10px")
        .attr("fill", "#fff")
        .style("text-anchor", "middle")





}).catch(err => {
  console.log(err);
})
