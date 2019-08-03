const fs = require("fs");
const http = require("http");

const file = fs.readFileSync("./img.png");
const imageData = file.toString("base64");
const result = `data:image/png;base64,${imageData}`;

