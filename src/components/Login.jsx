import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import GlassPanel from "./ui/GlassPanel";

const Login = () => {
  const [email, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoggin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const result = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(result.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Failed to login. Please check credentials.");
    }
  };

  const handleSignUp = async () => {
    try {
      setError("");
      const res = await axios.post(
        BASE_URL + "/signUp",
        { firstName, lastName, email, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-8 animate-float-in">
      <GlassPanel className="w-full max-w-md p-6 sm:p-8 hover:translate-y-0" hover={false}>
        <div className="flex flex-col items-center text-center mb-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 text-3xl shadow-lg shadow-cyan-500/20 mb-4 animate-pulse">
            ⚡
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isLoggin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isLoggin
              ? "Sign in to connect with skilled developers nearby"
              : "Join a curated space for tech collaborations"}
          </p>
        </div>

        <div className="space-y-4">
          {!isLoggin && (
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-slate-300 uppercase tracking-wider">First Name</span>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-slate-300 uppercase tracking-wider">Last Name</span>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-300 uppercase tracking-wider">Email Address</span>
            <div className="relative">
              <input
                type="email"
                placeholder="dev@tinder.com"
                value={email}
                onChange={(e) => setEmailId(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-300 uppercase tracking-wider">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
              onKeyDown={(e) => e.key === "Enter" && (isLoggin ? handleLogin() : handleSignUp())}
            />
          </label>

          {error && (
            <p className="text-xs text-rose-300 text-center font-medium bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:opacity-95 hover:shadow-cyan-500/20 active:scale-[0.99]"
            onClick={isLoggin ? handleLogin : handleSignUp}
          >
            {isLoggin ? "Sign In" : "Sign Up"}
          </button>

          <p className="text-center text-sm text-slate-400 mt-4">
            {isLoggin ? "New to DevTinder?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setError("");
                setIsLogin((prev) => !prev);
              }}
              className="font-semibold text-cyan-400 hover:text-cyan-300 underline transition duration-200"
            >
              {isLoggin ? "Sign Up Here" : "Login Here"}
            </button>
          </p>
        </div>
      </GlassPanel>
    </div>
  );
};

export default Login;
