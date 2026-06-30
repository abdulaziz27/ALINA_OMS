import { User, Product, Customer, StockIn, StockOut, StockOpname, Order, Shipping, ActivityLog, SheetsConfig, OrderStatus, UserRole } from '../types.ts';

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem blocked or failed:", e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage.setItem blocked or failed:", e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.removeItem blocked or failed:", e);
    }
  }
};



export const DEFAULT_OFFLINE_DB = {
  users: [
    {
      User_ID: "USR-001",
      Full_Name: "Alina Owner",
      Email: "owner@alina.com",
      Password_Hash: "c570e667306851a91d3068d3daaeb637a292d2f2130b202345cff7f5d69b4bc2", // HIJxF1N4
      Password: "HIJxF1N4",
      Role: "OWNER",
      Status: "Active",
      Last_Login: "2026-06-08T07:40:00Z",
      Created_Date: "2026-01-01T00:00:00Z",
      Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
    },
    {
      User_ID: "USR-002",
      Full_Name: "Admin Operasional",
      Email: "admin@alina.com",
      Password_Hash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // admin123
      Password: "admin123",
      Role: "ADMIN",
      Status: "Active",
      Last_Login: "2026-06-08T07:30:00Z",
      Created_Date: "2026-01-02T00:00:00Z",
      Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
    }
  ],
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
      Retail_Price: 45000,
      Current_Stock: 120,
      Minimum_Stock: 30,
      Status: "Active"
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
      Retail_Price: 49000,
      Current_Stock: 85,
      Minimum_Stock: 25,
      Status: "Active"
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
      Retail_Price: 28000,
      Current_Stock: 10,
      Minimum_Stock: 20,
      Status: "Active"
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
      Retail_Price: 58000,
      Current_Stock: 140,
      Minimum_Stock: 15,
      Status: "Active"
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
      Retail_Price: 65000,
      Current_Stock: 18,
      Minimum_Stock: 25,
      Status: "Active"
    }
  ],
  customers: [
    {
      Customer_ID: "CUST-001",
      Customer_Name: "Rania Hijab Store",
      Customer_Type: "Reseller",
      Phone: "081234567890",
      Email: "rania@gmail.com",
      Address: "Kebayoran Baru No 12",
      City: "Jakarta Selatan",
      Status: "Active"
    },
    {
      Customer_ID: "CUST-002",
      Customer_Name: "Zahra Agen Busana",
      Customer_Type: "Agen",
      Phone: "082345678901",
      Email: "zahra.agen@yahoo.com",
      Address: "Ahmad Yani No. 99",
      City: "Bandung",
      Status: "Active"
    },
    {
      Customer_ID: "CUST-003",
      Customer_Name: "Aisyah Marketer",
      Customer_Type: "Marketer",
      Phone: "083456789012",
      Email: "aisyah_market@gmail.com",
      Address: "Kaliurang KM 7",
      City: "Yogyakarta",
      Status: "Active"
    }
  ],
  stockIn: [
    {
      Transaction_ID: "STK-IN-0001",
      Date: "2026-06-01T09:00:00Z",
      SKU: "ALN-CEL-0001",
      Product_Name: "Celamis All Size Pink Pastel",
      Qty: 100,
      Notes: "Produksi Batch A",
      Source_Type: "Konveksi",
      Quality_Type: "Good"
    }
  ],
  stockOut: [],
  stockOpname: [],
  orders: [
    {
      Order_Number: "ORD-20260608-0001",
      Order_Date: "2026-06-08T03:15:00Z",
      Customer: "Rania Hijab Store",
      Channel: "Reseller",
      SKU: "ALN-CEL-0001",
      Product: "Celamis All Size Pink Pastel",
      Qty: 8,
      Price: 45000,
      Total: 360000,
      Status: "New Order"
    }
  ],
  shipping: [],
  activityLog: [],
  sheetsConfig: {
    scriptUrl: "",
    spreadsheetId: "",
    isLinked: false,
    autoSync: false
  }
};

