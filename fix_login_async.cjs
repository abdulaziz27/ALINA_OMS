const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(/app\.post\('\/api\/auth\/login', \(req, res\) => {/, "app.post('/api/auth/login', async (req, res) => {");
server = server.replace(/app\.post\('\/api\/auth\/logout', \(req, res\) => {/, "app.post('/api/auth/logout', async (req, res) => {");

fs.writeFileSync('server.ts', server);
console.log("Fixed login issues!");
