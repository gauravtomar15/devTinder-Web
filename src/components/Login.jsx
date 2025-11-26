import React, { useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {

  const [email, setEmailId] = useState("gaurav@gmail.com");
  const [password, setPassword] = useState("Gaurav@123");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error,setError] = useState("");


  const handleClick = async ()=>{
   try {
    console.log("clicked")
      const result = await axios.post(BASE_URL+"/login", {
      email,
      password
    }, {
      withCredentials: true
    })
    dispatch(addUser(result.data));
    navigate("/feed")
   } catch (err) {
    setError(err?.response?.data);
   }
  }
  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm ">
        <div className="card-body items-center gap-10">
          <h2 className="card-title ">Login</h2>
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              type="text"
              required
              placeholder="Email ID"
              value={email}
              onChange={(e)=> setEmailId(e.target.value)}
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              title="Only letters, numbers or dash"
            />
          </label>
        
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
          
          </label>
            <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary " onClick={handleClick}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
