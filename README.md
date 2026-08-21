# Petals by Smira - Backend API

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in real values:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `CLOUDINARY_*` — from cloudinary.com dashboard
   - `RAZORPAY_*` — from razorpay.com dashboard
   - `JWT_SECRET` — any long random string
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — first admin login credentials
3. `node seed.js` — creates the first admin account + default categories (run ONCE)
4. `npm run dev` — starts server on http://localhost:5000

## Folder structure
- `models/` — Mongoose schemas (Product, Category, Order, User, Admin, Coupon)
- `controllers/` — business logic
- `routes/` — API endpoints
- `middleware/` — auth (JWT) + image upload (Cloudinary)
- `config/` — DB, Cloudinary, Razorpay setup
- `utils/` — helpers (token generation, order number generation)

## Key API routes

### Public
- GET  /api/products (filters: category, occasion, minPrice, maxPrice, search, sort, page, limit)
- GET  /api/products/:idOrSlug
- GET  /api/categories
- POST /api/auth/register, /api/auth/login
- POST /api/orders (checkout — works for logged-in user or guest)
- GET  /api/orders/track/:orderNumber
- POST /api/payment/verify (after Razorpay checkout completes)

### Admin (needs Bearer token from /api/admin/login)
- POST   /api/admin/login
- POST   /api/admin/products (multipart form, field name "images", up to 6)
- PUT    /api/admin/products/:id
- DELETE /api/admin/products/:id
- POST   /api/admin/categories (multipart form, field name "image")
- GET    /api/admin/orders?status=placed
- PUT    /api/admin/orders/:id/status  body: { status, note, trackingId }
- GET    /api/admin/dashboard

## Order + Payment flow
1. Frontend calls POST /api/orders with cart items + address + paymentMethod
2. If COD → order created immediately, stock reduced
3. If Razorpay → order created (paymentStatus: pending) + Razorpay order returned
4. Frontend opens Razorpay checkout using returned keyId/orderId
5. On success, frontend calls POST /api/payment/verify with Razorpay response
6. Backend verifies signature, marks order paid, reduces stock
