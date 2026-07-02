/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Owner Alina' | 'Admin Gudang Alina';

export interface User {
  User_ID: string;
  Full_Name: string;
  Email: string;
  Password_Hash: string; // Used for simple mock lookup / validation
  Role: UserRole;
  Status: 'Active' | 'Inactive';
  Last_Login: string;
  Created_Date: string;
  Permissions?: string[];
}

export interface Product {
  Product_ID: string;
  SKU: string;
  Barcode: string;
  QR_Code: string;
  Image_URL?: string;
  Product_Name: string;
  Category: string;
  Variant: string;      // Category specific (e.g. All Size, Jumbo, M, L)
  Color: string;
  Size: string;
  Cost_Price: number;
  Retail_Price: number;
  Marketer_Price: number;
  Reseller_Price: number;
  Agen_Price: number;
  Distributor_Price: number;
  Current_Stock: number;
  Minimum_Stock: number;
  Status: 'Active' | 'Discontinued';
}

export interface Customer {
  Customer_ID: string;
  Customer_Name: string;
  Customer_Type: 'Reseller' | 'Agen' | 'Marketer' | 'Konsinyasi' | 'Retail IG' | 'Shopee' | 'TikTok & Tokopedia' | 'Distributor' | 'Ecer';
  Phone: string;
  Email: string;
  Address: string;
  City: string;
  Status: 'Active' | 'Inactive';
}

export interface StockIn {
  Transaction_ID: string;
  Date: string;
  SKU: string;
  Product_Name: string;
  Qty: number;
  Notes: string;
  Source_Type?: 'Konveksi' | 'Return';
  Quality_Type?: 'Good' | 'Reject';
}

export interface StockOut {
  Transaction_ID: string;
  Date: string;
  SKU: string;
  Product_Name: string;
  Customer: string;
  Qty: number;
  Notes: string;
  Destination_Type?: 'Sales' | 'Return to Konveksi' | 'Reject Disposal';
  Quality_Type?: 'Good' | 'Reject';
}

export interface StockOpname {
  Opname_ID: string;
  Month: string; // e.g., "Januari 2026", "Februari 2026"
  SKU: string;
  Product_Name: string;
  System_Stock: number;
  Physical_Stock: number;
  Difference: number;
  Date: string;
}

export type OrderStatus =
  | 'Draft'
  | 'New Order'
  | 'Processing'
  | 'Picking'
  | 'Packing'
  | 'Ready To Ship'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  Order_Number: string;
  Order_Date: string;
  Customer: string;
  Channel: 'Reseller' | 'Agen' | 'Marketer' | 'Konsinyasi' | 'Retail IG' | 'Shopee' | 'TikTok & Tokopedia' | 'Distributor' | 'Ecer';
  SKU: string;
  Product: string;
  Qty: number;
  Price: number;
  Total: number;
  Status: OrderStatus;
}

export interface Shipping {
  Tracking_Number: string;
  Courier: string;
  Order_Number: string;
  Shipping_Date: string;
  Status: 'Waiting Pickup' | 'In Transit' | 'Delivered';
}

export interface ActivityLog {
  Log_ID: string;
  User_Name: string;
  User_Role: UserRole;
  Activity: string;
  Module: string; // WMS, OMS, Product, Customer, Security, etc.
  Timestamp: string;
  Device: string;
}

export interface SheetsConfig {
  scriptUrl: string;
  spreadsheetId: string;
  isLinked: boolean;
  autoSync: boolean;
  customLogoUrl?: string;
}
