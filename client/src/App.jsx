import { Route, Routes } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EventDetails from "./pages/EventDetails"
import UserDashboard from "./pages/UserDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import EventCreate from "./pages/EventCreate"
import UpdateEvent from "./pages/UpdateEvent"



const App = () => {
  return (
    <div>
      
     <NavBar/>

     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Register/>} />
      <Route path="/event/:id" element={<EventDetails/>} />
      <Route path="/dashboard" element={<UserDashboard/>} />
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="/create-event" element={<EventCreate/>} />
      <Route path="/update-event" element={<UpdateEvent/>} />

     </Routes>
<Footer/>
    </div>
  )
}

export default App