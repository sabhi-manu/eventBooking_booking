import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstanc from "../utils/axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const {login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async(e) => {
    e.preventDefault();
    setLoading(true);

   try {
   let resp =  await login(data)
   console.log("response in login file ==>",resp)
    if(resp?.data?.success){
      navigate("/")
    }
   } catch (error) {
    console.log("error in login user.",error)
   }finally{
    setLoading(false)
   }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Welcome Back 
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please login to your account
        </p>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="abc@gmail.com"
              value={data.email}
              onChange={inputHandler}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={data.password}
              onChange={inputHandler}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">
           <Link to="/signup"> Sign up</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
