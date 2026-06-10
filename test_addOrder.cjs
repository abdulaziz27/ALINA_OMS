const http = require('http');

const payload = JSON.stringify({
  action: "CREATE",
  order: {
    Customer: "Test Customer",
    Channel: "Retail",
    items: [
      { SKU: "ALN-CEL-0001", Qty: 1, Price: 10000 }
    ]
  },
  user: { name: "System", role: "OWNER" }
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(res.statusCode, body));
});

req.write(payload);
req.end();
