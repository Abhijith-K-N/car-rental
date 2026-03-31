# 🚗 CarRent — Car Rental Web Application

A modern, full-stack car rental web application built with **Next.js**, **Tailwind CSS**, and **Supabase**. Features a sleek dark glassmorphism UI, real-time bookings, mock payments, and a full admin panel.

---

## 🌐 Live Demo

> [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

---

## ✨ Features

### Customer
- 🔍 Browse and filter cars by type, location, and price
- 📅 Book cars with date conflict detection
- 💳 Mock payment flow with confirmation
- 📋 View and cancel bookings from personal dashboard
- 🔐 Secure authentication (email/password via Supabase Auth)

### Admin
- 🚗 Add, edit, and delete cars from the fleet
- 📊 Overview dashboard with revenue and booking stats
- 📋 View and update status of all bookings
- 🖼️ Upload car images via Supabase Storage

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📁 Project Structure

```
car-rental/
├── app/
│   ├── admin/page.jsx          → Admin panel
│   ├── auth/
│   │   ├── login/page.jsx      → Login page
│   │   └── register/page.jsx   → Register page
│   ├── booking/[carId]/page.jsx → Booking form
│   ├── cars/
│   │   ├── page.jsx            → Car listing
│   │   └── [id]/page.jsx       → Car detail
│   ├── my-bookings/page.jsx    → User bookings
│   ├── payment/page.jsx        → Mock payment
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx                → Landing page
├── components/
│   ├── CarCard.jsx
│   ├── Navbar.jsx
│   └── ImmersiveBackground.jsx
├── context/
│   └── AuthContext.jsx
├── lib/
│   └── supabase.js             → Supabase client
├── public/
│   └── favicon.ico
└── .env.local
```

---

## 🗄️ Supabase Database Schema

### `users`
| Column | Type |
|---|---|
| id | uuid (FK → auth.users) |
| name | text |
| email | text |
| role | text (`customer` / `admin`) |
| created_at | timestamp |

### `cars`
| Column | Type |
|---|---|
| id | uuid |
| name | text |
| brand | text |
| type | text |
| seats | int |
| price_per_day | numeric |
| image_url | text |
| location | text |
| available | boolean |
| created_at | timestamp |

### `bookings`
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid (FK → users) |
| car_id | uuid (FK → cars) |
| start_date | date |
| end_date | date |
| total_price | numeric |
| status | text (`PENDING` / `CONFIRMED` / `CANCELLED` / `COMPLETED`) |
| created_at | timestamp |

### `payments`
| Column | Type |
|---|---|
| id | uuid |
| booking_id | uuid (FK → bookings) |
| user_id | uuid (FK → users) |
| amount | numeric |
| status | text (`PENDING` / `PAID`) |
| paid_at | timestamp |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/car-rental-app.git
cd car-rental-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

- Go to [supabase.com](https://supabase.com) and create a new project
- Create the tables using the schema above
- Enable **Email Auth** under Authentication → Providers
- Create a **storage bucket** named `car-images` (set to public)

### 4. Configure environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Setting Up Admin Access

1. Register a new account normally
2. Go to **Supabase Dashboard → Table Editor → users**
3. Find your user and change `role` from `customer` to `admin`
4. Log out and log back in — you'll see the **Admin Panel** in the navbar

---

## 🌍 Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy** ✅

Vercel auto-detects Next.js — no extra config needed.

---

## 📸 Pages Overview

| Page | Route |
|---|---|
| Landing | `/` |
| Car Listing | `/cars` |
| Car Detail | `/cars/[id]` |
| Booking | `/booking/[carId]` |
| Payment | `/payment` |
| My Bookings | `/my-bookings` |
| Admin Panel | `/admin` |
| Login | `/auth/login` |
| Register | `/auth/register` |

---

## 👨‍💻 Author

Built by **Abhijith** — CS Engineering Student @ Dayananda Sagar College of Engineering, Bangalore

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).