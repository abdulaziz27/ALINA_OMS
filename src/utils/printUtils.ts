import { Order, User } from '../types.ts';
import { generateCode128SvgPath } from '../barcodeUtils.ts';

export const printInvoice = (orderNumber: string, orders: Order[], currentUser: User | null) => {
  const relatedItems = orders.filter(item => item.Order_Number === orderNumber);
  if (relatedItems.length === 0) return;

  const rep = relatedItems[0];
  const totalSum = relatedItems.reduce((acc, item) => acc + item.Total, 0);
  const totalQty = relatedItems.reduce((acc, item) => acc + item.Qty, 0);
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const { path, width } = generateCode128SvgPath(orderNumber);
  const dateFormatted = new Date(rep.Order_Date).toLocaleString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const itemsRowsHtml = relatedItems.map(item => `
    <div style="margin-bottom: 8px;">
      <div style="font-weight: bold; font-size: 11px;">${item.Product.toUpperCase()}</div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #555; font-family: monospace;">
        <span>${item.SKU} (${item.Qty} Pcs x Rp ${item.Price.toLocaleString()})</span>
        <span>Rp ${item.Total.toLocaleString()}</span>
      </div>
    </div>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>STRUK PENJUALAN - ${orderNumber}</title>
        <style>
          @media print {
            body { margin: 0; padding: 10px; width: 80mm; }
            @page { size: 80mm auto; margin: 0; }
          }
          body {
            font-family: 'Courier New', Courier, monospace;
            color: #000;
            background-color: #fff;
            width: 320px;
            margin: 0 auto;
            padding: 15px;
            box-sizing: border-box;
          }
          .header { text-align: center; margin-bottom: 12px; }
          .brand { font-size: 16px; font-weight: bold; letter-spacing: 1px; margin-bottom: 2px; }
          .subtitle { font-size: 9px; color: #444; line-height: 1.2; }
          .divider { border-top: 1px dashed #000; margin: 8px 0; }
          .meta-item { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px; }
          .meta-label { font-weight: bold; }
          .totals { font-size: 11px; font-family: monospace; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
          .grand-total { font-size: 13px; font-weight: bold; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 4px 0; margin-top: 4px; }
          .barcode-container { text-align: center; margin-top: 15px; margin-bottom: 5px; }
          .footer { text-align: center; font-size: 8px; margin-top: 15px; line-height: 1.3; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <div class="header">
          <div class="brand">ALINA OFFICIAL</div>
          <div class="subtitle">Depok</div>
          <div class="subtitle">08979888648</div>
          <div class="subtitle">@Alinaofficial.id</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="meta-item">
          <span class="meta-label">NO ORDER:</span>
          <span style="font-weight: bold;">${orderNumber}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">TANGGAL:</span>
          <span>${dateFormatted}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">PELANGGAN:</span>
          <span>${rep.Customer}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">CHANNEL:</span>
          <span>${rep.Channel.toUpperCase()}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">ADMIN/KASIR:</span>
          <span>${currentUser ? currentUser.Full_Name : 'Administrator'}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">STATUS ORDER:</span>
          <span style="font-weight: bold;">[ ${rep.Status.toUpperCase()} ]</span>
        </div>
        
        <div class="divider"></div>
        
        <div class="items-container">
          ${itemsRowsHtml}
        </div>
        
        <div class="divider"></div>
        
        <div class="totals">
          <div class="total-row">
            <span>TOTAL PRODUK:</span>
            <span>${totalQty} PCS</span>
          </div>
          <div class="total-row grand-total">
            <span>GRAND TOTAL:</span>
            <span>Rp ${totalSum.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="barcode-container">
          <svg width="220" height="45" viewBox="0 0 ${width} 65" style="margin: 0 auto; display: block;">
            <path d="${path}" stroke="#000000" stroke-width="2" />
          </svg>
          <div style="font-size: 9px; font-weight: bold; margin-top: 4px; letter-spacing: 2px;">${orderNumber}</div>
        </div>
        
        <div class="footer">
          <div style="text-align: left; margin-bottom: 8px; padding-left: 10px;">
            <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px;">Info Pembayaran Silakan transfer ke</div>
            <div style="font-size: 10px; font-family: monospace; line-height: 1.4;">
              BCA : 740 184 7590<br/>
              BRI : 117 00100 7704 500<br/>
              BSI : 562 852 9660 <br/>
              Mandiri : 101 000 5544 059<br/>
              <span style="font-weight: bold; display: block; margin-top: 4px;">An. Fina Mokoginta</span>
            </div>
          </div>
          <div style="font-weight: bold; font-size: 11px; margin-top: 10px;">Terima kasih banyak</div>
          <div style="margin-top: 8px; font-style: italic; font-size: 7px; color: #777;">Powered by ALINA Enterprise - OMS WMS Portal</div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
};
