import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Users, ShoppingCart, Truck, TrendingUp, Settings, 
  LogOut, AlertTriangle, ShieldCheck, HelpCircle, Activity,
  Lock, Mail, Heart, RefreshCw, Barcode, ClipboardCheck,
  CheckCircle2, Plus, Calendar, Filter, Archive, CheckSquare, Search, BookOpen, Package,
  ArrowLeft, Trash2, Eye, Printer, ArrowDownCircle, ArrowUpCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateCode128SvgPath } from '../barcodeUtils.ts';


// ============================================================================
// SELF-HEALING TRANSPARENT OFFLINE-FIRST BACKPLANE ENGINE
// ============================================================================

import { T, AppTheme } from '../utils/theme.ts';
import { getProductPriceFromSchema, categoryList, getColorHexFromName, getColorsByCategory } from '../utils/pricing.ts';
import { User, Product, Customer, StockIn, StockOut, StockOpname, Order, Shipping, ActivityLog, SheetsConfig, OrderStatus, UserRole } from '../types.ts';
import { calculateRestockForecast } from '../utils/forecastUtils.ts';
import { printInvoice } from '../utils/printUtils.ts';

import { DEFAULT_OFFLINE_DB, saveLocalDB, appendOfflineLog, isOfflineForcedGlobal, handleOfflineApiRoute, customFetch, originalFetch, safeLocalStorage } from '../lib/offlineEngine.ts';


export const GlobalStateContext = createContext<any>(null);

