const http = require('http');

const payload = JSON.stringify({
  action: "CREATE",
  product: {
    SKU: "TEST-001",
    Product_Name: "TEST DATA",
    Category: "A",
    Variant: "B",
    Color: "C",
    Size: "D",
    Cost_Price: 1000,
    Selling_Price: 2000,
    Current_Stock: 5,
    Minimum_Stock: 2,
    Status: "Active"
  },
  user: { name: "System", role: "OWNER" }
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/products',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});

req.write(payload);
req.end();
