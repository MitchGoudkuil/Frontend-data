# Functional programming

## Research:

**Description**
A bubble chart from all the dutch thriller books that have the word Blood in the title. The chart shows the amount of pages on the X axis, the bookTitles on the y Axis, the amount of characters in the summary(the radius of the circle) and if the words Murder and kidnapping excist in the summary(colors of the circle).

Check the [visual](http://MitchGoudkuil.github.io) here.




**Links**

* [Link of the bubblechart where I got my inspiration from while sketching](https://datavizcatalogue.com/methods/bubble_chart.html)

* [Code example that I looked at to make the visualisation](https://beta.observablehq.com/@mbostock/d3-bubble-chart)

* [tutorial from Udemy that I watched](https://www.udemy.com/masteringd3js/learn/v4/content)


**Table of contents:**

* [Installing the project](#installingtheproject)
* [Learning aquabrowser](#Learningaquabrowser)
   * search terms and keywords
* [Listening subquestions and setting up the hypothesis](#Listeningsubquestionsandsettingupthehypothesis)
   * Hypothesis
* [Getting the data](#Gettingthedata)
   * Making data smaller
   * Generating json
* [Sketching the visualisation](#Sketchingthevisualisation)
* [Installing the project](#installingtheproject)
* [Setup of d3](#set-upofd3)
* [Conclusion](#conclusion)
* [Special thanks](#specialthanks)


##### Installing the project:

      **Clone the repository**
      git clone https://github.com/MitchGoudkuil/functional-programming

      **Enter new directory**
      cd functional-programming

      **Create a .env file**
      touch .env

      **Add public and secret key to the .env file**
      PUBLIC=987654321
      SECRET=123456789

      **Install Packages needed**
      Check the packages listed below
      npm install

      # Start application
      npm run start

      check if running on: http://localhost:30000

**Packages used and sources to install:**
   * [Nodemon](https://nodemon.io/)
   // used to show console into bash
   * [axios](https://github.com/axios/axios)
   // used for requests to the API
   * [chalk](https://www.npmjs.com/package/chalk)
   // adding colors to errors etc
   * [dotenv](https://www.npmjs.com/package/dotenv)
   // Possibility to import an .env file with important information
   * [express](https://www.npmjs.com/package/express)
   * [jsonpath](https://www.npmjs.com/package/JSONPath)
   * [query-string](https://www.npmjs.com/package/query-string)
   * [xml-to-json-Promise](https://www.npmjs.com/package/xml-to-json-promise)
   * [xml2js](https://www.npmjs.com/package/xml2js)


##### 💧 Learning aquabrowser:
  Document about using the Aquabrowser, about al the parameters, facets, etc send to us by Mark Vos from the Oba. [link](https://zoeken.oba.nl/api/v1/#/details)
  The documentation is a bit outdated and the explanation is not really that great.

**:key: Search terms ,keywords and parameters:**

To find out about all the subjects and facets you can search for, Daniel van de Velde made an amazing readme about it.
Props to Daniel van de Velde for this list and sharing it with us. [Source](https://github.com/DanielvandeVelde/functional-programming/blob/master/README.md)

I made a small list with the available data that was the most interesting, and probably needed for the visualisation:
   * coverimages
     * coverimage
   * titles
     * title
     * short-title
     * other-title
   * Authors
     * main-author
     * author
   * formats (book/movie)
     * format
   * publication
     * year
     * publishers
       * publisher
   * languages
     * language
   * genres
     * genre (thriller)
   * summaries
     * summary

##### :question: Listening subquestions and setting up the hypothesis


1. In how many of the disney books are the main characters humans?
2. If you put the 3 biggest trilogies next to each other, how high is the pile of books?
3. On which novels's summary are the most sexual words used?
4. Which books with the genre thriller has the most amount of the word blood in the summary? (Dutch and english)
5. Which Genre has the most amount of books.(too easy)

**Hypothesis**

How often does the word blood appear in the summary of dutch thrillers?

This hypothesis gave me data which was so small that I was not happy with it. So in the end I changed it to a different question. Which was:

In dutch thrillers with the word blood in the title, how much times does the word murder or kidnapping show up in the summmary? And is it true that books with more pages have a large summary?

Parameters needed/used to answer the questions:
- Genre
- Format (books)
- Language (Dut)
- Book Summary
- Book page count


##### Getting the data
To be able to get the data I changed the Api get request to as shown below:

``` js
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
```

The results gave me 46 dutch thrillers(books), each with the word blood in the title. Thanks to the Api that Folkert and Dennis made I was able to import more data. The data that the Api returned was a lot. So it is was necessary to make this data more compact and only with the data that I actually need.


**Making data smaller**
To make the data smaller I learned how to map over the data the Api provided me and how to make the data even smaller so I would only get the data that I needed.
``` js
let newarr = res.map(book => {
  let summaryBook = book.summaries && book.summaries[0] &&    book.summaries[0].summary && book.summaries[0].summary[0] &&    book.summaries[0].summary[0]['_'] ? book.summaries[0].summary[0]._ :    null
  let bookTitle = book.titles[0] && book.titles[0].title[0] &&    book.titles[0].title[0]['_'] ? book.titles[0].title[0]._ : null
  bookTitle = bookTitle.substring(0, bookTitle.indexOf("/")).trim()
  let bookMainAuthor = book.authors[0]['main-author']._
  let pageCount = book.description[0]['physical-description'][0]._
  pageCount = Number(pageCount.substring(0,    pageCount.indexOf("p")).trim())

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
      // searchWordAmount : summaryBook ?    summaryBook.split(searchword).length-1 : null,
    }
    infoArr.push(allInfo)
  } else{
    "niet gevonden"
  }
})
```

After getting all the data and putting them in variables it was time to push them into an array that I could then export to a Json file to use with d3. That array is then returned as the value of the response.

**generating json**

Because the get request is done with a promise I made a new then in which I work with the server(first to lines in the THEN) and the json export(last two lines in the THEN).

``` js
.then(response => {
    app.get('/', (req, res) => res.json(response))
    app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
    data = JSON.stringify(response, null, 2 );
    fs.writeFileSync('src/bookdata.json', data);
})
```
With fs its able to export the response into a new generated file called bookdata.json. We now have the data that we need to make the visualisation :).


##### Sketching the visualisation
I made two sketches in which I wanted to design the look of the visualisation. This way I knew where I wanted to put the data on the axis.

*Sketch one:* At first I wanted to make a bar chart but I changed that rather quickly at the end.

![alt text](https://raw.githubusercontent.com/MitchGoudkuil/functional-programming/master/sketch1.png)

*Sketch two:* This is the way I wanted to make the graph. I chose for a bubble chart because in this way its nicer to show more datapoints.

![alt text](https://raw.githubusercontent.com/MitchGoudkuil/functional-programming/master/sketch2.png)


##### Set-up of d3
For the setup of d3, to start off make a new file with the name src. In this file the only thing we need is an index.html, bookdata.json and a d3.js file, and maybe a css file but you can also just make an style tag and but the styling in there.

To load d3 into the project add

```js
<script src="https://d3js.org/d3.v5.js"></script>
```

to the bottom of your body. Under this tag add your d3.js the same way.

To be able to work with a json file d3 had the ability to load this data through a promise which was something new I learned about

```js
d3.json('bookdata.json').then(data => {
  // in here we're going to put the code
})
// Don't forget to add a catch at the end to make sure the errors get handled
.catch(err => {
  console.log(err);
})

```

To be able to work with the provided data from the dataset I had to make some variables to make it easier for myself which works the same way as making the data smaller when retrieving the data.

After appending the svg in d3 and adding all the groups and the data provided in the bookdata.json file the chart is finished. Its hard to get used to the documentation of d3 but in the end if you look at the generated svg its quite logical.

You can find the end result [here](http://MitchGoudkuil.github.io)


**what I still wanted to do**


##### Conclusion
Just as the other course, I learned a lot this time. It was extremely hard to get started because Node and working with an Api was completely new for me. I got a lot of help from Dennis and Folkert who made a completely new setup of theOba Api which I had to get used to working with it. After realising how nice it was to work with the Api it was time to make the data smaller. Dennis gave me instructions but actually let me type and guess to what was needed to make de data more compact. At the end it felt like I finally knew what was happening and I actually helped some other students as well with getting the data. I learned a lot of things that were u clear to me before like: returning values, promises, the use of high order functions and a lot more.

Working with d3 was a b*tch to say at least. In the beginning its absolutely unclear how the setup of d3 works but whats nice is that there were a lot of tuttorials which showed a lot of the stuff that I needed. I changed my chart a lot from circles to barcharts and at the end back to a bubble chart, but with the values this time. I learned how to work with it but I am sure that there is a lot more to learn. Especially the calculations of the scaling.

What went wrong was that it was hard for me to get a good connection between the data. I had a nice idea but it turned out to be not as great as it was in my head :(. On thursday I was still trying to figure out what I wanted to make and I had a light mental breakdown after I decided that I had to start over. Thankfully that worked out really great thanks to help and a lot of tuttorials.


##### Special thanks to
It was not possible for me to make this visualisation if I didn't get help from Dennis, Folkert and Daniel. Their skills are amazing on its self and especially if you combine it together.  
