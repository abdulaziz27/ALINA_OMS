/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { User, Product, Customer, StockIn, StockOut, StockOpname, Order, Shipping, ActivityLog, SheetsConfig, OrderStatus } from '../../src/types.ts';


export const IS_VERCEL = !!process.env.VERCEL;
export const BUNDLED_DB_FILE = path.join(process.cwd(), 'db.json');
export const DB_FILE = IS_VERCEL 
  ? path.join('/tmp', 'db.json')
  : BUNDLED_DB_FILE;



// Helper to hash password using SHA-256
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Default/Initial database template structure
const DEFAULT_DB = {
  users: [
    {
      User_ID: "USR-001",
      Full_Name: "Alina Owner",
      Email: "owner@alina.com",
      Password_Hash: hashPassword("HIJxF1N4"),
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
      Product_Name: "Jilbab Woolpeach Pad M Dusty Violet",
      Category: "Jilbab Woolpeach Pad",
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
      Product_Name: "Jilbab Wollycrepe Pad L Blush Pink",
      Category: "Jilbab Wollycrepe Pad",
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
      Product_Name: "Jilbab Woolpeach Pad M Dusty Violet",
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
      Product: "Jilbab Wollycrepe Pad L Blush Pink",
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
export function readDatabase() {
  try {
    if (IS_VERCEL) {
      if (!fs.existsSync(DB_FILE)) {
        console.log("Database file doesn't exist in /tmp. Attempting to seed or copy bundled database...");
        if (fs.existsSync(BUNDLED_DB_FILE)) {
          try {
            const bundledData = fs.readFileSync(BUNDLED_DB_FILE, 'utf8');
            fs.writeFileSync(DB_FILE, bundledData, 'utf8');
            console.log("Successfully copied seed database to /tmp/db.json");
          } catch (copyErr) {
            console.error("Failed to copy bundled db.json to /tmp/db.json, fallback to DEFAULT_DB", copyErr);
            fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
          }
        } else {
          console.log("No bundled db.json found. Creating new empty database in /tmp/db.json...");
          fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
        }
      }
    } else {
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      }
    }

    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    
    // Automatically migrate owner password in existing db.json to the new HIJxF1N4 password
    if (parsed.users && Array.isArray(parsed.users)) {
      const owner = parsed.users.find((u: any) => u.Email.toLowerCase() === 'owner@alina.com');
      if (owner && (owner.Password_Hash === hashPassword("owner123") || !owner.Password_Hash)) {
        console.log("[Self-Healing Engine] Migrating owner password in db.json to HIJxF1N4...");
        owner.Password_Hash = hashPassword("HIJxF1N4");
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf8');
      }
    }
    
    // Dedup Product_IDs to fix PROD-003 duplicates
    if (parsed.products && Array.isArray(parsed.products)) {
      const seenIds = new Set();
      const duplicates: any[] = [];
      let hasDups = false;
      parsed.products.forEach((p: any) => {
        if (!p.Product_ID || seenIds.has(p.Product_ID)) {
          duplicates.push(p);
          hasDups = true;
        } else {
          seenIds.add(p.Product_ID);
        }
      });
      let nextId = 1;
      duplicates.forEach((p: any) => {
        while(seenIds.has(`PROD-${String(nextId).padStart(3, '0')}`)) {
          nextId++;
        }
        p.Product_ID = `PROD-${String(nextId).padStart(3, '0')}`;
        seenIds.add(p.Product_ID);
      });
      if (hasDups) {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf8');
        console.log("Auto-healed duplicate Product_IDs in db.json");
      }
    }
    
    return parsed;
  } catch (error) {
    console.error("Failed to read database file:", error);
    return DEFAULT_DB;
  }
}

// Lock to prevent stale pulls from Google Sheets
let syncLockTimestamp = 0;
let pendingPush = false;

export async function syncToGoogleSheets(db: any): Promise<boolean> {
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
    
    // Update the lock immediately after the push completes
    syncLockTimestamp = Date.now();
    
    if (response.ok) {
      console.log("Successfully synchronized with Google Sheets!");
      pendingPush = false;
      return true;
    } else {
      console.error(`Failed to sync with Google Sheets, response status: ${response.status}`);
      pendingPush = true;
      return false;
    }
  } catch (error) {
    if (error && (error.cause?.code === 'ECONNRESET' || error.cause?.code === 'ENOTFOUND')) {
      console.warn("Background push to Google Sheets skipped: Network unreachable.");
    } else {
      console.error("Failed to post sync to Google Sheets script:", error);
    }
    pendingPush = true;
    return false;
  }
}

export async function pullFromGoogleSheets(db: any, throwOnError: boolean = false): Promise<boolean> {
  if (!db.sheetsConfig || !db.sheetsConfig.isLinked || !db.sheetsConfig.scriptUrl) {
    return false;
  }
  
  if (pendingPush) {
    console.log(`[Sync Engine] Pending local pushes exist. Aborting pull to prevent overwriting local data with stale remote data.`);
    syncToGoogleSheets(db).catch(e => console.error("Retry background push failed:", e));
    return false;
  }
  
  // Capture pull start time to detect if a push happened while this was running or queued
  const pullStartTime = Date.now();
  
  try {
    const url = `${db.sheetsConfig.scriptUrl}?action=readAll&t=${Date.now()}`;
    console.log(`Pulling database from Google Sheets: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to pull from Google Sheets, response status: ${response.status}`);
      return false;
    }
    
    // Safety lock: if a push happened while this fetch was executing or if it's very recent, discard this read 
    // because Google Sheets might return stale data, and we don't want to overwrite our fresh local database!
    // Added a 25-second buffer because Apps Script writes are not instantly coherent.
    if (pullStartTime <= syncLockTimestamp + 25000) {
      console.log(`[Sync Engine] Discarding pulled Google Sheets data (stale/recent push). A push occurred recently!`);
      return false;
    }
    
    const text = await response.text();
    if (!text || text.trim() === "") {
      console.error("Received an empty response from Google Sheets.");
      throw new Error("Received an empty response from Google Sheets. Ensure your Google Apps Script is correctly returning the database JSON.");
    }

    if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
      console.error(`Google Sheets URL returned HTML content instead of JSON. Ensure your Apps Script Web App is deployed with Access set to 'Anyone' and executed as 'Me'.`);
      throw new Error("Google Sheets returned HTML instead of JSON. This usually indicates your Google Apps Script Web App is not authorized or not set to 'Who has access: Anyone'.");
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e: any) {
      console.error(`Failed to parse JSON from Google Sheets. Raw snippet: ${text.substring(0, 300)}`);
      throw new Error(`Failed to parse JSON response. The server returned invalid data (Snippet: ${text.substring(0, 100).replace(/\r?\n|\r/g, " ")}...)`);
    }

    if (!data) {
      console.error("No data received from Google Sheets pull");
      return false;
    }

    let modified = false;

    // Helper to sanitize pulled array items (e.g. converting numeric strings to numbers)
    const parseNumber = (v: any) => {
      if (v === "" || v === null || v === undefined) return 0;
      const num = Number(v);
      return isNaN(num) ? v : num;
    };

    if (data.Products && Array.isArray(data.Products) && data.Products.length > 0) {
      const validProducts = data.Products.filter((p: any) => p.Product_ID || p.SKU || p.product_ID || p.sku).map((p: any) => ({
        Product_ID: p.Product_ID || p.product_ID || '',
        SKU: p.SKU || p.sku || '',
        Barcode: p.Barcode || p.barcode || p.SKU || '',
        QR_Code: p.QR_Code || p.qr_Code || p.SKU || '',
        Product_Name: p.Product_Name || p.product_Name || '',
        Category: p.Category || p.category || '',
        Variant: p.Variant || p.variant || '',
        Color: p.Color || p.color || '',
        Size: p.Size || p.size || '',
        Cost_Price: parseNumber(p.Cost_Price),
        Selling_Price: parseNumber(p.Selling_Price),
        Current_Stock: parseNumber(p.Current_Stock),
        Minimum_Stock: parseNumber(p.Minimum_Stock),
        Status: p.Status || 'Active'
      }));
      
      if (validProducts.length > 0) {
        // Enforce unique Product_IDs
        const seenIds = new Set();
        const duplicates: any[] = [];
        validProducts.forEach((p: any) => {
          if (!p.Product_ID || seenIds.has(p.Product_ID)) {
            duplicates.push(p);
          } else {
            seenIds.add(p.Product_ID);
          }
        });
        let nextId = 1;
        duplicates.forEach((p: any) => {
          while(seenIds.has(`PROD-${String(nextId).padStart(3, '0')}`)) {
            nextId++;
          }
          p.Product_ID = `PROD-${String(nextId).padStart(3, '0')}`;
          seenIds.add(p.Product_ID);
        });
        db.products = validProducts;
        modified = true;
      } else {
        console.warn("Pulled data.Products was empty. Skipping overwrite to prevent data loss.");
      }
    }

    if (data.Customers && Array.isArray(data.Customers) && data.Customers.length > 0) {
      db.customers = data.Customers.filter((c: any) => c.Customer_ID || c.Customer_Name).map((c: any) => ({
        Customer_ID: c.Customer_ID || '',
        Customer_Name: c.Customer_Name || '',
        Customer_Type: c.Customer_Type || 'Reseller',
        Phone: c.Phone || '',
        Email: c.Email || '',
        Address: c.Address || '',
        City: c.City || '',
        Status: c.Status || 'Active'
      }));
      modified = true;
    }

    if (data.Stock_In && Array.isArray(data.Stock_In) && data.Stock_In.length > 0) {
      db.stockIn = data.Stock_In.filter((s: any) => s.Transaction_ID || s.SKU).map((s: any) => ({
        Transaction_ID: s.Transaction_ID || '',
        Date: s.Date || '',
        SKU: s.SKU || '',
        Product_Name: s.Product_Name || '',
        Qty: parseNumber(s.Qty),
        Notes: s.Notes || ''
      }));
      modified = true;
    }

    if (data.Stock_Out && Array.isArray(data.Stock_Out) && data.Stock_Out.length > 0) {
      db.stockOut = data.Stock_Out.filter((s: any) => s.Transaction_ID || s.SKU).map((s: any) => ({
        Transaction_ID: s.Transaction_ID || '',
        Date: s.Date || '',
        SKU: s.SKU || '',
        Product_Name: s.Product_Name || '',
        Customer: s.Customer || '',
        Qty: parseNumber(s.Qty),
        Notes: s.Notes || ''
      }));
      modified = true;
    }

    if (data.Stock_Opname && Array.isArray(data.Stock_Opname) && data.Stock_Opname.length > 0) {
      db.stockOpname = data.Stock_Opname.filter((s: any) => s.Opname_ID || s.SKU).map((s: any) => ({
        Opname_ID: s.Opname_ID || '',
        Month: s.Month || '',
        SKU: s.SKU || '',
        Product_Name: s.Product_Name || '',
        System_Stock: parseNumber(s.System_Stock),
        Physical_Stock: parseNumber(s.Physical_Stock),
        Difference: parseNumber(s.Difference),
        Date: s.Date || ''
      }));
      modified = true;
    }

    if (data.Orders && Array.isArray(data.Orders) && data.Orders.length > 0) {
      db.orders = data.Orders.filter((o: any) => o.Order_Number || o.Customer).map((o: any) => ({
        Order_Number: o.Order_Number || '',
        Order_Date: o.Order_Date || '',
        Customer: o.Customer || '',
        Channel: o.Channel || 'Retail',
        SKU: o.SKU || '',
        Product: o.Product || '',
        Qty: parseNumber(o.Qty),
        Price: parseNumber(o.Price),
        Total: parseNumber(o.Total),
        Status: o.Status || 'New Order'
      }));
      modified = true;
    }

    if (data.Shipping && Array.isArray(data.Shipping) && data.Shipping.length > 0) {
      db.shipping = data.Shipping.filter((s: any) => s.Tracking_Number || s.Order_Number).map((s: any) => ({
        Tracking_Number: s.Tracking_Number || '',
        Courier: s.Courier || '',
        Order_Number: s.Order_Number || '',
        Shipping_Date: s.Shipping_Date || '',
        Status: s.Status || 'In Transit'
      }));
      modified = true;
    }

    if (data.Users && Array.isArray(data.Users) && data.Users.length > 0) {
      // Find default owner account so we don't accidentally wipe its password hash from sheets
      const defaultOwner = db.users.find((u: any) => u.User_ID === 'USR-001');
      db.users = data.Users.filter((u: any) => u.User_ID || u.Email).map((u: any) => {
        const isOwner = u.User_ID === 'USR-001' || u.Email?.toLowerCase() === 'owner@alina.com';
        return {
          User_ID: u.User_ID || '',
          Full_Name: u.Full_Name || '',
          Email: u.Email || '',
          Password_Hash: u.Password_Hash || (isOwner && defaultOwner ? defaultOwner.Password_Hash : hashPassword("admin123")),
          Role: u.Role || (isOwner ? 'OWNER' : 'ADMIN'),
          Status: u.Status || 'Active',
          Last_Login: u.Last_Login || '',
          Created_Date: u.Created_Date || '',
          Permissions: typeof u.Permissions === 'string' ? JSON.parse(u.Permissions) : (u.Permissions || [])
        };
      });
      modified = true;
    }

    if (data.Activity_Log && Array.isArray(data.Activity_Log)) {
      db.activityLog = data.Activity_Log.filter((l: any) => l.Log_ID || l.Activity).map((l: any) => ({
        Log_ID: l.Log_ID || '',
        User_Name: l.User_Name || '',
        User_Role: l.User_Role || 'ADMIN',
        Activity: l.Activity || '',
        Module: l.Module || '',
        Timestamp: l.Timestamp || '',
        Device: l.Device || ''
      }));
      modified = true;
    }

    if (modified) {
      // Direct file write avoids the circular loop (bypasses triggerSheetsSyncIfNeeded)
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
      console.log("Successfully pulled and updated local db.json with Google Sheets state!");
      return true;
    }
    return false;
  } catch (error) {
    if (error && (error.cause?.code === 'ECONNRESET' || error.cause?.code === 'ENOTFOUND')) {
      console.warn("Background pull from Google Sheets skipped: Network unreachable (ECONNRESET/ENOTFOUND).");
    } else {
      console.error("Failed to pull from Google Sheets:", error);
    }
    if (throwOnError) {
      throw error;
    }
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
export function saveDatabase(data: typeof DEFAULT_DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    // Autosync on modification if autoSync is activated
    triggerSheetsSyncIfNeeded(data);
  } catch (error) {
    console.error("Failed to write to database file:", error);
  }
}

