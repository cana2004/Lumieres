# Lumieres Atelier

Frontend statik + JavaScript backend API.

## 1. GitHub Pages (frontend)
1. Krijo një repository në GitHub dhe ngarko përmbajtjen e këtij folderi.
2. GitHub > Settings > Pages.
3. Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Faqja hapet nga GitHub Pages. Produktet dhe shporta punojnë edhe pa backend falë fallback-it lokal.

## 2. Backend JavaScript
Backend-i është te `backend/` dhe përdor Node.js + Express.

```bash
cd backend
npm install
npm start
```

API lokale: `http://localhost:3000`

Endpoints:
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`

## 3. Lidh frontend-in me backend-in online
GitHub Pages nuk ekzekuton Node.js. Deploy folderin `backend` në një host Node.js (p.sh. Render/Railway), pastaj vendos URL-në në `config.js`:

```js
window.LUMIERES_API_URL = 'https://ADRESA-E-BACKEND-IT';
```

Pastaj commit/push përsëri në GitHub.

## Shënim për databazën
Ky version ruan porositë në `backend/data/orders.json`, i përshtatshëm për demonstrim/local development. Për prodhim real duhet PostgreSQL/MongoDB/Supabase sepse disa host-e e humbin filesystem-in lokal pas redeploy/restart.
