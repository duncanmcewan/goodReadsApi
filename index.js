const express = require("express");
const app = express();
const lh = "127.0.0.1";
const port = 3010;
const key = "zOIOcT6jhLmgGvSKyWcOmg";
const util = require('util');
var bodyParser = require('body-parser')
var request = require('request');
var parser = require('fast-xml-parser');

/*  ISBNs FOR TESTING
9781430226598
9780321804334
9780135245125
9781491929483
*/

app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, resp) {
  resp.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, resp) {
    var isbn = req.body.isbn;

    var baseUrl = "https://www.goodreads.com/book/isbn/";
    var finalUrl = baseUrl+isbn+"?key="+key;

    request(finalUrl, function (error, response, body) {
      var data = body;

      var jsonObj = parser.parse(data);
      var baseElement = jsonObj.GoodreadsResponse.book;

      var isbn10 = baseElement.isbn;
      var isbn13 = baseElement.isbn13;
      var title = baseElement.title;
      var authors = baseElement.authors.author;
      var authorsLength = authors.length;
      var publisher = baseElement.publisher;
      var publicationYear = baseElement.publication_year;
      var publicationMonth = baseElement.publication_month;
      var publicationDay = baseElement.publication_day;
      var publicationDate = publicationDay+"/"+publicationMonth+"/"+publicationYear;
      var authorsList = "";
      var tempAuthorsList = "";

      var arrayConstructor = [].constructor;
      var objectConstructor = ({}).constructor;

      function whatIsObject(object) {
        if (object === null) {
          return "null";
        }
        if (object === undefined) {
          return "undefined";
        }
        if (object.constructor === arrayConstructor) {
          return "Array";
        }
        if (object.constructor === objectConstructor) {
          return "Object";
        }
      }

      var authorsType = whatIsObject(authors);
      if (authorsType == "Object") {
        authorsList = authors.name;
      } else if (authorsType == "Array") {
        for (var i=0; i<authorsLength; i++) {
          tempAuthorsList += authors[i].name+", ";
        }
        authorsList = tempAuthorsList.slice(0, -2);
      }

      resp.write("<!DOCTYPE html>");
      resp.write("<html>");
      resp.write("<head>");
      resp.write("<meta charset='utf-8'>");
      resp.write("<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css' integrity='sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T' crossorigin='anonymous'>");
      resp.write("<title>Book Data Lookup</title>");
      resp.write("<script src='https://code.jquery.com/jquery-3.3.1.slim.min.js' integrity='sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo' crossorigin='anonymous'></script>");
      resp.write("<script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js' integrity='sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1' crossorigin='anonymous'></script>");
      resp.write("<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js' integrity='sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM' crossorigin='anonymous'></script>");
      resp.write("</head>");
      resp.write("<body>");
      resp.write("<div class='container'>");
      resp.write("<div class='jumbotron'>");
      resp.write("<h1 style='font-weight: bold;'>BOOK INFO FROM GOODREADS API</h1>");
      resp.write("<h2 style='font-weight: bold;'>ISBN Looked up was : "+isbn);
      resp.write("</div>");  // top jumbotron
      resp.write("<div class='jumbotron' style='background-color: PaleTurquoise;'>");
      resp.write("<div class='row'>");  //  Row 1
      resp.write("<div class='col-sm-4' style='color: red;'><h3>TITLE : </h3></div>");
      resp.write("<div class='col-sm-8'><h3>"+title+"</h3></div>");
      resp.write("</div>");  //  Row 1
      resp.write("<div class='row'>");  //  Row 2
      resp.write("<div class='col-sm-4' style='color: red;'><h3>ISBN10 : </h3></div>");
      resp.write("<div class='col-sm-8'><h3>"+isbn10+"</h3></div>");
      resp.write("</div>");  //  Row 2
      resp.write("<div class='row'>");  //  Row 3
      resp.write("<div class='col-sm-4' style='color: red;'><h3>ISBN13 : </h3></div>");
      resp.write("<div class='col-sm-8'><h3>"+isbn13+"</h3></div>");
      resp.write("</div>");  //  Row 3
      resp.write("<div class='row'>");  //  Row 4
      resp.write("<div class='col-sm-4' style='color: red;'><h3>AUTHOR(s) : </h3></div>");
      resp.write("<div class='col-sm-8'><h3>"+authorsList+"</h3></div>");
      resp.write("</div>");  //  Row 4
      resp.write("<div class='row'>");  //  Row 5
      resp.write("<div class='col-sm-4' style='color: red;'><h3>PUBLISHER : </h3></div>");
      resp.write("<div class='col-sm-8'><h3>"+publisher+"</h3></div>");
      resp.write("</div>");  //  Row 5
      resp.write("<div class='row'>");  //  Row 6
      resp.write("<div class='col-sm-4' style='color: red;'><h3>PUBLICATION DATE : </h3></div>");
      resp.write("<div class='col-sm-8'><h3>"+publicationDate+"</h3></div>");
      resp.write("</div>");  //  Row 6
      resp.write("</div>");  // bottom jumbotron
      resp.write("</div>");  //  container
      resp.write("</body>");
      resp.write("</html>");

      resp.send();
    });

});

app.listen(port, lh, function(req, resp) {
  console.log("Application is up and running fine on port : "+port);
});