let hasBootstrappedFromSheets = false;

export async function readAndPullDatabase(): Promise<typeof DEFAULT_DB> {
  const db = readDatabase();
  // In Cloud Run (or Serverless), we MUST ALWAYS pull from Sheets on cold boot if linked, because the filesystem is wiped.
  const isServerless = true; // AI Studio / Cloud Run is always ephemeral
  const shouldPullOnBoot = (!hasBootstrappedFromSheets && db.sheetsConfig && db.sheetsConfig.isLinked && db.sheetsConfig.scriptUrl) && 
                           (isServerless || db.sheetsConfig.autoSync);
  
  if (shouldPullOnBoot) {
    try {
      console.log("[Sync Engine] Pulling latest state from Google Sheets during initial app boot...");
      hasBootstrappedFromSheets = true; // Mark as bootstrapped regardless of success to prevent loop
      await pullFromGoogleSheets(db);
      // Wait wait, if pullFromGoogleSheets returned true, it already wrote to fs!
      // So we must read it again to ensure we return the fresh state
      return readDatabase();
    } catch (err) {
      console.error("Failed to pull from Google Sheets during boot:", err);
    }
  }
  return db;
}

export async function saveDatabaseAndSync(data: typeof DEFAULT_DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    const shouldPushParams = data.sheetsConfig && data.sheetsConfig.isLinked && data.sheetsConfig.scriptUrl;
    const isServerless = true;
    if (shouldPushParams && (isServerless || data.sheetsConfig.autoSync)) {
      console.log("[Sync Engine] Synchronizing / pushing state to Google Sheets on mutation...");
      // Fire and forget to avoid delaying client response
      syncToGoogleSheets(data).catch(err => {
        console.error("Background sync to Google Sheets failed:", err);
      });
    }
  } catch (error) {
    console.error("Failed to write to database and sync:", error);
  }
}

// Log actions dynamically
export function appendAuditLog(userName: string, userRole: 'OWNER' | 'ADMIN', activity: string, module: string, userAgent?: string) {
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

