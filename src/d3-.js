
d3.json('newdata.json').then(data => {

const dataset = data;
const width = 800;
const height = 450;
const possibleAnswers = ['mickey', 'donald', 'elsa', 'peter', 'winnie']
const allYears = []


// filtert alle boeken op en schrijft ieder boek als book
const newData = data.filter(book => {
  //loopt over elke naam heen uit de array met namen
  possibleAnswers.forEach(name => {
    // check of de naam voorkomt in alle bookTitle's
    if(book.bookTitle.toLowerCase().includes(name)) {

       book.disneyCharacter = name
     }
  })
  if (book.disneyCharacter) {
    return book
  }
})

const organizedByCharacter = d3.nest()
  .key(function(book) {
    return book.disneyCharacter
  })
  .entries(newData)


const goodData = organizedByCharacter.map(character => {
  const byYear = d3.nest()
    .key(function(book) {
      return book.itemYear
    })
    .entries(character.values)

  return {
    name: character.key,
    years: byYear
  }
})

let uniqueYears = d3.map(newData, d => d.itemYear).keys().sort(function(a, b){return a - b})

console.log(uniqueYears)

const domainYears = d3.extent(newData, function(d) { return d.itemYear })














  // let uniqueYears = d3.map(data, d => d.itemYear).keys().sort(function(a, b){return a - b})
  // console.log(uniqueYears);
  let firstYear = uniqueYears[0];
  let lastYear = uniqueYears[uniqueYears.length-1]
  // console.log(lastYear);



const y = d3.scaleLinear()
.domain([0, 170])
.range([0, height]);

const x = d3.scaleLinear()
.domain([firstYear, lastYear])
.range([0, width]);

const yAxis = d3.axisLeft(y);
const xAxis = d3.axisBottom(x);

const svgSetup = d3.select("#visual")
.append("svg")
.attr("width", width)
.attr("height", height)

let lines = svgSetup.selectAll("")
.data(dataset)








}).catch(err => {
  // console.log(err);
})
