# 🚗 CarRent — Next.js + Firebase Car Rental App

A full-stack car rental application built with Next.js (App Router), Tailwind CSS, and Firebase.

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Edit `.env.local` and replace the placeholder values with your actual Firebase project credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Seed the database (optional)
Edit `scripts/seed.js` with your Firebase config, then run:
```bash
node scripts/seed.js
```

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Making a User an Admin

1. Register a user through the app
2. Go to **Firebase Console → Firestore → users collection**
3. Find the user document and change `role` from `"customer"` to `"admin"`
4. That user will now see the Admin Panel link in the navbar

---

## 📁 Project Structure

```
car-rental/
├── app/
│   ├── globals.css
│   ├── layout.jsx
│   ├── page.jsx                    ← Landing page
│   ├── cars/page.jsx               ← Car listing with filters
│   ├── cars/[id]/page.jsx          ← Car detail page
│   ├── booking/[carId]/page.jsx    ← Booking form
│   ├── payment/page.jsx            ← Mock payment page
│   ├── my-bookings/page.jsx        ← User bookings
│   ├── admin/page.jsx              ← Admin dashboard
│   └── auth/
│       ├── login/page.jsx
│       └── register/page.jsx
├── components/
│   ├── Navbar.jsx
│   └── CarCard.jsx
├── context/
│   └── AuthContext.jsx
├── lib/
│   └── firebase.js
├── scripts/
│   └── seed.js
├── .env.local
├── next.config.js
├── postcss.config.js
└── tailwind.config.js
```

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Firebase** (Auth, Firestore, Storage)
