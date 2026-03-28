import React, { useState } from 'react'
import axiosInstanc from '../utils/axios'

const EventCreate = () => {
  const [data, setData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeat: "",
    availableSeat: "",
    ticketPrice: "",
    image: null
  })

  const [loading, setLoading] = useState(false)

  const inputHandler = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const fileHandler = (e) => {
    setData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })

      const res = await axiosInstanc.post('/event', formData
      )
console.log("event response ==>",res)
      if (res.data.success) {
        setData({
          title: "",
          description: "",
          date: "",
          location: "",
          category: "",
          totalSeat: "",
          availableSeat: "",
          ticketPrice: "",
          image: null
        })
      }
      
    } catch (error) {
      console.log('error in creating event ==>', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Event 🎉</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={data.title}
            onChange={inputHandler}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={data.category}
            onChange={inputHandler}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="date"
            name="date"
            value={data.date}
            onChange={inputHandler}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={data.location}
            onChange={inputHandler}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            name="totalSeat"
            placeholder="Total Seats"
            value={data.totalSeat}
            onChange={inputHandler}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            name="availableSeat"
            placeholder="Available Seats"
            value={data.availableSeat}
            onChange={inputHandler}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            name="ticketPrice"
            placeholder="Ticket Price"
            value={data.ticketPrice}
            onChange={inputHandler}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="file"
            name="image"
            onChange={fileHandler}
            required
            className="border px-4 py-2 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={data.description}
            onChange={inputHandler}
            required
            className="md:col-span-2 border px-4 py-2 rounded-lg h-28"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default EventCreate
