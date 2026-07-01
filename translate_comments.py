import re

with open('api/routes/ecommerceRoutes.ts', 'r') as f:
    content = f.read()

replacements = {
    "Sync catalog": "Sinkronisasi katalog",
    "Return only active products and omit cost price for security": "Kembalikan hanya produk aktif dan sembunyikan harga modal untuk keamanan",
    "Get current stock for a specific product": "Ambil stok saat ini untuk produk tertentu",
    "Inject a new paid order": "Masukkan pesanan baru yang sudah dibayar",
    "Validate stock for all items before processing": "Validasi stok untuk semua barang sebelum diproses",
    "IDEMPOTENCY CHECK: If order already exists, return success to prevent double deduction on retries": "PENGECEKAN IDEMPOTENSI: Jika pesanan sudah ada, kembalikan status sukses untuk mencegah pemotongan ganda saat dicoba ulang",
    "Use transaction to ensure data integrity": "Gunakan transaksi untuk memastikan integritas data",
    "Deduct stock": "Potong stok",
    "Calculate amount": "Hitung jumlah",
    "Create order entry": "Buat entri pesanan",
    "Direct to ready to ship if it came from E-commerce": "Langsung ke status siap kirim jika berasal dari E-commerce",
    "If E-commerce passed Biteship shipping info, create shipping record immediately": "Jika E-commerce mengirimkan info pengiriman Biteship, segera buat rekam pengiriman",
    "Get order and shipping status": "Ambil status pesanan dan pengiriman",
    "Find the order": "Cari pesanan",
    "Since items in the same order usually share the same status, just grab the first one": "Karena barang dalam pesanan yang sama biasanya memiliki status yang sama, ambil yang pertama saja",
    "Look for shipping info": "Cari info pengiriman",
    "Update product image URL": "Perbarui URL gambar produk",
    "Cancel an order and restore stock": "Batalkan pesanan dan kembalikan stok",
    "Used by e-commerce when customer fails to pay or cancels order.": "Digunakan oleh e-commerce ketika pelanggan gagal membayar atau membatalkan pesanan.",
    "Cancel order & restore stock": "Batalkan pesanan & kembalikan stok",
    "Find all items in the order": "Cari semua barang di dalam pesanan",
    "Idempotent cancel check": "Pengecekan pembatalan idempoten",
    "Restore stock": "Kembalikan stok",
    "Set Order Status to Cancelled": "Ubah Status Pesanan menjadi Dibatalkan",
    "Set Shipping Status to Cancelled (if it exists)": "Ubah Status Pengiriman menjadi Dibatalkan (jika ada)"
}

for eng, ind in replacements.items():
    content = content.replace(eng, ind)

with open('api/routes/ecommerceRoutes.ts', 'w') as f:
    f.write(content)
