require('dotenv').config()

const OBA = require('./oba-api.js')
const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')

const client = new OBA({
 public: process.env.PUBLIC
})


client.getAll('search',
{
 q: 'disney',
 librarian: true,
 facet : "type(book)",
 refine: true
},
{
  page: 1,
  pagesize: 20,
  maxpages: 75
})

.then(response => {
  return response.data


})
.then(response => {
    app.get('/', (req, res) => res.json(response))
    app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
    console.log(response.length);
    // data = JSON.stringify(response, null, 2 )
    // fs.writeFileSync('src/newdata.json', data);
})
.catch(err => console.log(err))




// Foreach over json parse
