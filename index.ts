// Here we import the puppeteer module
const puppeteer = require("puppeteer");
// Lets import the browser function from puppeteer
import { Browser } from "puppeteer";
// Lets import the fs module to write the data to a file
const fs = require("fs");

// This is the url we'll be scraping mainly because we're actually allowed to scrape it
const url = `https://books.toscrape.com/`;

// Let's get started by creating the main part of the script
//// Remember that we're using async/await due to the amount of information \\\\
const main = async () => {
  //Create the new browser that will run in the background
  const browser: Browser = await puppeteer.launch({ headless: false }); // set headless to false if you don't wish to see the process
  const page = await browser.newPage();
  // Let's go to the page
  await page.goto(url);

  //// Now we want to get the info on the page (The url we're scraping) \\\\
  // Lets get the title of the page
  const bookData = await page.evaluate((url) => {
    // The price returns with a £ sign, so we need to remove it
    const convertPrice = (price: string) => {
      return parseFloat(price.replace("£", ""));
    };

    // We are converting the rating to a number for more flexibility
    const convertRating = (rating: string) => {
      switch (rating) {
        case "One":
          return 1;
        case "Two":
          return 2;
        case "Three":
          return 3;
        case "Four":
          return 4;
        case "Five":
          return 5;
        default:
          return 0;
      }
    };

    const bookPods = Array.from(document.querySelectorAll(".product_pod"));
    const data = bookPods.map((book: any) => ({
      title: book.querySelector("h3 a").getAttribute("title"),
      price: convertPrice(book.querySelector(".price_color").innerText),
      imgSrc: url + book.querySelector("img").getAttribute("src"),
      rating: convertRating(book.querySelector(".star-rating").classList[1]),
    }));

    return data;
  }, url);
  console.log(bookData);

  // Finally close the browser
  await browser.close();

  // this snippet will save the data to a JSON file
  fs.writeFile("book.json", JSON.stringify(bookData), (err: any) => {
    if (err) throw err;
    console.log("succesfully saved JSON!");
  });
  ///// The json will show in one line, format document or use prettier to make it more readable. \\\\\
};
// This is needed to execute the above script
main();