function getLocalDB() {
  const dbStr = localStorage.getItem('alina_local_full_db');
  if (!dbStr) {
    localStorage.setItem('alina_local_full_db', JSON.stringify(DEFAULT_OFFLINE_DB));
    return JSON.parse(JSON.stringify(DEFAULT_OFFLINE_DB));
  }
  try {
    return JSON.parse(dbStr);
  } catch (e) {
    localStorage.setItem('alina_local_full_db', JSON.stringify(DEFAULT_OFFLINE_DB));
    return JSON.parse(JSON.stringify(DEFAULT_OFFLINE_DB));
  }
}

export function saveLocalDB(db: any) {
  localStorage.setItem('alina_local_full_db', JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('alina_db_offline_update'));
}

export function appendOfflineLog(db: any, operator: string, role: string, message: string, category: string = 'Offline') {
  if (!db.activityLog) db.activityLog = [];
  db.activityLog.unshift({
    User_Name: operator,
    Role: role,
    Timestamp: new Date().toISOString(),
    Action: `[Offline] ${message}`,
    Category: category
  });
}

export let isOfflineForcedGlobal = false;

export async function handleOfflineApiRoute(url: string, init?: RequestInit): Promise<Response> {
  if (!isOfflineForcedGlobal) {
    isOfflineForcedGlobal = true;
    window.dispatchEvent(new CustomEvent('alina_offline_mode_detected'));
  }
  
  const db = getLocalDB();
  const path = url.split('?')[0];
  const method = init?.method?.toUpperCase() || 'GET';
  const body = init?.body ? JSON.parse(init.body as string) : {};

  if (path === '/api/db' && method === 'GET') {
    const safeUsers = db.users.map((u: any) => {
      const { Password_Hash, Password, ...rest } = u;
      return rest;
    });
    return new Response(JSON.stringify({ ...db, users: safeUsers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = db.users.find((u: any) => u.Email.toLowerCase() === email.toLowerCase());
    if (user) {
      const passCorrect = 
        (email.toLowerCase() === 'owner@alina.com' && password === 'HIJxF1N4') ||
        (email.toLowerCase() === 'admin@alina.com' && password === 'admin123') ||
        (user.Password && user.Password === password) ||
        !user.Password_Hash;

      if (passCorrect) {
        user.Last_Login = new Date().toISOString();
        appendOfflineLog(db, user.Full_Name, user.Role, 'Logged in successfully (Offline-First Mode)');
        saveLocalDB(db);

        const safeUser = {
          User_ID: user.User_ID,
          Full_Name: user.Full_Name,
          Email: user.Email,
          Role: user.Role,
          Status: user.Status,
          Last_Login: user.Last_Login,
          Permissions: user.Permissions || []
        };
        return new Response(JSON.stringify({ user: safeUser }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    return new Response(JSON.stringify({ error: 'Kredensial tidak valid di Mode Offline.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    const { userName, role } = body;
    if (userName) {
      appendOfflineLog(db, userName, role || 'Admin Gudang Alina', 'Logged out (Offline Mode)');
      saveLocalDB(db);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (path === '/api/products' && method === 'POST') {
    const { action, product, user, id } = body;
    if (action === 'CREATE') {
      const nextIdNum = db.products.length + 1;
      const prodId = `PROD-${String(nextIdNum).padStart(3, '0')}`;
      const newProduct = {
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
        Retail_Price: Number(product.Retail_Price),
        Current_Stock: Number(product.Current_Stock) || 0,
        Minimum_Stock: Number(product.Minimum_Stock) || 0,
        Status: product.Status || 'Active'
      };

      if (db.products.some((p: any) => p.SKU === newProduct.SKU)) {
        return new Response(JSON.stringify({ error: 'SKU sudah terdaftar dan wajib unik!' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      db.products.push(newProduct);
      appendOfflineLog(db, user.name, user.role, `Membuat produk baru (Offline): SKU ${newProduct.SKU}`, 'Product');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true, product: newProduct }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'UPDATE') {
      const idx = db.products.findIndex((p: any) => p.Product_ID === id);
      if (idx !== -1) {
        const item = db.products[idx];
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
          Retail_Price: Number(product.Retail_Price),
          Current_Stock: Number(product.Current_Stock),
          Minimum_Stock: Number(product.Minimum_Stock),
          Status: product.Status
        };
        appendOfflineLog(db, user.name, user.role, `Memperbarui produk (Offline): SKU ${product.SKU}`, 'Product');
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true, product: db.products[idx] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (action === 'DELETE') {
      const idx = db.products.findIndex((p: any) => p.Product_ID === id);
      if (idx !== -1) {
        const targetSKU = db.products[idx].SKU;
        db.products.splice(idx, 1);
        appendOfflineLog(db, user.name, user.role, `Menghapus produk (Offline): SKU ${targetSKU}`, 'Product');
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  if (path === '/api/products/import' && method === 'POST') {
    const { products: importedList, user } = body;
    let created = 0;
    let updated = 0;
    for (const p of importedList) {
      if (!p.SKU || !p.Product_Name) continue;
      const existingIdx = db.products.findIndex((prod: any) => prod.SKU === p.SKU);
      if (existingIdx !== -1) {
        db.products[existingIdx] = {
          ...db.products[existingIdx],
          Product_Name: p.Product_Name,
          Retail_Price: p.Retail_Price !== undefined ? Number(p.Retail_Price) : db.products[existingIdx].Retail_Price,
          Current_Stock: p.Current_Stock !== undefined ? Number(p.Current_Stock) : db.products[existingIdx].Current_Stock
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
          Retail_Price: p.Retail_Price !== undefined ? Number(p.Retail_Price) : 40000,
          Current_Stock: p.Current_Stock !== undefined ? Number(p.Current_Stock) : 0,
          Minimum_Stock: p.Minimum_Stock !== undefined ? Number(p.Minimum_Stock) : 10,
          Status: 'Active'
        });
        created++;
      }
    }
    appendOfflineLog(db, user.name, user.role, `Impor produk offline: ${created} dibuat, ${updated} diperbarui`, 'Product');
    saveLocalDB(db);
    return new Response(JSON.stringify({ success: true, created, updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (path === '/api/customers' && method === 'POST') {
    const { action, customer, user, id } = body;
    if (action === 'CREATE') {
      const nextIdNum = db.customers.length + 1;
      const custId = `CUST-${String(nextIdNum).padStart(3, '0')}`;
      const newCustomer = {
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
      appendOfflineLog(db, user.name, user.role, `Membuat pelanggan offline: ${newCustomer.Customer_Name}`, 'Customer');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true, customer: newCustomer }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'UPDATE') {
      const idx = db.customers.findIndex((c: any) => c.Customer_ID === id);
      if (idx !== -1) {
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
        appendOfflineLog(db, user.name, user.role, `Memperbarui pelanggan offline: ${customer.Customer_Name}`, 'Customer');
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true, customer: db.customers[idx] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (action === 'DELETE') {
      const idx = db.customers.findIndex((c: any) => c.ID === id || c.Customer_ID === id);
      if (idx !== -1) {
        const name = db.customers[idx].Customer_Name;
        db.customers.splice(idx, 1);
        appendOfflineLog(db, user.name, user.role, `Menghapus pelanggan offline: ${name}`, 'Customer');
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  if (path === '/api/inventory/stock-in' && method === 'POST') {
    const { sku, qty, notes, user, source_type, quality_type } = body;
    const prod = db.products.find((p: any) => p.SKU === sku);
    if (prod) {
      if (quality_type !== 'Reject') {
        prod.Current_Stock = (prod.Current_Stock || 0) + Number(qty);
      }
      const nextTxNum = db.stockIn.length + 1;
      const transactionId = `STK-IN-${String(nextTxNum).padStart(4, '0')}`;
      const newTx = {
        Transaction_ID: transactionId,
        Date: new Date().toISOString(),
        SKU: sku,
        Product_Name: prod.Product_Name,
        Qty: Number(qty),
        Notes: notes || '',
        Source_Type: source_type || 'Konveksi',
        Quality_Type: quality_type || 'Good'
      };
      db.stockIn.unshift(newTx);
      appendOfflineLog(db, user.name, user.role, `Stok Masuk Offline: +${qty} untuk SKU ${sku}`, 'WMS');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true, transaction: newTx, currentStock: prod.Current_Stock }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (path === '/api/inventory/stock-out' && method === 'POST') {
    const { sku, qty, customer, notes, user, destination_type, quality_type } = body;
    const prod = db.products.find((p: any) => p.SKU === sku);
    if (prod) {
      prod.Current_Stock = Math.max(0, (prod.Current_Stock || 0) - Number(qty));
      const nextTxNum = db.stockOut.length + 1;
      const transactionId = `STK-OUT-${String(nextTxNum).padStart(4, '0')}`;
      const newTx = {
        Transaction_ID: transactionId,
        Date: new Date().toISOString(),
        SKU: sku,
        Product_Name: prod.Product_Name,
        Customer: customer || 'General Out',
        Qty: Number(qty),
        Notes: notes || '',
        Destination_Type: destination_type || 'Sales',
        Quality_Type: quality_type || 'Good'
      };
      db.stockOut.unshift(newTx);
      appendOfflineLog(db, user.name, user.role, `Stok Keluar Offline: -${qty} untuk SKU ${sku}`, 'WMS');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true, transaction: newTx, currentStock: prod.Current_Stock }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (path === '/api/inventory/stock-opname' && method === 'POST') {
    const { month, sku, physicalStock, user } = body;
    const prod = db.products.find((p: any) => p.SKU === sku);
    if (prod) {
      const systemStock = prod.Current_Stock || 0;
      const diff = Number(physicalStock) - systemStock;
      prod.Current_Stock = Number(physicalStock);
      
      const nextOpId = `OPN-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;
      const opnameEntry = {
        Opname_ID: nextOpId,
        Month: month,
        SKU: sku,
        Product_Name: prod.Product_Name,
        System_Stock: systemStock,
        Physical_Stock: Number(physicalStock),
        Difference: diff,
        Date: new Date().toISOString()
      };

      db.stockOpname.unshift(opnameEntry);
      appendOfflineLog(db, user.name, user.role, `Stock Opname Offline [${month}]: SKU ${sku} (Diff: ${diff})`, 'WMS');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true, entry: opnameEntry, currentStock: prod.Current_Stock }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (path === '/api/orders' && method === 'POST') {
    const { action, order, user, orderNumber } = body;
    if (action === 'CREATE') {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const uniqueOrders = Array.from(new Set(db.orders.map((o: any) => o.Order_Number)));
      const categoryCount = uniqueOrders.filter((num: any) => num.startsWith(`ORD-${dateStr}`)).length;
      const ordNum = `ORD-${dateStr}-${String(categoryCount + 1).padStart(4, '0')}`;
      const itemsToCreate = [];

      if (order.items && Array.isArray(order.items) && order.items.length > 0) {
        for (const item of order.items) {
          const productSku = item.SKU;
          const productItem = db.products.find((p: any) => p.SKU === productSku);
          if (productItem) {
            const qtyVal = Number(item.Qty);
            const priceVal = Number(item.Price || productItem.Retail_Price);
            const totalVal = qtyVal * priceVal;

            const newOrder = {
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

            productItem.Current_Stock = Math.max(0, (productItem.Current_Stock || 0) - qtyVal);
            itemsToCreate.push(newOrder);
          }
        }
      } else {
        const productSku = order.SKU;
        const productItem = db.products.find((p: any) => p.SKU === productSku);
        if (productItem) {
          const qtyVal = Number(order.Qty);
          const priceVal = Number(order.Price || productItem.Retail_Price);
          const totalVal = qtyVal * priceVal;

          const newOrder = {
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

          productItem.Current_Stock = Math.max(0, (productItem.Current_Stock || 0) - qtyVal);
          itemsToCreate.push(newOrder);
        }
      }

      for (let i = itemsToCreate.length - 1; i >= 0; i--) {
        db.orders.unshift(itemsToCreate[i]);
      }

      if (itemsToCreate.length > 0) {
        const first = itemsToCreate[0];
        if (first.Status === 'Shipped' || first.Status === 'Ready To Ship') {
          db.shipping.push({
            Tracking_Number: `TRK-${Date.now().toString().slice(-6)}`,
            Courier: 'JNE Express',
            Order_Number: ordNum,
            Shipping_Date: new Date().toISOString(),
            Status: first.Status === 'Shipped' ? 'In Transit' : 'Waiting Pickup'
          });
        }
      }

      appendOfflineLog(db, user.name, user.role, `Membuat Pesanan Offline: ${ordNum}`, 'OMS');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true, order: itemsToCreate[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'UPDATE_STATUS') {
      const matched = db.orders.filter((o: any) => o.Order_Number === orderNumber);
      if (matched.length > 0) {
        const newStatus = order.Status;
        const oldStatus = matched[0].Status;

        matched.forEach((o: any) => {
          const prod = db.products.find((p: any) => p.SKU === o.SKU);
          const wasStockDecremented = !['Draft', 'Cancelled'].includes(oldStatus);
          const isStockNowDecremented = !['Draft', 'Cancelled'].includes(newStatus);
          if (prod) {
            if (wasStockDecremented && !isStockNowDecremented) {
              prod.Current_Stock += o.Qty;
            } else if (!wasStockDecremented && isStockNowDecremented) {
              prod.Current_Stock = Math.max(0, prod.Current_Stock - o.Qty);
            }
          }
          o.Status = newStatus;
        });

        if (newStatus === 'Shipped') {
          const exists = db.shipping.some((s: any) => s.Order_Number === orderNumber);
          if (!exists) {
            db.shipping.push({
              Tracking_Number: `TRK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 10)}`,
              Courier: order.Courier || 'Wahana',
              Order_Number: orderNumber,
              Shipping_Date: new Date().toISOString(),
              Status: 'In Transit'
            });
          } else {
            const shipItem = db.shipping.find((s: any) => s.Order_Number === orderNumber);
            if (shipItem) {
              shipItem.Status = 'In Transit';
              shipItem.Courier = order.Courier || shipItem.Courier;
              shipItem.Tracking_Number = order.Tracking_Number || shipItem.Tracking_Number;
            }
          }
        }

        appendOfflineLog(db, user.name, user.role, `Mengubah status Pesanan offline ${orderNumber}: ${oldStatus} -> ${newStatus}`, 'OMS');
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (action === 'DELETE') {
      db.orders = db.orders.filter((o: any) => o.Order_Number !== orderNumber);
      appendOfflineLog(db, user.name, user.role, `Menghapus Pesanan offline: ${orderNumber}`, 'OMS');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (path === '/api/shipping' && method === 'POST') {
    const { action, shipping: ship, user } = body;
    if (action === 'UPSERT') {
      const existingIdx = db.shipping.findIndex((s: any) => s.Order_Number === ship.Order_Number);
      const record = {
        Tracking_Number: ship.Tracking_Number,
        Courier: ship.Courier,
        Order_Number: ship.Order_Number,
        Shipping_Date: ship.Shipping_Date || new Date().toISOString(),
        Status: ship.Status || 'In Transit'
      };
      if (existingIdx !== -1) {
        db.shipping[existingIdx] = record;
      } else {
        db.shipping.push(record);
      }
      appendOfflineLog(db, user.name, user.role, `Update pengiriman offline: ${record.Tracking_Number}`, 'OMS');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (path === '/api/settings/sheets-config' && method === 'POST') {
    db.sheetsConfig = {
      scriptUrl: body.scriptUrl || '',
      spreadsheetId: body.spreadsheetId || '',
      autoSync: !!body.autoSync,
      isLinked: !!(body.scriptUrl && body.spreadsheetId),
      customLogoUrl: body.customLogoUrl || ''
    };
    appendOfflineLog(db, 'System', 'Admin', 'Menyimpan konfigurasi Google Sheets offline');
    saveLocalDB(db);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (path === '/api/settings/users' && method === 'POST') {
    const { action, user: targetUser, id, user: activeUser } = body;
    if (action === 'CREATE') {
      if (db.users.some((u: any) => u.Email.toLowerCase() === targetUser.Email.toLowerCase())) {
        return new Response(JSON.stringify({ error: 'Email sudah terdaftar!' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const nextIdNum = db.users.length + 1;
      const uid = `USR-${String(nextIdNum).padStart(3, '0')}`;
      const newUser = {
        User_ID: uid,
        Full_Name: targetUser.Full_Name,
        Email: targetUser.Email,
        Password: targetUser.Password || "alina123",
        Role: targetUser.Role || 'Admin Gudang Alina',
        Status: targetUser.Status || 'Active',
        Last_Login: '',
        Created_Date: new Date().toISOString(),
        Permissions: targetUser.Permissions || ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
      };
      db.users.push(newUser);
      appendOfflineLog(db, activeUser.name, activeUser.role, `Membuat Pengguna Offline: ${targetUser.Full_Name}`, 'Security');
      saveLocalDB(db);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'UPDATE') {
      const idx = db.users.findIndex((u: any) => u.User_ID === id);
      if (idx !== -1) {
        db.users[idx] = {
          ...db.users[idx],
          Full_Name: targetUser.Full_Name,
          Email: targetUser.Email,
          Role: targetUser.Role,
          Status: targetUser.Status,
          Password: targetUser.Password || db.users[idx].Password,
          Permissions: targetUser.Permissions || db.users[idx].Permissions
        };
        appendOfflineLog(db, activeUser.name, activeUser.role, `Update Pengguna Offline: ${targetUser.Full_Name}`, 'Security');
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (action === 'DELETE') {
      const idx = db.users.findIndex((u: any) => u.User_ID === id);
      if (idx !== -1) {
        const name = db.users[idx].Full_Name;
        db.users.splice(idx, 1);
        appendOfflineLog(db, activeUser.name, activeUser.role, `Menghapus Pengguna Offline: ${name}`, 'Security');
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const originalFetch = (window.fetch ? window.fetch.bind(window) : globalThis.fetch.bind(globalThis));
export const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as any).url || '';
  if (url.startsWith('/api/')) {
    try {
      // Hydrate Vercel serverless configurations via headers
      const sc = safeLocalStorage.getItem('alina_sheets_config');
      if (sc) {
        init = init || {};
        init.headers = {
          ...init.headers,
          'x-sheets-config': sc
        };
      }
      
      const response = await originalFetch(input, init);
      // If we got a 5xx gateway/internal serverless freeze pattern, fallback instantly
      if (response.status >= 500 || response.type === 'error') {
        throw new Error(`Server status ${response.status}`);
      }
      
      // Auto-recover from offline mode if server responds successfully with 2xx
      if (response.ok && isOfflineForcedGlobal) {
        isOfflineForcedGlobal = false;
        window.dispatchEvent(new CustomEvent('alina_online_mode_detected'));
      }
      
      return response;
    } catch (err) {
      console.warn(`[Offline-First Engine] Intercepting connection failure to ${url}. Routing to local storage database...`, err);
      return handleOfflineApiRoute(url, init);
    }
  }
  return originalFetch(input, init);
};

// Try to redefine window.fetch for maximum compatibility, but fail silently if read-only
try {
  const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (!desc || desc.configurable) {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true
    });
  } else if (desc.writable) {
    (window as any).fetch = customFetch;
  }
} catch (e) {
  console.warn('[Offline-First Engine] window.fetch is read-only. Falling back to local shadowed fetch binding.');
}

// Shadowed local variable to intercept all fetch calls in this file
const fetch = customFetch;

// Models
