/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { 
  User, Product, Customer, StockIn, StockOut, 
  StockOpname, Order, Shipping, ActivityLog, SheetsConfig, OrderStatus 
} from './src/types.ts';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db.json');

app.use(express.json({ limit: '10mb' }));

// Helper to hash password using SHA-256
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Default/Initial database template structure
const DEFAULT_DB = {
  users: [
    {
      User_ID: "USR-001",
      Full_Name: "Alina Owner",
      Email: "owner@alina.com",
      Password_Hash: hashPassword("owner123"),
      Role: "OWNER" as const,
      Status: "Active" as const,
      Last_Login: "2026-06-08T07:40:00Z",
      Created_Date: "2026-01-01T00:00:00Z",
      Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
    },
    {
      User_ID: "USR-002",
      Full_Name: "Admin Operasional",
      Email: "admin@alina.com",
      Password_Hash: hashPassword("admin123"),
      Role: "ADMIN" as const,
      Status: "Active" as const,
      Last_Login: "2026-06-08T07:30:00Z",
      Created_Date: "2026-01-02T00:00:00Z",
      Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
    }
  ] as User[],
  products: [
    {
      Product_ID: "PROD-001",
      SKU: "ALN-CEL-0001",
      Barcode: "ALN-CEL-0001",
      QR_Code: "ALN-CEL-0001",
      Product_Name: "Celamis All Size Pink Pastel",
      Category: "Celamis",
      Variant: "Celamis All Size",
      Color: "Pink Pastel",
      Size: "All Size",
      Cost_Price: 25000,
      Selling_Price: 45000,
      Current_Stock: 120,
      Minimum_Stock: 30,
      Status: "Active" as const
    },
    {
      Product_ID: "PROD-002",
      SKU: "ALN-CEL-0002",
      Barcode: "ALN-CEL-0002",
      QR_Code: "ALN-CEL-0002",
      Product_Name: "Celamis Jumbo Dark Magenta",
      Category: "Celamis",
      Variant: "Celamis Jumbo",
      Color: "Dark Magenta",
      Size: "Jumbo",
      Cost_Price: 28000,
      Selling_Price: 49000,
      Current_Stock: 85,
      Minimum_Stock: 25,
      Status: "Active" as const
    },
    {
      Product_ID: "PROD-003",
      SKU: "ALN-KDS-0001",
      Barcode: "ALN-KDS-0001",
      QR_Code: "ALN-KDS-0001",
      Product_Name: "Celamis Kids 1 Salmon",
      Category: "Celamis Kids",
      Variant: "Celamis Kids 1",
      Color: "Salmon Rose",
      Size: "Kids 1",
      Cost_Price: 15000,
      Selling_Price: 28000,
      Current_Stock: 10,  // low stock, forecast alert
      Minimum_Stock: 20,
      Status: "Active" as const
    },
    {
      Product_ID: "PROD-004",
      SKU: "ALN-JLB-0001",
      Barcode: "ALN-JLB-0001",
      QR_Code: "ALN-JLB-0001",
      Product_Name: "Jilbab Woolpeach M Dusty Violet",
      Category: "Jilbab Woolpeach",
      Variant: "M",
      Color: "Dusty Violet",
      Size: "M",
      Cost_Price: 32000,
      Selling_Price: 58000,
      Current_Stock: 140,
      Minimum_Stock: 15,
      Status: "Active" as const
    },
    {
      Product_ID: "PROD-005",
      SKU: "ALN-JLB-0002",
      Barcode: "ALN-JLB-0002",
      QR_Code: "ALN-JLB-0002",
      Product_Name: "Jilbab Wollycrape L Blush Pink",
      Category: "Jilbab Wollycrape",
      Variant: "L",
      Color: "Blush Pink",
      Size: "L",
      Cost_Price: 38000,
      Selling_Price: 65000,
      Current_Stock: 18,  // low stock, forecast alert
      Minimum_Stock: 25,
      Status: "Active" as const
    }
  ] as Product[],
  customers: [
    {
      Customer_ID: "CUST-001",
      Customer_Name: "Rania Hijab Store",
      Customer_Type: "Reseller" as const,
      Phone: "081234567890",
      Email: "rania@gmail.com",
      Address: "Kebayoran Baru No 12",
      City: "Jakarta Selatan",
      Status: "Active" as const
    },
    {
      Customer_ID: "CUST-002",
      Customer_Name: "Zahra Agen Busana",
      Customer_Type: "Agen" as const,
      Phone: "082345678901",
      Email: "zahra.agen@yahoo.com",
      Address: "Ahmad Yani No. 99",
      City: "Bandung",
      Status: "Active" as const
    },
    {
      Customer_ID: "CUST-003",
      Customer_Name: "Aisyah Marketer",
      Customer_Type: "Marketer" as const,
      Phone: "083456789012",
      Email: "aisyah_market@gmail.com",
      Address: "Kaliurang KM 7",
      City: "Yogyakarta",
      Status: "Active" as const
    },
    {
      Customer_ID: "CUST-004",
      Customer_Name: "Shopee Mall Order",
      Customer_Type: "Shopee" as const,
      Phone: "08999999999",
      Email: "shopee@alina.com",
      Address: "Gudang Transit Shopee",
      City: "Jakarta Barat",
      Status: "Active" as const
    }
  ] as Customer[],
  stockIn: [
    {
      Transaction_ID: "STK-IN-0001",
      Date: "2026-06-01T09:00:00Z",
      SKU: "ALN-CEL-0001",
      Product_Name: "Celamis All Size Pink Pastel",
      Qty: 100,
      Notes: "Produksi Batch A"
    },
    {
      Transaction_ID: "STK-IN-0002",
      Date: "2026-06-03T11:00:00Z",
      SKU: "ALN-JLB-0001",
      Product_Name: "Jilbab Woolpeach M Dusty Violet",
      Qty: 150,
      Notes: "Kiriman Konveksi"
    }
  ] as StockIn[],
  stockOut: [
    {
      Transaction_ID: "STK-OUT-0001",
      Date: "2026-06-04T14:30:00Z",
      SKU: "ALN-CEL-0001",
      Product_Name: "Celamis All Size Pink Pastel",
      Customer: "Rania Hijab Store",
      Qty: 10,
      Notes: "Order Direct Reseller"
    }
  ] as StockOut[],
  stockOpname: [
    {
      Opname_ID: "OPN-0001",
      Month: "Mei 2026",
      SKU: "ALN-CEL-0001",
      Product_Name: "Celamis All Size Pink Pastel",
      System_Stock: 30,
      Physical_Stock: 30,
      Difference: 0,
      Date: "2026-05-31T23:59:59Z"
    }
  ] as StockOpname[],
  orders: [
    {
      Order_Number: "ORD-20260608-0001",
      Order_Date: "2026-06-08T03:15:00Z",
      Customer: "Rania Hijab Store",
      Channel: "Reseller" as const,
      SKU: "ALN-CEL-0001",
      Product: "Celamis All Size Pink Pastel",
      Qty: 8,
      Price: 45000,
      Total: 360000,
      Status: "New Order" as const
    },
    {
      Order_Number: "ORD-20260608-0002",
      Order_Date: "2026-06-08T04:30:00Z",
      Customer: "Zahra Agen Busana",
      Channel: "Agen" as const,
      SKU: "ALN-CEL-0002",
      Product: "Celamis Jumbo Dark Magenta",
      Qty: 15,
      Price: 49000,
      Total: 735000,
      Status: "Processing" as const
    },
    {
      Order_Number: "ORD-20260608-0003",
      Order_Date: "2026-06-08T05:00:00Z",
      Customer: "Shopee Mall Order",
      Channel: "Shopee" as const,
      SKU: "ALN-KDS-0001",
      Product: "Celamis Kids 1 Salmon",
      Qty: 5,
      Price: 28000,
      Total: 140000,
      Status: "Completed" as const
    },
    {
      Order_Number: "ORD-20260608-0004",
      Order_Date: "2026-06-07T12:00:00Z",
      Customer: "Aisyah Marketer",
      Channel: "Marketer" as const,
      SKU: "ALN-JLB-0002",
      Product: "Jilbab Wollycrape L Blush Pink",
      Qty: 12,
      Price: 65000,
      Total: 780000,
      Status: "Shipped" as const
    }
  ] as Order[],
  shipping: [
    {
      Tracking_Number: "SPX-9988112233",
      Courier: "Shopee Express",
      Order_Number: "ORD-20260608-0003",
      Shipping_Date: "2026-06-08T06:00:00Z",
      Status: "Delivered" as const
    },
    {
      Tracking_Number: "JNE-88229911",
      Courier: "JNE Reg",
      Order_Number: "ORD-20260608-0004",
      Shipping_Date: "2026-06-07T14:00:00Z",
      Status: "In Transit" as const
    }
  ] as Shipping[],
  activityLog: [
    {
      Log_ID: "LOG-0001",
      User_Name: "Alina Owner",
      User_Role: "OWNER" as const,
      Activity: "System database initialized with mock data",
      Module: "System",
      Timestamp: "2026-06-08T07:40:00Z",
      Device: "Server Container"
    }
  ] as ActivityLog[],
  sheetsConfig: {
    scriptUrl: "",
    spreadsheetId: "",
    isLinked: false,
    autoSync: false
  } as SheetsConfig
};

