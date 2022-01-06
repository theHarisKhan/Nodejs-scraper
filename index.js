const cheerio = require("cheerio");
const rp = require("request-promise");

const reqLink = `https://simple.wikipedia.org/wiki/List_of_presidents_of_the_United_States`;

rp(reqLink)
  .then(function (html) {
    const $ = cheerio.load(html);
    const title = $(".wikitable td b a");
    const wiki = [];

    for (let i = 0; i < title.length; i++) {
      const Name = title[i].attribs.title;
      const Link = title[i].attribs.href;
      wiki.push({ Name, Link });
    }

    return Promise.all(
      wiki.map((url) => {
        return rp(`https://simple.wikipedia.org/${url.Link}`)
          .then((html) => {
            const $ = cheerio.load(html);
            return {
              Name: $("#firstHeading").text(),
              OfficePeriod: $(".infobox tr:nth-child(5) td").text(),
            };
          })
          .catch((error) => {
            console.log(error);
          });
      })
    );
  })
  .then((res) => console.log(res))
  .catch(function (err) {
    console.log(err);
  });
