import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const defaultLookups = [
  { Category: 'SHIPPING_COURIER', Value: 'JNE Reg' },
  { Category: 'SHIPPING_COURIER', Value: 'JNE YES' },
  { Category: 'SHIPPING_COURIER', Value: 'Wahana' },
  { Category: 'SHIPPING_COURIER', Value: 'SiCepat' },
  { Category: 'STOCK_SOURCE', Value: 'Konveksi' },
  { Category: 'STOCK_SOURCE', Value: 'Return' },
  { Category: 'STOCK_DESTINATION', Value: 'Sales' },
  { Category: 'STOCK_DESTINATION', Value: 'Return to Konveksi' },
  { Category: 'STOCK_DESTINATION', Value: 'Reject Disposal' },
  { Category: 'QUALITY_TYPE', Value: 'Good' },
  { Category: 'QUALITY_TYPE', Value: 'Reject' },
  { Category: 'PRODUCT_CATEGORY', Value: 'Celamis' },
  { Category: 'PRODUCT_CATEGORY', Value: 'Gamis' },
  { Category: 'ORDER_CHANNEL', Value: 'Reseller' },
  { Category: 'ORDER_CHANNEL', Value: 'Agen' },
  { Category: 'ORDER_CHANNEL', Value: 'Shopee' },
  { Category: 'ORDER_CHANNEL', Value: 'TikTok' },
];

async function main() {
  console.log('Seeding SystemLookup...');
  for (const item of defaultLookups) {
    const existing = await prisma.systemLookup.findFirst({
      where: { Category: item.Category, Value: item.Value }
    });
    if (!existing) {
      await prisma.systemLookup.create({ data: item });
    }
  }
  console.log('Done seeding SystemLookup.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