export const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  // Theme state
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    return (safeLocalStorage.getItem('alina_app_theme') as AppTheme) || 'default';
  });

  const currentTheme = T(appTheme);

  // Session States
  const [currentUser, setCurrentUser] = useState<{ User_ID?: string; Full_Name: string; Email: string; Role: UserRole; Permissions?: string[] } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isRememberLogin, setIsRememberLogin] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [lookups, setLookups] = useState<any[]>([]);

  // Database States (Refetched on change)
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stockIn, setStockIn] = useState<StockIn[]>([]);
  const [stockOut, setStockOut] = useState<StockOut[]>([]);
  const [stockOpname, setStockOpname] = useState<StockOpname[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipping, setShipping] = useState<Shipping[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<SheetsConfig>({
    scriptUrl: '',
    spreadsheetId: '',
    isLinked: false,
    autoSync: false
  });

  const [isOfflineMode, setIsOfflineMode] = useState(isOfflineForcedGlobal);

  // Loading indicator for global sync actions
  const [isSyncingGlobal, setIsSyncingGlobal] = useState(false);

  // Scanner States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const scanCallbackRef = useRef<(sku: string) => void>(() => {});
  const [scannerTitle, setScannerTitle] = useState("SCAN SKU TAG");
  const [isScanChoiceOpen, setIsScanChoiceOpen] = useState(false);

  // Operational form states
  const [activeStockOpnameMonth, setActiveStockOpnameMonth] = useState("Juni 2026");
  const [opnameQuantities, setOpnameQuantities] = useState<{ [sku: string]: string }>({});

  // Stock Trx inputs
  const [selectedTrxType, setSelectedTrxType] = useState<'IN' | 'OUT'>('IN');
  const [trxSku, setTrxSku] = useState('');
  const [stockSkuDropdownOpen, setStockSkuDropdownOpen] = useState(false);
  const [stockSkuSearch, setStockSkuSearch] = useState('');
  const [trxQty, setTrxQty] = useState('');
  const [trxCustomer, setTrxCustomer] = useState('Rania Hijab Store');
  const [trxNotes, setTrxNotes] = useState('');
  const [trxSource, setTrxSource] = useState<'Konveksi' | 'Return'>('Konveksi');
  const [trxQuality, setTrxQuality] = useState<'Good' | 'Reject'>('Good');
  const [trxDestination, setTrxDestination] = useState<'Sales' | 'Return to Konveksi' | 'Reject Disposal'>('Sales');
  const [trxOutQuality, setTrxOutQuality] = useState<'Good' | 'Reject'>('Good');

  // Orders creation inputs
  const [ordCustomer, setOrdCustomer] = useState('Rania Hijab Store');
  const [ordChannel, setOrdChannel] = useState<'Reseller' | 'Agen' | 'Marketer' | 'Konsinyasi' | 'Retail IG' | 'Shopee' | 'TikTok & Tokopedia' | 'Distributor' | 'Ecer'>('Reseller');
  const [ordCategory, setOrdCategory] = useState('Celamis Regular');
  const [ordVariant, setOrdVariant] = useState('All Size');
  const [ordColor, setOrdColor] = useState('Hitam');
  const [ordSku, setOrdSku] = useState('');
  const [ordQty, setOrdQty] = useState('1');
  const [ordPrice, setOrdPrice] = useState('');
  const [tempOrderItems, setTempOrderItems] = useState<{
    SKU: string;
    Product_Name: string;
    Qty: number;
    Price: number;
    Total: number;
  }[]>([]);

  // Derived state to filter categories, variants, and colors available based on master products with Current_Stock > 0
  const readyProducts = products.filter(p => p.Current_Stock > 0);
  
  const availableCategories = Array.from(new Set(
    readyProducts.map(p => p.Category).filter(Boolean)
  )).sort();

  const availableVariants = ordCategory
    ? Array.from(new Set(
        readyProducts
          .filter(p => p.Category.toLowerCase() === ordCategory.toLowerCase())
          .map(p => p.Variant)
          .filter(Boolean)
      )).sort()
    : [];

  const availableColorPresets = (ordCategory && ordVariant)
    ? Array.from(new Set(
        readyProducts
          .filter(p => 
            p.Category.toLowerCase() === ordCategory.toLowerCase() && 
            p.Variant.toLowerCase() === ordVariant.toLowerCase()
          )
          .map(p => p.Color)
          .filter(Boolean)
      )).map((colorName: any) => ({
        name: String(colorName),
        hex: getColorHexFromName(String(colorName))
      }))
    : [];

  // Shipping updates
  const [selectedShipOrder, setSelectedShipOrder] = useState<string | null>(null);
  const [shipCourier, setShipCourier] = useState('JNE Reg');
  const [shipTracking, setShipTracking] = useState('');
  const [shipStatus, setShipStatus] = useState<'Waiting Pickup' | 'In Transit' | 'Delivered'>('In Transit');

  // Picking & Packing checklist
  const [activePackOrder, setActivePackOrder] = useState<Order | null>(null);
  const [packChecklist, setPackChecklist] = useState<{ [item: string]: boolean }>({});
  const [activeDetailOrderNum, setActiveDetailOrderNum] = useState<string | null>(null);

  // Form states for managing Customers (Modal/Inline editing)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);

  // User Administration (Owner)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<(Partial<User> & { Password?: string }) | null>(null);

  // RBAC permissions helper
  const hasPermission = (tabId: string): boolean => {
    if (!currentUser) return false;
    // OWNER has full privilege always
    if (currentUser.Role === 'Owner Alina') return true;
    // Users tab is strictly OWNER-only
    if (tabId === 'users') return false;
    // If no permission array is provided on user, fallback to allowed everything for backwards compatibility
    if (!currentUser.Permissions || currentUser.Permissions.length === 0) return true;
    return currentUser.Permissions.includes(tabId);
  };

  // Reports Filter state
  const [reportsFilter, setReportsFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // ----------------------------------------------------------------------
  // LIFE CYCLE & SESSION GUARDIAN
  // ----------------------------------------------------------------------
  useEffect(() => {
    // Check remembered login Session from storage
    const storedUser = safeLocalStorage.getItem('alina_user');
    const storedTime = safeLocalStorage.getItem('alina_login_time');
    
    if (storedUser && storedTime) {
      const parsedTime = Number(storedTime);
      const currentTime = Date.now();
      
      if (currentTime - parsedTime < SESSION_TIMEOUT) {
        setCurrentUser(JSON.parse(storedUser));
        // Reset guardian timer
        safeLocalStorage.setItem('alina_login_time', currentTime.toString());
      } else {
        // Enforce 8-hour auto-logout
        handleLogoutAction();
      }
    }

    // Load initial data
    fetchDatabaseState();
  }, []);

  useEffect(() => {
    const handleOfflineMode = () => {
      setIsOfflineMode(true);
    };
    const handleOnlineMode = () => {
      setIsOfflineMode(false);
    };
    const handleOfflineDbUpdate = () => {
      fetchDatabaseState();
    };

    window.addEventListener('alina_offline_mode_detected', handleOfflineMode);
    window.addEventListener('alina_online_mode_detected', handleOnlineMode);
    window.addEventListener('alina_db_offline_update', handleOfflineDbUpdate);

    return () => {
      window.removeEventListener('alina_offline_mode_detected', handleOfflineMode);
      window.removeEventListener('alina_online_mode_detected', handleOnlineMode);
      window.removeEventListener('alina_db_offline_update', handleOfflineDbUpdate);
    };
  }, []);

  // Periodic Session activity checking (Auto Logout)
  useEffect(() => {
    if (!currentUser) return;

    const activityHandler = () => {
      safeLocalStorage.setItem('alina_login_time', Date.now().toString());
    };

    window.addEventListener('mousemove', activityHandler);
    window.addEventListener('keydown', activityHandler);

    // Enforce background polling timer every 10 min
    const timer = setInterval(() => {
      const storedTime = safeLocalStorage.getItem('alina_login_time');
      if (storedTime) {
        const timeDiff = Date.now() - Number(storedTime);
        if (timeDiff > SESSION_TIMEOUT) {
          handleLogoutAction();
        }
      }
    }, 60000);

    return () => {
      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keydown', activityHandler);
      clearInterval(timer);
    };
  }, [currentUser]);

  // Realtime Background Synchronization (Polls server database every 4 seconds)
  useEffect(() => {
    if (!currentUser) return;

    const realTimeInterval = setInterval(() => {
      fetchDatabaseState();
    }, 4000);

    return () => {
      clearInterval(realTimeInterval);
    };
  }, [currentUser]);

  // Redirect to first permitted tab if activeTab is not permitted
  useEffect(() => {
    if (currentUser) {
      if (!hasPermission(activeTab)) {
        const allTabs = ['dashboard', 'products', 'inventory', 'opname', 'orders', 'shipping', 'reports', 'customers', 'settings'];
        const firstPermitted = allTabs.find(tabId => hasPermission(tabId));
        if (firstPermitted) {
          setActiveTab(firstPermitted);
        }
      }
    }
  }, [currentUser, activeTab]);

  // Sync Customer type to Sales Channel automatically
  useEffect(() => {
    if (!ordCustomer || customers.length === 0) return;
    const matchedCust = customers.find(c => c.Customer_Name === ordCustomer);
    if (matchedCust) {
      setOrdChannel(matchedCust.Customer_Type as any);
    }
  }, [ordCustomer, customers]);

  // Set default customer if current one doesn't exist
  useEffect(() => {
    if (customers.length > 0 && !customers.some(c => c.Customer_Name === ordCustomer)) {
      setOrdCustomer(customers[0].Customer_Name);
    }
  }, [customers, ordCustomer]);

  // Handle cascading default selection when available options change based on ready/in-stock items
  useEffect(() => {
    if (products.length === 0) return;

    const readyItems = products.filter(p => p.Current_Stock > 0);
    
    // 1. Resolve Category
    const validCategories = Array.from(new Set(
      readyItems.map(p => p.Category).filter(Boolean)
    )).sort();

    let targetCategory = ordCategory;
    if (validCategories.length > 0) {
      if (!validCategories.includes(ordCategory)) {
        targetCategory = validCategories[0];
      }
    } else {
      targetCategory = '';
    }

    // 2. Resolve Variant based on Category
    const variantsForCat = targetCategory
      ? Array.from(new Set(
          readyItems
            .filter(p => p.Category.toLowerCase() === targetCategory.toLowerCase())
            .map(p => p.Variant)
            .filter(Boolean)
        )).sort()
      : [];

    let targetVariant = ordVariant;
    if (variantsForCat.length > 0) {
      if (!variantsForCat.includes(ordVariant)) {
        targetVariant = variantsForCat[0];
      }
    } else {
      targetVariant = '';
    }

    // 3. Resolve Color based on Category & Variant
    const colorsForCatAndVar = (targetCategory && targetVariant)
      ? Array.from(new Set(
          readyItems
            .filter(p => 
              p.Category.toLowerCase() === targetCategory.toLowerCase() && 
              p.Variant.toLowerCase() === targetVariant.toLowerCase()
            )
            .map(p => p.Color)
            .filter(Boolean)
        ))
      : [];

    let targetColor = ordColor;
    if (colorsForCatAndVar.length > 0) {
      if (!colorsForCatAndVar.includes(ordColor)) {
        targetColor = colorsForCatAndVar[0];
      }
    } else {
      targetColor = '';
    }

    // Batch apply updates only if they've changed to avoid cyclic state updates
    if (ordCategory !== targetCategory) {
      setOrdCategory(targetCategory);
    }
    if (ordVariant !== targetVariant) {
      setOrdVariant(targetVariant);
    }
    if (ordColor !== targetColor) {
      setOrdColor(targetColor);
    }
  }, [products, ordCategory, ordVariant, ordColor]);

  // Automatically find matching product in products database based on Category, Variant, Color
  useEffect(() => {
    if (!products.length) return;
    const matched = products.find(p => 
      p.Category.toLowerCase().trim() === ordCategory.toLowerCase().trim() &&
      p.Variant.toLowerCase().trim() === ordVariant.toLowerCase().trim() &&
      p.Color.toLowerCase().trim() === ordColor.toLowerCase().trim()
    );

    if (matched) {
      setOrdSku(matched.SKU);
      // Auto custom priced from Mitra Alina schema
      const calculatedPrice = getProductPriceFromSchema(ordCategory, ordVariant, ordChannel, matched.Retail_Price);
      setOrdPrice(String(calculatedPrice));
    } else {
      setOrdSku('');
      // Show default calculated price for non-existent master variant just in case
      const calculatedPrice = getProductPriceFromSchema(ordCategory, ordVariant, ordChannel, 0);
      setOrdPrice(String(calculatedPrice));
    }
  }, [ordCategory, ordVariant, ordColor, ordChannel, products]);



  // Sync state triggers
  const fetchDatabaseState = async () => {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const data = await res.json();
        const serverConfig = data.sheetsConfig;
        const localSavedConfigStr = safeLocalStorage.getItem('alina_sheets_config');
        let finalConfig = serverConfig || { scriptUrl: '', spreadsheetId: '', isLinked: false, autoSync: false };
        
        if (localSavedConfigStr) {
          try {
            const localSavedConfig = JSON.parse(localSavedConfigStr);
            // If the server config is empty/not linked, but we have a valid local config, restore it silently on the server
            if ((!serverConfig || !serverConfig.isLinked || !serverConfig.scriptUrl) && localSavedConfig.scriptUrl && localSavedConfig.spreadsheetId) {
              finalConfig = { ...localSavedConfig, isLinked: true };
              fetch('/api/settings/sheets-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...finalConfig,
                  user: { name: 'System Auto-Restore', role: 'Owner Alina' },
                  isRestore: true
                })
              }).catch(err => console.error("Auto-restore sheets config failed", err));
            } else if (serverConfig && serverConfig.isLinked && serverConfig.scriptUrl) {
              // Ensure local storage is in sync with server config
              safeLocalStorage.setItem('alina_sheets_config', JSON.stringify(serverConfig));
            }
          } catch (e) {
            console.error("Failed to parse local sheets config:", e);
          }
        } else if (serverConfig && serverConfig.isLinked && serverConfig.scriptUrl) {
          // If server has it but local doesn't, save it locally
          safeLocalStorage.setItem('alina_sheets_config', JSON.stringify(serverConfig));
        }
        
        setSheetsConfig(finalConfig);

        // Always trust the local Express backend's data as the primary source of truth if it responds successfully
        setUsers(data.users || []);
        setProducts(data.products || []);
        setCustomers(data.customers || []);
        setStockIn(data.stockIn || []);
        setStockOut(data.stockOut || []);
        setStockOpname(data.stockOpname || []);
        setOrders(data.orders || []);
        setShipping(data.shipping || []);
        setActivityLog(data.activityLog || []);
      }
    } catch (e) {
      console.warn("Failed to connect to backend REST database:", e);
    }
  };

  // ----------------------------------------------------------------------
  // AUTH LOGIC
  // ----------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        
        if (isRememberLogin) {
          safeLocalStorage.setItem('alina_user', JSON.stringify(data.user));
          safeLocalStorage.setItem('alina_login_time', Date.now().toString());
        }
        
        fetchDatabaseState();
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || 'Invalid credentials.');
      }
    } catch (err) {
      setLoginError('Error connecting to the Express service, using cached database state.');
    }
  };

  const handleLogoutAction = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: currentUser?.Full_Name, role: currentUser?.Role })
      });
    } catch (e) {}

    setCurrentUser(null);
    safeLocalStorage.removeItem('alina_user');
    safeLocalStorage.removeItem('alina_login_time');
    setLoginPassword('');
  };

  // ----------------------------------------------------------------------
  // RESTOCK FORECAST METRICS
  // ----------------------------------------------------------------------
  // Average Sales 30 Hari Terakhir:
  // If stock is predicted to deplete within 14 days, forecast warning RESTOCK REQUIRED is generated.
  const restockForecastList = calculateRestockForecast(orders, products);
  const restockAlertsCount = restockForecastList.length;

  // ----------------------------------------------------------------------
  // OPERATIONAL SAVE MUTATION HANDLERS
  // ----------------------------------------------------------------------
  
  // Product Form Save
  const handleSaveProduct = async (prod: Partial<Product>, isNew: boolean, id?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: isNew ? 'CREATE' : 'UPDATE', 
          product: prod, 
          user: { name: currentUser?.Full_Name, role: currentUser?.Role },
          id 
        })
      });
      if (res.ok) {
        await fetchDatabaseState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const handleDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'DELETE', 
          user: { name: currentUser?.Full_Name, role: currentUser?.Role },
          id 
        })
      });
      if (res.ok) {
        await fetchDatabaseState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const handleImportProducts = async (importedList: any[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          products: importedList,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });
      if (res.ok) {
        await fetchDatabaseState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Stock Trx Stock-In and Stock-Out
  const handleRecordStockTrxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxSku || !trxQty) return;

    try {
      const endpoint = selectedTrxType === 'IN' ? '/api/inventory/stock-in' : '/api/inventory/stock-out';
      const bodyPayload = selectedTrxType === 'IN' 
        ? { 
            sku: trxSku, 
            qty: Number(trxQty), 
            notes: trxNotes, 
            source_type: trxSource, 
            quality_type: trxQuality,
            user: { name: currentUser?.Full_Name, role: currentUser?.Role } 
          }
        : { 
            sku: trxSku, 
            customer: trxCustomer, 
            qty: Number(trxQty), 
            notes: trxNotes, 
            destination_type: trxDestination,
            quality_type: trxOutQuality,
            user: { name: currentUser?.Full_Name, role: currentUser?.Role } 
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (res.ok) {
        alert(`Stock ${selectedTrxType} recorded successfully for SKU ${trxSku}!`);
        setTrxQty('');
        setTrxNotes('');
        setTrxSource('Konveksi');
        setTrxQuality('Good');
        setTrxDestination('Sales');
        setTrxOutQuality('Good');
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Transaction failure: ${err.error}`);
      }
    } catch (e) {
      alert("Network server connection error.");
    }
  };

  // Scanning triggers
  const triggerCameraScanner = (titleMsg: string, successCallback: (sku: string) => void) => {
    setScannerTitle(titleMsg);
    scanCallbackRef.current = successCallback;
    setIsScannerOpen(true);
  };

  // Stock Opname Monthly Matrix Save
  const handleSaveOpnameSubmit = async (sku: string, physicalCountStr: string) => {
    if (physicalCountStr === undefined || physicalCountStr === '') return;
    
    try {
      const res = await fetch('/api/inventory/stock-opname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: activeStockOpnameMonth,
          sku,
          physicalStock: Number(physicalCountStr),
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        await fetchDatabaseState();
        // Clear value input
        setOpnameQuantities(prev => ({ ...prev, [sku]: '' }));
      } else {
        const err = await res.json();
        alert(`Opname Error: ${err.error}`);
      }
    } catch (e) {
      alert("Error logging Stock Opname.");
    }
  };

  // Add item to temporary checklist
  const handleAddProductToStaging = () => {
    if (!ordSku) {
      alert("Pilihan kombinasi warna/ukuran/kategori belum menghasilkan SKU valid di Master Produk.");
      return;
    }
    const matchedProduct = products.find(p => p.SKU === ordSku);
    if (!matchedProduct) {
      alert("Master produk tidak ditemukan.");
      return;
    }

    const qtyVal = Number(ordQty);
    if (qtyVal <= 0) {
      alert("Kuantitas pemesanan harus lebih dari 0.");
      return;
    }
    const priceVal = ordPrice ? Number(ordPrice) : matchedProduct.Retail_Price;

    const existingIndex = tempOrderItems.findIndex(item => item.SKU === ordSku);
    if (existingIndex > -1) {
      const updated = [...tempOrderItems];
      updated[existingIndex].Qty += qtyVal;
      updated[existingIndex].Total = updated[existingIndex].Qty * updated[existingIndex].Price;
      setTempOrderItems(updated);
    } else {
      setTempOrderItems(prev => [
        ...prev,
        {
          SKU: ordSku,
          Product_Name: `${matchedProduct.Product_Name} (${matchedProduct.Variant} - ${matchedProduct.Color})`,
          Qty: qtyVal,
          Price: priceVal,
          Total: qtyVal * priceVal
        }
      ]);
    }
    setOrdQty('1');
  };

  const handleRemoveProductFromStaging = (index: number) => {
    setTempOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  // OMS Create New Order Submission
  const handleCreateOrderSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // We can stage the currently selected item if tempOrderItems is empty
    let itemsToSubmit = [...tempOrderItems];
    if (itemsToSubmit.length === 0) {
      if (!ordSku) {
        alert("Tambahkan minimal 1 barang sebelum menyimpan order.");
        return;
      }
      const matchedProduct = products.find(p => p.SKU === ordSku);
      if (!matchedProduct) return;
      const qtyVal = Number(ordQty);
      const priceVal = ordPrice ? Number(ordPrice) : matchedProduct.Retail_Price;
      itemsToSubmit = [{
        SKU: ordSku,
        Product_Name: `${matchedProduct.Product_Name} (${matchedProduct.Variant} - ${matchedProduct.Color})`,
        Qty: qtyVal,
        Price: priceVal,
        Total: qtyVal * priceVal
      }];
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          order: {
            Customer: ordCustomer,
            Channel: ordChannel,
            items: itemsToSubmit
          },
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        alert("Sales order created successfully!");
        setOrdQty('1');
        setOrdPrice('');
        setTempOrderItems([]);
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Order failed: ${err.error}`);
      }
    } catch (err) {
      alert("Connection failed.");
    }
  };

  // Update Sales Order Status Cycle (WMS Workflow)
  const handleUpdateOrderStatus = async (ordNum: string, nextStat: OrderStatus, customCarryObj?: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STATUS',
          orderNumber: ordNum,
          order: {
            Status: nextStat,
            ...customCarryObj
          },
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Workflow violation: ${err.error}`);
      }
    } catch (err) {
      alert("Connector error.");
    }
  };

  const handlePrintInvoice = (orderNumber: string) => {
    printInvoice(orderNumber, orders, currentUser);
  };

  // Start Picking or Packing Verification station
  const handleOpenPackStation = (o: Order) => {
    setActivePackOrder(o);
    const relatedItems = orders.filter(item => item.Order_Number === o.Order_Number);
    
    const checklist: { [key: string]: boolean } = {};
    relatedItems.forEach(item => {
      checklist[`Verify SKU tag: ${item.SKU} (${item.Product})`] = false;
      checklist[`Confirm Quantity: ${item.Qty} pcs`] = false;
    });
    checklist[`Match Customer details: ${o.Customer}`] = false;
    checklist["Bubble Wrap & Polymailer wrapping complete"] = false;
    
    setPackChecklist(checklist);
  };

  const handleTogglePackItem = (key: string) => {
    setPackChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmPackCompleted = async () => {
    if (!activePackOrder) return;
    const isAllChecked = Object.values(packChecklist).every(val => val === true);
    if (!isAllChecked) {
      alert("Verify and check off all WMS verification lines before sealing package.");
      return;
    }

    // Move state to Ready To Ship
    await handleUpdateOrderStatus(activePackOrder.Order_Number, 'Ready To Ship');
    alert(`Order ${activePackOrder.Order_Number} packed and verified! Waiting courier pickup.`);
    setActivePackOrder(null);
  };

  // Shipping Assignment
  const handleAssignShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipOrder || !shipTracking) return;

    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPSERT',
          shipping: {
            Order_Number: selectedShipOrder,
            Courier: shipCourier,
            Tracking_Number: shipTracking,
            Status: shipStatus
          },
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        alert("Shipping courier status assigned successfully!");
        setSelectedShipOrder(null);
        setShipTracking('');
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      alert("Connection failure.");
    }
  };

  // Customer Management Save
  const handleSaveCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.Customer_Name) return;

    try {
      const isNew = !editingCustomer.Customer_ID;
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isNew ? 'CREATE' : 'UPDATE',
          customer: editingCustomer,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role },
          id: editingCustomer.Customer_ID
        })
      });

      if (res.ok) {
        alert(isNew ? "Customer added successfully!" : "Customer details updated.");
        setIsCustomerModalOpen(false);
        setEditingCustomer(null);
        await fetchDatabaseState();
      } else {
        alert("Failed to save Customer details.");
      }
    } catch (err) {
      alert("Connection failed.");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE',
          id,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        alert("Customer deleted successfully.");
        await fetchDatabaseState();
      }
    } catch (err) {
      alert("Failed to delete customer.");
    }
  };

  // Sheets Connector settings save
  const handleSaveSheetsConfig = async (cfg: { scriptUrl: string; spreadsheetId: string; autoSync: boolean; customLogoUrl?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings/sheets-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cfg,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });
      if (res.ok) {
        safeLocalStorage.setItem('alina_sheets_config', JSON.stringify({ ...cfg, isLinked: !!(cfg.scriptUrl) }));
        await fetchDatabaseState();
        return true;
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan konfigurasi Sheets.");
      }
    } catch (e) {
      console.error(e);
      alert("Koneksi gagal. Silahkan coba lagi.");
    }
    return false;
  };

  const handleSyncSheetsNow = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/settings/sync-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await fetchDatabaseState();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || "Gagal menyinkronkan data dengan Google Sheets." };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: "Koneksi ke server backend gagal atau tidak merespons." };
    }
  };

  // User Administration Save (Owner)
  const handleSaveUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.Email || !editingUser.Full_Name) return;

    try {
      const isNew = !editingUser.User_ID;
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isNew ? 'CREATE' : 'UPDATE',
          targetUser: editingUser,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role },
          id: editingUser.User_ID
        })
      });

      if (res.ok) {
        alert(isNew ? "User account created!" : "User status updated.");
        setIsUserModalOpen(false);
        setEditingUser(null);
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (err) {
      alert("Connector error.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === 'USR-001') {
      alert("Primary owner account is protected from deletion.");
      return;
    }
    if (!window.confirm("Are you sure you want to dissolve this user credential?")) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE',
          id,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        alert("User deleted.");
        await fetchDatabaseState();
      }
    } catch (e) {
      alert("Delete failed.");
    }
  };

  // Format currency helper
  const formatIDR = (num: number) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  };

  // Count metrics for general Dashboard indicators
  const totalStockAmount = products.reduce((sum, curr) => sum + (curr.Current_Stock || 0), 0);
  const totalSkuAmount = products.length;
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const ordersTodayList = orders.filter(o => o.Order_Date.startsWith(todayStr));
  const ordersTodayCount = ordersTodayList.length;
  
  const ordersThisMonthCount = orders.filter(o => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    return o.Order_Date.startsWith(currentMonth);
  }).length;

  const pendingOrdersCount = orders.filter(o => ['New Order', 'Processing', 'Picking'].includes(o.Status)).length;
  const packedOrdersCount = orders.filter(o => o.Status === 'Packing').length;
  const shippedOrdersCount = orders.filter(o => o.Status === 'Shipped').length;

  

  const contextValue = {
    lookups, setLookups,
    scanCallbackRef,
    
    
    
    
    
    appTheme,
    setAppTheme,
    currentUser,
    setCurrentUser,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    isRememberLogin,
    setIsRememberLogin,
    loginError,
    setLoginError,
    activeTab,
    setActiveTab,
    users,
    setUsers,
    products,
    setProducts,
    customers,
    setCustomers,
    stockIn,
    setStockIn,
    stockOut,
    setStockOut,
    stockOpname,
    setStockOpname,
    orders,
    setOrders,
    shipping,
    setShipping,
    activityLog,
    setActivityLog,
    sheetsConfig,
    setSheetsConfig,
    isOfflineMode,
    setIsOfflineMode,
    isSyncingGlobal,
    setIsSyncingGlobal,
    isScannerOpen,
    setIsScannerOpen,
    scannerTitle,
    setScannerTitle,
    isScanChoiceOpen,
    setIsScanChoiceOpen,
    activeStockOpnameMonth,
    setActiveStockOpnameMonth,
    opnameQuantities,
    setOpnameQuantities,
    selectedTrxType,
    setSelectedTrxType,
    trxSku,
    setTrxSku,
    stockSkuDropdownOpen,
    setStockSkuDropdownOpen,
    stockSkuSearch,
    setStockSkuSearch,
    trxQty,
    setTrxQty,
    trxCustomer,
    setTrxCustomer,
    trxNotes,
    setTrxNotes,
    trxSource,
    setTrxSource,
    trxQuality,
    setTrxQuality,
    trxDestination,
    setTrxDestination,
    trxOutQuality,
    setTrxOutQuality,
    ordCustomer,
    setOrdCustomer,
    ordChannel,
    setOrdChannel,
    ordCategory,
    setOrdCategory,
    ordVariant,
    setOrdVariant,
    ordColor,
    setOrdColor,
    ordSku,
    setOrdSku,
    ordQty,
    setOrdQty,
    ordPrice,
    setOrdPrice,
    tempOrderItems,
    setTempOrderItems,
    selectedShipOrder,
    setSelectedShipOrder,
    shipCourier,
    setShipCourier,
    shipTracking,
    setShipTracking,
    shipStatus,
    setShipStatus,
    activePackOrder,
    setActivePackOrder,
    packChecklist,
    setPackChecklist,
    activeDetailOrderNum,
    setActiveDetailOrderNum,
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    editingCustomer,
    setEditingCustomer,
    isUserModalOpen,
    setIsUserModalOpen,
    editingUser,
    setEditingUser,
    reportsFilter,
    setReportsFilter,
    availableColorPresets,
    hasPermission,
    
    
    
    
    
    fetchDatabaseState,
    handleLoginSubmit,
    handleLogoutAction,
    handleSaveProduct,
    handleDeleteProduct,
    handleImportProducts,
    handleRecordStockTrxSubmit,
    triggerCameraScanner,
    handleSaveOpnameSubmit,
    handleAddProductToStaging,
    handleRemoveProductFromStaging,
    handleCreateOrderSubmit,
    handleUpdateOrderStatus,
    handlePrintInvoice,
    handleOpenPackStation,
    handleTogglePackItem,
    handleConfirmPackCompleted,
    handleAssignShippingSubmit,
    handleSaveCustomerSubmit,
    handleDeleteCustomer,
    handleSaveSheetsConfig,
    handleSyncSheetsNow,
    handleSaveUserSubmit,
    handleDeleteUser,
    formatIDR,
    currentTheme,
    readyProducts,
    availableCategories,
    availableVariants,
    totalStockAmount,
    totalSkuAmount,
    ordersTodayCount,
    pendingOrdersCount,
    packedOrdersCount,
    shippedOrdersCount,
    ordersThisMonthCount,
    restockForecastList,
    restockAlertsCount
  };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
