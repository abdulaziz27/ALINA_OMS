const http = require('http');

const data1 = JSON.stringify({
    action: 'UPDATE',
    id: 'USR-001',
    user: { role: 'OWNER', name: 'System' },
    targetUser: {
      Full_Name: 'Alina Owner',
      Email: 'Owner@alina.com',
      Role: 'OWNER',
      Password: 'HIJxF1N4',
      Status: 'Active',
      Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
    }
});

const req1 = http.request('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data1.length
  }
}, (res) => {
  res.on('data', d => console.log(d.toString()));
});
req1.write(data1);
req1.end();

const data2 = JSON.stringify({
    action: 'UPDATE',
    id: 'USR-002',
    user: { role: 'OWNER', name: 'System' },
    targetUser: {
      Full_Name: 'Admin Operasional',
      Email: 'admin@alina.com',
      Role: 'ADMIN',
      Password: '4L1N4xAdmin',
      Status: 'Active',
      Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
    }
});

const req2 = http.request('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data2.length
  }
}, (res) => {
  res.on('data', d => console.log(d.toString()));
});
req2.write(data2);
req2.end();
