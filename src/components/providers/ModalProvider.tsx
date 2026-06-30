import React from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import PackingStationModal from '../modals/PackingStationModal.tsx';
import OrderDetailModal from '../modals/OrderDetailModal.tsx';
import ScanChoiceModal from '../modals/ScanChoiceModal.tsx';
import CustomerModal from '../modals/CustomerModal.tsx';
import UserModal from '../modals/UserModal.tsx';
import BarcodeScannerModal from '../BarcodeScannerModal.tsx';
import { generateCode128SvgPath } from '../../barcodeUtils.ts';


export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const g = useGlobalState();
  const { scanCallbackRef,
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
    <>
      {children}
      {/* HARDWARE OVERLAY PICKING & PACKING CONFIRMATION MODAL STATION */}
      <PackingStationModal
        activePackOrder={activePackOrder}
        setActivePackOrder={setActivePackOrder}
        orders={orders}
        packChecklist={packChecklist}
        handleTogglePackItem={handleTogglePackItem}
        handleConfirmPackCompleted={handleConfirmPackCompleted}
        formatIDR={formatIDR}
      />

      {/* FULL-SCREEN FULFILLMENT ORDER DETAIL MODAL */}
      <OrderDetailModal
        activeDetailOrderNum={activeDetailOrderNum}
        setActiveDetailOrderNum={setActiveDetailOrderNum}
        orders={orders}
        activityLog={activityLog}
        formatIDR={formatIDR}
        generateCode128SvgPath={generateCode128SvgPath}
        handlePrintInvoice={handlePrintInvoice}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        handleOpenPackStation={handleOpenPackStation}
      />

      {/* DYNAMIC SCANN MODAL TARGETS */}
      <ScanChoiceModal 
        isOpen={isScanChoiceOpen}
        setIsScanChoiceOpen={setIsScanChoiceOpen}
        setSelectedTrxType={setSelectedTrxType}
        setTrxSku={setTrxSku}
        setActiveTab={setActiveTab}
        triggerCameraScanner={triggerCameraScanner}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        productsList={products}
        onScanSuccess={(sku) => scanCallbackRef.current(sku)}
        title={scannerTitle}
      />

      {/* EDIT CUSTOMER MODAL VIEW (RBAC) */}
      <CustomerModal 
        isOpen={isCustomerModalOpen}
        editingCustomer={editingCustomer}
        setEditingCustomer={setEditingCustomer}
        setIsCustomerModalOpen={setIsCustomerModalOpen}
        handleSaveCustomerSubmit={handleSaveCustomerSubmit}
      />

      {/* EDIT USER ACCOUNT MODAL (OWNER RBAC ONLY) */}
      <UserModal 
        isOpen={isUserModalOpen}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        setIsUserModalOpen={setIsUserModalOpen}
        handleSaveUserSubmit={handleSaveUserSubmit}
      />

    </>
  );
}
