import re

with open('api/routes/productRoutes.ts', 'r') as f:
    content = f.read()

# For CREATE
content = content.replace(
    'Retail_Price: Number(product.Retail_Price),',
    'Retail_Price: Number(product.Retail_Price),\n        Marketer_Price: Number(product.Marketer_Price),\n        Reseller_Price: Number(product.Reseller_Price),\n        Agen_Price: Number(product.Agen_Price),'
)
# Wait, this will match twice (CREATE and UPDATE). That's perfect!
# But let's check Reseller_Price is already there, so I should just replace Reseller_Price to include Marketer and Agen

with open('api/routes/productRoutes.ts', 'r') as f:
    content = f.read()
    
# Clean up duplicate replacement from previous thought process
content = content.replace(
    'Retail_Price: Number(product.Retail_Price),\n        Reseller_Price: Number(product.Reseller_Price),\n        Distributor_Price: Number(product.Distributor_Price),',
    'Retail_Price: Number(product.Retail_Price),\n        Marketer_Price: Number(product.Marketer_Price),\n        Reseller_Price: Number(product.Reseller_Price),\n        Agen_Price: Number(product.Agen_Price),\n        Distributor_Price: Number(product.Distributor_Price),'
)

content = content.replace(
    'Retail_Price: p.Retail_Price !== undefined ? Number(p.Retail_Price) : existing.Retail_Price,\n          Reseller_Price: p.Reseller_Price !== undefined ? Number(p.Reseller_Price) : existing.Reseller_Price,\n          Distributor_Price: p.Distributor_Price !== undefined ? Number(p.Distributor_Price) : existing.Distributor_Price,',
    'Retail_Price: p.Retail_Price !== undefined ? Number(p.Retail_Price) : existing.Retail_Price,\n          Marketer_Price: p.Marketer_Price !== undefined ? Number(p.Marketer_Price) : existing.Marketer_Price,\n          Reseller_Price: p.Reseller_Price !== undefined ? Number(p.Reseller_Price) : existing.Reseller_Price,\n          Agen_Price: p.Agen_Price !== undefined ? Number(p.Agen_Price) : existing.Agen_Price,\n          Distributor_Price: p.Distributor_Price !== undefined ? Number(p.Distributor_Price) : existing.Distributor_Price,'
)

content = content.replace(
    'Retail_Price: Number(p.Retail_Price) || 0,\n          Reseller_Price: Number(p.Reseller_Price) || 0,\n          Distributor_Price: Number(p.Distributor_Price) || 0,',
    'Retail_Price: Number(p.Retail_Price) || 0,\n          Marketer_Price: Number(p.Marketer_Price) || 0,\n          Reseller_Price: Number(p.Reseller_Price) || 0,\n          Agen_Price: Number(p.Agen_Price) || 0,\n          Distributor_Price: Number(p.Distributor_Price) || 0,'
)

with open('api/routes/productRoutes.ts', 'w') as f:
    f.write(content)

