import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalState } from '../../context/GlobalStateContext';
// import all pages
import DashboardPage from '../../pages/DashboardPage.tsx';
import ProductForm from '../../components/ProductForm.tsx';
import CustomersPage from '../../pages/CustomersPage.tsx';
import InventoryPage from '../../pages/InventoryPage.tsx';
import OpnamePage from '../../pages/OpnamePage.tsx';
import OrdersPage from '../../pages/OrdersPage.tsx';
import ShippingPage from '../../pages/ShippingPage.tsx';
import ReportsPage from '../../pages/ReportsPage.tsx';
import UsersPage from '../../pages/UsersPage.tsx';
import SettingsPage from '../../pages/SettingsPage.tsx';
import { categoryList, getColorHexFromName, getColorsByCategory } from '../../utils/pricing.ts';


export default function AppRouter() {
  const g = useGlobalState();

  // For the router, we just replace all variables with g.variable
  // We can do this safely by passing the g object directly to props?
  // No, we'll just evaluate the JSX in the scope by destructuring g:
  const {
    lookups,
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
    handleOfflineMode,
    handleOnlineMode,
    handleOfflineDbUpdate,
    activityHandler,
    colorsForCatAndVar,
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
  } = g;

  return (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            
            {/* 1. DASHBOARD VIEW */}
            {activeTab === 'dashboard' && hasPermission('dashboard') && (
              <DashboardPage
                totalStockAmount={totalStockAmount}
                totalSkuAmount={totalSkuAmount}
                ordersTodayCount={ordersTodayCount}
                pendingOrdersCount={pendingOrdersCount}
                packedOrdersCount={packedOrdersCount}
                shippedOrdersCount={shippedOrdersCount}
                ordersThisMonthCount={ordersThisMonthCount}
                currentUser={currentUser!}
                products={products}
                orders={orders}
                customers={customers}
              />
            )}

            {/* 2. PRODUCT MASTER VIEW */}
            {activeTab === 'products' && hasPermission('products') && (
              <ProductForm
                productsList={products}
                currentUser={currentUser}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
                onImportProducts={handleImportProducts}
                categoryList={categoryList}
              />
            )}

            {/* 3. CUSTOMER VIEW */}
            {activeTab === 'customers' && hasPermission('customers') && (
              <CustomersPage 
                customers={customers}
                setEditingCustomer={setEditingCustomer}
                setIsCustomerModalOpen={setIsCustomerModalOpen}
                handleDeleteCustomer={handleDeleteCustomer}
              />
            )}

            {/* 4. STOCK IN & OUT (WMS TRANSACTION) */}
            {activeTab === 'inventory' && hasPermission('inventory') && (
              <InventoryPage 
                products={products}
                customers={customers}
                stockIn={stockIn}
                stockOut={stockOut}
                selectedTrxType={selectedTrxType}
                setSelectedTrxType={setSelectedTrxType}
                trxSku={trxSku}
                setTrxSku={setTrxSku}
                trxQty={trxQty}
                setTrxQty={setTrxQty}
                trxQuality={trxQuality}
                setTrxQuality={setTrxQuality}
                trxOutQuality={trxOutQuality}
                setTrxOutQuality={setTrxOutQuality}
                trxSource={trxSource}
                setTrxSource={setTrxSource}
                trxDestination={trxDestination}
                setTrxDestination={setTrxDestination}
                trxCustomer={trxCustomer}
                setTrxCustomer={setTrxCustomer}
                trxNotes={trxNotes}
                setTrxNotes={setTrxNotes}
                handleRecordStockTrxSubmit={handleRecordStockTrxSubmit}
                triggerCameraScanner={triggerCameraScanner}
                setActiveTab={setActiveTab}
                stockSkuDropdownOpen={stockSkuDropdownOpen}
                setStockSkuDropdownOpen={setStockSkuDropdownOpen}
                stockSkuSearch={stockSkuSearch}
                setStockSkuSearch={setStockSkuSearch}
                getColorsByCategory={getColorsByCategory}
              />
            )}

            {/* 5. MONTHLY STOCK OPNAME VIEW */}
            {activeTab === 'opname' && hasPermission('opname') && (
              <OpnamePage 
                products={products}
                stockOpname={stockOpname}
                activeStockOpnameMonth={activeStockOpnameMonth}
                setActiveStockOpnameMonth={setActiveStockOpnameMonth}
                opnameQuantities={opnameQuantities}
                setOpnameQuantities={setOpnameQuantities}
                handleSaveOpnameSubmit={handleSaveOpnameSubmit}
                hasPermission={hasPermission}
              />
            )}

            {/* 6. ORDER MANAGEMENT SYSTEM (OMS) */}
            {activeTab === 'orders' && hasPermission('orders') && (
              <OrdersPage 
                orders={orders}
                products={products}
                customers={customers}
                formatIDR={formatIDR}
                hasPermission={hasPermission}
                tempOrderItems={tempOrderItems}
                setTempOrderItems={setTempOrderItems}
                ordChannel={ordChannel}
                setOrdChannel={setOrdChannel}
                ordCustomer={ordCustomer}
                setOrdCustomer={setOrdCustomer}
                ordCategory={ordCategory}
                setOrdCategory={setOrdCategory}
                ordColor={ordColor}
                setOrdColor={setOrdColor}
                ordVariant={ordVariant}
                setOrdVariant={setOrdVariant}
                ordQty={ordQty}
                setOrdQty={setOrdQty}
                ordPrice={ordPrice}
                setOrdPrice={setOrdPrice}
                handleRemoveProductFromStaging={handleRemoveProductFromStaging}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
                setActiveDetailOrderNum={setActiveDetailOrderNum}
                setActiveTab={setActiveTab}
                setSelectedShipOrder={setSelectedShipOrder}
                handleOpenPackStation={handleOpenPackStation}
                handlePrintInvoice={handlePrintInvoice}
                handleCreateOrderSubmit={handleCreateOrderSubmit}
                handleAddProductToStaging={handleAddProductToStaging}
                availableCategories={availableCategories}
                availableVariants={availableVariants}
                availableColorPresets={availableColorPresets}
                ordSku={ordSku}
                setOrdSku={setOrdSku}
              />
            )}

            {/* 7. SHIPPING MANAGEMENT VIEW */}
            {activeTab === 'shipping' && hasPermission('shipping') && (
              <ShippingPage 
                orders={orders}
                hasPermission={hasPermission}
                selectedShipOrder={selectedShipOrder}
                setSelectedShipOrder={setSelectedShipOrder}
                shipCourier={shipCourier}
                setShipCourier={setShipCourier}
                shipTracking={shipTracking}
                setShipTracking={setShipTracking}
                shipStatus={shipStatus}
                setShipStatus={setShipStatus}
                fetchDatabaseState={fetchDatabaseState}
                handleAssignShippingSubmit={handleAssignShippingSubmit}
                shipping={shipping}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPage 
                products={products}
                hasPermission={hasPermission}
                reportsFilter={reportsFilter}
                setReportsFilter={setReportsFilter}
                restockAlertsCount={restockAlertsCount}
                restockForecastList={restockForecastList}
                categoryList={categoryList}
                activityLog={activityLog}
              />
            )}

            {/* 9. SECURE USER MANAGEMENT VIEW (OWNER ONLY) */}
            {activeTab === 'users' && currentUser?.Role === 'Owner Alina' && (
              <UsersPage 
                currentUser={currentUser}
                users={users}
                setEditingUser={setEditingUser}
                setIsUserModalOpen={setIsUserModalOpen}
                handleDeleteUser={handleDeleteUser}
              />
            )}

            {/* 10. SHEETS CONNECTOR & THEME SETTINGS */}
            {activeTab === 'settings' && hasPermission('settings') && (
              <SettingsPage 
                appTheme={appTheme}
                setAppTheme={setAppTheme}
                sheetsConfig={sheetsConfig}
                handleSaveSheetsConfig={handleSaveSheetsConfig}
                handleSyncSheetsNow={handleSyncSheetsNow}
                isOfflineMode={isOfflineMode}
                setProducts={setProducts}
                setOrders={setOrders}
                setCustomers={setCustomers}
                setStockIn={setStockIn}
                setStockOut={setStockOut}
                setStockOpname={setStockOpname}
                setUsers={setUsers}
                setActivityLog={setActivityLog}
                setSheetsConfig={setSheetsConfig}
              />
            )}

          </motion.div>
        </AnimatePresence>

  );
}
