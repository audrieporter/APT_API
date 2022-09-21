require('dotenv').config(); // get environment variables
const PORT = process.env.PORT || 8675; // set port to env or 8675
const app = require("express")();
const axios = require("axios");
const cheerio = require("cheerio");


const sources = [
  {
    name: "infosecurity",
    address:
      "https://www.infosecurity-magazine.com/advanced-persistent-threats",
  },
  {
    name: "hackernews",
    address:
      "https://www.thehackernews.com/search/label/Advanced%20Persistent%20Threat",
  },
];

// search terms
const searchTerms = [
  `Iranian", "Iran`,
  "North Korean",
  "Chinese",
  "Russian",
  "APT",
];

/**
 * get all articles. changed to a function to prevent runs on server restart
 * that might cause issues when calling the same server multiple times
 * @param {Function} callback callback function to handle async returns
 */
function getAllArticles(callback) {
  let articles = []; // list of articles
  let completedSearches = 0; // number of searches completed

  // for each source
  sources.forEach((source) => {
    axios.get(source.address).then((response) => {
      let html = response.data;
      let $ = cheerio.load(html);
      /**
       * get article
       */

      // for each term
      searchTerms.forEach((term) => {
        // get article
        $(`a:contains("${term}")`, html).each(function () {
          let title = $(this).text();
          let url = $(this).attr("href");

          articles.push({
            title,
            url,
            sourcename: source.name,
          });
        });
      });
      // add one to completed
      completedSearches++;
      // when complete, return all articles to callback
      if (completedSearches === sources.length) {
        callback(articles);
      }
    });
  });
}
app.get("/", (req, res) => {
  res.json("Welcome to my APT API.");
});

app.get("/news", (req, res) => {
  getAllArticles((articles) => {
    res.json(articles);
  });
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
