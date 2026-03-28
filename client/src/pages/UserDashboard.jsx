import React, { useEffect, useState } from "react";
import axiosInstanc from "../utils/axios";

const UserDashboard = () => {
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await axiosInstanc.get("/booking");
        setBooking(data.booking);
      } catch (error) {
        console.log("error in fetching booking.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  if (!booking || booking.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          My Bookings 🎟️
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booking.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Event Image */}
              <img
                src={item.eventId?.image}
                alt={item.eventId?.title}
                className="w-full h-40 object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.eventId?.title}
                </h2>

                <p className="text-sm text-gray-500">
                  📅 {new Date(item.eventId?.date).toDateString()}
                </p>

                <p className="text-sm text-gray-500">
                  📍 {item.eventId?.location}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-600 font-semibold">
                    ₹{item.amount}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  Payment: {item.paymentStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
