import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstanc from "../utils/axios";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        axiosInstanc.get("/event"),
        axiosInstanc.get("/booking"),
      ]);
    
      setEvents(eventsRes.data.events );
      setBookings(bookingsRes.data.booking );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/event/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      await api.patch(`/booking/${id}/confirm`, { paymentStatus: "paid" });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "confirmed" } : b
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.patch(`/booking/${id}`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const revenue = bookings.reduce((sum, b) =>
    b.paymentStatus === "paid" && b.status === "confirmed"
      ? sum + b.amount
      : sum,
  0);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-3">
          {["dashboard",  "bookings"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer capitalize px-3 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="Total Events" value={events.length} />
            <Card title="Total Bookings" value={bookings.length} />
            <Card title="Revenue" value={`₹${revenue}`} />
          </div>
        )}

        {/* Events */}
        {activeTab === "dashboard" && (
          <div>
           <div className="flex justify-between mt-3 mb-4">
             <h2 className="text-2xl font-bold ">Events</h2>
             <button className="text-xl font-bold   rounded-2xl px-2 py-1 bg-green-400 hover:bg-green-500 hover:text-white"  onClick={()=>navigate("/create-event")} >
              
              Create Event
              </button>
           </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <div
                  key={e._id}
                  className="bg-white p-4 rounded-xl shadow"
                >
                  <img
                    src={e.image}
                    alt=""
                    className="h-40 w-full object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold">{e.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(e.date).toDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {e.availableSeat}/{e.totalSeat} seats
                  </p>

                  <button
                    onClick={() => handleDeleteEvent(e._id)}
                    className="mt-3 w-full bg-red-500 text-white py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate("/update-event")}
                    className="mt-3 w-full bg-green-500 text-white py-1 rounded"
                  >
                    Update Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Bookings</h2>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white p-4 rounded-xl shadow"
                >
                  <div className="flex justify-between">
                    <h3 className="font-bold">
                      {b.eventId?.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : b.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {b.userId?.userName} ({b.userId?.email})
                  </p>
                  <p className="text-sm">₹{b.amount}</p>

                  {b.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleConfirmBooking(b._id)}
                        className="flex-1 bg-green-600 text-white py-1 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="flex-1 bg-red-500 text-white py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}
