require('dotenv').config()

const api = require('./oba-api.js')
const OBA = require('./oba-api-gijs.js')
const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')

const client = new OBA({
 public: process.env.PUBLIC
})

// Search for method, params and than optional where you wanna find something
// returns first 20 items
// obaApi.get(endpoint, params, filterKey)
// possible endpoints: search (needs 'q' parameter) | details (needs a 'frabl' parameter) | availability (needs a 'frabl' parameter) | holdings/root | index/x (where x = facet type (like 'book' ))
// possible parameters: q, librarian, refine, sort etc. check oba api documentation for all
// possible filterKey: any higher order key in response object, like title returns only title objects instead of full data object

// Zoek in de hoek van een object returnen in de map met meerdere keys

client.getAll('search',
{
 q: 'title:bloed',
 librarian: true,
 refine: true,
 facet:'type(book)&facet=language(dut)&facet=genre(thriller)'
},
{
  page: 1,
  pagesize: 20,
  maxpages: 4
})

.then(response => {
  let res = response.data
  let infoArr = []
console.log("ikbenhier");
  let newarr = res.map(book => {
    let summaryBook = book.summaries && book.summaries[0] && book.summaries[0].summary && book.summaries[0].summary[0] && book.summaries[0].summary[0]['_'] ? book.summaries[0].summary[0]._ : null
    let bookTitle = book.titles[0] && book.titles[0].title[0] && book.titles[0].title[0]['_'] ? book.titles[0].title[0]._ : null
    bookTitle = bookTitle.substring(0, bookTitle.indexOf("/")).trim()
    let bookMainAuthor = book.authors[0]['main-author']._
    let pageCount = book.description[0]['physical-description'][0]._
    pageCount = Number(pageCount.substring(0, pageCount.indexOf("p")).trim())

    let basicInfo = [
      summaryBook,
      bookTitle,
      bookMainAuthor,
      pageCount
    ]

    if (!basicInfo.includes(null)){
      let murderWord = "moord"
      let kidnapWord = "ontvoer"
      let allInfo = {
        bookTitle : basicInfo[1],
        bookAuthor : basicInfo[2],
        titleLength : bookTitle.length,
        summaryBook : basicInfo[0],
        summaryLength : summaryBook.length,
        murderWordCheck : summaryBook.includes(murderWord),
        kidnapWordCheck : summaryBook.includes(kidnapWord),
        pageCount : basicInfo[3]
        // searchWordAmount : summaryBook ? summaryBook.split(searchword).length-1 : null,
      }
      infoArr.push(allInfo)
    } else{
      "niet gevonden"
    }
  })

  return infoArr

})
.then(response => {
    app.get('/', (req, res) => res.json(response))
    app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
    // data = JSON.stringify(response, null, 2 );
    // fs.writeFileSync('src/bookdata.json', data);
})
.catch(err => console.log(err))




// Foreach over json parse
