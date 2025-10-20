// scripts/escapePem.js
import fs from "fs";

const pem = fs.readFileSync("./certs/private.pem", "utf8");
const escaped = pem.replace(/\n/g, "\\n");
// console.log(escaped);
