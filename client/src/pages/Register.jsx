import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstanc from "../utils/axios";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpVerify, setOtpVerify] = useState(true);
  const [otp, setOtp] = useState("");

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 STEP 1 → Register + Send OTP
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstanc.post("/user/register", data);

      if (response.data.success) {
        setOtpVerify(true); // 👈 switch UI to OTP
      }
    } catch (err) {
      console.log("Register error:", err);
    }

    setLoading(false);
  };

  // 🔹 STEP 2 → Verify OTP (same page)
  const otpVerifyHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstanc.post("/user/verify-otp", {
        email: data.email,
        otp,
      });

      if (response.data.success) {
        navigate("/");
      }
    } catch (err) {
      console.log("OTP verification error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Welcome to Eventora 🎉
        </h2>

        {/* 🔹 REGISTER FORM */}
        {!otpVerify && (
          <>
            <p className="text-center text-gray-500 mb-6">
              Create your account to get started
            </p>

            <form onSubmit={submitHandler} className="space-y-5">
              <input
                type="text"
                name="userName"
                placeholder="Username"
                value={data.userName}
                onChange={inputHandler}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={data.email}
                onChange={inputHandler}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={inputHandler}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Sign Up"}
              </button>
            </form>
          </>
        )}

        {/* 🔹 OTP VERIFY UI */}
        {otpVerify && (
          <>
            <p className="text-center text-gray-500 mb-6">
              Enter OTP sent to {data.email}
            </p>

            <form onSubmit={otpVerifyHandler} className="space-y-5">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg text-center text-lg tracking-widest focus:ring-2 focus:ring-green-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="text-center text-sm mt-4 text-gray-500">
              Didn’t receive OTP?{' '}
              <span className="text-blue-600 cursor-pointer hover:underline" onClick={()=>setOtpVerify(!otpVerify)} >
                Resend
              </span>
            </p>
          </>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}