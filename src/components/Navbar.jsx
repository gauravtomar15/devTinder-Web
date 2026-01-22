import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4 md:px-6">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-base sm:text-lg md:text-xl">
          🔥 DevTinder
        </Link>
      </div>
      {user && (
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden sm:inline text-xs sm:text-sm md:text-base ">
            Welcome, {user.firstName}
            
          </span>
          {user?.isPremium && <div>
              <img
              className="h-5 w-5 rounded-2xl"
              src="https://media.istockphoto.com/id/1344841941/vector/blue-verified-account-icon-approved-profile-sign-tick-in-rounded-corners-star-top-page-logo.jpg?s=612x612&w=0&k=20&c=Ys81LaNf8DkzKVvB03y0hDQBkkkP5jrRK9lX4htlfRk="
              alt=""
            />
            </div>}
          <div className="dropdown dropdown-end mx-2 sm:mx-4 md:mx-6">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full">
                <img
                  alt="User avatar"
                  src={user.photoUrl}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-48 sm:w-52 p-2 shadow"
            >
              <li>
                <Link
                  to="/profile"
                  className="justify-between text-sm sm:text-base"
                >
                  Profile
                  <span className="badge badge-sm">New</span>
                </Link>
              </li>
              <li>
                <Link to={"/connections"} className="text-sm sm:text-base">
                  Connections
                </Link>
              </li>
              <li>
                <Link to={"/requests"} className="text-sm sm:text-base">
                  Requests
                </Link>
              </li>
              <li>
                <Link to={"/payment/create"} className="text-sm sm:text-base">
                  Premium
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="text-sm sm:text-base"
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
