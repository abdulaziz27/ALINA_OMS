import re

with open('api/routes/ecommerceRoutes.ts', 'r') as f:
    content = f.read()

replacements = {
    "'Internal Server Error'": "'Terjadi Kesalahan Internal Server'",
    "'Error fetching products for ecommerce:'": "'Gagal mengambil produk untuk e-commerce:'",
    "'Product not found'": "'Produk tidak ditemukan'",
    "'Error fetching stock for ecommerce:'": "'Gagal mengambil stok untuk e-commerce:'",
    "'Invalid order payload'": "'Data pesanan tidak valid'",
    "'Product SKU ${item.sku} not found'": "'Produk dengan SKU ${item.sku} tidak ditemukan'",
    "'Insufficient stock for SKU ${item.sku}. Available: ${(product as any).Current_Stock}, Requested: ${item.qty}'": "'Stok tidak cukup untuk SKU ${item.sku}. Tersedia: ${(product as any).Current_Stock}, Diminta: ${item.qty}'",
    "'Order already processed (Idempotent response)'": "'Pesanan sudah diproses (Respon Idempoten)'",
    "'Order successfully injected and stock deducted'": "'Pesanan berhasil dimasukkan dan stok telah dipotong'",
    "'Error injecting order from ecommerce:'": "'Gagal memasukkan pesanan dari e-commerce:'",
    "'Order not found'": "'Pesanan tidak ditemukan'",
    "'Error fetching order status for ecommerce:'": "'Gagal mengambil status pesanan untuk e-commerce:'",
    "'imageUrl is required'": "'imageUrl wajib diisi'",
    "'Image URL updated successfully'": "'URL Gambar berhasil diperbarui'",
    "'Error updating product image:'": "'Gagal memperbarui gambar produk:'",
    "'Order already cancelled (Idempotent response)'": "'Pesanan sudah dibatalkan (Respon Idempoten)'",
    "'Order cancelled and stock restored successfully'": "'Pesanan berhasil dibatalkan dan stok telah dikembalikan'",
    "'Error cancelling order:'": "'Gagal membatalkan pesanan:'"
}

for eng, ind in replacements.items():
    content = content.replace(eng, ind)

with open('api/routes/ecommerceRoutes.ts', 'w') as f:
    f.write(content)
