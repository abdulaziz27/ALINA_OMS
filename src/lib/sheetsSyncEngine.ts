// Helper to pull database directly from Google Sheets on the client side.
// This achieves true 100% live real-time sync with Google Sheets even if running on 
// serverless platforms like Vercel (where server background setInterval / background workers do not persist).

interface Setters {
  setProducts: (data: any) => void;
  setCustomers: (data: any) => void;
  setStockIn: (data: any) => void;
  setStockOut: (data: any) => void;
  setStockOpname: (data: any) => void;
  setOrders: (data: any) => void;
  setShipping: (data: any) => void;
  setUsers: (data: any) => void;
  setActivityLog: (data: any) => void;
}

export const pullDirectlyFromGoogleSheetsOnClient = async (scriptUrl: string, setters: Setters) => {
  try {
    const url = `${scriptUrl}?action=readAll`;
    const response = await fetch(url);
    if (!response.ok) return false;
    const data = await response.json();
    if (!data) return false;

    const parseNumber = (v: any) => {
      if (v === "" || v === null || v === undefined) return 0;
      const num = Number(v);
      return isNaN(num) ? v : num;
    };

    if (data.Products && Array.isArray(data.Products) && data.Products.length > 0) {
      setters.setProducts(data.Products.map((p: any) => ({
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
      })));
    }

    if (data.Customers && Array.isArray(data.Customers) && data.Customers.length > 0) {
      setters.setCustomers(data.Customers.map((c: any) => ({
        Customer_ID: c.Customer_ID || '',
        Customer_Name: c.Customer_Name || '',
        Customer_Type: c.Customer_Type || 'Reseller',
        Phone: c.Phone || '',
        Email: c.Email || '',
        Address: c.Address || '',
        City: c.City || '',
        Status: c.Status || 'Active'
      })));
    }

    if (data.Stock_In && Array.isArray(data.Stock_In)) {
      setters.setStockIn(data.Stock_In.map((s: any) => ({
        Transaction_ID: s.Transaction_ID || '',
        Date: s.Date || '',
        SKU: s.SKU || '',
        Product_Name: s.Product_Name || '',
        Qty: parseNumber(s.Qty),
        Notes: s.Notes || ''
      })));
    }

    if (data.Stock_Out && Array.isArray(data.Stock_Out)) {
      setters.setStockOut(data.Stock_Out.map((s: any) => ({
        Transaction_ID: s.Transaction_ID || '',
        Date: s.Date || '',
        SKU: s.SKU || '',
        Product_Name: s.Product_Name || '',
        Customer: s.Customer || '',
        Qty: parseNumber(s.Qty),
        Notes: s.Notes || ''
      })));
    }

    if (data.Stock_Opname && Array.isArray(data.Stock_Opname)) {
      setters.setStockOpname(data.Stock_Opname.map((s: any) => ({
        Opname_ID: s.Opname_ID || '',
        Month: s.Month || '',
        SKU: s.SKU || '',
        Product_Name: s.Product_Name || '',
        System_Stock: parseNumber(s.System_Stock),
        Physical_Stock: parseNumber(s.Physical_Stock),
        Difference: parseNumber(s.Difference),
        Date: s.Date || ''
      })));
    }

    if (data.Orders && Array.isArray(data.Orders)) {
      setters.setOrders(data.Orders.map((o: any) => ({
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
      })));
    }

    if (data.Shipping && Array.isArray(data.Shipping)) {
      setters.setShipping(data.Shipping.map((s: any) => ({
        Tracking_Number: s.Tracking_Number || '',
        Courier: s.Courier || '',
        Order_Number: s.Order_Number || '',
        Shipping_Date: s.Shipping_Date || '',
        Status: s.Status || 'In Transit'
      })));
    }

    if (data.Users && Array.isArray(data.Users) && data.Users.length > 0) {
      setters.setUsers(data.Users.map((u: any) => {
        let parsedPerms = [];
        if (typeof u.Permissions === 'string') {
          try {
            parsedPerms = JSON.parse(u.Permissions);
          } catch (err) {
            parsedPerms = [];
          }
        } else {
          parsedPerms = u.Permissions || [];
        }
        return {
          User_ID: u.User_ID || '',
          Full_Name: u.Full_Name || '',
          Email: u.Email || '',
          Password_Hash: u.Password_Hash || '',
          Password: u.Password || '',
          Role: u.Role || 'ADMIN',
          Status: u.Status || 'Active',
          Last_Login: u.Last_Login || '',
          Created_Date: u.Created_Date || '',
          Permissions: parsedPerms
        };
      }));
    }

    if (data.Activity_Log && Array.isArray(data.Activity_Log)) {
      setters.setActivityLog(data.Activity_Log.map((l: any) => ({
        Log_ID: l.Log_ID || '',
        User_Name: l.User_Name || '',
        User_Role: l.User_Role || 'ADMIN',
        Activity: l.Activity || '',
        Module: l.Module || '',
        Timestamp: l.Timestamp || '',
        Device: l.Device || ''
      })));
    }
    return true;
  } catch (e) {
    console.warn("Direct Google Sheets pull failed on client:", e);
    return false;
  }
};
