const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(/app\.use\(\(req, res, next\) => {/, "app.use(async (req, res, next) => {");

server = server.replace(/await \/\* Firebase natively syncs \*\/.*?;/g, "/* background sync not needed */");

fs.writeFileSync('server.ts', server);
console.log("Fixed async issues!");
