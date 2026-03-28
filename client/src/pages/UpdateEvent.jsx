import React, { useState } from 'react'
import axiosInstanc from '../utils/axios'
import { useParams } from 'react-router-dom'

const UpdateEvent = () => {
  const { id } = useParams()

  const [data, setData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeat: "",
    availableSeat: "",
    ticketPrice: "",
  })

  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const inputHandler = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const imageInputHandler = (e) => {
    setImageFile(e.target.files[0])
  }

  // ✅ Update event details (NO FormData needed here)
  const detailsSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axiosInstanc.patch(`/event/${id}`, data)
      console.log("update details ==>", res.data)
    } catch (error) {
      console.log("error updating details ==>", error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Update only image (FormData required)
  const imageSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("image", imageFile)

      const res = await axiosInstanc.patch(`/event/image/${id}`, formData)
      console.log("image updated ==>", res.data)
    } catch (error) {
      console.log("error updating image ==>", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl space-y-8">

        <h2 className="text-2xl font-bold text-center">Update Event ✏️</h2>

        {/* 🔹 Update Details Form */}
        <form onSubmit={detailsSubmitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="title" value={data.title} onChange={inputHandler} placeholder="Title" className="border px-4 py-2 rounded-lg" />
          <input name="category" value={data.category} onChange={inputHandler} placeholder="Category" className="border px-4 py-2 rounded-lg" />

          <input type="date" name="date" value={data.date} onChange={inputHandler} className="border px-4 py-2 rounded-lg" />
          <input name="location" value={data.location} onChange={inputHandler} placeholder="Location" className="border px-4 py-2 rounded-lg" />

          <input type="number" name="totalSeat" value={data.totalSeat} onChange={inputHandler} placeholder="Total Seat" className="border px-4 py-2 rounded-lg" />
          <input type="number" name="availableSeat" value={data.availableSeat} onChange={inputHandler} placeholder="Available Seat" className="border px-4 py-2 rounded-lg" />

          <input type="number" name="ticketPrice" value={data.ticketPrice} onChange={inputHandler} placeholder="Ticket Price" className="border px-4 py-2 rounded-lg" />

          <textarea name="description" value={data.description} onChange={inputHandler} placeholder="Description" className="md:col-span-2 border px-4 py-2 rounded-lg h-28" />

          <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            {loading ? "Updating..." : "Update Details"}
          </button>
        </form>

        {/* 🔹 Update Image */}
        <form onSubmit={imageSubmitHandler} className="space-y-4">
          <h3 className="text-lg font-semibold">Update Image</h3>

          <input type="file" onChange={imageInputHandler} className="border px-4 py-2 rounded-lg w-full" />

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            {loading ? "Uploading..." : "Update Image"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default UpdateEvent
