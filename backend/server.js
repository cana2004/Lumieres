const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTS = path.join(__dirname, 'data', 'products.json');
const ORDERS = path.join(__dirname, 'data', 'orders.json');

app.use(cors({origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*'}));
app.use(express.json({limit:'1mb'}));

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2));

app.get('/', (_req,res) => res.json({name:'Lumieres Atelier API',status:'ok'}));
app.get('/api/health', (_req,res) => res.json({ok:true,time:new Date().toISOString()}));
app.get('/api/products', (_req,res) => res.json(readJson(PRODUCTS)));
app.get('/api/products/:id', (req,res) => {
  const product = readJson(PRODUCTS).find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({message:'Product not found'});
  res.json(product);
});
app.post('/api/orders', (req,res) => {
  const {customer, items} = req.body || {};
  if (!customer?.name || !customer?.phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({message:'Name, phone and at least one cart item are required.'});
  }
  const products = readJson(PRODUCTS);
  let total = 0;
  const normalizedItems = [];
  for (const item of items) {
    const product = products.find(p => p.id === Number(item.productId));
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (!product) return res.status(400).json({message:`Invalid product: ${item.productId}`});
    total += product.price * quantity;
    normalizedItems.push({productId:product.id,name:product.name,price:product.price,quantity,scent:item.scent || ''});
  }
  const orders = readJson(ORDERS);
  const order = {id:`LA-${Date.now()}`,createdAt:new Date().toISOString(),status:'new',customer,items:normalizedItems,total};
  orders.push(order); writeJson(ORDERS, orders);
  res.status(201).json(order);
});
app.get('/api/orders', (_req,res) => res.json(readJson(ORDERS)));
app.use((err,_req,res,_next) => { console.error(err); res.status(500).json({message:'Internal server error'}); });
app.listen(PORT, () => console.log(`Lumieres API running on port ${PORT}`));
