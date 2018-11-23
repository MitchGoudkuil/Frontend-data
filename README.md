# Frontend Data

#### Description
A data visualisation in which the most famous disney characters present the amount of bookt they have. Switch Characters on and off and have a look at the data if you zoom in on a specific year.
The link to the interactive project can be found [link](here)

![image of the prototype](https://raw.githubusercontent.com/MitchGoudkuil/Frontend-data/master/prototype.png)


### Table of contents
* [description](#description)
* [Installation](#installation)
* [Idea](#idea)
    * [The data](#data)
* [Obtaining the data](#obtaining)


### Installation

    ```javascript
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
     ```
To get the public and secret key needed to use the Oba Api


### Idea
I wanted to do something completely different in the terms of data so I decided to focus completely on all the Disney books in the Oba. This was because it were a lot of books but not that much that it was going to be a hassle with organizing the data.

I made a design in sketch of how I wanted the visual to look like which is shown beneath.

img

![mand](https://raw.githubusercontent.com/MitchGoudkuil/Frontend-data/master/prototype.png)

With this design I was able to find out which data was needed.

##### Data
The data needed to be able to finish the data visualisation as designed:

* Book titles
* Book book summary
* Book Author
* Book cover image
* Book year
* Book Language
* Book publisher
* Amount of pages

### Obtaining
Once the Oba Api works its possible to obtain data. Start by making an empty array in which the data is going to get pushed like:

```javascript
let bookarray = [];
```  

Because the page count and the title of the book has a lot of extra unneeded information in them we need to use indexof and trim to actually just get the title and page count. Pagecount needs Number() as well to turn a string with a number to an actuall number.

```javascript
let pageCount = book.description && book.description[0] && book.description[0]['physical-description'] && book.description[0]['physical-description'][0] ? book.description[0]['physical-description'][0]._ : null
pageCount = Number(pageCount.substring(0, pageCount.indexOf("p")).trim())

let title = book.titles[0] && book.titles[0].title[0] && book.titles[0].title[0]['_'] ? book.titles[0].title[0]._ : null
title = title.substring(0, title.indexOf("/")).trim()
```

Pushing the rest of the data in an Object to the bookarray with all checks included else given back null:

```javascript
bookarray.push({
  bookTitle : title,
  bookSummary : book.summaries && book.summaries[0] && book.summaries[0].summary && book.summaries[0].summary[0] && book.summaries[0].summary[0]['_'] ? book.summaries[0].summary[0]._ : null,
  bookAuthor : book.authors ? book.authors[0]['main-author'][0]._ : "no author",
  bookCover : book.coverimages[0] && book.coverimages[0].coverimage[0] && book.coverimages[0].coverimage[0]._ ? book.coverimages[0].coverimage[0]._ : null,
  itemYear : book.publication && book.publication[0] && book.publication[0].year[0] && book.publication[0].year[0] ? book.publication[0].year[0]._ : null,
  itemLang : book.languages && book.languages[0]  && book.languages[0].language && book.languages[0].language[0] ? book.languages[0].language[0]._ : null,
  itemPublisher : book.publication[0].publishers[0].publisher[0]._ ? book.publication[0].publishers[0].publisher[0]._ : null,
  pageNumber : pageCount
})
```
