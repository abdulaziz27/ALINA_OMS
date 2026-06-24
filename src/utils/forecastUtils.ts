import { Order, Product } from '../types.ts';

export const calculateRestockForecast = (orders: Order[], products: Product[]) => {
  const forecastAlerts: { sku: string; name: string; current: number; dsr: number; daysToEmpty: number; predictedDate: string }[] = [];
  
  // Past 30 days orders that are active/sold
  const activeOrders = orders.filter(o => 
    !['Draft', 'Cancelled'].includes(o.Status) && 
    (Date.now() - new Date(o.Order_Date).getTime()) < (30 * 24 * 60 * 60 * 1000)
  );

  products.forEach(p => {
    // Calculate Sum Qty in past 30 days
    const totalSoldIn30Days = activeOrders
      .filter(o => o.SKU === p.SKU)
      .reduce((sum, current) => sum + current.Qty, 0);

    const dailySalesRate = totalSoldIn30Days / 30; // units per day

    if (dailySalesRate > 0) {
      const daysToEmpty = p.Current_Stock / dailySalesRate;
      if (daysToEmpty <= 14) {
        // Calculate predicted date
        const pDateStr = new Date(Date.now() + (daysToEmpty * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
        
        forecastAlerts.push({
          sku: p.SKU,
          name: p.Product_Name,
          current: p.Current_Stock,
          dsr: Number(dailySalesRate.toFixed(2)),
          daysToEmpty: Math.round(daysToEmpty),
          predictedDate: pDateStr
        });
      }
    } else if (p.Current_Stock <= p.Minimum_Stock) {
      // Fallback warning based on minimum physical stock alert thresholds
      forecastAlerts.push({
        sku: p.SKU,
        name: p.Product_Name,
        current: p.Current_Stock,
        dsr: 0,
        daysToEmpty: 0,
        predictedDate: "Segera"
      });
    }
  });

  return forecastAlerts;
};
