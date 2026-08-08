import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, getProfileImageUrl } from "../utils/constants";
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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 px-3 py-3 backdrop-blur-xl sm:px-4 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3 rounded-full border border-cyan-400/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20 sm:px-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 text-lg shadow-lg shadow-cyan-500/20">
            ⚡
          </span>
          <span className="hidden sm:inline">DevTinder</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-200 transition hover:bg-white/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 1-7.714 0A2.5 2.5 0 0 0 4.7 19.5h14.6a2.5 2.5 0 0 0-2.443-2.418ZM12 3a4 4 0 0 1 4 4v1.5A4 4 0 0 1 12 12.5 4 4 0 0 1 8 8.5V7a4 4 0 0 1 4-4Z" />
              </svg>
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </button>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 sm:flex">
              <span className="text-sm font-medium text-slate-100">Hi, {user.firstName}</span>
              {user?.isPremium && (
                <img
                  className="h-5 w-5 rounded-full"
                  src="https://www.citypng.com/public/uploads/preview/blue-instagram-account-verified-check-mark-icon-701751695136711q4jgagbecy.png"
                  alt="premium"
                />
              )}
            </div>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-br from-cyan-400/80 to-violet-500/80 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="h-full w-full overflow-hidden rounded-full border border-white/20">
                  <img alt="User avatar" src={getProfileImageUrl(user.photoUrl)} className="h-full w-full object-cover" />
                </div>
              </div>
              <ul tabIndex="-1" className="menu menu-sm dropdown-content mt-3 w-56 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                <li>
                  <Link to="/profile" className="justify-between rounded-xl text-sm">
                    Profile
                    <span className="badge badge-sm badge-info">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="rounded-xl text-sm">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="rounded-xl text-sm">
                    Requests
                  </Link>
                </li>
                <li>
                  <Link to="/payment/create" className="rounded-xl text-sm">
                    Premium
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={handleLogout} className="rounded-xl text-sm text-rose-300">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
