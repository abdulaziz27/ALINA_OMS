const fs = require('fs');
let db = JSON.parse(fs.readFileSync('db.json'));
let id = 1;
db.products.forEach(p => {
  p.Product_ID = `PROD-${String(id++).padStart(3, '0')}`;
});
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log("Fixed Product_IDs");
