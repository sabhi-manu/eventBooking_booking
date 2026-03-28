import React, { useContext, useEffect, useState } from "react";
import axiosInstanc from "../utils/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const categories = ["All", "Music", "Tech", "Sports", "Business"];

const Home = () => {
  const {user} = useContext(AuthContext)
  console.log("user in home ++>",user)
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
   

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await axiosInstanc.get("/event");
        setEvents(data.events);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, []);

  // 🔍 Filter logic
  const filteredEvents = events.filter((e) => {
    const matchSearch = e.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "All" || e.category === activeCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-gray-100 min-h-screen">

   
      <div className="bg-linear-to-r from-black to-gray-800 text-white py-20 text-center px-4">
        <h1 className="text-5xl font-bold mb-4">
          Discover & Book Amazing Events 
        </h1>
        <p className="text-gray-300 mb-6">
          Find concerts, workshops, meetups and more
        </p>

        <input
          type="text"
          placeholder="Search events..."
          className="w-full max-w-xl mx-auto p-3 rounded-lg text-white  border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🎯 CATEGORY FILTER */}
      <div className="flex gap-3 overflow-x-auto px-6 py-4 bg-white shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 rounded-full whitespace-nowrap ${
              activeCategory === cat
                ? "bg-yellow-400 text-black"
                : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

     
      <div className="px-6 mt-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">⭐ Featured Events</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {events.slice(0, 2).map((e) => (
            <div
              key={e._id}
              className="relative rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={e.image}
                alt={e.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4 text-white">
                <h3 className="text-xl font-bold">{e.title}</h3>
                <p className="text-sm">{e.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📦 ALL EVENTS */}
      <div className="px-6 mt-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">All Events</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.map((e) => (
              <div
                key={e._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={e.image}
                  alt={e.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold">{e.title}</h3>

                  <p className="text-sm text-gray-600">
                    📍 {e.location}
                  </p>

                  <p className="text-sm text-gray-500">
                    📅 {new Date(e.date).toDateString()}
                  </p>

                  <p className="text-yellow-500 font-semibold mt-2">
                    ₹{e.ticketPrice || "Free"}
                  </p>

                  <Link
                    to={`/event/${e._id}`}
                    className="block mt-3 text-center bg-yellow-400 hover:bg-yellow-500 py-2 rounded-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    
    
    </div>
  );
};

export default Home;