// Reads data from db.json file, or seeds and returns default
function readDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return DEFAULT_DB;
    }
  } catch (error) {
    console.error("Failed to read database file:", error);
    return DEFAULT_DB;
  }
}

async function syncToGoogleSheets(db: any): Promise<boolean> {
  if (!db.sheetsConfig || !db.sheetsConfig.isLinked || !db.sheetsConfig.scriptUrl) {
    return false;
  }
  try {
    const payload = {
      action: "syncAll",
      db: {
        products: db.products || [],
        customers: db.customers || [],
        stockIn: db.stockIn || [],
        stockOut: db.stockOut || [],
        stockOpname: db.stockOpname || [],
        orders: db.orders || [],
        shipping: db.shipping || [],
        users: db.users || [],
        activityLog: db.activityLog || []
      }
    };
    
    console.log(`Syncing database to Google Sheets web app: ${db.sheetsConfig.scriptUrl}`);
    const response = await fetch(db.sheetsConfig.scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log("Successfully synchronized with Google Sheets!");
      return true;
    } else {
      console.error(`Failed to sync with Google Sheets, response status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("Failed to post sync to Google Sheets script:", error);
    return false;
  }
}

function triggerSheetsSyncIfNeeded(db: any) {
  if (db.sheetsConfig && db.sheetsConfig.isLinked && db.sheetsConfig.autoSync && db.sheetsConfig.scriptUrl) {
    syncToGoogleSheets(db).catch(err => {
      console.error("Background autoSync error:", err);
    });
  }
}

// Write database back to file
function saveDatabase(data: typeof DEFAULT_DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    // Autosync on modification if autoSync is activated
    triggerSheetsSyncIfNeeded(data);
  } catch (error) {
    console.error("Failed to write to database file:", error);
  }
}

// Log actions dynamically
function appendAuditLog(userName: string, userRole: 'OWNER' | 'ADMIN', activity: string, module: string, userAgent?: string) {
  const db = readDatabase();
  const log: ActivityLog = {
    Log_ID: `LOG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
    User_Name: userName,
    User_Role: userRole,
    Activity: activity,
    Module: module,
    Timestamp: new Date().toISOString(),
    Device: userAgent || "Web Client"
  };
  db.activityLog.unshift(log);
  if (db.activityLog.length > 500) {
    db.activityLog = db.activityLog.slice(0, 500); // keep it lean
  }
  saveDatabase(db);
}

// ----------------------------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------------------------

// 1. AUTHENTICATION
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and Password are required' });
  }

  const db = readDatabase();
  const user = db.users.find((u: User) => u.Email.toLowerCase() === email.toLowerCase());

  if (!user || user.Status !== 'Active') {
    return res.status(401).json({ error: 'Invalid active user credentials' });
  }

  // Check password
  const testHash = hashPassword(password);
  if (user.Password_Hash !== testHash) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }

  // Update last login
  user.Last_Login = new Date().toISOString();
  saveDatabase(db);

  // Log audit trail
  appendAuditLog(user.Full_Name, user.Role, `Logged in successfully`, 'Security', req.headers['user-agent']);

  return res.json({
    user: {
      User_ID: user.User_ID,
      Full_Name: user.Full_Name,
      Email: user.Email,
      Role: user.Role,
      Status: user.Status,
      Last_Login: user.Last_Login,
      Permissions: user.Permissions || []
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  const { userName, role } = req.body;
  if (userName) {
    appendAuditLog(userName, role || 'ADMIN', `Logged out`, 'Security', req.headers['user-agent']);
  }
  res.json({ success: true });
});

// 2. RETRIEVE ALL DATABASE TABLES
app.get('/api/db', (req, res) => {
  const db = readDatabase();
  // Strip password hashes for client safety
  const safeUsers = db.users.map((u: User) => {
    const { Password_Hash, ...safe } = u;
    return safe;
  });
  res.json({ ...db, users: safeUsers });
});

// 3. PRODUCT MASTER CRUD
app.post('/api/products', (req, res) => {
  const { action, product, user, id } = req.body; // action: CREATE, UPDATE, DELETE
  const db = readDatabase();

  if (action === 'CREATE') {
    // Generate Product_ID
    const nextIdNum = db.products.length + 1;
    const prodId = `PROD-${String(nextIdNum).padStart(3, '0')}`;
    
    const newProduct: Product = {
      Product_ID: prodId,
      SKU: product.SKU,
      Barcode: product.Barcode || product.SKU,
      QR_Code: product.QR_Code || product.SKU,
      Product_Name: product.Product_Name,
      Category: product.Category,
      Variant: product.Variant,
      Color: product.Color,
      Size: product.Size,
      Cost_Price: Number(product.Cost_Price),
      Selling_Price: Number(product.Selling_Price),
      Current_Stock: Number(product.Current_Stock) || 0,
      Minimum_Stock: Number(product.Minimum_Stock) || 0,
      Status: product.Status || 'Active'
    };

    // Check SKU duplication
    if (db.products.some((p: Product) => p.SKU === newProduct.SKU)) {
      return res.status(400).json({ error: 'SKU is already registered and must be unique.' });
    }

    db.products.push(newProduct);
    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Created product SKU: ${newProduct.SKU}`, 'Product');
    return res.json({ success: true, product: newProduct });
  }

  if (action === 'UPDATE') {
    const idx = db.products.findIndex((p: Product) => p.Product_ID === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Check duplicate SKU if SKU changed
    const item = db.products[idx];
    if (product.SKU !== item.SKU && db.products.some((p: Product) => p.SKU === product.SKU)) {
      return res.status(400).json({ error: 'Target SKU already exists, cannot rename.' });
    }

    db.products[idx] = {
      ...item,
      SKU: product.SKU,
      Barcode: product.Barcode || product.SKU,
      QR_Code: product.QR_Code || product.SKU,
      Product_Name: product.Product_Name,
      Category: product.Category,
      Variant: product.Variant,
      Color: product.Color,
      Size: product.Size,
      Cost_Price: Number(product.Cost_Price),
      Selling_Price: Number(product.Selling_Price),
      Current_Stock: Number(product.Current_Stock),
      Minimum_Stock: Number(product.Minimum_Stock),
      Status: product.Status
    };

    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Updated product SKU: ${product.SKU}`, 'Product');
    return res.json({ success: true, product: db.products[idx] });
  }

  if (action === 'DELETE') {
    if (user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Access denied: Only OWNER can delete products.' });
    }

    const idx = db.products.findIndex((p: Product) => p.Product_ID === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const targetSKU = db.products[idx].SKU;
    db.products.splice(idx, 1);
    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Deleted product SKU: ${targetSKU}`, 'Product');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid action parameter' });
});

// Import Products endpoint (Bulk insertion / upsert)
app.post('/api/products/import', (req, res) => {
  const { products, user } = req.body;
  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid or empty products array for import' });
  }

  const db = readDatabase();
  let created = 0;
  let updated = 0;

  for (const p of products) {
    if (!p.SKU || !p.Product_Name) continue;

    const existingIdx = db.products.findIndex((prod: Product) => prod.SKU === p.SKU);
    if (existingIdx !== -1) {
      db.products[existingIdx] = {
        ...db.products[existingIdx],
        Product_Name: p.Product_Name,
        Category: p.Category || db.products[existingIdx].Category,
        Variant: p.Variant || db.products[existingIdx].Variant,
        Color: p.Color || db.products[existingIdx].Color,
        Size: p.Size || db.products[existingIdx].Size,
        Cost_Price: p.Cost_Price !== undefined ? Number(p.Cost_Price) : db.products[existingIdx].Cost_Price,
        Selling_Price: p.Selling_Price !== undefined ? Number(p.Selling_Price) : db.products[existingIdx].Selling_Price,
        Current_Stock: p.Current_Stock !== undefined ? Number(p.Current_Stock) : db.products[existingIdx].Current_Stock,
        Minimum_Stock: p.Minimum_Stock !== undefined ? Number(p.Minimum_Stock) : db.products[existingIdx].Minimum_Stock,
        Status: p.Status || db.products[existingIdx].Status
      };
      updated++;
    } else {
      const nextIdNum = db.products.length + 1;
      const prodId = `PROD-${String(nextIdNum).padStart(3, '0')}`;
      db.products.push({
        Product_ID: prodId,
        SKU: p.SKU,
        Barcode: p.SKU,
        QR_Code: p.SKU,
        Product_Name: p.Product_Name,
        Category: p.Category || 'Celamis',
        Variant: p.Variant || 'All Size',
        Color: p.Color || 'Natural',
        Size: p.Size || 'All Size',
        Cost_Price: p.Cost_Price !== undefined ? Number(p.Cost_Price) : 20000,
        Selling_Price: p.Selling_Price !== undefined ? Number(p.Selling_Price) : 40000,
        Current_Stock: p.Current_Stock !== undefined ? Number(p.Current_Stock) : 0,
        Minimum_Stock: p.Minimum_Stock !== undefined ? Number(p.Minimum_Stock) : 10,
        Status: 'Active'
      });
      created++;
    }
  }

  saveDatabase(db);
  appendAuditLog(user.name, user.role, `Imported products: ${created} created, ${updated} updated`, 'Product');
  res.json({ success: true, created, updated });
});

// 4. CUSTOMER MASTER CRUD
app.post('/api/customers', (req, res) => {
  const { action, customer, user, id } = req.body;
  const db = readDatabase();

  if (action === 'CREATE') {
    const nextIdNum = db.customers.length + 1;
    const custId = `CUST-${String(nextIdNum).padStart(3, '0')}`;

    const newCustomer: Customer = {
      Customer_ID: custId,
      Customer_Name: customer.Customer_Name,
      Customer_Type: customer.Customer_Type,
      Phone: customer.Phone || '-',
      Email: customer.Email || '-',
      Address: customer.Address || '-',
      City: customer.City || '-',
      Status: customer.Status || 'Active'
    };

    db.customers.push(newCustomer);
    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Created customer: ${newCustomer.Customer_Name}`, 'Customer');
    return res.json({ success: true, customer: newCustomer });
  }

  if (action === 'UPDATE') {
    const idx = db.customers.findIndex((c: Customer) => c.Customer_ID === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    db.customers[idx] = {
      ...db.customers[idx],
      Customer_Name: customer.Customer_Name,
      Customer_Type: customer.Customer_Type,
      Phone: customer.Phone,
      Email: customer.Email,
      Address: customer.Address,
      City: customer.City,
      Status: customer.Status
    };

    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Updated customer: ${customer.Customer_Name}`, 'Customer');
    return res.json({ success: true, customer: db.customers[idx] });
  }

  if (action === 'DELETE') {
    const idx = db.customers.findIndex((c: Customer) => c.Customer_ID === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const name = db.customers[idx].Customer_Name;
    db.customers.splice(idx, 1);
    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Deleted customer: ${name}`, 'Customer');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid customer action' });
});

// 5. INVENTORY & TRANSACTION LOGIC

// STOCK IN
app.post('/api/inventory/stock-in', (req, res) => {
  const { sku, qty, notes, user, source_type, quality_type } = req.body;
  if (!sku || !qty) {
    return res.status(400).json({ error: 'SKU and Quantity are required' });
  }

  const db = readDatabase();
  const product = db.products.find((p: Product) => p.SKU === sku);
  if (!product) {
    return res.status(404).json({ error: `Product with SKU ${sku} does not exist.` });
  }

  // Increment stock ONLY if quality is Good
  const isGood = quality_type !== 'Reject';
  if (isGood) {
    product.Current_Stock = (product.Current_Stock || 0) + Number(qty);
  }

  // Log transaction
  const nextTxNum = db.stockIn.length + 1;
  const transactionId = `STK-IN-${String(nextTxNum).padStart(4, '0')}`;
  const newTx: StockIn = {
    Transaction_ID: transactionId,
    Date: new Date().toISOString(),
    SKU: sku,
    Product_Name: product.Product_Name,
    Qty: Number(qty),
    Notes: notes || '',
    Source_Type: source_type || 'Konveksi',
    Quality_Type: quality_type || 'Good'
  };

  db.stockIn.unshift(newTx);
  saveDatabase(db);

  const auditMsg = `Stock In: +${qty} [${source_type || 'Konveksi'} - ${quality_type || 'Good'}] for SKU ${sku} (${product.Product_Name})`;
  appendAuditLog(user.name, user.role, auditMsg, 'WMS');
  res.json({ success: true, transaction: newTx, currentStock: product.Current_Stock });
});

// STOCK OUT
app.post('/api/inventory/stock-out', (req, res) => {
  const { sku, customer, qty, notes, user, destination_type, quality_type } = req.body;
  if (!sku || !qty) {
    return res.status(400).json({ error: 'SKU and Quantity are required' });
  }

  const db = readDatabase();
  const product = db.products.find((p: Product) => p.SKU === sku);
  if (!product) {
    return res.status(404).json({ error: `Product with SKU ${sku} does not exist.` });
  }

  // Decrement stock
  product.Current_Stock = Math.max(0, (product.Current_Stock || 0) - Number(qty));

  // Log transaction
  const nextTxNum = db.stockOut.length + 1;
  const transactionId = `STK-OUT-${String(nextTxNum).padStart(4, '0')}`;
  const newTx: StockOut = {
    Transaction_ID: transactionId,
    Date: new Date().toISOString(),
    SKU: sku,
    Product_Name: product.Product_Name,
    Customer: customer || 'General Out',
    Qty: Number(qty),
    Notes: notes || '',
    Destination_Type: destination_type || 'Sales',
    Quality_Type: quality_type || 'Good'
  };

  db.stockOut.unshift(newTx);
  saveDatabase(db);

  const auditMsg = `Stock Out: -${qty} [${destination_type || 'Sales'} - ${quality_type || 'Good'}] for SKU ${sku} (${product.Product_Name})`;
  appendAuditLog(user.name, user.role, auditMsg, 'WMS');
  res.json({ success: true, transaction: newTx, currentStock: product.Current_Stock });
});

// 6. STOCK OPNAME BULANAN
app.post('/api/inventory/stock-opname', (req, res) => {
  const { month, sku, physicalStock, user } = req.body;
  if (!month || !sku || physicalStock === undefined) {
    return res.status(400).json({ error: 'Month, SKU, and Physical Stock count are required' });
  }

  const db = readDatabase();
  const product = db.products.find((p: Product) => p.SKU === sku);
  if (!product) {
    return res.status(404).json({ error: `Product with SKU ${sku} not found.` });
  }

  const systemStock = product.Current_Stock || 0;
  const pCount = Number(physicalStock);
  const difference = pCount - systemStock;

  // Build stock opname entry
  const nextOpId = `OPN-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;
  const opnameEntry: StockOpname = {
    Opname_ID: nextOpId,
    Month: month,
    SKU: sku,
    Product_Name: product.Product_Name,
    System_Stock: systemStock,
    Physical_Stock: pCount,
    Difference: difference,
    Date: new Date().toISOString()
  };

  // Adjust current stock to match physical count
  product.Current_Stock = pCount;

  db.stockOpname.unshift(opnameEntry);
  saveDatabase(db);

  appendAuditLog(
    user.name, 
    user.role, 
    `Stock Opname [${month}]: SKU ${sku} count as ${pCount} (Diff: ${difference >= 0 ? '+' : ''}${difference})`, 
    'WMS'
  );

  res.json({ success: true, entry: opnameEntry, currentStock: pCount });
});

// 7. ORDER MANAGEMENT SYSTEM (OMS)
app.post('/api/orders', (req, res) => {
  const { action, order, user, orderNumber } = req.body;
  const db = readDatabase();

  if (action === 'CREATE') {
    // Generate Order Number: ORD-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const uniqueOrders = Array.from(new Set(db.orders.map((o: any) => o.Order_Number)));
    const categoryCount = uniqueOrders.filter((num: string) => num.startsWith(`ORD-${dateStr}`)).length;
    const ordNum = `ORD-${dateStr}-${String(categoryCount + 1).padStart(4, '0')}`;

    const itemsToCreate = [];
    
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      // Multiple items mode
      for (const item of order.items) {
        const productSku = item.SKU;
        const productItem = db.products.find((p: Product) => p.SKU === productSku);
        if (!productItem) {
          return res.status(404).json({ error: `Product with SKU ${productSku} not found.` });
        }
        const qtyVal = Number(item.Qty);
        const priceVal = Number(item.Price || productItem.Selling_Price);
        const totalVal = qtyVal * priceVal;

        const newOrder: Order = {
          Order_Number: ordNum,
          Order_Date: new Date().toISOString(),
          Customer: order.Customer,
          Channel: order.Channel,
          SKU: productSku,
          Product: productItem.Product_Name,
          Qty: qtyVal,
          Price: priceVal,
          Total: totalVal,
          Status: order.Status || 'New Order'
        };

        // Stock reduction
        if (['New Order', 'Processing', 'Picking', 'Packing', 'Ready To Ship', 'Shipped', 'Completed'].includes(newOrder.Status)) {
          if (productItem.Current_Stock < qtyVal) {
            productItem.Current_Stock = Math.max(0, productItem.Current_Stock - qtyVal);
          } else {
            productItem.Current_Stock -= qtyVal;
          }
        }
        itemsToCreate.push(newOrder);
      }
    } else {
      // Single item mode (fallback)
      const productSku = order.SKU;
      const productItem = db.products.find((p: Product) => p.SKU === productSku);
      if (!productItem) {
        return res.status(404).json({ error: `Product with SKU ${productSku} not found.` });
      }

      const qtyVal = Number(order.Qty);
      const priceVal = Number(order.Price || productItem.Selling_Price);
      const totalVal = qtyVal * priceVal;

      const newOrder: Order = {
        Order_Number: ordNum,
        Order_Date: new Date().toISOString(),
        Customer: order.Customer,
        Channel: order.Channel,
        SKU: productSku,
        Product: productItem.Product_Name,
        Qty: qtyVal,
        Price: priceVal,
        Total: totalVal,
        Status: order.Status || 'New Order'
      };

      if (['New Order', 'Processing', 'Picking', 'Packing', 'Ready To Ship', 'Shipped', 'Completed'].includes(newOrder.Status)) {
        if (productItem.Current_Stock < qtyVal) {
          productItem.Current_Stock = Math.max(0, productItem.Current_Stock - qtyVal);
        } else {
          productItem.Current_Stock -= qtyVal;
        }
      }
      itemsToCreate.push(newOrder);
    }

    // Unshift items to DB so newer items are placed properly
    for (let i = itemsToCreate.length - 1; i >= 0; i--) {
      db.orders.unshift(itemsToCreate[i]);
    }

    const firstOrder = itemsToCreate[0];
    // If 'Completed' or 'Shipped', let's also auto-create standard Shipping entry if requested
    if (firstOrder.Status === 'Shipped' || firstOrder.Status === 'Ready To Ship') {
      const shipNum = `TRK-${Date.now().toString().slice(-6)}`;
      db.shipping.push({
        Tracking_Number: shipNum,
        Courier: 'JNE Express',
        Order_Number: ordNum,
        Shipping_Date: new Date().toISOString(),
        Status: firstOrder.Status === 'Shipped' ? 'In Transit' : 'Waiting Pickup'
      });
    }

    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Created sales order ${ordNum} with ${itemsToCreate.length} items, channel: ${order.Channel}`, 'OMS');
    return res.json({ success: true, order: firstOrder });
  }

  if (action === 'UPDATE_STATUS') {
    const matchedOrders = db.orders.filter((o: Order) => o.Order_Number === orderNumber);
    if (!matchedOrders.length) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const newStatus = order.Status as OrderStatus;
    const oldStatus = matchedOrders[0].Status;

    // Adjusting stock based on state transactions:
    // If transitioning from Cancelled / Draft to active sales states (New Order, Processing, etc.) -> reduce stock
    // If transitioning to Cancelled from active sales states -> restore stock
    matchedOrders.forEach((o: Order) => {
      const prod = db.products.find((p: Product) => p.SKU === o.SKU);
      
      const wasStockDecremented = !['Draft', 'Cancelled'].includes(oldStatus);
      const isStockNowDecremented = !['Draft', 'Cancelled'].includes(newStatus);

      if (prod) {
        if (wasStockDecremented && !isStockNowDecremented) {
          // Cancelled/Drafted - restore stock
          prod.Current_Stock += o.Qty;
        } else if (!wasStockDecremented && isStockNowDecremented) {
          // Activated - decrement stock
          prod.Current_Stock = Math.max(0, prod.Current_Stock - o.Qty);
        }
      }

      o.Status = newStatus;
    });

    // Handle Shipping creation on OMS Workflow transitions where relevant
    if (newStatus === 'Shipped') {
      // Find if already shipping exists, else create
      const exists = db.shipping.some((s: Shipping) => s.Order_Number === orderNumber);
      if (!exists) {
        db.shipping.push({
          Tracking_Number: `TRK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*10)}`,
          Courier: order.Courier || 'Wahana',
          Order_Number: orderNumber,
          Shipping_Date: new Date().toISOString(),
          Status: 'In Transit'
        });
      } else {
        const item = db.shipping.find((s: Shipping) => s.Order_Number === orderNumber);
        if (item) {
          item.Status = 'In Transit';
          item.Courier = order.Courier || item.Courier;
          item.Tracking_Number = order.Tracking_Number || item.Tracking_Number;
        }
      }
    }

    if (newStatus === 'Packing') {
      // Record packing checklist confirmation in logs
      appendAuditLog(user.name, user.role, `Verified checklist and packed order: ${orderNumber}`, 'OMS');
    }

    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Changed status of Order ${orderNumber} from "${oldStatus}" to "${newStatus}"`, 'OMS');
    return res.json({ success: true });
  }

  if (action === 'DELETE') {
    const lengthBefore = db.orders.length;
    db.orders = db.orders.filter((o: Order) => o.Order_Number !== orderNumber);
    if (db.orders.length === lengthBefore) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Deleted Order ${orderNumber}`, 'OMS');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid order action' });
});

