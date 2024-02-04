/** Command-line tool to generate bigram Markov text. */

const fs = require("fs");
const markov = require("./bigram");
const axios = require("axios");
const process = require("process");

/** Make Markov machine from text and generate text from it. */
function generateText(text) {
  let mm = new markov.MarkovMachine(text);
  console.log(mm.makeText());
}

/** Read file and generate text from it. */
function makeText(path) {
  fs.readFile(path, "utf8", function cb(err, data) {
    if (err) {
      console.error(`Cannot read file: ${path}: ${err}`);
      process.exit(1);
    } else {
      generateText(data);
    }
  });
}

/** Read URL and make text from it. */
async function makeURLText(url) {
  let resp;

  try {
    resp = await axios.get(url);
  } catch (err) {
    console.error(`Cannot read URL: ${url}: ${err}`);
    process.exit(1);
  }

  generateText(resp.data);
}

/** Interpret cmdline to decide what to do. */
let [method, path] = process.argv.slice(2);

if (method === "file" || method === "url") {
  makeText(path);
} else {
  console.error("Usage: node yourScript.js [file|url] path_or_url");
  process.exit(1);
}
