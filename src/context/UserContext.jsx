import { server } from "@/main";
import Cookies from "js-cookie";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });

      toast.success(data.message);

      localStorage.setItem("email", email);
      navigate("/verify");
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }
  async function verifyUser(otp, navigate, fetchCart) {
    setBtnLoading(true);
    const email = localStorage.getItem("email");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        email,
        otp,
      });

      toast.success(data.message);

      localStorage.clear();
      navigate("/");
      setBtnLoading(false);
      setIsAuth(true);
      setUser(data.user);

      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setIsAuth(false);
      setLoading(false);
    }
  }

  function logoutUser(navigate, setTotalItem) {
    Cookies.set("token", null);
    setUser(null);
    setIsAuth(false);
    navigate("/login");
    toast.success("Logged Out");
    setTotalItem(0);
  }
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        isAuth,
        loginUser,
        verifyUser,
        logoutUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
