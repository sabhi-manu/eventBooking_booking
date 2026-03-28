import { createContext, useEffect, useState } from "react";
import axiosInstanc from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const register = async (data) => {
    try {
      let { data } = await axiosInstanc.post("/user/register", data);
      return data;
    } catch (error) {
      console.log("error during registration:==>", error);
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const login = async (data) => {
    console.log("user login data in auth context ==>",data)
    try {
      let response= await axiosInstanc.post("/user/login", data);
      setUser(response.data.user);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      console.log("respnse of login user ==>",response)
      return response;
    } catch (error) {
      console.log("error during login:==>", error);
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  const verifyOtp = async (data) => {
    try {
      let response = await axiosInstanc.post("/user/verify-otp", data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log("error during OTP verification:==>", error);
      throw error.response?.data?.message || "OTP verification failed";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, verifyOtp, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
