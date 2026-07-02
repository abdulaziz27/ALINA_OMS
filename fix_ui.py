import re

with open('src/components/products/ProductEditor.tsx', 'r') as f:
    content = f.read()

# 1. State
content = content.replace(
    "const [resellerPrice, setResellerPrice] = useState<number | string>('');",
    "const [marketerPrice, setMarketerPrice] = useState<number | string>('');\n  const [resellerPrice, setResellerPrice] = useState<number | string>('');\n  const [agenPrice, setAgenPrice] = useState<number | string>('');"
)

# 2. Assignment inside useEffect (when editing)
content = content.replace(
    "setResellerPrice(selectedProduct.Reseller_Price || '');",
    "setMarketerPrice(selectedProduct.Marketer_Price || '');\n        setResellerPrice(selectedProduct.Reseller_Price || '');\n        setAgenPrice(selectedProduct.Agen_Price || '');"
)

# 3. Reset (when creating new)
content = content.replace(
    "setResellerPrice('');",
    "setMarketerPrice('');\n      setResellerPrice('');\n      setAgenPrice('');"
)

# 4. Payload in onSaveProduct
content = content.replace(
    "Retail_Price: Number(sellingPrice),\n      Reseller_Price: Number(resellerPrice),\n      Distributor_Price: Number(distributorPrice),",
    "Retail_Price: Number(sellingPrice),\n      Marketer_Price: Number(marketerPrice),\n      Reseller_Price: Number(resellerPrice),\n      Agen_Price: Number(agenPrice),\n      Distributor_Price: Number(distributorPrice),"
)

# Also in print label payload
content = content.replace(
    "Retail_Price: Number(sellingPrice),\n                      Reseller_Price: Number(resellerPrice),\n                      Distributor_Price: Number(distributorPrice),",
    "Retail_Price: Number(sellingPrice),\n                      Marketer_Price: Number(marketerPrice),\n                      Reseller_Price: Number(resellerPrice),\n                      Agen_Price: Number(agenPrice),\n                      Distributor_Price: Number(distributorPrice),"
)

# 5. UI HTML (find the grid with prices)
ui_to_replace = """                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Reseller</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 font-medium">Rp</span>
                    <input type="number" value={resellerPrice} onChange={e => setResellerPrice(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="0" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Distributor</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 font-medium">Rp</span>
                    <input type="number" value={distributorPrice} onChange={e => setDistributorPrice(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="0" />
                  </div>
                </div>"""

ui_replacement = """                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Marketer</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 font-medium">Rp</span>
                    <input type="number" value={marketerPrice} onChange={e => setMarketerPrice(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="0" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Reseller</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 font-medium">Rp</span>
                    <input type="number" value={resellerPrice} onChange={e => setResellerPrice(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="0" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Agen</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 font-medium">Rp</span>
                    <input type="number" value={agenPrice} onChange={e => setAgenPrice(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="0" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Distributor</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 font-medium">Rp</span>
                    <input type="number" value={distributorPrice} onChange={e => setDistributorPrice(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="0" />
                  </div>
                </div>"""

content = content.replace(ui_to_replace, ui_replacement)

with open('src/components/products/ProductEditor.tsx', 'w') as f:
    f.write(content)
