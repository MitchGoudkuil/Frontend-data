d3.json("newdata.json")
  .then(data => {
    // console.log(data);
    const possibleAnswers = ["mickey", "donald", "peter", "winnie", "frozen"];

    var margin = { top: 20, right: 20, bottom: 50, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 540 - margin.top - margin.bottom;

    let currentAxis = "years";

    //checkboxes code by me
    const mickeyImg = document.querySelector("#mickey-image");
    const donaldImg = document.querySelector("#donald-image");
    const peterImg = document.querySelector("#peter-image");
    const winnieImg = document.querySelector("#winnie-image");
    const frozenImg = document.querySelector("#frozen-image");


    const mickeyCheck = document
      .querySelector("#mickey")
      .addEventListener("change", function() {
        mickeyGroup.classList.toggle("noshow");
        mickeyImg.classList.toggle("noshowimg");
      });
    const donaldCheck = document
      .querySelector("#donald")
      .addEventListener("change", function() {
        donaldGroup.classList.toggle("noshow");
        donaldImg.classList.toggle("noshowimg");
      });
    const peterCheck = document
      .querySelector("#peter")
      .addEventListener("change", function() {
        peterGroup.classList.toggle("noshow");
        peterImg.classList.toggle("noshowimg");
      });
    const winnieCheck = document
      .querySelector("#winnie")
      .addEventListener("change", function() {
        winnieGroup.classList.toggle("noshow");
        winnieImg.classList.toggle("noshowimg");
      });
    const frozenCheck = document
      .querySelector("#frozen")
      .addEventListener("change", function() {
        frozenGroup.classList.toggle("noshow");
        frozenImg.classList.toggle("noshowimg");
      });

    const newData = data.filter(book => {
      possibleAnswers.forEach(name => {
        if (book.bookTitle.toLowerCase().includes(name)) {
          book.disneyCharacter = name;
        }
      });
      if (book.disneyCharacter) {
        return book;
      }
    });

    // ophalen van namen van characters
    const organizedByCharacter = d3
      .nest()
      .key(function(book) {
        return book.disneyCharacter;
      })
      .entries(newData);

    const goodData = organizedByCharacter.map(character => {
      const byYear = d3
        .nest()
        .key(function(book) {
          return book.itemYear;
        })
        .entries(character.values);
      return {
        name: character.key,
        years: byYear
      };
    });


    let yearCount = goodData.map(d => {
      return d.years.length;
    });

    const maxYearCount = d3.max(yearCount, function(d) {
      return d;
    });
    const uniqueYears = d3
      .map(newData, d => d.itemYear)
      .keys()
      .sort(function(a, b) {
        return a - b;
      });
    const domainYears = d3.extent(newData, function(d) {
      return d.itemYear;
    });

    let scaleX = d3
      .scaleLinear()
      .domain(domainYears)
      .range([0, width]);

    let scaleY = d3
      .scaleLinear()
      .domain([0, d3.max(yearCount)])
      .range([height, 0]);

    var svg = d3
      .select("#visual")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltipDiv = d3
      .select("#visual")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    update(goodData);

    d3.select("#selectbox")
      .append("div")
      .attr("class", "selectYears")
      .append("select")
      .attr("class", "select")
      .on("change", onchange);

    d3.select(".select")
      .selectAll("option")
      .data(uniqueYears)
      .enter()
      .append("option")
      .text(d => d);

    svg.append("g")

    //Onchange functie geholpen door Dennis
    function onchange() {

      currentAxis = "names";
      const yearTitle = document.querySelector("#year-item");
      const year = d3.select("select").property("value");
      yearTitle.textContent = year;

      console.log('goodData: ' ,goodData);

      scaleX = d3
        .scalePoint()
        .domain(goodData.map(d => d.name))
        .range([0, width]);
      scaleY = d3
        .scaleLinear()
        .domain([0, 500])
        .range([height, 0]);
      update(goodData, year);
    }

    // Update functie
    function update(data, year) {
      //------ Data manipulatie geholpen door Folkert
      //------ op wisselen van optie in selectbox

      if (year) {
        data = data
          .map(character => ({
            ...character,
            years: character.years
              .filter(cyear => cyear.key == year)
          }))
      }
      console.log(data)


      const groups = svg.selectAll(".group").data(data);
      groups.exit().remove();
      groups
        .enter()
        .append("g")
        .attr("class", d => {
          return "group " + d.name;
        });

      const circles = d3
        .selectAll(".group")
        .selectAll("circle")
        .data(d => d.years.map(book => {
            if (currentAxis === "years") {
              return book;
              console.log(book);
            } else {
              return book.values[0];
            }
          }));

      circles
        .enter()
        .append("circle")
        .attr("class", "item")
        .attr("cx", function(d) {
          return scaleX(currentAxis === "years" ? d.key : d.disneyCharacter);
        })
        .attr("cy", function(d) {
          return scaleY(currentAxis === "years" ? d.values.length : d.pageNumber);
        })

        .on("mouseover", function(d) {
          tooltipDiv
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          tooltipDiv
            .html(d.values.length + " boeken")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 10 + "px");
        })
        .on("mouseout", function(d) {
          tooltipDiv
            .transition()
            .duration(500)
            .style("opacity", 0);
        })
        .attr("r", 0)
        .transition()
        .delay(function(d, i) { return i*70; })
        .attr("r", 10)

      circles
        .attr("cx", function(d) {
          console.log(d)
          return scaleX(currentAxis === "years" ? d.key : d.disneyCharacter);
        })
        .attr("cy", function(d) {
          d.pageNumber = d.pageNumber ? d.pageNumber : 0
          return scaleY(currentAxis === "years" ? d.values.length : d.pageNumber);
        })
        .attr("r", 0)
        .transition()
        .delay(function(d, i) { return i*70; })
        .attr("r", 10)

      circles.exit()
        .remove()

      d3.select(".xAxis").remove();
      // Add the x Axis
      svg
        .append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(
          d3
            .axisBottom(scaleX)
            .ticks(
              currentAxis === "years" ? uniqueYears.length : goodData.length
            )
          .tickFormat(d3.format('y'))

        )
        d3.selectAll('text')
        .style('background-color', 'green')

        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -0 10)');


      d3.select(".yAxis").remove();
      // Add the Y Axis
      svg
        .append("g")
        .attr("class", "yAxis")
        .call(d3.axisLeft(scaleY));
    }

    mickeyGroup = document.querySelector(".mickey");
    donaldGroup = document.querySelector(".donald");
    winnieGroup = document.querySelector(".winnie");
    peterGroup = document.querySelector(".peter");
    frozenGroup = document.querySelector(".frozen");
  })
  .catch(err => {
    // console.log(err);
  });
