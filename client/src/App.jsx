import { Route, Routes } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EventDetails from "./pages/EventDetails"



const App = () => {
  return (
    <div>
      
     <NavBar/>

     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Register/>} />
      <Route path="/event/:id" element={<EventDetails/>} />
     </Routes>
<Footer/>
    </div>
  )
}

export default App