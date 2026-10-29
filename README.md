# Petals by Smira — Concierge & Private Access API

Production-ready backend API for **Petals by Smira** luxury atelier e-commerce and private access portal.

## Architecture Overview
- **Model**: Private Access Concierge & Bespoke High-Jewellery
- **Stack**: Node.js (ES Modules), Express.js, MongoDB Atlas (Mongoose), Socket.io, Cloudinary, Resend
- **Domain**: `api.petalsbysmira.in` (proxying Express server)

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` (or `.env.local` for local development):
```ini
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=super_secret_jwt_key_min_32_chars
JWT_EXPIRE=30d
FRONTEND_URL=https://petalsbysmira.in
ADMIN_URL=https://admin.petalsbysmira.in
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=re_...
EMAIL_FROM=Petals by Smira <concierge@petalsbysmira.in>
```

### 3. Running the Server
```bash
# Development
npm run dev

# Production
npm start
```

---

## API Endpoints Reference

### Public Routes
- `GET /` — Health check
- `GET /products` — List active creations (supports `page`, `limit`, `category`, `search`, `featured`)
  *(Prices are shielded and hidden unless valid private access token or session is provided)*
- `GET /products/:idOrSlug` — Single product details
- `GET /categories` — Active collections and categories
- `POST /requests` — Submit request for 24-hour private pricing access
- `GET /requests/private-access/validate/:token` — Validate patron invitation token and receive private session
- `POST /corporate-enquiries` — Submit bespoke corporate gifting inquiry (rate-limited)

### Admin Routes (Protected with `Bearer <JWT>`)
- `POST /admin/login` — Admin authentication (rate-limited)
- `POST /admin/forgot-password` — Send 6-digit password reset OTP (rate-limited)
- `POST /admin/reset-password` — Verify OTP and set new password (max 5 attempts lock)
- `GET /admin/profile` — View current admin profile
- `PUT /admin/profile` — Update admin name
- `PUT /admin/profile/password` — Change admin password
- `GET /admin/dashboard` — Overview statistics
- `GET /admin/products` — Manage all products (active/inactive)
- `GET /admin/products/:id` — Product details
- `POST /admin/products` — Create product (multipart, up to 6 images)
- `PUT /admin/products/:id` — Update product details and images
- `PATCH /admin/products/:id/status` — Safe toggle product visibility (`isActive`)
- `DELETE /admin/products/:id` — Delete product (with Cloudinary cleanup)
- `GET /admin/categories` — Manage categories
- `POST /admin/categories` — Create category
- `PUT /admin/categories/:id` — Update category
- `DELETE /admin/categories/:id` — Delete category (guards against orphaned products)
- `GET /requests` — List client access requests (supports `page`, `limit`, `status`, `search`)
- `GET /requests/:id` — Request detail
- `PUT /requests/:id` — Update request status & internal staff notes
- `POST /requests/:id/generate-link` — Generate 24-hr access link & email client
- `POST /requests/:id/resend` — Refresh & resend invitation email
- `POST /requests/:id/revoke` — Revoke client private access
- `GET /corporate-enquiries` — View list of corporate gifting inquiries

---

## Real-Time Notifications (Socket.io)
Socket.io connects on the root API server requiring JWT authentication handshake (`socket.handshake.auth.token`).
- `newAccessRequest` — Emitted when a client submits an access request
- `newCorporateEnquiry` — Emitted when a client submits a corporate inquiry
