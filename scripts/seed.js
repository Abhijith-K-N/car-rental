const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc } = require('firebase/firestore')

// ⚠️ Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const cars = [
  {
    name: 'Toyota Camry', brand: 'Toyota', type: 'Sedan', seats: 5,
    pricePerDay: 80, location: 'Mumbai', available: true,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600',
  },
  {
    name: 'Honda CR-V', brand: 'Honda', type: 'SUV', seats: 7,
    pricePerDay: 120, location: 'Delhi', available: true,
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600',
  },
  {
    name: 'Hyundai i20', brand: 'Hyundai', type: 'Hatchback', seats: 5,
    pricePerDay: 45, location: 'Bangalore', available: true,
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600',
  },
  {
    name: 'BMW 5 Series', brand: 'BMW', type: 'Luxury', seats: 5,
    pricePerDay: 280, location: 'Mumbai', available: true,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600',
  },
  {
    name: 'Maruti Swift', brand: 'Maruti', type: 'Hatchback', seats: 5,
    pricePerDay: 40, location: 'Chennai', available: true,
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600',
  },
  {
    name: 'Tata Nexon', brand: 'Tata', type: 'SUV', seats: 5,
    pricePerDay: 90, location: 'Pune', available: true,
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600',
  },
  {
    name: 'Mercedes C-Class', brand: 'Mercedes', type: 'Luxury', seats: 5,
    pricePerDay: 320, location: 'Delhi', available: true,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600',
  },
  {
    name: 'Mahindra Scorpio', brand: 'Mahindra', type: 'SUV', seats: 7,
    pricePerDay: 100, location: 'Jaipur', available: true,
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600',
  },
]

async function seed() {
  console.log('🌱 Seeding Firestore...')
  for (const car of cars) {
    await addDoc(collection(db, 'cars'), car)
    console.log(`✅ Added: ${car.name}`)
  }
  console.log('\n🎉 Seeding complete! Your fleet is ready.')
  process.exit(0)
}

seed().catch(console.error)
