
import React from 'react';
import { Order, Product, Customer, OrderStatus } from '../types.ts';
import CreateOrderForm from '../components/orders/CreateOrderForm.tsx';
import OrderListTable from '../components/orders/OrderListTable.tsx';

interface OrdersPageProps {
  lookups?: any[];
  orders: Order[];
  products: Product[];
  customers: Customer[];
  formatIDR: (val: number) => string;
  hasPermission: (perm: string) => boolean;
  tempOrderItems: any[];
  setTempOrderItems: (val: any) => void;
  ordChannel: string;
  setOrdChannel: (val: string) => void;
  ordCustomer: string;
  setOrdCustomer: (val: string) => void;
  ordCategory: string;
  setOrdCategory: (val: string) => void;
  ordColor: string;
  setOrdColor: (val: string) => void;
  ordVariant: string;
  setOrdVariant: (val: string) => void;
  ordQty: string;
  setOrdQty: (val: string) => void;
  ordPrice: string;
  setOrdPrice: (val: string) => void;
  handleRemoveProductFromStaging: (idx: number) => void;
  handleUpdateOrderStatus: (num: string, newStatus: string) => void;
  setActiveDetailOrderNum: (val: string | null) => void;
  setActiveTab: (val: string) => void;
  setSelectedShipOrder: (val: string | null) => void;
  handleOpenPackStation: (val: any) => void;
  handlePrintInvoice: (val: string) => void;
  handleCreateOrderSubmit: (e: React.FormEvent) => void;
  handleAddProductToStaging: () => void;
  availableCategories: any[];
  availableVariants: any[];
  availableColorPresets: any[];
  ordSku: string;
  setOrdSku: (val: string) => void;
}

export default function OrdersPage({
  lookups = [],
  orders,
  products,
  customers,
  formatIDR,
  hasPermission,
  tempOrderItems,
  setTempOrderItems,
  ordChannel,
  setOrdChannel,
  ordCustomer,
  setOrdCustomer,
  ordCategory,
  setOrdCategory,
  ordColor,
  setOrdColor,
  ordVariant,
  setOrdVariant,
  ordQty,
  setOrdQty,
  ordPrice,
  setOrdPrice,
  handleRemoveProductFromStaging,
  handleUpdateOrderStatus,
  setActiveDetailOrderNum,
  setActiveTab,
  setSelectedShipOrder,
  handleOpenPackStation,
  handlePrintInvoice,
  handleCreateOrderSubmit,
  handleAddProductToStaging,
  availableCategories,
  availableVariants,
  availableColorPresets,
  ordSku,
  setOrdSku
}: OrdersPageProps) {
  return (
    <div className="space-y-6 text-left">
      {/* Split operational screen: Create Order vs Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Create Order Card */}
        <div className="lg:col-span-4">
          <CreateOrderForm lookups={lookups} 
            customers={customers}
            ordCustomer={ordCustomer}
            setOrdCustomer={setOrdCustomer}
            ordChannel={ordChannel}
            setOrdChannel={setOrdChannel}
            availableCategories={availableCategories}
            ordCategory={ordCategory}
            setOrdCategory={setOrdCategory}
            availableVariants={availableVariants}
            ordVariant={ordVariant}
            setOrdVariant={setOrdVariant}
            availableColorPresets={availableColorPresets}
            ordColor={ordColor}
            setOrdColor={setOrdColor}
            ordSku={ordSku}
            ordQty={ordQty}
            setOrdQty={setOrdQty}
            ordPrice={ordPrice}
            setOrdPrice={setOrdPrice}
            handleAddProductToStaging={handleAddProductToStaging}
            tempOrderItems={tempOrderItems}
            setTempOrderItems={setTempOrderItems}
            handleRemoveProductFromStaging={handleRemoveProductFromStaging}
            handleCreateOrderSubmit={handleCreateOrderSubmit}
            formatIDR={formatIDR}
          />
        </div>

        {/* Listings & Fulfillment pipelines */}
        <div className="lg:col-span-8">
          <OrderListTable 
            orders={orders}
            formatIDR={formatIDR}
            hasPermission={hasPermission}
            setActiveDetailOrderNum={setActiveDetailOrderNum}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleOpenPackStation={handleOpenPackStation}
            setSelectedShipOrder={setSelectedShipOrder}
            setActiveTab={setActiveTab}
            handlePrintInvoice={handlePrintInvoice}
          />
        </div>

      </div>
    </div>
  );
}
