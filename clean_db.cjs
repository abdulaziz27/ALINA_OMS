const fs = require('fs');
const dbFile = './db.json';

try {
  let db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

  if (db.products) {
    db.products = db.products.filter(p => p.Product_ID && p.Product_ID.trim() !== "");
  }
  
  Object.keys(db).forEach(key => {
    if (Array.isArray(db[key])) {
      if (key === 'products') db[key] = db[key].filter(i => i.Product_ID || i.SKU);
      else if (key === 'customers') db[key] = db[key].filter(i => i.Customer_ID || i.Customer_Name);
      else if (key === 'orders') db[key] = db[key].filter(i => i.Order_Number);
      else if (key === 'stockIn') db[key] = db[key].filter(i => i.Transaction_ID);
      else if (key === 'stockOut') db[key] = db[key].filter(i => i.Transaction_ID);
      else if (key === 'stockOpname') db[key] = db[key].filter(i => i.Opname_ID || i.SKU);
      else if (key === 'shipping') db[key] = db[key].filter(i => i.Tracking_Number || i.Order_Number);
      else if (key === 'users') db[key] = db[key].filter(i => i.User_ID || i.Email);
      else if (key === 'activityLog') db[key] = db[key].filter(i => i.Log_ID || i.Activity);
    }
  });

  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
  console.log("DB cleaned up successfully.");
} catch (e) {
  console.error("Cleanup failed:", e);
}
