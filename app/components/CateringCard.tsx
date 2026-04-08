// "use client"
// import { useState } from 'react';
// import { createBooking } from '@/app/actions/booking';

// export default function BookingForm({ cateringPackage, activePricing }) {
//   const [cart, setCart] = useState([]);

//   // មុខងារ Add to Cart
//   const addToCart = (menuItem) => {
//     setCart((prev) => [...prev, {
//       id: menuItem.id,
//       name: menuItem.menu_name,
//       pricingId: menuItem.pricings[0].id,
//       price: menuItem.pricings[0].price_usd
//     }]);
//   };

//   const handleBooking = async () => {
//     const formData = {
//       customerName: "មាស សុខា",
//       phoneNumber: "012345678",
//       eventDate: "2024-12-25",
//       location: "ភ្នំពេញ",
//       guestCount: 50,
//       serviceType: "Wedding",
//       totalPrice: cart.reduce((sum, item) => sum + Number(item.price), 0),
//       cateringId: cateringPackage.id
//     };

//     const result = await createBooking(formData, cart);
//     if (result.success) alert("កក់បានជោគជ័យ! លេខកក់៖ " + result.bookingId);
//   };

//   return (
//     <div className="p-4 border rounded-xl shadow-sm bg-white">
//       <h2 className="text-xl font-bold mb-4">{cateringPackage.event_name}</h2>
//       {/* បង្ហាញម្ហូប */}
//       <button 
//         onClick={handleBooking}
//         className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//       >
//         បញ្ជាក់ការកក់ (Confirm Booking)
//       </button>
//     </div>
//   );
// }