import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstanc from "../utils/axios";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
console.log("id for event ==>",id)
  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await axiosInstanc.get(`/event/${id}`);
        setEvent(data.event);
      } catch (error) {
        console.log("error in fetching event.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
      
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-72 object-cover"
        />

       
        <div className="p-6 space-y-4">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">
            {event.title}
          </h1>

         
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>📅 {new Date(event.date).toDateString()}</span>
            <span>📍 {event.location}</span>
            <span>🏷 {event.category}</span>
          </div>

     
          <p className="text-gray-700 leading-relaxed">
            {event.description}
          </p>

          <div className="flex justify-between items-center flex-wrap gap-4 mt-4">
            <div>
              <p className="text-gray-600">
                Available Seats: {event.availableSeat} / {event.totalSeat}
              </p>
              <p className="text-lg font-semibold text-green-600">
                ₹{event.ticketPrice}
              </p>
            </div>

           
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Book Now
            </button>
          </div>

          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500">Organized by</p>
            <p className="font-medium text-gray-800">
              {event.createdBy?.userName}
            </p>
            <p className="text-sm text-gray-500">
              {event.createdBy?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;