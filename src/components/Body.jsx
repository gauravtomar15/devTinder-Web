import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();

  const isChatPage = location.pathname.startsWith("/chat");

  const fetchData = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 400) {
        navigate("/login");
      }
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={`flex flex-col bg-transparent ${isChatPage ? "h-screen max-h-screen overflow-hidden" : "min-h-screen"}`}>
      <Navbar />
      <main className={`flex-1 overflow-hidden ${isChatPage ? "p-0" : "px-2 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8"}`}>
        <div className={`h-full ${isChatPage ? "w-full max-w-none" : "mx-auto max-w-7xl"}`}>
          <Outlet />
        </div>
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
};

export default Body;