// 8. SHIPPING MANAGEMENT
app.post('/api/shipping', (req, res) => {
  const { action, shipping, user } = req.body;
  const db = readDatabase();

  if (action === 'UPSERT') {
    const existingIdx = db.shipping.findIndex((s: Shipping) => s.Order_Number === shipping.Order_Number);
    
    const shippingRecord: Shipping = {
      Tracking_Number: shipping.Tracking_Number,
      Courier: shipping.Courier,
      Order_Number: shipping.Order_Number,
      Shipping_Date: shipping.Shipping_Date || new Date().toISOString(),
      Status: shipping.Status || 'Waiting Pickup'
    };

    if (existingIdx !== -1) {
      db.shipping[existingIdx] = shippingRecord;
    } else {
      db.shipping.push(shippingRecord);
    }

    // Also update matching Order status to reflect shipping status changes
    const matchedOrders = db.orders.filter((o: Order) => o.Order_Number === shipping.Order_Number);
    if (matchedOrders.length) {
      matchedOrders.forEach((o: Order) => {
        if (shippingRecord.Status === 'Delivered') {
          o.Status = 'Completed';
        } else if (shippingRecord.Status === 'In Transit') {
          o.Status = 'Shipped';
        }
      });
    }

    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Updated shipping record for order ${shipping.Order_Number} (${shippingRecord.Courier} - ${shippingRecord.Tracking_Number})`, 'Shipping');
    return res.json({ success: true, shipping: shippingRecord });
  }

  res.status(400).json({ error: 'Invalid shipping action' });
});

// 9. CONFIGURATION & SHEET SYNCHRONIZATION
app.post('/api/settings/sheets-config', (req, res) => {
  const { scriptUrl, spreadsheetId, autoSync, user } = req.body;
  const db = readDatabase();
  
  db.sheetsConfig = {
    scriptUrl: scriptUrl || "",
    spreadsheetId: spreadsheetId || "",
    isLinked: !!scriptUrl,
    autoSync: !!autoSync
  };

  saveDatabase(db);
  appendAuditLog(user.name, user.role, `Configured Google Sheets connection`, 'System');
  res.json({ success: true, config: db.sheetsConfig });
});

// Sync data simulation (and remote posting if configured)
app.post('/api/settings/sync-now', async (req, res) => {
  const { user } = req.body;
  const db = readDatabase();

  let successMessage = "";
  if (db.sheetsConfig.isLinked && db.sheetsConfig.scriptUrl) {
    appendAuditLog(user.name, user.role, `Triggered manual synchronisation push/pull of Google Sheets data`, 'System');
    const success = await syncToGoogleSheets(db);
    if (success) {
      successMessage = `Successfully synchronized WMS & OMS tables dynamically with Google Spreadsheet ID ${db.sheetsConfig.spreadsheetId}`;
      return res.json({ success: true, message: successMessage });
    } else {
      return res.status(500).json({ 
        error: "Gagal menyinkronkan data dengan Google Sheets. Pastikan Web App URL aktif, dipublikasikan dengan akses 'Anyone', dan Spreadsheet ID sudah tepat." 
      });
    }
  } else {
    successMessage = "Database lokal berhasil disinkronkan dan disimpan. Hubungkan Webhook Google Sheet Anda di Pengaturan untuk sinkronisasi langsung secara real-time.";
    appendAuditLog(user.name, user.role, `Triggered manual database save confirmation`, 'System');
    return res.json({ success: true, message: successMessage });
  }
});

// 10. USER MANAGEMENT (OWNER ONLY)
app.post('/api/users', (req, res) => {
  const { action, targetUser, user, id } = req.body;
  const db = readDatabase();

  if (user.role !== 'OWNER') {
    return res.status(403).json({ error: 'Access denied: Only OWNER can manage users.' });
  }

  if (action === 'CREATE') {
    const nextIdNum = db.users.length + 1;
    const uid = `USR-${String(nextIdNum).padStart(3, '0')}`;

    if (db.users.some((u: User) => u.Email.toLowerCase() === targetUser.Email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const newUser: User = {
      User_ID: uid,
      Full_Name: targetUser.Full_Name,
      Email: targetUser.Email,
      Password_Hash: hashPassword(targetUser.Password || "alina123"),
      Role: targetUser.Role || 'ADMIN',
      Status: targetUser.Status || 'Active',
      Last_Login: '',
      Created_Date: new Date().toISOString(),
      Permissions: targetUser.Permissions || ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
    };

    db.users.push(newUser);
    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Created User: ${newUser.Full_Name} (${newUser.Role})`, 'Security');
    return res.json({ success: true, user: newUser });
  }

  if (action === 'UPDATE') {
    const idx = db.users.findIndex((u: User) => u.User_ID === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const current = db.users[idx];
    
    // Prevent email duplicates across other users
    if (targetUser.Email !== current.Email && db.users.some((u: User) => u.Email.toLowerCase() === targetUser.Email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already taken.' });
    }

    db.users[idx] = {
      ...current,
      Full_Name: targetUser.Full_Name,
      Email: targetUser.Email,
      Role: targetUser.Role,
      Status: targetUser.Status,
      Password_Hash: targetUser.Password ? hashPassword(targetUser.Password) : current.Password_Hash,
      Permissions: targetUser.Permissions || current.Permissions || ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
    };

    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Updated User details for: ${targetUser.Full_Name}`, 'Security');
    return res.json({ success: true });
  }

  if (action === 'DELETE') {
    const idx = db.users.findIndex((u: User) => u.User_ID === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const name = db.users[idx].Full_Name;
    if (id === 'USR-001') {
      return res.status(400).json({ error: 'Cannot delete default primary owner account' });
    }

    db.users.splice(idx, 1);
    saveDatabase(db);
    appendAuditLog(user.name, user.role, `Deleted user account: ${name}`, 'Security');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid user action' });
});


// ----------------------------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------------------------------------
async function startServer() {
  // Jika berjalan pada ekosistem Vercel Serverless, biarkan router Vercel melayani static files,
  // Express hanya berperan sebagai API gateway mikro tanpa memblokir port (prevent port listen)
  if (process.env.VERCEL) {
    console.log("ALINA running in Vercel Serverless environment.");
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ALINA Enterprise running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
